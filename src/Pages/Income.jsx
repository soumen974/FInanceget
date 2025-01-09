import React from 'react'
import TransactionForm from "./Components/Income/TransactionForm";
import TransactionList from "./Components/Income/TransactionList";

export default function Income() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Income</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionList type="income" />
        </div>
        <div>
          <TransactionForm type="income" />
        </div>
      </div>
    </div>
  )
}
