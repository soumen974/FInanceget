import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign, PieChart, Edit2, Trash2, AlertCircle, CheckCircle, X,
  Coffee, Home, Smartphone, Users,Book, Gift, Shield, Sun, TrendingUp
} from 'react-feather';
import { Car, Crown, Twitter,LightbulbIcon, Percent, HeartHandshake, Lightbulb, Utensils, Tv, Package, BookOpen, PiggyBank } from "lucide-react";
import { ReportsData } from './Components/Reports/ReportsData';
import { useGlobalTransactionData } from "../Pages/Components/Income/TransactionList";
import { formatCurrency } from "./Components/Income/formatCurrency";
import { authCheck } from "../Auth/Components/ProtectedCheck";
import Spinner from "../Loaders/Spinner";
import { Link } from 'react-router-dom';
import { api } from "../AxiosMeta/ApiAxios";

// Main Budget Component
const Budget = () => {
  const {
    TransactionData,
    lifeTimeballence,
    Availableyears,
    searchYear,
    setsearchYear,
    setMonth,
    loadingReport,
    categoryData = { categoryIncomeData: [], categoryExpenseData: [] }
  } = ReportsData();

  const { userType } = authCheck();
  const { totalIncomeFortheCurrentMonth, setsearchYearForList, setMonthForList } = useGlobalTransactionData('income');

  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [financeRule, setFinanceRule] = useState('50/30/20');
  const [editPersonalBudget, setEditPersonalBudget] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(totalIncomeFortheCurrentMonth);
  const [incomeSource, setIncomeSource] = useState('current'); // 'current' or 'lifetime'

  const isPremiumOrAdmin = userType === 'premium' || userType === 'admin';

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

  const years = useMemo(() => 
    Availableyears.length > 0 ? Availableyears : [currentYear], 
    [Availableyears]
  );

  useEffect(() => {
    setsearchYear(selectedYear);
    setMonth(selectedMonth);
    setsearchYearForList(selectedYear);
    setMonthForList(selectedMonth);
    // Update monthly income based on selected source
    setMonthlyIncome(incomeSource === 'current' ? totalIncomeFortheCurrentMonth : lifeTimeballence.totalBalance);
    if (financeRule === 'Personalized' && isPremiumOrAdmin) {
      fetchBudget();
    }
  }, [selectedYear, selectedMonth, financeRule, isPremiumOrAdmin, 
      setsearchYear, setMonth, setsearchYearForList, setMonthForList, 
      totalIncomeFortheCurrentMonth, lifeTimeballence.totalBalance, incomeSource]);

  const fetchBudget = async () => {
    try {
      const response = await api.get(`/api/budget/${selectedYear}/${selectedMonth}`);
      const budget = response.data || {};
      setbudgetPercentages13rd(budget.allocations || budgetPercentages13rd);
    } catch (err) {
      console.error('Failed to fetch budget:', err);
    }
  };

  const DemocategoryData = [{ name: 'No data found', value: 404 }];
  const actualData = categoryData.categoryExpenseData;
  const Data = actualData?.length === 0 ? DemocategoryData : actualData;

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthsForIncome = useMemo(() => {
    if (TransactionData.length > 0) {
      return TransactionData
        .filter(month => month.income > 0)
        .map(month => month.name);
    }
    return [];
  }, [TransactionData]);

  const spentMap = useMemo(() => {
    const map = {};
    Data.forEach(item => {
      map[item.name] = item.value;
    });
    return map;
  }, [Data]);

  const CATEGORIES = [
    { id: 1, name: 'Housing', icon: <Home />, percentageKey: 'Housing', type: 'Needs' },
    { id: 2, name: 'Utilities', icon: <Lightbulb />, percentageKey: 'Utilities', type: 'Needs' },
    { id: 3, name: 'Food & Dining', icon: <Utensils />, percentageKey: 'FoodAndDining', type: 'Needs' },
    { id: 4, name: 'Healthcare', icon: <HeartHandshake />, percentageKey: 'Healthcare', type: 'Needs' },
    { id: 5, name: 'Transportation', icon: <Car />, percentageKey: 'Transportation', type: 'Needs' },
    { id: 6, name: 'Insurance', icon: <Shield />, percentageKey: 'Insurance', type: 'Needs' },
    { id: 7, name: 'Entertainment', icon: <Tv />, percentageKey: 'Entertainment', type: 'Wants' },
    { id: 8, name: 'Other Miscellaneous', icon: <Package />, percentageKey: 'OtherMiscellaneous', type: 'Wants' },
    { id: 9, name: 'Education', icon: <BookOpen />, percentageKey: 'Education', type: 'Wants' },
    { id: 10, name: 'Savings/Investments', icon: <TrendingUp />, percentageKey: 'SavingsInvestments', type: 'Investments' }
  ];

  const budgetPercentages = financeRule === '50/30/20' ? budgetPercentages523 : budgetPercentages13rd;

  const budgetCategories = useMemo(() => 
    CATEGORIES.map(category => ({
      ...category,
      budget: monthlyIncome * (budgetPercentages[category.percentageKey] || 0) * 0.01,
      spent: spentMap[category.name] || 0,
    }))
  , [monthlyIncome, budgetPercentages, spentMap]);

  const shareBudget = () => {
    const tweet = `Managed my ${MONTH_NAMES[selectedMonth]} budget on FinanceGet! Total: ₹${monthlyIncome}. Join me: https://financeget.vercel.app #FinanceGet @Soumen81845556`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
  };

  return (
    <div className="max-w-6xl pb-6 mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Budget Management</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track and manage your spending limits across categories
            </p>
          </div>
          <div className="flex items-center gap-3">
            {totalIncomeFortheCurrentMonth===lifeTimeballence.totalBalance?
             <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400"> Total Budget by income :</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(monthlyIncome)}
              </span>
            </div>
            :
            <div className="flex  items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300  md:w-fit w-[8rem]">
                Total Budget by {incomeSource === 'current' ? 'Current Income:' : 'Lifetime Balance:'}
              </label>
              <select 
                value={incomeSource} 
                onChange={(e) => setIncomeSource(e.target.value)}
                className="w-[26vw] truncate sm:w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-gray-300"
              >
                <option value="current">{formatCurrency(totalIncomeFortheCurrentMonth)}</option>
                <option value="lifetime">{formatCurrency(lifeTimeballence.totalBalance)}</option>
              </select>
            </div>
            }
            
            
          </div>
        </div>
      </div>

      <div className="mb-8 flex  sm:gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ">Select Month</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="w-[26vw] truncate sm:w-full   mt-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-gray-300"
          >
            {MONTH_NAMES.map((month, index) => (
              <option 
                key={index} 
                value={index}
                disabled={!monthsForIncome.includes(month) && TransactionData.length > 0}
              >
                {month} {!monthsForIncome.includes(month) && TransactionData.length > 0 ? '' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Year</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-[23vw]  sm:w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:bg-[#0a0a0a] dark:border-[#ffffff24] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:text-gray-300"
          >
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year} {!isPremiumOrAdmin && year !== currentYear ? '💎' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Finance Rule</label>
          <select 
            value={financeRule} 
            onChange={(e) => setFinanceRule(e.target.value)}
            className="w-[29vw] sm:w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:bg-[#0a0a0a] dark:border-[#ffffff24] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:text-gray-300"
          >
            <option value="50/30/20">50/30/20 Rule</option>
            <option value="Personalized">
              Personalized {!isPremiumOrAdmin ? '💎' : ''}
            </option>
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
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-opacity-20 dark:bg-blue-900 rounded-lg">
                    <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Budget Categories for {MONTH_NAMES[selectedMonth].charAt(0).toUpperCase() + MONTH_NAMES[selectedMonth].slice(1)} {selectedYear}
                  </h2>
                </div>
                <div className="mt-4">
                  <button
                    onClick={shareBudget}
                    className="group inline-flex gap-2 items-center px-4 py-2 bg-indigo-50 dark:bg-blue-900 dark:border dark:border-blue-700 text-blue-700 dark:text-white text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors duration-150 shadow-sm"
                  >
                    Share Your Budget
                    <Twitter className='ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200' />
                  </button>
                </div>
              </div>
            </div>
            {monthlyIncome === 0 ? loadingReport ? <Spinner /> : (
              <div className="p-6 text-center space-y-6 text-gray-500 dark:text-gray-400">
               
                <h1 className=" pb-6">You don't have sufficient balance</h1>
                <Link to="/income" className="bg-blue-50 dark:bg-blue-600 text-[0.8rem] dark:bg-opacity-20 text-blue-600 p-2 px-3 rounded-md">Start a new transaction</Link>
              
              </div>
            ) : (
              <div className="divide-y relative divide-gray-100 dark:divide-[#ffffff24] overflow-hidden">
                {(financeRule !== '50/30/20' || selectedYear !== currentYear) && !isPremiumOrAdmin ? (
                  <div className="absolute inset-0 backdrop-blur-sm bg-opacity-75">
                    <div className="max-w-xl mx-auto p-6 bg-gradient-to-r from-blue-500 dark:bg-blue-500 dark:bg-opacity-20 to-blue-700 text-white rounded-b-lg shadow-lg">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <h2 className="text-2xl font-bold">Unlock Premium Features</h2>
                          <p className="mt-2 mb-4 text-lg">Get access to exclusive content and features by upgrading to our premium plan.</p>
                          <Link to={'/upgrade'} className="px-4 py-2 bg-white dark:bg-black dark:text-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Upgrade Now</Link>
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
                              {formatCurrency(category.budget)}
                            </span>
                            <span className="text-gray-300 dark:text-gray-500">•</span>
                            <span className="text-gray-500 dark:text-gray-400">Spent:</span>
                            <span className={`font-medium ${
                              ((category.spent / (category.budget || 1)) * 100) >= 95 ? 'text-red-600 dark:text-red-400' : 
                              ((category.spent / (category.budget || 1)) * 100) >= 80 ? 'text-yellow-400 dark:text-yellow-300' : 
                              'text-[#10B981] dark:text-[#10B981]'
                            }`}>
                              {formatCurrency(category.spent)}
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
                            'bg-[#10B981] dark:bg-[#10B981]'
                          }`}
                          style={{ width: `${Math.min((category.spent / (category.budget || 1)) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{((category.spent / (category.budget || 1)) * 100).toFixed(0)}% used</span>
                        <span>{formatCurrency(category.budget - category.spent)} remaining</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="rounded-xl">
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

          {/* Monetization: Budget-Related Affiliates */}
          <div className="mt-6 p-4 bg-white dark:bg-[#0a0a0a] rounded-lg shadow-sm border border-gray-200 dark:border-[#ffffff24]">
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Master Your Budget
            </h3>

            <div className="flex items-center justify-start gap-2">
              <div className="mt-0 flex items-center text-indigo-600 dark:text-indigo-400">•</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Learn the 50/30/20 rule with{' '}
                <a
                  href="https://www.amazon.in/Budgeting-101-Tracking-Financial-Essential/dp/150720907X?crid=2SO5M4BKAXMAX&dib=eyJ2IjoiMSJ9.rAVtOtjFQ0T6Q-Opl2qtqQiN-13co4hMTqZoHCv5j8B4gwFd4rgGwOhEAhdUOsbdB7EonGh0vzpZPJtcKz8z-A.04ZYPY0lmHFO2oFNmgNGdIuk_0m12q9wGV7r1lQ0N1M&dib_tag=se&keywords=Budgeting+101+by+Michele+Cagan.&qid=1740651360&sprefix=budgeting+101+by+michele+cagan.%2Caps%2C385&sr=8-1&linkCode=ll1&tag=financegetbys-21&linkId=58a0d044aec974be4f45aa27f9783f04&language=en_IN&ref_=as_li_ss_tl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  Budgeting 101 by Michele Cagan
                </a>.
              </p>
            </div>

            <div className="flex items-center justify-start gap-2">
              <div className="mt-0 flex items-center text-indigo-600 dark:text-indigo-400">•</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Protect your finances with{' '}
                <a
                  href="https://www.policybazaar.com/health-insurance/health-insurance-india/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                   Policybazaar Insurance—compare & save
                </a>.
              </p>
            </div>

          </div>

          {/* Usage: Budget Tip */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg shadow-sm border dark:border-[#ffffff24]">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-20 rounded-full">
                <LightbulbIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="">
                <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Budget Tip
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Optimize your 50/30/20 rule—read{' '}
                  <a
                    href="https://www.amazon.in/All-Your-Worth-Ultimate-Lifetime/dp/0743269888?crid=1AT6TVOE80K5J&dib=eyJ2IjoiMSJ9.5GUJ8kYj9yMBf1P4L6hjyyWufTADqvLSO2Y3NXI6atLGjHj071QN20LucGBJIEps.kp-zR_ssenKYA62lIPJyK5oeO-fFHEm-kvSTh13B6jQ&dib_tag=se&keywords=All+Your+Worth+by+Elizabeth+Warren.&qid=1740651460&sprefix=all+your+worth+by+elizabeth+warren.%2Caps%2C419&sr=8-1&linkCode=ll1&tag=financegetbys-21&linkId=55e98425506ed95278a1913f390aed59&language=en_IN&ref_=as_li_ss_tl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    All Your Worth
                  </a>{' '}
                  by Elizabeth Warren.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPremiumOrAdmin && (
        <PersonalizedBudgetAllocationForm 
          selectedMonth={selectedMonth} 
          selectedYear={selectedYear} 
          setbudgetPercentages13rd={setbudgetPercentages13rd} 
          setEditPersonalBudget={setEditPersonalBudget} 
          editPersonalBudget={editPersonalBudget} 
          budgetPercentages13rd={budgetPercentages13rd} 
          setFinanceRule={setFinanceRule}
          isPremiumOrAdmin={isPremiumOrAdmin}
        />
      )}
    </div>
  );
};

// BudgetAllocationTable Component
const BudgetAllocationTable = ({ financeRule, selectedYear, budgetPercentages13rd, editPersonalBudget, setEditPersonalBudget }) => {
  const { userType } = authCheck();
  const currentYear = new Date().getFullYear();
  const budgetPercentages = budgetPercentages13rd;
  const isPremiumOrAdmin = userType === 'premium' || userType === 'admin';

  const categories = [
    {
      title: 'Needs',
      items: [
        { name: 'Housing', icon: <Home size={16} />, key: 'Housing' },
        { name: 'Utilities', icon: <Lightbulb size={16} />, key: 'Utilities' },
        { name: 'Food & Dining', icon: <Utensils size={16} />, key: 'FoodAndDining' },
        { name: 'Healthcare', icon: <HeartHandshake size={16} />, key: 'Healthcare' },
        { name: 'Transportation', icon: <Car size={16} />, key: 'Transportation' },
        { name: 'Insurance', icon: <Shield size={16} />, key: 'Insurance' },
      ],
    },
    {
      title: 'Wants',
      items: [
        { name: 'Entertainment', icon: <Tv size={16} />, key: 'Entertainment' },
        { name: 'Miscellaneous', icon: <Package size={16} />, key: 'OtherMiscellaneous' },
        { name: 'Education', icon: <BookOpen size={16} />, key: 'Education' },
      ],
    },
    {
      title: 'Savings',
      items: [
        { name: 'Savings', icon: <PiggyBank size={16} />, key: 'SavingsInvestments' },
      ],
    },
  ];

  // Calculate dynamic percentages for main categories
  const getCategoryPercentage = (title) => {
    switch (title) {
      case 'Needs':
        return budgetPercentages.Needs || 0;
      case 'Wants':
        return budgetPercentages.Wants || 0;
      case 'Savings':
        return budgetPercentages.SavingsInvestments || 0;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#ffffff24] max-w-2xl mx-auto">
      <div className="p-4 border-b border-gray-200 dark:border-[#ffffff24] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-8V3.5L18.5 9H13z"/>
          </svg>
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Budget Allocation</h2>
        </div>
        {financeRule !== '50/30/20' && isPremiumOrAdmin && (
          <button
            onClick={() => setEditPersonalBudget(true)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-blue-700/30  rounded"
          >
            <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
        )}
      </div>
      {(financeRule !== '50/30/20' || selectedYear !== currentYear) && !isPremiumOrAdmin ? (
        <div className="p-4 bg-gradient-to-r from-blue-500 dark:bg-blue-500 dark:bg-opacity-20 to-blue-700 text-white rounded-b-lg">
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8" />
            <div>
              <h2 className="text-base font-semibold">Unlock Premium</h2>
              <p className="mt-1 text-xs">Upgrade for more features.</p>
              <Link
                to="/upgrade"
                className="mt-2 inline-block px-2 py-1 bg-white dark:bg-black dark:text-white text-blue-700 text-xs font-medium rounded hover:bg-gray-100"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {categories.map((category) => (
            <div key={category.title} className="space-y-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">
                {category.title} <span className="text-gray-500 dark:text-gray-400">({getCategoryPercentage(category.title)}%)</span>
              </h3>
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between py-1 text-sm text-gray-700 dark:text-gray-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{budgetPercentages[item.key] || 0}%</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// BudgetCategory Component
const BudgetCategory = ({ title, percentage, children, error }) => (
  <div className="mb-3">
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
      <span className="text-xs text-gray-500 dark:text-gray-400">({percentage}%)</span>
    </div>
    {error && <p className="text-xs text-red-600 dark:text-red-400 mb-1">{error}</p>}
    <div className="space-y-2">{children}</div>
  </div>
);

// BudgetInput Component
const BudgetInput = ({ label, emoji, name, value, onChange, error, disabled, max }) => (
  <div className="relative">
    <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
      <span className="mr-1">{emoji}</span>
      {label}
    </label>
    <span className="absolute right-2 top-[60%] -translate-y-1/2">
      <Percent size={16} className="text-gray-400" />
    </span>
    <input
      type="number"
      step="0.01"
      min="0"
      max={max}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full p-2 pr-8 text-sm bg-white dark:bg-[#0a0a0a] dark:text-white border rounded-md 
        focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800
        ${error ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-[#ffffff24]'}`}
    />
    {error && (
      <div className="absolute -bottom-3 left-0 text-[10px] text-red-500">{error}</div>
    )}
  </div>
);

// PersonalizedBudgetAllocationForm Component
const PersonalizedBudgetAllocationForm = ({
  selectedMonth,
  selectedYear,
  editPersonalBudget,
  setEditPersonalBudget,
  setbudgetPercentages13rd,
  budgetPercentages13rd,
  setFinanceRule,
  isPremiumOrAdmin,
}) => {
  const [formData, setFormData] = useState({
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
    SavingsInvestments: 0,
  });
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [isExistingBudget, setIsExistingBudget] = useState(false);

  // Fetch budget on form open
  useEffect(() => {
    if (editPersonalBudget) {
      fetchBudget();
    }
  }, [editPersonalBudget, selectedYear, selectedMonth]);

  // Fetch budget using api instance
  const fetchBudget = async () => {
    setLoading(true);
    setApiError('');
    setErrors({});
    try {
      const response = await api.get(`/api/budget/${selectedYear}/${selectedMonth}`);
      const budget = response.data || {};
      const allocations = budget.allocations || budgetPercentages13rd;
      setFormData(allocations);
      setbudgetPercentages13rd(allocations);
      setIsExistingBudget(!!budget.allocations && Object.values(budget.allocations).some(val => val > 0));
      if (budget.allocations) setFinanceRule('Personalized');
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch budget';
      setApiError(errorMsg);
      setFormData(budgetPercentages13rd); // Fallback to parent data
      setIsExistingBudget(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = Math.max(0, Math.min(100, parseFloat(value) || 0)); // Clamp 0-100

    setFormData(prev => ({
      ...prev,
      [name]: numValue,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: null,
      total: null,
      needsSub: null,
      wantsSub: null,
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    const mainTotal = formData.Needs + formData.Wants + formData.SavingsInvestments;
    if (mainTotal !== 100) {
      newErrors.total = `Main categories must total 100% (Current: ${mainTotal.toFixed(2)}%)`;
    }

    const needsSubcategories = ['Housing', 'Utilities', 'FoodAndDining', 'Healthcare', 'Transportation', 'Insurance'];
    const wantsSubcategories = ['Entertainment', 'OtherMiscellaneous', 'Education'];

    const needsSubTotal = needsSubcategories.reduce((sum, key) => sum + (formData[key] || 0), 0);
    if (needsSubTotal > formData.Needs) {
      newErrors.needsSub = `Needs subcategories (${needsSubTotal.toFixed(2)}%) exceed Needs (${formData.Needs}%)`;
    }

    const wantsSubTotal = wantsSubcategories.reduce((sum, key) => sum + (formData[key] || 0), 0);
    if (wantsSubTotal > formData.Wants) {
      newErrors.wantsSub = `Wants subcategories (${wantsSubTotal.toFixed(2)}%) exceed Wants (${formData.Wants}%)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPremiumOrAdmin) {
      setApiError('Unlock Premium Features');
      setSaveStatus('error');
      return;
    }

    if (!validateForm()) {
      setSaveStatus('error');
      return;
    }

    setSaveStatus('pending');
    setLoading(true);
    setApiError('');
    setMessage('');

    try {
      const response = await (isExistingBudget ? api.put : api.post)(
        `/api/budget/${selectedYear}/${selectedMonth}`,
        { allocations: formData }
      );
      const data = response.data || {};
      setMessage(isExistingBudget ? 'Budget updated successfully' : 'Budget added successfully');
      setFormData(data.allocations || formData);
      setbudgetPercentages13rd(data.allocations || formData);
      setFinanceRule('Personalized');
      setSaveStatus('success');
      setTimeout(() => {
        setEditPersonalBudget(false);
        setSaveStatus(null);
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to save budget';
      setApiError(errorMsg);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate main total for display
  const mainTotal = formData.Needs + formData.Wants + formData.SavingsInvestments;

  return (
    <>
    <div
      className={`${editPersonalBudget ? 'block' : 'hidden'} fixed inset-0 bg-black bg-opacity-70 backdrop-blur-[0.1rem]  z-40`}
      onClick={() => setEditPersonalBudget(false)}
    />
    <div
      className={`bg-white dark:bg-[#0a0a0a] border-gray-200 border dark:border-white/10 fixed 
        ${editPersonalBudget ? 'right-0' : '-right-full'} transition-all duration-300 ease-in-out 
        top-0 h-screen w-[85%] max-w-md shadow-xl z-50 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-white/10 bg-gradient-to-r  dark:bg-[#111111] ">
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Personalized Budget</h2>
        </div>
        <div className={`text-sm font-medium rounded-full px-2 py-0.5 ${
          mainTotal !== 100 
            ? 'text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-900/20' 
            : 'text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-900/20'
        }`}>
          {mainTotal.toFixed(1)}%
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(apiError || Object.keys(errors).length > 0) && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{apiError || errors.total || errors.needsSub || errors.wantsSub}</p>
          </div>
        )}
        {saveStatus === 'success' && message && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : (
          <form id="budgetForm" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Needs Section */}
              <BudgetCategory title="Needs" percentage={formData.Needs} error={errors.needsSub}>
                <BudgetInput label="Needs" emoji="" name="Needs" value={formData.Needs} onChange={handleChange} error={errors.Needs} disabled={loading} max="100" />
                <div className="grid grid-cols-2 gap-2">
                  <BudgetInput label="Housing" emoji="🏠" name="Housing" value={formData.Housing} onChange={handleChange} error={errors.Housing} disabled={loading} max={formData.Needs} />
                  <BudgetInput label="Utilities" emoji="💡" name="Utilities" value={formData.Utilities} onChange={handleChange} error={errors.Utilities} disabled={loading} max={formData.Needs} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <BudgetInput label="Food" emoji="🍽️" name="FoodAndDining" value={formData.FoodAndDining} onChange={handleChange} error={errors.FoodAndDining} disabled={loading} max={formData.Needs} />
                  <BudgetInput label="Health" emoji="⚕️" name="Healthcare" value={formData.Healthcare} onChange={handleChange} error={errors.Healthcare} disabled={loading} max={formData.Needs} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <BudgetInput label="Transport" emoji="🚗" name="Transportation" value={formData.Transportation} onChange={handleChange} error={errors.Transportation} disabled={loading} max={formData.Needs} />
                  <BudgetInput label="Insurance" emoji="🛡️" name="Insurance" value={formData.Insurance} onChange={handleChange} error={errors.Insurance} disabled={loading} max={formData.Needs} />
                </div>
              </BudgetCategory>

              {/* Wants Section */}
              <BudgetCategory title="Wants" percentage={formData.Wants} error={errors.wantsSub}>
                <BudgetInput label="Wants" emoji="" name="Wants" value={formData.Wants} onChange={handleChange} error={errors.Wants} disabled={loading} max="100" />
                <div className="grid grid-cols-3 gap-2">
                  <BudgetInput label="Fun" emoji="🎬" name="Entertainment" value={formData.Entertainment} onChange={handleChange} error={errors.Entertainment} disabled={loading} max={formData.Wants} />
                  <BudgetInput label="Misc" emoji="📦" name="OtherMiscellaneous" value={formData.OtherMiscellaneous} onChange={handleChange} error={errors.OtherMiscellaneous} disabled={loading} max={formData.Wants} />
                  <BudgetInput label="Edu" emoji="📚" name="Education" value={formData.Education} onChange={handleChange} error={errors.Education} disabled={loading} max={formData.Wants} />
                </div>
              </BudgetCategory>

              {/* Savings Section */}
              <BudgetCategory title="Savings" percentage={formData.SavingsInvestments}>
                <BudgetInput label="Savings" emoji="💰" name="SavingsInvestments" value={formData.SavingsInvestments} onChange={handleChange} error={errors.SavingsInvestments} disabled={loading} max="100" />
              </BudgetCategory>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="border-t dark:border-white/10 p-4 flex justify-end gap-3 bg-gray-50 dark:bg-[#111111]">
        <button
          type="button"
          onClick={() => setEditPersonalBudget(false)}
          className=" py-3 px-4 text-sm font-medium bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-white/15 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          form="budgetForm"
          type="submit"
          className=" py-3 px-4 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Budget'}
        </button>
      </div>
    </div>

    </>
  );
};

export { BudgetCategory, BudgetInput, BudgetAllocationTable, PersonalizedBudgetAllocationForm };
export default Budget;