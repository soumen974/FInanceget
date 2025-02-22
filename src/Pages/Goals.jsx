import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Goal,ReceiptIndianRupee, Calendar, X 
} from 'lucide-react';
import { authCheck } from "../Auth/Components/ProtectedCheck";

import { formatCurrency } from "./Components/Income/formatCurrency";


// Color Palette
const COLORS = {
  primary: '#8B5CF6',
  secondary: '#EC4899',
  accent: '#10B981',
  bgLight: '#FFFFFF',
  bgDark: '#0a0a0a',
  borderLight: '#F3F4F6',
  borderDark: '#ffffff24',
  textDark: '#1F2937',
  textLight: '#6B7280',
  success: '#10B981',
  warning: '#FBBF24',
  danger: '#EF4444',
};

const Goals = ({ darkMode }) => {
  const [goals, setGoals] = useState([
    { id: 1, name: "Emergency Fund", target: 5000, current: 3200, deadline: "2025-06-30" },
    { id: 2, name: "Vacation", target: 2000, current: 800, deadline: "2025-12-15" },
    { id: 3, name: "Vacation", target: 2000, current: 800, deadline: "2025-12-15" },
    { id: 4, name: "Vacation", target: 2000, current: 800, deadline: "2025-12-15" },
    { id: 5, name: "Vacation", target: 2000, current: 800, deadline: "2025-12-15" },
  ]);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: (new Date(new Date().setDate(new Date().getDate() + 1))).toISOString().split('T')[0] });
  const [showSuccess, setShowSuccess] = useState(false);
  const { userType } = authCheck();


  const baseStyles = {
    container: `bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-[#F3F4F6] dark:border-[#ffffff24]`,
    card: `p-4 hover:bg-gray-50 dark:hover:bg-[#ffffff06] transition-colors duration-150`,
    input: `w-full pl-12 pr-4 py-3 rounded-lg border dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200`,
    button: `px-4 py-2 rounded-lg font-medium transition-colors duration-150 text-sm`,
    activeButton: `bg-[#8B5CF6] text-white hover:bg-[#7C3AED]`,
    stickyForm: `sticky top-4 bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-[#F3F4F6] dark:border-[#ffffff24] `,
  };

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i - 2);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // saving calculation
  const calculateSavings = (target, deadline, current = 0) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const endDate = new Date(deadline);
    endDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // Calculate differences
    const daysDiffRaw = (endDate - today) / (1000 * 60 * 60 * 24);
    let monthsDiff = ((endDate.getFullYear() - today.getFullYear()) * 12) + 
                    (endDate.getMonth() - today.getMonth());
    let daysDiff = Math.ceil(daysDiffRaw);

    // Handle special cases
    const isSameMonth = endDate.getFullYear() === today.getFullYear() && 
                       endDate.getMonth() === today.getMonth();
    const isTodayOrPast = daysDiffRaw <= 0;

    // If date is today or earlier, return zeros
    if (isTodayOrPast) {
        return { 
            perMonth: 0, 
            perDay: 0, 
            remaining: parseFloat(target) - parseFloat(current), 
            monthsLeft: 0, 
            daysLeft: 0 
        };
    }

    // Adjust for current month: set months to 0 and ensure days >= 1
    if (isSameMonth) {
        monthsDiff = 0;
        daysDiff = Math.max(1, daysDiff); // Ensure at least 1 day
    } else {
        // For future months, ensure days is positive
        daysDiff = Math.max(1, daysDiff);
    }

    const remaining = parseFloat(target) - parseFloat(current);
    
    // Calculate per month (use days if in current month)
    const perMonth = monthsDiff > 0 ? remaining / monthsDiff : remaining / daysDiff;
    const perDay = remaining / daysDiff;

    return {
        perMonth: Math.max(0, perMonth).toFixed(2),
        perDay: Math.max(0, perDay).toFixed(2),
        remaining: Math.max(0, remaining).toFixed(2),
        monthsLeft: monthsDiff,
        daysLeft: daysDiff
    };
  };

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target && newGoal.deadline) {
      setGoals([...goals, { id: goals.length + 1, ...newGoal, current: 0 }]);
      setNewGoal({ name: '', target: '', deadline: '' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleRemoveGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 95) return COLORS.danger;
    if (percentage >= 80) return COLORS.warning;
    return COLORS.success;
  };

  if(userType === 'user'){
    return <div className="dark:text-white flex justify-center items-center place-content-center h-[90vh]">Under Construction for 1 day</div>
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white">Goal Management</h1>
            <p className="mt-1 text-sm text-[#6B7280] dark:text-gray-400">
              Track and achieve your financial goals
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#6B7280] dark:text-gray-400">Total Target:</span>
            <span className="text-lg font-semibold text-[#1F2937] dark:text-white">
              {formatCurrency(goals.reduce((sum, goal) => sum + parseFloat(goal.target), 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex gap-4">
        <div>
          <label className="text-sm font-medium text-[#6B7280] dark:text-gray-300">Select Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-[#F3F4F6] dark:bg-[#0a0a0a] dark:border-[#ffffff24] focus:border-[#8B5CF6] focus:ring-4 focus:ring-[#8B5CF6]/20 dark:text-white"
          >
            {MONTH_NAMES.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-[#6B7280] dark:text-gray-300">Select Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-[#F3F4F6] dark:bg-[#0a0a0a] dark:border-[#ffffff24] focus:border-[#8B5CF6] focus:ring-4 focus:ring-[#8B5CF6]/20 dark:text-white"
          >
            {years.map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle size={20} />
          <span>Goal added successfully!</span>
          <button
            onClick={() => setShowSuccess(false)}
            className="ml-2 p-1 hover:bg-green-100 dark:hover:bg-green-800/20 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Goals List */}
        <div className="lg:col-span-2">
          <div className={baseStyles.container}>
            <div className="p-6 border-b border-[#F3F4F6] dark:border-[#ffffff24]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 dark:bg-opacity-20 dark:bg-[#8B5CF6] rounded-lg">
                    <Goal className="w-5 h-5 text-[#8B5CF6] dark:text-[#8B5CF6]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1F2937] dark:text-white">
                    Goals for {MONTH_NAMES[selectedMonth].charAt(0).toUpperCase() + MONTH_NAMES[selectedMonth].slice(1)} {selectedYear}
                  </h2>
                </div>
              </div>
            </div>
            <div className="divide-y divide-[#F3F4F6] dark:divide-[#ffffff24]">
              {goals.map((goal) => {
                const percentage = (goal.current / goal.target) * 100;
                const progressColor = getProgressColor(percentage);
                const savings = calculateSavings(goal.target, goal.deadline, goal.current);

                return (
                  <div key={goal.id} className={baseStyles.card}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-[#F3F4F6] dark:bg-[#0a0a0a]">
                          <Goal size={20} className="text-[#6B7280] dark:text-gray-300" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#1F2937] dark:text-white">{goal.name}</h3>
                          <div className="mt-1 flex items-center gap-2 text-sm">
                            <span className="text-[#6B7280] dark:text-gray-400">Target:</span>
                            <span className="font-medium text-[#1F2937] dark:text-white">
                              ₹{parseFloat(goal.target).toLocaleString()}
                            </span>
                            <span className="text-[#D1D5DB] dark:text-gray-500">•</span>
                            <span className="text-[#6B7280] dark:text-gray-400">Saved:</span>
                            <span className={`font-medium ${percentage >= 95 ? 'text-[#EF4444]' : percentage >= 80 ? 'text-[#FBBF24]' : 'text-[#10B981]'}`}>
                              ₹{parseFloat(goal.current).toLocaleString()}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-[#6B7280] dark:text-gray-400">{goal.deadline}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveGoal(goal.id)}
                        className="p-1 rounded-full hover:bg-[#EC4899]/20 transition-colors duration-150"
                      >
                        <X size={16} className="text-[#EC4899]" />
                      </button>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-[#F3F4F6] dark:bg-[#ffffff0f] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${percentage >= 95 ? 'bg-[#EF4444]' : percentage >= 80 ? 'bg-[#FBBF24]' : 'bg-[#10B981]'}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-[#6B7280] dark:text-gray-400">
                        <span>{percentage.toFixed(0)}% achieved</span>
                        <span>₹{savings.remaining} remaining</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-[#6B7280] dark:text-gray-400">
                      <div>Save ₹{savings.perMonth} per month</div>
                      <div>Save ₹{savings.perDay} per day</div>
                      <div>{savings.monthsLeft} months left ({savings.daysLeft} days)</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Form */}
        <div>
          <div className={baseStyles.stickyForm}>
            <div className="border-b border-gray-200 dark:border-[#ffffff24] p-6">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-opacity-20 dark:bg-[#8B5CF6] text-[#8B5CF6] dark:text-[#8B5CF6]">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-8V3.5L18.5 9H13z"/>
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Goal Allocation form</h2>
                  </div>
                </div>
            </div>

            <div className="space-y-3 p-6">
              <div>
                <label className="text-sm font-medium text-[#6B7280] dark:text-gray-300">Goal Name</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    placeholder="Goal Name"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    className={baseStyles.input}
                  />
                  <Goal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />

                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#6B7280] dark:text-gray-300">Target Amount</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    placeholder="Target Amount"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    className={baseStyles.input}
                  />
                  <ReceiptIndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#6B7280] dark:text-gray-300">Deadline</label>
                <div className="relative mt-1">
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className={baseStyles.input}
                  />
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                </div>
              </div>
              
              {/* Savings Preview */}
              {newGoal.target && newGoal.deadline && (
                <div className="text-xs text-[#6B7280] dark:text-gray-400 bg-gray-50 dark:bg-[#ffffff0f] p-2 rounded">
                  {(() => {
                    const savings = calculateSavings(newGoal.target, newGoal.deadline);
                    return (
                      <>
                        <div>Monthly savings: ₹{savings.perMonth}</div>
                        <div>Daily savings: ₹{savings.perDay}</div>
                        <div>Time remaining: {savings.monthsLeft} months ({savings.daysLeft} days)</div>
                      </>
                    );
                  })()}
                </div>
              )}

              <button
                onClick={handleAddGoal}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200   dark:bg-opacity-10  focus:ring-4 focus:ring-blue-500/20  disabled:opacity-50 disabled:cursor-not-allowed bg-purple-50  dark:bg-[#8B5CF6] text-[#8B5CF6] dark:text-[#8B5CF6] w-full`}
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;