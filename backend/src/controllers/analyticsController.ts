import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Transaction from '../models/Transaction';
import mongoose from 'mongoose';

// @desc    Get summary KPIs (Current Balance, Monthly Income, Monthly Expense, Savings Rate)
// @route   GET /api/v1/analytics/summary
// @access  Private
export const getSummary = asyncHandler(async (req: any, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const results = await Transaction.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0] }
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0] }
        },
        currentMonthIncome: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$type', 'INCOME'] }, { $gte: ['$date', currentMonthStart] }] },
              '$amount',
              0
            ]
          }
        },
        currentMonthExpense: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$type', 'EXPENSE'] }, { $gte: ['$date', currentMonthStart] }] },
              '$amount',
              0
            ]
          }
        }
      }
    }
  ]);

  if (results.length === 0) {
    res.json({ currentBalance: 0, monthlyIncome: 0, monthlyExpense: 0, savingsRate: 0 });
    return;
  }

  const data = results[0];
  const currentBalance = data.totalIncome - data.totalExpense;
  const savingsRate = data.currentMonthIncome > 0 
    ? ((data.currentMonthIncome - data.currentMonthExpense) / data.currentMonthIncome) * 100 
    : 0;

  res.json({
    currentBalance,
    monthlyIncome: data.currentMonthIncome,
    monthlyExpense: data.currentMonthExpense,
    savingsRate: Number(savingsRate.toFixed(1))
  });
});

// @desc    Get expenses by category
// @route   GET /api/v1/analytics/category-breakdown
// @access  Private
export const getCategoryBreakdown = asyncHandler(async (req: any, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  
  const results = await Transaction.aggregate([
    { $match: { userId, type: 'EXPENSE' } },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' }
      }
    },
    { $sort: { total: -1 } }
  ]);

  res.json(results.map(r => ({ category: r._id, amount: r.total })));
});

// @desc    Get monthly spending trend (last 6 months)
// @route   GET /api/v1/analytics/monthly-trend
// @access  Private
export const getMonthlyTrend = asyncHandler(async (req: any, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const results = await Transaction.aggregate([
    { $match: { userId, date: { $gte: sixMonthsAgo } } },
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
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const formatted = results.map(r => ({
    month: `${monthNames[r._id.month - 1]} ${r._id.year.toString().slice(2)}`,
    income: r.income,
    expense: r.expense
  }));

  res.json(formatted);
});

// @desc    Get rule-based insights
// @route   GET /api/v1/analytics/insights
// @access  Private
export const getInsights = asyncHandler(async (req: any, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Need stats to build rules
  const [catBreakdown, basicStats] = await Promise.all([
    Transaction.aggregate([
      { $match: { userId, type: 'EXPENSE', date: { $gte: currentMonthStart } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]),
    Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          currentMonthExpense: {
            $sum: { $cond: [{ $and: [{ $eq: ['$type', 'EXPENSE'] }, { $gte: ['$date', currentMonthStart] }] }, '$amount', 0] }
          },
          lastMonthExpense: {
            $sum: { $cond: [{ $and: [{ $eq: ['$type', 'EXPENSE'] }, { $gte: ['$date', lastMonthStart] }, { $lt: ['$date', currentMonthStart] }] }, '$amount', 0] }
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] }
          }
        }
      }
    ])
  ]);

  const insights: string[] = [];
  
  if (catBreakdown.length > 0) {
    insights.push(`Your highest spending category this month is ${catBreakdown[0]._id}.`);
  }

  if (basicStats.length > 0) {
    const stats = basicStats[0];
    if (stats.currentMonthExpense > stats.lastMonthExpense && stats.lastMonthExpense > 0) {
      insights.push('Your spending has increased compared to last month.');
    } else if (stats.currentMonthExpense < stats.lastMonthExpense) {
      insights.push('Great job! Your spending is lower than last month.');
    }

    if (stats.pendingCount > 0) {
      insights.push(`You have ${stats.pendingCount} pending transaction${stats.pendingCount > 1 ? 's' : ''}.`);
    }
  }

  if (insights.length === 0) {
    insights.push('Not enough data to generate insights yet. Keep tracking!');
  }

  res.json(insights);
});
