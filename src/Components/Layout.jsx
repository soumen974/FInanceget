import { Outlet, Navigate } from 'react-router-dom';
import {Navigation} from './Navigation';
import Headder from "../Pages/Components/Headder";
import { useState } from 'react';
import {useDarkMode } from '../theam/TheamColorsStyle'
const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem('isCollapsed') === 'true';
  });
  
  const {darkMode}  = useDarkMode() ;
 

  return (
    <div className={`flex min-h-screen dark:bg-[#0a0a0a] bg-white transition-all duration-300`}>
      <div className="">
        <Navigation setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
      </div>
       
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-[14rem]'}`}>
      <Headder/>
      <div className="   max-lg:pt-[5rem] mx-3 md:mx-5 lg:mt-6">
        <Outlet />
      </div>

    <footer className='md:max-w-6xl hidden flex pl-1 md:justify-center py-6  md:mx-auto'>
      <div className="dark:text-white space-y-5 ">
        <h1 className='text-[5rem] leading-none  font-extrabold max-md:w-[12rem]'>Live it up!</h1>
        <h2 className='text-xl'>Crafted with ❤️ by <a href="https://x.com/Soumen81845556">Soumen Bhunia</a> </h2>
      </div>
    </footer>
      
      </main>
    </div>
  );
};

export default Layout;