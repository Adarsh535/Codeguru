/**
 * ============================================================================
 * ADMIN REALTIME SYNC SERVICE (realtimeAdminService.js)
 * ============================================================================
 * Hardened realtime sync service:
 * - Uses one-time tickets for SSE connection (no tokens in URL)
 * - Lifecycle tied strictly to admin authentication
 * - Efficient fallback (60s instead of 3s flooding)
 */

import { API_BASE, getAdminAuth, getRealtimeTicket } from '../models/apiClient';

const STREAM_URL = `${API_BASE}/realtime/stream`;

class RealtimeAdminManager {
  constructor() {
    this.eventSource = null;
    this.broadcastChannel = null;
    this.isConnected = false;
    this.retryTimeout = null;
    this.pollingInterval = null;
    this.retryCount = 0;
    this.listeners = new Set();
    this.isStarted = false;
  }

  start() {
    if (typeof window === 'undefined') return;
    const auth = getAdminAuth();
    if (!auth.token) return; // Do not connect without authenticated session

    if (this.isStarted) return;
    this.isStarted = true;

    // 1. Cross-tab sync via BroadcastChannel
    if ('BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('codeguru_admin_channel');
        this.broadcastChannel.onmessage = (event) => {
          this.handleEvent(event.data, false);
        };
      } catch (err) {}
    }

    // 2. Connect SSE with ticket
    this.connectSSE();

    // 3. Fallback revalidation (60s gentle interval instead of 3s flooding)
    if (!this.pollingInterval) {
      this.pollingInterval = setInterval(() => {
        if (typeof document !== 'undefined' && !document.hidden && this.isStarted) {
          this.notify('all', { source: 'polling_heartbeat' });
        }
      }, 60000);
    }

    // 4. Focus & visibility change revalidation
    this.onFocus = () => {
      if (this.isStarted) this.notify('all', { source: 'window_focus' });
    };
    window.addEventListener('focus', this.onFocus);
  }

  async connectSSE() {
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') return;
    if (!this.isStarted) return;

    if (this.eventSource) {
      try { this.eventSource.close(); } catch {}
      this.eventSource = null;
    }

    try {
      const ticket = await getRealtimeTicket();
      if (!ticket) {
        // Retry after delay
        this.scheduleRetry();
        return;
      }

      const urlWithTicket = `${STREAM_URL}?ticket=${encodeURIComponent(ticket)}`;
      this.eventSource = new EventSource(urlWithTicket);

      this.eventSource.onopen = () => {
        this.isConnected = true;
        this.retryCount = 0;
        this.emitStatusChange(true);
        this.notify('all', { source: 'sse_connect' });
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleEvent(data, true);
        } catch (err) {}
      };

      this.eventSource.onerror = () => {
        this.isConnected = false;
        this.emitStatusChange(false);
        try { this.eventSource?.close(); } catch {}
        this.eventSource = null;
        this.scheduleRetry();
      };
    } catch (err) {
      this.scheduleRetry();
    }
  }

  scheduleRetry() {
    if (!this.isStarted) return;
    const delay = Math.min(2000 * Math.pow(1.5, this.retryCount), 30000);
    this.retryCount++;
    clearTimeout(this.retryTimeout);
    this.retryTimeout = setTimeout(() => {
      this.connectSSE();
    }, delay);
  }

  handleEvent(eventData, isLocal = true) {
    if (!eventData) return;
    const type = eventData.type || 'all';
    this.notify(type, eventData);

    if (isLocal && this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(eventData);
      } catch {}
    }
  }

  subscribe(eventType, callback) {
    const listener = { eventType, callback };
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(eventType, data) {
    window.dispatchEvent(new CustomEvent('codeguru_realtime_event', { detail: { type: eventType, data } }));
    for (const listener of this.listeners) {
      if (listener.eventType === 'all' || listener.eventType === eventType) {
        try { listener.callback(data); } catch {}
      }
    }
  }

  emitStatusChange(status) {
    window.dispatchEvent(new CustomEvent('codeguru_sync_status', { detail: { connected: status } }));
  }

  destroy() {
    this.isStarted = false;
    if (this.eventSource) {
      try { this.eventSource.close(); } catch {}
      this.eventSource = null;
    }
    if (this.broadcastChannel) {
      try { this.broadcastChannel.close(); } catch {}
      this.broadcastChannel = null;
    }
    if (this.onFocus) {
      window.removeEventListener('focus', this.onFocus);
    }
    clearInterval(this.pollingInterval);
    clearTimeout(this.retryTimeout);
    this.pollingInterval = null;
    this.isConnected = false;
  }
}

export const realtimeAdminService = new RealtimeAdminManager();

// Listen to admin logout event to cleanly destroy realtime connection
if (typeof window !== 'undefined') {
  window.addEventListener('admin_logout_event', () => {
    realtimeAdminService.destroy();
  });
}
