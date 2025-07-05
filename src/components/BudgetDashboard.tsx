'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BudgetForm } from '@/components/BudgetForm';
import { BudgetVsActualChart } from '@/components/BudgetVsActualChart';
import { SpendingInsightsComponent } from '@/components/SpendingInsightsComponent';
import { Budget, BudgetVsActual, SpendingInsights } from '@/types';
import { Target, Plus, TrendingUp } from 'lucide-react';

export function BudgetDashboard() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetVsActual, setBudgetVsActual] = useState<BudgetVsActual[]>([]);
  const [insights, setInsights] = useState<SpendingInsights | null>(null);
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budgets');
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchBudgetVsActual = useCallback(async () => {
    try {
      const response = await fetch(`/api/budget-vs-actual?month=${selectedMonth}&year=${selectedYear}`);
      if (response.ok) {
        const data = await response.json();
        setBudgetVsActual(data);
      }
    } catch (error) {
      console.error('Error fetching budget vs actual:', error);
    }
  }, [selectedMonth, selectedYear]);

  const fetchInsights = async () => {
    try {
      const response = await fetch('/api/insights');
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchBudgets(), fetchBudgetVsActual(), fetchInsights()]);
    setLoading(false);
  }, [fetchBudgetVsActual]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    fetchBudgetVsActual();
  }, [fetchBudgetVsActual]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear + i - 2).toString());

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded animate-pulse" />
          <div className="h-96 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6" />
          Budget & Insights
        </h2>
        <BudgetForm
          onSubmit={loadData}
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Set Budget
            </Button>
          }
        />
      </div>

      {/* Month/Year Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div>
              <label className="text-sm font-medium">Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <BudgetVsActualChart 
            data={budgetVsActual} 
            month={selectedMonth} 
            year={selectedYear} 
          />
        </CardContent>
      </Card>

      {/* Spending Insights */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Spending Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingInsightsComponent data={insights} />
          </CardContent>
        </Card>
      )}

      {/* Current Budgets */}
      {budgets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Budgets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget) => (
                <div key={budget._id} className="p-4 border rounded-lg">
                  <div className="font-medium">{budget.category}</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(budget.amount)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {months.find(m => m.value === budget.month)?.label} {budget.year}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
