/**
 * ============================================================================
 * MODEL LAYER: WEBSITE ANALYTICS MODEL (analyticsModel.js)
 * ============================================================================
 * Handles REST API communication between Admin Dashboard and Analytics Backend.
 * Automatically injects Master Admin authorization token into request headers.
 */

import { API_BASE } from './apiClient';

/**
 * Retrieve current active admin authentication token from sessionStorage
 */
function getAdminAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const raw = sessionStorage.getItem('codeguru_admin_session');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) {
        headers['Authorization'] = `Bearer ${parsed.token}`;
      }
      if (parsed?.email) {
        headers['x-admin-email'] = parsed.email;
      }
    }
  } catch (e) {
    // ignore
  }
  return headers;
}

export const analyticsModel = {
  /**
   * Fetch executive summary cards data
   * @returns {Promise<Object>}
   */
  getSummary: async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics/summary`, {
        method: 'GET',
        headers: getAdminAuthHeaders()
      });
      const json = await res.json();
      return json.data || null;
    } catch (err) {
      console.warn('[analyticsModel getSummary Error]:', err);
      return null;
    }
  },

  /**
   * Fetch daily timeline datapoints for chart
   * @param {Object} params - { range, startDate, endDate, grouping }
   * @returns {Promise<Object>}
   */
  getDailyData: async ({ range = '7d', startDate = '', endDate = '', grouping = 'daily' } = {}) => {
    try {
      const queryParams = new URLSearchParams({ range, grouping });
      if (startDate) queryParams.set('startDate', startDate);
      if (endDate) queryParams.set('endDate', endDate);

      const res = await fetch(`${API_BASE}/analytics/daily?${queryParams.toString()}`, {
        method: 'GET',
        headers: getAdminAuthHeaders()
      });
      const json = await res.json();
      return json.data || null;
    } catch (err) {
      console.warn('[analyticsModel getDailyData Error]:', err);
      return null;
    }
  },

  /**
   * Fetch most visited top pages report
   * @param {Object} params - { range, startDate, endDate, limit }
   * @returns {Promise<Object>}
   */
  getTopPages: async ({ range = '7d', startDate = '', endDate = '', limit = 10 } = {}) => {
    try {
      const queryParams = new URLSearchParams({ range, limit: String(limit) });
      if (startDate) queryParams.set('startDate', startDate);
      if (endDate) queryParams.set('endDate', endDate);

      const res = await fetch(`${API_BASE}/analytics/top-pages?${queryParams.toString()}`, {
        method: 'GET',
        headers: getAdminAuthHeaders()
      });
      const json = await res.json();
      return json.data || null;
    } catch (err) {
      console.warn('[analyticsModel getTopPages Error]:', err);
      return null;
    }
  },

  /**
   * Fetch live visitor sessions
   * @returns {Promise<Object>}
   */
  getRealtime: async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics/realtime`, {
        method: 'GET',
        headers: getAdminAuthHeaders()
      });
      const json = await res.json();
      return json.data || null;
    } catch (err) {
      console.warn('[analyticsModel getRealtime Error]:', err);
      return null;
    }
  },

  /**
   * Fetch device, source, and weekly visitor insights
   * @param {string} range - '7d' | '30d'
   * @returns {Promise<Object>}
   */
  getInsights: async (range = '30d') => {
    try {
      const res = await fetch(`${API_BASE}/analytics/insights?range=${range}`, {
        method: 'GET',
        headers: getAdminAuthHeaders()
      });
      const json = await res.json();
      return json.data || null;
    } catch (err) {
      console.warn('[analyticsModel getInsights Error]:', err);
      return null;
    }
  }
};
