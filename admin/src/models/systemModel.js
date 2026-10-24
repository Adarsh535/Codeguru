/**
 * ============================================================================
 * MODEL LAYER: SYSTEM DIAGNOSTICS DATA MODEL & API SERVICE (systemModel.js)
 * ============================================================================
 * Handles Server Health Checks and System Settings management.
 */

import { API_BASE, apiFetch } from './apiClient';

export const systemModel = {
  /**
   * System Health Check
   * @route GET /api/health
   */
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      const data = await res.json();
      return {
        success: res.ok,
        connected: data.db === 'up',
        status: data.status,
        uptime: data.uptime
      };
    } catch (err) {
      return { success: false, connected: false, message: 'Server offline' };
    }
  },

  getSettings: async () => {
    try {
      const res = await apiFetch('/settings');
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      return { success: false, data: {} };
    } catch (err) {
      return { success: false, data: {} };
    }
  },

  updateSettings: async (settingsData) => {
    try {
      const res = await apiFetch('/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsData)
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, message: 'Failed to update settings' };
    }
  }
};
