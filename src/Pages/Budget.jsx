import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign, PieChart, Edit2, Trash2, AlertCircle, CheckCircle, X,
  Coffee, Home, Smartphone, Users, Book, Gift, Shield, Sun, TrendingUp
} from 'react-feather';
import { Car, Crown, Percent } from "lucide-react";
import { ReportsData } from './Components/Reports/ReportsData';
import { useGlobalTransactionData } from "../Pages/Components/Income/TransactionList";
import { formatCurrency } from "./Components/Income/formatCurrency";
import { authCheck } from "../Auth/Components/ProtectedCheck";
import Spinner from "../Loaders/Spinner";
import { BudgetData } from "../Pages/Components/Budget/BudgetData";

// Main Budget Component
const Budget = () => {
  const {
    TransactionData,
    Availableyears,
    searchYear,
    setsearchYear,
    setMonth,
    loadingReport,
    categoryData = { categoryIncomeData: [], categoryExpenseData: [] }
  } = ReportsData();

  const { userType } = authCheck();
  const { totalIncomeFortheCurrentMonth, setsearchYearForList, setMonthForList } = useGlobalTransactionData('income');
  const { addBudget, setrule, error, setBudgetMonth, setBudgetYear, Personalizedbudget } = BudgetData();

  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [financeRule, setFinanceRule] = useState('50/30/20');
  const [editPersonalBudget, setEditPersonalBudget] = useState(false);
  const monthlyIncome = totalIncomeFortheCurrentMonth;

  const budgetPercentages523 = {
    Needs: 50,
    Housing: 20,
    Utilities: 5,
    FoodAndDining: 10,
    Healthcare: 5,
    Transportation: 5,
    Insurance: 5,
    Wants: 30,
    Entertainment: 10,
    OtherMiscellaneous: 10,
    Education: 10,
    SavingsInvestments: 20
  };

  const [budgetPercentages13rd, setbudgetPercentages13rd] = useState({
    Needs: 0,
    Housing: 0,
    Utilities: 0,
    FoodAndDining: 0,
    Healthcare: 0,
    Transportation: 0,
    Insurance: 0,
    Wants: 0,
    Entertainment: 0,
    OtherMiscellaneous: 0,
    Education: 0,
    SavingsInvestments: 0
  });

  useEffect(() => {
    if (financeRule === 'Personalized' && userType === 'premium' && error === '') {
      setbudgetPercentages13rd(prev => ({
        ...prev,
        ...Personalizedbudget,
      }));
    }
  }, [financeRule, userType, selectedYear, selectedMonth, Personalizedbudget, error]);

  const budgetPercentages = financeRule === '50/30/20' ? budgetPercentages523 : budgetPercentages13rd;

  const years = Availableyears.length > 0 ? Availableyears : [currentYear, lastYear];

  useEffect(() => {
    setsearchYear(selectedYear);
    setMonth(selectedMonth);
    setsearchYearForList(selectedYear);
    setMonthForList(selectedMonth);
    setrule(financeRule);
    setBudgetMonth(selectedMonth);
    setBudgetYear(selectedYear);
  }, [selectedYear, selectedMonth, financeRule]);

  const DemocategoryData = [{ name: 'No data found', value: 404 }];
  const actualData = categoryData.categoryExpenseData;
  const Data = actualData?.length === 0 ? DemocategoryData : actualData;
  const monthsForIncome = TransactionData.filter(month => month.income > 0).map(month => month.name);

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Optimized spent amount lookup
  const spentMap = useMemo(() => {
    const map = {};
    Data.forEach(item => {
      map[item.name] = item.value;
    });
    return map;
  }, [Data]);

  const CATEGORIES = [
    { id: 1, name: 'Housing', icon: <Home />, percentageKey: 'Housing', type: 'Needs' },
    { id: 2, name: 'Utilities', icon: <Sun />, percentageKey: 'Utilities', type: 'Needs' },
    { id: 3, name: 'Food & Dining', icon: <Coffee />, percentageKey: 'FoodAndDining', type: 'Needs' },
    { id: 4, name: 'Healthcare', icon: <Users />, percentageKey: 'Healthcare', type: 'Needs' },
    { id: 5, name: 'Transportation', icon: <Car />, percentageKey: 'Transportation', type: 'Needs' },
    { id: 6, name: 'Insurance', icon: <Shield />, percentageKey: 'Insurance', type: 'Needs' },
    { id: 7, name: 'Entertainment', icon: <Smartphone />, percentageKey: 'Entertainment', type: 'Wants' },
    { id: 8, name: 'Other Miscellaneous', icon: <Gift />, percentageKey: 'OtherMiscellaneous', type: 'Wants' },
    { id: 9, name: 'Education', icon: <Book />, percentageKey: 'Education', type: 'Wants' },
    { id: 10, name: 'Savings/Investments', icon: <TrendingUp />, percentageKey: 'SavingsInvestments', type: 'Investments' }
  ];

  const budgetCategories = useMemo(() => 
    CATEGORIES.map(category => ({
      ...category,
      budget: monthlyIncome * budgetPercentages[category.percentageKey] * 0.01,
      spent: spentMap[category.name] || 0,
    }))
  , [monthlyIncome, budgetPercentages, spentMap]);

  return (
    <div className="max-w-7xl mx-auto">
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
              <option key={index} value={year}>{year} {index > 0 && userType !== 'premium' ? '💎' : ''}</option>
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
            <option value='Personalized'>Personalized {userType !== 'premium' ? '💎' : ''}</option>
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
                  <div className="p-2 bg-blue-50 dark:bg-opacity-20 dark:bg-blue-900 rounded-lg">
                    <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Budget Categories for {MONTH_NAMES[selectedMonth].charAt(0).toUpperCase() + MONTH_NAMES[selectedMonth].slice(1)} {selectedYear}
                  </h2>
                </div>
              </div>
            </div>
            {monthlyIncome === 0 ? loadingReport ? <Spinner /> : <div className="p-6 text-center text-gray-500 dark:text-gray-400">You don't have sufficient balance</div> :
              <div className="divide-y relative divide-gray-100 dark:divide-gray-700 overflow-hidden">
                {(financeRule !== '50/30/20' || selectedYear !== currentYear) && userType !== 'premium' ? (
                  <div className="absolute inset-0 backdrop-blur-sm bg-opacity-75">
                    <div className="max-w-xl mx-auto p-6 bg-gradient-to-r from-blue-500 dark:bg-blue-500 dark:bg-opacity-20 to-blue-700 text-white rounded-b-lg shadow-lg">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <h2 className="text-2xl font-bold">Unlock Premium Features</h2>
                          <p className="mt-2 text-lg">Get access to exclusive content and features by upgrading to our premium plan.</p>
                          <button className="mt-4 px-4 py-2 bg-white dark:bg-black dark:text-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Upgrade Now</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
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
                              ((category.spent / (category.budget || 1)) * 100) >= 95 ? 'text-red-600 dark:text-red-400' : 
                              ((category.spent / (category.budget || 1)) * 100) >= 80 ? 'text-yellow-400 dark:text-yellow-300' : 
                              'text-green-400 dark:text-green-300'
                            }`}>
                              ₹{category.spent.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-100 dark:bg-[#ffffff0f] rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            ((category.spent / (category.budget || 1)) * 100) >= 95 ? 'bg-red-500 dark:bg-red-400' : 
                            ((category.spent / (category.budget || 1)) * 100) >= 80 ? 'bg-yellow-400 dark:bg-yellow-300' : 
                            'bg-green-400 dark:bg-green-300'
                          }`}
                          style={{ width: `${Math.min((category.spent / (category.budget || 1)) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{((category.spent / (category.budget || 1)) * 100).toFixed(0)}% used</span>
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
          <div className="rounded-xl sticky top-2">
            <div className="">
              <div className="space-y-2">
                <BudgetAllocationTable 
                  selectedYear={selectedYear} 
                  financeRule={financeRule} 
                  budgetPercentages13rd={budgetPercentages} 
                  editPersonalBudget={editPersonalBudget} 
                  setEditPersonalBudget={setEditPersonalBudget} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <PersonalizedBudgetAllocationForm 
        selectedMonth={selectedMonth} 
        selectedYear={selectedYear} 
        setbudgetPercentages13rd={setbudgetPercentages13rd} 
        setEditPersonalBudget={setEditPersonalBudget} 
        editPersonalBudget={editPersonalBudget} 
        budgetPercentages13rd={budgetPercentages13rd} 
      />
    </div>
  );
};

// Sub-Components

const BudgetAllocationTable = ({ financeRule, selectedYear, budgetPercentages13rd, editPersonalBudget, setEditPersonalBudget }) => {
  const { userType } = authCheck();
  const currentYear = new Date().getFullYear();
  const budgetPercentages = budgetPercentages13rd;

  return (
    <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#ffffff24] max-w-2xl mx-auto">
      <div className="border-b border-gray-200 dark:border-[#ffffff24] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:bg-opacity-10">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-8V3.5L18.5 9H13z"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Budget Allocation Chart</h2>
          </div>
          {financeRule !== '50/30/20' && userType === 'premium' && (
            <div onClick={() => setEditPersonalBudget(true)} className="text-xl cursor-pointer">
              <div className="p-2 hover:bg-blue-50 dark:hover:bg-opacity-20 dark:hover:bg-blue-900 rounded-lg">
                <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-600" />
              </div>
            </div>
          )}
        </div>
      </div>
      {(financeRule !== '50/30/20' || selectedYear !== currentYear) && userType !== 'premium' ? (
        <div className="max-w-xl mx-auto p-6 bg-gradient-to-r from-blue-500 dark:bg-blue-500 dark:bg-opacity-20 to-blue-700 text-white rounded-b-lg shadow-lg">
          <div className="flex items-center">
            <Crown className='h-14 w-14' />
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
                <div className="text-gray-800 dark:text-gray-100">{budgetPercentages.Housing}%</div>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
                <div className="text-gray-800 dark:text-gray-100">Utilities</div>
                <div className="text-gray-800 dark:text-gray-100">💡</div>
                <div className="text-gray-800 dark:text-gray-100">{budgetPercentages.Utilities}%</div>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
                <div className="text-gray-800 dark:text-gray-100">Food & Dining</div>
                <div className="text-gray-800 dark:text-gray-100">🍽️</div>
                <div className="text-gray-800 dark:text-gray-100">{budgetPercentages.FoodAndDining}%</div>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
                <div className="text-gray-800 dark:text-gray-100">Healthcare</div>
                <div className="text-gray-800 dark:text-gray-100">⚕️</div>
                <div className="text-gray-800 dark:text-gray-100">{budgetPercentages.Healthcare}%</div>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
                <div className="text-gray-800 dark:text-gray-100">Transportation</div>
                <div className="text-gray-800 dark:text-gray-100">🚗</div>
                <div className="text-gray-800 dark:text-gray-100">{budgetPercentages.Transportation}%</div>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
                <div className="text-gray-800 dark:text-gray-100">Insurance</div>
                <div className="text-gray-800 dark:text-gray-100">🛡️</div>
                <div className="text-gray-800 dark:text-gray-100">{budgetPercentages.Insurance}%</div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="font-bold text-lg text-gray-800 dark:text-gray-100">Wants (30%)</div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
                <div className="text-gray-800 dark:text-gray-100">Entertainment</div>
                <div className="text-gray-800 dark:text-gray-100">🎬</div>
                <div className="text-gray-800 dark:text-gray-100">{budgetPercentages.Entertainment}%</div>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
                <div className="text-gray-800 dark:text-gray-100">Other Miscellaneous</div>
                <div className="text-gray-800 dark:text-gray-100">📦</div>
                <div className="text-gray-800 dark:text-gray-100">{budgetPercentages.OtherMiscellaneous}%</div>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
                <div className="text-gray-800 dark:text-gray-100">Education</div>
                <div className="text-gray-800 dark:text-gray-100">📚</div>
                <div className="text-gray-800 dark:text-gray-100">{budgetPercentages.Education}%</div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="font-bold text-lg text-gray-800 dark:text-gray-100">Savings/Investments (20%)</div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#ffffff24] py-2">
                <div className="text-gray-800 dark:text-gray-100">Savings/Investments</div>
                <div className="text-gray-800 dark:text-gray-100">💰</div>
                <div className="text-gray-800 dark:text-gray-100">{budgetPercentages.SavingsInvestments}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BudgetCategory = ({ title, percentage, children }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-2">
      <h3 className="text-base font-semibold dark:text-white">{title}</h3>
      <span className="text-sm text-gray-500 dark:text-gray-200">({percentage}%)</span>
    </div>
    <div className="grid grid-cols-2 gap-2">{children}</div>
  </div>
);

const BudgetInput = ({ label, emoji, name, value, onChange, error }) => (
  <div className="relative">
    <label className="block text-md mb-1 dark:text-gray-300">
      <span className="mr-1">{emoji}</span>
      {label}
    </label>
    <span className="absolute right-6 top-[70%] -translate-y-1/2">
      <Percent size={22} className="text-gray-400" />
    </span>
    <input
      type="number"
      step="0.01"
      min="0"
      max="100"
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-3 pr-14 text-md dark:text-white dark:bg-[#0a0a0a] dark:border-[#ffffff24] border rounded-md 
        focus:outline-none focus:ring-1 focus:ring-blue-500
        ${error ? 'border-red-500 dark:border-red-500' : 'border-gray-200'}`}
    />
    {error && (
      <div className="absolute -bottom-4 left-0 text-xs text-red-500">
        {error}
      </div>
    )}
  </div>
);

const PersonalizedBudgetAllocationForm = ({ selectedMonth, selectedYear, editPersonalBudget, setEditPersonalBudget, setbudgetPercentages13rd, budgetPercentages13rd }) => {
  const { addBudget, setrule, error, setBudgetMonth, setBudgetYear } = BudgetData();
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    setbudgetPercentages13rd(prev => ({
      ...prev,
      [name]: numValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate main categories
    const mainTotal = budgetPercentages13rd.Needs + budgetPercentages13rd.Wants + budgetPercentages13rd.SavingsInvestments;
    if (mainTotal !== 100) {
      newErrors.total = 'Main categories (Needs + Wants + Savings/Investments) must sum to 100%';
    }
    
    // Define subcategories
    const needsSubcategories = ['Housing', 'Utilities', 'FoodAndDining', 'Healthcare', 'Transportation', 'Insurance'];
    const wantsSubcategories = ['Entertainment', 'OtherMiscellaneous', 'Education'];
    
    // Validate Needs subcategories
    const needsSubTotal = needsSubcategories.reduce((sum, key) => sum + budgetPercentages13rd[key], 0);
    if (needsSubTotal !== budgetPercentages13rd.Needs) {
      newErrors.needsSub = 'Needs subcategories must sum to Needs percentage';
      needsSubcategories.forEach(key => newErrors[key] = '');
      newErrors.Needs = '';
    }
    
    // Validate Wants subcategories
    const wantsSubTotal = wantsSubcategories.reduce((sum, key) => sum + budgetPercentages13rd[key], 0);
    if (wantsSubTotal !== budgetPercentages13rd.Wants) {
      newErrors.wantsSub = 'Wants subcategories must sum to Wants percentage';
      wantsSubcategories.forEach(key => newErrors[key] = '');
      newErrors.Wants = '';
    }
    
    // Validate individual percentages
    Object.entries(budgetPercentages13rd).forEach(([key, value]) => {
      if (value < 0 || value > 100) {
        newErrors[key] = 'Must be 0-100%';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSaveStatus('success');
      setBudgetMonth(selectedMonth);
      setBudgetYear(selectedYear);
      addBudget(budgetPercentages13rd);

      setTimeout(() => {
        setSaveStatus(null);
        setEditPersonalBudget(false);
      }, 1500);
    } else {
      setSaveStatus('error');
    }
  };

  return (
    <>
      <div 
        className={`${editPersonalBudget ? 'block' : 'hidden'} fixed inset-0 bg-gray-500 dark:bg-[#000000aa] backdrop-blur-[0.01rem] bg-opacity-75 z-40`}
        onClick={() => setEditPersonalBudget(false)}
      />

      <div className={`bg-white dark:bg-[#0a0a0a] border-gray-200 border dark:border-[#ffffff24] fixed 
        ${editPersonalBudget ? 'right-0' : 'right-[-24rem]'} duration-300 transition-right 
        top-0 h-screen sm:w-96 shadow-lg z-50`}>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-[#ffffff24]">
            <h2 className="text-lg font-bold dark:text-white">Budget Allocation</h2>
            <div className={`text-sm font-medium ${errors.total ? 'text-red-500' : 'text-green-500'}`}>
              Total: {(budgetPercentages13rd.Needs + budgetPercentages13rd.Wants + budgetPercentages13rd.SavingsInvestments)}%
            </div>
          </div>

          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            <form id="budgetForm" onSubmit={handleSubmit}>
              {errors.total && (
                <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md">
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.total}</p>
                </div>
              )}
              
              {saveStatus === 'success' && (
                <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md">
                  <p className="text-xs text-green-600 dark:text-green-400">Budget saved successfully!</p>
                </div>
              )}

              <BudgetCategory title="Needs" percentage={budgetPercentages13rd.Needs}>
                <BudgetInput
                  label="Needs"
                  emoji=""
                  name="Needs"
                  value={budgetPercentages13rd.Needs}
                  onChange={handleChange}
                  error={errors.Needs}
                />
                <BudgetInput
                  label="Housing"
                  emoji="🏠"
                  name="Housing"
                  value={budgetPercentages13rd.Housing}
                  onChange={handleChange}
                  error={errors.Housing}
                />
                <BudgetInput
                  label="Utilities"
                  emoji="💡"
                  name="Utilities"
                  value={budgetPercentages13rd.Utilities}
                  onChange={handleChange}
                  error={errors.Utilities}
                />
                <BudgetInput
                  label="Food & Dining"
                  emoji="🍽️"
                  name="FoodAndDining"
                  value={budgetPercentages13rd.FoodAndDining}
                  onChange={handleChange}
                  error={errors.FoodAndDining}
                />
                <BudgetInput
                  label="Healthcare"
                  emoji="⚕️"
                  name="Healthcare"
                  value={budgetPercentages13rd.Healthcare}
                  onChange={handleChange}
                  error={errors.Healthcare}
                />
                <BudgetInput
                  label="Transportation"
                  emoji="🚗"
                  name="Transportation"
                  value={budgetPercentages13rd.Transportation}
                  onChange={handleChange}
                  error={errors.Transportation}
                />
                <BudgetInput
                  label="Insurance"
                  emoji="🛡️"
                  name="Insurance"
                  value={budgetPercentages13rd.Insurance}
                  onChange={handleChange}
                  error={errors.Insurance}
                />
              </BudgetCategory>

              <BudgetCategory title="Wants" percentage={budgetPercentages13rd.Wants}>
                <BudgetInput
                  label="Wants"
                  emoji=""
                  name="Wants"
                  value={budgetPercentages13rd.Wants}
                  onChange={handleChange}
                  error={errors.Wants}
                />
                <BudgetInput
                  label="Entertainment"
                  emoji="🎬"
                  name="Entertainment"
                  value={budgetPercentages13rd.Entertainment}
                  onChange={handleChange}
                  error={errors.Entertainment}
                />
                <BudgetInput
                  label="Miscellaneous"
                  emoji="📦"
                  name="OtherMiscellaneous"
                  value={budgetPercentages13rd.OtherMiscellaneous}
                  onChange={handleChange}
                  error={errors.OtherMiscellaneous}
                />
                <BudgetInput
                  label="Education"
                  emoji="📚"
                  name="Education"
                  value={budgetPercentages13rd.Education}
                  onChange={handleChange}
                  error={errors.Education}
                />
              </BudgetCategory>

              <BudgetCategory title="Savings/Investments" percentage={budgetPercentages13rd.SavingsInvestments}>
                <BudgetInput
                  label="Savings"
                  emoji="💰"
                  name="SavingsInvestments"
                  value={budgetPercentages13rd.SavingsInvestments}
                  onChange={handleChange}
                  error={errors.SavingsInvestments}
                />
              </BudgetCategory>
            </form>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="border-t dark:border-[#ffffff24] p-4">
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setEditPersonalBudget(false)}
                className="px-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-opacity-20 dark:hover:bg-opacity-20"
              >
                Cancel
              </button>
              <button
                form="budgetForm"
                type="submit"
                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Budget;

const styles = `
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;