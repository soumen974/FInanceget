import React, { useEffect, useState } from 'react';
import { api } from "../../../AxiosMeta/ApiAxios";

export function ReportsData() {
  const [TransactionData, setTransactionData] = useState([]);
  const [lifeTimeballence, setLifeTimeballence] = useState([]);
  const [Availableyears, setAvailableyears] = useState([]);
  const [errorReports, setError] = useState('');
  const [messageReports, setMessage] = useState('');
  const [loadingReport, setLoadingReport] = useState(false);
  const [searchYear, setsearchYear] = useState(new Date().getFullYear());
  const [categoryData, setCategoryData] = useState({ categoryIncomeData: [], categoryExpenseData: [] });
  const [month, setMonth] = useState(new Date().getMonth());

  const GetTransactionData = async () => {
    try {
      const response = await api.post(`api/reports/LineChartData/${searchYear}`);
      setTransactionData(response.data.monthlyData);
      setLifeTimeballence({
        totalBalance: response.data.lifetimeTotalBalance,
        totalIncome: response.data.lifetimeTotalIncome,
        totalExpense: response.data.lifetimeTotalExpense
      });
      // console.log(response.data.lifetimeTotalBalance);
      // setMessage(response.data?.msg);
    } catch (error) {
      setError('Error fetching transaction data');
      console.warn('Warning:', error.message);
    } finally {
      setLoadingReport(false);
    }
  };

  const GetTheYears = async () => {
    try {
      const response = await api.get('/api/reports/availableYears');
      setAvailableyears(response.data);
    } catch (err) {
      setError('Error fetching available years');
      console.warn('Warning:', err.message);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const response = await api.get(`/api/reports/categoryData/${searchYear}/${month}`);
      setCategoryData(response.data);
    } catch (error) {
      setError('Error fetching category data');
      console.warn('Warning:', error.message);
    }
  };

  useEffect(() => {
    setLoadingReport(true);
    GetTransactionData();
    GetTheYears();
    fetchCategoryData();
  }, [searchYear, month]);

  return { TransactionData,lifeTimeballence, errorReports, messageReports, loadingReport, Availableyears, searchYear, setsearchYear, setMonth, month, categoryData };
}