import React from 'react';
import LoginForm from "../Components/Login";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Login to Your Account</h2>
        <p className="text-center text-gray-600">Enter your credentials to access your account</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;