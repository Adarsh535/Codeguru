/**
 * ==========================================
 * MODEL LAYER: API CLIENT CONFIGURATION (admin)
 * ==========================================
 * Centralized API client base URL, Secret API Key, and HTTP request helpers.
 * Configured with credentials: 'include' for HttpOnly cookies and Bearer fallback.
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://369.codegurru.in/api';
export const API_SECRET_KEY = import.meta.env.VITE_API_SECRET_KEY || 'cg_app_secret_369_2026';

/**
 * Retrieves logged in Master Admin session credentials
 */
export function getAdminAuth() {
  try {
    const raw = sessionStorage.getItem('codeguru_admin_session') || localStorage.getItem('codeguru_admin_session');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        token: parsed.token || '',
        email: parsed.email || ''
      };
    }
  } catch (e) {}
  return { token: '', email: '' };
}

/**
 * Admin logout helper: Clears server-side HttpOnly cookies and client storage
 */
export async function logoutAdminSession() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'x-api-key': API_SECRET_KEY
      }
    });
  } catch (e) {}

  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('codeguru_admin_session');
    localStorage.removeItem('codeguru_admin_session');
  }
}

/**
 * Common helper for executing HTTP requests to Express REST API
 * Automatically injects Secret API Key, Master Admin Token headers, and credentials: 'include'.
 * @param {string} endpoint - Relative path (e.g. '/banners')
 * @param {object} options - Fetch configuration options
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const auth = getAdminAuth();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': API_SECRET_KEY,
    ...(auth.token ? {
      'Authorization': `Bearer ${auth.token}`,
      'x-admin-token': auth.token,
      'x-admin-email': auth.email
    } : {})
  };

  const config = {
    credentials: 'include',
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

// Global browser fetch interceptor: ensures all outgoing requests to backend include x-api-key, Admin Auth & credentials
if (typeof window !== 'undefined' && !window.__codeguru_admin_shield_installed) {
  window.__codeguru_admin_shield_installed = true;
  const originalFetch = window.fetch;
  window.fetch = async function (resource, init = {}) {
    try {
      const urlStr = typeof resource === 'string' ? resource : (resource?.url || '');
      const isBackendUrl =
        urlStr.includes('/api') ||
        urlStr.includes('369.codegurru.in') ||
        urlStr.includes('localhost:5000');

      if (isBackendUrl) {
        const customHeaders = new Headers(
          init?.headers || (typeof resource !== 'string' && resource?.headers ? resource.headers : {})
        );

        if (!customHeaders.has('x-api-key')) {
          customHeaders.set('x-api-key', API_SECRET_KEY);
        }

        const auth = getAdminAuth();
        if (auth.token) {
          if (!customHeaders.has('authorization')) {
            customHeaders.set('authorization', `Bearer ${auth.token}`);
          }
          if (!customHeaders.has('x-admin-token')) {
            customHeaders.set('x-admin-token', auth.token);
          }
          if (auth.email && !customHeaders.has('x-admin-email')) {
            customHeaders.set('x-admin-email', auth.email);
          }
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
