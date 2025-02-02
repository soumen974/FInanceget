import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useGlobalTransactionData } from './Components/Income/TransactionList';
import { formatCurrency } from './Components/Income/formatCurrency';
import { useMediaQuery } from 'react-responsive';
import { ReportsData } from './Components/Reports/ReportsData';
import { TrendingUp, PieChart as PieChartIcon, BarChart2, Calendar } from 'react-feather';

export default function Reports() {
  // Your existing state and hooks...

  const isSm = useMediaQuery({ query: '(max-width: 640px)' });

  const DemoTransactionData = [
    { name: 'Jan', income: 2400, expense: 1000, Net_Savings: 1400 },
    { name: 'Feb', income: 2000, expense: 1398, Net_Savings: 1198 },
    { name: 'Mar', income: 9800, expense: 2000, Net_Savings: 7800 },
    { name: 'Apr', income: 3908, expense: 2000, Net_Savings: 1908 },
    { name: 'May', income: 4800, expense: 3000, Net_Savings: 1800 },
    { name: 'Jun', income: 4500, expense: 3800, Net_Savings: 700 },
    { name: 'Jul', income: 4500, expense: 3800, Net_Savings: 700 },
  ];


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

  const currentYear = new Date().getFullYear();
  const lastYear = new Date().getFullYear() - 1;

  const { totalIncome, error, message, loading } = useGlobalTransactionData('income');
  const { totalExpense } = useGlobalTransactionData('expense');

  const [dateRange, setDateRange] = useState(currentYear);
  const [dateRangeMonth, setDateRangeMonth] = useState(0);
  const [reportType, setReportType] = useState('Income');

  const years = Availableyears.length > 0 ? Availableyears : [currentYear, lastYear];
  const totalExpensePerYear = TransactionData.reduce((acc, expense) => acc + expense.expense, 0);
  const totalIncomePerYear = TransactionData.reduce((acc, income) => acc + income.income, 0);
  const totalNetSavingsPerYear = TransactionData.reduce((acc, netSavings) => acc + netSavings.Net_Savings, 0);

  useEffect(() => {
    setsearchYear(dateRange);
    setMonth(dateRangeMonth);
    // console.log("Date Range Month:", dateRangeMonth);
  }, [dateRange, setsearchYear, dateRangeMonth]);

  const DemocategoryData = [
    // { name: 'Food', value: 400 },
    // { name: 'Transport', value: 300 },
    // { name: 'Entertainment', value: 300 },
    // { name: 'Utilities', value: 200 },
    // { name: 'another-1', value: 200 },
    // { name: 'another-2', value: 200 },
    { name: 'No data found', value: 404 },

  ];

  // Ensure actualData is defined before checking its length
  const actualData = (reportType === 'Income') ? categoryData.categoryIncomeData : categoryData.categoryExpenseData;  const Data = (actualData?.length === 0) ? DemocategoryData : actualData;
  // console.log("Category Data: ", categoryData);
  // console.log("Data used: ", Data);
  const monthsForIncome = TransactionData.filter(month => ((reportType === 'Income')?month.income:month.expense)  > 0).map(month => month.name);

  const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#A133FF', '#FFCE56'];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Financial Reports
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track your financial performance and trends
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              id="dateRangeSelect"
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
            >
              {years.map((year, i) => (
                <option key={year} value={year} title={i > 0 ? 'Premium' : 'Normal'} className="py-2">
                  {year} {i > 0 ? '💎' : ''}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="Income">Income Analysis</option>
              <option value="Expenses">Expense Analysis</option>
              <option value="Net Savings">Savings Analysis</option>
              <option value="whole">Combined Analysis</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                {reportType} Trends
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TransactionData.length === 0 ? DemoTransactionData : TransactionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  {reportType === 'whole' && (
                    <>
                      <Line type="monotone" dataKey="income" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="expense" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="Net_Savings" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                    </>
                  )}
                  {reportType === 'Income' && <Line type="monotone" dataKey="income" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />}
                  {reportType === 'Expenses' && <Line type="monotone" dataKey="expense" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />}
                  {reportType === 'Net Savings' && <Line type="monotone" dataKey="Net_Savings" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <PieChartIcon size={20} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Category Distribution
                </h2>
              </div>
              <select
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={dateRangeMonth}
                onChange={(e) => setDateRangeMonth(Number(e.target.value))}
              >
                {monthsForIncome.map((month, index) => (
                  <option key={index} value={MONTH_NAMES.indexOf(month)}>{month}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-6">
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Data}
                    cx="50%"
                    cy="50%"
                    outerRadius={isSm ? 100 : 150}
                    innerRadius={isSm ? 60 : 100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {Data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50">
                <BarChart2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalExpensePerYear)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-50">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Income</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalIncomePerYear)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-50">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Net Savings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalNetSavingsPerYear)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}