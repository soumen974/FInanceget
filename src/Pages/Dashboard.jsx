// Dashboard.jsx
import React,{ useEffect, useState } from 'react';
import StatCard from "../Pages/Components/Dashboard/StatCard";
import { formatCurrency } from "./Components/Income/formatCurrency";
import RecentTransactions from "../Pages/Components/Dashboard/RecentTransactions";
import { useGlobalTransactionData } from "../Pages/Components/Income/TransactionList";
import { TrendingUp, Activity, CreditCard } from 'react-feather'; 
import { TrendingDown,ChevronRight ,Crown,FileText} from "lucide-react";
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

  const downloadDailyReport = async () => {
    try {
      const response = await api.get('/api/user/streak/daily-current-month', {
        responseType: 'blob', // For PDF download
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Daily_Report_${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };
  

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
        <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white rounded-lg shadow-lg border border-blue-400 dark:border-blue-700">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-blue-400 dark:bg-blue-700 bg-opacity-30 p-3 rounded-full">
              <FileText className="h-6 w-6 text-yellow-300" />
            </div>
          <div>
              <h2 className="text-lg font-bold tracking-tight">Download Your Report</h2>
              <p className="mt-1 text-sm text-blue-100">Get a detailed PDF of your transactions for just ₹49/-.</p>
              <button 
                className="group mt-3 inline-flex items-center px-4 py-2 bg-white dark:bg-blue-900 dark:border dark:border-blue-700 text-blue-700 dark:text-white text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors duration-150 shadow-sm"
                onClick={downloadDailyReport}              >
                Download Now
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />

              </button>
            </div>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white rounded-lg shadow-lg border border-blue-400 dark:border-blue-700">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-blue-400 dark:bg-blue-700 bg-opacity-30 p-3 rounded-full">
              <Crown className="h-6 w-6 text-yellow-300" />
            </div>
            
            <div className="flex-grow">
              <h2 className="text-lg font-bold tracking-tight">Go Premium</h2>
              <p className="mt-1 text-sm text-blue-100">
                {userType === 'user' 
                  ? 'Unlock multi-year reports and custom budgets for ₹2.4/month.'
                  : 'You’re a Premium user—enjoy all features!'}
              </p>
              
              {userType === 'user' && (
                <div className="mt-3">
                  <Link 
                    to="/upgrade" 
                    className="group inline-flex items-center px-4 py-2 bg-white dark:bg-blue-900 dark:border dark:border-blue-700 text-blue-700 dark:text-white text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors duration-150 shadow-sm"
                  >
                    Upgrade Now
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}