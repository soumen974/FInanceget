import React, { useState ,useEffect} from 'react';
import { api } from "../../../AxiosMeta/ApiAxios";

export default function TransactionForm({ type , setAction ,action ,editId,setEditId}) {
  const categories = type === 'income' ? [
    { id: 1, name: 'Salary' },
    { id: 2, name: 'Freelance' },
    { id: 3, name: 'Investments' },
    { id: 4, name: 'Saving' },
    { id: 5, name: 'Other Income' }
  ] : [
    { id: 1, name: 'Food & Dining' },
    { id: 2, name: 'Transportation' },
    { id: 3, name: 'Utilities' },
    { id: 4, name: 'Entertainment' },
    { id: 5, name: 'Healthcare' },
    { id: 6, name: 'Other Miscellaneous' }
  ];

  // Convert Date object to date string
 
  const formatDateToString = (date) => {
    return new Date(date).toISOString().split('T')[0]
  }

  const [formData, setFormDate] = useState({
    amount: '',
    source: '',
    date: formatDateToString(new Date()),
    description: '',
    note: ''
  });

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading,setLoading] = useState(false);
    

  const emptyform = ()=>{
    setFormDate((prevState) => ({
      ...prevState,
      amount: '',
      source: '',
      date: formatDateToString(new Date()),
      description: '',
      note: ''
    }));  
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Convert the date to Date object for data send to backend 
     const updformData = {
        ...formData,
        date: new Date(formData.date)
      };

    try {
      if (type === 'income') {
        if(!editId){
          // add income
          await api.post('/api/income', updformData);
          setMessage('Income added successfully');
          emptyform();
          setAction('add'); 
          setLoading(false);
        }else{
          // // update income
         // console.log(editId);
          await api.put(`/api/income/${editId}`, updformData);
          setMessage('Income updated successfully');
          emptyform();    
          setAction('update');
          setEditId(null);
          setLoading(false);
        } 
      } else if(type === 'expense'){
        if(!editId){
          // console.log('coming soon');
          await api.post('/api/expenses', updformData);
          setMessage('Expense added successfully');
          setAction('add'); 
          emptyform(); 
          setLoading(false);
        }else{
          // console.log('coming soon');
          await api.put(`/api/expenses/${editId}`, updformData);
          setMessage('Expense updated successfully');
          emptyform();    
          setAction('update');
          setEditId(null);
          setLoading(false);
        }
        // amount, category, date , description , note}
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data || err.message || 'Something went wrong');
    }
  };

 


  const getDatatoEdit = async (editId)=>{
     try{
      setLoading(true);
      if(type === 'income' ){
        if(!editId) return;
        // console.log(editId);
        const response = await api.get(`/api/income/${editId}`);
        // converting the object date to normal date 
        const formGetData = {
          ...response.data,
          date: formatDateToString(response.data.date)
        };
        setFormDate(formGetData);
        setLoading(false);
        

       // console.log(response.data);
      }else if (type === 'expense'){
        //  console.log(editId);
        // console.log('coming soon');
        if(!editId) return;
        const response = await api.get(`/api/expenses/${editId}`);
        const formGetData = {
          ...response.data,
          date: formatDateToString(response.data.date)
        };
        console.log(response.data);
        setFormDate(formGetData);
        setLoading(false);

      }

     }catch (err){
      console.log(err);
     }
  }

  useEffect(() => {
    if (editId) {
     // console.log(editId);
      getDatatoEdit(editId);
    }
  //  console.log(formData.date);
  }, [editId])
  

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormDate((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Add {type === 'income' ? 'Income' : 'Expense'}</h2>
      {loading ? 'Loading...' : ''}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <input
            name="description"
            value={formData.description}
            onChange={handleOnChange}
            id="description"
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter description"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{type === 'income' ? 'Source' : 'Category'}</label>
          <select
            name="source"
            value={formData.source}
            onChange={handleOnChange}
            className="w-full p-2 border rounded"
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
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount</label>
          <div className="relative z-0">
            <span className="absolute left-3 top-2.5">₹</span>
            <input
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleOnChange}
              id="amount"
              className="w-full p-2 pl-6 border rounded"
              placeholder="1000.20"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
          <input
            name="date"
            type="date"
            value={formData.date }
            
            onChange={handleOnChange}
            id="date"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="note" className="block text-sm font-medium mb-1">Notes (Optional)</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleOnChange}
            id="note"
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Add any additional notes..."
          />
        </div>

        <div className="flex space-x-4">
           <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700  hover:bg-blue-600 text-md font-medium text-white py-2 px-4 rounded-md  transition-colors"
        >
           {type === 'income' ? (editId? 'Update' :'Add Income') : (editId? 'Update' :'Add Expense')}
        </button>
        {editId!=null ? <button onClick={()=>{emptyform();setEditId(null)}} className="w-full bg-red-500 rounded-md text-white py-2 px-4 text-md font-medium  hover:bg-red-600 transition-colors" >Cancel</button> :null}
        </div>
       
        {error && <div className="text-red-500">{error}</div>}
        {message && <div className="text-green-500">{message}</div>}
      </form>
    </div>
  );
}