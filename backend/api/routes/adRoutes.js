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

const router = express.Router();

// Public routes
router.get('/', getAds);
router.get('/active', getActiveAds);
router.post('/:id/click', trackAdClick);

// Admin / Management routes
router.post('/', createAd);
router.put('/:id', updateAd);
router.delete('/:id', deleteAd);

export default router;
