import React, { useMemo } from 'react';
import { formatCurrency } from "../Income/formatCurrency";

// Color mapping for different types
const TYPE_STYLES = {
  balance: {
    gradient: 'from-blue-100 to-blue-50 dark:from-gray-900 dark:to-blue-900/20',
    border: 'border-blue-200 dark:border-blue-700/30',
    text: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-600/10 dark:bg-blue-500/20'
  },
  income: {
    gradient: 'from-green-100 to-green-50 dark:from-gray-900 dark:to-green-900/20',
    border: 'border-green-200 dark:border-green-700/30',
    text: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-600/10 dark:bg-green-500/20'
  },
  expense: {
    gradient: 'from-red-100 to-red-50 dark:from-gray-900 dark:to-red-900/20',
    border: 'border-red-200 dark:border-red-700/30',
    text: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-600/10 dark:bg-red-500/20'
  }
};

const StatCard = ({ title, amount, type, icon }) => {
 
  const styles = useMemo(() => TYPE_STYLES[type] || TYPE_STYLES.balance, [type]);

  return (
    <div 
      className={`rounded-xl p-5 bg-gradient-to-br ${styles.gradient} ${styles.border} shadow-sm 
        transition-all duration-300  animate-fade-in`}
      aria-label={`${title}: ${formatCurrency(amount)}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-full ${styles.iconBg}`}>
          {React.cloneElement(icon, { className: `w-6 h-6 ${styles.text}` })}
        </div>
        <span 
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.text} 
            bg-white/80 dark:bg-gray-800/80 shadow-sm`}
        >
          {type === 'balance' ? 'NET' : type.toUpperCase()}
        </span>
      </div>
      <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
      <p className={`text-3xl font-bold ${styles.text}`}>
        {formatCurrency(amount)}
      </p>
    </div>
  );
};


export default React.memo(StatCard);