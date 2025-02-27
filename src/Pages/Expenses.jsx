import React, { useState, useEffect } from 'react';
import TransactionForm from "../Pages/Components/Income/TransactionForm";
import TransactionList from "../Pages/Components/Income/TransactionList";
import { authCheck } from '../Auth/Components/ProtectedCheck';
import {api} from '../AxiosMeta/ApiAxios';
import { Twitter } from 'lucide-react';

export default function Expenses() {
  const { isAuthenticated } = authCheck();
  const [action, setAction] = useState('');
  const [editId, setEditId] = useState(null);
  const [streak, setStreak] = useState(0);
  const [latestExpense, setLatestExpense] = useState(null);

  // Fetch streak on load
  const getStreaks = async () => {
       try {
         const response = await api.get('/api/user/streak'); 
         // console.log(response); 
         setStreak(response.data.streak || 0);
       } catch (error) {
         // console.error('Error fetching streak with Axios:', error);
         setStreak(0); 
       }
    };

  useEffect(() => {
    getStreaks();
  }, []);

  // Handle expense add/edit
  const handleTransactionUpdate = (newExpense) => {
    setLatestExpense(newExpense);
    getStreaks(); // Refresh streak after adding expense
  };

  // Share savings to Twitter
  const shareSavings = () => {
    const tweet = latestExpense
      ? `Tracked ₹${latestExpense.amount} on ${latestExpense.source} with FinanceGet! Streak: ${streak}. Join me: https://financeget.vercel.app & save with Honey: https://joinhoney.com/ref/yourcode`
      : `Mastering my budget on FinanceGet! Streak: ${streak}. Join me: https://financeget.vercel.app`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
  };

  return (
    <div className="max-w-7xl pb-6 mx-auto">
      <div>
        <h1 className="sm:text-3xl text-gray-900 dark:text-gray-100 text-xl font-bold mb-2">
          Expenses
        </h1>
        <p className="text-sm mb-6 text-gray-600 dark:text-gray-400">
          Track your spending, master your budget.
        </p>
      </div>
      <div className="lg:grid flex flex-col-reverse grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionList
            type="expense"
            action={action}
            setAction={setAction}
            setEditId={setEditId}
            editId={editId}
          />
          {/* Streak Feedback */}
          <div className="mt-6 p-4 bg-gray-100 dark:bg-[#0a0a0a] rounded-lg shadow-sm border dark:border-[#ffffff24]">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your Expense Tracking Streak:{' '}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{streak} days</span>
            </p>
          </div>
          {/* Limelight: Share Savings */}
          <div className="mt-4">
            <button
              onClick={shareSavings}
              className="group inline-flex gap-2 items-center px-4 py-2 bg-white dark:bg-blue-900 dark:border dark:border-blue-700 text-blue-700 dark:text-white text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors duration-150 shadow-sm"
            >
              Share Your Savings
              <Twitter className='ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200' />
            </button>
          </div>
        </div>
        <div>
          <TransactionForm
            type="expense"
            setAction={setAction}
            action={action}
            setEditId={setEditId}
            editId={editId}
            onUpdate={handleTransactionUpdate}
          />
          {/* Monetization: Affiliate Promotions */}
          <div className="mt-6 p-4 bg-white dark:bg-[#0a0a0a] rounded-lg shadow-sm border border-gray-200 dark:border-[#ffffff24]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Save Smarter
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Cut costs with{' '}
              <a
                href="joinhoney.com/ref/usx3zmv" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Honey—find deals on trading tools
              </a>.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Earn cashback with{' '}
              <a
                href="https://www.axisbank.com/credit-card-affiliate" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Axis Bank Credit Card—up to ₹3500 commission
              </a>.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Budget better with{' '}
              <a
                href="https://www.amazon.in/Rich-Dad-Poor-Robert-Kiyosaki/dp/8186775218?crid=2OD2VAYKIX11A&dib=eyJ2IjoiMSJ9.76jH6QUKUEu95wt1Bogdd3wBLURtKCJdOFERtaNr_a9KFdgIBeQUiXvfwgMTzL70xfWnBDBTKdfdgETXrRDdCs8EBR3uxODVC2u_aiGciadJuMQk4hKzrlHXqiXiuJJBVYoyC6liAkFTFp79oyGSDA.ksXkVP0Js6XTtwiKgEQpkdBYd4wTzZKZUptc1ts4IQM&dib_tag=se&keywords=Rich+Dad+Poor+Dad%E2%80%94top+finance+book.&qid=1740642746&sprefix=%2Caps%2C609&sr=8-1&linkCode=ll1&tag=financegetbys-21&linkId=6de81035b39808d6753fb9aa222190ca&language=en_IN&ref_=as_li_ss_tl" // Replace with your Amazon affiliate link
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Rich Dad Poor Dad—top finance book
              </a>.
            </p>
          </div>
          {/* Usage: Expense Tips */}
          <div className="mt-4 p-4 bg-gray-100 dark:bg-[#0a0a0a] rounded-lg shadow-sm border dark:border-[#ffffff24]">
            <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Expense Tip
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Save on trading fees—use{' '}
              <a
                href="https://zerodha.com/open-account?c=GRY7344"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Zerodha
              </a>{' '}
              and track with FinanceGet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}