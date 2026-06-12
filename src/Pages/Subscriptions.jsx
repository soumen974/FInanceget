import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, CreditCard, Plus, Trash2, Edit2, AlertCircle, 
  CheckCircle, RefreshCw, X, ShieldAlert, Sparkles, AlertTriangle, Play, Pause,
  TriangleAlert
} from 'lucide-react';
import { api } from "../AxiosMeta/ApiAxios";
import { authCheck } from "../Auth/Components/ProtectedCheck";
import { formatCurrency } from "./Components/Income/formatCurrency";
import Spinner from "../Loaders/Spinner";
import { Link } from 'react-router-dom';

const SUB_CATEGORIES = [
  'Entertainment',
  'Utilities',
  'Software/SaaS',
  'Health & Fitness',
  'Insurance',
  'Other'
];

const Popupbox = ({ title, loading, hidePopup, setHidePopup, currentId, taskFunction, type }) => (
  <div className={`${hidePopup === currentId ? 'flex' : 'hidden'} fixed inset-0 z-50 flex items-center justify-center`}>
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center" onClick={() => setHidePopup(null)}></div>
    <div className="z-55 relative bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff13] rounded-lg text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg mx-4">
      <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-600/20 sm:mx-0 sm:h-10 sm:w-10">
            <TriangleAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Delete {title}</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this {type} data?</p>
            </div>
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

export default function Subscriptions() {
  const { userType } = authCheck();
  const isPremiumOrAdmin = userType === 'premium' || userType === 'admin';

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hidePopup, setHidePopup] = useState(null);
  
  // Modal & Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'monthly',
    nextBillingDate: '',
    category: 'Entertainment',
    note: ''
  });

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/subscriptions');
      setSubscriptions(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    let monthlyTotal = 0;
    let upcomingBill = null;

    subscriptions.forEach(sub => {
      if (sub.status !== 'active') return;
      
      // Normalize amount to monthly
      let monthlyAmount = sub.amount;
      if (sub.frequency === 'yearly') {
        monthlyAmount = sub.amount / 12;
      } else if (sub.frequency === 'weekly') {
        monthlyAmount = sub.amount * 4.33;
      }
      monthlyTotal += monthlyAmount;

      const billDate = new Date(sub.nextBillingDate);
      if (!upcomingBill || billDate < new Date(upcomingBill.nextBillingDate)) {
        upcomingBill = sub;
      }
    });

    return {
      monthlyTotal,
      upcomingBill
    };
  }, [subscriptions]);

  const handleOpenAdd = () => {
    setEditingSub(null);
    setFormData({
      name: '',
      amount: '',
      frequency: 'monthly',
      nextBillingDate: '',
      category: 'Entertainment',
      note: ''
    });
    setError('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (sub) => {
    setEditingSub(sub);
    setFormData({
      name: sub.name,
      amount: sub.amount,
      frequency: sub.frequency,
      nextBillingDate: sub.nextBillingDate ? sub.nextBillingDate.split('T')[0] : '',
      category: sub.category,
      note: sub.note || ''
    });
    setError('');
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingSub(null);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setActionLoading(true);

    try {
      if (editingSub) {
        // Update subscription
        const response = await api.put(`/api/subscriptions/${editingSub._id}`, formData);
        setSubscriptions(prev => prev.map(s => s._id === editingSub._id ? response.data : s));
        setSuccess('Subscription updated successfully!');
      } else {
        // Add subscription
        const response = await api.post('/api/subscriptions', formData);
        setSubscriptions(prev => [...prev, response.data]);
        setSuccess('Subscription added successfully!');
      }
      setTimeout(() => {
        handleCloseModal();
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    
    try {
      await api.delete(`/api/subscriptions/${id}`);
      setSubscriptions(prev => prev.filter(s => s._id !== id));
      setSuccess('Subscription deleted!');
      setHidePopup(null);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete subscription');
    }
  };

  const handleToggleStatus = async (sub) => {
    setError('');
    const newStatus = sub.status === 'active' ? 'paused' : 'active';
    try {
      const response = await api.put(`/api/subscriptions/${sub._id}`, { status: newStatus });
      setSubscriptions(prev => prev.map(s => s._id === sub._id ? response.data : s));
      setSuccess(`Subscription ${newStatus === 'active' ? 'activated' : 'paused'}!`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to toggle status');
    }
  };

  return (
    <div className="max-w-7xl pb-6 mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Subscription Manager
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track and optimize your monthly recurring bills
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors duration-150"
        >
          <Plus size={18} />
          <span>Add Subscription</span>
        </button>
      </div>

      {/* Standard User Sparkles Banner */}
      {!isPremiumOrAdmin && (
        <div className="mb-6 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 dark:from-amber-500/5 dark:to-yellow-500/5 border border-amber-200/50 dark:border-amber-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">You are on the Basic Plan</h4>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/70">
                You can track up to 3 subscriptions. Upgrade to track unlimited recurring bills and get renewal alerts.
              </p>
            </div>
          </div>
          <Link
            to="/upgrade"
            className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
      )}

      {/* Success/Error Alerts */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Stat 1: Total monthly spend */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff12] rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Monthly Subscription Spend</span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {formatCurrency(stats.monthlyTotal)}
            </h2>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <CreditCard size={28} />
          </div>
        </div>

        {/* Stat 2: Next billing charge */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff12] rounded-2xl p-6 shadow-sm flex items-center justify-between">
          {stats.upcomingBill ? (
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Next Billing Event</span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {stats.upcomingBill.name} - {formatCurrency(stats.upcomingBill.amount)}
              </h2>
              <p className="text-xs text-gray-500">
                Due on {new Date(stats.upcomingBill.nextBillingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Next Billing Event</span>
              <h2 className="text-lg font-semibold text-gray-400">No active subscriptions</h2>
            </div>
          )}
          <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 rounded-2xl">
            <Calendar size={28} />
          </div>
        </div>
      </div>

      {/* Subscription Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Spinner />
          <p className="text-sm text-gray-500">Loading your subscription data...</p>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff12] rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 dark:bg-[#ffffff06] text-gray-400 dark:text-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No subscriptions tracked yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            Add your regular SaaS bills, utilities, or entertainment packages to see them in one dashboard.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span>Add Your First Subscription</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff12] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#ffffff04] border-b border-gray-100 dark:border-[#ffffff08] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="p-4 pl-6">Name & Category</th>
                    <th className="p-4">Amount & Cycle</th>
                    <th className="p-4">Next Payment Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#ffffff08] text-sm text-gray-700 dark:text-gray-300">
                  {subscriptions.map(sub => (
                    <tr key={sub._id} className="hover:bg-gray-50/50 dark:hover:bg-[#ffffff04] transition-colors relative">
                      <Popupbox 
                        hidePopup={hidePopup} 
                        type={'subscription'} 
                        loading={actionLoading} 
                        currentId={sub._id} 
                        taskFunction={handleDelete} 
                        setHidePopup={setHidePopup} 
                        title={sub.name} 
                      />
                      <td className="p-4 pl-6">
                        <div className="font-semibold text-gray-950 dark:text-white">{sub.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{sub.category}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(sub.amount)}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">{sub.frequency}</div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {new Date(sub.nextBillingDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          sub.status === 'active' 
                            ? 'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400' 
                            : 'bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${sub.status === 'active' ? 'bg-green-600 dark:bg-green-400' : 'bg-yellow-600 dark:bg-yellow-400'}`} />
                          <span className="capitalize">{sub.status}</span>
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        <button
                          onClick={() => handleToggleStatus(sub)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            sub.status === 'active'
                              ? 'border-yellow-200/50 hover:bg-yellow-50 dark:border-yellow-500/20 dark:hover:bg-yellow-950/20 text-yellow-600'
                              : 'border-green-200/50 hover:bg-green-50 dark:border-green-500/20 dark:hover:bg-green-950/20 text-green-600'
                          }`}
                          title={sub.status === 'active' ? 'Pause Subscription' : 'Activate Subscription'}
                        >
                          {sub.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(sub)}
                          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-[#ffffff1a] dark:hover:bg-[#ffffff08] text-gray-500 dark:text-gray-400"
                          title="Edit Details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setHidePopup(sub._id)}
                          className="p-1.5 rounded-lg border border-red-200/50 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400"
                          title="Delete Subscription"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-4">
            {subscriptions.map(sub => (
              <div 
                key={sub._id} 
                className="relative bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff12] rounded-2xl p-5 shadow-sm space-y-4"
              >
                <Popupbox 
                  hidePopup={hidePopup} 
                  type={'subscription'} 
                  loading={actionLoading} 
                  currentId={sub._id} 
                  taskFunction={handleDelete} 
                  setHidePopup={setHidePopup} 
                  title={sub.name} 
                />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-950 dark:text-white text-base">{sub.name}</h4>
                    <span className="inline-block text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#ffffff0a] px-2 py-0.5 rounded-md mt-1">
                      {sub.category}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    sub.status === 'active' 
                      ? 'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400' 
                      : 'bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${sub.status === 'active' ? 'bg-green-600 dark:bg-green-400' : 'bg-yellow-600 dark:bg-yellow-400'}`} />
                    <span className="capitalize text-xs">{sub.status}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-gray-100 dark:border-[#ffffff08] text-sm">
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Amount & Cycle</span>
                    <span className="font-extrabold text-gray-900 dark:text-white text-base">
                      {formatCurrency(sub.amount)}
                    </span>
                    <span className="text-xs text-gray-500 block capitalize">{sub.frequency}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Next Renewal</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {new Date(sub.nextBillingDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {sub.note && (
                  <p className="text-xs text-gray-500 bg-gray-50 dark:bg-[#ffffff04] p-2 rounded-lg border border-gray-100 dark:border-transparent">
                    <span className="font-semibold">Note:</span> {sub.note}
                  </p>
                )}

                <div className="flex gap-2 justify-end pt-1">
                  <button
                    onClick={() => handleToggleStatus(sub)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      sub.status === 'active'
                        ? 'border-yellow-200/50 hover:bg-yellow-50 dark:border-yellow-500/20 dark:hover:bg-yellow-950/20 text-yellow-600'
                        : 'border-green-200/50 hover:bg-green-50 dark:border-green-500/20 dark:hover:bg-green-950/20 text-green-600'
                    }`}
                  >
                    {sub.status === 'active' ? (
                      <>
                        <Pause size={13} />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={13} />
                        <span>Activate</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(sub)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-[#ffffff1a] dark:hover:bg-[#ffffff08] text-xs font-semibold text-gray-600 dark:text-gray-400"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setHidePopup(sub._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200/50 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-950/20 text-xs font-semibold text-red-600 dark:text-red-400"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff24] rounded-2xl p-6 w-full max-w-md relative shadow-2xl animate-fade-in mx-4">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#ffffff0a] text-gray-400"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {editingSub ? 'Edit Subscription' : 'Add New Subscription'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Subscription Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Netflix, Spotify, Gym"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:bg-black dark:border-[#ffffff24] dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    Billing Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="e.g. 199"
                    required
                    min="1"
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:bg-black dark:border-[#ffffff24] dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:bg-black dark:border-[#ffffff24] dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    Next Billing Date
                  </label>
                  <input
                    type="date"
                    name="nextBillingDate"
                    value={formData.nextBillingDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:bg-black dark:border-[#ffffff24] dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:bg-black dark:border-[#ffffff24] dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    {SUB_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Note (Optional)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Billing terms, payment card, etc."
                  rows="2"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:bg-black dark:border-[#ffffff24] dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-1.5 text-xs">
                  <AlertTriangle size={14} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-[#ffffff08]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#ffffff06] dark:hover:bg-[#ffffff0c] text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                >
                  {actionLoading ? 'Saving...' : editingSub ? 'Save Changes' : 'Create Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
