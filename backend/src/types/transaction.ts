export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionStatus = 'COMPLETED' | 'PENDING';

export interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  category: string;
  date: string;
  title: string;
  notes?: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  amount: number;
  type: TransactionType;
  status?: TransactionStatus;
  category: string;
  date: string;
  title: string;
  notes?: string;
  currency?: string;
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {}

export interface TransactionResponse {
  data: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}
