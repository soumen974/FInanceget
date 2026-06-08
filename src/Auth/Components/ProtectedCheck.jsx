import React, { useEffect, useState } from 'react';
import { api } from "../../AxiosMeta/ApiAxios";
import { apm } from "../../apm"; // ✅ import APM

// Helper functions
const encodeData = (data) => btoa(JSON.stringify(data));
const decodeData = (encodedData) => encodedData ? JSON.parse(atob(encodedData)) : null;

export function authCheck() {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [updated_at, setUpdated_at] = useState('');
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState(false);
  const [userType, setUserType] = useState('user');
  const [isAction, setIsAction] = useState('');

  

  // 🔥 Helper: set APM user EARLY
  const setApmUser = (user) => {

    
    if (!user || !user.email) return;

    apm.setUserContext({
      id: user.email, // ideally user.id
      username: user.name || 'Not Captured',
      email: user.email
    });

    apm.setCustomContext({
      userType: user.userType || 'user'
    });
  };

  // 🔥 VERY IMPORTANT: run FIRST (before API calls)
  useEffect(() => {
    const storedAuthData = localStorage.getItem('authData');

    if (storedAuthData) {
      const decodedData = decodeData(storedAuthData);

      if (decodedData) {
        // set state
        setAuth(true);
        setName(decodedData.name || '');
        setUserEmail(decodedData.email || '');
        setUserType(decodedData.userType || 'user');
        setUpdated_at(decodedData.updated_at || '');

        // ✅ SET APM USER EARLY (FIX)
        setApmUser(decodedData);
      }
    }

    // THEN call APIs
    checkAuth();
    userProfile();
  }, []);

  // Reload logic
  useEffect(() => {
    if (isAction === 'reload') {
      checkAuth();
      userProfile();
    }
  }, [isAction]);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/auth/protected');

      const authData = {
        email: response.data.email || '',
        userType,
        name,
        updated_at
      };

      setMessage(response.data.message || 'Authenticated');
      setUserEmail(authData.email);
      setAuth(true);

      localStorage.setItem('authData', encodeData(authData));

      // ✅ Set APM (fallback)
      setApmUser(authData);

    } catch (err) {
      setError(err.response?.data || err.message || 'Authentication failed');
      setAuth(false);
      localStorage.removeItem('authData');

      // clear user
      apm.setUserContext(null);

    } finally {
      setLoading(false);
    }
  };

  const userProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/user');

      const profileData = {
        name: response.data.name || '',
        email: response.data.email || '',
        userType: response.data.type || 'user',
        updated_at: response.data.updated_at || '',
      };

      setName(profileData.name);
      setUserEmail(profileData.email);
      setUserType(profileData.userType);
      setUpdated_at(profileData.updated_at);
      setMessage(response.data.message || 'Profile fetched');
      setAuth(true);

      localStorage.setItem('authData', encodeData(profileData));

      // ✅ MAIN APM USER SET
      setApmUser(profileData);

    } catch (err) {
      setError(err.response?.data || err.message || 'Profile fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshOrUpdate = () => {
    const storedAuthData = localStorage.getItem('authData');

    if (storedAuthData) {
      const decodedData = decodeData(storedAuthData);

      if (decodedData) {
        setName(decodedData.name);
        setUserEmail(decodedData.email);
        setUserType(decodedData.userType);
        setUpdated_at(decodedData.updated_at);
        setAuth(true);

        // ✅ IMPORTANT (again)
        setApmUser(decodedData);

      } else {
        checkAuth();
        userProfile();
      }
    } else {
      checkAuth();
      userProfile();
    }
  };

  useEffect(() => {
    handleRefreshOrUpdate();

    const handlePageRefresh = () => handleRefreshOrUpdate();
    window.addEventListener('load', handlePageRefresh);

    return () => window.removeEventListener('load', handlePageRefresh);
  }, []);

  return {
    auth,
    loading,
    error,
    message,
    name,
    userEmail,
    userType,
    setIsAction,
    updated_at
  };
}