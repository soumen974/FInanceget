import React , { useState } from 'react'
import TransactionForm from "../Pages/Components/Income/TransactionForm";
import TransactionList from "../Pages/Components/Income/TransactionList";
export default function  Expenses ()  {
   const [action, setAction] = useState('');
    const [editId, setEditId] = useState(null);
    return (
      <div className="max-w-7xl pb-6 mx-auto">
        <div>
          <h1 className="sm:text-3xl text-gray-900 dark:text-gray-100 text-xl font-bold mb-2">
            Expenses
          </h1>
          <p className="text-sm mb-6 text-gray-600 dark:text-gray-400">
            Track your spending, master your budget.
          </p>
        </div>        <div className="lg:grid flex flex-col-reverse grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionList type="expense"  action={action} setAction={setAction} setEditId={setEditId} editId={editId} />
          </div>
          <div>
            <TransactionForm type="expense" setAction={setAction} action={action} setEditId={setEditId} editId={editId} />
          </div>
        </div>
      </div>
    );
  };
  
