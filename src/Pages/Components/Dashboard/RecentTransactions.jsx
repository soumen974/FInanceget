import React from 'react'

export default function  RecentTransactions ()  {
    return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-md sm:text-xl font-semibold mb-4">Recent Transactions</h2>
      <div className="space-y-4">
        {[
          { id: 1, type: 'expense', category: 'Food', amount: 25.50, date: '2024-12-27' },
          { id: 2, type: 'income', category: 'Salary', amount: 3000, date: '2024-12-25' },
          { id: 3, type: 'expence', category: 'Food', amount: 300, date: '2024-12-25' }

        ].map(transaction => (
          <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <p className="font-medium">{transaction.category}</p>
              <p className="text-sm text-gray-500">{transaction.date}</p>
            </div>
            <p className={`font-bold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )};