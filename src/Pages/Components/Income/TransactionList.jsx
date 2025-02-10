import React, { useEffect, useState } from 'react';
import { api } from "../../../AxiosMeta/ApiAxios";
import {formatCurrency} from "../Income/formatCurrency";
import ListBoxScalLoadder from "./lodders/ListBoxScalLoadder";
// import DialogBox from "../../../popups/DialogBox";

import { TriangleAlert ,ArrowUpCircle,ArrowDownCircle,Edit2,Trash2 } from 'lucide-react'

const Popupbox = ({title ,loading,HidePopup, setHidePopup,currentId,taskFunction,type}) =>{
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  return(
  <>
  <div  className={`${HidePopup ===currentId?  'flex' : 'hidden'} fixed inset-0   z-30 flex items-center justify-center`}>
  <div className="fixed inset-0 bg-gray-500 dark:bg-[#000000aa] backdrop-blur-[0.01rem]  bg-opacity-75" onClick={() => setHidePopup(true)}></div>
    <div className={` z-20 relative bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff13]   rounded-lg text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg `}>
     
      <div className=" px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div
            className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-600 dark:bg-opacity-20 sm:mx-0 sm:h-10 sm:w-10`}
          >
            
              <TriangleAlert className="h-6 w-6 text-red-600" aria-hidden="true" />

          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Delete {title}</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this {type} data ?</p>
            </div>
          </div>
        </div>
      </div>
      <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button
          className={`inline-flex w-full justify-center rounded-md bg-red-600  hover:bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
          onClick={() => taskFunction(currentId)}
        >
          Delete {loading&& "Loading..."}
        </button>
        <button
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-[#ffffff07] dark:hover:bg-[#ffffff17] dark:ring-[#ffffff24] dark:text-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => setHidePopup(true)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
  </>)
};

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

  const [HidePopup, setHidePopup] = useState(null);
  const [updating5,setupdating5] = useState(0);

  const handlePopupopner = (id) => {
    setHidePopup(HidePopup === id ? null : id);
  };

  const handleDelete = async (id) =>{
    setLoading(true);

    try{
      // console.log(id);
      if(type ==='income'){
        const response = await api.delete(`/api/income/${id}`);
        setGetData(GetData.filter(income => income._id !==id));
        setMessage('Deleted Successfully');
        // console.log(response.data);
        action('delete');
        setError('');

        // if(id==GetData[GetData.length-1]._id){
        //   setupdating5((prev)=>prev-5)
        // }
        setLoading(false);

      }else if(type ==='expense'){
        const response = await api.delete(`/api/expenses/${id}`);
        setGetData(GetData.filter(income => income._id !==id));
        setMessage('Deleted Successfully');
        action('delete');
        // console.log(response.data);
        setError('');

        // if(id==GetData[GetData.length-1]._id){
        //   setupdating5((prev)=>prev-5)
        // }
        setLoading(false);

      }
    }catch(err){
      // console.error(err);
      setLoading(false);
      setError(err.response?.data || err.message || 'Something went wrong');
    }

  }

 

  // to use it in other files
 

  // Filter transactions based on type
  // console.log(updating5);
  const filteredTransactions =  GetData.slice(updating5,updating5+5 ); 
  // show only 5 transactions from the list


  return (
    <div className="bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-gray-200 dark:border-[#ffffff24]">
    {/* Header Section with Refined Design */}
    <div className="border-b border-gray-200 dark:border-[#ffffff24] p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          Recent {type === 'income' ? (
            <>
              Income
              <ArrowUpCircle className="w-5 h-5 text-green-500" />
            </>
          ) : (
            <>
              Expenses
              <ArrowDownCircle className="w-5 h-5 text-red-500" />
            </>
          )}
        </h2>
        <select className="px-3 py-2 text-sm border border-[#00000014] dark:border-[#ffffff24] rounded-lg bg-gray-50 dark:bg-black dark:text-white hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Sort by Date</option>
          <option>Sort by Amount</option>
          <option>Sort by Category</option>
        </select>
      </div>
    </div>
  
    {/* Main Content Area */}
    <div className="p-4 sm:p-6">
      <div className="space-y-3 md:min-h-[55.5vh]">
        {/* Loading State with Smooth Animation */}
        {loading && filteredTransactions.length === 0 && (
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse" style={{ animationDelay: `${index * 150}ms` }}>
                <ListBoxScalLoadder />
              </div>
            ))}
          </div>
        )}
  
        {filteredTransactions.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <div className="h-16 w-16 mb-4">
              {type === 'income' ? (
                <ArrowUpCircle className="w-full h-full text-gray-300" />
              ) : (
                <ArrowDownCircle className="w-full h-full text-gray-300" />
              )}
            </div>
            <p className="text-gray-500 font-medium">No {type} transactions found</p>
            {/* <p className="text-sm text-gray-400 mt-1">Transactions will appear here</p> */}
          </div>
        )}
  
        { filteredTransactions.map(transaction => (
            <div
              key={transaction._id}
              className="group relative flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-[#ffffff24] hover:border-gray-100 hover:shadow-sm transition-all duration-200 dark:bg-[#0a0a0a] dark:hover:bg-[#ffffff06] bg-white"
              >
                <Popupbox HidePopup={HidePopup} type={type} loading={loading} currentId={transaction._id} taskFunction={handleDelete} setHidePopup={setHidePopup} title={transaction.description} />

              
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white truncate">{transaction.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 truncate">
                  <span>{transaction.source || transaction.category}</span>
                  <span>•</span>
                  <span className=''>{(new Date(transaction.date).toLocaleDateString()=== new Date().toLocaleDateString()? 'Today': new Date(transaction.date).toLocaleDateString())}</span>
                  {/* <span>{new (Date()-1).toLocaleDateString()}</span> */}
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(transaction.amount)} 
                </p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setEditId(transaction._id)}
                    className="p-1.5 rounded-lg text-gray-400 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-600 dark:hover:bg-opacity-20 transition-colors"
                    title="Edit transaction"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handlePopupopner(transaction._id)}
                    className="p-1.5 rounded-lg text-gray-400 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-600 dark:hover:bg-opacity-20 transition-colors"
                    title="Delete transaction"
                  >
                    <Trash2 size={16} />
                  </button> 
                </div>
                 
              </div>
            </div>
        ))}
        
        
      </div>
  
      {/* Pagination Footer */}
      <div className="mt-6 border-t border-gray-200 dark:border-[#ffffff24] pt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Showing {updating5 + 1} to {Math.min(updating5 + 5, GetData.length)} of {GetData.length} entries
          </p>
  
          <div className="flex gap-2">
            <button
              disabled={updating5 === 0}
              onClick={() => setupdating5(prev => prev - 5)}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg
                ${updating5 === 0
                ? 'bg-gray-50 dark:bg-black dark:text-[#ffffff24] text-gray-300 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#ffffff17] hover:bg-gray-50 active:bg-gray-100'}
              border border-gray-200 dark:border-[#ffffff24] transition-all duration-200
            `}
            >
              Previous
            </button>
            <button
              disabled={updating5 > (GetData.length - 6)}
              onClick={() => setupdating5(prev => prev + 5)}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg
                ${updating5 > (GetData.length - 6)
                  ? 'bg-gray-50 dark:bg-black dark:text-[#ffffff24] text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#ffffff17] hover:bg-gray-50 active:bg-gray-100'}
                border border-gray-200 dark:border-[#ffffff24] transition-all duration-200
              `}
            >
              Next
            </button>
          </div>
        </div>
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
  const [searchYear, setsearchYearForList] = useState(new  Date().getFullYear());
  const [month, setMonthForList] = useState(new Date().getMonth());

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
        // console.error(err);
        setError(err.response?.data || err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    getData();
  }, [type]);

  const totalIncome = incomeData.reduce((acc, income) => acc + income.amount, 0);
  
  
  const totalIncomeFortheCurrentMonth = incomeData.reduce((acc, income) => {
    const incomeDate = new Date(income.date);
    const incomeYear = incomeDate.getFullYear();
    const currentMonth = month;
    const incomeMonth = incomeDate.getMonth();
    if (incomeYear === searchYear && incomeMonth === currentMonth) {
      return acc + income.amount;
    }
    return acc;
  }, 0);


  const totalExpense = expenseData.reduce((acc, expense) => acc + expense.amount, 0);

  const totalExpenseFortheCurrentMonth = expenseData.reduce((acc, expense) => {
    const expenseDate = new Date(expense.date);
    const currentMonth = month;
    const expenseYear = expenseDate.getFullYear();
    const expenseMonth = expenseDate.getMonth();
    if (expenseYear === searchYear && expenseMonth === currentMonth) {
      return acc + expense.amount;
    }
    return acc;
  }, 0);

  // console.log(month);
  return { totalIncome,totalIncomeFortheCurrentMonth, incomeData, error, message, loading ,totalExpense,totalExpenseFortheCurrentMonth, expenseData, setsearchYearForList,setMonthForList};
};

 



