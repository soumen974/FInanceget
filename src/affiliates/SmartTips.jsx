import React from 'react'
import { TrendingUp ,PiggyBank} from 'lucide-react';

export default function SmartTips({type}) {
  return (
    <div className="mt-6 p-5 bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start gap-3 mb-3">
            {type==='income'?
            <div className="p-2 bg-green-100 dark:bg-green-900 dark:bg-opacity-20 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>:
            <div className="p-2 bg-blue-100 dark:bg-blue-600/20 dark:bg-opacity-20 rounded-full">
            <PiggyBank className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            }
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {type==='income'?'Grow Your Income':'Save Smarter'}
            </h3>
          </div>
          
          <div className="space-y-3 ml-2">
            {type==='income'?
            <div className="flex items-center justify-start gap-2">
              <div className="mt-0 flex items-center text-indigo-600 dark:text-indigo-400">•</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Trade actively with{' '}
                <a
                  href="https://zerodha.com/open-account?c=GRY7344"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Zerodha—free demat + 10% share
                </a>
              </p>
            </div>
            :
            <div className="flex items-center justify-start gap-2">
            <div className="mt-1 flex items-center text-indigo-600 dark:text-indigo-400">•</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Cut costs with{' '}
              <a
                href="joinhoney.com/ref/usx3zmv" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Honey—find deals on trading tools
              </a>
            </p>
          </div>
            }

            {type==='income'?
            <div className="flex items-center justify-start gap-2">
              <div className="mt-1 text-indigo-600 dark:text-indigo-400">•</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Earn passively with{' '}
                <a
                  href="https://app.groww.in/v3cO/2czt7plq" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Groww—mutual funds made easy
                </a>
              </p>
            </div>
            :
            <div className="flex items-center justify-start gap-2">
                <div className="mt-1 flex items-center text-indigo-600 dark:text-indigo-400">•</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Earn cashback with{' '}
                  <a
                    href="https://bitli.in/YVz6YDB" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Axis Bank Credit Card—up to ₹3500 commission
                  </a>
                </p>
            </div>
            }

            {type==='income'?
            <div className="flex items-center justify-start gap-2">
              <div className="mt-1 text-indigo-600 dark:text-indigo-400">•</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Gig it up on{' '}
                <a
                  href="https://www.fiverr.com/pe/DB9RkGo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Fiverr—20% commission per signup
                </a>
              </p>
            </div>
            :
            <div className="flex items-center justify-start gap-2">
            <div className="mt-1 flex items-center text-indigo-600 dark:text-indigo-400">•</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Budget better with{' '}
              <a
                href="https://www.amazon.in/Rich-Dad-Poor-Robert-Kiyosaki/dp/8186775218?crid=2OD2VAYKIX11A&dib=eyJ2IjoiMSJ9.76jH6QUKUEu95wt1Bogdd3wBLURtKCJdOFERtaNr_a9KFdgIBeQUiXvfwgMTzL70xfWnBDBTKdfdgETXrRDdCs8EBR3uxODVC2u_aiGciadJuMQk4hKzrlHXqiXiuJJBVYoyC6liAkFTFp79oyGSDA.ksXkVP0Js6XTtwiKgEQpkdBYd4wTzZKZUptc1ts4IQM&dib_tag=se&keywords=Rich+Dad+Poor+Dad%E2%80%94top+finance+book.&qid=1740642746&sprefix=%2Caps%2C609&sr=8-1&linkCode=ll1&tag=financegetbys-21&linkId=6de81035b39808d6753fb9aa222190ca&language=en_IN&ref_=as_li_ss_tl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Rich Dad Poor Dad—top finance book
              </a>
            </p>
            </div>
            }
          </div>
        </div>
  )
}
