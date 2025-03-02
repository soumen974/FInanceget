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
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState('date');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(null);
  const usersPerPage = 5;
  const menuRef = useRef(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/users');
        const fetchedUsers = response.data || [];
        setUsers(sortUsers(fetchedUsers, sortBy));
        setLoading(false);
        setError('');
      } catch (err) {
        const errorMsg = err.response?.status === 404
          ? 'Users endpoint not found (404). Ensure the backend server is running at http://localhost:5000/api/users.'
          : err.response?.data?.error || err.message || 'Failed to fetch users';
        setError(errorMsg);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Sort users based on sortBy value
  const sortUsers = (userList, sortType) => {
    let sorted = [...userList];
    if (sortType === 'date') {
      sorted.sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));
    } else {
      sorted.sort((a, b) => {
        const typeOrder = { 'admin': 0, 'premium': 1, 'user': 2 };
        const typeA = typeOrder[a.type] || 2;
        const typeB = typeOrder[b.type] || 2;
        return typeA - typeB || new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
      });
    }
    return sorted;
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setUsers(prevUsers => sortUsers(prevUsers, newSortBy));
    setCurrentPage(0);
  };

  // Handle outside click to hide menu
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
      const response = await api.put(`/api/users/${id}/role`, { type: 'admin' });
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user => 
          user._id === id ? { ...user, type: 'admin' } : user
        );
        return sortUsers(updatedUsers, sortBy);
      });
      if (selectedUser?._id === id) {
        setSelectedUser(prev => ({ ...prev, type: 'admin' }));
      }
      setMessage(`User ${id} set as admin`);
      setShowMenu(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update role');
    }
  };

  const handleMakePremium = async (id) => {
    try {
      const response = await api.put(`/api/users/${id}/role`, { type: 'premium' });
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user => 
          user._id === id ? { ...user, type: 'premium' } : user
        );
        return sortUsers(updatedUsers, sortBy);
      });
      if (selectedUser?._id === id) {
        setSelectedUser(prev => ({ ...prev, type: 'premium' }));
      }
      setMessage(`User ${id} set as premium`);
      setShowMenu(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update role');
    }
  };

  const handleRemovePremium = async (id) => {
    try {
      const response = await api.put(`/api/users/${id}/role`, { type: 'user' });
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user => 
          user._id === id ? { ...user, type: 'user' } : user
        );
        return sortUsers(updatedUsers, sortBy);
      });
      if (selectedUser?._id === id) {
        setSelectedUser(prev => ({ ...prev, type: 'user' }));
      }
      setMessage(`User ${id} set as standard user`);
      setShowMenu(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update role');
    }
  };

  const handleDeleteConfirm = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/api/users/${id}`);
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.filter(user => user._id !== id);
        return sortUsers(updatedUsers, sortBy);
      });
      if (selectedUser?._id === id) {
        setSelectedUser(null);
      }
      setMessage(`User ${id} deleted`);
      setShowDeletePopup(null);
      setShowMenu(null);
      setError('');
      if (users.length - 1 <= currentPage * usersPerPage) {
        setCurrentPage(Math.max(0, currentPage - 1));
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setShowDeletePopup(id);
    setShowMenu(null);
  };

  // Pagination Logic
  const paginatedUsers = users.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);
  const totalPages = Math.ceil(users.length / usersPerPage);
  const totalUsers = users.length;

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
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
          {users.length > 0 && (
            <>
              {' • '}
              <span className="text-blue-600 dark:text-blue-400">Admin: {users.filter(u => u.type === 'admin').length}</span>
              {' • '}
              <span className="text-yellow-600 dark:text-yellow-400">Premium: {users.filter(u => u.type === 'premium').length}</span>
              {' • '}
              <span className="text-gray-600 dark:text-gray-300">Standard: {users.filter(u => u.type === 'user').length}</span>
            </>
          )}
        </p>
      </div>

      {/* Sorting Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => handleSortChange('date')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-[#ffffff24] transition-all duration-200 
              ${sortBy === 'date' ? 'bg-blue-600 text-white dark:bg-blue-500' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#ffffff17]'}`}
          >
            Sort by Date (Newest)
          </button>
          <button
            onClick={() => handleSortChange('type')}
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
            {[...Array(usersPerPage)].map((_, index) => (
              <div key={index} className="animate-pulse h-12 bg-gray-200 dark:bg-[#ffffff13] rounded-lg" style={{ animationDelay: `${index * 150}ms` }}></div>
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
            {paginatedUsers.map(user => (
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
                    <span>{new Date(user.created_at || Date.now()).toLocaleDateString()}</span>
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
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(user._id); }}
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
              className="fixed inset-0 bg-black bg-opacity-70  z-60"
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
                Showing {currentPage * usersPerPage + 1} to {Math.min((currentPage + 1) * usersPerPage, users.length)} of {totalUsers} total users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-[#ffffff24] transition-all duration-200 
                    ${currentPage === 0 ? 'bg-gray-50 dark:bg-black dark:text-[#ffffff24] text-gray-300 cursor-not-allowed' : 'text-gray-700 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#ffffff17] hover:bg-gray-50 active:bg-gray-100'}`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage >= totalPages - 1}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-[#ffffff24] transition-all duration-200 
                    ${currentPage >= totalPages - 1 ? 'bg-gray-50 dark:bg-black dark:text-[#ffffff24] text-gray-300 cursor-not-allowed' : 'text-gray-700 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#ffffff17] hover:bg-gray-50 active:bg-gray-100'}`}
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