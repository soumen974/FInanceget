import React,{useState} from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useGlobalTransactionData } from "./Components/Income/TransactionList";
import {formatCurrency} from "./Components/Income/formatCurrency";
import { useMediaQuery  } from "react-responsive";
import { ReportsData } from "./Components/Reports/ReportsData";
export default function Reports() {
  // needed for the pie chart showing in responsive pages
  const isSm = useMediaQuery({ query: '(max-width: 640px)' });
    const DemoTransactionData = [
      { name: 'Jan', income: 2400 ,expense: 1000,Net_Savings:1400},
      { name: 'Feb', income: 2000 ,expense: 1398,Net_Savings:1198},
      { name: 'Mar', income: 9800 ,expense: 2000,Net_Savings:7800},
      { name: 'Apr', income: 3908 ,expense: 2000,Net_Savings:1908},
      { name: 'May', income: 4800 ,expense: 3000,Net_Savings:1800},
      { name: 'Jun', income: 4500 ,expense: 3800,Net_Savings:700},
      { name: 'Jul', income: 4500 ,expense: 3800,Net_Savings:700},
    ];

  let TransactionData = ReportsData();
  const loadingReport = ReportsData();
  const messageReports = ReportsData()
  const Availableyears =ReportsData()

  const current_year = new Date().getFullYear();
  const lastYear = new Date().getFullYear() - 1;
  TransactionData =TransactionData.TransactionData;

  const { totalIncome, error, message, loading } = useGlobalTransactionData('income');
  const { totalExpense } = useGlobalTransactionData('expense');
  const [dateRange, setDateRange] = useState(current_year);
  const searchYear =ReportsData()
  // searchYear(dateRange);
  const [reportType, setReportType] = useState('Income');
  const years =[
    2023,2024,2025
  ]

    // console.log(Availableyears);


// api/reports/LineChartData
  const categoryData = [
    { name: 'Food', value: 400 },
    { name: 'Transport', value: 300 },
    { name: 'Entertainment', value: 300 },
    { name: 'Utilities', value: 200 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
 

  return (
    <div className="">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <h1 className="sm:text-3xl text-xl font-bold">Financial Reports</h1>
        <div className="flex  flex-wrap gap-4">
        <select
        id="dateRangeSelect"
        className="p-2 border rounded"
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value)}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            Year: {year}
          </option>
        ))}
        {/* <option value="current_year">Year: {current_year}</option>
        <option value="last_year">Year: {lastYear}</option> */}
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
              <LineChart data={ TransactionData.length === 0? DemoTransactionData : TransactionData }>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {reportType === 'whole'  ? (<>
                <Line type="monotone" dataKey="income" stroke="#8884d8" />
                <Line type="monotone" dataKey="expense" stroke="orange" />
                <Line type="monotone" dataKey="Net_Savings" stroke="green" />
                {/* <Legend /> */}
                </>): null}
                {reportType === 'Income' ? (<><Line type="monotone" dataKey="income" stroke="#8884d8" /></>): null}
                {reportType === 'Expenses' ? (<><Line type="monotone" dataKey="expense" stroke="orange" /></>): null}
                {reportType === 'Net Savings' ? (<><Line type="monotone" dataKey="Net_Savings" stroke="green" /></>): null}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <h2 className="text-md sm:text-xl font-semibold flex justify-center">{TransactionData.length === 0? "No Transactions  ": null}</h2>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-2 sm:p-6 rounded-lg shadow">
          <h2 className="sm:text-xl text-md font-semibold mb-4">Category {reportType} Distribution</h2>
          <div className="sm:h-80 h-[12rem]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={isSm? 50 :80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
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
          <h2 className="sm:text-xl text-md  font-semibold mb-4">Summary Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Net Savings</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalIncome-totalExpense)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
