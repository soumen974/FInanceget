import React, { useState } from "react";
import { api } from "../../AxiosMeta/ApiAxios";
import { authCheck } from "../Components/ProtectedCheck";
import { CheckCircle, X } from 'react-feather';
import { Link, useParams, useSearchParams, useLocation } from "react-router-dom";

const AuthCheckEmail = ({ error, setError, message, setMessage, email, setEmail, successFrom, setSuccessFrom }) => {
  const { auth } = authCheck();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Determine if we're on the register route
  const isRegisterRoute = location.pathname === '/register' || searchParams.get('register') === 'register';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      let response;
      if (isRegisterRoute) {
        document.title='register'
        response = await api.post('/api/auth/register', { email });
      } else {
        response = await api.post('/api/auth/passverifymail', { email });
      }
      setMessage(response?.data);
      setSuccessFrom('mailsend');
    } catch (err) {
      setError(err.response?.data || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderTitle = () => {
    if (isRegisterRoute) {
      return "Register your account";
    } else if (location.pathname === '/forgot-password') {
      return "Reset your password";
    } else {
      return "Login to your account";
    }
  };

  const renderButtonText = () => {
    if (loading) return 'Sending...';
    if (isRegisterRoute) return 'Register';
    if (location.pathname === '/forgot-password') return 'Reset Password';
    return 'Send';
  };

  const renderFooter = () => {
    if (isRegisterRoute) {
      return <Link to="/login" className="text-blue-600 hover:text-blue-700">Already have an account? Login</Link>;
    } else if (location.pathname === '/login') {
      return (
        <div className="flex justify-between w-full">
          <Link to="/register" className="text-blue-600 hover:text-blue-700">Create account</Link>
          <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700">Forgot password?</Link>
        </div>
      );
    } else if (location.pathname === '/forgot-password') {
      return <Link to="/login" className="text-blue-600 hover:text-blue-700">Back to login</Link>;
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className=" space-y-8">
       
        <form onSubmit={handleLoginSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${error ? 'text-red-500' : 'text-gray-700'}`}>
              Email Address
            </label>
            <input
              autoComplete="email"
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 
                ${error ? 'border-red-500 text-red-500 focus:border-red-300' : 'border-gray-300 text-black focus:border-blue-300'}`}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">
                <span className="flex items-center">
                  <X size={16} className="mr-1" />
                  {error}
                </span>
              </p>
            )}
            {message && (
              <p className="mt-2 text-sm text-green-600">
                <span className="flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  {message}
                </span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {renderButtonText()}
          </button>

          <div className="mt-4 text-sm text-center">
            {renderFooter()}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthCheckEmail;