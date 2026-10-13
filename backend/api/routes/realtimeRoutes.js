/**
 * ============================================================================
 * REALTIME STREAM ROUTES (realtimeRoutes.js)
 * ============================================================================
 * Provides SSE stream endpoints and manual trigger route for instant live data updates.
 * Hardened with Master Admin authorization on manual broadcast triggers.
 */

import express from 'express';
import { handleSSEConnection, broadcastRealtimeEvent, getRealtimeStatus } from '../../services/realtimeService.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route GET /api/realtime/stream
 * @desc  Connect to SSE stream for real-time live data updates
 */
router.get('/stream', handleSSEConnection);

/**
 * @route GET /api/realtime/status
 * @desc  Get realtime connection count and health
 */
router.get('/status', (req, res) => {
  res.json({ success: true, ...getRealtimeStatus() });
});

/**
 * @route POST /api/realtime/trigger
 * @desc  Manually trigger an event broadcast (Admin only)
 */
router.post('/trigger', requireAdmin, (req, res) => {
  const { type = 'all', data = null } = req.body || {};
  broadcastRealtimeEvent(type, data);
  res.json({ success: true, message: `Broadcast '${type}' triggered successfully` });
});

export default router;
