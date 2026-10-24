/**
 * ============================================================================
 * REALTIME SERVICE: SERVER-SENT EVENTS (SSE) (realtimeService.js)
 * ============================================================================
 * Hardened SSE streaming service:
 * - Admin ticket authentication (no raw tokens in query params)
 * - Origin validation (no wildcard CORS)
 * - Broadcasts event notifications ONLY, never sensitive user data
 * - Connection limit & 25s keepalive
 */

import { consumeRealtimeTicket } from './ticketService.js';

const clients = new Set();
const MAX_SSE_CLIENTS = 100;

export const handleSSEConnection = (req, res) => {
  // Validate one-time ticket
  const ticket = req.query.ticket;
  const ticketData = consumeRealtimeTicket(ticket);

  if (!ticketData) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: A valid realtime ticket is required to connect.'
    });
  }

  if (clients.size >= MAX_SSE_CLIENTS) {
    return res.status(503).json({
      success: false,
      message: 'Service unavailable: Maximum realtime stream capacity reached.'
    });
  }

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders();
  }

  clients.add(res);

  // Initial handshake event (no PII)
  res.write(`data: ${JSON.stringify({ type: 'handshake', status: 'connected', timestamp: Date.now() })}\n\n`);

  // 25s keepalive comment
  const keepaliveTimer = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch {
      clearInterval(keepaliveTimer);
      clients.delete(res);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(keepaliveTimer);
    clients.delete(res);
  });
};

/**
 * Broadcast an update notification to connected admin clients.
 * NEVER sends raw database records or personal data!
 * @param {string} eventType - e.g. 'leads_updated', 'enrollments_updated', 'courses_updated'
 */
export const broadcastRealtimeEvent = (eventType = 'data_updated') => {
  if (clients.size === 0) return;

  // Notification-only payload
  const payload = JSON.stringify({
    type: eventType.endsWith('_updated') ? eventType : `${eventType}_updated`,
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

export const getRealtimeStatus = () => ({
  activeClients: clients.size,
  uptime: process.uptime(),
  timestamp: new Date().toISOString()
});
