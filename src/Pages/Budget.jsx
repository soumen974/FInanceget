import React, { useState } from 'react';
import { 
  DollarSign, PieChart, Plus, Edit2, Trash2, 
  AlertCircle, CheckCircle, X, Archive,
  Coffee, Home, Smartphone, 
  Users, Book, Gift, Shield, Sun, TrendingUp
} from 'react-feather';
import { Car } from "lucide-react";

const Budget = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [financeRule,setFinanceRule] =  useState('50/30/20');

  // Example monthly income in INR
  const monthlyIncome = 1474;
 
  const budgetPercentages = {
    Needs: {
      '50/30/20': 0.50,
      '80/20': 0.50,
      '70/20/10': 0.50,
      '60/20/20': 0.50,
      'One-Third': 0.3333
    },
    Housing: {
      '50/30/20': 0.25,
      '80/20': 0.20,
      '70/20/10': 0.20,
      '60/20/20': 0.20,
      'One-Third': 0.15
    },
    Utilities: {
      '50/30/20': 0.05,
      '80/20': 0.05,
      '70/20/10': 0.05,
      '60/20/20': 0.05,
      'One-Third': 0.05
    },
    FoodAndDining: {
      '50/30/20': 0.15,
      '80/20': 0.15,
      '70/20/10': 0.15,
      '60/20/20': 0.15,
      'One-Third': 0.10
    },
    Healthcare: {
      '50/30/20': 0.05,
      '80/20': 0.05,
      '70/20/10': 0.05,
      '60/20/20': 0.05,
      'One-Third': 0.0333
    },
    Transportation: {
      '50/30/20': 0.05,
      '80/20': 0.05,
      '70/20/10': 0.05,
      '60/20/20': 0.05,
      'One-Third': 0.0333
    },
    Insurance: {
      '50/30/20': 0.05,
      '80/20': 0.05,
      '70/20/10': 0.05,
      '60/20/20': 0.05,
      'One-Third': 0.0333
    },
    Wants: {
      '50/30/20': 0.30,
      '80/20': 0.30,
      '70/20/10': 0.30,
      '60/20/20': 0.30,
      'One-Third': 0.3333
    },
    Entertainment: {
      '50/30/20': 0.10,
      '80/20': 0.15,
      '70/20/10': 0.10,
      '60/20/20': 0.10,
      'One-Third': 0.10
    },
    OtherMiscellaneous: {
      '50/30/20': 0.10,
      '80/20': 0.15,
      '70/20/10': 0.10,
      '60/20/20': 0.05,
      'One-Third': 0.10
    },
    Education: {
      '50/30/20': 0.10,
      '80/20': 0.10,
      '70/20/10': 0.10,
      '60/20/20': 0.05,
      'One-Third': 0.05
    },
    SavingsInvestments: {
      '50/30/20': 0.20,
      '80/20': 0.20,
      '70/20/10': 0.20,
      '60/20/20': 0.20,
      'One-Third': 0.3333
    }
  };
  
const budgetCategories = [
  { id: 1, name: 'Housing', icon: <Home />, budget: monthlyIncome * budgetPercentages.Housing[financeRule], spent: 12, type: 'Needs' },
  { id: 2, name: 'Utilities', icon: <Sun />, budget: monthlyIncome * budgetPercentages.Utilities[financeRule], spent: 20, type: 'Needs' },
  { id: 3, name: 'Food & Dining', icon: <Coffee />, budget: monthlyIncome * budgetPercentages.FoodAndDining[financeRule], spent: 80, type: 'Needs' },
  { id: 4, name: 'Healthcare', icon: <Users />, budget: monthlyIncome * budgetPercentages.Healthcare[financeRule], spent: 20, type: 'Needs' },
  { id: 5, name: 'Transportation', icon: <Car />, budget: monthlyIncome * budgetPercentages.Transportation[financeRule], spent: 20, type: 'Needs' },
  { id: 6, name: 'Insurance', icon: <Shield />, budget: monthlyIncome * budgetPercentages.Insurance[financeRule], spent: 20, type: 'Needs' },
  { id: 7, name: 'Entertainment', icon: <Smartphone />, budget: monthlyIncome * budgetPercentages.Entertainment[financeRule], spent: 25, type: 'Wants' },
  { id: 8, name: 'Other Miscellaneous', icon: <Gift />, budget: monthlyIncome * budgetPercentages.OtherMiscellaneous[financeRule], spent: 20, type: 'Wants' },
  { id: 9, name: 'Education', icon: <Book />, budget: monthlyIncome * budgetPercentages.Education[financeRule], spent: 130, type: 'Wants' },
  { id: 10, name: 'Savings/Investments', icon: <TrendingUp />, budget: monthlyIncome * budgetPercentages.SavingsInvestments[financeRule], spent: 80, type: 'Savings' }
];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [
    2025, 2024
  ];

  return (
    <div className={`max-w-7xl mx-auto `}>
      {/* Header */}
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
              ₹{monthlyIncome.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Date Picker */}
      <div className="mb-8 flex gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Month</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-gray-300"
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Year</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:bg-[#0a0a0a] dark:border-[#ffffff24] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20  dark:text-gray-300"
          >
            {years.map((year, index) => (
              <option key={index} value={index }>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select finance rule</label>
          <select 
            value={financeRule} 
            onChange={(e) => setFinanceRule(e.target.value)}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:bg-[#0a0a0a] dark:border-[#ffffff24] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20  dark:text-gray-300"
          >
            
            <option  value='50/30/20'>50/30/20 Rule</option>
            {/* <option  value='80/20'>80/20 Rule</option>
            <option  value='70/20/10'>70/20/10 Rule</option>
            <option  value='60/20/20'>60/20/20 Rule</option>
            <option  value='One-Third'>One-Third Rule</option> */}
             <option  value='One-Third'>Personalized 💎</option>


            
          </select>
        </div>
      </div>

      {/* Success Message */}
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
        {/* Budget Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] rounded-xl shadow-sm border border-gray-100 ">
            <div className="p-6 border-b  dark:border-[#ffffff24] border-gray-100 ">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Budget Categories for {months[selectedMonth - 1]} {selectedYear}</h2>
                </div>
                <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                  View All
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
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
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedCategory(category)}
                        className="p-2 text-gray-400 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-100 dark:bg-[#0a0a0a] rounded-full h-2">
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
          </div>
        </div>

        {/* Budget Form */}
        <div>
          <div className="bg-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] rounded-xl shadow-sm border border-gray-100  sticky top-8">
            <div className="p-6 border-b  dark:border-[#ffffff24] border-gray-100 ">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 dark:bg-green-900 rounded-lg">
                  <Plus className="w-5 h-5 text-green-600 dark:text-green-300" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {selectedCategory ? 'Edit Budget' : 'Add Budget'}
                </h2>
              </div>
            </div>

            <form className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200  dark:border-[#ffffff24] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-[#0a0a0a] dark:text-gray-300 transition-all duration-200"
                    placeholder="Enter category name"
                    defaultValue={selectedCategory?.name}
                  />
                  <Archive className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-[#ffffff24] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-[#0a0a0a] dark:text-gray-300 transition-all duration-200"
                    placeholder="Enter amount"
                    defaultValue={selectedCategory?.budget}
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  {selectedCategory ? (
                    <>
                      <Edit2 size={18} />
                      <span>Update Budget</span>
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      <span>Add Budget</span>
                    </>
                  )}
                </button>
                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="flex-1 px-6 py-2.5 rounded-lg border border-gray-200 dark:border-[#ffffff24] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm">
                <AlertCircle size={20} />
                <p>Budget changes will take effect immediately</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;