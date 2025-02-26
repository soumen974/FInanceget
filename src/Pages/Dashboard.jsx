// Dashboard.jsx
import React,{ useEffect, useState } from 'react';
import StatCard from "../Pages/Components/Dashboard/StatCard";
import { formatCurrency } from "./Components/Income/formatCurrency";
import RecentTransactions from "../Pages/Components/Dashboard/RecentTransactions";
import { useGlobalTransactionData } from "../Pages/Components/Income/TransactionList";
import { TrendingUp, Activity, CreditCard } from 'react-feather'; 
import { TrendingDown } from "lucide-react";
import { Link } from 'react-router-dom';
import { authCheck } from '../Auth/Components/ProtectedCheck';
import { api } from "../AxiosMeta/ApiAxios"
export default function Dashboard() {
  const { totalIncomeFortheCurrentMonth, incomeData, error, message, loading } = useGlobalTransactionData('income');
  const { totalExpenseFortheCurrentMonth, expenseData } = useGlobalTransactionData('expense');
  const { isAuthenticated,userType } = authCheck();
  const [streak, setStreak] = useState(0);

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
  

  useEffect(()=>{getStreaks()},[])
  

  return (
    <div className="max-w-6xl pb-6 mx-auto">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Overview of your financial status
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Current Balance
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(totalIncomeFortheCurrentMonth - totalExpenseFortheCurrentMonth)}
          </p>
        </div>
      </div>

      {/* Usage Booster: Streak Notification */}
      <div className="mb-6 p-6 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff24] rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Your Money Streak
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {streak > 0 
            ? `Nice! You’ve logged in ${streak} days straight. Keep it up!`
            : `Start tracking daily to build your streak!`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Balance"
          amount={totalIncomeFortheCurrentMonth - totalExpenseFortheCurrentMonth}
          type="balance"
          icon={<Activity className="dark:text-gray-300" />}
        />
        <StatCard 
          title="Total Income"
          amount={totalIncomeFortheCurrentMonth}
          type="income"
          icon={<TrendingUp className="dark:text-gray-300" />}
        />
        <StatCard 
          title="Total Expenses"
          amount={totalExpenseFortheCurrentMonth}
          type="expense"
          icon={<TrendingDown className="dark:text-gray-300" />}
        />
      </div>

      {/* Monetization: Affiliate Links */}
      <div className="mb-8 p-6 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff24] rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Recommended Tools
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Learn trading with{' '}
          <a 
            href="https://www.amazon.in/Financial-Statement-Analysis-Handbook-ZebraLearn/dp/8195895077?content-id=amzn1.sym.288d7cd9-bdfb-4778-882a-c15de0f76151%3Aamzn1.sym.288d7cd9-bdfb-4778-882a-c15de0f76151&crid=26ZU6ASO9Q43R&cv_ct_cx=finance+books+50+30+20+rules&keywords=finance+books+50+30+20+rules&pd_rd_i=8195895077&pd_rd_r=7a572262-4405-4d43-886a-a03417a6344a&pd_rd_w=WBfLv&pd_rd_wg=H5eGC&pf_rd_p=288d7cd9-bdfb-4778-882a-c15de0f76151&pf_rd_r=S5JT6B90R0G4X9B0A7XZ&qid=1740588213&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sprefix=finance+books+50+30+20+rule%2Caps%2C1988&sr=1-1-9131241a-a358-4619-a7b8-0f5a65d91d81&linkCode=ll1&tag=financegetbys-21&linkId=5428e948533236cb005d4a454e71e7d5&language=en_IN&ref_=as_li_ss_tl" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            top finance books
          </a>{' '}
          or trade smarter with{' '}
          <a 
            href="https://zerodha.com/open-account?c=GRY7344" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Zerodha—free demat + 10% brokerage share
          </a>.
        </p>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions 
        incomeData={incomeData} 
        expenseData={expenseData} 
        loading={loading}
        className="dark:bg-gray-800 dark:border-[#ffffff24] dark:text-gray-100"
      />

      {/* Monetization: Micro-Transaction + Premium Teaser */}
      {/* Monetization: Micro-Transaction + Premium Teaser */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gradient-to-r from-blue-500 dark:bg-blue-500 dark:bg-opacity-20 to-blue-700 text-white rounded-b-lg">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l1.09 3.41L16.5 10l-3.41 1.09L12 14l-1.09-3.41L7.5 10l3.41-1.09L12 2z" />
            </svg>
            <div>
              <h2 className="text-base font-semibold">Download Your Report</h2>
              <p className="mt-1 text-xs">Get a detailed PDF of your transactions for just $2.</p>
              <button 
                className="mt-2 inline-block px-2 py-1 bg-white dark:bg-black dark:text-white text-blue-700 text-xs font-medium rounded hover:bg-gray-100"
                onClick={() => window.location.href = '/api/payment/report?type=pdf'} // Replace with Stripe link
              >
                Download Now
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-blue-500 dark:bg-blue-500 dark:bg-opacity-20 to-blue-700 text-white rounded-b-lg">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l1.09 3.41L16.5 10l-3.41 1.09L12 14l-1.09-3.41L7.5 10l3.41-1.09L12 2z" />
            </svg>
            <div>
              <h2 className="text-base font-semibold">Go Premium</h2>
              <p className="mt-1 text-xs">
                {userType === 'user' 
                  ? 'Unlock multi-year reports and custom budgets for $5/month.'
                  : 'You’re a Premium user—enjoy all features!'}
              </p>
              {userType === 'user' && (
                <Link 
                  to="/upgrade" 
                  className="mt-2 inline-block px-2 py-1 bg-white dark:bg-black dark:text-white text-blue-700 text-xs font-medium rounded hover:bg-gray-100"
                >
                  Upgrade Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}