'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetVsActual } from '@/types';

interface BudgetVsActualChartProps {
  data: BudgetVsActual[];
  month: string;
  year: string;
}

export function BudgetVsActualChart({ data, month, year }: BudgetVsActualChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthName = monthNames[parseInt(month) - 1];

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual - {monthName} {year}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No budget data available for {monthName} {year}. Set some budgets to see comparisons.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual - {monthName} {year}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip 
              formatter={(value: number) => [
                formatCurrency(value), 
        
              ]}
            />
            <Legend />
            <Bar dataKey="budget" fill="#8884d8" name="" />
            <Bar dataKey="actual" fill="#82ca9d" name="" />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Budget Status Summary */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item, index) => {
            const isOverBudget = item.actual > item.budget && item.budget > 0;
            const percentage = item.budget > 0 ? (item.actual / item.budget) * 100 : 0;
            
            return (
              <div key={index} className="p-3 border rounded-lg">
                <div className="font-medium text-sm">{item.category}</div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Budget: {formatCurrency(item.budget)}</span>
                  <span>Actual: {formatCurrency(item.actual)}</span>
                </div>
                <div className={`text-xs mt-1 font-medium ${
                  isOverBudget ? 'text-red-600' : 'text-green-600'
                }`}>
                  {item.budget > 0 ? (
                    isOverBudget ? 
                      `Over budget by ${formatCurrency(item.actual - item.budget)}` :
                      `${percentage.toFixed(0)}% of budget used`
                  ) : (
                    'No budget set'
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
