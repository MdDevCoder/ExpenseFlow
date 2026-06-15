import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction';
import Budget from '../models/Budget';

// @desc    Get report data based on date range
// @route   GET /api/v1/reports
// @access  Private
export const getReportData = asyncHandler(async (req: any, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(new Date().getFullYear(), 0, 1);
  const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

  // Match conditions for the given date range
  const dateMatch = { 
    userId,
    date: { $gte: startDate, $lte: endDate }
  };

  // 1. Summary Metrics, Category Breakdown & Monthly Trend (Parallel Aggregations on Transactions)
  const [summaryData, categoryData, monthlyTrendRaw, transactions] = await Promise.all([
    Transaction.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0] }
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0] }
          }
        }
      }
    ]),
    Transaction.aggregate([
      { $match: { ...dateMatch, type: 'EXPENSE' } },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { amount: -1 } },
      { $project: { category: '$_id', amount: 1, _id: 0 } }
    ]),
    Transaction.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          income: { $sum: { $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0] } },
          expense: { $sum: { $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]),
    Transaction.find(dateMatch).sort({ date: -1 })
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyTrend = monthlyTrendRaw.map(t => ({
    month: monthNames[t._id.month - 1],
    income: t.income,
    expense: t.expense
  }));

  const summary = summaryData[0] || { totalIncome: 0, totalExpense: 0 };
  const savings = summary.totalIncome - summary.totalExpense;

  // 2. Budget Health for the time period (Aggregate Budgets)
  // This computes how much of the active budgets have been consumed during this date range
  const budgetSummaryRaw = await Budget.aggregate([
    { $match: { userId, status: 'ACTIVE' } },
    {
      $lookup: {
        from: 'transactions',
        let: { bCat: '$category' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', userId] },
                  { $eq: ['$category', '$$bCat'] },
                  { $eq: ['$type', 'EXPENSE'] },
                  { $eq: ['$status', 'COMPLETED'] },
                  { $gte: ['$date', startDate] },
                  { $lte: ['$date', endDate] }
                ]
              }
            }
          },
          { $group: { _id: null, spent: { $sum: '$amount' } } }
        ],
        as: 'spentData'
      }
    },
    {
      $project: {
        category: 1,
        amount: 1,
        spentAmount: { $ifNull: [{ $arrayElemAt: ['$spentData.spent', 0] }, 0] }
      }
    }
  ]);

  let totalBudget = 0;
  let totalBudgetSpent = 0;
  budgetSummaryRaw.forEach(b => {
    totalBudget += b.amount;
    totalBudgetSpent += b.spentAmount;
  });

  const budgetHealth = totalBudget > 0 ? (totalBudgetSpent / totalBudget) * 100 : 0;

  const budgetSummary = {
    totalBudget,
    totalBudgetSpent,
    budgetHealth
  };

  res.json({
    summary: {
      totalIncome: summary.totalIncome,
      totalExpense: summary.totalExpense,
      savings
    },
    categoryBreakdown: categoryData,
    monthlyTrend,
    budgetSummary,
    transactions
  });
});
