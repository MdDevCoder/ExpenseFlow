import React from 'react';
import { cn } from './Button';



interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const categoryConfig: Record<string, { icon: string; colors: string }> = {
  Food: { icon: '🍔', colors: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20' },
  Transport: { icon: '🚗', colors: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' },
  Shopping: { icon: '🛍️', colors: 'bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400 border-pink-200 dark:border-pink-500/20' },
  Health: { icon: '❤️', colors: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20' },
  Bills: { icon: '📄', colors: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20' },
  Entertainment: { icon: '🎮', colors: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20' },
  Education: { icon: '📚', colors: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' },
  Salary: { icon: '💼', colors: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
  Freelance: { icon: '💻', colors: 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border-teal-200 dark:border-teal-500/20' },
  Other: { icon: '📌', colors: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400 border-gray-200 dark:border-gray-500/20' },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  const config = categoryConfig[category] || categoryConfig['Other'];
  
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border', config.colors, className)}>
      <span>{config.icon}</span>
      {category}
    </span>
  );
};
