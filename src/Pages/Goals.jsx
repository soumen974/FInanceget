import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, ChevronRight,CheckCircle , Moon, Sun, TrendingUp, PieChart, Target, Shield, 
  Clock, RefreshCw, Goal, DollarSign, Calendar, X, Radar 
} from 'lucide-react';
import { formatCurrency } from "./Components/Income/formatCurrency";

// Color Palette (aligned with provided budget section)
const COLORS = {
  primary: '#8B5CF6',    // Electric Purple (for branding consistency)
  secondary: '#EC4899',  // Neon Pink (for accents)
  accent: '#10B981',     // Emerald Green (success)
  bgLight: '#FFFFFF',    // White
  bgDark: '#0a0a0a',     // Cosmic Black
  borderLight: '#F3F4F6', // Light Gray Border (replacing gray-100)
  borderDark: '#ffffff24', // Dark Border
  textDark: '#1F2937',   // Slate (replacing gray-900)
  textLight: '#6B7280',  // Gray-500
  success: '#10B981',    // Green
  warning: '#FBBF24',    // Yellow (replacing yellow-400)
  danger: '#EF4444',     // Red
};

const Goals = ({ darkMode }) => {
  const [goals, setGoals] = useState([
    { id: 1, name: "Emergency Fund", target: 5000, current: 3200, deadline: "2025-06-30" },
    { id: 2, name: "Vacation", target: 2000, current: 800, deadline: "2025-12-15" },
  ]);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '' });
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const baseStyles = {
    container: `bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-[#F3F4F6] dark:border-[#ffffff24]`,
    card: `p-4 hover:bg-gray-50 dark:hover:bg-[#ffffff06] transition-colors duration-150`,
    input: `w-full mt-1 px-3 py-2 rounded-lg border border-[#F3F4F6] dark:border-[#ffffff24] bg-white dark:bg-[#0a0a0a] text-[#1F2937] dark:text-white focus:border-[#8B5CF6] focus:ring-4 focus:ring-[#8B5CF6]/20 transition-colors duration-150 text-sm`,
    button: `px-4 py-2 rounded-lg font-medium transition-colors duration-150 text-sm`,
    activeButton: `bg-[#8B5CF6] text-white hover:bg-[#7C3AED]`,
    inactiveButton: `bg-white dark:bg-[#ffffff17] text-[#1F2937] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#ffffff24] border border-[#F3F4F6] dark:border-[#ffffff24]`,
  };

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i - 2);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target && newGoal.deadline) {
      setGoals([...goals, { id: goals.length + 1, ...newGoal, current: 0 }]);
      setNewGoal({ name: '', target: '', deadline: '' });
      setShowForm(false);
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

//   const formatCurrency = (amount) => {
//     return `₹${amount.toLocaleString('en-IN')}`;
//   };

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

      {/* Goals Container */}
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
                          ₹{goal.target.toLocaleString()}
                        </span>
                        <span className="text-[#D1D5DB] dark:text-gray-500">•</span>
                        <span className="text-[#6B7280] dark:text-gray-400">Saved:</span>
                        <span className={`font-medium ${percentage >= 95 ? 'text-[#EF4444] dark:text-[#EF4444]' : percentage >= 80 ? 'text-[#FBBF24] dark:text-[#FBBF24]' : 'text-[#10B981] dark:text-[#10B981]'}`}>
                          ₹{goal.current.toLocaleString()}
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
                      className={`h-2 rounded-full ${percentage >= 95 ? 'bg-[#EF4444] dark:bg-[#EF4444]' : percentage >= 80 ? 'bg-[#FBBF24] dark:bg-[#FBBF24]' : 'bg-[#10B981] dark:bg-[#10B981]'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-[#6B7280] dark:text-gray-400">
                    <span>{percentage.toFixed(0)}% achieved</span>
                    <span>₹{(goal.target - goal.current).toLocaleString()} remaining</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Goal Form */}
        <div className="p-6">
          {showForm ? (
            <div className={`${baseStyles.card} shadow-md`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#1F2937] dark:text-white">New Goal</h3>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-full hover:bg-[#EC4899]/20">
                  <X size={16} className="text-[#EC4899]" />
                </button>
              </div>
              <div className="space-y-3">
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
                    <Goal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-gray-400" />
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
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-gray-400" />
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
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={handleAddGoal}
                  className={`${baseStyles.button} ${baseStyles.activeButton} w-full`}
                >
                  Add Goal
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className={`${baseStyles.button} ${baseStyles.inactiveButton} mx-auto block`}
            >
              + Add a Goal
            </button>
          )}
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
    </div>
  );
};

export default Goals;