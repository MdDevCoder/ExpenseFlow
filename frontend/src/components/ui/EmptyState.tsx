import React from 'react';
import { cn } from './Button';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20',
          className
        )}
        {...props}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20 mb-6">
          <Icon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
          {description}
        </p>
        {action && <div>{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';
