import { useQuery } from '@tanstack/react-query';
import { Lightbulb } from 'lucide-react';
import { Card } from '../ui/Card';
import api from '../../services/api';

export const InsightsPanel = () => {
  const { data: insights, isLoading } = useQuery<string[]>({
    queryKey: ['analytics', 'insights'],
    queryFn: async () => {
      const res = await api.get('/analytics/insights');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <Card glass className="p-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card glass className="p-6 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-transparent border-indigo-100 dark:border-indigo-500/20">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="h-5 w-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Smart Insights</h3>
      </div>
      <ul className="space-y-3">
        {insights?.map((insight, idx) => (
          <li key={idx} className="flex items-start">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold mr-3">
              {idx + 1}
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-6">
              {insight}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
};
