import React, { useEffect, useState, useRef } from 'react';
import { api } from "../../../AxiosMeta/ApiAxios";
import { formatCurrency } from "../Income/formatCurrency";
import ListBoxScalLoadder from "./lodders/ListBoxScalLoadder";
import { TriangleAlert, ArrowUpCircle, ArrowDownCircle, Edit2, Trash2, MoreVertical } from 'lucide-react';

const Popupbox = ({ title, loading, HidePopup, setHidePopup, currentId, taskFunction, type }) => {
  return (
    <>
      <div className={`${HidePopup === currentId ? 'flex' : 'hidden'} fixed inset-0 z-30 flex items-center justify-center`}>
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center" onClick={() => setHidePopup(true)}></div>
        <div className={`z-20 relative bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff13] rounded-lg text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg`}>
          <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-600 dark:bg-opacity-20 sm:mx-0 sm:h-10 sm:w-10`}>
                <TriangleAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Delete {title}</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this {type} data?</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              className={`inline-flex w-full justify-center rounded-md bg-red-600 hover:bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
              onClick={() => taskFunction(currentId)}
            >
              Delete {loading && "Loading..."}
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
    </>
  );
};

export default function TransactionList({ type, action, setAction, setEditId, editId }) {
  const [GetData, setGetData] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getData();
  }, [action, currentPage]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = type === 'income'
        ? await api.get(`/api/income?page=${currentPage}`)
        : await api.get(`/api/expenses?page=${currentPage}`);

      setGetData(response.data[type === 'income' ? 'incomes' : 'expenses']);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  };

  const [HidePopup, setHidePopup] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

  const handlePopupopner = (id) => {
    setHidePopup(HidePopup === id ? null : id);
  };

  const handleMenuClick = (id) => {
    setShowMenu(showMenu === id ? null : id);
  };

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      const response = type === 'income'
        ? await api.delete(`/api/income/${id}`)
        : await api.delete(`/api/expenses/${id}`);

      setGetData(GetData.filter(item => item._id !== id));
      setMessage('Deleted Successfully');
      action('delete');
      setError('');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data || err.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null);
      }
    };
    document.body.addEventListener('click', handleClickOutside);
    return () => document.body.removeEventListener('click', handleClickOutside);
  }, []);

  const renderTransactions = GetData.map(transaction => (
    <div
      key={transaction._id}
      className="group relative flex items-center justify-between p-3 md:p-4 md:pr-1 rounded-xl border border-gray-200 dark:border-[#ffffff24] hover:border-gray-100 hover:shadow-sm transition-all duration-200 dark:bg-[#0a0a0a] dark:hover:bg-[#ffffff06] bg-white"
    >
      <Popupbox HidePopup={HidePopup} type={type} loading={loading} currentId={transaction._id} taskFunction={handleDelete} setHidePopup={setHidePopup} title={transaction.description} />

      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-white max-sm:truncate max-sm:w-[6.2rem]">{transaction.description}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 truncate">
          <span className='max-md:truncate max-md:w-[4rem]'>{transaction.source || transaction.category}</span>
          <span>•</span>
          <span className='max-md:truncate max-md:w-[4rem]'>{(new Date(transaction.date).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : new Date(transaction.date).toLocaleDateString())}</span>
        </div>
      </div>
      <div className="text-right flex max-md:flex-col justify-center items-center md:gap-1">
        <p className={`font-bold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(transaction.amount)}
        </p>

        <div className="flex gap-2 mt-1">
          <button
            onClick={(e) => { e.stopPropagation(); handleMenuClick(transaction._id); }}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#ffffff17] transition-colors duration-150"
          >
            <MoreVertical size={16} className="text-gray-500 dark:text-gray-400 max-md:rotate-90" />
          </button>
          {showMenu === transaction._id && (
            <div
              ref={menuRef}
              onClick={() => { setShowMenu(null); }}
              className={`
                absolute right-0 mt-2 w-24 rounded-xl shadow-lg py-2 px-1.5
                bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff24]
                z-10 transform scale-95 animate-in
                data-[state=open]:opacity-100 data-[state=open]:scale-100
                transition-all duration-200 ease-out
              `}
            >
              <button
                onClick={() => setEditId(transaction._id)}
                className="w-full flex items-center gap-2 p-2 rounded-lg
                  text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300
                  hover:bg-blue-50 dark:hover:bg-blue-600 dark:hover:bg-opacity-20
                  transition-colors duration-150 group"
                title="Edit transaction"
              >
                <Edit2
                  size={16}
                  className="group-hover:scale-110 transition-transform duration-150"
                />
                <span className="text-sm font-medium">Edit</span>
              </button>
              <button
                onClick={() => handlePopupopner(transaction._id)}
                className="w-full flex items-center gap-2 p-2 rounded-lg mt-1
                  text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-300
                  hover:bg-red-50 dark:hover:bg-red-600 dark:hover:bg-opacity-20
                  transition-colors duration-150 group"
                title="Delete transaction"
              >
                <Trash2
                  size={16}
                  className="group-hover:scale-110 transition-transform duration-150"
                />
                <span className="text-sm font-medium">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  ));

  return (
    <div className="bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-gray-200 dark:border-[#ffffff24]">
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
      <div className="p-4 sm:p-6">
        <div className="md:space-y-3 space-y-2 min-h-[46vh] md:min-h-[48.8vh]">
          {loading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse" style={{ animationDelay: `${index * 150}ms` }}>
                  <ListBoxScalLoadder />
                </div>
              ))}
            </div>
          )}
          {GetData.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <div className="h-16 w-16 mb-4">
                {type === 'income' ? (
                  <ArrowUpCircle className="w-full h-full text-gray-300" />
                ) : (
                  <ArrowDownCircle className="w-full h-full text-gray-300" />
                )}
              </div>
              <p className="text-gray-500 font-medium">No {type} transactions found</p>
            </div>
          )}
          {!loading && renderTransactions}
        </div>
        <div className="mt-6 border-t border-gray-200 dark:border-[#ffffff24] pt-3 md:pt-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Showing page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => {setCurrentPage(prev => prev - 1);setLoading(true);}}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg
                  ${currentPage === 1
                  ? 'bg-gray-50 dark:bg-black dark:text-[#ffffff24] text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#ffffff17] hover:bg-gray-50 active:bg-gray-100'}
                border border-gray-200 dark:border-[#ffffff24] transition-all duration-200
              `}
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => {setCurrentPage(prev => prev + 1);setLoading(true);}}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg
                  ${currentPage === totalPages
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
  const [totalIncomeForCurrentMonth, setTotalIncomeForCurrentMonth] = useState(0);
  const [totalExpenseForCurrentMonth, setTotalExpenseForCurrentMonth] = useState(0);
  const[allTransactions,setAllTransactions]=useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        if (type === 'income') {
          const response = await api.get('/api/income/incomedata');
          setIncomeData(response.data.Wholeincomes);
          setTotalIncomeForCurrentMonth(response.data.totalIncomeForCurrentMonth);
          setTotalExpenseForCurrentMonth(response.data.totalExpenseForCurrentMonth);
          // console.log(response.data.allTransactions);
          setAllTransactions(response.data.allTransactions);
          setLoading(false);
        } else if (type === 'expense') {
          const response = await api.get('/api/expenses/expesnsesdata');
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
  return {totalIncomeForCurrentMonth,totalExpenseForCurrentMonth,allTransactions, totalIncome,totalIncomeFortheCurrentMonth, incomeData, error, message, loading ,totalExpense,totalExpenseFortheCurrentMonth, expenseData, setsearchYearForList,setMonthForList};
};
 



