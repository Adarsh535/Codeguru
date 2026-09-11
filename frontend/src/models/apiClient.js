/**
 * ==========================================
 * MODEL LAYER: FRONTEND API CLIENT (apiClient.js)
 * ==========================================
 * Centralized API client base URL and HTTP request helpers for Frontend app.
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper for executing HTTP requests to Express REST API Backend
 * @param {string} endpoint - Relative path (e.g. '/banners')
 * @param {object} options - Fetch configuration options
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  return response;
}
