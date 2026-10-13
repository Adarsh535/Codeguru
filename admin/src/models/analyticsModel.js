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

export function getAdminAuthToken() {
  try {
    const raw = sessionStorage.getItem('codeguru_admin_session');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.token || null;
    }
  } catch (e) {}
  return null;
}

export function getAdminEmail() {
  try {
    const raw = sessionStorage.getItem('codeguru_admin_session');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.email || null;
    }
  } catch (e) {}
  return null;
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
        headers: getAdminAuthHeaders(),
        cache: 'no-store'
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
        headers: getAdminAuthHeaders(),
        cache: 'no-store'
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
        headers: getAdminAuthHeaders(),
        cache: 'no-store'
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
        headers: getAdminAuthHeaders(),
        cache: 'no-store'
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
        headers: getAdminAuthHeaders(),
        cache: 'no-store'
      });
      const json = await res.json();
      return json.data || null;
    } catch (err) {
      console.warn('[analyticsModel getInsights Error]:', err);
      return null;
    }
  },

  /**
   * Connect to real-time Server-Sent Events (SSE) stream with auto-reconnect
   * @param {Function} onMessage - callback receiving latest analytics snapshot
   * @param {Function} onStatusChange - callback receiving connection status boolean
   * @returns {Function} unsubscribe function
   */
  subscribeStream: (onMessage, onStatusChange) => {
    if (typeof window === 'undefined') return () => {};

    const token = getAdminAuthToken();
    const email = getAdminEmail();
    let streamUrl = `${API_BASE}/analytics/stream`;
    const params = new URLSearchParams();
    if (token) params.set('token', token);
    if (email) params.set('adminEmail', email);

    if (params.toString()) {
      streamUrl += `?${params.toString()}`;
    }

    let eventSource = null;
    let isSubscribed = true;
    let reconnectTimer = null;

    const connect = () => {
      if (!isSubscribed) return;

      try {
        eventSource = new EventSource(streamUrl);

        eventSource.onopen = () => {
          if (isSubscribed && onStatusChange) {
            onStatusChange(true);
          }
        };

        eventSource.onmessage = (event) => {
          if (!isSubscribed) return;
          try {
            const parsed = JSON.parse(event.data);
            if (parsed && parsed.data && onMessage) {
              onMessage(parsed.data);
            }
          } catch (e) {}
        };

        eventSource.onerror = () => {
          if (isSubscribed && onStatusChange) {
            onStatusChange(false);
          }
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Retry connection after 4 seconds
          if (isSubscribed && !reconnectTimer) {
            reconnectTimer = setTimeout(() => {
              reconnectTimer = null;
              connect();
            }, 4000);
          }
        };
      } catch (err) {
        if (isSubscribed && onStatusChange) {
          onStatusChange(false);
        }
        if (isSubscribed && !reconnectTimer) {
          reconnectTimer = setTimeout(() => {
            reconnectTimer = null;
            connect();
          }, 4000);
        }
      }
    };

    connect();

    return () => {
      isSubscribed = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      if (onStatusChange) onStatusChange(false);
    };
  }
};
