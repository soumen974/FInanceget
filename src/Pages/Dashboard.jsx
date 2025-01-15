import React from 'react'
import StatCard from "../Pages/Components/Dashboard/StatCard";
import RecentTransactions from "../Pages/Components/Dashboard/RecentTransactions";
import { useGlobalTransactionData } from "../Pages/Components/Income/TransactionList";
export default function  Dashboard () {
  const { totalIncomeFortheCurrentMonth, incomeData, error, message, loading } = useGlobalTransactionData('income');
  const { totalExpenseFortheCurrentMonth, expenseData } = useGlobalTransactionData('expense');
    return (
      <div className="">
        <h1 className="sm:text-3xl text-xl font-bold mb-6 max-sm:pl-2">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Balance " amount={totalIncomeFortheCurrentMonth-totalExpenseFortheCurrentMonth} type="balance" />
          <StatCard title="Income" amount={totalIncomeFortheCurrentMonth} type="income" />
          <StatCard title="Expenses" amount={totalExpenseFortheCurrentMonth} type="expense" />
        </div>
        <RecentTransactions />
      </div>
    );
  };