/**
 * ============================================================================
 * API ROUTER: TRAFFIC ROUTES (trafficRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Realtime Website Analytics & Search Tracking.
 */

import express from 'express';
import { getTrafficStats, recordVisit, trackCourseSearch } from '../controllers/trafficController.js';

const router = express.Router();

/**
 * @api    GET /api/traffic/stats
 * @desc   Retrieves realtime traffic, live active users, top searched courses
 * @access Admin Private
 */
router.get('/stats', getTrafficStats);

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
