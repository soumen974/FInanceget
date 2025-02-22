import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';
import { useGlobalTransactionData } from './Components/Income/TransactionList';
import { formatCurrency } from './Components/Income/formatCurrency';
import { useMediaQuery } from 'react-responsive';
import { ReportsData } from './Components/Reports/ReportsData';
import { TrendingUp, PieChart as PieChartIcon, BarChart2, Calendar } from 'react-feather';
import { authCheck } from "../Auth/Components/ProtectedCheck";
import Spinner from "../Loaders/Spinner";


// Constants
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#A133FF', '#FFCE56'];

const Reports = () => {
  const isSm = useMediaQuery({ query: '(max-width: 640px)' });
  const { userType } = authCheck();

  const DemoTransactionData = [
    { name: 'Jan', income: 2400, expense: 1000, Net_Savings: 1400 },
    { name: 'Feb', income: 2000, expense: 1398, Net_Savings: 1198 },
    { name: 'Mar', income: 9800, expense: 2000, Net_Savings: 7800 },
    { name: 'Apr', income: 3908, expense: 2000, Net_Savings: 1908 },
    { name: 'May', income: 4800, expense: 3000, Net_Savings: 1800 },
    { name: 'Jun', income: 4500, expense: 3800, Net_Savings: 700 },
    { name: 'Jul', income: 4500, expense: 3800, Net_Savings: 700 },
  ];

  const DemocategoryData = [{ name: 'No data found', value: 404 }];

  const {
    TransactionData,
    errorReports,
    messageReports,
    loadingReport,
    Availableyears,
    searchYear,
    setsearchYear,
    setMonth,
    categoryData = { categoryIncomeData: [], categoryExpenseData: [] }
  } = ReportsData();

  const { totalIncome, error: incomeError, loading: incomeLoading } = useGlobalTransactionData('income');
  const { totalExpense, loading: expenseLoading } = useGlobalTransactionData('expense');

  const currentYear = new Date().getFullYear();
  const [dateRange, setDateRange] = useState(currentYear);
  const [dateRangeMonth, setDateRangeMonth] = useState(new Date().getMonth());
  const [reportType, setReportType] = useState('Income');
  const [trendChartType, setTrendChartType] = useState('lineChart');
  const [categoryChartType, setCategoryChartType] = useState('PieChart');

  // Memoized Data
  const years = useMemo(() => Availableyears.length > 0 ? Availableyears : [currentYear, currentYear - 1], [Availableyears]);
  const monthsForIncome = useMemo(() => 
    TransactionData.filter(month => (reportType === 'Income' ? month.income : month.expense) > 0).map(month => month.name),
    [TransactionData, reportType]
  );

  const totalExpensePerYear = useMemo(() => 
    TransactionData.reduce((acc, expense) => acc + expense.expense, 0), 
    [TransactionData]
  );
  const totalIncomePerYear = useMemo(() => 
    TransactionData.reduce((acc, income) => acc + income.income, 0), 
    [TransactionData]
  );
  const totalNetSavingsPerYear = useMemo(() => 
    TransactionData.reduce((acc, netSavings) => acc + netSavings.Net_Savings, 0), 
    [TransactionData]
  );

  const actualData = reportType === 'Income' ? categoryData.categoryIncomeData : categoryData.categoryExpenseData;
  const Data = actualData?.length === 0 ? DemocategoryData : actualData;

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setsearchYear(dateRange);
      setMonth(dateRangeMonth);
    }, 300); // Debounce for 300ms
    return () => clearTimeout(debounceTimeout);
  }, [dateRange, dateRangeMonth, setsearchYear, setMonth]);

  const isPremiumLocked = dateRange !== currentYear && userType !== 'premium';

  return (
    <div className="max-w-6xl pb-6 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Financial Reports
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Visualize your financial performance and trends
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="grid">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Year</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(Number(e.target.value))}
                className="mt-1 px-4 py-2.5 bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-gray-200 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {years.map((year, i) => (
                  <option key={year} value={year}>
                    {year} {i > 0 && userType !== 'premium' ? '💎' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Analytics</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="mt-1 px-4 py-2.5 bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-gray-200 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="Income">Income</option>
                <option value="Expenses">Expenses</option>
                <option value="Net Savings">Savings</option>
                <option value="whole">Combined</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error Handling */}
      {(errorReports || incomeError) && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400">
          {errorReports || incomeError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <div className="bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
          <div className="p-6 border-b dark:border-[#ffffff24] border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg  bg-blue-50 dark:bg-blue-600 text-blue-600 ${reportType==='Expenses'&& 'bg-yellow-50 dark:bg-yellow-600 text-yellow-600'} ${reportType==='Net Savings'&& 'bg-purple-50 dark:bg-purple-600 text-purple-600'}  dark:bg-opacity-20 `}>
                 {reportType==='Income'&& <TrendingUp size={20} />}
                 {reportType==='Net Savings'&& <Calendar size={20} />}
                 {reportType==='Expenses'&& <BarChart2 size={20} />}
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {reportType} Trends
                </h2>
              </div>
              <select
                value={trendChartType}
                onChange={(e) => setTrendChartType(e.target.value)}
                className="mt-1 px-4 py-2 bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-gray-200 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="lineChart">Line Chart</option>
                <option value="BarChart">Bar Chart</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            <div className="h-[300px] sm:h-[400px] relative">
              {(loadingReport || incomeLoading || expenseLoading) ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner />
                </div>
              ) : (
                <>
                  {isPremiumLocked && (
                    <div className="absolute inset-0 z-20 backdrop-blur-sm bg-opacity-75 flex items-center justify-center">
                      <div className="p-6 bg-gradient-to-r from-blue-500 dark:bg-blue-500 dark:bg-opacity-20 to-blue-700 text-white rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold">Unlock Premium Features</h2>
                        <p className="mt-2 text-base">Access historical data with a premium plan.</p>
                        <button className="mt-4 px-4 py-2 bg-white dark:bg-black dark:text-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100">Upgrade Now</button>
                      </div>
                    </div>
                  )}
                  <ResponsiveContainer width="100%" height="100%">
                    {trendChartType === 'lineChart' ? (
                      <LineChart data={TransactionData.length === 0 ? DemoTransactionData : TransactionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                        {reportType === 'whole' && (
                          <>
                            <Line type="monotone" dataKey="income" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="expense" stroke="#F97316" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Net_Savings" stroke="#9333ea" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                          </>
                        )}
                        {reportType === 'Income' && <Line type="monotone" dataKey="income" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />}
                        {reportType === 'Expenses' && <Line type="monotone" dataKey="expense" stroke="#F97316" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />}
                        {reportType === 'Net Savings' && <Line type="monotone" dataKey="Net_Savings" stroke="#9333ea" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />}
                      </LineChart>
                    ) : (
                      <BarChart data={TransactionData.length === 0 ? DemoTransactionData : TransactionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                        {reportType === 'whole' && (
                          <>
                            <Bar dataKey="income" fill="#4F46E5" />
                            <Bar dataKey="expense" fill="#F97316" />
                            <Bar dataKey="Net_Savings" fill="#22C55E" />
                          </>
                        )}
                        {reportType === 'Income' && <Bar dataKey="income" fill="#4F46E5" />}
                        {reportType === 'Expenses' && <Bar dataKey="expense" fill="#F97316" />}
                        {reportType === 'Net Savings' && <Bar dataKey="Net_Savings" fill="#22C55E" />}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
          <div className="p-6 border-b dark:border-[#ffffff24] border-gray-100">
            <div className="flex max-sm:flex-wrap gap-y-3 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-600 dark:bg-opacity-25 text-purple-600">
                  <PieChartIcon size={20} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Category Distribution
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={categoryChartType}
                  onChange={(e) => setCategoryChartType(e.target.value)}
                  className="mt-1 px-4 py-2 bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-gray-200 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="PieChart">Pie Chart</option>
                  <option value="BarChart">Bar Chart</option>
                </select>
                <select
                  value={dateRangeMonth}
                  onChange={(e) => setDateRangeMonth(Number(e.target.value))}
                  className="mt-1 px-4 py-2 bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-gray-200 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  {monthsForIncome.map((month, index) => (
                    <option key={index} value={MONTH_NAMES.indexOf(month)}>{month}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-[300px] sm:h-[400px] relative">
              {loadingReport ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner />
                </div>
              ) : (
                <>
                  {isPremiumLocked && (
                    <div className="absolute inset-0 z-20 backdrop-blur-sm bg-opacity-75 flex items-center justify-center">
                      <div className="p-6 bg-gradient-to-r from-blue-500 dark:bg-blue-500 dark:bg-opacity-20 to-blue-700 text-white rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold">Unlock Premium Features</h2>
                        <p className="mt-2 text-base">Access detailed category data with a premium plan.</p>
                        <button className="mt-4 px-4 py-2 bg-white dark:bg-black dark:text-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100">Upgrade Now</button>
                      </div>
                    </div>
                  )}
                  <ResponsiveContainer width="100%" height="100%">
                    {categoryChartType === 'PieChart' ? (
                      <RechartsPieChart>
                        <Pie
                          data={Data}
                          cx="50%"
                          cy="50%"
                          outerRadius={isSm ? 50 : 100}
                          innerRadius={isSm ? 30 : 60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {Data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    ) : (
                      <BarChart data={Data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                        <Bar dataKey="value" fill="#8884d8">
                          {Data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-600 dark:bg-opacity-20">
                <BarChart2 className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalExpensePerYear)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-600 dark:bg-opacity-20">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalIncomePerYear)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-600 dark:bg-opacity-20">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Savings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalNetSavingsPerYear)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

const styles = `
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;