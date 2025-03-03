import React from 'react'
import { Twitter,LightbulbIcon } from 'lucide-react';

export default function BoosterTips({type}) {
  return (
    <div>
        <div className="mt-4 p-5 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg shadow-sm border dark:border-[#ffffff24] transition-shadow duration-300">
            <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-20 rounded-full">
                <LightbulbIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
                <h3 className="text-[1.2rem] md:text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {type==='income'?'Income':'Expense'} Boost Tip
                </h3>

                {type==='income'?
                <p className="text-[0.7rem] md:text-sm text-gray-600 dark:text-gray-300">
                    Diversify your gains—trade stocks with Zerodha and save with{' '}
                    <a
                        href="joinhoney.com/ref/usx3zmv" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                        Honey
                    </a>
                </p>
                :
                <p className="text-[0.7rem] md:text-sm text-gray-600 dark:text-gray-300">
                Save on trading fees—use{' '}
                <a
                    href="https://zerodha.com/open-account?c=GRY7344"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                    Zerodha
                </a>{' '}
                and track with FinanceGet.
                </p>}
            </div>
            </div>
        </div>
    </div>
  )
}
