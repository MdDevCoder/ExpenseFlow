import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, FileText, Settings } from 'lucide-react';
import { cn } from '../ui/Button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Budgets', href: '/budgets', icon: Wallet },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0F19]">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-emerald-400">
          ExpenseFlow
        </h1>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50',
                  'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200'
                )}
              >
                <item.icon
                  className={cn(
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                    'mr-3 h-5 w-5 shrink-0 transition-colors'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
