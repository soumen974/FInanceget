import { Outlet, Navigate } from 'react-router-dom';
import {Navigation} from './Navigation';
import Headder from "../Pages/Components/Headder";
import { useState ,useRef,useEffect} from 'react';
import {useDarkMode } from '../theam/TheamColorsStyle'
import { Link } from 'react-router-dom';
import { Wallet,QrCode,ArrowUpCircle,ArrowDownCircle} from "lucide-react";
import { authCheck } from '../Auth/Components/ProtectedCheck';
import { api } from '../AxiosMeta/ApiAxios';

const Layout = () => {
  const { isImpersonated, userEmail } = authCheck();
  const [exiting, setExiting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem('isCollapsed') === 'true';
  });
  
  const {darkMode}  = useDarkMode() ;
  const [isballOpen, setballOpen] = useState(false);
  const menuRef = useRef(null);

  const handleExitImpersonation = async () => {
    setExiting(true);
    try {
      await api.post('/api/users/impersonate/exit');
      localStorage.removeItem('authData');
      window.location.href = '/users';
    } catch (err) {
      console.error('Failed to exit impersonation:', err);
      alert('Failed to return to admin session');
      setExiting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setballOpen(false);
      }
    };
    document.body.addEventListener('click', handleClickOutside);
    return () => document.body.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {isImpersonated && (
        <div className="bg-amber-600 dark:bg-amber-700 text-white text-sm px-4 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <span className="font-semibold">⚠️ Impersonation Mode:</span>
            <span>You are viewing the account of <strong className="underline">{userEmail}</strong></span>
          </div>
          <button
            onClick={handleExitImpersonation}
            disabled={exiting}
            className="bg-white hover:bg-gray-100 text-amber-900 font-semibold px-3 py-1 rounded text-xs transition-colors duration-150 shadow"
          >
            {exiting ? 'Returning...' : 'Return to Admin'}
          </button>
        </div>
      )}
      <div className={`flex min-h-screen dark:bg-[#0a0a0a] bg-white transition-all duration-300`}>
        <div className="">
          <Navigation setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
        </div>
         
        <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-[14rem]'}`}>
        <Headder/>
      <div className="   max-lg:pt-[5rem] mx-3 md:mx-5 lg:mt-6">
        <Outlet />


        <div className="fixed md:hidden flex flex-col-reverse gap-4 bottom-6 right-6">
          <div ref={menuRef} onClick={() => { setballOpen(!isballOpen) }}>
            <button className="p-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
              <Wallet className="h-6 w-6" />
            </button>
          </div>

          <div className={`${isballOpen ? 'opacity-100' : 'opacity-0'} transition-all duration-300`}>
            <Link to="/scanner">
              <button className="p-4 bg-blue-600 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                <QrCode className="h-6 w-6" />
              </button>
            </Link>
          </div>

          <div className={`${isballOpen ? 'opacity-100' : 'opacity-0'} transition-all duration-300`}>
            <Link to="/expenses">
              <button className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                <ArrowDownCircle className="h-6 w-6" />
              </button>
            </Link>
          </div>

          <div className={`${isballOpen ? 'opacity-100' : 'opacity-0'} transition-all duration-300`}>
            <Link to="/income">
              <button className="p-4 bg-green-50 dark:bg-green-900/30  text-green-600 dark:text-green-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                <ArrowUpCircle className="h-6 w-6" />
              </button>
            </Link>
          </div>
        </div>

         

          
      </div>

    <footer className='md:max-w-6xl hidden flex pl-1 md:justify-center py-6  md:mx-auto'>
      <div className="dark:text-white space-y-5 ">
        <h1 className='text-[5rem] leading-none  font-extrabold max-md:w-[12rem]'>Live it up!</h1>
        <h2 className='text-xl'>Crafted with ❤️ by <a href="https://x.com/Soumen81845556">Soumen Bhunia</a> </h2>
      </div>
    </footer>
      
      </main>
    </div>
    </div>
  );
};

export default Layout;