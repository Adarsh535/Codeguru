/**
 * ==========================================
 * MODEL LAYER: FRONTEND API CLIENT (apiClient.js)
 * ==========================================
 * Centralized API client base URL, Secret API Key, and HTTP request helpers for Frontend app.
 * Configured with credentials: 'include' for HttpOnly cookies and Bearer fallback.
 */

export function getApiBase() {
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
  }
  // Production live backend API URL
  return 'https://369.codegurru.in/api';
}

export function getApiKey() {
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_SECRET_KEY) {
    return process.env.NEXT_PUBLIC_API_SECRET_KEY;
  }
  return 'cg_app_secret_369_2026';
}

export const API_BASE = getApiBase();
export const API_KEY = getApiKey();

/**
 * Retrieves student/user authentication JWT token from localStorage (fallback)
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  try {
    const directToken = localStorage.getItem('codeguru_token') || localStorage.getItem('token');
    if (directToken) return directToken;
    const userRaw = localStorage.getItem('codeguru_user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      return user?.token || null;
    }
  } catch (e) {
    return null;
  }
  return null;
}

/**
 * Saves student/user authentication JWT token to localStorage
 */
export function setAuthToken(token) {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      localStorage.setItem('codeguru_token', token);
    } else {
      localStorage.removeItem('codeguru_token');
      localStorage.removeItem('token');
    }
  } catch (e) {}
}

/**
 * Retrieves current logged-in student user object
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    const userRaw = localStorage.getItem('codeguru_user');
    return userRaw ? JSON.parse(userRaw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Client logout helper that clears session both on backend (HttpOnly cookies) and client storage
 */
export async function logoutClient() {
  try {
    const base = getApiBase();
    await fetch(`${base}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'x-api-key': getApiKey()
      }
    });
  } catch (e) {}

  if (typeof window !== 'undefined') {
    localStorage.removeItem('codeguru_token');
    localStorage.removeItem('token');
    localStorage.removeItem('codeguru_user');
    window.dispatchEvent(new Event('codeguru_user_updated'));
  }
}

/**
 * Helper for executing HTTP requests to Express REST API Backend
 * Automatically injects API Secret Key, JWT Bearer Authorization, and credentials: 'include'.
 * @param {string} endpoint - Relative path (e.g. '/banners')
 * @param {object} options - Fetch configuration options
 */
export async function apiFetch(endpoint, options = {}) {
  const base = getApiBase();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${base}${cleanEndpoint}`;
  const token = getAuthToken();
  const apiKey = getApiKey();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const config = {
    credentials: 'include',
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  return response;
}

// Global browser fetch interceptor: ensures all outgoing requests to backend include x-api-key & credentials
if (typeof window !== 'undefined' && !window.__codeguru_fetch_shield_installed) {
  window.__codeguru_fetch_shield_installed = true;
  const originalFetch = window.fetch;
  window.fetch = async function (resource, init = {}) {
    try {
      const urlStr = typeof resource === 'string' ? resource : (resource?.url || '');
      const isBackendUrl =
        urlStr.includes('/api') ||
        urlStr.includes('369.codegurru.in') ||
        urlStr.includes('localhost:5000');

      if (isBackendUrl) {
        const apiKey = getApiKey();
        const customHeaders = new Headers(
          init?.headers || (typeof resource !== 'string' && resource?.headers ? resource.headers : {})
        );
        if (!customHeaders.has('x-api-key')) {
          customHeaders.set('x-api-key', apiKey);
        }
        const studentToken = getAuthToken();
        if (studentToken && !customHeaders.has('authorization')) {
          customHeaders.set('authorization', `Bearer ${studentToken}`);
        }
        return originalFetch(resource, {
          credentials: 'include',
          ...init,
          headers: customHeaders
        });
      }
    } catch (e) {
      // Fallback silently
    }
    return originalFetch(resource, init);
  };
}
