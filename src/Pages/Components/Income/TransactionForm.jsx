import React, { useState ,useEffect} from 'react';
import { api } from "../../../AxiosMeta/ApiAxios";

export default function TransactionForm({ type , setAction ,action ,editId,setEditId}) {
  const categories = type === 'income' ? [
    { id: 1, name: 'Salary' },
    { id: 2, name: 'Freelance' },
    { id: 3, name: 'Investments' },
    { id: 4, name: 'Other Income' }
  ] : [
    { id: 1, name: 'Food & Dining' },
    { id: 2, name: 'Transportation' },
    { id: 3, name: 'Utilities' },
    { id: 4, name: 'Entertainment' },
    { id: 5, name: 'Healthcare' }
  ];

  // Convert Date object to date string
 

  const [formIncome, setFormIncome] = useState({
    amount: '',
    source: '',
    date: '',
    description: '',
    note: ''
  });

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert the date to Date object for data send to backend 
     const formData = {
        ...formIncome,
        date: new Date(formIncome.date)
      };

    try {
      if (type === 'income') {
        if(!editId){
          // add income
         
          await api.post('/api/income', formData);
          setMessage('Income added successfully');
          setFormIncome((prevState) => ({
            ...prevState,
            amount: '',
            source: '',
            date: '',
            description: '',
            note: ''
          }));    
          setAction('add'); 
        }else{
          // // update income
          console.log(editId);
          await api.put(`/api/income/${editId}`, formData);
          setMessage('Income updated successfully');
          setFormIncome((prevState) => ({
            ...prevState,
            amount: '',
            source: '',
            date: '',
            description: '',
            note: ''
          }));    
          setAction('update');
          setEditId(null);
        } 
      } else {
        console.log('coming soon');
        // await api.post('/api/expense', formData);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data || err.message || 'Something went wrong');
    }
  };

  const formatDateToString = (date) => {
    return new Date(date).toISOString().split('T')[0]
  }


  const getDatatoEdit = async (editId)=>{
     try{
      
      if(type === 'income' ){
        if(!editId) return;
        console.log(editId);
        const response = await api.get(`/api/income/${editId}`);
        setFormIncome(response.data);
        setFormIncome(formIncome.date=formatDateToString(formIncome.date));

        const formGetData = {
          ...formIncome,
          date: formatDateToString(formIncome.date)
        };

        setFormIncome(formGetData);
        

        console.log(response.data);
      }else{
        console.log('coming soon');
      }

     }catch (err){
      console.log(err);
     }
  }

  useEffect(() => {
    if (editId) {
      console.log(editId);
      getDatatoEdit(editId);
    }
    console.log(formIncome.date);
  }, [editId,formIncome.date])
  

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormIncome((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Add {type === 'income' ? 'Income' : 'Expense'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <input
            name="description"
            value={formIncome.description}
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
            value={formIncome.source}
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
              value={formIncome.amount}
              onChange={handleOnChange}
              id="amount"
              className="w-full p-2 pl-6 border rounded"
              placeholder="1000.20"
              min="0"
              step="1.0"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
          <input
            name="date"
            type="date"
            value={formIncome.date }
            
            onChange={handleOnChange}
            id="date"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="note" className="block text-sm font-medium mb-1">Notes (Optional)</label>
          <textarea
            name="note"
            value={formIncome.note}
            onChange={handleOnChange}
            id="note"
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Add any additional notes..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          {editId? 'Update' :'Add'} {type === 'income' ? 'Income' : 'Expense'}
        </button>
        {error && <div className="text-red-500">{error}</div>}
        {message && <div className="text-green-500">{message}</div>}
      </form>
    </div>
  );
}