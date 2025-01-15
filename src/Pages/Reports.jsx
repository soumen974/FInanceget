import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useGlobalTransactionData } from './Components/Income/TransactionList';
import { formatCurrency } from './Components/Income/formatCurrency';
import { useMediaQuery } from 'react-responsive';
import { ReportsData } from './Components/Reports/ReportsData';

export default function Reports() {
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
    <div className="">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <h1 className="sm:text-3xl text-xl font-bold">Financial Reports</h1>
        <div className="flex flex-wrap gap-4">
          <select
            id="dateRangeSelect"
            className="p-2 border rounded"
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
          >
            {years.map((year, i) => (
              <option className='' key={year} value={year}>
                Year: {year} {i > 0 ? 'Premium' : 'Free'}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="Income">Income</option>
            <option value="Expenses">Expenses</option>
            <option value="Net Savings">Net Savings</option>
            <option value="whole">Whole</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Trends Chart */}
        <div className="bg-white p-2 sm:p-6 rounded-lg shadow">
          <h2 className="text-md sm:text-xl font-semibold mb-4">{reportType} Trends</h2>
          <div className="sm:h-80 h-[12rem]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TransactionData.length === 0 ? DemoTransactionData : TransactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {reportType === 'whole' ? (
                  <>
                    <Line type="monotone" dataKey="income" stroke="#8884d8" />
                    <Line type="monotone" dataKey="expense" stroke="orange" />
                    <Line type="monotone" dataKey="Net_Savings" stroke="green" />
                  </>
                ) : null}
                {reportType === 'Income' ? <Line type="monotone" dataKey="income" stroke="#8884d8" /> : null}
                {reportType === 'Expenses' ? <Line type="monotone" dataKey="expense" stroke="orange" /> : null}
                {reportType === 'Net Savings' ? <Line type="monotone" dataKey="Net_Savings" stroke="green" /> : null}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <h2 className="text-md sm:text-xl font-semibold flex justify-center">
            {TransactionData.length === 0 ? 'No Transactions' : dateRange}
          </h2>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-2 sm:p-6 rounded-lg shadow">
          <h2 className="sm:text-xl text-md font-semibold mb-4">Category {reportType} Distribution</h2>
          <select
            className="p-2 border rounded"
            value={dateRangeMonth}
            onChange={(e) => setDateRangeMonth(Number(e.target.value))}
          >
            {monthsForIncome.map((month, index) => (
              <option key={index} value={MONTH_NAMES.indexOf(month)}>{month}</option>
            ))}
          </select>
          <div className="sm:h-80 h-[12rem]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Data}
                  cx="50%"
                  cy="50%"
                  outerRadius={isSm ? 50 : 80}
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

        {/* Summary Stats */}
        <div className="bg-white p-2 sm:p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="sm:text-xl text-md font-semibold mb-4">Summary Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalExpensePerYear)}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncomePerYear)}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Net Savings</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(totalNetSavingsPerYear)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}