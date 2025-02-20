import React, { useEffect, useState } from 'react';
import LoginForm from "../Components/Login";
import AuthCheckEmail from "../Components/AuthCheckEmail";
import CodeVErify from "../Components/CodeVErify";
import PasswordAdding from "../Components/PasswordAdding";
import { 
  CheckCircle, 
  X, 
  Lock,
  ArrowLeft
} from 'react-feather';
import { TriangleAlert } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const Login = () => {
  const { resetpassword } = useParams();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isPaswardForget, setisPaswardForget] = useState(resetpassword === 'resetpassword');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [email, setEmail] = useState('');
  const [successFrom, setSuccessFrom] = useState('');
  const [code, setcode] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setError('');
    setisPaswardForget(resetpassword === 'resetpassword');

    if (successFrom === 'Password Added') {
      setIsAnimating(true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 800);
    }
  }, [resetpassword, successFrom]);

  const renderSteps = () => {
    if (!isPaswardForget) return null;
  
    const steps = [
      { 
        title: 'Email Verification',
        icon: '📧',
        description: 'Verify your email address'
      },
      { 
        title: 'Code Verification',
        icon: '🔐',
        description: 'Enter verification code'
      },
      { 
        title: 'Reset Password',
        icon: '🔄',
        description: 'Create new password'
      }
    ];
  
    const currentStep = successFrom === '' ? 0 : 
                       successFrom === 'mailsend' ? 1 : 
                       successFrom === 'codeverified' ? 2 : 0;
  
    return (
      <div className="mb-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Desktop View */}
          <div className="hidden sm:flex items-center justify-between relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-3
                    transform transition-all duration-300 ease-in-out
                    ${index < currentStep 
                      ? 'bg-green-500 text-white scale-110' 
                      : index === currentStep
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }
                    ${index <= currentStep ? 'animate-pulse-once' : ''}
                  `}
                >
                  {index < currentStep ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-lg">{steps[index].icon}</span>
                  )}
                </div>
                <span className={`
                  text-sm font-medium mb-1 transition-colors duration-300
                  ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}
                `}>
                  {step.title}
                </span>
                <span className="text-xs text-gray-400 text-center hidden sm:block">
                  {step.description}
                </span>
                {index < steps.length - 1 && (
                  <div className="absolute h-1 top-6" style={{
                    left: `${(index * 50) + 12}%`,
                    width: '38%',
                  }}>
                    <div className={`
                      h-full rounded-full transition-all duration-500 ease-in-out
                      ${index < currentStep 
                        ? 'bg-green-500' 
                        : index === currentStep 
                          ? 'bg-blue-600' 
                          : 'bg-gray-200'
                      }
                    `} />
                  </div>
                )}
              </div>
            ))}
          </div>
  
          {/* Mobile View */}
          <div className="sm:hidden space-y-4">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`
                  flex items-center space-x-4 p-3 rounded-lg
                  ${index === currentStep ? 'bg-blue-50' : ''}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                  transition-all duration-300
                  ${index < currentStep 
                    ? 'bg-green-500 text-white' 
                    : index === currentStep
                      ? 'bg-blue-600 text-white ring-2 ring-blue-100'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {index < currentStep ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{steps[index].icon}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={`
                    text-sm font-medium
                    ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}
                  `}>
                    {step.title}
                  </span>
                  <span className="text-xs text-gray-400">{step.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className={`max-w-md w-full transform transition-all duration-500 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isPaswardForget ? 'Reset Password' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 text-sm">
              {isPaswardForget 
                ? 'Follow the steps to reset your password' 
                : 'Sign in to continue to your account'}
            </p>
          </div>

          {/* Progress Steps */}
          {renderSteps()}

          {/* Forms */}
          <div className="space-y-6">
            {!isPaswardForget && (
              <LoginForm 
                setisPaswardForget={setisPaswardForget}
                error={error}
                setError={setError}
                message={message}
                setMessage={setMessage}
              />
            )}

            {isPaswardForget && (
              <>
                {successFrom === '' && (
                  <AuthCheckEmail 
                    successFrom={successFrom}
                    setSuccessFrom={setSuccessFrom}
                    error={error}
                    setError={setError}
                    email={email}
                    setEmail={setEmail}
                    message={message}
                    setMessage={setMessage}
                  />
                )}

                {successFrom === 'mailsend' && (
                  <CodeVErify 
                    code={code}
                    setcode={setcode}
                    successFrom={successFrom}
                    setSuccessFrom={setSuccessFrom}
                    taskCompleted={taskCompleted}
                    setTaskCompleted={setTaskCompleted}
                    error={error}
                    setError={setError}
                    email={email}
                    setEmail={setEmail}
                    message={message}
                    setMessage={setMessage}
                  />
                )}

                {successFrom === 'codeverified' && (
                  <PasswordAdding 
                    successFrom={successFrom}
                    setSuccessFrom={setSuccessFrom}
                    error={error}
                    setError={setError}
                    email={email}
                    setEmail={setEmail}
                    message={message}
                    setMessage={setMessage}
                  />
                )}
              </>
            )}
          </div>

          {/* Back to Login Link */}
          {/* {isPaswardForget && (
            <div className="mt-6 text-center">
              <Link 
                to="/login"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Login
              </Link>
            </div>
          )} */}
        </div>
      </div>

      {/* Toast Notifications */}
      <div className={`fixed max-md:top-20 ${message? 'right-4 ':'right-[-10rem] ' } transition-all duration-200 md:bottom-10   z-50 bg-blue-50  text-blue-600 px-4 py-3 rounded-lg    flex items-center gap-2 animate-fade-in max-w-[90vw] sm:max-w-md`}>
          <CheckCircle size={20} />
          <span>{message}</span>
          <button 
            onClick={() => setMessage('')}
            className="ml-auto hover:bg-blue-100  p-1 rounded-full"
          >
            <X size={16} />
          </button>
        </div>

        <div className={`fixed max-md:top-20 ${error? (message? 'right-[-10rem] ': 'right-4 '):'right-[-10rem] ' } transition-all duration-200 md:bottom-10  z-50 bg-red-50   text-red-600 px-4 py-3 rounded-lg  flex items-center gap-2 animate-fade-in max-w-[90vw] sm:max-w-md`}>
          <TriangleAlert size={20} />
          <span>{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-auto hover:bg-red-100  p-1 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
    </div>
  );
};

export default Login;