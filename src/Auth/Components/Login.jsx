import React, { useState, useEffect } from "react";
import { api } from "../../AxiosMeta/ApiAxios";
import { authCheck } from "../Components/ProtectedCheck";
import { 
  CheckCircle, 
  X, 
  Mail, 
  Lock,
  Eye, 
  EyeOff,
  ArrowRight,
  Key
} from 'react-feather';
import { Link } from "react-router-dom";

const LoginForm = ({ error, setError, message, setMessage }) => {
  const { auth } = authCheck();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remembered, setremembered] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);

  useEffect(() => {
    // Check for saved email
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setremembered(true);
    }
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail) || newEmail === '');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/api/auth/login', { email, password,remembered });
      setMessage('Login successful! Redirecting...');
      
      if (remembered) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      setLoginAttempts(prev => prev + 1);
      setError(err.response?.data || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  const isValidEmail = validateEmail(email);
  const showEmailError = error ||  !isValidEmail && email !== '';


  return (
    <form onSubmit={handleLoginSubmit} className="space-y-6">
      {/* Email Input */}
      <div>
        <label 
          htmlFor="email" 
          className={`block text-sm font-medium mb-1 ${
            error === 'Email not found' ? 'text-red-500' : 'text-gray-700'
          }`}
        >
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className={`h-5 w-5 ${
              error === 'Email not found' ? 'text-red-400' : 'text-gray-400'
            }`} />
          </div>
          <input
            autoComplete="email"
            id="email"
            type="email"
            required
            value={email}
            onChange={handleEmailChange}
            className={`
              pl-10 w-full px-3 py-2 border-2 rounded-lg
              transition-colors duration-200
              focus:outline-none focus:ring-2
              ${!isEmailValid || error === 'Email not found'
                ? 'border-red-300 text-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              }
            `}
            placeholder="you@example.com"
          />
        </div>
        {!isEmailValid && email && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <X size={14} className="mr-1" />
            Please enter a valid email address
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label 
          htmlFor="password" 
          className={`block text-sm font-medium mb-1 ${
            error === 'Invalid credentials' ? 'text-red-500' : 'text-gray-700'
          }`}
        >
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className={`h-5 w-5 ${
              error === 'Invalid credentials' ? 'text-red-400' : 'text-gray-400'
            }`} />
          </div>
          <input
            autoComplete="current-password"
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`
              pl-10 pr-10 w-full px-3 py-2 border-2 rounded-lg
              transition-colors duration-200
              focus:outline-none focus:ring-2
              ${error === 'Invalid credentials'
                ? 'border-red-300 text-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              }
            `}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={remembered}
            onChange={(e) => setremembered(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <Link 
          to="/login/resetpassword"
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          Forgot password?
        </Link>
      </div>

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
        disabled={loading || !isEmailValid}
        className={`
          w-full py-3 px-4 rounded-lg font-medium
          transition-all duration-200 transform
          flex items-center justify-center gap-2
          ${loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : !isEmailValid
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]'
          }
          text-white shadow-lg hover:shadow-xl
        `}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing in...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight size={18} />
          </>
        )}
      </button>

      {/* Create Account Link */}
      <div className="text-center">
        <span className="text-gray-600 text-sm">Don't have an account? </span>
        <Link 
          to="/register"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          Create one now
        </Link>
      </div>

      {/* Max Attempts Warning */}
      {loginAttempts >= 3 && (
        <div className="text-amber-600 text-sm flex items-center gap-2 bg-amber-50 p-3 rounded-lg">
          <Key className="h-4 w-4" />
          <span>Multiple failed attempts detected. Consider resetting your password.</span>
        </div>
      )}
    </form>
  );
};

export default LoginForm;