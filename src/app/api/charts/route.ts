import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { predefinedCategories } from '@/constants/categories';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get monthly expenses for the last 12 months
    const monthlyData = await db
      .collection('transactions')
      .aggregate([
        {
          $match: {
            type: 'expense',
            date: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' }
            },
            amount: { $sum: '$amount' }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ])
      .toArray();

    // Format data for charts
    const monthlyExpenses = monthlyData.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      amount: item.amount
    }));

    // Get category-wise expenses
    const categoryData = await db
      .collection('transactions')
      .aggregate([
        {
          $match: { type: 'expense' }
        },
        {
          $group: {
            _id: '$category',
            amount: { $sum: '$amount' }
          }
        }
      ])
      .toArray();

    const categoryExpenses = categoryData.map(item => {
      const category = predefinedCategories.find(cat => cat.name === (item._id || 'Other'));
      return {
        category: item._id || 'Other',
        amount: item.amount,
        color: category?.color || '#AED6F1'
      };
    });

    return NextResponse.json({
      monthlyExpenses,
      categoryExpenses
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
