import React,{useState} from 'react';
import LoginForm from "../Components/Login";
import { 
  CheckCircle, X
 } from 'react-feather';
 import {TriangleAlert} from 'lucide-react';
const Login = () => {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Login to Your Account</h2>
        <p className="text-center text-gray-600">Enter your credentials to access your account</p>
        <LoginForm error={error} setError={setError} message={message} setMessage={setMessage} />
      </div>
      
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