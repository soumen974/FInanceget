import React, { useState, useEffect } from "react";
import { api } from "../../AxiosMeta/ApiAxios";
import { authCheck } from "../Components/ProtectedCheck";
import { 
  CheckCircle, 
  X, 
  Mail, 
  Clock,
  RefreshCw
} from 'react-feather';
import { Link } from "react-router-dom";

const CodeVErify = ({
  error,
  setError,
  message,
  code,
  setcode,
  setMessage,
  email,
  setEmail,
  successFrom,
  setSuccessFrom
}) => {
  const { auth } = authCheck();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [codeInputs, setCodeInputs] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCodeInput = (index, value) => {
    // Handle pasting a full code
    if (value.length > 1) {
      const cleanedValue = value.replace(/\D/g, '').slice(0, 6); // Only digits, max 6
      const newCodeInputs = ['', '', '', '', '', ''];
      
      cleanedValue.split('').forEach((digit, i) => {
        if (i < 6) newCodeInputs[i] = digit;
      });
      
      setCodeInputs(newCodeInputs);
      setcode(cleanedValue);
      
      // Focus the last filled input or the end if full
      const lastFilledIndex = Math.min(cleanedValue.length - 1, 5);
      setFocusedIndex(lastFilledIndex);
      document.getElementById(`code-${lastFilledIndex}`)?.focus();
    } 
    // Handle single digit input
    else {
      const newCodeInputs = [...codeInputs];
      newCodeInputs[index] = value.replace(/\D/g, ''); // Only allow digits
      setCodeInputs(newCodeInputs);
      setcode(newCodeInputs.join(''));

      if (value && index < 5) {
        setFocusedIndex(index + 1);
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !codeInputs[index] && index > 0) {
      setFocusedIndex(index - 1);
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e, index) => {
    if (index === 0) { // Only handle paste in the first input
      const pastedData = e.clipboardData.getData('text');
      handleCodeInput(0, pastedData);
      e.preventDefault(); // Prevent default paste behavior
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/passverifymail', { email });
      setMessage('Verification code resent successfully');
      setError('');
      setTimeLeft(300);
    } catch (err) {
      setError(err.response?.data || 'Failed to resend code');
      setMessage('');
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/api/auth/verifyEmail', { 
        email, 
        code: codeInputs.join('') 
      });
      setMessage(response?.data);
      setSuccessFrom('codeverified');
      setError('');
    } catch (err) {
      setError(err.response?.data || err.message || 'Invalid verification code');
      setCodeInputs(['', '', '', '', '', '']);
      setcode('');
      setFocusedIndex(0);
      document.getElementById('code-0')?.focus();
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Verify your email
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          We've sent a verification code to
        </p>
        <p className="text-blue-600 font-medium text-sm sm:text-base break-all">{email}</p>
      </div>

      <form onSubmit={handleLoginSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Enter verification code
          </label>
          <div className="flex gap-2 sm:gap-3 justify-between">
            {codeInputs.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`} // Re-enabled for focus management
                type="text"
                maxLength="1" // Restrict to 1 char per input, pasting handled separately
                value={digit}
                onChange={(e) => handleCodeInput(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={(e) => handlePaste(e, index)} // Added paste handler
                onFocus={() => setFocusedIndex(index)}
                className={`
                  w-[9vw] h-[9vw] sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-semibold 
                  border-2 rounded-lg transition-all duration-200
                  ${error 
                    ? 'border-red-300 text-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-blue-500'
                  }
                  ${focusedIndex === index ? 'ring-2 ring-blue-200' : ''}
                `}
                required
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-2 sm:gap-0">
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-1" />
            {timeLeft > 0 ? (
              <span>Code expires in {formatTime(timeLeft)}</span>
            ) : (
              <span className="text-red-500">Code expired</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={timeLeft > 0 || loading}
            className={`
              flex items-center text-blue-600 hover:text-blue-700
              ${(timeLeft > 0 || loading) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
            Resend code
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded-md animate-shake">
            <div className="flex items-center">
              <X size={16} className="text-red-500 mr-2" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 rounded-md animate-fade-in">
            <div className="flex items-center">
              <CheckCircle size={16} className="text-green-500 mr-2" />
              <p className="text-sm text-green-600">{message}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || codeInputs.some(digit => !digit)}
          className={`
            w-full py-2.5 sm:py-3 px-4 rounded-lg font-medium text-white
            transition-all duration-200 transform hover:scale-[1.02]
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : codeInputs.some(digit => !digit)
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
              Verifying...
            </div>
          ) : (
            'Verify Email'
          )}
        </button>
      </form>
    </div>
  );
};

export default CodeVErify;