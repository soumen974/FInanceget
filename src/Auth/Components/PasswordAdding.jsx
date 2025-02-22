import React, { useState, useEffect } from "react";
import { api } from "../../AxiosMeta/ApiAxios";
import { authCheck } from "../Components/ProtectedCheck";
import { 
  CheckCircle, 
  X, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  User,
  Mail
} from 'react-feather';
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
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const location = useLocation();

  const isRegisterRoute = location.pathname.includes('register');

  const validatePassword = (pass) => {
    let strength = 0;
    const checks = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      numbers: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    };

    strength = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(strength);
    return checks;
  };

  const getStrengthColor = () => {
    const colors = ['red-500', 'orange-500', 'yellow-500', 'blue-500', 'green-500'];
    return colors[passwordStrength - 1] || 'gray-300';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (passwordStrength < 3) {
      setError('Please create a stronger password');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      let response;
      if (isRegisterRoute) {
        response = await api.post('/api/auth/addpassword', { password, email, name });
        setMessage('Account created successfully! Redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        response = await api.put('/api/auth/resetpasssword', { password, email });
        setMessage('Password reset successful!');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
      setSuccessFrom('Password Added');
      setError('');
    } catch (err) {
      setError(err.response?.data || err.message || 'Something went wrong');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto ">
    
      <form onSubmit={handleLoginSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              disabled={true}
              id="email"
              type="email"
              value={email}
              autoComplete="email"
              className="pl-10 w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500 border-gray-200"
            />
          </div>
        </div>

        {/* Name Field (for registration) */}
        {isRegisterRoute && (
          <div className="relative">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setname(e.target.value)}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Enter your full name"
              />
            </div>
          </div>
        )}

        {/* Password Field */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={handlePasswordChange}
              className={`pl-10 pr-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
              placeholder="Create a strong password"
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

          {/* Password Strength Indicator */}
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-2 w-full rounded-full transition-colors duration-300
                    ${level <= passwordStrength ? `bg-${getStrengthColor()}` : 'bg-gray-200'}`}
                />
              ))}
            </div>
            <p className={`text-xs text-${getStrengthColor()}`}>
              {passwordStrength === 0 && "Enter password"}
              {passwordStrength === 1 && "Very weak"}
              {passwordStrength === 2 && "Weak"}
              {passwordStrength === 3 && "Medium"}
              {passwordStrength === 4 && "Strong"}
              {passwordStrength === 5 && "Very strong"}
            </p>
          </div>

          {/* Password Requirements */}
          <div className="mt-2 space-y-1">
            {[
              { check: password.length >= 8, text: "At least 8 characters" },
              { check: /[A-Z]/.test(password), text: "One uppercase letter" },
              { check: /[a-z]/.test(password), text: "One lowercase letter" },
              { check: /[0-9]/.test(password), text: "One number" },
              { check: /[^A-Za-z0-9]/.test(password), text: "One special character" }
            ].map(({ check, text }, index) => (
              <div key={index} className="flex items-center text-sm">
                {check ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <X className="h-4 w-4 text-gray-300 mr-2" />
                )}
                <span className={check ? "text-green-500" : "text-gray-500"}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 md:hidden border-l-4 border-red-500 p-4 rounded-md animate-shake">
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {message && (
          <div className="bg-green-50 md:hidden border-l-4 border-green-500 p-4 rounded-md animate-fade-in">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-green-600">{message}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || passwordStrength < 3}
          className={`
            w-full py-3 px-4 rounded-lg font-medium text-white
            transition-all duration-200 transform hover:scale-[1.02]
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : passwordStrength < 3
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
            isRegisterRoute ? 'Complete Registration' : 'Reset Password'
          )}
        </button>

        {successFrom === 'Password Added' && (
          <div className="text-center animate-fade-in">
            <Link
              to="/login"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <span className="mr-2">→</span>
              Continue to Login
            </Link>
          </div>
        )}
      </form>
    </div>
  );
};

export default PasswordAdding;