import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify session on load
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          setProfile(res.data.profile);
        }
      } catch (err) {
        console.error('Session restore failed:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setProfile(res.data.profile);
      return res.data;
    }
  };

  const register = async (registrationData) => {
    const res = await api.post('/auth/register', registrationData);
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setProfile(res.data.profile);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
    window.location.href = '/login';
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      }
    } catch (e) {
      console.error('Failed to refresh profile', e);
    }
  };

  // Demo accounts helper
  const demoLogin = async (demoRole) => {
    let email = 'student@skillbridge.edu';
    if (demoRole === 'college') email = 'college@skillbridge.edu';
    if (demoRole === 'company') email = 'recruiter@infosys.com';
    if (demoRole === 'razorpay') email = 'careers@razorpay.com';

    return await login(email, 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        demoLogin,
        isAuthenticated: !!user,
        isStudent: user?.role === 'student',
        isCollege: user?.role === 'college',
        isCompany: user?.role === 'company',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
