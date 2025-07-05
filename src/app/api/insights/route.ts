import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Current month/year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Last month
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Get current month spending
    const currentMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const currentMonthEnd = new Date(currentYear, currentMonth, 0);

    const currentMonthSpending = await db
      .collection('transactions')
      .aggregate([
        {
          $match: {
            type: 'expense',
            date: { $gte: currentMonthStart, $lte: currentMonthEnd }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            count: { $sum: 1 },
            categories: { $addToSet: '$category' }
          }
        }
      ])
      .toArray();

    // Get last month spending
    const lastMonthStart = new Date(lastMonthYear, lastMonth - 1, 1);
    const lastMonthEnd = new Date(lastMonthYear, lastMonth, 0);

    const lastMonthSpending = await db
      .collection('transactions')
      .aggregate([
        {
          $match: {
            type: 'expense',
            date: { $gte: lastMonthStart, $lte: lastMonthEnd }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ])
      .toArray();

    // Get top spending categories this month
    const topCategories = await db
      .collection('transactions')
      .aggregate([
        {
          $match: {
            type: 'expense',
            date: { $gte: currentMonthStart, $lte: currentMonthEnd }
          }
        },
        {
          $group: {
            _id: '$category',
            amount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { amount: -1 }
        },
        {
          $limit: 5
        }
      ])
      .toArray();

    // Get budget adherence
    const budgets = await db
      .collection('budgets')
      .find({ 
        month: currentMonth.toString().padStart(2, '0'), 
        year: currentYear 
      })
      .toArray();

    let budgetAdherence: Array<{
      category: string;
      budget: number;
      spent: number;
      adherence: number;
      status: string;
    }> = [];
    if (budgets.length > 0) {
      const categorySpending = await db
        .collection('transactions')
        .aggregate([
          {
            $match: {
              type: 'expense',
              date: { $gte: currentMonthStart, $lte: currentMonthEnd }
            }
          },
          {
            $group: {
              _id: '$category',
              spent: { $sum: '$amount' }
            }
          }
        ])
        .toArray();

      budgetAdherence = budgets.map(budget => {
        const spent = categorySpending.find(cat => cat._id === budget.category);
        const spentAmount = spent ? spent.spent : 0;
        return {
          category: budget.category,
          budget: budget.amount,
          spent: spentAmount,
          adherence: budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0,
          status: spentAmount <= budget.amount ? 'on-track' : 'over-budget'
        };
      });
    }

    // Calculate insights
    const currentTotal = currentMonthSpending[0]?.total || 0;
    const lastTotal = lastMonthSpending[0]?.total || 0;
    const monthOverMonthChange = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0;

    const insights = {
      currentMonthSpending: currentTotal,
      lastMonthSpending: lastTotal,
      monthOverMonthChange,
      transactionCount: currentMonthSpending[0]?.count || 0,
      categoriesUsed: currentMonthSpending[0]?.categories?.length || 0,
      topCategories: topCategories.map(cat => ({
        category: cat._id,
        amount: cat.amount,
        transactionCount: cat.count
      })),
      budgetAdherence,
      averageTransactionAmount: currentTotal > 0 && currentMonthSpending[0]?.count > 0 
        ? currentTotal / currentMonthSpending[0].count 
        : 0
    };

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}
