import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-300">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" onClick={toggleTheme} className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 transition-colors">
            <span className="sr-only">Toggle theme</span>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 transition-colors">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" />
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" aria-hidden="true" />

          <div className="flex items-center gap-x-4">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium shadow-sm">
              {user?.firstName?.[0] || 'U'}
            </div>
            <span className="hidden lg:flex lg:items-center">
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200" aria-hidden="true">
                {user?.firstName} {user?.lastName}
              </span>
            </span>
            <Button variant="ghost" className="text-xs px-2 py-1 ml-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
