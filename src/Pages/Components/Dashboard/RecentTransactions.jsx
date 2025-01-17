import React from 'react';
import { formatCurrency } from "../Income/formatCurrency";
import { Calendar, ArrowUp, ArrowDown } from 'react-feather';

export default function RecentTransactions({ incomeData, expenseData, loading }) {
  // Combine and sort transactions
  const allTransactions = [...(incomeData || []), ...(expenseData || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5); 
    
    const isIncomeTransaction = (transaction) => {
      // if (!transaction || !transaction._id) return false;
      return incomeData?.some(income => income._id === transaction._id) || false;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="border-b border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        <p className="text-sm text-gray-500 mt-1">Your latest financial activities</p>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : allTransactions.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          allTransactions.map(transaction => (
            <div key={transaction._id} className="sm:p-4 p-2 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    incomeData.find(income => income._id === transaction._id) ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    {incomeData.find(income => income._id === transaction._id) ? (
                      <ArrowUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{transaction.source}</span>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {/* {new Date(transaction.date).toLocaleDateString()} */}
                        {(new Date(transaction.date).toLocaleDateString()=== new Date().toLocaleDateString()? 'Today': new Date(transaction.date).toLocaleDateString())}
                      </div>
                    </div>
                  </div>
                </div>
                <p className={`text-lg font-semibold ${
                  incomeData.find(income => income._id === transaction._id) ? 'text-green-600' : 'text-red-600'
                }`}>
                  {incomeData.find(income => income._id === transaction._id) ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}