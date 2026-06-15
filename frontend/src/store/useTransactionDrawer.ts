import { create } from 'zustand';
import type { Transaction } from '../types/transaction';

interface TransactionDrawerState {
  isOpen: boolean;
  initialData: Transaction | undefined;
  openDrawer: (data?: Transaction) => void;
  closeDrawer: () => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export const useTransactionDrawer = create<TransactionDrawerState>((set) => ({
  isOpen: false,
  initialData: undefined,
  openDrawer: (data) => set({ isOpen: true, initialData: data }),
  closeDrawer: () => set({ isOpen: false, initialData: undefined }),
  refreshTrigger: 0,
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
