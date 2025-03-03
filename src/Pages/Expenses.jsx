import React, { useState, useEffect } from 'react';
import TransactionForm from "../Pages/Components/Income/TransactionForm";
import TransactionList from "../Pages/Components/Income/TransactionList";
import { authCheck } from '../Auth/Components/ProtectedCheck';
import {api} from '../AxiosMeta/ApiAxios';
import { Twitter ,PiggyBank,LightbulbIcon} from 'lucide-react';
import StreakBox from "./Components/Income/StreakBox";
import SmartTips from "../affiliates/SmartTips";
import BoosterTips from "../affiliates/BoosterTips";

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
      ? `Tracked ₹${latestExpense.amount} on ${latestExpense.source} with FinanceGet! Streak: ${streak}. Join me: https://financeget.vercel.app & save with Honey: https://joinhoney.com/ref/yourcode  #FinanceGet @Soumen81845556`
      : `Mastering my budget on FinanceGet! Streak: ${streak}. Join me: https://financeget.vercel.app  #FinanceGet @Soumen81845556`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
  };

  return (
    <div className="max-w-7xl pb-6 mx-auto">
      <div>
        <h1 className="sm:text-3xl text-gray-900 dark:text-gray-100 text-xl font-bold sm:mb-1">
          Expenses
        </h1>
        <p className="text-[0.7rem] sm:text-sm mb-6 text-gray-600 dark:text-gray-400">
          Track your spending, master your budget.
        </p>
      </div>
      <div className="lg:grid flex flex-col-reverse grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">

           {/* Streak Feedback */}
          <StreakBox type="expense" streak={streak} shareGains={shareSavings}/>  
          
          <TransactionList
            type="expense"
            action={action}
            setAction={setAction}
            setEditId={setEditId}
            editId={editId}
          />

           {/* Usage: Expense Tips - Enhanced with better visual styling */}
           

          <BoosterTips type="expense" />
         
         
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

          <SmartTips type="expense" />








        </div>
      </div>
    </div>
  );
}