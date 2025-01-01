import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  Wallet,
  PlusCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  PieChart,
  Settings,
  LogOut,
  Menu,
  X,
  Clock,
  User,
  CalendarDays,
  Home
} from 'lucide-react';

const Headder = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentUser] = useState('monikawebdev');

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    window.history.pushState(null, null, '/');
    window.onpopstate = function () {
       window.history.go(1); 
    };
    window.location.reload();
  };

  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', to: '/' },
    { icon: <PlusCircle size={20} />, label: 'Add', to: '/add' },
    { icon: <ArrowUpCircle size={20} />, label: 'Income', to: '/income' },
    { icon: <ArrowDownCircle size={20} />, label: 'Expenses', to: '/expenses' },
    { icon: <PieChart size={20} />, label: 'Reports', to: '/reports' },
    { icon: <Settings size={20} />, label: 'Settings', to: '/settings' },
  ];

  return (
    <nav className=" fixed w-full z-30 md:hidden bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Wallet className="h-8 w-8 text-blue-600" />
            <Link to={'/'} className="ml-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              FinanceTracker
            </Link>
          </div>

         

         

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-50 
                     hover:text-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-3 pt-2">
            {/* DateTime & User Info - Mobile */}
            <div className="px-4 py-2 space-y-2 border-b border-gray-100 mb-2 bg-gray-50 rounded-lg">
             
              <div className="flex items-center text-gray-600">
                <User size={16} className="mr-2" />
                <span className="text-sm font-medium">{currentUser}</span>
              </div>
            </div>

            {/* Navigation Items - Mobile */}
            <div className="space-y-1 px-2">
              {navItems.map(item => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-md w-full transition-all
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`
                  }
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-md w-full
                         text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Headder;