import React, { useState ,useLocation, useEffect } from 'react';
import { User,Home,PlusCircle,CreditCard , Wallet,ChevronRight,ChevronLeft,Clock, ArrowUpCircle, ArrowDownCircle, PieChart, Settings, LogOut } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { 
    DollarSign, 
    TrendingUp, 
    TrendingDown, 
    Activity ,Calendar, Tag, FileText
  } from 'react-feather';
import Logout from "../Auth/Components/Logout";
import { authCheck } from "../Auth/Components/ProtectedCheck";
import { useDarkMode } from '../theam/TheamColorsStyle'

const mockTransactions = [
  { id: 1, type: 'expense', category: 'Food', amount: 25.50, date: '2024-12-27' },
  { id: 2, type: 'income', category: 'Salary', amount: 3000, date: '2024-12-25' }
];

const mockCategories = {
  expense: ['Food', 'Rent', 'Utilities', 'Entertainment'],
  income: ['Salary', 'Freelance', 'Investments']
};

// Dashboard Component
const Dashboard = () => {
    const stats = [
      { 
        title: "Total Balance", 
        amount: "$12,345.67", 
        change: "+2.5%", 
        icon: <DollarSign className="text-blue-500" />, 
        bgColor: "bg-blue-50" 
      },
      { 
        title: "Total Income", 
        amount: "$8,234.50", 
        change: "+5.2%", 
        icon: <TrendingUp className="text-green-500" />, 
        bgColor: "bg-green-50" 
      },
      { 
        title: "Total Expenses", 
        amount: "$3,456.83", 
        change: "-1.8%", 
        icon: <TrendingDown className="text-red-500" />, 
        bgColor: "bg-red-50" 
      },
      { 
        title: "Total Savings", 
        amount: "$4,777.84", 
        change: "+3.1%", 
        icon: <Activity className="text-purple-500" />, 
        bgColor: "bg-purple-50" 
      }
    ];
  
    const recentTransactions = [
      { id: 1, description: "Grocery Shopping", amount: -85.50, category: "Food", date: "2024-12-27" },
      { id: 2, description: "Salary Deposit", amount: 3000.00, category: "Income", date: "2024-12-26" },
      { id: 3, description: "Electric Bill", amount: -120.00, category: "Utilities", date: "2024-12-25" }
    ];
  
    return (
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} rounded-lg p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-full bg-white">
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.amount}</p>
            </div>
          ))}
        </div>
  
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <button className="text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-right py-3 px-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map(transaction => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{transaction.description}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-sm bg-gray-100">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">{transaction.date}</td>
                    <td className={`py-3 px-4 text-right ${
                      transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount >= 0 ? '+' : ''}
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

// Transaction Form Component

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Transaction data:', formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6">Add New Transaction</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={`p-4 rounded-lg border ${
                formData.type === 'expense' 
                  ? 'border-red-500 bg-red-50 text-red-600' 
                  : 'border-gray-200'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income' })}
              className={`p-4 rounded-lg border ${
                formData.type === 'income' 
                  ? 'border-green-500 bg-green-50 text-green-600' 
                  : 'border-gray-200'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <DollarSign size={20} />
              </span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="pl-10 w-full p-3 border rounded-lg"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Tag size={20} />
              </span>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="pl-10 w-full p-3 border rounded-lg"
                required
              >
                <option value="">Select a category</option>
                <option value="food">Food & Dining</option>
                <option value="transportation">Transportation</option>
                <option value="utilities">Utilities</option>
                <option value="entertainment">Entertainment</option>
                <option value="shopping">Shopping</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FileText size={20} />
              </span>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="pl-10 w-full p-3 border rounded-lg"
                placeholder="Enter description"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Calendar size={20} />
              </span>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="pl-10 w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-4 rounded-lg text-white ${
              formData.type === 'expense' ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            Add {formData.type === 'expense' ? 'Expense' : 'Income'}
          </button>
        </form>
      </div>
    </div>
  );
};


// Navigation Component
const Navigation = ({isCollapsed,setIsCollapsed}) => {
  const { darkMode }  = useDarkMode() ;
   const {handleLogout} = Logout();
     const { name }= authCheck();
   const  SideBarTogle = ()=>{ 
    if(isCollapsed){
      localStorage.setItem('isCollapsed', 'false');
      setIsCollapsed(false);
    }else{
      localStorage.setItem('isCollapsed', 'true');
      setIsCollapsed(true);

    }
   }


  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white dark:bg-[#0a0a0a] border-r dark:border-[#ffffff24] transition-all duration-300 
      ${isCollapsed ? 'w-16' : 'w-62'}`}>
     <div className="p-4 border-b dark:border-[#ffffff24]">
        <div className="flex items-center gap-3">
          <Wallet className="h-6 w-6 text-blue-600  flex-shrink-0" />
          {!isCollapsed && (
            <Link to="/" className="font-semibold text-gray-800 dark:text-gray-200 truncate">
              FinanceGet
            </Link>
          )}
          <button
            onClick={()=>SideBarTogle()}
            className="ml-auto p-1.5 rounded-lg bg-white dark:bg-[#0a0a0a] border dark:border-[#ffffff24] hover:bg-gray-100 dark:hover:bg-[#ffffff17] text-gray-500 dark:text-gray-400 transition-all duration-300"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>

      {/* DateTime & User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b dark:border-[#ffffff24] space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span className="truncate w-32 font-medium">{name}</span>
          </div>
        </div>
      )}


      {/* Navigation Links */}
      <nav className="p-2 space-y-1">
        {[
          { icon: <Home size={18} />, label: 'Dashboard', to: '/' },
          // { icon: <PlusCircle size={18} />, label: 'Add', to: '/add' },
          { icon: <ArrowUpCircle size={18} />, label: 'Income', to: '/income' },
          { icon: <ArrowDownCircle size={18} />, label: 'Expenses', to: '/expenses' },
          { icon: <CreditCard  size={18} />, label: 'budget', to: '/budget' },
          { icon: <PieChart size={18} />, label: 'Reports', to: '/reports' },
          { icon: <Settings size={18} />, label: 'Settings', to: '/settings' },

        ].map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
              transition-colors relative
              ${
                isActive 
                  ? 'text-blue-600   bg-blue-50 dark:text-blue-600 dark:bg-blue-500 dark:bg-opacity-10 ' 
                  : 'text-gray-600 dark:hover:bg-[#ffffff17] dark:hover:text-white dark:text-gray-400 hover:text-blue-600  hover:bg-gray-50 '
              }
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs
                            rounded opacity-0 hover:opacity-100 pointer-events-none
                            whitespace-nowrap">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 w-full p-2">
      <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium
            text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-600 
            dark:hover:bg-red-600 dark:hover:bg-opacity-20 transition-colors
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs
                          rounded opacity-0 hover:opacity-100 pointer-events-none
                          whitespace-nowrap">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};


export { Dashboard, TransactionForm, Navigation };