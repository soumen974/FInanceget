import React, { useState, useEffect } from 'react';
import { 
  User, Settings as SettingsIcon, Bell, Clock, 
  Save, AlertCircle, Mail, Phone, Calendar, 
  Moon, Sun, CheckCircle, X, Globe
} from 'react-feather';
import { authCheck } from "../Auth/Components/ProtectedCheck";
import { api } from "../AxiosMeta/ApiAxios";

import {   MoreVertical } from 'lucide-react';



const UserBadge = ({ user, type, darkMode, onUpgradeToPremium }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={`
      group flex items-center gap-4 px-5 py-3 
      rounded-2xl transition-all duration-500 ease-out
      hover:scale-[1.02] hover:shadow-xl relative
      cursor-pointer backdrop-blur-sm
      border border-transparent
      ${type === 'premium' 
        ? 'bg-gradient-to-r from-amber-400/90 via-yellow-400/90 to-orange-400/90 hover:from-amber-500/90 hover:to-orange-500/90 dark:from-amber-500/30 dark:via-yellow-500/30 dark:to-orange-500/30 shadow-amber-200/50 dark:shadow-amber-900/50' 
        : darkMode 
          ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 hover:from-blue-800/50 hover:to-indigo-800/50 hover:border-blue-700/30'
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-200/50'
      }
    `}>
      {/* Avatar Section with Enhanced Animations */}
      <div className="relative">
        <div className={`
          p-2.5 rounded-full transition-all duration-500
          transform-gpu group-hover:scale-110
          ${type === 'premium'
            ? 'bg-amber-200/50 dark:bg-amber-900/30 group-hover:rotate-12'
            : darkMode
              ? 'bg-blue-800/50 group-hover:bg-blue-700/50'
              : 'bg-blue-100/80 group-hover:bg-blue-200/80'
          }
        `}>
          <User 
            size={22} 
            className={`
              transition-transform duration-500
              group-hover:scale-110
              ${type === 'premium' 
                ? 'text-amber-900 dark:text-amber-400'
                : 'text-blue-600 dark:text-blue-300'
              }
            `} 
          />
        </div>

        {/* Enhanced Status Indicators */}
        {type === 'premium' ? (
          <>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 dark:bg-yellow-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500" />
            </span>
            <span className="absolute -bottom-1 -left-1 flex h-2 w-2">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 dark:bg-amber-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
          </>
        ) : (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 dark:bg-blue-400" />
          </span>
        )}
      </div>
      
      {/* Enhanced User Info Section */}
      <div className="flex flex-col min-w-[120px]">
        <span className={`
          font-semibold text-sm transition-all duration-300
          ${type === 'premium'
            ? 'text-amber-900 dark:text-amber-300 group-hover:text-amber-950 dark:group-hover:text-amber-200'
            : 'text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200'
          }
        `}>
          {user}
        </span>
        {type === 'premium' ? (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-amber-700 dark:text-amber-400/80">
              Premium
            </span>
            <div className="flex space-x-[2px]">
              {[...Array(3)].map((_, i) => (
                <span 
                  key={i}
                  className="inline-block w-1 h-1 rounded-full bg-amber-500 dark:bg-amber-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Basic Plan
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
          </div>
        )}
      </div>

      {/* Simplified Time Display Section */}
      <div className="ml-auto hidden sm:flex items-center">
        <div className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
          transition-all duration-300 hover:scale-105
          ${type === 'premium'
            ? 'bg-amber-200/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
            : 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
          }
        `}>
          <Clock size={12} className="animate-pulse" />
          <span className="font-mono">Active</span>
        </div>
      </div>

      {/* Three Dot Menu (Only for Basic Plan) */}
      {type !== 'premium' && (
        <div className="relative ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className={`
              p-1.5 rounded-full transition-all duration-300
              ${darkMode 
                ? 'hover:bg-blue-700/50 active:bg-blue-600/50' 
                : 'hover:bg-blue-200/50 active:bg-blue-300/50'}
              ${showMenu ? 'bg-blue-200/50 dark:bg-blue-700/50' : ''}
            `}
          >
            <div className="flex flex-col gap-[3px]">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className={`
                    w-1 h-1 rounded-full
                    ${type === 'premium'
                      ? 'bg-amber-600 dark:bg-amber-400'
                      : 'bg-blue-600 dark:bg-blue-400'
                    }
                  `}
                />
              ))}
            </div>
          </button>

          {/* Enhanced Dropdown Menu */}
          {showMenu && (
            <div 
              className={`
                absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1.5
                backdrop-blur-md border
                ${darkMode
                  ? 'bg-gray-800/95 border-gray-700'
                  : 'bg-white/95 border-gray-100'
                }
                z-50 transform-gpu animate-fadeIn
              `}
            >
              <div
                className={`
                  flex items-center gap-2 px-4 py-2.5 text-sm
                  transition-colors duration-200
                  ${darkMode
                    ? 'text-gray-200 hover:bg-blue-900/30'
                    : 'text-gray-700 hover:bg-blue-50'
                  }
                  cursor-pointer
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpgradeToPremium?.();
                  setShowMenu(false);
                }}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Upgrade to Premium
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Background Effects */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-20 blur-sm transition-opacity duration-500
        group-hover:opacity-30 -z-10 animate-gradient
        ${type === 'premium'
          ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400'
          : 'bg-gradient-to-r from-blue-300 via-indigo-400 to-blue-400'
        }
      `} />
    </div>
  );
};



export default function Settings() {
    const { name , userEmail ,userType,setIsAction,updated_at }= authCheck();
    
  const [activeTab, setActiveTab] = useState('profile');
  const [currency, setCurrency] = useState('INR');
  // const [darkMode, setDarkMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const currentUser = name;
  // const {darkMode} = TheamColorsStyle();
  // const {setDarkMode} = TheamColorsStyle();
   const [formData, setFormDate] = useState({
      name:  '',
      email: '',
      phone:'+91 234 567 8900',
      date: '2000-01-01'
    });

    useEffect(() => {
      setFormDate(prev=>({
        ...prev,
        name:  currentUser || 'financeGet User',
        email: userEmail || 'user@financeGet.vercel.com',
      }))
    }, [currentUser, userEmail]);

    const handleOnChange = (e) => {
      const { name, value } = e.target;
      setFormDate((prev) => ({
        ...prev,
        [name]: value
      }));
    };

   const [darkMode, setDarkMode] = useState(() => {
      const storedTheme = localStorage.getItem('theme');
      return storedTheme === 'dark';
    });
  
    const toggleDarkMode = () => {
      const newMode = !darkMode;
      setDarkMode(newMode);
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.removeItem('theme');
      }
    };
  
    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [darkMode]);

  


  const [notifications,setNotifications] = useState({
    email: { enabled: true, description: 'Get email updates about your account' },
    push: { enabled: false, description: 'Receive push notifications' },
    weekly: { enabled: false, description: 'Weekly transaction summary' },
    monthly: { enabled: true, description: 'Monthly financial report' }
  });

  const toggleNotification = (type) => {
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      [type]: {
        ...prevNotifications[type],
        enabled: !prevNotifications[type].enabled,
      },
    }));
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <SettingsIcon size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> }
  ];


   const baseStyles = {
    container: `min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-[#0a0a0a] text-slate-100' : 'bg-[#fff] text-slate-900'
    }`,
    headding: ` ${ darkMode ?'text-gray-100':'text-gray-900'}`,
    card: `rounded-lg ${
      darkMode ? 'bg-[#0a0a0a] border border-[#ffffff24]' : 'bg-white border border-[#00000014]'
    }`,
    button: `px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 ${
      darkMode 
        ? 'bg-[#0a0a0a] hover:bg-[#ffffff17] border border-[#ffffff24] text-white' 
        : 'bg-[#fff] hover:bg-[#f2f2f2] border border-[#00000014] text-slate-900'
    }`,
    activeButton: `px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 ${
      darkMode
        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
    }`,
    input: `w-full px-4 py-2 rounded-lg border ${
      darkMode
        ? 'bg-[#0a0a0a] border-[#ffffff24] text-white focus:border-indigo-500'
        : 'bg-white border-[#00000014] text-slate-900 focus:border-indigo-500'
    }`,
    tabs: `hidden sm:block border-b transition-all duration-200 ${
      darkMode ? 'border-[#ffffff24]' : 'border-gray-100'
    }`
  };

  // const UserBadge = ({ user, type, darkMode, currentTime }) => (
  //   <div className={`
  //     group flex items-center gap-4 px-5 py-3 
  //     rounded-2xl transition-all duration-500 ease-out
  //     hover:scale-[1.02] hover:shadow-xl relative
  //     cursor-pointer backdrop-blur-sm
  //     border border-transparent
  //     ${type === 'premium' 
  //       ? 'bg-gradient-to-r from-amber-400/90 via-yellow-400/90 to-orange-400/90 hover:from-amber-500/90 hover:to-orange-500/90 dark:from-amber-500/30 dark:via-yellow-500/30 dark:to-orange-500/30 shadow-amber-200/50 dark:shadow-amber-900/50' 
  //       : darkMode 
  //         ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 hover:from-blue-800/50 hover:to-indigo-800/50 hover:border-blue-700/30'
  //         : 'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-200/50'
  //     }
  //   `}>
  //     {/* Avatar Section */}
  //     <div className="relative">
  //       <div className={`
  //         p-2.5 rounded-full transition-all duration-300 group-hover:scale-110
  //         ${type === 'premium'
  //           ? 'bg-amber-200/50 dark:bg-amber-900/30 group-hover:rotate-12'
  //           : darkMode
  //             ? 'bg-blue-800/50 group-hover:bg-blue-700/50'
  //             : 'bg-blue-100/80 group-hover:bg-blue-200/80'
  //         }
  //       `}>
  //         <User size={22} className={`
  //           transition-transform duration-300
  //           ${type === 'premium' 
  //             ? 'text-amber-900 dark:text-amber-400'
  //             : 'text-blue-600 dark:text-blue-300'
  //           }
  //         `} />
  //       </div>
  
  //       {/* Status Indicators */}
  //       {type === 'premium' ? (
  //         <>
  //           <span className="absolute -top-1 -right-1 flex h-3 w-3">
  //             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 dark:bg-yellow-500 opacity-75" />
  //             <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500" />
  //           </span>
  //           <span className="absolute -bottom-1 -left-1 flex h-2 w-2">
  //             <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 dark:bg-amber-500 opacity-75" />
  //             <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
  //           </span>
  //         </>
  //       ) : (
  //         <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
  //           <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 dark:bg-blue-400" />
  //         </span>
  //       )}
  //     </div>
      
  //     {/* User Info Section */}
  //     <div className="flex flex-col min-w-[120px]">
  //       <span className={`
  //         font-semibold text-sm transition-all duration-300
  //         ${type === 'premium'
  //           ? 'text-amber-900 dark:text-amber-300 group-hover:text-amber-950 dark:group-hover:text-amber-200'
  //           : 'text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200'
  //         }
  //       `}>
  //         {user}
  //       </span>
  //       {type === 'premium' ? (
  //         <div className="flex items-center gap-1.5">
  //           <span className="text-[10px] font-medium uppercase tracking-wider text-amber-700 dark:text-amber-400/80">
  //             Premium
  //           </span>
  //           <div className="flex space-x-[2px]">
  //             {[...Array(3)].map((_, i) => (
  //               <span 
  //                 key={i}
  //                 className="inline-block w-1 h-1 rounded-full bg-amber-500 dark:bg-amber-400 animate-bounce"
  //                 style={{ animationDelay: `${i * 0.1}s` }}
  //               />
  //             ))}
  //           </div>
  //         </div>
  //       ) : (
  //         <div className="flex items-center gap-1.5">
  //           <span className="text-[10px] font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
  //             Basic Plan
  //           </span>
  //           <span className="inline-block w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
  //         </div>
  //       )}
  //     </div>
  
  //     {/* Time Display Section */}
  //     <div className="ml-auto hidden sm:flex flex-col items-end space-y-1">
  //       <div className={`
  //         flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium
  //         ${type === 'premium'
  //           ? 'bg-amber-200/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
  //           : 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  //         }
  //       `}>
  //         <Clock size={10} className="animate-pulse" />
  //         <span>{currentTime?.split(' ')[1]}</span>
  //       </div>
  //       <div className={`
  //         flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium
  //         ${type === 'premium'
  //           ? 'bg-amber-200/30 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
  //           : 'bg-blue-100/30 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
  //         }
  //       `}>
  //         <Calendar size={10} />
  //         <span>{currentTime?.split(' ')[0]}</span>
  //       </div>
  //     </div>
  
  //     {/* Background Effects */}
  //     <div className={`
  //       absolute inset-0 rounded-2xl opacity-20 blur-sm transition-opacity duration-300
  //       group-hover:opacity-30 -z-10
  //       ${type === 'premium'
  //         ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400'
  //         : 'bg-gradient-to-r from-blue-300 via-indigo-400 to-blue-400'
  //       }
  //     `} />
  //   </div>
  // );
  
  // Usage example:
  // <UserBadge 
  //   user="soumen974"
  //   type="free" // or "premium"
  //   darkMode={darkMode}
  //   currentTime="2025-02-20 18:52:29"
  // />
  function formatDate(isoString) {
    const date = new Date(isoString);
  
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
    return formattedDate;
  }

  const updateProfileData = async (e)=>{
    e.preventDefault();
    try{
      const name= formData.name;
     const response = await api.put('/api/user',{ name });
      handleSave();
      // console.log(response);
      setIsAction('reload')

    }catch(err){
      console.warn('Warning:', err.message);      
    }
  }
  return (
    <div className={`${baseStyles.container}`}>
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Clock size={16} />
                <span className="hidden sm:inline">Last updated:</span>
                {formatDate(updated_at)}
              </div>
            </div>
            {/* <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${userType==='premium'? 'bg-yellow-400 dark:bg-yellow-900 dark:bg-opacity-20 text-white': null} ${ darkMode ? 'bg-[#ffffff17]':'bg-gray-100'} `}>
              <User size={16} className={`${userType==='premium'? ' text-white dark:text-yellow-600': 'text-gray-500'}`} />
              <span className={`text-sm ${userType==='premium'? 'dark:text-yellow-600':''} font-medium`}>{currentUser} </span>
            </div> */}
            <UserBadge user={currentUser} type={userType} darkMode={darkMode} currentTime="2025-02-20 18:52:29" />
          </div>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed md:top-4 top-20 right-4 md:right-[40vw] z-50 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 text-blue-600 px-4 py-3 rounded-lg  dark:shadow-opacity-20  flex items-center gap-2 animate-fade-in max-w-[90vw] sm:max-w-md">
            <CheckCircle size={20} />
            <span>Settings updated successfully!</span>
            <button 
              onClick={() => setShowSuccess(false)}
              className="ml-auto hover:bg-blue-100 dark:hover:bg-blue-600 dark:hover:bg-opacity-20 p-1 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className={`${baseStyles.card} overflow-hidden`}>
          {/* Mobile Tab Select */}
          <div className="sm:hidden p-4 border-b border-[#00000014] dark:border-[#ffffff24]">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className={` ${baseStyles.input} appearance-none w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all duration-200`}
            >
              {tabs.map(tab => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Tabs */}
          <div className={` ${baseStyles.tabs}`}>
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-6 font-medium transition-all duration-200
                    ${activeTab === tab.id
                      ? `border-b-2 ${ darkMode? 'border-blue-600 text-blue-600 bg-blue-500 bg-opacity-10':'border-blue-600 text-blue-600 bg-blue-50/50'}`
                      : `${ darkMode?'hover:bg-[#ffffff17] hover:text-white':'text-gray-500 hover:text-gray-900 hover:bg-gray-50' }`
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'profile' && (
              <form onSubmit={updateProfileData} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <FormField
                    label="Full Name"
                    type="text"
                    id='name'
                    baseStyles={baseStyles}
                    handleOnChange={handleOnChange}
                    defaultValue={formData.name}
                    icon={<User size={18} />}
                  />
                  <FormField
                    label="Email"
                    type="email"
                    id='email'
                    baseStyles={baseStyles}
                    handleOnChange={handleOnChange}
                    defaultValue={formData.email}
                    icon={<Mail size={18} />}
                  />
                  <FormField
                    label="Phone"
                    type="tel"
                    id='phone'
                    baseStyles={baseStyles}
                    handleOnChange={handleOnChange}
                    defaultValue={formData.phone}
                    icon={<Phone size={18} />}
                  />
                  <FormField
                    label="Date of Birth"
                    type="date"
                    id='date'
                    baseStyles={baseStyles}
                    handleOnChange={handleOnChange}
                    defaultValue={formData.date}
                    icon={<Calendar size={18} />}
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    // onClick={handleSave}
                    type="submit"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                  
                </div>
              </form>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Currency</label>
                    <div className="relative">
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        
                        className={` ${baseStyles.input} appearance-none w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all duration-200`}
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                      </select>
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" size={18} />
                    </div>
                  </div>

                  <ThemeToggle baseStyles={baseStyles} darkMode={darkMode} setDarkMode={toggleDarkMode} />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                 {Object.entries(notifications).map(([key, { enabled, description }]) => (
                    <NotificationSetting
                      key={key}
                      name={key}
                      enabled={enabled}
                      description={description}
                      baseStyles={baseStyles}
                      darkMode={darkMode}
                      onToggle={() => toggleNotification(key)}
                    />
                  ))}

                <div className={`flex items-center gap-3 p-4 rounded-lg ${ darkMode? 'dark:bg-[#ffffff17] dark:text-slate-100':'bg-blue-50 text-blue-600 text-sm'}  `}>
                  <AlertCircle size={20} />
                  <p>Changes may take a few minutes to apply</p>
                </div>
             
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const FormField = ({ id, label,handleOnChange, type, defaultValue, icon ,baseStyles }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={defaultValue}
        onChange={handleOnChange}
        id={id}
        name={id}
        placeholder={'Enter your '+label}
        disabled={type==='email'&& defaultValue}
        className={` ${baseStyles.input} ${type==='email'&& 'cursor-not-allowed text-slate-400 dark:text-slate-600'} w-full pl-10 pr-4 py-2.5 rounded-lg border  transition-all duration-200`}
      />
      <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${type==='email'? 'text-slate-200 dark:text-slate-600':'text-slate-400'}`}>
        {icon}
      </span>
    </div>
  </div>
);

const ThemeToggle = ({ darkMode, setDarkMode ,baseStyles }) => (
  <div className="space-y-2">
    <label className={`text-sm font-medium ${baseStyles.headding} `}>Theme</label>
    <div className={`p-4 rounded-lg border ${ darkMode? 'bg-[#0a0a0a] border-[#ffffff24] text-white': 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`font-medium  ${baseStyles.headding} `}>Dark Mode</p>
          <p className="text-sm text-gray-500">Enable dark theme</p>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
            darkMode ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 flex items-center justify-center ${
            darkMode ? 'translate-x-7' : 'translate-x-0'
          }`}>
            {darkMode ? (
              <Moon size={12} className="text-blue-600" />
            ) : (
              <Sun size={12} className="text-gray-400" />
            )}
          </div>
        </button>
      </div>
    </div>
  </div>
);

const NotificationSetting = ({ name, enabled, description, onToggle,baseStyles ,darkMode}) => (
  <div className={`flex items-center justify-between p-4 rounded-lg border ${ darkMode? 'bg-[#0a0a0a] border-[#ffffff24] text-white': 'border-gray-200'} `}>
    <div>
      <p className={`font-medium ${baseStyles.headding} capitalize`}>{name}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button
      onClick={onToggle}
      className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-blue-600' : `${ darkMode?'bg-[#ffffff17]':'bg-gray-200'}`
      }`}
    >
      <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        enabled ? 'translate-x-7' : 'translate-x-0'
      }`} />
    </button>
  </div>
);

const styles = `
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;