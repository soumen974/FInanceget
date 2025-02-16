import React,{useEffect, useState} from 'react';
import LoginForm from "../Components/Login";
import AuthCheckEmail from "../Components/AuthCheckEmail";
import CodeVErify from "../Components/CodeVErify";
import PasswordAdding from "../Components/PasswordAdding";

import { 
  CheckCircle, X
 } from 'react-feather';
 import {TriangleAlert} from 'lucide-react';
import { useParams } from 'react-router-dom';
const Login = () => {
  const {resetpassword}=useParams();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isPaswardForget,setisPaswardForget] =useState(resetpassword==='resetpassword'?true:false);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [email, setEmail] = useState('');
    const [successFrom,setSuccessFrom]= useState('');
    const [code, setcode] = useState('');
    useEffect(()=>{
      setError('')
      setisPaswardForget(resetpassword==='resetpassword'?true:false)
      // extractDataFromLink(window.location.href);
      if(successFrom==='Password Added'){
        window.location.href = '/login';
        // setisPaswardForget(false);
      }

      // if(successFrom==='codeverified'){
      //   window.location.href = '/login';
      //   setisPaswardForget(false);
      //   setSuccessFrom('codeverified');
      //   setEmail(email);
      // }
    },[resetpassword,successFrom])

    // const extractDataFromLink = (url) => {
    //   const searchParams = new URLSearchParams(new URL(url).search);
    //   const email = searchParams.get('email');
    //   const code = searchParams.get('code');
    //   setcode(code);
    //   setEmail(email);
    //   if(code) return  setSuccessFrom('mailsend');
    //  // return { email, code };
    // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">{isPaswardForget? 'Verify Email' :'Login to Your Account'}</h2>
        <p className="text-center text-gray-600">Enter your  {isPaswardForget?'email to get verification code ':'credentials to access your account'}</p>
        {!isPaswardForget&& <LoginForm setisPaswardForget={setisPaswardForget} error={error} setError={setError} message={message} setMessage={setMessage} />}
        {isPaswardForget&&
        <>
        {successFrom==='' &&
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

        {successFrom==='mailsend' &&
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
        </>}
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