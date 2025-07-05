import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST() {
  try {
    const { db } = await connectToDatabase();
    
    // Sample transactions data
    const sampleTransactions = [
      {
        amount: 1200.00,
        date: new Date('2024-01-15'),
        description: 'Salary',
        category: 'Other',
        type: 'income',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        amount: 45.50,
        date: new Date('2024-01-14'),
        description: 'Grocery shopping',
        category: 'Groceries',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        amount: 15.75,
        date: new Date('2024-01-13'),
        description: 'Coffee and lunch',
        category: 'Food & Dining',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        amount: 89.99,
        date: new Date('2024-01-12'),
        description: 'Monthly internet bill',
        category: 'Bills & Utilities',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        amount: 25.00,
        date: new Date('2024-01-11'),
        description: 'Gas station',
        category: 'Transportation',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        amount: 120.00,
        date: new Date('2024-01-10'),
        description: 'Shopping clothes',
        category: 'Shopping',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        amount: 35.00,
        date: new Date('2024-01-09'),
        description: 'Movie tickets',
        category: 'Entertainment',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        amount: 500.00,
        date: new Date('2023-12-30'),
        description: 'Freelance project',
        category: 'Other',
        type: 'income',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        amount: 75.50,
        date: new Date('2023-12-28'),
        description: 'Weekly groceries',
        category: 'Groceries',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        amount: 200.00,
        date: new Date('2023-12-25'),
        description: 'Holiday gifts',
        category: 'Shopping',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Clear existing data
    await db.collection('transactions').deleteMany({});
    await db.collection('budgets').deleteMany({});
    
    // Insert sample transactions
    const transactionResult = await db.collection('transactions').insertMany(sampleTransactions);

    // Create sample budgets
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const sampleBudgets = [
      { category: 'Food & Dining', amount: 800, month: currentMonth.toString().padStart(2, '0'), year: currentYear },
      { category: 'Transportation', amount: 400, month: currentMonth.toString().padStart(2, '0'), year: currentYear },
      { category: 'Shopping', amount: 300, month: currentMonth.toString().padStart(2, '0'), year: currentYear },
      { category: 'Entertainment', amount: 200, month: currentMonth.toString().padStart(2, '0'), year: currentYear },
      { category: 'Bills & Utilities', amount: 600, month: currentMonth.toString().padStart(2, '0'), year: currentYear },
      { category: 'Groceries', amount: 500, month: currentMonth.toString().padStart(2, '0'), year: currentYear },
    ];

    const budgetResult = await db.collection('budgets').insertMany(sampleBudgets.map(budget => ({
      ...budget,
      createdAt: new Date(),
      updatedAt: new Date(),
    })));

    return NextResponse.json({
      message: 'Sample data added successfully',
      transactions: transactionResult.insertedCount,
      budgets: budgetResult.insertedCount
    });
  } catch (error) {
    console.error('Error adding sample data:', error);
    return NextResponse.json(
      { error: 'Failed to add sample data' },
      { status: 500 }
    );
  }
}
