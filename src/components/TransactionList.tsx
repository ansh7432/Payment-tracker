'use client';

import { Transaction } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TransactionForm } from './TransactionForm';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionListProps {
  transactions: Transaction[];
  onUpdate: () => void;
}

export function TransactionList({ transactions, onUpdate }: TransactionListProps) {
  const handleEdit = async (transaction: Omit<Transaction, '_id'>, id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      onUpdate();
    } catch {
      throw new Error('Failed to update transaction');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      toast.success('Transaction deleted!');
      onUpdate();
    } catch {
      toast.error('Failed to delete transaction');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No transactions found. Add your first transaction to get started!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction._id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium truncate pr-2">{transaction.description}</h3>
                  <span
                    className={`text-lg font-semibold whitespace-nowrap ${
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 text-sm text-muted-foreground flex-wrap">
                  <span className="truncate">{transaction.category}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{formatDate(transaction.date)}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="capitalize">{transaction.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <TransactionForm
                  transaction={transaction}
                  onSubmit={(data) => handleEdit(data, transaction._id!)}
                  trigger={
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  }
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(transaction._id!)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
