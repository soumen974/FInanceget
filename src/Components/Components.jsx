// RecentTransactions.jsx
const RecentTransactions = () => (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <div className="space-y-4">
        {[
          { id: 1, type: 'expense', category: 'Food', amount: 25.50, date: '2024-12-27' },
          { id: 2, type: 'income', category: 'Salary', amount: 3000, date: '2024-12-25' },
          { id: 3, type: 'expence', category: 'Food', amount: 300, date: '2024-12-25' }

        ].map(transaction => (
          <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <p className="font-medium">{transaction.category}</p>
              <p className="text-sm text-gray-500">{transaction.date}</p>
            </div>
            <p className={`font-bold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
  
  // Budget Components

  
  // Chart Components
  const ExpenseChart = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Expense Trends</h2>
      {/* Add chart implementation */}
    </div>
  );
  
  const CategoryDistribution = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
      {/* Add distribution chart */}
    </div>
  );
  
  // Settings Components
  const UserProfile = () => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      {/* Add profile form */}
    </div>
  );
  
  const CategorySettings = () => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Category Management</h2>
      {/* Add category management */}
    </div>
  );
  
  const NotificationSettings = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
      {/* Add notification settings */}
    </div>
  );
  
  // Auth Forms
  const LoginForm = () => {
  const  sumbitLogin = ()=>{
    localStorage.setItem('isAuthenticated', 'true');
  }


    return (
    <form onSubmit={()=>sumbitLogin()} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input autoComplete='email' id="email" type="email" className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" className="w-full p-2 border rounded" />
      </div>
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded">
        Login
      </button>
    </form>
  )};
  
  const RegisterForm = () => (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input type="text" className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" className="w-full p-2 border rounded" />
      </div>
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded">
        Register
      </button>
    </form>
  );
  
  export {
    RecentTransactions,
    ExpenseChart,
    CategoryDistribution,
    UserProfile,
    CategorySettings,
    NotificationSettings,
    LoginForm,
    RegisterForm
  };