import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Target, PieChart, Activity } from 'lucide-react';
import { BudgetCard } from '../components/budgets/BudgetCard';
import { BudgetForm, type BudgetFormData } from '../components/budgets/BudgetForm';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import type { Budget } from '../types/budget';
import api from '../services/api';

const Budgets = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>();

  const { data: budgets, isLoading } = useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: async () => {
      const res = await api.get('/budgets');
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: BudgetFormData) => {
      await api.post('/budgets', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      handleCloseModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BudgetFormData }) => {
      await api.put(`/budgets/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      handleCloseModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/budgets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    }
  });

  const handleOpenCreate = () => {
    setEditingBudget(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(undefined);
  };

  const handleSubmit = async (data: BudgetFormData) => {
    if (editingBudget) {
      await updateMutation.mutateAsync({ id: editingBudget.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: user?.currency || 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate Summary KPIs
  const totalBudget = budgets?.reduce((sum, b) => sum + b.amount, 0) || 0;
  const totalSpent = budgets?.reduce((sum, b) => sum + b.spentAmount, 0) || 0;
  const totalRemaining = budgets?.reduce((sum, b) => sum + Math.max(0, b.remainingAmount), 0) || 0;
  const overallHealth = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Financial Planning
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Set budgets and track your spending goals.
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <Button onClick={handleOpenCreate} className="flex items-center">
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Budget
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      {!isLoading && budgets && budgets.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card glass className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Budget</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalBudget)}</p>
              </div>
            </div>
          </Card>
          <Card glass className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30">
                <PieChart className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </Card>
          <Card glass className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Remaining</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalRemaining)}</p>
              </div>
            </div>
          </Card>
          <Card glass className="p-6">
            <div className="flex flex-col justify-center h-full">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Overall Health Score</p>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-gray-900 dark:text-white">{overallHealth.toFixed(1)}% Used</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${overallHealth > 100 ? 'bg-red-500' : overallHealth > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(overallHealth, 100)}%` }}
                ></div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Budgets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} glass className="p-6 h-[200px] animate-pulse flex items-center justify-center">
              <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
            </Card>
          ))}
        </div>
      ) : budgets && budgets.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetCard 
              key={budget.id} 
              budget={budget} 
              onEdit={handleOpenEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      ) : (
        <Card glass className="p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No budgets created</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Get started by creating a budget for your most frequent expenses like Food or Transport.
          </p>
          <div className="mt-6">
            <Button onClick={handleOpenCreate}>
              <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Create First Budget
            </Button>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBudget ? "Edit Budget" : "Create Budget"}
      >
        <BudgetForm 
          initialData={editingBudget}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
};

export default Budgets;
