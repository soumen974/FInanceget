import React ,{useState,createContext, useContext} from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate,useLocation } from 'react-router-dom';
import Layout from "./Components/Layout";
import Landing from "./Pages/Landing";
import { Link } from 'react-router-dom';

import LinkCodeVerify from "./Auth/Pages/LinkCodeVerify";
import Login from './Auth/Pages/Login'
import { authCheck } from "./Auth/Components/ProtectedCheck";
import Income from "./Pages/Income";
import Dashboard from "./Pages/Dashboard";
import Expenses from "./Pages/Expenses";
import Reports from "./Pages/Reports";
import Register from "./Auth/Pages/Register";
import Settings from "./Pages/Settings";
import Budget from "./Pages/Budget";
import Goals from "./Pages/Goals";
import Upgrade from "./Pages/Upgrade";
import Spinner from "./Loaders/Spinner";
import Users from "./Admin/Pages/Users";
import Scanner from "./Pages/Scanner";




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
  const { auth: isAuthenticated, loading, error ,userType } = authCheck();

  // if(loading){
  //   return <div className='flex justify-center place-content-center h-screen '><Spinner/></div>
  // }


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

          <Route path="/login/:resetpassword?" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          <Route path="/auth/:password?/:password?" element={
            <PublicRoute>
              <LinkCodeVerify />
            </PublicRoute>
          } />
          
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
        
           <Route path='*' element={
            (!loading?
               <div className="text-center  h-screen justify-center items-center flex jus py-12">
                <div className="">
                  <h2 className="text-2xl font-bold text-gray-800">404 - Page Not Found</h2>
                  <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
                  <Link to='/' className='text-indigo-600 underline hover:no-underline '>Go Back to Home</Link>
               </div>
             </div>
             : <div className='flex justify-center place-content-center h-screen '>
              <Spinner/>
              </div>)
            }/>


          

          {/* Protected Routes with Layout */}
          {/* <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}> */}

          {isAuthenticated?
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/add" element={<TransactionForm />} /> */}
            <Route path="/income" element={<Income />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/goal" element={<Goals />} />
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/scanner" element={<Scanner />} />
            {userType==='admin'&& <Route path="/Users" element={<Users />} />}


            <Route path='*' element={
               <div className="text-center h-screen py-12">
               <h2 className="text-2xl font-bold text-gray-800">404 - Page Not Found</h2>
               <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
             </div>
            }/>
            </Route>:

            


          <Route path="/" element={<Landing />} />}

          

        </Routes>
      </Router>

    </AuthProvider>
   
  );
};



export default App;