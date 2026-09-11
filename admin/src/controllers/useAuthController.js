/**
 * ============================================================================
 * CONTROLLER LAYER: AUTHENTICATION CONTROLLER (useAuthController.js)
 * ============================================================================
 * Custom hook handling login, session state persistence, and logout flow.
 */

import { useState } from 'react';
import { authModel } from '../models/authModel';

const AUTH_KEY = 'codeguru_admin_session';

export function useAuthController() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isSessionValid
  };
}
