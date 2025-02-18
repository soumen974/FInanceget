import React,{useEffect, useState} from 'react';
import RegisterForm from "../Components/RegisterForm";
import AuthCheckEmail from "../Components/AuthCheckEmail";
import CodeVErify from "../Components/CodeVErify";
import PasswordAdding from "../Components/PasswordAdding";

import { 
  CheckCircle, X
 } from 'react-feather';
 import {TriangleAlert} from 'lucide-react';
import { useParams } from 'react-router-dom';

const Register = () => {
   const {resetpassword}=useParams();
      const [error, setError] = useState('');
      const [message, setMessage] = useState('');
      const [isPaswardForget,setisPaswardForget] =useState(resetpassword==='resetpassword'?true:false);
      const [taskCompleted, setTaskCompleted] = useState(false);
      const [email, setEmail] = useState('');
      const [successFrom,setSuccessFrom]= useState('register');
      const [code, setcode] = useState('');
   
      return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-center">Register</h2>
         {successFrom==='register'&&
          <AuthCheckEmail 
          successFrom={successFrom}
           setSuccessFrom={setSuccessFrom} 
           error={error}
            setError={setError}
             email={email}
              setEmail={setEmail} 
              message={message} 
              setMessage={setMessage}/>
              }
         {successFrom==='mailsend'&&
          <CodeVErify code={code} setcode={setcode} successFrom={successFrom} setSuccessFrom={setSuccessFrom}  taskCompleted={taskCompleted} setTaskCompleted={setTaskCompleted} error={error} setError={setError} email={email} setEmail={setEmail} message={message} setMessage={setMessage}/>
         }
         {successFrom==='codeverified' && 
         <PasswordAdding 
         successFrom={successFrom}
          setSuccessFrom={setSuccessFrom} 
          error={error}
           setError={setError}
            email={email}
             setEmail={setEmail} 
             message={message} 
             setMessage={setMessage}/>
        }
        </div>

        {successFrom==='User registered successfully'&&
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center text-blue-600">
          <CheckCircle size={48} className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold">{message}</h2>
          <Link to="/login" className="mt-4 inline-block border border-blue-600 p-3 rounded-md bg-blue-600 text-white hover:underline">
            Return to Login
          </Link>
        </div>
      </div>
        }

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
  export default Register;