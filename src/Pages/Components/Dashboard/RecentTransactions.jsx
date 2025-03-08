import React from 'react';
import { formatCurrency } from "../Income/formatCurrency";
import { Calendar, ArrowUp, ArrowDown } from 'react-feather';
import { Link } from "react-router-dom";

export default function RecentTransactions({ allTransactions, incomeData, expenseData, loading }) {
  // const allTransactions = [...(incomeData || []), ...(expenseData || [])]
  //   .sort((a, b) => new Date(b.date) - new Date(a.date))
  //   .slice(0, 5); 

  const isIncomeTransaction = (transaction) => {
    return incomeData?.some(income => income._id === transaction._id) || false;
  };

  // console.log(allTransactions);

  return (
    <div className="bg-white dark:bg-[#0a0a0a] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-[#ffffff24]">
      <div className="border-b border-gray-100 dark:border-[#ffffff24] p-4 sm:p-6">
        <h2 className=" text-[1rem] md:text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Transactions</h2>
        <p className="text-[0.7rem] md:text-sm text-gray-500 dark:text-gray-400 mt-1">Your latest financial activities</p>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-[#ffffff24] ">
        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : allTransactions.length === 0 ? (
          <div className="p-6 text-center space-y-6">
            <h1 className="text-gray-500 dark:text-gray-600 pb-6">No transactions found</h1>
            <Link to="/income" className="bg-blue-50 dark:bg-blue-600 text-[0.8rem] dark:bg-opacity-20 text-blue-600 p-2 px-3 rounded-md">Start a new transaction</Link>
          </div>
        ) : (
          allTransactions.map(transaction => (
            <div key={transaction._id} className="sm:p-4 p-2 hover:bg-gray-50 dark:hover:bg-[#ffffff07]  transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    isIncomeTransaction(transaction) 
                      ? 'bg-green-50 dark:bg-green-900/30' 
                      : 'bg-red-50 dark:bg-red-900/30'
                  }`}>
                    {isIncomeTransaction(transaction) ? (
                      <ArrowUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 max-md:truncate max-md:w-[5.7rem]">{transaction.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-500 max-md:truncate max-md:w-[5.7rem]">{transaction.source}</span>
                      <span className="text-gray-300 dark:text-gray-700">•</span>
                      <div className="flex items-center  text-sm text-gray-500 dark:text-gray-500">
                        <Calendar className="w-4  h-4 mr-1 dark:text-gray-600 " />
                        {new Date(transaction.date).toLocaleDateString() === new Date().toLocaleDateString() 
                          ? 'Today' 
                          : new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <p className={`text-lg  font-semibold ${
                  isIncomeTransaction(transaction) 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {isIncomeTransaction(transaction) ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}