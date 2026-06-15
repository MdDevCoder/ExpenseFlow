import { create } from 'zustand';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  currency: string;
  token: string;
};

type AuthState = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('expenseflow_user') || 'null'),
  login: (user) => {
    localStorage.setItem('expenseflow_user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('expenseflow_user');
    set({ user: null });
  }
}));
