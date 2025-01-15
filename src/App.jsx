import React ,{useState,createContext, useContext} from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate,useLocation } from 'react-router-dom';
import Layout from "./Components/Layout";
import Landing from "./Pages/Landing";
import { Link } from 'react-router-dom';

import {
  BudgetList,
  BudgetForm
} from './Components/Components';
import Login from './Auth/Pages/Login'
import { authCheck } from "./Auth/Components/ProtectedCheck";
import Income from "./Pages/Income";
import Dashboard from "./Pages/Dashboard";
import Expenses from "./Pages/Expenses";
import Reports from "./Pages/Reports";
import Register from "./Auth/Pages/Register";

const Budget = () => {
  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Budget</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetList />
        <BudgetForm />
      </div>
    </div>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [currency, setCurrency] = useState('USD');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    monthly: true
  });

  return (
    <div className="">
      <h1 className="sm:text-3xl text-xl font-bold sm:mb-6 mb-3 max-sm:pl-2">Settings</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex sm:space-x-6 space-x-2 sm:px-6 px-2">
            {['Profile', 'Preferences', 'Notifications'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-2 font-medium ${
                  activeTab === tab.toLowerCase()
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 ">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Profile Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" className="w-full p-2 border rounded" defaultValue="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full p-2 border rounded" defaultValue="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" className="w-full p-2 border rounded" defaultValue="+1 234 567 8900" />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Dark Mode</span>
                  <button 
                    className={`w-12 h-6 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Notification Settings</h2>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="font-medium capitalize">{key} Notifications</span>
                    <button 
                      className={`w-12 h-6 rounded-full ${value ? 'bg-blue-600' : 'bg-gray-200'}`}
                      onClick={() => setNotifications(prev => ({...prev, [key]: !prev[key]}))}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        value ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TransactionForm = ({ type }) => {
  const categories = type === 'income' ? [
    { id: 1, name: 'Salary' },
    { id: 2, name: 'Freelance' },
    { id: 3, name: 'Investments' },
    { id: 4, name: 'Other Income' }
  ] : [
    { id: 1, name: 'Food & Dining' },
    { id: 2, name: 'Transportation' },
    { id: 3, name: 'Utilities' },
    { id: 4, name: 'Entertainment' },
    { id: 5, name: 'Healthcare' }
  ];

  return (
    <div className="bg-white rounded-lg  shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Add {type === 'income' ? 'Income' : 'Expense'}</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded" 
            placeholder="Enter description" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select className="w-full p-2 border rounded">
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <div className="relative z-0">
            <span className="absolute left-3 top-2.5">$</span>
            <input 
              type="number" 
              className="w-full p-2 pl-6 border rounded" 
              placeholder="0.00" 
              min="0" 
              step="0.01" 
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input 
            type="date" 
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
          <textarea 
            className="w-full p-2 border rounded" 
            rows="3"
            placeholder="Add any additional notes..."
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Add {type === 'income' ? 'Income' : 'Expense'}
        </button>
      </form>
    </div>
  );
};

// Create auth context
const AuthContext = createContext(null);

// Custom hook for auth
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider component
const AuthProvider = ({ children }) => {
  const { auth: isAuthenticated, loading, error } = authCheck();
  const login = (credentials) => {
    // Add your login logic here
    localStorage.setItem('isAuthenticated', 'true');
    
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Route Component (prevents authenticated users from accessing login/register)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }

  return children;
};

const App = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState(true);
  const { auth: isAuthenticated, loading, error } = authCheck();


  return (
    <AuthProvider>
      <Router>
      <Routes>
          {/* Public Routes */}
           <Route path="/landing" element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          } />

          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
        
           <Route path='*' element={
               <div className="text-center  h-screen justify-center items-center flex jus py-12">
                <div className="">
                  <h2 className="text-2xl font-bold text-gray-800">404 - Page Not Found</h2>
                  <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
                  <Link to='/' className='text-indigo-600 underline hover:no-underline '>Go Back to Home</Link>
               </div>
             </div>
            }/>


          {/* Protected Routes with Layout */}
          {/* <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}> */}
          {isAuthenticated?
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<TransactionForm />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/budget" element={<Budget />} />

            <Route path='*' element={
               <div className="text-center h-screen py-12">
               <h2 className="text-2xl font-bold text-gray-800">404 - Page Not Found</h2>
               <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
             </div>
            }/>
            </Route>:
          <Route path="/" element={<Landing />} />}


          {/* <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="add" element={<TransactionForm />} />
                  <Route path="income" element={<Income />} />
                  <Route path="expenses" element={<Expenses />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-gray-800">404 - Page Not Found</h2>
                      <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
                    </div>
                  } />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } /> */}

        </Routes>
      </Router>

    </AuthProvider>
   
  );
};



export default App;