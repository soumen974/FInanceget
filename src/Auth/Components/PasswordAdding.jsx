import React, { useState } from "react";
import { api } from "../../AxiosMeta/ApiAxios";
import { authCheck } from "../Components/ProtectedCheck";
import { CheckCircle, X } from 'react-feather';
import { Link, useParams, useLocation } from "react-router-dom";

const PasswordAdding = ({
  error,
  setError,
  message,
  setMessage,
  email,
  setEmail,
  successFrom,
  setSuccessFrom
}) => {
  const { register } = useParams();
  const { auth } = authCheck();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setname] = useState('');

  const location = useLocation();

  const isRegisterRoute = location.pathname.includes('register');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      let response;
      if (isRegisterRoute) {
        response = await api.post('/api/auth/addpassword', { password, email,name });
      } else {
        response = await api.put('/api/auth/resetpasssword', { password, email });
      }
      setMessage(response?.data);
      setSuccessFrom('Password Added');
    } catch (err) {
      setError(err.response?.data || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderTitle = () => {
    return isRegisterRoute ? "Set Your Password" : "Reset Your Password";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {renderTitle()}
          </h2>
        </div>
        
        <form onSubmit={handleLoginSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              autoComplete="email"
              disabled={true}
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring border-gray-300 text-gray-500 bg-gray-50"
            />
          </div>
         
          {isRegisterRoute && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                autoComplete="name"
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setname(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring border-gray-300 text-gray-500 bg-gray-50"
              />
            </div>
          )}

          <div>
            <label 
              htmlFor="password" 
              className={`block text-sm font-medium ${error ? 'text-red-500' : 'text-gray-700'}`}
            >
              Password
            </label>
            <input
              autoComplete="new-password"
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                error 
                  ? 'border-red-500 focus:border-red-300 focus:ring-red-300 text-red-500' 
                  : 'border-gray-300 text-black focus:border-blue-300 focus:ring'
              }`}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm flex items-center">
              <X size={16} className="mr-1" />
              {error}
            </div>
          )}

          {message && (
            <div className="text-green-500 text-sm flex items-center">
              <CheckCircle size={16} className="mr-1" />
              {message}
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isRegisterRoute ? 'Set Password' : 'Reset Password')}
          </button>

          {successFrom === 'Password Added' && (
            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Proceed to Login
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PasswordAdding;