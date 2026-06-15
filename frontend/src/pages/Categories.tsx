import { Tags } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

const Categories = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Categories
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Organize your spending into custom categories.
          </p>
        </div>
      </div>

      <EmptyState
        icon={Tags}
        title="No categories found"
        description="Create categories like 'Groceries', 'Rent', or 'Entertainment' to better organize and analyze your expenses."
        action={<Button>Create Category</Button>}
        className="mt-8"
      />
    </div>
  );
};

export default Categories;
