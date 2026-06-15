import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '../ui/Card';
import api from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'];

interface CategoryData {
  _id?: string;
  category: string;
  amount: number;
}

interface Props {
  data?: CategoryData[];
}

export const CategoryDonutChart = ({ data: externalData }: Props) => {
  const { user } = useAuthStore();

  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ['analytics', 'category-breakdown'],
    queryFn: async () => {
      const res = await api.get('/analytics/category-breakdown');
      return res.data;
    },
    enabled: !externalData
  });

  const data = externalData || fetchedData;

  if (isLoading) {
    return (
      <Card glass className="p-6 min-h-[350px] animate-pulse flex items-center justify-center">
        <div className="h-48 w-48 rounded-full border-8 border-gray-200 dark:border-gray-800"></div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card glass className="p-6 min-h-[350px] flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 dark:text-gray-400">No expenses recorded yet.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add some expenses to see your breakdown.</p>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: user?.currency || 'USD'
    }).format(value);
  };

  return (
    <Card glass className="p-6 min-h-[350px]">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Expenses by Category</h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="amount"
              nameKey="category"
            >
              {data.map((_: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => formatCurrency(Number(value))}
              contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
