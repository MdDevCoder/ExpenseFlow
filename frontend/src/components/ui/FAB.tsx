import React from 'react';
import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
}

export const FAB: React.FC<FABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-105 hover:shadow-indigo-500/30 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label="Add Transaction"
    >
      <Plus className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
};
