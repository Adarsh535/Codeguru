/**
 * CONTEXT: Admin Authentication Provider
 * Manages admin login/logout state and session persistence.
 */
import React, { createContext, useContext, useState } from 'react';
import { authModel } from '../models/authModel';

const AuthContext = createContext(null);
const AUTH_KEY = 'codeguru_admin_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  /**
   * API Handler: Admin Login
   * @route POST http://localhost:5000/api/auth/login
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    const data = await authModel.login(email, password);

    if (data.success) {
      const userData = {
        name: data.user?.name || 'Super Admin',
        email: data.user?.email || email,
        role: data.user?.role || 'Master Admin',
        token: data.token,
        loggedAt: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: data.message || 'Invalid Admin Credentials' };
  };

  const isSessionValid = () => {
    if (!user) return false;
    if (!user.email || !user.loggedAt) return false;
    try {
      const loggedTime = new Date(user.loggedAt).getTime();
      if (isNaN(loggedTime)) return false;
      const ageMs = Date.now() - loggedTime;
      const MAX_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 Hours Session Lock
      return ageMs < MAX_SESSION_DURATION;
    } catch {
      return false;
    }
  };

  const updateUser = (newUserData) => {
    setUser(prev => {
      const updated = { ...(prev || {}), ...newUserData };
      localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user, isSessionValid }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
