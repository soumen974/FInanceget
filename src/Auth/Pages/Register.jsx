import React from "react";
import RegisterForm from "../Components/RegisterForm";
const Register = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-center">Register</h2>
          <RegisterForm />
        </div>
      </div>
    );
  };
  export default Register;