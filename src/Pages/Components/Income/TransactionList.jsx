import React, { useEffect, useState } from 'react';
import { api } from "../../../AxiosMeta/ApiAxios";
import {formatCurrency} from "../Income/formatCurrency";

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
  const [GetData, setGetData] = useState([]);
   const [error, setError] = useState('');
   const [message, setMessage] = useState('');
   const [loading,setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, [action]);

  const getData = async () => {
    try {
      if (type === 'income') {
        const response = await api.get('/api/income');
        setGetData(response.data);
        // console.log(response.data);
        setLoading(false);
      } else if (type === 'expense') {
        const response = await api.get('/api/expenses');
        setGetData(response.data);
        setLoading(false);
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
        setGetData(GetData.filter(income => income._id !==id));
        setMessage('Deleted Successfully');
        console.log(response.data);
        setError('');

      }else if(type ==='expense'){
        const response = await api.delete(`/api/expenses/${id}`);
        setGetData(GetData.filter(income => income._id !==id));
        setMessage('Deleted Successfully');
        console.log(response.data);
        setError('');

      }
    }catch(err){
      console.error(err);
      setError(err.response?.data || err.message || 'Something went wrong');
    }

  }

  // to use it in other files
 

  // Filter transactions based on type
  const filteredTransactions =  GetData; 

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Recent {type === 'income' ? 'Income' : 'Expenses'}</h2>
      <div className="space-y-4">
        {loading? <div className="text-center py-4">Loading...</div> : ''}
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
                  {formatCurrency(transaction.amount)} 
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


export const useGlobalTransactionData = (type) => {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        if (type === 'income') {
          const response = await api.get('/api/income');
          setIncomeData(response.data);
          setLoading(false);
        } else if (type === 'expense') {
          const response = await api.get('/api/expenses');
          setExpenseData(response.data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data || err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    getData();
  }, [type]);

  let totalIncome = incomeData.reduce((acc, income) => acc + income.amount, 0);
  const totalExpense = expenseData.reduce((acc, expense) => acc + expense.amount, 0);

  return { totalIncome, incomeData, error, message, loading ,totalExpense, expenseData};
};


