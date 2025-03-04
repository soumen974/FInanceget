import React, { useState, useEffect, useRef } from 'react';
import { api } from "../../AxiosMeta/ApiAxios";
import { Users, Shield, Crown, Trash2, Edit2, MoreVertical, X, TriangleAlert, UserMinus } from 'lucide-react';

const Popupbox = ({ title, loading, hidePopup, setHidePopup, taskFunction, userId }) => (
  <>
    <div className={`${hidePopup ? 'flex' : 'hidden'} fixed inset-0 z-30 flex items-center justify-center`}>
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center" onClick={() => setHidePopup(false)}></div>
      <div className="z-20 relative bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff13] rounded-lg text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
        <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-600 dark:bg-opacity-20 sm:mx-0 sm:h-10 sm:w-10">
              <TriangleAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">{title}</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this user?</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            className={`inline-flex w-full justify-center rounded-md bg-red-600 hover:bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => taskFunction(userId)}
            disabled={loading}
          >
            Delete {loading && "Loading..."}
          </button>
          <button
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-[#ffffff07] dark:hover:bg-[#ffffff17] dark:ring-[#ffffff24] dark:text-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={() => setHidePopup(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </>
);

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showMenu, setShowMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [userCounts, setUserCounts] = useState({ admin: 0, premium: 0, standard: 0 });
  const menuRef = useRef(null);

  // Fetch users based on current page
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/users?page=${currentPage}`);
        setUsers(response.data.users || []); // Directly set users from backend
        setTotalUsers(response.data.pagination.totalUsers || 0);
        setTotalPages(response.data.pagination.totalPages || 0);
        setUserCounts(response.data.userCounts || { admin: 0, premium: 0, standard: 0 });
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage]); // Only re-fetch when currentPage changes

  // Handle outside click to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null);
      }
    };
    document.body.addEventListener('click', handleClickOutside);
    return () => document.body.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMenuClick = (id) => {
    setShowMenu(showMenu === id ? null : id);
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  const handleMakeAdmin = async (id) => {
    try {
      await api.put(`/api/users/${id}/role`, { type: 'admin' });
      setUsers(prev => prev.map(user => 
        user._id === id ? { ...user, type: 'admin' } : user
      ));
      setUserCounts(prev => ({ ...prev, admin: prev.admin + 1, standard: prev.standard - 1 }));
      setMessage(`User set as admin`);
      setShowMenu(null);
      if (selectedUser?._id === id) setSelectedUser(prev => ({ ...prev, type: 'admin' }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update role');
    }
  };

  const handleMakePremium = async (id) => {
    try {
      await api.put(`/api/users/${id}/role`, { type: 'premium' });
      setUsers(prev => prev.map(user => 
        user._id === id ? { ...user, type: 'premium' } : user
      ));
      setUserCounts(prev => ({ ...prev, premium: prev.premium + 1, standard: prev.standard - 1 }));
      setMessage(`User set as premium`);
      setShowMenu(null);
      if (selectedUser?._id === id) setSelectedUser(prev => ({ ...prev, type: 'premium' }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update role');
    }
  };

  const handleRemovePremium = async (id) => {
    try {
      await api.put(`/api/users/${id}/role`, { type: 'user' });
      setUsers(prev => prev.map(user => 
        user._id === id ? { ...user, type: 'user' } : user
      ));
      setUserCounts(prev => ({ ...prev, premium: prev.premium - 1, standard: prev.standard + 1 }));
      setMessage(`User set as standard user`);
      setShowMenu(null);
      if (selectedUser?._id === id) setSelectedUser(prev => ({ ...prev, type: 'user' }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update role');
    }
  };

  const handleDeleteConfirm = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/api/users/${id}`);
      const deletedUser = users.find(user => user._id === id);
      setUsers(prev => prev.filter(user => user._id !== id));
      setTotalUsers(prev => prev - 1);
      setTotalPages(Math.ceil((totalUsers - 1) / 5));
      setUserCounts(prev => ({
        ...prev,
        [deletedUser.type === 'admin' ? 'admin' : deletedUser.type === 'premium' ? 'premium' : 'standard']: prev[deletedUser.type === 'admin' ? 'admin' : deletedUser.type === 'premium' ? 'premium' : 'standard'] - 1
      }));
      setMessage(`User deleted`);
      setShowDeletePopup(null);
      setShowMenu(null);
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-gray-200 dark:border-[#ffffff24]">
      {/* Heading and Total Users */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard: User Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total Users: <span className="font-medium">{totalUsers}</span> 
          {totalUsers > 0 && (
            <>
              {' • '}
              <span className="text-blue-600 dark:text-blue-400">Admin: {userCounts.admin}</span>
              {' • '}
              <span className="text-yellow-600 dark:text-yellow-400">Premium: {userCounts.premium}</span>
              {' • '}
              <span className="text-gray-600 dark:text-gray-300">Standard: {userCounts.standard}</span>
            </>
          )}
        </p>
      </div>

      {/* Sorting Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('date')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-[#ffffff24] transition-all duration-200 
              ${sortBy === 'date' ? 'bg-blue-600 text-white dark:bg-blue-500' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#ffffff17]'}`}
          >
            Sort by Date (Newest)
          </button>
          <button
            onClick={() => setSortBy('type')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-[#ffffff24] transition-all duration-200 
              ${sortBy === 'type' ? 'bg-blue-600 text-white dark:bg-blue-500' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#ffffff17]'}`}
          >
            Sort by Type
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse h-[7.1rem] sm:h-[4.86rem] bg-gray-200 dark:bg-[#ffffff13] rounded-lg" style={{ animationDelay: `${index * 150}ms` }}></div>
            ))}
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Users className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No users found</p>
            {error && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-2 text-center max-w-md">{error}</p>
            )}
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="space-y-4">
            {users.map(user => (
              <div
                key={user._id}
                onClick={() => handleRowClick(user)}
                className="cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-[#ffffff24] hover:border-gray-300 hover:shadow-md transition-all duration-200 dark:bg-[#0a0a0a] dark:hover:bg-[#ffffff06] bg-white"
              >
                <div className="flex-1 mb-2 sm:mb-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{user.email || 'Unknown User'}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 truncate">
                    <span className={user.type === 'admin' ? 'text-blue-600 dark:text-blue-400' : user.type === 'premium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-300'}>
                      {user.type === 'admin' ? 'Admin' : user.type === 'premium' ? 'Premium' : 'Standard'}
                    </span>
                    <span>•</span>
                    <span>{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="relative self-end sm:self-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMenuClick(user._id); }}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#ffffff17] transition-colors duration-150 focus:outline-none"
                  >
                    <MoreVertical size={18} className="text-gray-500 dark:text-gray-400" />
                  </button>
                  {showMenu === user._id && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 top-8 w-40 rounded-lg shadow-lg py-2 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff24] z-10 transition-all duration-150 ease-out transform origin-top-right scale-95 animate-in"
                    >
                      {user.type !== 'admin' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMakeAdmin(user._id); }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-600 dark:hover:bg-opacity-10 transition-all duration-150"
                        >
                          <Shield size={16} className="shrink-0" />
                          <span>Make Admin</span>
                        </button>
                      )}
                      {user.type !== 'premium' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMakePremium(user._id); }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-600 dark:hover:bg-opacity-10 transition-all duration-150"
                        >
                          <Crown size={16} className="shrink-0" />
                          <span>Make Premium</span>
                        </button>
                      )}
                      {user.type === 'premium' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemovePremium(user._id); }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 dark:hover:bg-opacity-10 transition-all duration-150"
                        >
                          <UserMinus size={16} className="shrink-0" />
                          <span>Remove Premium</span>
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowDeletePopup(user._id); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-600 dark:hover:bg-opacity-10 transition-all duration-150"
                      >
                        <Trash2 size={16} className="shrink-0" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {showDeletePopup && (
          <Popupbox
            title="Confirm Deletion"
            loading={loading}
            hidePopup={showDeletePopup}
            setHidePopup={setShowDeletePopup}
            taskFunction={handleDeleteConfirm}
            userId={showDeletePopup}
          />
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-70 z-60"
              onClick={handleCloseDetails}
            />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff24] rounded-lg w-full max-w-lg p-6 shadow-xl z-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">User Details</h3>
                <button
                  onClick={handleCloseDetails}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#ffffff17] transition-colors duration-150"
                >
                  <X size={18} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                {Object.entries(selectedUser).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium capitalize">{key.replace('_', ' ')}:</span>
                    <span className="truncate max-w-[60%]">
                      {key === 'created_at' || key === 'last_login' 
                        ? new Date(value || Date.now()).toLocaleString() 
                        : typeof value === 'object' ? JSON.stringify(value) : value || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pagination Controls */}
        {!loading && users.length > 0 && (
          <div className="mt-6 border-t border-gray-200 dark:border-[#ffffff24] pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * 5 + 1} to {Math.min(currentPage * 5, totalUsers)} of {totalUsers} total users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-[#ffffff24] transition-all duration-200 
                    ${currentPage === 1 ? 'bg-gray-50 dark:bg-black dark:text-[#ffffff24] text-gray-300 cursor-not-allowed' : 'text-gray-700 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#ffffff17] hover:bg-gray-50 active:bg-gray-100'}`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage >= totalPages}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-[#ffffff24] transition-all duration-200 
                    ${currentPage >= totalPages ? 'bg-gray-50 dark:bg-black dark:text-[#ffffff24] text-gray-300 cursor-not-allowed' : 'text-gray-700 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#ffffff17] hover:bg-gray-50 active:bg-gray-100'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Messages */}
        {users.length > 0 && (
          <div className="mt-4 space-y-2">
            {error && (
              <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded">
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            {message && (
              <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded">
                <p className="text-xs text-green-600 dark:text-green-400">{message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;