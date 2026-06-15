import { MoreVertical, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { useAuthStore } from '../../store/useAuthStore';
import type { Budget } from '../../types/budget';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export const BudgetCard = ({ budget, onEdit, onDelete }: BudgetCardProps) => {
  const { user } = useAuthStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: user?.currency || 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Determine health state
  let healthState: 'HEALTHY' | 'WARNING' | 'EXCEEDED' = 'HEALTHY';
  let progressColor = 'bg-emerald-500 dark:bg-emerald-400';
  let bgColor = 'bg-emerald-100 dark:bg-emerald-900/30';
  let Icon = CheckCircle;
  let iconColor = 'text-emerald-500';

  if (budget.percentageUsed >= 100) {
    healthState = 'EXCEEDED';
    progressColor = 'bg-red-500 dark:bg-red-400';
    bgColor = 'bg-red-100 dark:bg-red-900/30';
    Icon = XCircle;
    iconColor = 'text-red-500';
  } else if (budget.percentageUsed >= 80) {
    healthState = 'WARNING';
    progressColor = 'bg-amber-500 dark:bg-amber-400';
    bgColor = 'bg-amber-100 dark:bg-amber-900/30';
    Icon = AlertTriangle;
    iconColor = 'text-amber-500';
  }

  const cappedPercentage = Math.min(budget.percentageUsed, 100);

  return (
    <Card glass className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {budget.period.toLowerCase()} Budget
            </p>
          </div>
        </div>
        <div className="relative group">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>
          <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            <div className="py-1">
              <button
                onClick={() => onEdit(budget)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(budget.id)}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(budget.spentAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {formatCurrency(budget.amount)}
            </p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-medium text-gray-700 dark:text-gray-300">{budget.percentageUsed.toFixed(1)}% Used</span>
            <span className="text-gray-500 dark:text-gray-400">
              {healthState === 'EXCEEDED' 
                ? `${formatCurrency(budget.spentAmount - budget.amount)} over` 
                : `${formatCurrency(budget.remainingAmount)} left`}
            </span>
          </div>
          <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${cappedPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
};
