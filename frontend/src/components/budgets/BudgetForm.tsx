import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Budget, BudgetPeriod } from '../../types/budget';

const DEFAULT_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Health',
  'Bills',
  'Entertainment',
  'Education',
  'Other'
];

const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  period: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;

interface Props {
  initialData?: Budget;
  onSubmit: (data: BudgetFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const BudgetForm = ({ initialData, onSubmit, onCancel, isSubmitting }: Props) => {
  const getDefaultDates = (period: BudgetPeriod) => {
    const now = new Date();
    let start = new Date(now);
    let end = new Date(now);

    if (period === 'MONTHLY') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (period === 'YEARLY') {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
    } else if (period === 'WEEKLY') {
      const day = now.getDay() || 7;
      start.setHours(-24 * (day - 1));
      end = new Date(start);
      end.setDate(start.getDate() + 6);
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema) as any,
    defaultValues: {
      category: initialData?.category || DEFAULT_CATEGORIES[0],
      amount: initialData?.amount || 0,
      period: initialData?.period || 'MONTHLY',
      startDate: initialData?.startDate 
        ? new Date(initialData.startDate).toISOString().split('T')[0]
        : getDefaultDates('MONTHLY').startDate,
      endDate: initialData?.endDate
        ? new Date(initialData.endDate).toISOString().split('T')[0]
        : getDefaultDates('MONTHLY').endDate,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          {...register('category')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white p-2.5 border"
        >
          {DEFAULT_CATEGORIES.map(cat => (
            <option key={cat} value={cat} className="dark:bg-gray-800">{cat}</option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
        )}
      </div>

      <div>
        <Input
          label="Budget Amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register('amount')}
          error={errors.amount?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Period
        </label>
        <select
          {...register('period')}
          onChange={(e) => {
            const p = e.target.value as BudgetPeriod;
            setValue('period', p);
            if (!initialData) {
              const dates = getDefaultDates(p);
              setValue('startDate', dates.startDate);
              setValue('endDate', dates.endDate);
            }
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white p-2.5 border"
        >
          <option value="WEEKLY" className="dark:bg-gray-800">Weekly</option>
          <option value="MONTHLY" className="dark:bg-gray-800">Monthly</option>
          <option value="YEARLY" className="dark:bg-gray-800">Yearly</option>
        </select>
        {errors.period && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.period.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          {...register('startDate')}
          error={errors.startDate?.message}
        />
        <Input
          label="End Date"
          type="date"
          {...register('endDate')}
          error={errors.endDate?.message}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {initialData ? 'Update Budget' : 'Create Budget'}
        </Button>
      </div>
    </form>
  );
};
