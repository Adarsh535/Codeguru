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
  }
};
