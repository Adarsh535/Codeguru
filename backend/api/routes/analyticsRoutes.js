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
  getAnalyticsSummary,
  getDailyAnalytics,
  getTopPages,
  getRealtimeAnalytics,
  getVisitorInsights
} from '../controllers/analyticsController.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @api    POST /api/analytics/track
 * @desc    Records a public visitor page view or session heartbeat
 * @access  Public
 */
router.post('/track', trackPageView);

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
