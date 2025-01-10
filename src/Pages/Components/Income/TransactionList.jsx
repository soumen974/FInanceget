import React, { useEffect, useState } from 'react';
import { api } from "../../../AxiosMeta/ApiAxios";

export default function TransactionList({ type ,action ,setAction ,setEditId ,editId}) {
  const [transactions, setTransactions] = useState([
    { 
      _id: 1, 
      description: 'Grocery Shopping',
      category: 'Food',
      amount: 120.50,
      date: '2024-12-26',
      type: 'expense'
    },
    { 
      _id: 2, 
      description: 'Salary Deposit',
      category: 'Salary',
      amount: 3000.00,
      date: '2024-12-25',
      type: 'income'
    },
    { 
      _id: 3, 
      description: 'Freelance Work',
      category: 'Side Income',
      amount: 500.00,
      date: '2024-12-24',
      type: 'income'
    },
    { 
      _id: 4, 
      description: 'Internet Bill',
      category: 'Utilities',
      amount: 89.99,
      date: '2024-12-23',
      type: 'expense'
    }
  ]);
  const [incomeData, setIncomeData] = useState([]);
   const [error, setError] = useState('');
   const [message, setMessage] = useState('');

  useEffect(() => {
    getData();
  }, [action]);

  const getData = async () => {
    try {
      if (type === 'income') {
        const response = await api.get('/api/income');
        setIncomeData(response.data);
        // console.log(response.data);
      } else {
        // Fetch expense data if needed
        // const response = await api.get('/api/expense');
        // setTransactions(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) =>{
    try{
      console.log(id);
      if(type ==='income'){
        const response = await api.delete(`/api/income/${id}`);
        setIncomeData(incomeData.filter(income => income._id !==id));
        setMessage('Deleted Successfully');
        console.log(response.data);
        setError('');

      }else{
        setTransactions(transactions.filter(transaction => transaction._id !==id))
        setMessage('Deleted Successfully');
        console.log(message);
        setError('');

      }
    }catch(err){
      console.error(err);
      setError(err.response?.data || err.message || 'Something went wrong');
    }

  }

  // Filter transactions based on type
  const filteredTransactions = type === 'income' ? incomeData : transactions;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Recent {type === 'income' ? 'Income' : 'Expenses'}</h2>
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No {type} transactions found
          </div>
        ) : (
          filteredTransactions.map(transaction => (
            <div
              key={transaction._id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium">{transaction.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{transaction.source || transaction.category}</span>
                  <span>•</span>
                  <span>{new Date(transaction.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{transaction.amount.toFixed(2)}
                </p>
                <div className="flex gap-2 mt-1">
                  <button onClick={()=>{setEditId(transaction._id)}} className="text-xs text-blue-600 hover:underline">Edit</button>
                  <button onClick={()=>handleDelete(transaction._id)} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <select className="p-2 border rounded">
          <option>Sort by Date</option>
          <option>Sort by Amount</option>
          <option>Sort by Category</option>
        </select>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Previous</button>
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
}