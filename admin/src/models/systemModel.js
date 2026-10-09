/**
 * ============================================================================
 * MODEL LAYER: SYSTEM DIAGNOSTICS DATA MODEL & API SERVICE (systemModel.js)
 * ============================================================================
 * Manages Server Health Checks, MongoDB Database status, and Audit Diagnostics.
 */

import { API_BASE } from './apiClient';

export const systemModel = {
  /**
   * --------------------------------------------------------------------------
   * API: System Health Check
   * --------------------------------------------------------------------------
   * @route   GET http://localhost:5000/api/health
   * @desc    Backend Express server aur MongoDB Compass database connection verify karta hai.
   * @access  Public / System Diagnostic
   * @returns {Promise<Object>} { success: boolean, message: string, timestamp: string }
   */
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('[systemModel API Warning] Health check request failed:', err);
      return { success: false, message: 'Server offline or unreachable' };
    }
  },

  getSettings: async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('[systemModel API Warning] Fetch settings failed:', err);
      return { success: false, data: { adminPhone: '9670912923', whatsappNotificationEnabled: true } };
    }
  },

  updateSettings: async (settingsData) => {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData)
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('[systemModel API Warning] Update settings failed:', err);
      return { success: false, message: 'Failed to update settings on server' };
    }
  },

  switchDatabase: async (targetMode) => {
    try {
      const res = await fetch(`${API_BASE}/health/switch-db`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: targetMode })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('[systemModel API Warning] Switch database failed:', err);
      return { success: false, message: 'Failed to connect to backend server' };
    }
  }
};
