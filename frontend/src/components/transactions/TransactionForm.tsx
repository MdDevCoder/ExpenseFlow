import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Transaction } from '../../types/transaction';

const DEFAULT_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Health',
  'Bills',
  'Entertainment',
  'Education',
  'Salary',
  'Freelance',
  'Other'
];

const transactionSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(50, 'Title is too long'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  type: z.enum(['INCOME', 'EXPENSE']),
  status: z.enum(['COMPLETED', 'PENDING']),
  category: z.string().min(1, 'Please select a category'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  notes: z.string().max(200, 'Notes too long').optional(),
  currency: z.string().min(3, 'Currency code required').max(3)
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

interface Props {
  initialData?: Transaction;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const TransactionForm: React.FC<Props> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      title: '',
      amount: 0,
      type: 'EXPENSE',
      status: 'COMPLETED',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      currency: 'USD'
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        amount: initialData.amount,
        type: initialData.type,
        status: initialData.status,
        category: initialData.category,
        date: new Date(initialData.date).toISOString().split('T')[0],
        notes: initialData.notes || '',
        currency: initialData.currency
      });
    } else {
      reset({
        title: '',
        amount: 0,
        type: 'EXPENSE',
        status: 'COMPLETED',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        currency: 'USD'
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
        <Input {...register('title')} placeholder="e.g. Netflix Subscription" />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>

      {/* Amount & Currency */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
          <Input type="number" step="0.01" {...register('amount')} placeholder="0.00" />
          {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
          <select
            {...register('currency')}
            className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
          >
            <option value="USD" className="dark:bg-gray-800">USD</option>
            <option value="EUR" className="dark:bg-gray-800">EUR</option>
            <option value="GBP" className="dark:bg-gray-800">GBP</option>
            <option value="INR" className="dark:bg-gray-800">INR</option>
          </select>
          {errors.currency && <p className="mt-1 text-sm text-red-500">{errors.currency.message}</p>}
        </div>
      </div>

      {/* Type & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
          <select
            {...register('type')}
            className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            <option value="EXPENSE" className="dark:bg-gray-800">Expense</option>
            <option value="INCOME" className="dark:bg-gray-800">Income</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            {...register('status')}
            className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            <option value="COMPLETED" className="dark:bg-gray-800">Completed</option>
            <option value="PENDING" className="dark:bg-gray-800">Pending</option>
          </select>
        </div>
      </div>

      {/* Category & Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select
            {...register('category')}
            className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            {DEFAULT_CATEGORIES.map(c => (
              <option key={c} value={c} className="dark:bg-gray-800">{c}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
          <Input type="date" {...register('date')} />
          {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (Optional)</label>
        <textarea
          {...register('notes')}
          className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] dark:text-white"
          placeholder="Add any extra details here..."
        />
        {errors.notes && <p className="mt-1 text-sm text-red-500">{errors.notes.message}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Transaction' : 'Create Transaction'}
        </Button>
      </div>
    </form>
  );
};
