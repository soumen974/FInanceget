import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Goal,Wallet,Trash2 ,TriangleAlert ,ReceiptIndianRupee, Calendar, X 
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
    { id: 1, name: "Emergency Fund", target: 5000, current: 4200, deadline: "2028-06-30" },
    { id: 2, name: "Vacation", target: 2000, current: 800, deadline: "2025-12-15" },
    { id: 3, name: "Vacation", target: 2000, current: 1900, deadline: "2025-12-15" },
    // { id: 4, name: "Vacation", target: 2000, current: 800, deadline: "2025-12-15" },
    // { id: 5, name: "Vacation", target: 2000, current: 800, deadline: "2025-12-15" },
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
  const [HidePopup, setHidePopup] = useState(null);
  const [loading,setLoading] = useState(false);

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

    // Convert months to years if more than 12 months
    let monthsLeftDisplay;
    if (monthsDiff > 12) {
        const years = Math.floor(monthsDiff / 12);
        const remainingMonths = monthsDiff % 12;
        monthsLeftDisplay = `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    } else {
        monthsLeftDisplay = `${monthsDiff} month${monthsDiff > 1 ? 's' : ''}`;
    }

    return {
        perMonth: formatCurrency(Math.max(0, perMonth)),
        perDay: formatCurrency(Math.max(0, perDay)),
        remaining: Math.max(0, remaining),
        monthsLeft: monthsLeftDisplay, // Updated to display as years if > 12 months
        daysLeft: daysDiff
    };
};

  const Popupbox = ({title ,loading,HidePopup, setHidePopup,currentId,taskFunction,type}) =>{
    return(
    <>
    <div  className={`${HidePopup ===currentId?  'flex' : 'hidden'} fixed inset-0   z-30 flex items-center justify-center`}>
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center " onClick={() => setHidePopup(true)}></div>
      <div className={` z-20 relative bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff13]   rounded-lg text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg `}>
      
        <div className=" px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div
              className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-600 dark:bg-opacity-20 sm:mx-0 sm:h-10 sm:w-10`}
            >
              
                <TriangleAlert className="h-6 w-6 text-red-600" aria-hidden="true" />

            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Delete {title}</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this {type} data ?</p>
              </div>
            </div>
          </div>
        </div>
        <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            className={`inline-flex w-full justify-center rounded-md bg-red-600  hover:bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
            onClick={() => taskFunction(currentId)}
          >
            Delete {loading&& "Loading..."}
          </button>
          <button
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-[#ffffff07] dark:hover:bg-[#ffffff17] dark:ring-[#ffffff24] dark:text-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={() => setHidePopup(true)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    </>)
  };

  const handlePopupopner = (id) => {
    setHidePopup(HidePopup === id ? null : id);
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
    <div className="max-w-6xl pb-6 mx-auto">
      
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
            {/* Header */}
            <div className="p-6 border-b border-[#F3F4F6] dark:border-[#ffffff24]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 dark:bg-opacity-20 dark:bg-[#8B5CF6] rounded-lg">
                    <Goal className="w-5 h-5 text-[#8B5CF6] dark:text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#1F2937] dark:text-white">
                      Goals for {MONTH_NAMES[selectedMonth].charAt(0).toUpperCase() + MONTH_NAMES[selectedMonth].slice(1)} {selectedYear}
                    </h2>
                    <p className="text-sm text-[#6B7280] dark:text-gray-400">Last updated: 2025-02-22 18:16:57</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals List */}
            <div className="divide-y divide-[#F3F4F6] dark:divide-[#ffffff24]">
              {goals.map((goal) => {
                const percentage = (goal.current / goal.target) * 100;
                const savings = calculateSavings(goal.target, goal.deadline, goal.current);

                return (
                  <div key={goal.id} className={baseStyles.card}>
                    <Popupbox HidePopup={HidePopup} type={'Goal'} loading={loading} currentId={goal.id} taskFunction={handleRemoveGoal} setHidePopup={setHidePopup} title={goal.name} />

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
                            <span className={`font-medium ${percentage >= 95 ? 'text-purple-600' : percentage >= 80 ? 'text-[#FBBF24]' : 'text-[#10B981]'}`}>
                              ₹{parseFloat(goal.current).toLocaleString()}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-[#6B7280] dark:text-gray-400">{goal.deadline}</div>
                        </div>
                      </div>
                      <button
                        // onClick={() => handlePopupopner(transaction._id)}
                        onClick={() => handlePopupopner(goal.id)}
                        className="p-1.5 rounded-lg text-gray-400 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-600 dark:hover:bg-opacity-20 transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 size={16} />
                      </button> 
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-[#F3F4F6] dark:bg-[#ffffff0f] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${percentage >= 95 ? 'bg-purple-600' : percentage >= 80 ? 'bg-[#FBBF24]' : 'bg-[#10B981]'}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-[#6B7280] dark:text-gray-400">
                        <span>{percentage.toFixed(0)}% achieved</span>
                        <span>₹{savings.remaining.toLocaleString()} remaining</span>
                      </div>
                    </div>

                    {/* Colored Statistics Boxes */}
                    <div className="mt-4 grid grid-cols-4 md:grid-cols-5 gap-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg ${
                          savings.monthsLeft == 0 ? 'bg-red-500/10' :
                          percentage >= 95 ? 'bg-purple-500/10' : 
                          percentage >= 80 ? 'bg-amber-500/10' : 
                          'bg-emerald-500/10'
                        }`}
                      >
                        <div className={`text-sm font-medium ${
                          savings.monthsLeft == 0 ? 'text-red-600 dark:text-red-400' :
                          percentage >= 95 ? 'text-purple-600 dark:text-purple-400' :
                          percentage >= 80 ? 'text-amber-600 dark:text-amber-400' :
                          'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {/* Customize the content based on the index */}
                          {index === 0 && `${savings.perMonth}`}
                          {index === 1 && `${savings.perDay}`}
                          {index === 2 && `${savings.monthsLeft}`}
                          {index === 3 && `${savings.daysLeft}`}
                          {index === 4 && `${savings.remaining.toLocaleString()}`}
                        </div>
                        <div className="text-xs text-[#6B7280] dark:text-gray-400">
                          {/* Customize the label based on the index */}
                          {index === 0 && 'per month'}
                          {index === 1 && 'per day'}
                          {index === 2 && 'months left'}
                          {index === 3 && 'days left'}
                          {index === 4 && 'remaining'}
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                );
              })}

              {goals.length === 0 && (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F3F4F6] dark:bg-[#0a0a0a] mb-4">
                    <Goal className="w-6 h-6 text-[#6B7280]" />
                  </div>
                  <h3 className="text-[#1F2937] dark:text-white font-medium">No goals yet</h3>
                  <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-1">
                    Start by adding your first financial goal
                  </p>
                </div>
              )}
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
                        <div>Monthly savings: {savings.perMonth}</div>
                        <div>Daily savings: {savings.perDay}</div>
                        <div>Time remaining: {savings.monthsLeft}  ({savings.daysLeft} days)</div>
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