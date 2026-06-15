import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { CategoryBadge } from '../ui/CategoryBadge';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

import type { Transaction } from '../../types/transaction';

interface Props {
  transactions: Transaction[];
  loading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionTable: React.FC<Props> = ({ transactions, loading, onEdit, onDelete }) => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredTransactions = transactions.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentData = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (amount: number, txCurrency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: txCurrency || user?.currency || 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            placeholder="Search transactions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {currentData.map((tx) => (
              <tr key={tx._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full mr-3 ${tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                      {tx.type === 'INCOME' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{tx.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <CategoryBadge category={tx.category} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(tx.date)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => onEdit(tx)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(tx._id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {currentData.map((tx) => (
          <div key={tx._id} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                {tx.type === 'INCOME' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.title}</p>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(tx.date)}</span>
                  <CategoryBadge category={tx.category} className="scale-75 origin-left" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className={`text-sm font-semibold ${tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => onEdit(tx)} className="text-indigo-600 dark:text-indigo-400">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => onDelete(tx._id)} className="text-red-600 dark:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of <span className="font-medium">{filteredTransactions.length}</span> results
          </p>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="px-2 py-1"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="px-2 py-1"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
