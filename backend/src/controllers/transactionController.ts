import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Transaction from '../models/Transaction';

// @desc    Get all transactions for user
// @route   GET /api/v1/transactions
// @access  Private
export const getTransactions = asyncHandler(async (req: any, res: Response) => {
  const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
  res.json(transactions);
});

// @desc    Create new transaction
// @route   POST /api/v1/transactions
// @access  Private
export const createTransaction = asyncHandler(async (req: any, res: Response) => {
  const { amount, type, status, category, date, title, notes, currency } = req.body;

  const transaction = await Transaction.create({
    userId: req.user._id,
    amount,
    type,
    status,
    category,
    date,
    title,
    notes,
    currency: currency || req.user.currency || 'USD'
  });

  res.status(201).json(transaction);
});

// @desc    Update transaction
// @route   PUT /api/v1/transactions/:id
// @access  Private
export const updateTransaction = asyncHandler(async (req: any, res: Response) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  // Make sure user owns transaction
  if (transaction.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedTransaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedTransaction);
});

// @desc    Delete transaction
// @route   DELETE /api/v1/transactions/:id
// @access  Private
export const deleteTransaction = asyncHandler(async (req: any, res: Response) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  if (transaction.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await transaction.deleteOne();
  res.json({ message: 'Transaction removed' });
});
