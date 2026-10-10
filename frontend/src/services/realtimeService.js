/**
 * ============================================================================
 * FRONTEND REALTIME SYNC SERVICE (realtimeService.js)
 * ============================================================================
 * Provides persistent Server-Sent Events (SSE) connection, cross-tab BroadcastChannel,
 * window focus revalidation, and smart auto-refresh polling so that Frontend UI
 * updates live in real time whenever Admin or Backend changes data.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const STREAM_URL = `${BACKEND_URL}/realtime/stream`;

class RealtimeSyncManager {
  constructor() {
    this.eventSource = null;
    this.broadcastChannel = null;
    this.isConnected = false;
    this.retryTimeout = null;
    this.pollingInterval = null;
    this.retryCount = 0;
    this.listeners = new Set();
  }

  /**
   * Start live synchronization
   */
  start() {
    if (typeof window === 'undefined') return;

    // 1. Initialize BroadcastChannel for instant cross-tab synchronization
    if ('BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('codeguru_realtime_channel');
        this.broadcastChannel.onmessage = (event) => {
          this.handleEvent(event.data, false);
        };
      } catch (err) {
        console.warn('[Realtime Sync] BroadcastChannel not supported:', err);
      }
    }

    // 2. Start SSE Stream
    this.connectSSE();

    // 3. Fallback smart polling: every 4 seconds when page is active
    if (!this.pollingInterval) {
      this.pollingInterval = setInterval(() => {
        if (typeof document !== 'undefined' && !document.hidden) {
          this.notify('all', { source: 'polling_heartbeat' });
        }
      }, 4000);
    }

    // 4. Instant revalidation when tab gains focus
    window.addEventListener('focus', () => {
      this.notify('all', { source: 'window_focus' });
    });

    // 5. Visibility change revalidation
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.notify('all', { source: 'visibility_change' });
      }
    });

    // 6. Cross-tab storage fallback event
    window.addEventListener('storage', (e) => {
      if (e.key === 'codeguru_live_sync_ping') {
        try {
          const parsed = JSON.parse(e.newValue || '{}');
          this.handleEvent(parsed, false);
        } catch {}
      }
    });
  }

  /**
   * Connect to Backend SSE Stream
   */
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
        // Refresh data on connect
        this.notify('all', { source: 'sse_connect' });
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleEvent(data, true);
        } catch (err) {
          console.warn('[Realtime Sync] Malformed SSE message:', event.data);
        }
      };

      this.eventSource.onerror = () => {
        this.isConnected = false;
        this.emitStatusChange(false);
        try {
          this.eventSource.close();
        } catch {}

        // Exponential backoff retry (1s -> 2s -> 4s -> max 8s)
        const delay = Math.min(1000 * Math.pow(2, this.retryCount), 8000);
        this.retryCount++;

        clearTimeout(this.retryTimeout);
        this.retryTimeout = setTimeout(() => {
          this.connectSSE();
        }, delay);
      };
    } catch (err) {
      console.warn('[Realtime Sync] Failed to connect EventSource:', err);
    }
  }

  /**
   * Handle incoming event (from SSE or BroadcastChannel)
   */
  handleEvent(payload, shouldBroadcast = true) {
    if (!payload || !payload.type) return;

    const eventType = payload.type;

    // Disseminate to local window event system
    this.notify(eventType, payload.data);

    // Cross-tab broadcast
    if (shouldBroadcast) {
      if (this.broadcastChannel) {
        try {
          this.broadcastChannel.postMessage(payload);
        } catch {}
      }
      try {
        localStorage.setItem('codeguru_live_sync_ping', JSON.stringify({ ...payload, _t: Date.now() }));
      } catch {}
    }
  }

  /**
   * Trigger local DOM events for all subscribed components
   */
  notify(type, data = null) {
    if (typeof window === 'undefined') return;

    const detail = { type, data, timestamp: Date.now() };

    // 1. Generic live update event
    window.dispatchEvent(new CustomEvent('codeguru_live_update', { detail }));

    // 2. Type-specific events
    window.dispatchEvent(new CustomEvent(`codeguru_refresh_${type}`, { detail }));

    // 3. Backward compatible refresh event
    window.dispatchEvent(new CustomEvent('codeguru_refresh_all', { detail }));

    // Notify registered JS listeners
    this.listeners.forEach((callback) => {
      try {
        callback(type, data);
      } catch (e) {
        console.error('[Realtime Sync Listener Error]:', e);
      }
    });
  }

  /**
   * Subscribe JS callback to live data updates
   */
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

export const realtimeSync = new RealtimeSyncManager();

// Auto-start in browser
if (typeof window !== 'undefined') {
  realtimeSync.start();
}
