import React from 'react'
import TransactionForm from "../Pages/Components/Income/TransactionForm";
import TransactionList from "../Pages/Components/Income/TransactionList";
export default function  Expenses ()  {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Expenses</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionList type="expense" />
          </div>
          <div>
            <TransactionForm type="expense" />
          </div>
        </div>
      </div>
    );
  };
  
