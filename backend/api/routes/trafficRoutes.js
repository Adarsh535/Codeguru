/**
 * ============================================================================
 * API ROUTER: TRAFFIC ROUTES (trafficRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Realtime Website Analytics & Search Tracking.
 * Hardened with Master Admin authorization on analytics stats.
 */

import express from 'express';
import { getTrafficStats, recordVisit, trackCourseSearch } from '../controllers/trafficController.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @api    GET /api/traffic/stats
 * @desc   Retrieves realtime traffic, live active users, top searched courses
 * @access Admin Private
 */
router.get('/stats', requireAdmin, getTrafficStats);

/**
 * @api    POST /api/traffic/visit
 * @desc   Logs a page visit from a user session
 * @access Public
 */
router.post('/visit', recordVisit);

/**
 * @api    POST /api/traffic/search-course
 * @desc   Tracks searched course query keywords
 * @access Public
 */
router.post('/search-course', trackCourseSearch);

export default router;
