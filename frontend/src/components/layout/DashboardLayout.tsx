import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { FAB } from '../ui/FAB';
import { Drawer } from '../ui/Drawer';
import { TransactionForm, type TransactionFormData } from '../transactions/TransactionForm';
import { useTransactionDrawer } from '../../store/useTransactionDrawer';
import api from '../../services/api';

const DashboardLayout = () => {
  const { isOpen, initialData, openDrawer, closeDrawer, triggerRefresh } = useTransactionDrawer();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await api.put(`/transactions/${initialData._id}`, data);
      } else {
        await api.post('/transactions', data);
      }
      triggerRefresh();
      closeDrawer();
    } catch (err) {
      console.error('Failed to save transaction', err);
      alert('Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19]">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Slide-over Drawer for adding transactions */}
      <Drawer
        isOpen={isOpen}
        onClose={closeDrawer}
        title={initialData ? 'Edit Transaction' : 'New Transaction'}
      >
        <TransactionForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={closeDrawer}
          isSubmitting={isSubmitting}
        />
      </Drawer>

      {/* Global FAB visible on all dashboard pages */}
      <FAB onClick={() => openDrawer()} />
    </div>
  );
};

export default DashboardLayout;
