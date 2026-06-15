import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Budget from '../models/Budget';

// @desc    Get user budgets with progress
// @route   GET /api/v1/budgets
// @access  Private
export const getBudgets = asyncHandler(async (req: any, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  
  const budgets = await Budget.aggregate([
    { $match: { userId, status: 'ACTIVE' } },
    {
      $lookup: {
        from: 'transactions',
        let: { 
          bUserId: '$userId', 
          bCat: '$category', 
          bStart: '$startDate', 
          bEnd: '$endDate' 
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$bUserId'] },
                  { $eq: ['$category', '$$bCat'] },
                  { $eq: ['$type', 'EXPENSE'] },
                  { $eq: ['$status', 'COMPLETED'] },
                  { $gte: ['$date', '$$bStart'] },
                  { $lte: ['$date', '$$bEnd'] }
                ]
              }
            }
          },
          { $group: { _id: null, totalSpent: { $sum: '$amount' } } }
        ],
        as: 'spentData'
      }
    },
    {
      $addFields: {
        spentAmount: {
          $ifNull: [{ $arrayElemAt: ['$spentData.totalSpent', 0] }, 0]
        }
      }
    },
    {
      $addFields: {
        remainingAmount: { $subtract: ['$amount', '$spentAmount'] },
        percentageUsed: {
          $cond: [
            { $eq: ['$amount', 0] },
            0,
            { $multiply: [{ $divide: ['$spentAmount', '$amount'] }, 100] }
          ]
        }
      }
    },
    {
      $project: {
        spentData: 0
      }
    }
  ]);

  // Convert _id to id for frontend consistency
  const formattedBudgets = budgets.map(b => ({
    id: b._id,
    ...b,
    _id: undefined
  }));

  res.json(formattedBudgets);
});

// @desc    Create a budget
// @route   POST /api/v1/budgets
// @access  Private
export const createBudget = asyncHandler(async (req: any, res: Response) => {
  const { category, amount, period, startDate, endDate } = req.body;

  // Check if active budget already exists for this category
  const existing = await Budget.findOne({
    userId: req.user._id,
    category,
    status: 'ACTIVE'
  });

  if (existing) {
    res.status(400);
    throw new Error(`An active budget for ${category} already exists. Please edit or archive it.`);
  }

  const budget = await Budget.create({
    userId: req.user._id,
    category,
    amount,
    period,
    startDate,
    endDate,
    status: 'ACTIVE'
  });

  res.status(201).json(budget);
});

// @desc    Update a budget
// @route   PUT /api/v1/budgets/:id
// @access  Private
export const updateBudget = asyncHandler(async (req: any, res: Response) => {
  const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });

  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }

  const { amount, period, startDate, endDate, status } = req.body;

  if (amount !== undefined) budget.amount = amount;
  if (period !== undefined) budget.period = period;
  if (startDate !== undefined) budget.startDate = startDate;
  if (endDate !== undefined) budget.endDate = endDate;
  if (status !== undefined) budget.status = status;

  const updatedBudget = await budget.save();
  res.json(updatedBudget);
});

// @desc    Delete (archive) a budget
// @route   DELETE /api/v1/budgets/:id
// @access  Private
export const deleteBudget = asyncHandler(async (req: any, res: Response) => {
  const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });

  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }

  // Soft delete: Archive instead of hard delete
  budget.status = 'ARCHIVED';
  await budget.save();
  
  res.json({ message: 'Budget archived successfully' });
});
