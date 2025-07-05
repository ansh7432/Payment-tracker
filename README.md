# Personal Finance Tracker

A modern web application for tracking personal finances built with Next.js, React, shadcn/ui, Recharts, and MongoDB.

## Features

### Stage 1: Basic Transaction Tracking ✅
- ✅ Add/Edit/Delete transactions (amount, date, description)
- ✅ Transaction list view with beautiful UI
- ✅ Monthly expenses bar chart
- ✅ Form validation and error handling
- ✅ Responsive design

### Stage 2: Categories ✅
- ✅ Predefined categories for transactions
- ✅ Category-wise pie chart
- ✅ Dashboard with summary cards
- ✅ Category breakdown visualization
- ✅ Most recent transactions summary

### Stage 3: Budgeting ✅
- ✅ Set monthly category budgets
- ✅ Budget vs actual comparison chart
- ✅ Spending insights and analytics
- ✅ Budget adherence tracking
- ✅ Month-over-month spending comparison
- ✅ Top spending categories analysis

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd personal-finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=finance-tracker
```

For production with MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Add Transactions**: Click the "Add Transaction" button to create new income or expense entries
2. **View Dashboard**: Browse all transactions, charts, and summary cards on the main dashboard
3. **Visualize Data**: See your monthly spending patterns in the bar chart and category distribution in the pie chart
4. **Track Balance**: Monitor your total income, expenses, and net balance in the summary cards
5. **Category Insights**: View detailed category breakdown and recent transactions summary
6. **Set Budgets**: Switch to the "Budget & Insights" tab to set monthly budgets for categories
7. **Budget Tracking**: Compare your actual spending against budgets with visual charts
8. **Spending Analysis**: Get insights on spending trends, top categories, and budget adherence

### Adding Sample Data

To quickly test the application with sample data:

1. Open your browser's developer tools
2. Go to the Console tab
3. Run the following command:
```javascript
fetch('/api/sample-data', { method: 'POST' }).then(() => location.reload())
```
4. The page will reload with sample transactions

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── TransactionForm.tsx
│   ├── TransactionList.tsx
│   └── MonthlyExpensesChart.tsx
├── lib/               # Utility functions
│   ├── mongodb.ts     # Database connection
│   └── utils.ts       # Helper utilities
├── types/             # TypeScript type definitions
└── constants/         # Application constants
```

## API Endpoints

### Transactions
- `GET /api/transactions` - Fetch all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Analytics & Charts
- `GET /api/charts` - Get chart data (monthly expenses, categories)

### Budgets
- `GET /api/budgets` - Fetch all budgets
- `POST /api/budgets` - Create or update budget
- `GET /api/budget-vs-actual?month=MM&year=YYYY` - Get budget vs actual comparison

### Insights
- `GET /api/insights` - Get spending insights and analytics

### Sample Data
- `POST /api/sample-data` - Add sample transactions and budgets for testing

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deployment

The application can be deployed on Vercel, Netlify, or any platform that supports Next.js.

For Vercel deployment:
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Future Enhancements

- Category management and custom categories
- Budget planning and tracking
- Advanced analytics and insights
- Data export/import functionality
- Multi-currency support
- Recurring transactions
- Mobile app support
