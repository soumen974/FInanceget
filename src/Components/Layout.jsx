import { Outlet, Navigate } from 'react-router-dom';
import {Navigation} from './Navigation';
import Headder from "../Pages/Components/Headder";
import { useState } from 'react';
const Layout = () => {
  const isAuthenticated = true; 
  const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem('isCollapsed') === 'true';
  });
  
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen">
      <div className="max-lg:hidden">
        <Navigation setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
      </div>
       
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-[12rem]'}`}>
      <Headder/>
      <div className=" md:px-6 lg:py-6 p-3   max-lg:pt-[5rem] ">
        <Outlet />
      </div>
      
      </main>
    </div>
  );
};

export default Layout;