import React, { useEffect, useState } from "react";
import { api } from "../../AxiosMeta/ApiAxios";
import { authCheck } from "../Components/ProtectedCheck";
import { CheckCircle, X, Mail, ArrowLeft } from 'react-feather';
import { Link, useSearchParams, useLocation } from "react-router-dom";

const AuthCheckEmail = ({ 
  error, 
  setError, 
  message, 
  setMessage, 
  email, 
  setEmail, 
  successFrom, 
  setSuccessFrom 
}) => {
  const { auth } = authCheck();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [touched, setTouched] = useState(false);

  const isRegisterRoute = location.pathname === '/register' || searchParams.get('register') === 'register';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      let response;
      if (isRegisterRoute) {
        document.title = 'Register';
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

  const validateEmail = (email) => {
    // setSuccessFrom('Enter Email');
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidEmail = validateEmail(email);
  const showEmailError = error || touched && !isValidEmail && email !== '';



  return (
    <div className="w-full max-w-md mx-auto">
      <div className=" transition-all duration-300">
        {/* Header Section */}
        {isRegisterRoute&&
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isRegisterRoute ? "Create your account" : 
             location.pathname === '/reset-password' ? "" : 
             ""}
          </h2>
          <p className="text-gray-600">
            {isRegisterRoute ? "Get started with your free account" :
             location.pathname === '/reset-password' ? "" :
             ""}
          </p>
        </div>}

        {/* Form Section */}
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div className="space-y-2">
            <label 
              htmlFor="email" 
              className={`block text-sm font-medium ${showEmailError ? 'text-red-500' : 'text-gray-700'}`}
            >
              Email Address
            </label>
            <div className="relative">
              <input
                autoComplete="email"
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                className={`
                  w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${showEmailError 
                    ? 'border-red-300 text-red-500 focus:border-red-500 focus:ring-red-200' 
                    : isValidEmail && email 
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-200' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  }
                `}
                placeholder="your@email.com"
              />
              {email && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {(isValidEmail && !error) ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    touched  && <X onClick={()=>{setEmail('')}} size={20} className="text-red-500" />
                  )}
                </div>
              )}
            </div>
            {showEmailError && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <X size={16} />
                Please enter a valid email address
              </p>
            )}
          </div>

          {/* Error/Success Messages */}
          <div className="space-y-2 md:hidden">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in">
                <div className="flex items-center">
                  <X size={16} className="text-red-500 mr-2" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}
            {message && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md animate-fade-in">
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <p className="text-sm text-green-600">{message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isValidEmail}
            className={`
              w-full py-3 px-4 rounded-lg font-medium text-white
              transition-all duration-200 transform hover:scale-[1.02]
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : !isValidEmail 
                  ? 'bg-blue-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              }
            `}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </div>
            ) : (
              isRegisterRoute ? 'Create Account' :
              location.pathname === '/forgot-password' ? 'Reset Password' :
              'Continue'
            )}
          </button>

          {/* Navigation Links */}
          <div className="pt-4 border-t border-gray-200">
            {location.pathname === '/login' ? (
              <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm">
                <Link to="/register" className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 group">
                  Create new account
                  <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
            ) : (
             <>
              <Link 
                to="/login" 
                className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 group"
              >
                <ArrowLeft size={16} className="transform transition-transform group-hover:-translate-x-1" />
                Back to login
              </Link>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthCheckEmail;