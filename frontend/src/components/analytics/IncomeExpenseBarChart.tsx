import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';

interface TrendData {
  month: string;
  income: number;
  expense: number;
}

interface Props {
  data?: TrendData[];
}

export const IncomeExpenseBarChart = ({ data: externalData }: Props) => {
  const { user } = useAuthStore();
  const { data: fetchedData, isLoading } = useQuery<TrendData[]>({
    queryKey: ['analytics', 'monthly-trend'],
    queryFn: async () => {
      const res = await api.get('/analytics/monthly-trend');
      return res.data;
    },
    enabled: !externalData
  });

  const data = externalData || fetchedData;

  if (isLoading) {
    return (
      <Card glass className="p-6 min-h-[350px] animate-pulse flex items-center justify-center">
        <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card glass className="p-6 min-h-[350px] flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 dark:text-gray-400">No trend data available.</p>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: user?.currency || 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card glass className="p-6 min-h-[350px]">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Income vs Expenses</h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={formatCurrency} />
            <Tooltip 
              formatter={(value: any) => formatCurrency(Number(value))}
              contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{value}</span>}
            />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
