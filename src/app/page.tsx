'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { MonthlyExpensesChart } from '@/components/MonthlyExpensesChart';
import { CategoryPieChart } from '@/components/CategoryPieChart';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { RecentTransactionsSummary } from '@/components/RecentTransactionsSummary';
import { LoadingState } from '@/components/LoadingState';
import { BudgetDashboard } from '@/components/BudgetDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transaction, MonthlyExpense, CategoryExpense } from '@/types';
import { Plus } from 'lucide-react';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyExpense[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch {
      setError('Failed to load transactions');
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch('/api/charts');
      if (!response.ok) {
        throw new Error('Failed to fetch chart data');
      }
      const data = await response.json();
      setMonthlyData(data.monthlyExpenses);
      setCategoryData(data.categoryExpenses);
    } catch {
      setError('Failed to load chart data');
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchTransactions(), fetchChartData()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddTransaction = async (transaction: Omit<Transaction, '_id'>) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      await loadData();
    } catch {
      throw new Error('Failed to add transaction');
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center text-red-600">
            {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Personal Finance Tracker</h1>
        <TransactionForm
          onSubmit={handleAddTransaction}
          trigger={
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          }
        />
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="budget">Budget & Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-green-600">
                  Total Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalIncome)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-red-600">
                  Total Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalExpenses)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Net Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(totalIncome - totalExpenses)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Charts Column */}
            <div className="xl:col-span-2 space-y-6">
              <MonthlyExpensesChart data={monthlyData} />
              <CategoryPieChart data={categoryData} />
            </div>
            
            {/* Summary Column */}
            <div className="space-y-6">
              <CategoryBreakdown data={categoryData} />
              <RecentTransactionsSummary transactions={transactions} />
            </div>
          </div>

          {/* Transactions List */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">All Transactions</h2>
            <TransactionList transactions={transactions} onUpdate={loadData} />
          </div>
        </TabsContent>
        
        <TabsContent value="budget">
          <BudgetDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
