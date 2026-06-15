import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import Transaction from '../models/Transaction';
import generateToken from '../utils/generateToken';

// Helper to get random date in last N days
const getRandomDate = (daysBack: number) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date;
};

// @desc    Demo Login & Seed Data
// @route   POST /api/v1/auth/demo
// @access  Public
export const demoLogin = asyncHandler(async (req: Request, res: Response) => {
  const demoEmail = 'demo@expenseflow.com';
  let user = await User.findOne({ email: demoEmail });

  if (!user) {
    user = await User.create({
      firstName: 'Demo',
      lastName: 'User',
      email: demoEmail,
      passwordHash: 'Demo@123',
      currency: 'USD',
      isDemo: true
    });
  }

  // Clear previous demo data
  await Transaction.deleteMany({ userId: user._id });

  // Seed realistic data across 90 days (3 months)
  const transactions: any[] = [];
  
  // Income (Salary / Freelance)
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    d.setDate(1); // 1st of every month
    transactions.push({ userId: user._id, amount: 5000, type: 'INCOME', category: 'Salary', title: 'Tech Corp Salary', notes: 'Monthly payroll', currency: user.currency, date: new Date(d) });
    
    // Random freelance gig
    if (Math.random() > 0.5) {
      d.setDate(15);
      transactions.push({ userId: user._id, amount: 800, type: 'INCOME', category: 'Freelance', title: 'Upwork Project', notes: 'Logo design', currency: user.currency, date: new Date(d) });
    }
  }

  // Expenses
  const expenseTemplates = [
    { category: 'Food', desc: ['Whole Foods', 'Uber Eats', 'Starbucks', 'Sweetgreen', 'Local Grocery'] },
    { category: 'Transport', desc: ['Uber', 'Lyft', 'Gas Station', 'Subway Pass'] },
    { category: 'Shopping', desc: ['Amazon', 'Apple Store', 'Nike', 'Target'] },
    { category: 'Entertainment', desc: ['Netflix', 'Spotify', 'AMC Theaters', 'Steam'] },
    { category: 'Bills', desc: ['Electric Bill', 'Internet', 'Water', 'Phone Bill'] },
    { category: 'Health', desc: ['Pharmacy', 'Gym Membership', 'Dentist'] }
  ];

  // Generate ~25 random expenses
  for (let i = 0; i < 25; i++) {
    const template = expenseTemplates[Math.floor(Math.random() * expenseTemplates.length)];
    const desc = template.desc[Math.floor(Math.random() * template.desc.length)];
    const amount = Math.floor(Math.random() * 150) + 10; // $10 - $160
    
    transactions.push({
      userId: user._id,
      amount: amount,
      type: 'EXPENSE',
      status: Math.random() > 0.8 ? 'PENDING' : 'COMPLETED',
      category: template.category,
      title: desc,
      notes: 'Demo expense tracking',
      currency: user.currency,
      date: getRandomDate(90) // anytime in last 90 days
    });
  }

  // Sort transactions by date descending to make it realistic
  transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

  await Transaction.insertMany(transactions);

  res.json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    currency: user.currency,
    token: generateToken(user._id.toString()),
    message: 'Demo dataset loaded successfully with 3 months of data'
  });
});
