import React, { useState ,useLocation, useEffect,useMemo } from 'react';
import { User,Home,Goal,CreditCard, Users , Wallet,ChevronRight,ChevronLeft, ArrowUpCircle, ArrowDownCircle, PieChart, Settings, LogOut } from 'lucide-react';
import { Link, Links, NavLink } from 'react-router-dom';
import { 
    DollarSign, 
    TrendingUp, 
    TrendingDown, 
    Activity ,Calendar, Tag, FileText
  } from 'react-feather';
import Logout from "../Auth/Components/Logout";
import { authCheck } from "../Auth/Components/ProtectedCheck";
import { useDarkMode } from '../theam/TheamColorsStyle'
import {TriangleAlert} from 'lucide-react';

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

export const Popupbox = ({title ,loading,HidePopup, setHidePopup,taskFunction}) =>{
  return(
  <>
  <div  className={`${HidePopup ?  'flex' : 'hidden'} fixed inset-0   z-30 flex items-center justify-center`}>
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center " onClick={() => setHidePopup(false)}></div>
    <div className={` z-20 relative bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff13]   rounded-lg text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg `}>
     
      <div className=" px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div
            className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-600 dark:bg-opacity-20 sm:mx-0 sm:h-10 sm:w-10`}
          >
            
              <TriangleAlert className="h-6 w-6 text-red-600" aria-hidden="true" />

          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">{title}</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to Logout this session ?</p>
            </div>
          </div>
        </div>
      </div>
      <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button
          className={`inline-flex w-full justify-center rounded-md bg-red-600  hover:bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
          onClick={() => taskFunction()}
        >
          Logout {loading&& "Loading..."}
        </button>
        <button
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-[#ffffff07] dark:hover:bg-[#ffffff17] dark:ring-[#ffffff24] dark:text-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => setHidePopup(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
  </>)
};


// Navigation Component
const Navigation = ({isCollapsed,setIsCollapsed}) => {
  const { darkMode }  = useDarkMode() ;
   const {handleLogout,loading} = Logout();
    const { name , userEmail ,userType,setIsAction,updated_at }= authCheck();
     const [currentUser, setCurrentUser] = useState(name);
      const [HidePopup, setHidePopup] = useState(false);
     useEffect(() => {
      setCurrentUser(name);
      }, [name]);

   const  SideBarTogle = ()=>{ 
    if(isCollapsed){
      localStorage.setItem('isCollapsed', 'false');
      setIsCollapsed(false);
    }else{
      localStorage.setItem('isCollapsed', 'true');
      setIsCollapsed(true);

    }
   };

   const NAV_ITEMS = [
    { icon: <Home size={20} />, label: 'Dashboard', to: '/' },
    { icon: <ArrowUpCircle size={20} />, label: 'Income', to: '/income' },
    { icon: <ArrowDownCircle size={20} />, label: 'Expenses', to: '/expenses' },
    { icon: <CreditCard size={20} />, label: 'Budget', to: '/budget', isBeta: true },
    { icon: <PieChart size={20} />, label: 'Reports', to: '/reports' },
    { icon: <Goal size={20} />, label: 'Goal', to: '/goal', isBeta: true },
    // { icon: <Users size={20} />, label: 'Loan Calculator', to: '/users' , isBeta: true },
    { icon: <Settings size={20} />, label: 'Settings', to: '/settings' },
    { icon: <Users size={20} />, label: 'Users', to: '/users' ,admin:true },

  ];

   const navItems = useMemo(() => NAV_ITEMS, []);

  //  className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
  //   isMenuOpen ? 'max-h-[27rem]' : 'max-h-0'
  // }`}


  return (
    <>
    <Popupbox HidePopup={HidePopup}  loading={loading}  taskFunction={handleLogout} setHidePopup={setHidePopup} title={"Logout conformation?"} />
    <aside className={ `max-lg:hidden flex flex-col fixed left-0 top-0 h-screen bg-white dark:bg-[#0a0a0a] border-r dark:border-white/10   transition-all duration-300 ease-in-out 
      ${isCollapsed ? 'w-16' : 'w-[14rem]'}`}>
     <div className="p-4 border-b dark:border-white/10 ">
        <div className="flex items-center gap-3">
          <Wallet className="h-6 w-6 text-blue-600  flex-shrink-0" />
          {!isCollapsed && (
            <Link to="/" className="font-bold text-gray-800 dark:text-gray-200 truncate">
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
        <div className="p-4 border-b   dark:border-[#ffffff24] space-y-2">
          <div className="flex  items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="relative">
              <User className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              {/* Small status indicator dot */}
              <span className={`
                absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full
                ${(userType === 'premium' || userType === 'admin') 
                  ? 'bg-amber-400 dark:bg-amber-500' 
                  : 'bg-blue-400 dark:bg-blue-500'
                }
                ring-1 ring-white dark:ring-gray-900
              `} />
            </div>
            <span className="truncate w-[6.3rem]   font-medium">{currentUser}</span>
            {(userType === 'premium' || userType === 'admin') ? (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                PRO
              </span>
            ):
            (
              <Link to={'/upgrade'} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                UPGRADE
              </Link>
            )
            
            }
          </div>
        </div>
          )}

    {(isCollapsed & (userType === 'premium' || userType === 'admin'))?
       <div className="p-4 border-b dark:border-white/10 ">
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
          PRO
        </span> 
      </div>: null }
      


      {/* Navigation Links */}
      <nav className="p-3 space-y-2  flex-1 overflow-x-hidden overflow-y-auto ">
      {navItems.map((item) => (
        item.admin && userType !== 'admin' ? null : (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
              transition-colors relative
              ${
                isActive 
                  ? 'text-blue-600 bg-blue-50 dark:text-blue-600 dark:bg-blue-500 dark:bg-opacity-10' 
                  : 'text-gray-600 dark:hover:bg-[#27272758] dark:hover:text-white dark:text-gray-400 hover:text-blue-600 hover:bg-gray-50'
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
            {!isCollapsed && item.isBeta && (
              <span className="text-[9px] font-semibold uppercase px-[0.6rem] py-[0.1] rounded-full 
                            bg-gradient-to-r from-blue-500 to-blue-600 
                            dark:from-blue-400 dark:to-blue-500 text-white 
                            shadow-md shadow-blue-500/30">
                BETA
              </span>
            )}
          </NavLink>
        )
      ))}
    </nav>
   

      {/* Logout Button */}
      <div className=" border-t dark:border-white/10  w-full p-2 overflow-hidden">
      <button
          onClick={()=>{setHidePopup(true)}}
          className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium
            text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-600 
            dark:hover:bg-red-900/20 dark:hover:bg-opacity-70 transition-colors
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
    </>
  );
};


export { Dashboard, TransactionForm, Navigation };