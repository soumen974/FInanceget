import React, { useEffect, useState } from 'react';
import { api } from "../../../AxiosMeta/ApiAxios";

export function ReportsData() {
  const [TransactionData, setTransactionData] = useState([]);
  const [Availableyears, setAvailableyears] = useState([]);
  const [errorReports, setError] = useState('');
  const [messageReports, setMessage] = useState('');
  const [loadingReport, setLoadingReport] = useState(false);
  const [searchYear, setsearchYear] = useState(2025);

  useEffect(() => {
    setLoadingReport(true);
    GetTransactionData();
    GetTheYears();
  }, [searchYear]);

  const GetTransactionData = async () => {
    try {
      const response = await api.post(`api/reports/LineChartData/${searchYear}`);
      setTransactionData(response.data);
      setMessage(response.data?.msg);
      setLoadingReport(false);
    } catch (err) {
      console.error('Error fetching transaction data:', err);
      setError('Error fetching transaction data');
      setLoadingReport(false);
    }
  };

  const GetTheYears = async () => {
    try {
      const response = await api.get('/api/reports/availableYears');
      setAvailableyears(response.data);
      // console.log(response.data); // This logs the response data correctly
    } catch (err) {
      console.error('Error fetching available years:', err);
      setError('Error fetching available years');
    }
  };

  // Log the updated Availableyears state whenever it changes
  useEffect(() => {
    // console.log(Availableyears);
  }, [Availableyears]);

  return { TransactionData, errorReports, messageReports, loadingReport, Availableyears, searchYear, setsearchYear };
}