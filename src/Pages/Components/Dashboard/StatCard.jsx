// StatCard.jsx
import React from 'react';
import {formatCurrency} from "../Income/formatCurrency";

export default function StatCard({ title, amount, type, icon }) {
  const getCardStyles = () => {
    switch(type) {
      case 'balance':
        return {
          wrapper: 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200',
          text: 'text-blue-600',
          icon: 'bg-blue-600'
        };
      case 'income':
        return {
          wrapper: 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200',
          text: 'text-green-600',
          icon: 'bg-green-600'
        };
      case 'expense':
        return {
          wrapper: 'bg-gradient-to-br from-red-50 to-red-100 border border-red-200',
          text: 'text-red-600',
          icon: 'bg-red-600'
        };
    }
  };

  const styles = getCardStyles();

  return (
    <div className={`rounded-xl p-6 transition-all duration-200 hover:shadow-md ${styles.wrapper}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${styles.icon} bg-opacity-10`}>
          {React.cloneElement(icon, { className: `w-5 h-5 ${styles.text}` })}
        </div>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles.text} bg-white bg-opacity-50`}>
          {type === 'balance' ? 'NET' : type.toUpperCase()}
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className={`text-2xl font-bold ${styles.text}`}>
        {formatCurrency(amount)}
      </p>
    </div>
  );
}

