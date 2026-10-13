/**
 * ============================================================================
 * API ROUTER: BANNER ROUTES (bannerRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Homepage Hero Section Banner Sliders.
 */

import express from 'express';
import { getBanners, addBanner, updateBanner, deleteBanner } from '../controllers/bannerController.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @api    GET /api/banners
 * @desc   Retrieves all hero section banner slides
 * @access Public
 */
router.get('/', getBanners);

/**
 * @api    POST /api/banners
 * @desc   Creates a new image or video banner slide
 * @access Admin Private
 */
router.post('/', requireAdmin, addBanner);

/**
 * @api    PUT /api/banners/:id
 * @desc   Updates existing banner details
 * @access Admin Private
 */
router.put('/:id', requireAdmin, updateBanner);

/**
 * @api    DELETE /api/banners/:id
 * @desc   Deletes a banner slide by ID
 * @access Admin Private
 */
router.delete('/:id', requireAdmin, deleteBanner);

export default router;
