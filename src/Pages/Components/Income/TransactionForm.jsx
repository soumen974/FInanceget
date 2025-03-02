import React, { useState, useEffect } from 'react';
import { api } from "../../../AxiosMeta/ApiAxios";
import { ArrowUpCircle, ArrowDownCircle, Plus, Save, X, AlertCircle, CheckCircle, Loader } from 'react-feather';
import { ReceiptIndianRupee } from "lucide-react";

export default function TransactionForm({ type, setAction, action, editId, setEditId }) {
  const categories = type === 'income' ? [
    { id: 1, name: 'Salary', icon: '💰' },
    { id: 2, name: 'Freelance', icon: '💻' },
    { id: 3, name: 'Investments', icon: '📈' },
    { id: 4, name: 'Saving', icon: '🏦' },
    { id: 5, name: 'Other Income', icon: '💵' }
  ] : [
    { id: 1, name: 'Food & Dining', icon: '🍽️' },
    { id: 2, name: 'Transportation', icon: '🚗' },
    { id: 3, name: 'Utilities', icon: '💡' },
    { id: 4, name: 'Entertainment', icon: '🎬' },
    { id: 5, name: 'Healthcare', icon: '⚕️' },
    { id: 6, name: 'Housing', icon: '🏠' },
    { id: 7, name: 'Education', icon: '📚' },
    { id: 8, name: 'Insurance', icon: '🛡️' },
    { id: 9, name: 'Savings/Investments', icon: '💰' },
    { id: 10, name: 'Other Miscellaneous', icon: '📦' }
  ];

  const formatDateToString = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    date: formatDateToString(new Date()),
    description: '',
    note: '',
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const emptyForm = () => {
    setFormData((prevState) => ({
      ...prevState,
      amount: '',
      source: '',
      date: formatDateToString(new Date()),
      description: '',
      note: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updFormData = {
      ...formData,
      date: new Date(formData.date),
    };

    try {
      if (type === 'income') {
        if (!editId) {
          await api.post('/api/income', updFormData);
          setMessage('Income added successfully');
          emptyForm();
          setAction('add');
        } else {
          await api.put(`/api/income/${editId}`, updFormData);
          setMessage('Income updated successfully');
          emptyForm();
          setAction('update');
          setEditId(null);
        }
      } else if (type === 'expense') {
        if (!editId) {
          await api.post('/api/expenses', updFormData);
          setMessage('Expense added successfully');
          emptyForm();
          setAction('add');
        } else {
          await api.put(`/api/expenses/${editId}`, updFormData);
          setMessage('Expense updated successfully');
          emptyForm();
          setAction('update');
          setEditId(null);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getDataToEdit = async (editId) => {
    try {
      setLoading(true);
      if (type === 'income') {
        if (!editId) return;
        const response = await api.get(`/api/income/${editId}`);
        const formGetData = {
          ...response.data,
          date: formatDateToString(response.data.date),
        };
        setFormData(formGetData);
      } else if (type === 'expense') {
        if (!editId) return;
        const response = await api.get(`/api/expenses/${editId}`);
        const formGetData = {
          ...response.data,
          date: formatDateToString(response.data.date),
        };
        setFormData(formGetData);
      }
    } catch (err) {
      console.log(err);
      setError('Failed to load data for editing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editId) {
      getDataToEdit(editId);
    }
  }, [editId]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#ffffff24] max-w-2xl mx-auto">
      <div className="border-b border-gray-200 dark:border-[#ffffff24] p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            type === 'income' ? 'bg-green-50 text-green-600 dark:bg-green-600/10 dark:bg-opacity-10' : 'bg-red-50 text-red-600 dark:text-red-500 dark:bg-red-600/10 dark:bg-opacity-10'
          }`}>
            {type === 'income' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
          </div>
          <h2 className="text-[1rem] md:text-xl font-semibold text-gray-800 dark:text-gray-100">
            {editId ? `Edit ${type}` : `Add New ${type}`}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <ReceiptIndianRupee size={18} className="text-gray-400" />
              </span>
              <input
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleOnChange}
                id="amount"
                className="w-full pl-12 pr-4 py-3 rounded-lg border dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="0.00"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {type === 'income' ? 'Source' : 'Category'}
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleOnChange}
              className="w-full px-4 py-3 rounded-lg border dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 appearance-none bg-white"
              required
            >
              <option value="">Select {type === 'income' ? 'Source' : 'Category'}</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

         
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <input
            name="description"
            value={formData.description}
            onChange={handleOnChange}
            id="description"
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
            placeholder={`What is this ${type} for?`}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </label>
          <div className="relative">
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleOnChange}
              id="date"
              className="w-full px-4 py-3 rounded-lg border dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleOnChange}
            id="note"
            className="w-full px-4 py-3 rounded-lg border dark:bg-[#0a0a0a] dark:border-[#ffffff24] dark:text-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 resize-none"
            rows="1"
            placeholder="Add any additional details..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 bg-blue-600 dark:text-blue-500 dark:bg-blue-600/10 dark:bg-opacity-10 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : editId ? (
              <Save className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            <span>
              {loading ? 'Processing...' : type === 'income'
                ? (editId ? 'Update Income' : 'Add Income')
                : (editId ? 'Update Expense' : 'Add Expense')}
            </span>
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => { emptyForm(); setEditId(null); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-red-600 dark:text-red-500 dark:bg-red-600/10 dark:bg-opacity-10 bg-red-50 transition-all duration-200"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
          )}
        </div>

        {(error || message) && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
            error ? 'bg-red-50 text-red-600 dark:bg-red-600 dark:bg-opacity-20' : 'bg-green-50 text-green-600 dark:bg-green-600 dark:bg-opacity-20'
          }`}>
            {error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <p className="text-sm font-medium">{error || message}</p>
          </div>
        )}
      </form>
    </div>
  );
}