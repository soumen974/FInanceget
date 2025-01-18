import React, { useState, useEffect } from 'react';
import { 
  User, Settings as SettingsIcon, Bell, Clock, 
  Save, AlertCircle, Mail, Phone, Calendar, 
  Moon, Sun, CheckCircle, X, Globe
} from 'react-feather';
import { authCheck } from "../Auth/Components/ProtectedCheck";


export default function Settings() {
    const { name ,userEmail }= authCheck();
  const [activeTab, setActiveTab] = useState('profile');
  const [currency, setCurrency] = useState('INR');
  const [darkMode, setDarkMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const currentUser = name;

  // Update current time every minute
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toISOString().slice(0, 19).replace('T', ' '));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const notifications = {
    email: { enabled: true, description: 'Get email updates about your account' },
    push: { enabled: false, description: 'Receive push notifications' },
    weekly: { enabled: true, description: 'Weekly transaction summary' },
    monthly: { enabled: true, description: 'Monthly financial report' }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <Clock size={16} />
                <span className="hidden sm:inline">Last updated:</span>
                {currentDateTime}
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
              <User size={16} className="text-gray-500" />
              <span className="text-sm font-medium">{currentUser}</span>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-green-50 text-green-600 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in max-w-[90vw] sm:max-w-md">
            <CheckCircle size={20} />
            <span>Settings updated successfully!</span>
            <button 
              onClick={() => setShowSuccess(false)}
              className="ml-auto hover:bg-green-100 p-1 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Mobile Tab Select */}
          <div className="sm:hidden p-4 border-b border-gray-100">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg"
            >
              {tabs.map(tab => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:block border-b border-gray-100">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-6 font-medium transition-all duration-200
                    ${activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <FormField
                    label="Full Name"
                    type="text"
                    defaultValue={currentUser}
                    icon={<User size={18} />}
                  />
                  <FormField
                    label="Email"
                    type="email"
                    defaultValue={userEmail}
                    icon={<Mail size={18} />}
                  />
                  <FormField
                    label="Phone"
                    type="tel"
                    defaultValue="+91 234 567 8900"
                    icon={<Phone size={18} />}
                  />
                  <FormField
                    label="Date of Birth"
                    type="date"
                    defaultValue="2000-01-01"
                    icon={<Calendar size={18} />}
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                  
                </div>
              </div>
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
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                      </select>
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
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
                  />
                ))}

                <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 text-blue-600 text-sm">
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

// Reusable Components
const FormField = ({ label, type, defaultValue, icon }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <input
        type={type}
        defaultValue={defaultValue}
        disabled={type==='email'&& defaultValue}
        className={` ${type==='email'&& 'cursor-not-allowed'} w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200`}
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
    </div>
  </div>
);

const ThemeToggle = ({ darkMode, setDarkMode }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">Theme</label>
    <div className="p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">Dark Mode</p>
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

const NotificationSetting = ({ name, enabled, description }) => (
  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
    <div>
      <p className="font-medium text-gray-900 capitalize">{name}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button
      className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        enabled ? 'translate-x-7' : 'translate-x-0'
      }`} />
    </button>
  </div>
);

// Required CSS
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