import React, { useEffect, useState } from 'react';
import RegisterForm from "../Components/RegisterForm";
import AuthCheckEmail from "../Components/AuthCheckEmail";
import CodeVErify from "../Components/CodeVErify";
import PasswordAdding from "../Components/PasswordAdding";
import { 
  CheckCircle, 
  X, 
  Mail, 
  Shield, 
  Lock,
  AlertTriangle
} from 'react-feather';
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
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    { id: '', title: 'Start', icon: <Mail className="w-5 h-5" /> },
    { id: 'Enter Email', title: 'Email', icon: <Mail className="w-5 h-5" /> },
    { id: 'mailsend', title: 'Verify', icon: <Shield className="w-5 h-5" /> },
    { id: 'codeverified', title: 'Code', icon: <Shield className="w-5 h-5" /> },
    { id: 'Password Added', title: 'Password', icon: <Lock className="w-5 h-5" /> }
  ];

  const currentStep = steps.findIndex(step => step.id === successFrom) || 0;

  const getStepColor = (index) => {
    if (index < currentStep) return 'bg-green-500 text-white';
    if (index === currentStep) return 'bg-blue-600 text-white';
    return 'bg-gray-200 text-gray-500';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Progress Tracker */}
        <div className="mb-10 px-4  ">
          <div className="relative pt-1">
            {/* Progress Header */}
            <div className="flex justify-between mb-4">
              <span className="text-sm font-semibold text-blue-600 pb-4">
                Step {currentStep} of {steps.length - 1}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round((currentStep / (steps.length - 1)) * 100)}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-6 ">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out relative
                           bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                </div>
              </div>

              {/* Step Indicators */}
              <div className="absolute top-0 left-0 w-full flex justify-between transform -translate-y-1/2">
                {steps.map((step, index) => (
                  <div key={index} className="relative group">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-300 transform
                        ${getStepColor(index)}
                        ${index <= currentStep ? 'scale-110 shadow-lg' : 'scale-100'}
                        ${index === currentStep ? 'ring-4 ring-blue-100 animate-pulse' : ''}
                      `}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-max">
                      <span className={`
                        text-xs font-medium whitespace-nowrap transition-all duration-300
                        ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}
                      `}>
                        {step.title}
                      </span>
                    </div>
                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div className="absolute h-[2px] top-5 left-10 w-[calc(200% - 2.5rem)]
                                    transition-all duration-500 -z-10
                                    bg-gradient-to-r from-current to-gray-200"
                           style={{
                             background: index < currentStep 
                               ? 'linear-gradient(to right, #10B981, #10B981)' 
                               : 'linear-gradient(to right, #E5E7EB, #E5E7EB)'
                           }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 l">
          <div className="max-w-md mx-auto space-y-6">
            {/* Form Components */}
            {(successFrom === '' || successFrom === 'Enter Email') && (
              <AuthCheckEmail {...{ successFrom, setSuccessFrom, error, setError, email, setEmail, message, setMessage }} />
            )}

            {successFrom === 'mailsend' && (
              <CodeVErify {...{ code, setcode, successFrom, setSuccessFrom, taskCompleted, setTaskCompleted, 
                              error, setError, email, setEmail, message, setMessage }} />
            )}

            {successFrom === 'codeverified' && (
              <PasswordAdding {...{ successFrom, setSuccessFrom, error, setError, email, setEmail, message, setMessage }} />
            )}
             {successFrom === 'Password Added' && (
             <div className='text-sm text-blue-600'> User registered successfully ! Redirecting to home page...</div>
             )}
          </div>
        </div>

        {/* Success Modal */}
        {message === 'User registered successfully' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50
                         animate-fade-in">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full transform transition-all duration-300
                          animate-scale-up shadow-2xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{message}</h2>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full py-3 px-6 rounded-lg
                           bg-blue-600 text-white font-medium transition-all duration-200
                           hover:bg-blue-700 transform hover:scale-105 active:scale-95"
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