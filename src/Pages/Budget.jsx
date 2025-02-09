import React, { useState, useEffect } from 'react';
import {
  DollarSign, PieChart, Edit2, Trash2,
  AlertCircle, CheckCircle, X,
  Coffee, Home, Smartphone,
  Users, Book, Gift, Shield, Sun, TrendingUp
} from 'react-feather';
import { Car ,Crown} from "lucide-react";
import { ReportsData } from './Components/Reports/ReportsData';
import { useGlobalTransactionData } from "../Pages/Components/Income/TransactionList";
import { formatCurrency } from "./Components/Income/formatCurrency";
import { authCheck } from "../Auth/Components/ProtectedCheck";

const Budget = () => {
  const {
    TransactionData,
    Availableyears,
    searchYear,
    setsearchYear,
    setMonth,
    categoryData = { categoryIncomeData: [], categoryExpenseData: [] }
  } = ReportsData();

  const { userType }= authCheck();
  
  const { totalIncomeFortheCurrentMonth, setsearchYearForList, setMonthForList } = useGlobalTransactionData('income');

  const currentYear = new Date().getFullYear();
  const lastYear = new Date().getFullYear() - 1;

  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [financeRule, setFinanceRule] = useState('50/30/20');

  const monthlyIncome = totalIncomeFortheCurrentMonth;

  const budgetPercentages523 = {
    Needs: 0.50,
    Housing: 0.20,
    Utilities: 0.05,
    FoodAndDining: 0.10,
    Healthcare: 0.05,
    Transportation: 0.05,
    Insurance: 0.05,
    Wants: 0.30,
    Entertainment: 0.10,
    OtherMiscellaneous: 0.10,
    Education: 0.10,
    SavingsInvestments: 0.20
  };

  const budgetPercentages13rd = {
    Needs: 0.50,
    Housing: 0.10,
    Utilities: 0.05,
    FoodAndDining: 0.05,
    Healthcare: 0.05,
    Transportation: 0.05,
    Insurance: 0.05,
    Wants: 0.30,
    Entertainment: 0.10,
    OtherMiscellaneous: 0.10,
    Education: 0.10,
    SavingsInvestments: 0.20
  };
  const budgetPercentages = financeRule ==='50/30/20'? budgetPercentages523 :  userType==='premium'? budgetPercentages13rd: budgetPercentages523;

  const years = Availableyears.length > 0 ? Availableyears : [currentYear, lastYear];
  const totalExpensePerYear = TransactionData.reduce((acc, expense) => acc + expense.expense, 0);
  const totalIncomePerYear = TransactionData.reduce((acc, income) => acc + income.income, 0);
  const totalNetSavingsPerYear = TransactionData.reduce((acc, netSavings) => acc + netSavings.Net_Savings, 0);

  useEffect(() => {
    setsearchYear(selectedYear);
    setMonth(selectedMonth);
    setsearchYearForList(selectedYear);
    setMonthForList(selectedMonth);
  }, [selectedYear, setsearchYear, selectedMonth, setsearchYearForList, setMonthForList]);

  const DemocategoryData = [{ name: 'No data found', value: 404 }];
  const actualData = categoryData.categoryExpenseData;
  const Data = (actualData?.length === 0) ? DemocategoryData : actualData;
  const monthsForIncome = TransactionData.filter(month => month.expense > 0).map(month => month.name);

  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getSpentAmount = (categoryName) => {
    const category = Data.find(c => c.name === categoryName);
    return category ? category.value : 0;
  };

  const budgetCategories = [
    { id: 1, name: 'Housing', icon: <Home />, budget: monthlyIncome * budgetPercentages.Housing, spent: getSpentAmount('Housing'), type: 'Needs' },
    { id: 2, name: 'Utilities', icon: <Sun />, budget: monthlyIncome * budgetPercentages.Utilities, spent: getSpentAmount('Utilities'), type: 'Needs' },
    { id: 3, name: 'Food & Dining', icon: <Coffee />, budget: monthlyIncome * budgetPercentages.FoodAndDining, spent: getSpentAmount('Food & Dining'), type: 'Needs' },
    { id: 4, name: 'Healthcare', icon: <Users />, budget: monthlyIncome * budgetPercentages.Healthcare, spent: getSpentAmount('Healthcare'), type: 'Needs' },
    { id: 5, name: 'Transportation', icon: <Car />, budget: monthlyIncome * budgetPercentages.Transportation, spent: getSpentAmount('Transportation'), type: 'Needs' },
    { id: 6, name: 'Insurance', icon: <Shield />, budget: monthlyIncome * budgetPercentages.Insurance, spent: getSpentAmount('Insurance'), type: 'Needs' },
    { id: 7, name: 'Entertainment', icon: <Smartphone />, budget: monthlyIncome * budgetPercentages.Entertainment, spent: getSpentAmount('Entertainment'), type: 'Wants' },
    { id: 8, name: 'Other Miscellaneous', icon: <Gift />, budget: monthlyIncome * budgetPercentages.OtherMiscellaneous, spent: getSpentAmount('Other Miscellaneous'), type: 'Wants' },
    { id: 9, name: 'Education', icon: <Book />, budget: monthlyIncome * budgetPercentages.Education, spent: getSpentAmount('Education'), type: 'Wants' },
    { id: 10, name: 'Savings/Investments', icon: <TrendingUp />, budget: monthlyIncome * budgetPercentages.SavingsInvestments, spent: getSpentAmount('Savings/Investments'), type: 'Investments' }
  ];

  return (
    <div className={`max-w-7xl mx-auto`}>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Budget Management</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track and manage your spending limits across categories
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Budget:</span>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatCurrency(monthlyIncome)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8 flex gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Month</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-gray-300"
          >
            {monthsForIncome.length <= 0 && (
              <option value={new Date().getMonth()}>{MONTH_NAMES[new Date().getMonth()]}</option>
            )}
            {monthsForIncome.map((month, index) => (
              <option key={index} value={MONTH_NAMES.indexOf(month)}>{month}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Year</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:bg-[#0a0a0a] dark:border-[#ffffff24] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:text-gray-300"
          >
            {years.map((year, index) => (
              <option key={index} value={year}>{year} {index > 0 ? '💎' : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Finance Rule</label>
          <select 
            value={financeRule} 
            onChange={(e) => setFinanceRule(e.target.value)}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:bg-[#0a0a0a] dark:border-[#ffffff24] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:text-gray-300"
          >
            <option value='50/30/20'>50/30/20 Rule</option>
            <option value='One-Third'>Personalized 💎</option>
          </select>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 text-green-600 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle size={20} />
          <span>Budget updated successfully!</span>
          <button 
            onClick={() => setShowSuccess(false)}
            className="ml-2 p-1 hover:bg-green-100 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b dark:border-[#ffffff24] border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-opacity-20 dark:bg-blue-600 rounded-lg">
                    <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Budget Categories for {MONTH_NAMES[selectedMonth].charAt(0).toUpperCase() + MONTH_NAMES[selectedMonth].slice(1)} {selectedYear}
                  </h2>
                </div>
              </div>
            </div>
            {monthlyIncome <= 0 ? <div className="p-6 text-center text-gray-500 dark:text-gray-400">You don't have sufficient balance</div> :
            
              <div className="divide-y relative divide-gray-100 dark:divide-gray-700 overflow-hidden">
                {(financeRule != '50/30/20' || selectedYear!=currentYear) && userType!='premium' ? (
                  <div className="absolute inset-0  backdrop-blur-sm  bg-opacity-75">
                  <div className="max-w-xl mx-auto  p-6 bg-gradient-to-r from-blue-500 dark:bg-blue-500 dark:bg-opacity-20 to-blue-700 text-white rounded-b-lg shadow-lg">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <h2 className="text-2xl font-bold">Unlock Premium Features</h2>
                        <p className="mt-2 text-lg">Get access to exclusive content and features by upgrading to our premium plan.</p>
                        <button className="mt-4 px-4 py-2 bg-white dark:bg-black dark:text-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Upgrade Now</button>
                      </div>
                    </div>
                  </div>
               </div>):null}
                {budgetCategories.map((category) => (
                  <div 
                    key={category.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-[#ffffff06] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-[#0a0a0a]">
                          {React.cloneElement(category.icon, { 
                            size: 20,
                            className: "text-gray-600 dark:text-gray-300"
                          })}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">{category.name}</h3>
                          <div className="mt-1 flex items-center gap-2 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              ₹{category.budget.toLocaleString()}
                            </span>
                            <span className="text-gray-300 dark:text-gray-500">•</span>
                            <span className="text-gray-500 dark:text-gray-400">Spent:</span>
                            <span className={`font-medium ${
                              ((category.spent / category.budget) * 100) >= 95 ? 'text-red-600 dark:text-red-400' : ((category.spent / category.budget) * 100) >= 80 && ((category.spent / category.budget) * 100) < 100 ? 'text-yellow-400 dark:text-yellow-300' : 'text-green-400 dark:text-green-300'
                            }`}>
                              ₹{category.spent.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-100 dark:hover:bg-[#0c0b0b04] dark:bg-[#ffffff0f] rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            ((category.spent / category.budget) * 100) >= 95 ? 'bg-red-500 dark:bg-red-400' : ((category.spent / category.budget) * 100) >= 80 && ((category.spent / category.budget) * 100) < 100 ? 'bg-yellow-400 dark:bg-yellow-300' : 'bg-green-400 dark:bg-green-300'
                          }`}
                          style={{ 
                            width: `${Math.min((category.spent / category.budget) * 100, 100)}%`
                          }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{((category.spent / category.budget) * 100).toFixed(0)}% used</span>
                        <span>₹{(category.budget - category.spent).toLocaleString()} remaining</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>

        <div>
          <div className=" rounded-xl  sticky top-2">
            
            <div className="">
              <div className="space-y-2">
                <BudgetAllocationTable financeRule={financeRule} selectedYear={selectedYear}/>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;




 const budgetPercentages523 = {
    Needs: 0.50,
    Housing: 0.20,
    Utilities: 0.05,
    FoodAndDining: 0.10,
    Healthcare: 0.05,
    Transportation: 0.05,
    Insurance: 0.05,
    Wants: 0.30,
    Entertainment: 0.10,
    OtherMiscellaneous: 0.10,
    Education: 0.10,
    SavingsInvestments: 0.20
  };

  const budgetPercentages13rd = {
    Needs: 0.50,
    Housing: 0.10,
    Utilities: 0.05,
    FoodAndDining: 0.05,
    Healthcare: 0.05,
    Transportation: 0.05,
    Insurance: 0.05,
    Wants: 0.30,
    Entertainment: 0.10,
    OtherMiscellaneous: 0.10,
    Education: 0.10,
    SavingsInvestments: 0.20
  };
  
const BudgetAllocationTable = ({financeRule,selectedYear}) => {
  const { userType }= authCheck();
  const currentYear = new Date().getFullYear();
  const budgetPercentages = financeRule ==='50/30/20'? budgetPercentages523 : userType==='premium'? budgetPercentages13rd: budgetPercentages523;

  return (
    <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#ffffff24] max-w-2xl mx-auto">
    <div className="border-b border-gray-200 dark:border-[#ffffff24] p-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:bg-opacity-10">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-8V3.5L18.5 9H13z"/>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Budget Allocation Chart</h2>
        <h2></h2>
        {financeRule !='50/30/20' && userType==='premium' ? (<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
         <div className="p-2 hover:bg-blue-50 dark:hover:bg-opacity-20 dark:hover:bg-blue-900 rounded-lg">
           <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-600" />
         </div>
        </h2>) : null }
         
      </div>
    </div>
    {(financeRule != '50/30/20' || selectedYear!=currentYear) && userType!='premium' ? (
     <div className="max-w-xl mx-auto  p-6 bg-gradient-to-r from-blue-500 dark:bg-blue-500 dark:bg-opacity-20 to-blue-700 text-white rounded-b-lg shadow-lg">
     <div className="flex items-center">
       <div className="flex">
          <Crown className='h-14 w-14' />
       </div>
       <div className="ml-4">
         <h2 className="text-2xl font-bold">Unlock Premium Features</h2>
         <p className="mt-2 text-lg">Get access to exclusive content and features by upgrading to our premium plan.</p>
         <button className="mt-4 px-4 py-2 bg-white dark:bg-black dark:text-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Upgrade Now</button>
       </div>
     </div>
   </div>
    ) : (
      <div className="p-6 space-y-6">
        <div className="mb-4">
          <div className="font-bold text-lg text-gray-800 dark:text-gray-100">Needs (50%)</div>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
              <div className="text-gray-800 dark:text-gray-100">Housing</div>
              <div className="text-gray-800 dark:text-gray-100">🏠</div>
              <div className="text-gray-800 dark:text-gray-100">{(budgetPercentages.Housing * 100).toFixed(2)}%</div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
              <div className="text-gray-800 dark:text-gray-100">Utilities</div>
              <div className="text-gray-800 dark:text-gray-100">💡</div>
              <div className="text-gray-800 dark:text-gray-100">{(budgetPercentages.Utilities * 100).toFixed(2)}%</div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
              <div className="text-gray-800 dark:text-gray-100">Food & Dining</div>
              <div className="text-gray-800 dark:text-gray-100">🍽️</div>
              <div className="text-gray-800 dark:text-gray-100">{(budgetPercentages.FoodAndDining * 100).toFixed(2)}%</div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
              <div className="text-gray-800 dark:text-gray-100">Healthcare</div>
              <div className="text-gray-800 dark:text-gray-100">⚕️</div>
              <div className="text-gray-800 dark:text-gray-100">{(budgetPercentages.Healthcare * 100).toFixed(2)}%</div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
              <div className="text-gray-800 dark:text-gray-100">Transportation</div>
              <div className="text-gray-800 dark:text-gray-100">🚗</div>
              <div className="text-gray-800 dark:text-gray-100">{(budgetPercentages.Transportation * 100).toFixed(2)}%</div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
              <div className="text-gray-800 dark:text-gray-100">Insurance</div>
              <div className="text-gray-800 dark:text-gray-100">🛡️</div>
              <div className="text-gray-800 dark:text-gray-100">{(budgetPercentages.Insurance * 100).toFixed(2)}%</div>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="font-bold text-lg text-gray-800 dark:text-gray-100">Wants (30%)</div>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
              <div className="text-gray-800 dark:text-gray-100">Entertainment</div>
              <div className="text-gray-800 dark:text-gray-100">🎬</div>
              <div className="text-gray-800 dark:text-gray-100">{(budgetPercentages.Entertainment * 100).toFixed(2)}%</div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
              <div className="text-gray-800 dark:text-gray-100">Other Miscellaneous</div>
              <div className="text-gray-800 dark:text-gray-100">📦</div>
              <div className="text-gray-800 dark:text-gray-100">{(budgetPercentages.OtherMiscellaneous * 100).toFixed(2)}%</div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
              <div className="text-gray-800 dark:text-gray-100">Education</div>
              <div className="text-gray-800 dark:text-gray-100">📚</div>
              <div className="text-gray-800 dark:text-gray-100">{(budgetPercentages.Education * 100).toFixed(2)}%</div>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="font-bold text-lg text-gray-800 dark:text-gray-100">Savings/Investments (20%)</div>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
              <div className="text-gray-800 dark:text-gray-100">Savings/Investments</div>
              <div className="text-gray-800 dark:text-gray-100">💰</div>
              <div className="text-gray-800 dark:text-gray-100">{(budgetPercentages.SavingsInvestments * 100).toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};


