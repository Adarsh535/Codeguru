/**
 * ==========================================
 * MODEL LAYER: FRONTEND API CLIENT (apiClient.js)
 * ==========================================
 * Centralized API client base URL and HTTP request helpers for Frontend app.
 */

export function getApiBase() {
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return `http://${window.location.hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
}

export const API_BASE = getApiBase();

/**
 * Helper for executing HTTP requests to Express REST API Backend
 * @param {string} endpoint - Relative path (e.g. '/banners')
 * @param {object} options - Fetch configuration options
 */
export async function apiFetch(endpoint, options = {}) {
  const base = getApiBase();
  const url = `${base}${endpoint}`;
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
