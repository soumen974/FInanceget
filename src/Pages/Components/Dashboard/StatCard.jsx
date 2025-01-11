import React from 'react'
import {formatCurrency} from "../Income/formatCurrency";
export default function  StatCard ({ title, amount, type }) {   
// const formattedAmount = formatCurrency(amount);

    
    return(
    <div className={`p-6 rounded-lg shadow ${
      type === 'balance' ? 'bg-blue-50' :
      type === 'income' ? 'bg-green-50' : 'bg-red-50'
    }`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${
        type === 'income' ? 'text-green-600' :
        type === 'expense' ? 'text-red-600' : 'text-blue-600'
      }`}>{formatCurrency(amount)}</p>
    </div>
    );
};
