import React from "react";

const RegisterForm = () => (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input type="text" autoComplete="name" className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" autoComplete="email" className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" autoComplete="current-password" className="w-full p-2 border rounded" />
      </div>
      <button  className="w-full bg-blue-600 text-white py-2 px-4 rounded">
        Register
      </button>
    </form>
  );
export default RegisterForm;