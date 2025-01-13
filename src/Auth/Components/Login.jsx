import React ,{useState} from "react";
import { api } from "../../AxiosMeta/ApiAxios";
import { authCheck } from "../Components/ProtectedCheck";

const Login = () => {
  const { auth } = authCheck();
  // console.log(auth);

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
      response.then(window.location.href='/');
      
    } catch (err){
      setError(err.response?.data || err.message || 'Something went wrong');
      console.log(error);
    }
    
  }

return (
  <>
    <form onSubmit={handleloginSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input  autoComplete='email' id="email" type="email" required value={email} onChange={(e)=>{setEmail(e.target.value)}} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
        <input autoComplete='current-password' type="password" required id="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} className="w-full p-2 border rounded" />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">
        Login
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {message && <div className="text-green-500">{message}</div>}
      
    </form>
    
  </>
)};
export default Login;