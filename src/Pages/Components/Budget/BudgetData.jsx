import React, { useEffect, useState, useCallback } from 'react';
import { api } from "../../../AxiosMeta/ApiAxios";

export const BudgetData = () => {
  const [Personalizedbudget, setPersonalizedbudget] = useState({});
  const [loadingBudgetPersonal, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [budgetYear, setBudgetYear] = useState(new Date().getFullYear());
  const [budgetMonth, setBudgetMonth] = useState(new Date().getMonth()); 
  const [rule, setrule]=useState('');

  const getBudget = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/budget/${budgetYear}/${budgetMonth}`);
      setPersonalizedbudget(response.data.allocations);
    } catch (err) {
      setError(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [budgetYear, budgetMonth,rule]);

  useEffect(() => {
    if(rule==='Personalized'){
      getBudget();
      console.log(Personalizedbudget);
    }
    // getBudget();
  }, [rule,budgetYear, budgetMonth]);

  useEffect(() => {
    // console.log(Object.keys(Personalizedbudget).length === 0 ? 'yes' : 'no');
    // console.log(error? Personalizedbudget:'no');
  }, [Personalizedbudget]);

  const addBudget = async (budgetdata) => {
    setLoading(true);
    try {
      const response = await api.post(`/api/budget/${budgetYear}/${budgetMonth}`, {
        allocations: budgetdata
      });
      setMessage(response.data);
      console.log(budgetdata);
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (budgetdata) =>{
    setLoading(true);
    try{
        const response = await api.put(`/api/budget/${budgetYear}/${budgetMonth}`, { allocations: budgetdata});
        setMessage(response.data);
        console.log(budgetdata);
      } catch (err) {
        setError(err.response ? err.response.data : err.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
  };

  return { Personalizedbudget, setBudgetYear, setrule,error, setBudgetMonth, loadingBudgetPersonal, addBudget, error, message, updateBudget };
};