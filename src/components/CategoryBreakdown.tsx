'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryExpense } from '@/types';

interface CategoryBreakdownProps {
  data: CategoryExpense[];
}

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            No category data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5)
          .map((item, index) => {
            const percentage = ((item.amount / totalAmount) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(item.amount)}</div>
                  <div className="text-xs text-muted-foreground">{percentage}%</div>
                </div>
              </div>
            );
          })}
        {data.length > 5 && (
          <div className="text-xs text-muted-foreground pt-2 border-t">
            And {data.length - 5} more categories
          </div>
        )}
      </CardContent>
    </Card>
  );
}
