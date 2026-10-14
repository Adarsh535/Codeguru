/**
 * ============================================================================
 * FRONTEND VISITOR TRACKER (frontend/src/utils/visitorTracker.js)
 * ============================================================================
 * Privacy-conscious client-side tracking service for CodeGurru website.
 * Manages stable UUID visitor IDs with localStorage & cookie fallback, tab session IDs,
 * automatic route change logging, active presence heartbeats, and unload beacon leave events.
 */

import { getApiBase } from '../models/apiClient';

const VISITOR_STORAGE_KEY = 'cg_vid';
const SESSION_STORAGE_KEY = 'cg_sid';

/**
 * Generate standard RFC4122 version 4 UUID
 */
export function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // Fallback below
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Cookie Helpers for first-party persistence fallback
 */
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

function setCookie(name, val, days = 365) {
  if (typeof document === 'undefined') return;
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(val)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch (e) {}
}

/**
 * Get or create stable anonymous visitor ID (UUID).
 * Stored in localStorage (with try/catch) and backed up in 1-year first-party cookie.
 */
export function getOrCreateVisitorId() {
  if (typeof window === 'undefined') return null;

  let vid = null;
  try {
    vid = localStorage.getItem(VISITOR_STORAGE_KEY);
  } catch (e) {}

  if (!vid) {
    vid = getCookie(VISITOR_STORAGE_KEY);
  }

  // If no ID exists, generate a clean UUID v4
  if (!vid) {
    vid = generateUUID();
  }

  // Persist to both localStorage and cookie
  try {
    localStorage.setItem(VISITOR_STORAGE_KEY, vid);
  } catch (e) {}
  setCookie(VISITOR_STORAGE_KEY, vid, 365);

  return vid;
}

/**
 * Get or create tab/session identifier (UUID).
 * Stored in sessionStorage per browser tab.
 */
export function getOrCreateSessionId() {
  if (typeof window === 'undefined') return null;

  try {
    let sid = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sid) {
      sid = generateUUID();
      sessionStorage.setItem(SESSION_STORAGE_KEY, sid);
    }
    return sid;
  } catch (e) {
    // If sessionStorage is restricted or disabled
    if (!window.__cg_fallback_sid) {
      window.__cg_fallback_sid = generateUUID();
    }
    return window.__cg_fallback_sid;
  }
}

/**
 * Bot and admin/dashboard page detector
 */
export function isBotOrExcludedPath(pathname = '') {
  if (typeof window === 'undefined') return true;

  // Bot detection
  if (navigator.webdriver) return true;
  const ua = navigator.userAgent || '';
  if (/bot|crawl|spider|slurp|facebookexternalhit|bingbot|googlebot|lighthouse|phantom/i.test(ua)) {
    return true;
  }

  // Admin or dashboard pages exclusion
  const clean = pathname || window.location.pathname || '/';
  if (clean.startsWith('/admin') || clean.startsWith('/dashboard')) {
    return true;
  }

  return false;
}

/**
 * Detect client device category
 */
export function detectDevice() {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  const width = window.innerWidth;

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua) || (width >= 768 && width <= 1024 && 'ontouchstart' in window)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua) || width < 768) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Detect client browser
 */
export function detectBrowser() {
  if (typeof window === 'undefined') return 'Other';
  const ua = navigator.userAgent;

  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('MSIE') || ua.includes('Trident/')) return 'Internet Explorer';
  return 'Other';
}

/**
 * Detect client OS
 */
export function detectOS() {
  if (typeof window === 'undefined') return 'Other';
  const ua = navigator.userAgent;

  if (/Windows NT/i.test(ua)) return 'Windows';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Other';
}

// In-memory deduplication tracking
let lastTrackedPath = '';
let lastTrackedTime = 0;

/**
 * Send page view tracking event to backend API
 * @param {string} pathname - current route path (e.g. '/', '/courses')
 */
export async function trackPageView(pathname = '/') {
  if (typeof window === 'undefined') return;

  const cleanPath = pathname || window.location.pathname || '/';

  // Do not count bots or admin visits
  if (isBotOrExcludedPath(cleanPath)) return;

  const now = Date.now();
  // Prevent duplicate events within 2.5 seconds for the exact same path (React StrictMode protection)
  if (lastTrackedPath === cleanPath && (now - lastTrackedTime < 2500)) {
    return;
  }

  lastTrackedPath = cleanPath;
  lastTrackedTime = now;

  try {
    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const device = detectDevice();
    const browser = detectBrowser();
    const os = detectOS();
    const referrer = document.referrer ? (document.referrer.includes(window.location.host) ? 'Direct' : document.referrer) : 'Direct';
    const title = document.title || 'CodeGurru';
    const url = window.location.href;

    const payload = {
      visitorId,
      sessionId,
      path: cleanPath,
      url,
      title,
      referrer,
      device,
      browser,
      os,
      isBot: false,
      isHeartbeat: false
    };

    const apiUrl = `${getApiBase()}/analytics/track`;

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
      keepalive: true
    }).catch(() => {});
  } catch (err) {
    // Fail silently so page navigation is never hindered
  }
}

/**
 * Send lightweight live presence heartbeat
 * @param {string} pathname
 */
export async function sendHeartbeat(pathname = '/') {
  if (typeof window === 'undefined' || document.visibilityState === 'hidden') return;

  const cleanPath = pathname || window.location.pathname || '/';
  if (isBotOrExcludedPath(cleanPath)) return;

  try {
    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const device = detectDevice();

    const payload = {
      visitorId,
      sessionId,
      path: cleanPath,
      device,
      isBot: false
    };

    const apiUrl = `${getApiBase()}/analytics/heartbeat`;

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
      keepalive: true
    }).catch(() => {});
  } catch (err) {}
}

/**
 * Send leave event when tab is closed via navigator.sendBeacon
 * @param {string} pathname
 */
export function sendLeaveEvent(pathname = '/') {
  if (typeof window === 'undefined') return;

  const cleanPath = pathname || window.location.pathname || '/';
  if (isBotOrExcludedPath(cleanPath)) return;

  try {
    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    if (!visitorId || !sessionId) return;

    const payload = JSON.stringify({
      visitorId,
      sessionId,
      path: cleanPath
    });

    const apiUrl = `${getApiBase()}/analytics/leave`;

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(apiUrl, blob);
    } else {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        cache: 'no-store',
        keepalive: true
      }).catch(() => {});
    }
  } catch (err) {}
}
