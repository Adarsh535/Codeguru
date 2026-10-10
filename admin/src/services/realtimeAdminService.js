/**
 * ============================================================================
 * ADMIN REALTIME SYNC SERVICE (realtimeAdminService.js)
 * ============================================================================
 * Establishes persistent Server-Sent Events (SSE) connection and cross-tab
 * channel so that all Admin views (Leads, Courses, Banners, Placements, Team,
 * Categories, Enrollments, Traffic) live-update instantly without manual refresh.
 */

import { API_BASE } from '../models/apiClient';

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
  }

  start() {
    if (typeof window === 'undefined') return;

    // 1. Cross-tab sync via BroadcastChannel
    if ('BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('codeguru_admin_channel');
        this.broadcastChannel.onmessage = (event) => {
          this.handleEvent(event.data, false);
        };
      } catch (err) {
        console.warn('[Admin Realtime] BroadcastChannel init warning:', err);
      }
    }

    // 2. Connect SSE
    this.connectSSE();

    // 3. Fallback smart polling (every 3 seconds)
    if (!this.pollingInterval) {
      this.pollingInterval = setInterval(() => {
        if (typeof document !== 'undefined' && !document.hidden) {
          this.notify('all', { source: 'polling_heartbeat' });
        }
      }, 3000);
    }

    // 4. Focus & visibility change revalidation
    window.addEventListener('focus', () => {
      this.notify('all', { source: 'window_focus' });
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.notify('all', { source: 'visibility_change' });
      }
    });

    // 5. Cross-tab storage fallback
    window.addEventListener('storage', (e) => {
      if (e.key === 'codeguru_admin_live_ping') {
        try {
          const parsed = JSON.parse(e.newValue || '{}');
          this.handleEvent(parsed, false);
        } catch {}
      }
    });
  }

  connectSSE() {
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') return;

    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch {}
    }

    try {
      this.eventSource = new EventSource(STREAM_URL);

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
        } catch (err) {
          console.warn('[Admin Realtime] Malformed SSE message:', event.data);
        }
      };

      this.eventSource.onerror = () => {
        this.isConnected = false;
        this.emitStatusChange(false);
        try {
          this.eventSource.close();
        } catch {}

        const delay = Math.min(1000 * Math.pow(2, this.retryCount), 6000);
        this.retryCount++;

        clearTimeout(this.retryTimeout);
        this.retryTimeout = setTimeout(() => {
          this.connectSSE();
        }, delay);
      };
    } catch (err) {
      console.warn('[Admin Realtime] EventSource connection failed:', err);
    }
  }

  handleEvent(payload, shouldBroadcast = true) {
    if (!payload || !payload.type) return;

    const eventType = payload.type;
    this.notify(eventType, payload.data);

    if (shouldBroadcast) {
      if (this.broadcastChannel) {
        try {
          this.broadcastChannel.postMessage(payload);
        } catch {}
      }
      try {
        localStorage.setItem('codeguru_admin_live_ping', JSON.stringify({ ...payload, _t: Date.now() }));
      } catch {}
    }
  }

  notify(type, data = null) {
    if (typeof window === 'undefined') return;

    const detail = { type, data, timestamp: Date.now() };

    // Standard admin refresh event
    window.dispatchEvent(new CustomEvent('codeguru_refresh_all', { detail }));
    window.dispatchEvent(new CustomEvent('codeguru_live_data', { detail }));
    window.dispatchEvent(new CustomEvent(`codeguru_refresh_${type}`, { detail }));

    if (type === 'leads' && data && data.name) {
      window.dispatchEvent(new CustomEvent('codeguru_lead_added', { detail: data }));
    }

    this.listeners.forEach((callback) => {
      try {
        callback(type, data);
      } catch (e) {
        console.error('[Admin Realtime Listener Error]:', e);
      }
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  emitStatusChange(status) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('codeguru_sync_status', { detail: { connected: status } }));
  }

  destroy() {
    if (this.eventSource) this.eventSource.close();
    if (this.broadcastChannel) this.broadcastChannel.close();
    clearInterval(this.pollingInterval);
    clearTimeout(this.retryTimeout);
  }
}

export const realtimeAdminService = new RealtimeAdminManager();

if (typeof window !== 'undefined') {
  realtimeAdminService.start();
}
