import React , { useState } from 'react'
import TransactionForm from "../Pages/Components/Income/TransactionForm";
import TransactionList from "../Pages/Components/Income/TransactionList";
export default function  Expenses ()  {
   const [action, setAction] = useState('');
    const [editId, setEditId] = useState(null);
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Expenses</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionList type="expense"  action={action} setAction={setAction} setEditId={setEditId} editId={editId}/>
          </div>
          <div>
            <TransactionForm type="expense" setAction={setAction} action={action} editId={editId} />
          </div>
        </div>
      </div>
    );
  };
  
