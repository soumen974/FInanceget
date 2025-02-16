import React, { useState } from "react";
import { api } from "../../AxiosMeta/ApiAxios";
import { authCheck } from "../Components/ProtectedCheck";
import { 
 CheckCircle, X
} from 'react-feather';
import { Link } from "react-router-dom";
const AuthCheckEmail = ({error, setError, message, setMessage,email, setEmail,successFrom,setSuccessFrom}) => {
  const { auth } = authCheck();
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');
  // const [message, setMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/api/auth/passverifymail', { email });
      setMessage(response?.data);
      setSuccessFrom('mailsend');
    } catch (err) {
      setError(err.response?.data || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
      // setError('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleLoginSubmit}  className="space-y-6">
      <div>
        <label htmlFor="email" className={`block text-sm font-medium  ${error? 'text-red-500':'text-gray-700'}`}>Email</label>
        <input
          autoComplete="email"
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-3 py-2 border  rounded-lg focus:outline-none focus:ring focus:border-blue-300  ${error? 'border-red-500 text-red-500 focus:border-red-300' : 'border-gray-300 text-black focus:border-blue-300'}`}
        />
      </div>
      {/* <div>
        <label htmlFor="password" className={`block text-sm font-medium   ${error==='Invalid credentials'? 'text-red-500':'text-gray-700'}`}>Password</label>
        <input
          autoComplete="current-password"
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-3 py-2 border  rounded-lg focus:outline-none   ${error==='Invalid credentials'? 'border-red-500 focus:border-red-300 focus:ring-red-300 text-red-500' : 'border-gray-300 text-black focus:border-blue-300 focus:ring'}`}
        />
      </div> */}
      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>

      <div disabled={loading} className=" flex items-center justify-between text-sm">
        <Link  to={'/login'}>Go back?</Link>
      </div>
      {/* {error && <div className="text-red-500 mt-2">{error}</div>} */}
     
      {/* {message && <div className="text-green-500 mt-2">{message}</div>} */}
    </form>
  );
};

export default AuthCheckEmail;