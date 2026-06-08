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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


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

  // Calculate daily expenses for the current month only
  const dailyExpenseData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const dailyMap = Array.from({ length: daysInMonth }, (_, idx) => ({
      day: `${idx + 1}`,
      amount: 0
    }));

    if (Array.isArray(expenseData)) {
      expenseData.forEach(expense => {
        const expDate = new Date(expense.date);
        if (expDate.getFullYear() === currentYear && expDate.getMonth() === currentMonth) {
          const dayNum = expDate.getDate();
          if (dayNum >= 1 && dayNum <= daysInMonth) {
            dailyMap[dayNum - 1].amount += expense.amount;
          }
        }
      });
    }

    return dailyMap;
  }, [expenseData]);

  const currentMonthName = useMemo(() => {
    return new Date().toLocaleString('default', { month: 'long' });
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
        <title>FinanceGet ~ {name}'s Dashboard</title>
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

      {/* Daily Expense Trend Chart */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#ffffff24] p-4 sm:p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-wrap gap-2 justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-500" />
              {currentMonthName} Daily Expense Trend
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Daily spending breakdown for the current month
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total Month Expenses
            </span>
            <p className="text-lg font-bold text-red-600 dark:text-red-500">
              {formatCurrency(totalExpenseForCurrentMonth)}
            </p>
          </div>
        </div>

        <div className="h-[250px] sm:h-[300px] w-full">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailyExpenseData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-[#ffffff10]" />
                <XAxis 
                  dataKey="day" 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                  tick={{ fill: '#888888', fontSize: 11 }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  dx={-5}
                  tick={{ fill: '#888888', fontSize: 11 }}
                  tickFormatter={(val) => formatCurrency(val).replace('₹', '')}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#334155',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value) => [formatCurrency(value), 'Expense']}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorExpense)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
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