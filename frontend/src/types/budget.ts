export type BudgetPeriod = 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type BudgetStatus = 'ACTIVE' | 'ARCHIVED';

export interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  period: BudgetPeriod;
  status: BudgetStatus;
  startDate: string;
  endDate: string;
  spentAmount: number; // Calculated field from backend aggregation
  remainingAmount: number; // Calculated field
  percentageUsed: number; // Calculated field
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetRequest {
  category: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
}

export interface UpdateBudgetRequest extends Partial<CreateBudgetRequest> {
  status?: BudgetStatus;
}
