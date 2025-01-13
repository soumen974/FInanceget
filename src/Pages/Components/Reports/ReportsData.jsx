import React, { useEffect, useState } from 'react'
import { api } from "../../../AxiosMeta/ApiAxios";
export function ReportsData() {
  const [TransactionData, setTransactionData] = useState([]);

   const [errorReports, setError] = useState('');
   const [messageReports, setMessage] = useState('');
   const [loadingReport, setLoadingReport] = useState(false);
   

  useEffect(()=>{
    setLoadingReport(true);
    GetTransactionData();
  },[])

  // console.log(TransactionData);
  const GetTransactionData = async ()=> {
    try{
      const response = await api.get('api/reports/LineChartData');
      setTransactionData(response.data);
      setMessage(response.data?.msg);
      // console.log(message)
      // setTransactionData(response.data.length === 0 ?  TransactionDataNo : response.data);
      setLoadingReport(false);
    }catch(err){
      // console.log(err.response.data)
    }
  }
  return {TransactionData ,errorReports, messageReports,loadingReport};
}
