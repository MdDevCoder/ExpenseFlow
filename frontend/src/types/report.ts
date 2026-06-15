import type { Transaction } from './transaction';

export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  savings: number;
}

export interface ReportCategoryData {
  category: string;
  amount: number;
}

export interface ReportBudgetSummary {
  totalBudget: number;
  totalBudgetSpent: number;
  budgetHealth: number;
}

export interface ReportTrendData {
  month: string;
  income: number;
  expense: number;
}

export interface ReportData {
  summary: ReportSummary;
  categoryBreakdown: ReportCategoryData[];
  monthlyTrend: ReportTrendData[];
  budgetSummary: ReportBudgetSummary;
  transactions: Transaction[];
}
