/**
 * ==========================================
 * MODEL LAYER: API CLIENT CONFIGURATION
 * ==========================================
 * Centralized API client base URL and HTTP request helpers.
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Common helper for executing HTTP requests to Express REST API
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

  // If sending FormData (file upload), delete Content-Type so browser sets boundary
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(url, config);
  return response;
}
