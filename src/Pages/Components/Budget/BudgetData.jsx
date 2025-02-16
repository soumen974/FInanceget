import React, { useEffect, useState, useCallback } from 'react';
import { api } from "../../../AxiosMeta/ApiAxios";

export const BudgetData = () => {
  const [Personalizedbudget, setPersonalizedbudget] = useState({});
  const [loadingBudgetPersonal, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [budgetYear, setBudgetYear] = useState();
  const [budgetMonth, setBudgetMonth] = useState(); 
  const [rule, setrule]=useState('');

  const getBudget = useCallback(async () => {
    console.log('month',budgetMonth);
    console.log('year',budgetYear);
    setLoading(true);
    try {
      const response = await api.get(`/api/budget/${budgetYear}/${budgetMonth}`);
      setPersonalizedbudget(response.data.allocations);
      console.log('clicked and processed data',Personalizedbudget);


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
    }
    // getBudget();
  }, [rule,budgetYear, budgetMonth]);

  useEffect(() => {
    // console.log(Object.keys(Personalizedbudget).length === 0 ? 'yes' : 'no');
    // console.log(error? Personalizedbudget:'no');
  }, [Personalizedbudget]);

  const addBudget = async (budgetdata) => {
    console.log('month',budgetMonth);
    console.log('year',budgetYear);
    setLoading(true);
    try {
      const response = await api.post(`/api/budget/${budgetYear}/${budgetMonth}`, {
        allocations: budgetdata
      });
      setMessage(response.data);
      console.log('Budget Allocation data:',budgetdata);
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