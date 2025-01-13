import React, { useEffect, useState } from 'react'
import { api } from "../../../AxiosMeta/ApiAxios";
export function ReportsData() {
  const [TransactionData, setTransactionData] = useState([]);
  const [Availableyears ,setAvailableyears] = useState([]);
   const [errorReports, setError] = useState('');
   const [messageReports, setMessage] = useState('');
   const [loadingReport, setLoadingReport] = useState(false);
   const [searchYear,setsearchYear ] = useState(2025);
   

  useEffect(()=>{
    setLoadingReport(true);
    GetTransactionData();
    GetTheYears();
  },[])

  // console.log(TransactionData);
  const GetTransactionData = async ()=> {
    try{
      const response = await api.post(`api/reports/LineChartData/${searchYear}`);
      setTransactionData(response.data);
      setMessage(response.data?.msg);
      // console.log(message)
      // setTransactionData(response.data.length === 0 ?  TransactionDataNo : response.data);
      setLoadingReport(false);
    }catch(err){
      // console.log(err.response.data)
    }
  }

  const GetTheYears = async ()=>{
    try{
      const response = api.get('/api/reports/availableYears');
      setAvailableyears(response.data);
      console.log(response.data);
      // console.log(Availableyears);

    }catch(err){

    }
  }
  return {TransactionData ,errorReports, messageReports,loadingReport ,Availableyears ,searchYear};
}
