import { useState, useEffect } from 'react';
import { Receipt } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { useTransactionDrawer } from '../store/useTransactionDrawer';
import api from '../services/api';
import type { Transaction } from '../types/transaction';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { openDrawer, refreshTrigger } = useTransactionDrawer();

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/transactions');
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger]);

  const handleEdit = (transaction: Transaction) => {
    openDrawer(transaction);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (err) {
        console.error('Failed to delete transaction', err);
        alert('Failed to delete transaction');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Transactions
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your income and expenses.
          </p>
        </div>
      </div>

      {!loading && transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="Get started by adding your first transaction. You'll be able to track your spending and see where your money goes."
          className="mt-8"
        />
      ) : (
        <TransactionTable 
          transactions={transactions} 
          loading={loading} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Transactions;
