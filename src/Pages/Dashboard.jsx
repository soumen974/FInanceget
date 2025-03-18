import React,{ useEffect, useState ,useMemo} from 'react';
import StatCard from "../Pages/Components/Dashboard/StatCard";
import { formatCurrency } from "./Components/Income/formatCurrency";
import RecentTransactions from "../Pages/Components/Dashboard/RecentTransactions";
import { useGlobalTransactionData } from "../Pages/Components/Income/TransactionList";
import { TrendingUp, Activity, CreditCard } from 'react-feather'; 
import { TrendingDown,ChevronRight ,Crown,FileText,QrCode} from "lucide-react";
import { Link } from 'react-router-dom';
import { authCheck } from '../Auth/Components/ProtectedCheck';
import { api } from "../AxiosMeta/ApiAxios"
import { ReportsData } from './Components/Reports/ReportsData';
import RecommendedTools from "../affiliates/RecommendedTools";
import Streaks from "./Components/Dashboard/Streaks";
import { Helmet } from 'react-helmet';
import DashboardIMG from "../meta/imgs/Dashboard.png";


export default function Dashboard() {
  const { TransactionData, lifeTimeballence } = ReportsData();
  const {  incomeData,allTransactions,totalIncomeForCurrentMonth,totalExpenseForCurrentMonth, error, message, loading } = useGlobalTransactionData('income');
  const {  expenseData } = useGlobalTransactionData('expense');
  const { isAuthenticated, userType,name } = authCheck();
  const [streak, setStreak] = useState(0);
  const [downloading, setDownloading] = useState(false);

  

  const getStreaks = async () => {
    try {
      const response = await api.get('/api/user/streak');
      setStreak(response.data.streak || 0);
    } catch (error) {
      setStreak(0);
    }
  };

  useEffect(() => {
    getStreaks();
  }, []);

  const totalNetSavingsPerYear = useMemo(() =>
    TransactionData.reduce((acc, netSavings) => acc + netSavings.Net_Savings, 0),
    [TransactionData]
  );

  const downloadDailyReport = async () => {
    setDownloading(true);
    try {
      const response = await api.get('/api/user/streak/daily-current-month', {
        responseType: 'blob',
      });
      setDownloading(false);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Daily_Report_${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setDownloading(false);
      console.error('Error downloading report:', error);
    }
  };

  return (
    <>
    <Helmet>
        <title>FinanceGet ~ {name}'s ' Dashboard</title>
      <meta property="og:title" content="FinanceGet" />
      <meta
        property="og:description"
        content="Take control of your financial journey with our all-in-one platform. Track, plan, and grow your wealth with intuitive tools designed for you."
      />
      <meta property="og:image" content="https://financeget.vercel.app/assets/Landing-page-financeGet-iyuiiDPm.png" />
      <meta property="og:url" content="https://financeget.vercel.app/" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="FinanceGet" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="FinanceGet" />
      <meta
        name="twitter:description"
        content="Take control of your financial journey with our all-in-one platform. Track, plan, and grow your wealth with intuitive tools designed for you."
      />
      <meta name="twitter:image" content="https://financeget.vercel.app/assets/tweet-card-tHslKEPd.png" />
      <meta name="twitter:url" content="https://financeget.vercel.app/" />
      </Helmet>
    <div className="max-w-6xl pb-6 mx-auto">
      {/* Dashboard Header - Improved with better spacing and alignment */}
      <div className="flex flex-wrap gap-y-2 items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="mt-1 text-[0.7rem] sm:text-sm text-gray-500 dark:text-gray-400">
            Overview of your financial status
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Current Balance
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(lifeTimeballence.totalBalance)}
          </p>
        </div>
      </div>

      {/* Usage Booster: Streak Notification - Enhanced with better gradient and animations */}
      <Streaks streak={streak} />

      {/* Stats Grid - Improved with better visual hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Balance"
          amount={lifeTimeballence.totalBalance}
          type="balance"
          icon={<Activity className="dark:text-gray-300" />}
        />
        <StatCard
          title="Total Income"
          amount={totalIncomeForCurrentMonth}
          type="income"
          icon={<TrendingUp className="dark:text-gray-300" />}
        />
        <StatCard
          title="Total Expenses"
          amount={totalExpenseForCurrentMonth}
          type="expense"
          icon={<TrendingDown className="dark:text-gray-300" />}
        />
      </div>

      {/* Monetization: Affiliate Links - Enhanced styling */}
      <RecommendedTools />

      {/* Recent Transactions - Added section title */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h2>
        <RecentTransactions
          incomeData={incomeData}
          expenseData={expenseData}
          allTransactions={allTransactions}
          loading={loading}
          className="dark:bg-gray-800 dark:border-[#ffffff24] dark:text-gray-100"
        />
      </div>

      {/* Monetization: Enhanced section with better visual appeal */}
      <div className="mt-8 grid grid-cols-1 gap-6">
        <div className="sm:p-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white rounded-lg shadow-lg border border-blue-400 dark:border-blue-700 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 bg-blue-400 dark:bg-blue-700 bg-opacity-30 p-3 rounded-full">
                <FileText className="h-6 w-6 text-yellow-300" />
              </div>
              <div>
                <h2 className="text-[1rem] md:text-lg font-bold tracking-tight">Download Your Report</h2>
                <p className="mt-1 text-[0.7rem] sm:text-sm text-blue-100">Get a detailed PDF of your transactions for just <span className="text-md font-bold">₹0/-</span> <span className="line-through">₹49/-</span></p>
              </div>
            </div>
            <button
              className="group disabled:cursor-wait inline-flex items-center px-4 py-2 bg-white dark:bg-blue-900 dark:border dark:border-blue-700 text-blue-700 dark:text-white text-[0.7rem] md:text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors duration-150 shadow-sm"
              disabled={downloading}
              onClick={downloadDailyReport}>
              {downloading ? 'Downloading..' : 'Download Now'}
              <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>

        {/* <div className=" fixed md:hidden  bottom-6 right-6">
          <Link to="/scanner">
            <button className="p-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
              <QrCode className="h-6 w-6" />
            </button>
          </Link>
        </div> */}
    </div>
    </>

  );
}