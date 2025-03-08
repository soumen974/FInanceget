import React, { useState, useEffect } from 'react';
import { 
  User, Settings as SettingsIcon, Bell, Clock, 
  Save, AlertCircle, Mail, Phone, Calendar, 
  Moon, Sun, CheckCircle, X, Globe
} from 'react-feather';
import { authCheck } from "../Auth/Components/ProtectedCheck";
import { api } from "../AxiosMeta/ApiAxios";

import {   MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';



const UserBadge = ({ user, type, darkMode, onUpgradeToPremium }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={`
      flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-colors duration-150
      ${(type=== 'premium' || type=== 'admin')
        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
        : 'bg-gray-50 dark:bg-[#ffffff17] text-indigo-600 dark:text-indigo-400'}
    `}>
      {/* Avatar */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <User 
            size={18} 
            className={(type=== 'premium' || type=== 'admin') ? 'text-amber-500' : 'text-indigo-500'} 
          />
          <span className={`
            absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full
            ${(type=== 'premium' || type=== 'admin') ? 'bg-amber-500 animate-pulse' : 'bg-indigo-500'}
          `} />
        </div>

        {/* User Info */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
            {user}
          </span>
          <span className="text-xs font-medium uppercase tracking-wide">
            {type=== 'premium'  ? 'Premium' : type=== 'admin'? 'Admin' : 'Basic'}
          </span>
        </div>
      </div>

      {/* Menu for Basic Users */}
      {(type !== 'premium'  && type !== 'admin') && (
        <div className="relative ml-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#ffffff17] transition-colors duration-150"
          >
            <MoreVertical size={16} className="text-gray-500 dark:text-gray-400" />
          </button>
          {showMenu && (
            <div className={`
              absolute right-0 mt-2 w-40 rounded-lg shadow-md py-2
              bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff24]
              z-50 animate-fade-in
            `}>
              <Link
              to={'/upgrade'}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpgradeToPremium?.();
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#ffffff17] transition-colors duration-150 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Upgrade to Premium
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};



export default function Settings() {
    const { name , userEmail ,userType,setIsAction,updated_at }= authCheck();
    
  const [activeTab, setActiveTab] = useState('preferences');
  // const [currency, setCurrency] = useState('INR');

  const [currency, setCurrency] = useState(() => {
    const storedCurrency = localStorage.getItem('currency');
    return storedCurrency || 'INR'; 
  });
  
  const toggleCurrency = () => {
    const currencies = ['INR', 'USD', 'EUR', 'GBP'];
    const newCurrency = currencies.includes(currency) ? currencies[(currencies.indexOf(currency) + 1) % currencies.length] : 'INR';
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
    document.documentElement.setAttribute('data-currency', newCurrency);
  };
  
  useEffect(() => {
    document.documentElement.setAttribute('data-currency', currency);
    const storedCurrency = localStorage.getItem('currency');
    if (storedCurrency && storedCurrency !== currency) {
      setCurrency(storedCurrency);
    }
  }, [currency]);

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
    { id: 'preferences', label: 'Preferences', icon: <SettingsIcon size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> }
  ];


   const baseStyles = {
    container: ` transition-colors duration-300 ${
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
      <div className="max-w-6xl pb-6 mx-auto ">
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
              className={` ${baseStyles.input} appearance-auto w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all duration-200`}
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
                    <label className={`text-sm font-medium ${baseStyles.headding}`}>Currency</label>
                    <div className="relative">
                      <select
                        value={currency}
                        onChange={(e) => {toggleCurrency(e.target.value);toggleCurrency}}
                        
                        className={` ${baseStyles.input} appearance-auto w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all duration-200`}
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