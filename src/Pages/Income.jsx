import React , { useState } from 'react'
import TransactionForm from "./Components/Income/TransactionForm";
import TransactionList from "./Components/Income/TransactionList";

export default function Income() {
  const [action, setAction] = useState('');
  const [editId, setEditId] = useState(null);


  return (
    <div className="max-w-7xl pb-6 mx-auto">
      <h1 className="sm:text-3xl text-gray-900 dark:text-gray-100 text-xl font-bold mb-6">Income</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionList type="income" action={action} setAction={setAction} setEditId={setEditId} editId={editId} />
        </div>
        <div>
          <TransactionForm type="income" setAction={setAction} action={action} setEditId={setEditId} editId={editId} />
        </div>
      </div>
    </div>
  )
}
