import React, { useEffect, useState } from 'react';
import { api } from "../../../AxiosMeta/ApiAxios";
import {formatCurrency} from "../Income/formatCurrency";
import ListBoxScalLoadder from "./lodders/ListBoxScalLoadder";
// import DialogBox from "../../../popups/DialogBox";


const Popupbox = ({title ,HidePopup, setHidePopup,currentId,taskFunction}) =>{
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  return(
  <>
  <div  className="">
    <div className={`${HidePopup ===currentId?  'flex' : 'hidden'} z-20 md:absolute fixed inset-0 bg-zinc-00/95 backdrop-blur-sm rounded-lg flex items-center justify-center p-6 `}>
      <div className="text-center">
        <p className="text-zinc-900/95 mb-1">Are you sure you want to delete these {title} data ?</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setHidePopup(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => taskFunction(currentId)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-all"
          >
            Delete
          </button>
        </div>
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

  const handleDelete = async (id) =>{
    try{
      // console.log(id);
      if(type ==='income'){
        const response = await api.delete(`/api/income/${id}`);
        setGetData(GetData.filter(income => income._id !==id));
        setMessage('Deleted Successfully');
        // console.log(response.data);
        setError('');

      }else if(type ==='expense'){
        const response = await api.delete(`/api/expenses/${id}`);
        setGetData(GetData.filter(income => income._id !==id));
        setMessage('Deleted Successfully');
        // console.log(response.data);
        setError('');

      }
    }catch(err){
      console.error(err);
      setError(err.response?.data || err.message || 'Something went wrong');
    }

  }

  const handlePopupopner = (id) => {
    setHidePopup(HidePopup === id ? null : id);
  };

  // to use it in other files
 

  // Filter transactions based on type
  const filteredTransactions =  GetData; 


  return (
    <div className="bg-white rounded-lg shadow  sm:p-6 p-2">
      <h2 className="text-md sm:text-xl font-semibold mb-4">Recent {type === 'income' ? 'Income' : 'Expenses'}</h2>
      <div className="space-y-4">
        {loading? 
        <>
        <ListBoxScalLoadder/>
        <ListBoxScalLoadder/>
        </>
        : ''}
        

        {filteredTransactions.length === 0 && !loading ? (
          <div className="text-center py-4 text-gray-500">
            No {type} transactions found
          </div>
        ) : (
          filteredTransactions.map(transaction => (
            <div
              key={transaction._id}
              className="flex md:relative items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* <div className="relative"> */}
                <Popupbox HidePopup={HidePopup} currentId={transaction._id} taskFunction={handleDelete} setHidePopup={setHidePopup} title={type} />
              {/* </div> */}

              
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
                  <button onClick={()=>{handlePopupopner(transaction._id)}} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
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

      {/* <DialogBox Loading={Loading} 
  open={openDiologBox}
  IconName={IconName}
    title={'Save changes Permanently'} 
    message={'Are you sure you want to save the changes?'}
      ActionButtonName={'Save Changes'}
      ActionButtonColorRed={false} 
      setOpen={setOpenDiologBox} 
      handleLogic={handleSaveChanges}
  /> */}
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

  const totalIncome = incomeData.reduce((acc, income) => acc + income.amount, 0);

  const totalIncomeFortheCurrentMonth = incomeData.reduce((acc, income) => {
    const incomeDate = new Date(income.date);
    const currentMonth = new Date().getMonth();
    const incomeMonth = incomeDate.getMonth();
    if (incomeMonth === currentMonth) {
      return acc + income.amount;
    }
    return acc;
  }, 0);

  const totalExpense = expenseData.reduce((acc, expense) => acc + expense.amount, 0);

  const totalExpenseFortheCurrentMonth = expenseData.reduce((acc, expense) => {
    const expenseDate = new Date(expense.date);
    const currentMonth = new Date().getMonth();
    const expenseMonth = expenseDate.getMonth();
    if (expenseMonth === currentMonth) {
      return acc + expense.amount;
    }
    return acc;
  }, 0);

  return { totalIncome,totalIncomeFortheCurrentMonth, incomeData, error, message, loading ,totalExpense,totalExpenseFortheCurrentMonth, expenseData};
};




