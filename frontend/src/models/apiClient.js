/**
 * ==========================================
 * MODEL LAYER: FRONTEND API CLIENT (apiClient.js)
 * ==========================================
 * Centralized API client base URL and HTTP request helpers for Frontend app.
 * Configured with credentials: 'include' for HttpOnly cookies and Bearer fallback.
 */

export function getApiBase() {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
  }
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  return 'https://369.codegurru.in/api';
}

export const API_BASE = getApiBase();

// In-memory token reference to prevent token leakage in localStorage
let inMemoryToken = null;

/**
 * Retrieves student authentication JWT token (in-memory; cookies handle transport)
 */
export function getAuthToken() {
  return inMemoryToken;
}

/**
 * Saves student authentication JWT token in memory and ensures localStorage remains clean
 */
export function setAuthToken(token) {
  inMemoryToken = token || null;
  if (typeof window !== 'undefined') {
    try {
      // Tokens must NEVER be stored in localStorage; cookies (httpOnly + Secure) handle session
      localStorage.removeItem('codeguru_token');
      localStorage.removeItem('token');
      localStorage.removeItem('cg_token');
    } catch (e) {}
  }
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
 * Client logout helper that clears session both on backend and client storage
 */
export async function logoutClient() {
  try {
    const base = getApiBase();
    await fetch(`${base}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (e) {}

  if (typeof window !== 'undefined') {
    localStorage.removeItem('codeguru_token');
    localStorage.removeItem('token');
    localStorage.removeItem('codeguru_user');
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('codeguru_user_updated'));
  }
}

export function getCsrfCookie() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )cg_csrf=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Helper for executing HTTP requests to Express REST API Backend
 * @param {string} endpoint - Relative path (e.g. '/banners')
 * @param {object} options - Fetch configuration options
 */
export async function apiFetch(endpoint, options = {}) {
  const base = getApiBase();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${base}${cleanEndpoint}`;
  const token = getAuthToken();
  const csrf = getCsrfCookie();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(csrf ? { 'x-csrf-token': csrf } : {})
  };

  const config = {
    credentials: 'include',
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(url, config);

  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/student/login')) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('codeguru_token');
      localStorage.removeItem('token');
      localStorage.removeItem('codeguru_user');
      window.dispatchEvent(new CustomEvent('codeguru_user_updated'));
    }
  }

  return response;
}
