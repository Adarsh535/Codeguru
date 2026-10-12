/**
 * ============================================================================
 * FRONTEND VISITOR TRACKER (frontend/src/utils/visitorTracker.js)
 * ============================================================================
 * Privacy-conscious client-side tracking service for CodeGuru website.
 * Manages anonymous first-party visitor IDs, session tracking, device detection,
 * route change logging, and real-time live presence heartbeats.
 */

import { getApiBase } from '../models/apiClient';

const VISITOR_COOKIE_KEY = 'cg_vid';
const SESSION_STORAGE_KEY = 'cg_sid';
const LAST_TRACK_KEY = 'cg_last_track';

/**
 * Cookie Helpers for first-party persistence
 */
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

function setCookie(name, val, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(val)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Get or create first-party anonymous visitor ID.
 * Stored in both localStorage and a 1-year first-party cookie for persistence.
 */
export function getOrCreateVisitorId() {
  if (typeof window === 'undefined') return null;

  try {
    let vid = localStorage.getItem(VISITOR_COOKIE_KEY) || getCookie(VISITOR_COOKIE_KEY);
    if (!vid) {
      const randPart = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
      vid = `cg_v_${Date.now().toString(36)}_${randPart}`;
      localStorage.setItem(VISITOR_COOKIE_KEY, vid);
      setCookie(VISITOR_COOKIE_KEY, vid, 365);
    } else {
      // Sync both storages
      setCookie(VISITOR_COOKIE_KEY, vid, 365);
      localStorage.setItem(VISITOR_COOKIE_KEY, vid);
    }
    return vid;
  } catch {
    return `cg_v_${Date.now()}`;
  }
}

/**
 * Get or create a 30-minute session identifier
 */
export function getOrCreateSessionId() {
  if (typeof window === 'undefined') return null;

  try {
    let sid = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sid) {
      sid = `cg_s_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem(SESSION_STORAGE_KEY, sid);
    }
    return sid;
  } catch {
    return `cg_s_${Date.now()}`;
  }
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

// In-memory deduplication tracking (per-instance)
let lastTrackedPath = '';
let lastTrackedTime = 0;

/**
 * Send page view tracking event to backend API
 * @param {string} pathname - current route path (e.g. '/', '/courses')
 */
export async function trackPageView(pathname = '/') {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const cleanPath = pathname || window.location.pathname || '/';

  // React Strict Mode & Rapid Navigation Deduplication:
  // Prevent duplicate events within 2.5 seconds for the exact same path
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
    const title = document.title || 'CodeGuru';
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
      isHeartbeat: false
    };

    const apiUrl = `${getApiBase()}/analytics/track`;

    // Non-blocking fetch with keepalive to guarantee delivery on navigation
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {
      // Graceful silence on network failure
    });
  } catch (err) {
    // Fail silently so website navigation is NEVER blocked
  }
}

/**
 * Send lightweight live presence heartbeat
 */
export async function sendHeartbeat(pathname = '/') {
  if (typeof window === 'undefined' || document.visibilityState === 'hidden') return;

  try {
    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const device = detectDevice();

    const payload = {
      visitorId,
      sessionId,
      path: pathname || window.location.pathname || '/',
      device,
      isHeartbeat: true
    };

    const apiUrl = `${getApiBase()}/analytics/track`;

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  } catch {}
}
