import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  CheckCircle, Goal, Wallet, PiggyBank, Trash2, MoreVertical, TriangleAlert, ReceiptIndianRupee, Calendar, X, Edit2 
} from 'lucide-react';
import { authCheck } from "../Auth/Components/ProtectedCheck";
import { formatCurrency } from "./Components/Income/formatCurrency";
import { api } from "../AxiosMeta/ApiAxios";
import Spinner from "../Loaders/Spinner";

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

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ 
    _id: null,
    current: '',
    name: '', 
    target: '', 
    deadline: (new Date(new Date().setDate(new Date().getDate() + 1))).toISOString().split('T')[0],
    contributionAmount: '',
    contributionFrequency: 'month',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalGoals, setTotalGoals] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { userType } = authCheck();
  const menuRef = useRef(null);
  // Assuming GoalsData is defined elsewhere
  // const { UpdateGoal } = GoalsData();

  const [showSavingsForm, setShowSavingsForm] = useState(null);
  const [savingsAmount, setSavingsAmount] = useState('');

  const baseStyles = {
    container: `bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm border overflow-hidden border-[#F3F4F6] dark:border-[#ffffff24]`,
    card: `p-4 hover:bg-gray-50 dark:hover:bg-[#ffffff06] transition-colors duration-150`,
    input: `w-full pl-12 pr-4 py-3 rounded-lg border dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200`,
    button: `px-4 py-2 rounded-lg font-medium transition-colors duration-150 text-sm`,
    activeButton: `bg-[#8B5CF6] text-white hover:bg-[#7C3AED]`,
    stickyForm: `bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-[#F3F4F6] dark:border-[#ffffff24]`,
  };

  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i - 2);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [hidePopup, setHidePopup] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [totalTarget,SettotalTarget] = useState(0);

  useEffect(() => {
    fetchGoals();
  }, [currentPage]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/goals?page=${currentPage}`);
      setGoals(response.data.goals.map(goal => ({ ...goal, current: goal.current || 0 })));
      setTotalGoals(response.data.pagination.totalGoals || 0);
      setTotalPages(response.data.pagination.totalPages || 0);
      SettotalTarget(response.data.pagination.totalTarget);
      
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = (target, deadline, current = 0) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(deadline);
    endDate.setHours(0, 0, 0, 0);

    const daysDiffRaw = (endDate - today) / (1000 * 60 * 60 * 24);
    let monthsDiff = ((endDate.getFullYear() - today.getFullYear()) * 12) + (endDate.getMonth() - today.getMonth());
    let daysDiff = Math.ceil(daysDiffRaw);

    const isSameMonth = endDate.getFullYear() === today.getFullYear() && endDate.getMonth() === today.getMonth();
    const isTodayOrPast = daysDiffRaw <= 0;

    if (isTodayOrPast) {
      return { perMonth: 0, perDay: 0, remaining: parseFloat(target) - parseFloat(current), monthsLeft: 0, daysLeft: 0 };
    }

    if (isSameMonth) {
      monthsDiff = 0;
      daysDiff = Math.max(1, daysDiff);
    } else {
      daysDiff = Math.max(1, daysDiff);
    }

    const remaining = parseFloat(target) - parseFloat(current);
    const perMonth = monthsDiff > 0 ? remaining / monthsDiff : remaining / daysDiff;
    const perDay = remaining / daysDiff;

    let monthsLeftDisplay = monthsDiff > 12 
      ? `${Math.floor(monthsDiff / 12)} year${Math.floor(monthsDiff / 12) > 1 ? 's' : ''}${monthsDiff % 12 > 0 ? ` ${monthsDiff % 12}` : ''}`
      : `${monthsDiff} `;

    return {
      perMonth: formatCurrency(Math.max(0, perMonth)),
      perYear: formatCurrency(Math.max(0, perMonth * 12)),
      perDay: formatCurrency(Math.max(0, perDay)),
      remaining: Math.max(0, remaining),
      monthsLeft: monthsLeftDisplay,
      daysLeft: daysDiff,
    };
  };

  const calculateTimeToGoal = (target, deadline, current = 0, contributionAmount, contributionFrequency) => {
    if (!contributionAmount || contributionAmount <= 0) {
      return { days: 0, months: 0, years: 0, deadlineDate: new Date(deadline).toLocaleDateString() };
    }

    const remaining = parseFloat(target) - parseFloat(current);
    let daysToGoal = 0;

    switch (contributionFrequency) {
      case 'day':
        daysToGoal = Math.ceil(remaining / parseFloat(contributionAmount));
        break;
      case 'month':
        daysToGoal = Math.ceil((remaining / parseFloat(contributionAmount)) * 30);
        break;
      case 'year':
        daysToGoal = Math.ceil((remaining / parseFloat(contributionAmount)) * 365);
        break;
      default:
        daysToGoal = 0;
    }

    const monthsToGoal = Math.ceil(daysToGoal / 30);
    const yearsToGoal = Math.ceil(daysToGoal / 365);

    const today = new Date();
    const completionDate = new Date(today);
    completionDate.setDate(today.getDate() + daysToGoal);
    const deadlineDate = new Date(deadline);

    return {
      days: daysToGoal,
      months: monthsToGoal,
      years: yearsToGoal,
      deadlineDate: deadlineDate.toLocaleDateString(),
      completionDate: completionDate.toISOString().split('T')[0],
      completionDateFormatted: completionDate.toLocaleDateString(),
      isAhead: completionDate <= deadlineDate,
    };
  };

  const setCompletionAsDeadline = () => {
    if (newGoal.contributionAmount && newGoal.target) {
      const timeToGoal = calculateTimeToGoal(newGoal.target, newGoal.deadline, newGoal.current || 0, newGoal.contributionAmount, newGoal.contributionFrequency);
      setNewGoal({ ...newGoal, deadline: timeToGoal.completionDate });
    }
  };

  const handleGoalSubmit = async () => {
    if (!newGoal.name || !newGoal.target || !newGoal.deadline || parseFloat(newGoal.target) <= 0) return; 

    try {
      setLoading(true);
      const goalData = { 
        name: newGoal.name, 
        target: parseFloat(newGoal.target), 
        deadline: newGoal.deadline,
        current: parseFloat(newGoal.current) || 0
      };

      if (newGoal._id) {
        const response = await api.put(`/api/goals/${newGoal._id}`, goalData);
        setGoals(goals.map(goal => goal._id === newGoal._id ? response.data : goal));
      } else {
        const response = await api.post('/api/goals', goalData);
        setGoals([response.data, ...goals]); 
        setTotalGoals(prev => prev + 1);
        setTotalPages(Math.ceil((totalGoals + 1) / 4));
      }

      setNewGoal({ 
        _id: null,
        current: '',
        name: '', 
        target: '', 
        deadline: (new Date(new Date().setDate(new Date().getDate() + 1))).toISOString().split('T')[0], 
        contributionAmount: '', 
        contributionFrequency: 'month' 
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error submitting goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGoal = (goal) => {
    setNewGoal({
      _id: goal._id,
      name: goal.name,
      target: goal.target.toString(),
      deadline: new Date(goal.deadline).toISOString().split('T')[0],
      contributionAmount: '',
      contributionFrequency: 'month',
      current: goal.current.toString() || ''
    });
  };

  const cancelEditGoal = () => {
    setNewGoal({
      _id: null, 
      current: '',
      name: '', 
      target: '', 
      deadline: (new Date(new Date().setDate(new Date().getDate() + 1))).toISOString().split('T')[0],
      contributionAmount: '',
      contributionFrequency: 'month',
    });
  };

  const handleRemoveGoal = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/api/goals/${id}`);
      setGoals(goals.filter(goal => goal._id !== id));
      setTotalGoals(prev => prev - 1);
      setTotalPages(Math.ceil((totalGoals - 1) / 4));
      setHidePopup(null);
      if (goals.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSavings = async (goalId) => {
    if (!savingsAmount || parseFloat(savingsAmount) <= 0) return;

    try {
      setLoading(true);
      const goalToUpdate = goals.find(goal => goal._id === goalId);
      const newCurrent = parseFloat(goalToUpdate.current) + parseFloat(savingsAmount);
      
      // Assuming UpdateGoal is a function to update the goal on the backend
      // await UpdateGoal(goalId, newCurrent);
      const response = await api.put(`/api/goals/${goalId}`, { current: newCurrent });
      setGoals(goals.map(goal => 
        goal._id === goalId ? { ...goal, current: newCurrent } : goal
      ));
      setShowSavingsForm(null);
      setSavingsAmount('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding savings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 95) return COLORS.danger;
    if (percentage >= 80) return COLORS.warning;
    return COLORS.success;
  };

  const Popupbox = ({ title, loading, hidePopup, setHidePopup, currentId, taskFunction, type }) => (
    <div className={`${hidePopup === currentId ? 'flex' : 'hidden'} fixed inset-0 z-30 flex items-center justify-center`}>
      <div className="fixed inset-0 bg-black bg-opacity-70" onClick={() => setHidePopup(null)}></div>
      <div className="z-20 relative bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff13] rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
        <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-600/20 sm:mx-0 sm:h-10 sm:w-10">
              <TriangleAlert className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Delete {title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this {type} data?</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button 
            className="inline-flex w-full justify-center rounded-md bg-red-600 hover:bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto" 
            onClick={() => taskFunction(currentId)} 
            disabled={loading}
          >
            Delete {loading && "Loading..."}
          </button>
          <button 
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-[#ffffff07] dark:hover:bg-[#ffffff17] dark:ring-[#ffffff24] dark:text-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" 
            onClick={() => setHidePopup(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const handlePopupopner = (id) => {
    setHidePopup(hidePopup === id ? null : id);
  };

  const handleMenuClick = (id) => {
    setShowMenu(showMenu === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null);
      }
    };
    document.body.addEventListener('click', handleClickOutside);
    return () => document.body.removeEventListener('click', handleClickOutside);
  }, []);

  const goalItems = useMemo(() => goals.map((goal) => ({
    _id: goal._id,
    current: goal.current,
    name: goal.name, 
    target: goal.target, 
    deadline: goal.deadline,
    contributionAmount: '',
    contributionFrequency: 'month',
  })), [goals]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-6xl pb-6 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white">Goal Management</h1>
            <p className="mt-1 text-sm text-[#6B7280] dark:text-gray-400">Track and achieve your financial goals</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#6B7280] dark:text-gray-400">Total Target:</span>
            <span className="text-lg font-semibold text-[#1F2937] dark:text-white">
              {formatCurrency(totalTarget)}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 hidden max-sm:flex-wrap flex gap-4">
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
          <span>{newGoal._id ? 'Goal updated successfully!' : showSavingsForm ? 'Savings added successfully!' : 'Goal added successfully!'}</span>
          <button onClick={() => setShowSuccess(false)} className="ml-2 p-1 hover:bg-green-100 dark:hover:bg-green-800/20 rounded-full">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="lg:grid grid-cols-1 flex flex-col-reverse lg:grid-cols-3 gap-8">
        {/* Goals List */}
        <div className="lg:col-span-2">
          <div className={baseStyles.container}>
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
                    <p className="text-sm text-[#6B7280] dark:text-gray-400">Last updated: {new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-[#F3F4F6] dark:divide-[#ffffff24]">
              {loading ? (
                // <Spinner />
                <div className="space-y-1">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse bg-gray-200 dark:bg-[#ffffff13]  p-4   border-gray-200 dark:border-[#ffffff24]"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      {/* Header Section */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Icon Placeholder */}
                          <div className="w-10 h-10 rounded-lg bg-gray-300 dark:bg-[#ffffff1a]" />
                          <div className="space-y-2">
                            {/* Title Placeholder */}
                            <div className="w-32 h-4 bg-gray-300 dark:bg-[#ffffff1a] rounded" />
                            {/* Target/Saved Placeholder */}
                            <div className="flex gap-2">
                              <div className="w-20 h-3 bg-gray-300 dark:bg-[#ffffff1a] rounded" />
                              <div className="w-20 h-3 bg-gray-300 dark:bg-[#ffffff1a] rounded" />
                            </div>
                            {/* Deadline Placeholder */}
                            <div className="w-24 h-3 bg-gray-300 dark:bg-[#ffffff1a] rounded" />
                          </div>
                        </div>
                        {/* Menu Button Placeholder */}
                        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-[#ffffff1a]" />
                      </div>

                      {/* Progress Bar Section */}
                      <div className="mt-3 space-y-1">
                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-300 dark:bg-[#ffffff1a] rounded-full" />
                        {/* Percentage/Remaining Placeholder */}
                        <div className="flex justify-between">
                          <div className="w-16 h-3 bg-gray-300 dark:bg-[#ffffff1a] rounded" />
                          <div className="w-20 h-3 bg-gray-300 dark:bg-[#ffffff1a] rounded" />
                        </div>
                      </div>

                      {/* Stats Grid Section */}
                      <div className="mt-4 grid grid-cols-4 gap-3">
                        {[...Array(4)].map((_, statIndex) => (
                          <div
                            key={statIndex}
                            className="p-3 rounded-lg bg-gray-300 dark:bg-[#ffffff1a]"
                          >
                            <div className="w-16 h-4 bg-gray-400 dark:bg-[#ffffff26] rounded" />
                            <div className="w-12 h-3 mt-1 bg-gray-400 dark:bg-[#ffffff26] rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : goalItems.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F3F4F6] dark:bg-[#0a0a0a] mb-4">
                    <Goal className="w-6 h-6 text-[#6B7280]" />
                  </div>
                  <h3 className="text-[#1F2937] dark:text-white font-medium">No goals yet</h3>
                  <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-1">Start by adding your first financial goal</p>
                </div>
              ) : (
                goalItems.map((goal) => {
                  const percentage = (goal.current / goal.target) * 100;
                  const savings = calculateSavings(goal.target, goal.deadline, goal.current);

                  return (
                    <div key={goal._id} className={`${baseStyles.card} ${savings.daysLeft === 0 ? 'bg-red-50 dark:bg-red-900/10 dark:bg-opacity-75' : ''}`}>
                      <Popupbox 
                        hidePopup={hidePopup} 
                        type={'Goal'} 
                        loading={loading} 
                        currentId={goal._id} 
                        taskFunction={handleRemoveGoal} 
                        setHidePopup={setHidePopup} 
                        title={goal.name} 
                      />

                      {showSavingsForm === goal._id && (
                        <div className="fixed inset-0 z-40 flex items-center justify-center">
                          <div className="fixed inset-0 bg-black bg-opacity-70" onClick={() => setShowSavingsForm(null)}></div>
                          <div className="z-50 bg-white dark:bg-[#0a0a0a] rounded-lg shadow-xl p-6 w-full max-w-sm border border-[#F3F4F6] dark:border-[#ffffff24]">
                            <h3 className="text-lg font-semibold text-[#1F2937] dark:text-white mb-4">Add Savings to {goal.name}</h3>
                            <div className="relative mb-4">
                              <input 
                                type="number" 
                                placeholder="Savings Amount" 
                                value={savingsAmount} 
                                onChange={(e) => setSavingsAmount(e.target.value)} 
                                className={baseStyles.input}
                                autoFocus
                              />
                              <ReceiptIndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleAddSavings(goal._id)} 
                                className={`${baseStyles.button} ${baseStyles.activeButton} flex-1`}
                                disabled={loading || !savingsAmount || parseFloat(savingsAmount) <= 0}
                              >
                                {loading ? 'Saving...' : 'Add Savings'}
                              </button>
                              <button 
                                onClick={() => setShowSavingsForm(null)} 
                                className={`${baseStyles.button} bg-gray-200 dark:bg-[#ffffff17] text-[#1F2937] dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#ffffff24] flex-1`}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex relative items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-[#F3F4F6] dark:bg-[#0a0a0a]">
                            <Goal size={20} className="text-[#6B7280] dark:text-gray-300" />
                          </div>
                          <div>
                            <h3 className="font-medium text-[#1F2937] dark:text-white">{goal.name}</h3>
                            <div className="mt-1 flex max-sm:flex-wrap items-center gap-2 text-sm">
                              <span className="text-[#6B7280] dark:text-gray-400">Target:</span>
                              <span className="font-medium text-[#1F2937] dark:text-white max-sm:truncate max-sm:w-[3.6rem]">{formatCurrency(goal.target)}</span>
                              <span className="text-[#D1D5DB] dark:text-gray-500">•</span>
                              <span className="text-[#6B7280] dark:text-gray-400">Saved:</span>
                              <span className={`font-medium max-sm:truncate max-sm:w-[3.6rem] ${percentage >= 95 ? 'text-purple-600' : percentage >= 80 ? 'text-[#FBBF24]' : 'text-[#10B981]'}`}>
                                {formatCurrency(goal.current)}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-[#6B7280] dark:text-gray-400">{new Date(goal.deadline).toLocaleDateString()}</div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMenuClick(goal._id); }}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#ffffff17] transition-colors duration-150"
                          >
                            <MoreVertical size={16} className="text-gray-500 dark:text-gray-400" />
                          </button> 
                          {showMenu === goal._id && (
                            <div 
                              ref={menuRef}
                              onClick={() => setShowMenu(null)}
                              className={`
                                absolute right-0 mt-2 w-24 rounded-xl shadow-lg py-2 px-1.5
                                bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff24]
                                z-10 transform scale-95 animate-in
                                data-[state=open]:opacity-100 data-[state=open]:scale-100
                                transition-all duration-200 ease-out
                              `}
                            >
                              <button
                                onClick={() => setShowSavingsForm(goal._id)}
                                className={`w-full ${savings.remaining===0? 'hidden':'flex'} items-center gap-2 p-2 rounded-lg
                                  text-gray-600 dark:hover:bg-[#ffffff17] dark:hover:text-white dark:text-gray-400 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-opacity-20
                                  transition-colors duration-150 group`}
                                title="Add saving to this goal"
                              >
                                <PiggyBank 
                                  size={16} 
                                  className="group-hover:scale-110 transition-transform duration-150" 
                                />
                                <span className="text-sm font-medium">Add </span>
                              </button>

                              <button
                                onClick={() => handleEditGoal(goal)} 
                                className="w-full flex items-center gap-2 p-2 rounded-lg
                                  text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300
                                  hover:bg-blue-50 dark:hover:bg-blue-600 dark:hover:bg-opacity-20
                                  transition-colors duration-150 group"
                                title="Edit transaction"
                              >
                                <Edit2 
                                  size={16} 
                                  className="group-hover:scale-110 transition-transform duration-150" 
                                />
                                <span className="text-sm font-medium">Edit</span>
                              </button>

                              <button
                                onClick={() => handlePopupopner(goal._id)}
                                className="w-full flex items-center gap-2 p-2 rounded-lg mt-1
                                  text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-300
                                  hover:bg-red-50 dark:hover:bg-red-600 dark:hover:bg-opacity-20
                                  transition-colors duration-150 group"
                                title="Delete transaction"
                              >
                                <Trash2 
                                  size={16} 
                                  className="group-hover:scale-110 transition-transform duration-150" 
                                />
                                <span className="text-sm font-medium">Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="w-full bg-[#F3F4F6] dark:bg-[#ffffff0f] rounded-full h-2">
                          <div className={`h-2 rounded-full ${percentage >= 95 ? 'bg-purple-600' : percentage >= 80 ? 'bg-[#FBBF24]' : 'bg-[#10B981]'}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-[#6B7280] dark:text-gray-400">
                          <span>{percentage.toFixed(0)}% achieved</span>
                          <span>{formatCurrency(savings.remaining)} remaining</span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-4 md:grid-cols-5 gap-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-lg overflow-hidden ${
                              savings.daysLeft === 0 ? 'bg-red-500/10' :
                              percentage >= 95 ? 'bg-purple-500/10' : 
                              percentage >= 80 ? 'bg-amber-500/10' : 
                              'bg-emerald-500/10'
                            }`}
                          >
                            <div className={`text-sm font-medium truncate md:w-[7rem] w-[5.6rem] ${
                              savings.monthsLeft === 0 ? 'text-red-600 dark:text-red-400' :
                              percentage >= 95 ? 'text-purple-600 dark:text-purple-400' :
                              percentage >= 80 ? 'text-amber-600 dark:text-amber-400' :
                              'text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {index === 0 && `${savings.perMonth}`}
                              {index === 1 && `${savings.perDay}`}
                              {index === 2 && `${savings.monthsLeft}`}
                              {index === 3 && `${savings.daysLeft}`}
                            </div>
                            <div className="text-xs text-[#6B7280] dark:text-gray-400">
                              {index === 0 && 'per month'}
                              {index === 1 && 'per day'}
                              {index === 2 && 'months left'}
                              {index === 3 && 'days left'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Controls */}
            {!loading && totalGoals > 0 && (
              <div className="p-6 border-t border-[#F3F4F6] dark:border-[#ffffff24]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-[#6B7280] dark:text-gray-400">
                    Showing {(currentPage - 1) * 4 + 1} to {Math.min(currentPage * 4, totalGoals)} of {totalGoals} goals
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border border-[#F3F4F6] dark:border-[#ffffff24] transition-all duration-200 
                        ${currentPage === 1 ? 'bg-gray-50 dark:bg-black dark:text-[#ffffff24] text-gray-300 cursor-not-allowed' : 'text-gray-700 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#ffffff17] hover:bg-gray-50 active:bg-gray-100'}`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentPage >= totalPages}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border border-[#F3F4F6] dark:border-[#ffffff24] transition-all duration-200 
                        ${currentPage >= totalPages ? 'bg-gray-50 dark:bg-black dark:text-[#ffffff24] text-gray-300 cursor-not-allowed' : 'text-gray-700 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#ffffff17] hover:bg-gray-50 active:bg-gray-100'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Form */}
        <div className='space-y-5'>
          <div className={baseStyles.stickyForm}>
            <div className="border-b border-gray-200 dark:border-[#ffffff24] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-opacity-20 dark:bg-[#8B5CF6] text-[#8B5CF6] dark:text-[#8B5CF6]">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-8V3.5L18.5 9H13z"/>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {newGoal._id ? 'Edit Goal' : 'Goal Allocation Form'}
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-6">
              <div>
                <label className="text-sm font-medium text-[#6B7280] dark:text-gray-300">Goal target Amount</label>
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
                <label className="text-sm font-medium text-[#6B7280] dark:text-gray-300">Set Saving</label>
                <div className="relative mt-1">
                  <input 
                    type="number" 
                    placeholder="Current saving " 
                    value={newGoal.current} 
                    onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })} 
                    className={baseStyles.input} 
                  />
                  <PiggyBank size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                </div>
              </div>

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

              <div>
                <label className="text-sm font-medium text-[#6B7280] dark:text-gray-300">Contribution Amount (Optional)</label>
                <div className="relative mt-1">
                  <input 
                    type="number" 
                    placeholder="Amount" 
                    value={newGoal.contributionAmount} 
                    onChange={(e) => setNewGoal({ ...newGoal, contributionAmount: e.target.value })} 
                    className={baseStyles.input} 
                  />
                  <Wallet size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#6B7280] dark:text-gray-300">Contribution Frequency</label>
                <select 
                  value={newGoal.contributionFrequency} 
                  onChange={(e) => setNewGoal({ ...newGoal, contributionFrequency: e.target.value })} 
                  className="w-full mt-1 px-4 py-3 rounded-lg border border-[#F3F4F6] dark:bg-[#0a0a0a] dark:border-[#ffffff24] focus:border-[#8B5CF6] focus:ring-4 focus:ring-[#8B5CF6]/20 dark:text-white"
                >
                  <option value="day">Per Day</option>
                  <option value="month">Per Month</option>
                  <option value="year">Per Year</option>
                </select>
              </div>

              {newGoal.target && newGoal.deadline && (
                <div className="text-xs text-[#6B7280] dark:text-gray-400 bg-gray-50 dark:bg-[#ffffff0f] p-2 rounded">
                  {(() => {
                    const savings = calculateSavings(newGoal.target, newGoal.deadline, newGoal.current || 0);
                    const timeToGoal = newGoal.contributionAmount ? calculateTimeToGoal(newGoal.target, newGoal.deadline, newGoal.current || 0, newGoal.contributionAmount, newGoal.contributionFrequency) : null;
                    return (
                      <>
                        <div>Monthly savings (by deadline): {savings.perMonth}</div>
                        <div>Daily savings (by deadline): {savings.perDay}</div>
                        <div>Time remaining to deadline: {savings.monthsLeft} ({savings.daysLeft} days)</div>
                        <div>Deadline: {new Date(newGoal.deadline).toLocaleDateString()}</div>
                        {timeToGoal && (
                          <div className="mt-2">
                            <div>With {formatCurrency(newGoal.contributionAmount)}/{newGoal.contributionFrequency}:</div>
                            <div>- {timeToGoal.days} days (Completion: {timeToGoal.completionDateFormatted})</div>
                            <div>- {timeToGoal.months} months</div>
                            <div>- {timeToGoal.years} years</div>
                            <div className={timeToGoal.isAhead ? 'text-green-600' : 'text-red-600'}>
                              {timeToGoal.isAhead ? 'Ahead of deadline!' : 'Past deadline!'}
                            </div>
                            <button 
                              onClick={setCompletionAsDeadline} 
                              className="mt-1 px-2 py-1 text-xs text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded"
                            >
                              Set as Deadline
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              <div className="flex justify-between gap-2">
                <button 
                  onClick={handleGoalSubmit} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 dark:bg-opacity-10 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed bg-purple-500 dark:bg-[#8B5CF6] text-white dark:text-[#8B5CF6] w-full`}
                  disabled={loading || !newGoal.name || !newGoal.target || parseFloat(newGoal.target) <= 0 || !newGoal.deadline}
                >
                  {loading ? 'Processing...' : newGoal._id ? 'Update Goal' : 'Add Goal'}
                </button>
                {newGoal._id && (
                  <button 
                    onClick={cancelEditGoal} 
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 dark:bg-opacity-10 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed bg-purple-500 dark:bg-[#8B5CF6] text-white dark:text-[#8B5CF6] w-full`}
                    disabled={loading || !newGoal.name || !newGoal.target || parseFloat(newGoal.target) <= 0 || !newGoal.deadline}
                  >
                    {loading ? 'Processing...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-[#ffffff0f] rounded-lg">
            <h3 className="text-md font-medium text-[#1F2937] dark:text-white">Axis Bank Card</h3>
            <p className="text-sm text-[#6B7280] dark:text-gray-400">Low APR from 1.5% p.m.—cashback on daily spends.</p>
            <a 
              href="https://bitli.in/YVz6YDB" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-2 inline-block text-[#8B5CF6] dark:text-[#8B5CF6] hover:underline"
            >
              Apply Today
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
export const GoalsData = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/goals');
      setGoals(response.data.map(goal => ({ _id: goal._id, name: goal.name }))); 
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const UpdateGoal = async (id, data) => {
    try {
      setLoading(true); 
      const response = await api.put(`/api/goals/${id}`, { current: data });
      // console.log('Goal updated with current:', response.data.current);
      // console.log('Response data:', response.data); 
      return response.data;
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error; 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return { goals, loading, fetchGoals, UpdateGoal };
};