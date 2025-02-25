import React, { useEffect, useState, useCallback } from 'react';
import { api } from "../../../AxiosMeta/ApiAxios";
import { authCheck } from "../../../Auth/Components/ProtectedCheck";

export const BudgetData = () => {
  const { userType } = authCheck();
  const isPremiumOrAdmin = userType === 'premium' || userType === 'admin';

  const [Personalizedbudget, setPersonalizedbudget] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [budgetYear, setBudgetYear] = useState(new Date().getFullYear());
  const [budgetMonth, setBudgetMonth] = useState(new Date().getMonth());
  const [rule, setrule] = useState(''); // Renamed for consistency

  // Fetch budget data
  const getBudget = useCallback(async () => {
    if (budgetYear === undefined || budgetMonth === undefined) return; // Prevent fetch until set

    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/api/budget/${budgetYear}/${budgetMonth}`);
      const budget = response.data || {};
      setPersonalizedbudget(budget.allocations || {});
      console.log('[BudgetData] Fetched budget:', budget.allocations || {});
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch budget';
      setError(errorMsg);
      console.error('[BudgetData] Fetch error:', errorMsg);
    } finally {
      setLoading(false);
    }
  }, [budgetYear, budgetMonth]);

  // Add budget data
  const addBudget = useCallback(async (budgetData) => {
    if (!isPremiumOrAdmin) {
      setError('Unlock Premium Features');
      console.warn('[BudgetData] Non-premium user attempted to add budget');
      return;
    }

    if (budgetYear === undefined || budgetMonth === undefined) {
      setError('Please set budget year and month');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await api.post(`/api/budget/${budgetYear}/${budgetMonth}`, { allocations: budgetData });
      setMessage('Budget added successfully');
      setPersonalizedbudget(response.data.allocations || budgetData); // Sync with response or fallback
      console.log('[BudgetData] Added budget:', response.data.allocations || budgetData);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to add budget';
      setError(errorMsg);
      console.error('[BudgetData] Add error:', errorMsg);
    } finally {
      setLoading(false);
    }
  }, [budgetYear, budgetMonth, isPremiumOrAdmin]);

  // Update budget data
  const updateBudget = useCallback(async (budgetData) => {
    if (!isPremiumOrAdmin) {
      setError('Unlock Premium Features');
      console.warn('[BudgetData] Non-premium user attempted to update budget');
      return;
    }

    if (budgetYear === undefined || budgetMonth === undefined) {
      setError('Please set budget year and month');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await api.put(`/api/budget/${budgetYear}/${budgetMonth}`, { allocations: budgetData });
      setMessage('Budget updated successfully');
      setPersonalizedbudget(response.data.allocations || budgetData); // Sync with response or fallback
      console.log('[BudgetData] Updated budget:', response.data.allocations || budgetData);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to update budget';
      setError(errorMsg);
      console.error('[BudgetData] Update error:', errorMsg);
    } finally {
      setLoading(false);
    }
  }, [budgetYear, budgetMonth, isPremiumOrAdmin]);

  // Fetch budget when rule changes to 'Personalized' or year/month updates
  useEffect(() => {
    if (rule === 'Personalized') {
      getBudget();
    }
  }, [rule, budgetYear, budgetMonth, getBudget]);

  // Clear error/message after a timeout
  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError('');
        setMessage('');
      }, 5000); // Clear after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error, message]);

  return {
    Personalizedbudget, // Renamed for consistency
    setBudgetYear,
    setBudgetMonth,
    setrule, // Renamed for consistency
    loading,
    error,
    message,
    addBudget,
    updateBudget,
  };
};