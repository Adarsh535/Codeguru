/**
 * ============================================================================
 * REALTIME STREAM ROUTES (realtimeRoutes.js)
 * ============================================================================
 * Provides SSE stream endpoints and ticket authorization.
 */

import express from 'express';
import { handleSSEConnection, broadcastRealtimeEvent, getRealtimeStatus } from '../../services/realtimeService.js';
import { issueRealtimeTicket } from '../../services/ticketService.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route GET /api/realtime/ticket
 * @route POST /api/realtime/ticket
 * @desc  Issue a 60-second one-time ticket for SSE EventSource connection
 * @access Admin only
 */
const handleTicketIssue = (req, res) => {
  const ticket = issueRealtimeTicket(req.admin);
  res.json({
    success: true,
    ticket,
    expiresIn: 60
  });
};

router.get('/ticket', requireAdmin, handleTicketIssue);
router.post('/ticket', requireAdmin, handleTicketIssue);

/**
 * @route GET /api/realtime/stream
 * @desc  Connect to SSE stream (requires valid ?ticket=)
 */
router.get('/stream', handleSSEConnection);

/**
 * @route GET /api/realtime/status
 * @desc  Get realtime connection count and health
 */
router.get('/status', requireAdmin, (req, res) => {
  res.json({ success: true, ...getRealtimeStatus() });
});

/**
 * @route POST /api/realtime/trigger
 * @desc  Manually trigger an event broadcast (Admin only)
 */
router.post('/trigger', requireAdmin, (req, res) => {
  const { type = 'data_updated' } = req.body || {};
  broadcastRealtimeEvent(type);
  res.json({ success: true, message: `Broadcast '${type}' triggered successfully` });
});

export default router;
