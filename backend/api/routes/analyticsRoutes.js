/**
 * ============================================================================
 * API ROUTER: WEBSITE VISITOR ANALYTICS ROUTES (analyticsRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for tracking website visits and administrative
 * analytics reporting (Summary Cards, Daily Trends Chart, Top Pages, Insights).
 */

import express from 'express';
import {
  trackPageView,
  recordHeartbeat,
  recordLeave,
  streamAnalytics,
  getAnalyticsSummary,
  getDailyAnalytics,
  getTopPages,
  getRealtimeAnalytics,
  getVisitorInsights
} from '../controllers/analyticsController.js';
import { requireAdmin, requireAdminOrTicket } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @api    POST /api/analytics/track
 * @desc    Records a public visitor page view event
 * @access  Public
 */
router.post('/track', trackPageView);

/**
 * @api    POST /api/analytics/heartbeat
 * @desc    Records a periodic heartbeat to maintain live session presence
 * @access  Public
 */
router.post('/heartbeat', recordHeartbeat);

/**
 * @api    POST /api/analytics/leave
 * @desc    Deletes an active session when tab is closed (navigator.sendBeacon)
 * @access  Public
 */
router.post('/leave', recordLeave);

/**
 * @api    GET /api/analytics/stream
 * @desc    Server-Sent Events (SSE) stream pushing real-time metrics every 5 seconds
 * @access  Admin Private
 */
router.get('/stream', requireAdminOrTicket, streamAnalytics);

/**
 * @api    GET /api/analytics/summary
 * @desc    Returns today, yesterday, monthly, total and live metrics for dashboard cards
 * @access  Admin Private
 */
router.get('/summary', requireAdmin, getAnalyticsSummary);

/**
 * @api    GET /api/analytics/daily
 * @desc    Returns daily trend datapoints for line and bar chart visualizations
 * @access  Admin Private
 */
router.get('/daily', requireAdmin, getDailyAnalytics);

/**
 * @api    GET /api/analytics/top-pages
 * @desc    Returns most visited pages report with view percentages and filters
 * @access  Admin Private
 */
router.get('/top-pages', requireAdmin, getTopPages);

/**
 * @api    GET /api/analytics/realtime
 * @desc    Returns active concurrent live visitor sessions and active routes
 * @access  Admin Private
 */
router.get('/realtime', requireAdmin, getRealtimeAnalytics);

/**
 * @api    GET /api/analytics/insights
 * @desc    Returns device, new vs returning, day-of-week, and referral channel breakdown
 * @access  Admin Private
 */
router.get('/insights', requireAdmin, getVisitorInsights);

export default router;
