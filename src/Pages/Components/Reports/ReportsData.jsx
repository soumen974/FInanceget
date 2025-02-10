import React, { useEffect, useState } from 'react';
import { api } from "../../../AxiosMeta/ApiAxios";

export function ReportsData() {
  const [TransactionData, setTransactionData] = useState([]);
  const [Availableyears, setAvailableyears] = useState([]);
  const [errorReports, setError] = useState('');
  const [messageReports, setMessage] = useState('');
  const [loadingReport, setLoadingReport] = useState(false);
  const [searchYear, setsearchYear] = useState( new Date().getFullYear());
  const [categoryData, setCategoryData] = useState({ categoryIncomeData: [], categoryExpenseData: [] });
  const [month, setMonth] = useState(new Date().getMonth());

  const GetTransactionData = async () => {
    try {
      const response = await api.post(`api/reports/LineChartData/${searchYear}`);
      setTransactionData(response.data);
      setMessage(response.data?.msg);
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
      console.warn('Warning:', error.message);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const response = await api.get(`/api/reports/categoryData/${searchYear}/${month}`);
      setCategoryData(response.data);
    } catch (error) {
     setError('Error fetching ',error);
     console.warn('Warning:', error.message);
    }
  };

  useEffect(() => {
    setLoadingReport(true);
    GetTransactionData();
    GetTheYears();
    fetchCategoryData();
  }, [searchYear, month]);

  // useEffect(() => {
  //   fetchCategoryData();
  // }, []);

  return { TransactionData, errorReports, messageReports, loadingReport, Availableyears, searchYear, setsearchYear, setMonth, month, categoryData };
}