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
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
  }
  // Production live backend API URL
  return 'https://369.codegurru.in/api';
}

export const API_BASE = getApiBase();

/**
 * Retrieves student/user authentication JWT token from localStorage
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
 * Helper for executing HTTP requests to Express REST API Backend
 * Automatically injects JWT Bearer Authorization header if student is authenticated.
 * @param {string} endpoint - Relative path (e.g. '/banners')
 * @param {object} options - Fetch configuration options
 */
export async function apiFetch(endpoint, options = {}) {
  const base = getApiBase();
  const url = `${base}${endpoint}`;
  const token = getAuthToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
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
