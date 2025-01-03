import React ,{useState,createContext, useContext} from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate,useLocation } from 'react-router-dom';
import {Navigation} from './Components/Navigation';
import Layout from "./Components/Layout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Landing from "./Pages/Landing";
import {
  RecentTransactions,
  BudgetList,
  BudgetForm,
  ExpenseChart,
  CategoryDistribution,
  UserProfile,
  CategorySettings,
  NotificationSettings,

  RegisterForm
} from './Components/Components';
import LoginForm from './Auth/Components/Login'
// Pages
const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Balance" amount="5,234.50" type="balance" />
        <StatCard title="Income" amount="8,234.50" type="income" />
        <StatCard title="Expenses" amount="3,000.00" type="expense" />
      </div>
      <RecentTransactions />
    </div>
  );
};

const Expenses = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Expenses</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionList type="expense" />
        </div>
        <div>
          <TransactionForm type="expense" />
        </div>
      </div>
    </div>
  );
};

const Income = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Income</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionList type="income" />
        </div>
        <div>
          <TransactionForm type="income" />
        </div>
      </div>
    </div>
  );
};

const Budget = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Budget</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetList />
        <BudgetForm />
      </div>
    </div>
  );
};

const Reports = () => {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('expenses');

  // Sample data for charts
  const expenseData = [
    { name: 'Jan', amount: 2400 },
    { name: 'Feb', amount: 1398 },
    { name: 'Mar', amount: 9800 },
    { name: 'Apr', amount: 3908 },
    { name: 'May', amount: 4800 },
    { name: 'Jun', amount: 3800 }
  ];

  const categoryData = [
    { name: 'Food', value: 400 },
    { name: 'Transport', value: 300 },
    { name: 'Entertainment', value: 300 },
    { name: 'Utilities', value: 200 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <div className="flex  gap-4">
          <select 
            className="p-2 border rounded"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
          <select 
            className="p-2 border rounded"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="expenses">Expenses</option>
            <option value="income">Income</option>
            <option value="both">Income & Expenses</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Trends Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Expense Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-blue-600">$25,306</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">$42,150</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Net Savings</p>
              <p className="text-2xl font-bold text-purple-600">$16,844</p>
            </div>
          </div>
        </div>
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex space-x-6 px-6">
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

        <div className="p-6">
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

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

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

// Components
const StatCard = ({ title, amount, type }) => (
  <div className={`p-6 rounded-lg shadow ${
    type === 'balance' ? 'bg-blue-50' :
    type === 'income' ? 'bg-green-50' : 'bg-red-50'
  }`}>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className={`text-2xl font-bold ${
      type === 'income' ? 'text-green-600' :
      type === 'expense' ? 'text-red-600' : 'text-blue-600'
    }`}>${amount}</p>
  </div>
);

const TransactionList = ({ type }) => {
  const transactions = [
    { 
      id: 1, 
      description: 'Grocery Shopping',
      category: 'Food',
      amount: 120.50,
      date: '2024-12-26',
      type: 'expense'
    },
    { 
      id: 2, 
      description: 'Salary Deposit',
      category: 'Salary',
      amount: 3000.00,
      date: '2024-12-25',
      type: 'income'
    },
    { 
      id: 3, 
      description: 'Freelance Work',
      category: 'Side Income',
      amount: 500.00,
      date: '2024-12-24',
      type: 'income'
    },
    { 
      id: 4, 
      description: 'Internet Bill',
      category: 'Utilities',
      amount: 89.99,
      date: '2024-12-23',
      type: 'expense'
    }
  ];

  // Filter transactions based on type
  const filteredTransactions = transactions.filter(t => t.type === type);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Recent {type === 'income' ? 'Income' : 'Expenses'}</h2>
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No {type} transactions found
          </div>
        ) : (
          filteredTransactions.map(transaction => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium">{transaction.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{transaction.category}</span>
                  <span>•</span>
                  <span>{new Date(transaction.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  ${transaction.amount.toFixed(2)}
                </p>
                <div className="flex gap-2 mt-1">
                  <button className="text-xs text-blue-600 hover:underline">Edit</button>
                  <button className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <select className="p-2 border rounded">
          <option>Sort by Date</option>
          <option>Sort by Amount</option>
          <option>Sort by Category</option>
        </select>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Previous</button>
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Next</button>
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for existing auth state
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const login = (credentials) => {
    // Add your login logic here
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
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

// const Layout = ({ children }) => {
//   const { logout } = useAuth();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navigation onLogout={logout} />
//       <main className="p-6">
//         {children}
//       </main>
//     </div>
//   );
// };


// App Component
const App = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for existing auth state
    return localStorage.getItem('isAuthenticated') === 'true';
  });

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
            <Route path='*' element={
               <div className="text-center py-12">
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

// Protected Route Component
const ProtectedRoute1 = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;