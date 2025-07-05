export interface Transaction {
  _id?: string;
  amount: number;
  date: Date;
  description: string;
  category?: string;
  type: 'income' | 'expense';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  _id?: string;
  name: string;
  color: string;
  budget?: number;
}

export interface MonthlyExpense {
  month: string;
  amount: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  color: string;
}

export interface Budget {
  _id?: string;
  category: string;
  amount: number;
  month: string;
  year: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BudgetVsActual {
  category: string;
  budget: number;
  actual: number;
  difference: number;
  percentage: number;
}

export interface SpendingInsights {
  currentMonthSpending: number;
  lastMonthSpending: number;
  monthOverMonthChange: number;
  transactionCount: number;
  categoriesUsed: number;
  topCategories: {
    category: string;
    amount: number;
    transactionCount: number;
  }[];
  budgetAdherence: {
    category: string;
    budget: number;
    spent: number;
    adherence: number;
    status: string;
  }[];
  averageTransactionAmount: number;
}
