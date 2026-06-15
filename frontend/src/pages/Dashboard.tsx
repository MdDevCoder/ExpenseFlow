import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import api from '../services/api';
import { CategoryDonutChart } from '../components/analytics/CategoryDonutChart';
import { IncomeExpenseBarChart } from '../components/analytics/IncomeExpenseBarChart';
import { MonthlyTrendAreaChart } from '../components/analytics/MonthlyTrendAreaChart';
import { InsightsPanel } from '../components/analytics/InsightsPanel';

interface SummaryKPIs {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  savingsRate: number;
}

const Dashboard = () => {
  const { user } = useAuthStore();

  const { data: summary, isLoading } = useQuery<SummaryKPIs>({
    queryKey: ['analytics', 'summary'],
    queryFn: async () => {
      const res = await api.get('/analytics/summary');
      return res.data;
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: user?.currency || 'USD'
    }).format(value);
  };

  const stats = [
    { 
      name: 'Current Balance', 
      value: isLoading ? '...' : formatCurrency(summary?.currentBalance || 0), 
      icon: Wallet, 
      trend: 'Live', 
      positive: (summary?.currentBalance || 0) >= 0 
    },
    { 
      name: 'Monthly Income', 
      value: isLoading ? '...' : formatCurrency(summary?.monthlyIncome || 0), 
      icon: TrendingUp, 
      trend: 'Live', 
      positive: true 
    },
    { 
      name: 'Monthly Expense', 
      value: isLoading ? '...' : formatCurrency(summary?.monthlyExpense || 0), 
      icon: TrendingDown, 
      trend: 'Live', 
      positive: false 
    },
    { 
      name: 'Savings Rate', 
      value: isLoading ? '...' : `${summary?.savingsRate || 0}%`, 
      icon: PiggyBank, 
      trend: 'Live', 
      positive: (summary?.savingsRate || 0) > 20 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Welcome back, {user?.firstName} 👋
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's what's happening with your finances today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.name} glass className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                <item.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </div>
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${item.positive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                {item.trend}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.name}</h3>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {item.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <IncomeExpenseBarChart />
          <MonthlyTrendAreaChart />
        </div>
        <div className="space-y-6">
          <CategoryDonutChart />
          <InsightsPanel />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
