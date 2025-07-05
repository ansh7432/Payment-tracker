'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpendingInsights } from '@/types';
import { TrendingUp, TrendingDown, Target, ShoppingCart, Calendar, DollarSign } from 'lucide-react';

interface SpendingInsightsProps {
  data: SpendingInsights;
}

export function SpendingInsightsComponent({ data }: SpendingInsightsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${Math.abs(percentage).toFixed(1)}%`;
  };

  const isIncreased = data.monthOverMonthChange > 0;
  const onTrackBudgets = data.budgetAdherence.filter(b => b.status === 'on-track').length;
  const totalBudgets = data.budgetAdherence.length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(data.currentMonthSpending)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">vs Last Month</p>
                <div className="flex items-center gap-1">
                  {isIncreased ? (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  )}
                  <p className={`text-lg font-semibold ${
                    isIncreased ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {isIncreased ? '+' : '-'}{formatPercentage(data.monthOverMonthChange)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-lg font-semibold">{data.transactionCount}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg per Transaction</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(data.averageTransactionAmount)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Adherence */}
      {data.budgetAdherence.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Budget Adherence ({onTrackBudgets}/{totalBudgets} on track)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.budgetAdherence.map((budget, index) => {
                const isOverBudget = budget.adherence > 100;
                const progressWidth = Math.min(budget.adherence, 100);
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{budget.category}</span>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.budget)}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isOverBudget ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${progressWidth}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={`font-medium ${
                        isOverBudget ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {budget.adherence.toFixed(1)}% used
                      </span>
                      {isOverBudget && (
                        <span className="text-red-600 font-medium">
                          Over by {formatCurrency(budget.spent - budget.budget)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Top Spending Categories This Month</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topCategories.length > 0 ? (
            <div className="space-y-4">
              {data.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{category.category}</div>
                      <div className="text-sm text-muted-foreground">
                        {category.transactionCount} transactions
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(category.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No spending data for this month yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
