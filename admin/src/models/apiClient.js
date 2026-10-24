/**
 * ==========================================
 * MODEL LAYER: API CLIENT CONFIGURATION (admin)
 * ==========================================
 * Centralized API client base URL and HTTP request helpers.
 * Configured with credentials: 'include' for HttpOnly cookies and Bearer auth.
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://369.codegurru.in/api');

/**
 * Retrieves logged in Master Admin session credentials
 */
export function getAdminAuth() {
  try {
    if (typeof window !== 'undefined') {
      // Strictly read from ephemeral sessionStorage; purge from localStorage to prevent XSS theft
      localStorage.removeItem('codeguru_admin_session');
      const raw = sessionStorage.getItem('codeguru_admin_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          token: parsed.token || '',
          email: parsed.email || '',
          user: parsed.user || null
        };
      }
    }
  } catch (e) {}
  return { token: '', email: '', user: null };
}

/**
 * Admin logout helper: Clears server-side HttpOnly cookies and client storage
 */
export async function logoutAdminSession() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (e) {}

  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('codeguru_admin_session');
    localStorage.removeItem('codeguru_admin_session');
    window.dispatchEvent(new CustomEvent('admin_logout_event'));
  }
}

export function buildApiUrl(endpoint) {
  if (!endpoint) return API_BASE;
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const cleanBase = API_BASE.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${cleanBase}${cleanEndpoint}`;
}

/**
 * Common helper for executing HTTP requests to Express REST API
 * Automatically injects Master Admin Token header and credentials: 'include'.
 * Intercepts 401 Unauthorized to invalidate stale sessions (A8).
 * @param {string} endpoint - Relative path (e.g. '/banners') or absolute URL
 * @param {object} options - Fetch configuration options
 */
export function getCsrfCookie() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )cg_csrf=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function apiFetch(endpoint, options = {}) {
  const url = buildApiUrl(endpoint);
  const auth = getAdminAuth();
  const csrf = getCsrfCookie();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(auth.token ? {
      'Authorization': `Bearer ${auth.token}`,
      'x-admin-token': auth.token
    } : {}),
    ...(auth.email ? {
      'x-admin-email': auth.email
    } : {}),
    ...(csrf ? {
      'x-csrf-token': csrf
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

  // Global 401 handler: on session expiry or invalid token, terminate session
  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('codeguru_admin_session');
      localStorage.removeItem('codeguru_admin_session');
      window.dispatchEvent(new CustomEvent('admin_logout_event'));
    }
  }

  return response;
}

/**
 * Fetch a one-time realtime SSE connection ticket (valid 60s)
 */
export async function getRealtimeTicket() {
  try {
    const res = await apiFetch('/realtime/ticket', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      return data.ticket || null;
    }
  } catch (err) {
    console.error('Failed to get realtime ticket:', err);
  }
  return null;
}
