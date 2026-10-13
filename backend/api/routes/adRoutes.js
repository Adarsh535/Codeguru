/**
 * ============================================================================
 * API ROUTER: ADVERTISEMENT ROUTES (adRoutes.js)
 * ============================================================================
 * REST API endpoints for Website Promotional and Advertisement Banners.
 */

import express from 'express';
import {
  getAds,
  getActiveAds,
  createAd,
  updateAd,
  deleteAd,
  trackAdClick
} from '../controllers/adController.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAds);
router.get('/active', getActiveAds);
router.post('/:id/click', trackAdClick);

// Admin / Management routes (Protected)
router.post('/', requireAdmin, createAd);
router.put('/:id', requireAdmin, updateAd);
router.delete('/:id', requireAdmin, deleteAd);

export default router;
