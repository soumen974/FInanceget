import React from 'react'
import StatCard from "../Pages/Components/Dashboard/StatCard";
import RecentTransactions from "../Pages/Components/Dashboard/RecentTransactions";
export default function  Dashboard () {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Balance" amount="5,234.50" type="balance" />
          <StatCard title="Income" amount="8,234.50" type="income" />
          <StatCard title="Expenses" amount="3,000.00" type="expense" />
        </div>
        <RecentTransactions />
      </div>
    );
  };