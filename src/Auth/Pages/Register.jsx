import React, { useEffect, useState } from 'react';
import RegisterForm from "../Components/RegisterForm";
import AuthCheckEmail from "../Components/AuthCheckEmail";
import CodeVErify from "../Components/CodeVErify";
import PasswordAdding from "../Components/PasswordAdding";
import { CheckCircle, X } from 'react-feather';
import { TriangleAlert } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const Register = () => {
  const { resetpassword } = useParams();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isPaswardForget, setisPaswardForget] = useState(resetpassword === 'resetpassword');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [email, setEmail] = useState('');
  const [successFrom, setSuccessFrom] = useState('');
  const [code, setcode] = useState('');

  // Progress tracking
  const steps = ['','Enter Email', 'mailsend', 'codeverified','Password Added'];
  const currentStep = steps.indexOf(successFrom) + 1;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="mb-8 px-4">
          <div className="relative pt-1">
            {/* Progress Label */}
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium text-blue-600">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round((currentStep / (steps.length - 1)) * 100)}% Complete
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="flex mb-4 items-center justify-between">
              <div className="flex-1">
                <div className="h-3 bg-gray-100 rounded-full shadow-inner overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full 
                            transition-all duration-700 ease-out transform origin-left
                            shadow-lg"
                    style={{ 
                      width: `${(currentStep / (steps.length - 1)) * 100}%`,
                      animation: 'pulse 2s infinite'
                    }}
                  >
                    <div className="w-full h-full opacity-30 bg-gradient-to-r from-transparent via-white to-transparent
                                  animate-shimmer"/>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center relative">
                  <div 
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      transition-all duration-500 ease-in-out
                      transform ${index <= currentStep ? 'scale-110' : 'scale-100'}
                      ${index < currentStep 
                        ? 'bg-green-500 text-white' 
                        : index === currentStep
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                          : 'bg-gray-200 text-gray-400'
                      }
                      shadow-lg
                    `}
                  >
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span className={`
                    absolute -bottom-6 text-xs font-medium whitespace-nowrap
                    transition-all duration-500
                    ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}
                  `}>
                    {steps[index]}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`
                      absolute w-[calc(100%-2rem)] h-0.5 top-4 left-8
                      transition-all duration-500
                      ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                    `}/>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl p-8 space-y-6">
          {/* <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {successFrom === 'register' ? 'Create Account' :
             successFrom === 'mailsend' ? 'Verify Email' :
             'Set Password'}
          </h2> */}

          <div className="space-y-6">
            {(successFrom === '' || successFrom ==='Enter Email') && (
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
          </div>
        </div>

        {/* Success Modal */}
        {message === 'User registered successfully' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl p-8 max-w-md w-full transform transition-all duration-300 scale-100 animate-scale-in">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{message}</h2>
                <Link
                  to="/login"
                  className="inline-block w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-medium transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Continue to Login
                </Link>
              </div>
            </div>
          </div>
        )}

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
    </div>
  );
};

export default Register;