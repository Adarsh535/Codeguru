/**
 * CONTEXT: Admin Authentication Provider
 * Manages admin login/logout state and session persistence.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authModel } from '../models/authModel';
import { logoutAdminSession } from '../models/apiClient';
import { realtimeAdminService } from '../services/realtimeAdminService';

const AuthContext = createContext(null);
const AUTH_KEY = 'codeguru_admin_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      // Clear any legacy persistent session from localStorage
      localStorage.removeItem(AUTH_KEY);
      const saved = sessionStorage.getItem(AUTH_KEY);
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
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(userData));
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
      // Match the backend admin JWT lifetime (8h) so the UI doesn't look
      // logged-in after the token has already expired.
      const MAX_SESSION_DURATION = 8 * 60 * 60 * 1000;
      return ageMs < MAX_SESSION_DURATION;
    } catch {
      return false;
    }
  };

  const updateUser = (newUserData) => {
    setUser(prev => {
      const updated = { ...(prev || {}), ...newUserData };
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const logout = async () => {
    // Revoke the session on the server (clears HttpOnly cookie + bumps tokenVersion)
    // so the admin cookie can't be reused after logout.
    try {
      await logoutAdminSession();
    } catch {
      /* even if the network call fails, still clear local state below */
    }
    setUser(null);
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
  };

  // If any API call detects an invalid/expired session (401), drop the user state
  // so the UI stops showing a logged-in dashboard and polling endlessly.
  useEffect(() => {
    const onForcedLogout = () => {
      setUser(null);
      realtimeAdminService.destroy();
      try {
        sessionStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(AUTH_KEY);
      } catch { /* ignore */ }
    };
    window.addEventListener('admin_logout_event', onForcedLogout);
    return () => window.removeEventListener('admin_logout_event', onForcedLogout);
  }, []);

  // Sync realtime SSE service with active admin session
  useEffect(() => {
    if (user && user.token && isSessionValid()) {
      realtimeAdminService.start();
    } else {
      realtimeAdminService.destroy();
    }
  }, [user]);

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
