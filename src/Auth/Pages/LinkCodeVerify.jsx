import React, { useState, useEffect } from "react";
import { api } from "../../AxiosMeta/ApiAxios";
import { CheckCircle, X } from 'react-feather';
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { TriangleAlert } from 'lucide-react';
import PasswordAdding from "../Components/PasswordAdding";
import Spinner from "../../Loaders/Spinner";
const LinkCodeVerify = () => {
  const [loading, setLoading] = useState(true);
  const { resetpassword } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRegisterRoute = location.pathname.includes('register');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isPaswardForget,setisPaswardForget] = useState(()=>isRegisterRoute?false:true);

  const [taskCompleted, setTaskCompleted] = useState(false);
  const [email, setEmail] = useState('');
  const [successFrom, setSuccessFrom] = useState('');
  const [code, setCode] = useState('');

  // Toast component for notifications
  const Toast = ({ message, type, onClose }) => (
    <div className={`fixed max-md:hidden right-4 transition-all duration-200 md:bottom-10 z-50 
      ${type === 'success' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}
      px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in max-w-[90vw] sm:max-w-md`}>
      {type === 'success' ? <CheckCircle size={20} /> : <TriangleAlert size={20} />}
      <span>{message}</span>
      <button 
        onClick={onClose}
        className={`ml-auto hover:${type === 'success' ? 'bg-blue-100' : 'bg-red-100'} p-1 rounded-full`}>
        <X size={16} />
      </button>
    </div>
  );
  

  useEffect(() => {
    const extractDataFromLink = () => {
      const emailParam = searchParams.get('email');
      const codeParam = searchParams.get('code');

      if (!emailParam || !codeParam) {
        navigate('/login');
        return;
      }

      setEmail(decodeURIComponent(emailParam));
      setCode(codeParam);
      return { email: emailParam, code: codeParam };
    };

    const verifyEmailCode = async (emailParam, codeParam) => {
      try {
        const response = await api.post('/api/auth/verifyEmail', { 
          email: decodeURIComponent(emailParam), 
          code: codeParam 
        });
        setMessage(response?.data);
        setSuccessFrom('codeverified');
      } catch (err) {
        setError(err.response?.data || err.message || 'Verification failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const init = async () => {
      const params = extractDataFromLink();
      if (params?.email && params?.code) {
        await verifyEmailCode(params.email, params.code);
      }
    };

    init();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner/>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {successFrom === 'codeverified' ? (
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
         {!isRegisterRoute ?
         <div className="">
           <h2 className="text-3xl font-bold text-center text-gray-900">Reset Password</h2>
          <p className="text-center text-gray-600">Enter your new password</p>
         </div>: 
          <div className="">
          <h2 className="text-3xl font-bold text-center text-gray-900">Welcome to FinanceGet </h2>
         <p className="text-center text-gray-600">Enter your password</p>
        </div>

         }
          <PasswordAdding 
          isPaswardForget={isPaswardForget}
          successFrom={successFrom}
            setSuccessFrom={setSuccessFrom} 
            error={error}
            setError={setError}
              email={email}
              setEmail={setEmail} 
              message={message} 
              setMessage={setMessage}/>
          <div className="mt-4">
            <p className="text-sm text-gray-500 text-center">
              {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
            </p>
            <p className="text-sm text-gray-500 text-center">
              User: {email}
            </p>
          </div>
        </div>
      ) :
      successFrom === 'Password Added' ?
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
          <div className="text-center text-blue-600">
            <CheckCircle size={48} className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold">{message}</h2>
            <Link to="/login" className="mt-4 inline-block border border-blue-600 p-3 rounded-md bg-blue-600 text-white hover:underline">
              Return to Login
            </Link>
          </div>
        </div>
      :
       (
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
          <div className="text-center text-red-600">
            <TriangleAlert size={48} className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Invalid or Expired Link</h2>
            <p className="mt-2">Please request a new verification link.</p>
            <Link to="/login" className=" mt-4 inline-block text-blue-600 hover:underline">
              Return to Login
            </Link>
          </div>
        </div>
      )}

      {message && (
        <Toast
          message={message}
          type="success"
          onClose={() => setMessage('')}
        />
      )}

      {error && !message && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError('')}
        />
      )}
    </div>
  );
};

export default LinkCodeVerify;