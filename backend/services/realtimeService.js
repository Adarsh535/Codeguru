/**
 * ============================================================================
 * REALTIME SERVICE: SERVER-SENT EVENTS (SSE) (realtimeService.js)
 * ============================================================================
 * Provides persistent, zero-latency server-to-client event streaming so that
 * all Frontend and Admin instances auto-refresh and live-sync data instantly
 * whenever changes are made anywhere in the system.
 */

const clients = new Set();

/**
 * Establish SSE connection for a client (Frontend or Admin)
 */
export const handleSSEConnection = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  });

  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders();
  }

  clients.add(res);

  // Initial handshake
  res.write(`data: ${JSON.stringify({ type: 'handshake', status: 'connected', clients: clients.size, timestamp: Date.now() })}\n\n`);

  // Heartbeat keepalive every 15 seconds
  const heartbeat = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch {
      clearInterval(heartbeat);
      clients.delete(res);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    clients.delete(res);
  });
};

/**
 * Broadcast an update event to all connected clients
 * @param {string} eventType - 'leads' | 'courses' | 'categories' | 'banners' | 'placements' | 'team' | 'enrollments' | 'traffic' | 'settings' | 'all'
 * @param {any} data - Optional payload
 */
export const broadcastRealtimeEvent = (eventType = 'all', data = null) => {
  if (clients.size === 0) return;

  const payload = JSON.stringify({
    type: eventType,
    data,
    timestamp: Date.now()
  });

  const message = `data: ${payload}\n\n`;

  for (const client of clients) {
    try {
      client.write(message);
    } catch {
      clients.delete(client);
    }
  }
};

/**
 * Get active connection metrics
 */
export const getRealtimeStatus = () => ({
  activeClients: clients.size,
  uptime: process.uptime(),
  timestamp: new Date().toISOString()
});
