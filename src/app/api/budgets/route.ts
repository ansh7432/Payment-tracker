import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const budgets = await db
      .collection('budgets')
      .find({})
      .sort({ year: -1, month: -1 })
      .toArray();

    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, amount, month, year } = body;

    if (!category || !amount || !month || !year) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Check if budget already exists for this category and month/year
    const existingBudget = await db.collection('budgets').findOne({
      category,
      month,
      year
    });

    if (existingBudget) {
      // Update existing budget
      await db.collection('budgets').updateOne(
        { category, month, year },
        {
          $set: {
            amount: parseFloat(amount),
            updatedAt: new Date(),
          },
        }
      );
      return NextResponse.json({ success: true, updated: true });
    } else {
      // Create new budget
      const budget = {
        category,
        amount: parseFloat(amount),
        month,
        year,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection('budgets').insertOne(budget);
      return NextResponse.json({
        _id: result.insertedId,
        ...budget,
      });
    }
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}
