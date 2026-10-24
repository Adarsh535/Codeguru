/**
 * ============================================================================
 * MODEL LAYER: AUTHENTICATION DATA MODEL & API SERVICE (authModel.js)
 * ============================================================================
 * Handles Admin authentication API requests and session verification.
 */

import { API_BASE, apiFetch } from './apiClient';

export const authModel = {
  /**
   * Admin Login Authentication
   * @route   POST /api/auth/login
   * @returns {Promise<Object>} { success: boolean, user?: Object, token?: string, message?: string }
   */
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('[authModel API Error] Login failed:', err);
      return { success: false, message: 'Unable to connect to authentication server. Please verify your connection.' };
    }
  },

  /**
   * Update Admin Credentials (Email & Password)
   * @route   POST /api/auth/update-credentials
   */
  updateCredentials: async (currentPassword, newEmail, newPassword) => {
    try {
      const res = await apiFetch('/auth/update-credentials', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newEmail,
          newPassword: newPassword || undefined
        })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('[authModel API Error] Failed to update credentials:', err);
      return { success: false, message: err.message || 'Server error updating credentials' };
    }
  }
};
