import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!month || !year) {
      return NextResponse.json(
        { error: 'Month and year are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Get budgets for the specified month/year
    const budgets = await db
      .collection('budgets')
      .find({ month, year: parseInt(year) })
      .toArray();

    // Get actual spending for the specified month/year
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const actualSpending = await db
      .collection('transactions')
      .aggregate([
        {
          $match: {
            type: 'expense',
            date: {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: '$category',
            actual: { $sum: '$amount' }
          }
        }
      ])
      .toArray();

    // Combine budget and actual data
    const budgetVsActual = budgets.map(budget => {
      const actualData = actualSpending.find(actual => actual._id === budget.category);
      return {
        category: budget.category,
        budget: budget.amount,
        actual: actualData ? actualData.actual : 0,
        difference: budget.amount - (actualData ? actualData.actual : 0),
        percentage: actualData ? (actualData.actual / budget.amount) * 100 : 0
      };
    });

    // Add categories with spending but no budget
    actualSpending.forEach(actual => {
      if (!budgets.find(budget => budget.category === actual._id)) {
        budgetVsActual.push({
          category: actual._id,
          budget: 0,
          actual: actual.actual,
          difference: -actual.actual,
          percentage: 0
        });
      }
    });

    return NextResponse.json(budgetVsActual);
  } catch (error) {
    console.error('Error fetching budget vs actual:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget vs actual data' },
      { status: 500 }
    );
  }
}
