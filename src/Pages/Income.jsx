import React, { useState, useEffect } from 'react';
import TransactionForm from "./Components/Income/TransactionForm";
import TransactionList from "./Components/Income/TransactionList";
import { authCheck } from '../Auth/Components/ProtectedCheck';
import {api} from '../AxiosMeta/ApiAxios';
import { Twitter,LightbulbIcon } from 'lucide-react';
import { TrendingUp  } from "react-feather";

export default function Income() {
  const { isAuthenticated } = authCheck();
  const [action, setAction] = useState('');
  const [editId, setEditId] = useState(null);
  const [streak, setStreak] = useState(0);
  const [latestIncome, setLatestIncome] = useState(null); // Track latest added income

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

  // Handle income add/edit (passed to TransactionForm)
  const handleTransactionUpdate = (newIncome) => {
    setLatestIncome(newIncome); // Store latest income for sharing
    getStreaks(); // Refresh streak after adding/editing
  };

  // Share to Twitter
  const shareGains = () => {
    const tweet = latestIncome
      ? `Just added ₹${latestIncome.amount} from ${latestIncome.source} on FinanceGet! Streak: ${streak}. Join me: https://financeget.vercel.app  #FinanceGet @Soumen81845556`
      : `Tracking income on FinanceGet! Streak: ${streak}. Join me: https://financeget.vercel.app  #FinanceGet @Soumen81845556`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
  };

  return (
    <div className="max-w-7xl pb-6 mx-auto">
    <div>
      <h1 className="sm:text-3xl text-gray-900 dark:text-gray-100 text-xl font-bold mb-2">
        Income
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Monitor your earnings, grow your wealth.
      </p>
    </div>
    <div className="lg:grid grid-cols-1 flex flex-col-reverse lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">

         {/* Streak Feedback */}
          <div className="mb-4 flex flex-wrap justify-between p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg shadow-sm border dark:border-[#ffffff24]">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Your Income Streak:{' '}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{streak} days</span>
          </p>
            {/* Limelight: Share Savings */}
          <div className="mt-4">
            <button
              onClick={shareGains}
              className="group inline-flex gap-2 items-center px-4 py-2 bg-indigo-50 dark:bg-blue-900 dark:border dark:border-blue-700 text-blue-700 dark:text-white text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors duration-150 shadow-sm"
            >
              Share Your Gains
              <Twitter className='ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200' />
            </button>
          </div>
        </div>
        <TransactionList
          type="income"
          action={action}
          setAction={setAction}
          setEditId={setEditId}
          editId={editId}
        />

         {/* Usage: Income Tips - Enhanced with better visual design */}
         <div className="mt-4 p-5 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg shadow-sm border dark:border-[#ffffff24] transition-shadow duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-20 rounded-full">
              <LightbulbIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Income Boost Tip
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Diversify your gains—trade stocks with Zerodha and save with{' '}
                <a
                  href="joinhoney.com/ref/usx3zmv" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Honey
                </a>
              </p>
            </div>
          </div>
        </div>
       
      </div>
      <div>
        <TransactionForm
          type="income"
          setAction={setAction}
          action={action}
          setEditId={setEditId}
          editId={editId}
          onUpdate={handleTransactionUpdate}
        />

        {/* Monetization: Hybrid Affiliates - Enhanced with icons and better spacing */}
        <div className="mt-6 p-5 bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 dark:bg-opacity-20 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Grow Your Income
            </h3>
          </div>
          
          <div className="space-y-3 ml-2">
            <div className="flex items-center justify-start gap-2">
              <div className="mt-0 flex items-center text-indigo-600 dark:text-indigo-400">•</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Trade actively with{' '}
                <a
                  href="https://zerodha.com/open-account?c=GRY7344"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Zerodha—free demat + 10% share
                </a>
              </p>
            </div>
            
            <div className="flex items-center justify-start gap-2">
              <div className="mt-1 text-indigo-600 dark:text-indigo-400">•</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Earn passively with{' '}
                <a
                  href="https://app.groww.in/v3cO/2czt7plq" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Groww—mutual funds made easy
                </a>
              </p>
            </div>
            
            <div className="flex items-center justify-start gap-2">
              <div className="mt-1 text-indigo-600 dark:text-indigo-400">•</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Gig it up on{' '}
                <a
                  href="https://www.fiverr.com/pe/DB9RkGo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Fiverr—20% commission per signup
                </a>
              </p>
            </div>
          </div>
        </div>
        
       
      </div>
    </div>
  </div>
  );
}