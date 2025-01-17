// Dashboard.jsx
import React from 'react'
import StatCard from "../Pages/Components/Dashboard/StatCard";
import {formatCurrency} from "./Components/Income/formatCurrency";

import RecentTransactions from "../Pages/Components/Dashboard/RecentTransactions";
import { useGlobalTransactionData } from "../Pages/Components/Income/TransactionList";
import { TrendingUp, Activity, CreditCard } from 'react-feather'; 
import { TrendingDown } from "lucide-react";

export default function Dashboard() {
  const { totalIncomeFortheCurrentMonth, incomeData, error, message, loading } = useGlobalTransactionData('income');
  const { totalExpenseFortheCurrentMonth, expenseData } = useGlobalTransactionData('expense');

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your financial status
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600">Current Balance</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalIncomeFortheCurrentMonth - totalExpenseFortheCurrentMonth)}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Balance"
          amount={totalIncomeFortheCurrentMonth - totalExpenseFortheCurrentMonth}
          type="balance"
          icon={<Activity />}
        />
        <StatCard 
          title="Total Income"
          amount={totalIncomeFortheCurrentMonth}
          type="income"
          icon={<TrendingUp />}
        />
        <StatCard 
          title="Total Expenses"
          amount={totalExpenseFortheCurrentMonth}
          type="expense"
          icon={<TrendingDown />}
        />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions incomeData={incomeData} expenseData={expenseData} loading={loading} />
    </div>
  );
}

