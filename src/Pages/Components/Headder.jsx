import React, { useState,useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  Wallet, ArrowUpCircle, ArrowDownCircle, PieChart, Settings, LogOut, 
  Menu, X, User, Home,Goal, CreditCard ,Users
} from 'lucide-react';
import Logout from "../../Auth/Components/Logout";
import { authCheck } from "../../Auth/Components/ProtectedCheck";
import { Popupbox } from "../../Components/Navigation";

// Trendy Color Palette with Original Dark Theme Black
const COLORS = {
  primary: '#6366F1',    // Modern Indigo
  accent: '#FBBF24',     // Vibrant Amber for premium
  neutral: '#111827',    // Dark Gray
  bgLight: '#F9FAFB',    // Soft Gray Background
  bgDark: '#0a0a0a',     // Your original black for dark theme
  hoverLight: '#E5E7EB', // Light hover
  hoverDark: '#ffffff17', // Your original dark hover
  borderDark: '#ffffff24', // Your original dark border
  danger: '#EF4444',     // Red
};

const Headder = () => {
  const { handleLogout, loading } = Logout();
  const { name, userType } = authCheck();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [HidePopup, setHidePopup] = useState(false);

  const NAV_ITEMS = [
    { icon: <Home size={18} />, label: 'Dashboard', to: '/' },
    { icon: <ArrowUpCircle size={18} />, label: 'Income', to: '/income' },
    { icon: <ArrowDownCircle size={18} />, label: 'Expenses', to: '/expenses' },
    { icon: <CreditCard size={18} />, label: 'Budget', to: '/budget',isBeta: true },
    { icon: <PieChart size={18} />, label: 'Reports', to: '/reports' },
    { icon: <Goal size={18} />, label: 'Goal', to: '/goal',isBeta: true },
    { icon: <Settings size={18} />, label: 'Settings', to: '/settings' },
    { icon: <Users size={18} />, label: 'Users', to: '/Users',admin:true },
  ];

     const navItems = useMemo(() => NAV_ITEMS, []);
  
     

  return (
    <>
      <Popupbox 
        HidePopup={HidePopup} 
        loading={loading} 
        taskFunction={handleLogout} 
        setHidePopup={setHidePopup} 
        title="Logout?" 
      />
      
      {isMenuOpen &&  <div className="fixed lg:hidden inset-0 z-10 bg-black bg-opacity-70 flex items-center justify-center " onClick={() => setIsMenuOpen(false)}></div>}

      <nav className="fixed w-full z-30 lg:hidden bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-[#ffffff24]">
        <div className="max-w-7xl z-30 mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2"
            >
              <Wallet className="h-6 w-6 text-indigo-500" />
              <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                FinanceGet
              </span>
            </Link>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#ffffff17] transition-colors duration-150"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {/* {isMenuOpen && ( */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'max-h-[27rem] mb-4' : 'max-h-0'
            }`}>
              {/* User Badge */}
              <div className={`
                flex justify-between items-center gap-3 px-3 py-2 mb-2 rounded-lg
                ${(userType === 'premium' || userType === 'admin')
                  ? 'bg-amber-50 dark:bg-amber-900/20'
                  : 'bg-gray-50 dark:bg-[#2d2b2b3b]'}
              `}>
                <div className=" flex  items-center gap-3">
                  
                  <div className="relative">
                    <User 
                      size={18} 
                      className={(userType === 'premium' || userType === 'admin') ? 'text-amber-500' : 'text-indigo-500'} 
                    />
                    <span className={`
                      absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full
                      ${(userType === 'premium' || userType === 'admin') ? 'bg-amber-500 animate-pulse' : 'bg-indigo-500'}
                    `} />
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate block max-w-[150px]">
                      {name || 'User'}
                    </span>
                    <span className={`
                      text-xs font-medium uppercase tracking-wide
                      ${(userType === 'premium' || userType === 'admin') ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'}
                    `}>
                      {(userType === 'premium') ? 'Premium' : userType === 'admin'? 'Admin' : 'Basic'}
                    </span>
                  </div>

                </div>

                <div className="">
                  {(userType === 'premium' || userType === 'admin') ? (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                        PRO
                      </span>
                    ):
                    (
                      <Link to={'/upgrade'} className="text-sm font-medium px-4 py-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        UPGRADE PREMIUM
                      </Link>
                    )
                    }
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-1">
                {navItems.map(item => (
                   item.admin && userType !== 'admin' ? null : (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg
                      transition-colors duration-150
                      ${isActive
                        ? 'text-indigo-600 bg-indigo-50 dark:text-blue-600 dark:bg-blue-500 dark:bg-opacity-10'
                        : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-[#27272758]'}
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.isBeta && (
                      <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white shadow-md shadow-blue-500/30">
                        BETA
                      </span>
                    )}
                  </NavLink>)
                ))}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setHidePopup(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium w-full text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:bg-opacity-70 transition-colors duration-150 rounded-lg"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          {/* )} */}
        </div>
      </nav>
    </>
  );
};

export default Headder;