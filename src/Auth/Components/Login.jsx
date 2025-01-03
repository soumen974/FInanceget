import React ,{useState} from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

const Login = () => {

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const handleloginSubmit = async (e)=>{
    e.preventDefault();

    try{
      const response = await api.post('/api/auth/login', { email, password});
      setMessage(response.data);
      console.log(message)
      
    } catch (err){
      setError(err.response?.data || err.message || 'Something went wrong');
      console.log(error);
    }
    
  }

return (
  <>
    <form onSubmit={handleloginSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input autoComplete='email' id="email" type="email" required value={email} onChange={(e)=>{setEmail(e.target.value)}} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" required value={password} onChange={(e)=>{setPassword(e.target.value)}} className="w-full p-2 border rounded" />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">
        Login
      </button>
    </form>
  </>
)};
export default Login;