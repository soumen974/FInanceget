import React from 'react'
import StatCard from "../Pages/Components/Dashboard/StatCard";
import RecentTransactions from "../Pages/Components/Dashboard/RecentTransactions";
import { useGlobalTransactionData } from "../Pages/Components/Income/TransactionList";
export default function  Dashboard () {
  const { totalIncome, incomeData, error, message, loading } = useGlobalTransactionData('income');
  const { totalExpense, expenseData } = useGlobalTransactionData('expense');
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Balance" amount={totalIncome-totalExpense} type="balance" />
          <StatCard title="Income" amount={totalIncome} type="income" />
          <StatCard title="Expenses" amount={totalExpense} type="expense" />
        </div>
        <RecentTransactions />
      </div>
    );
  };