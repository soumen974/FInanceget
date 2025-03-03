import React, { useState, useEffect } from 'react';
import TransactionForm from "./Components/Income/TransactionForm";
import TransactionList from "./Components/Income/TransactionList";
import { authCheck } from '../Auth/Components/ProtectedCheck';
import {api} from '../AxiosMeta/ApiAxios';
import { Twitter,LightbulbIcon } from 'lucide-react';
import { TrendingUp  } from "react-feather";
import SmartTips from "../affiliates/SmartTips";
import BoosterTips from "../affiliates/BoosterTips";
import StreakBox from "./Components/Income/StreakBox";

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
      <h1 className="text-2xl sm:text-3xl text-gray-900 dark:text-gray-100  font-bold sm:mb-1">
        Income
      </h1>
      <p className="text-[0.7rem] sm:text-sm text-gray-600 dark:text-gray-400 mb-6">
        Monitor your earnings, grow your wealth.
      </p>
    </div>
    <div className="lg:grid grid-cols-1 flex flex-col-reverse lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">

         {/* Streak Feedback */}
         <StreakBox type="income" streak={streak} shareGains={shareGains}/>  
         
        <TransactionList
          type="income"
          action={action}
          setAction={setAction}
          setEditId={setEditId}
          editId={editId}
        />

         {/* Usage: Income Tips - Enhanced with better visual design */}
        
        <BoosterTips type="income" />
        
       
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
        
        
        <SmartTips type="income" />
        
        
       
      </div>
    </div>
  </div>
  );
}