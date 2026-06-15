import { create } from 'zustand';

type ThemeState = {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('expenseflow_theme') as 'dark' | 'light') || 'dark',
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('expenseflow_theme', newTheme);
      
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return { theme: newTheme };
    });
  }
}));

// Initialize theme
const savedTheme = localStorage.getItem('expenseflow_theme') || 'dark';
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
