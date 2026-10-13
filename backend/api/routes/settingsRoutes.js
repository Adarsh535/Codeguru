/**
 * ============================================================================
 * EXPRESS ROUTER: SYSTEM SETTINGS (settingsRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for dynamic admin settings.
 */

import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', requireAdmin, updateSettings);

export default router;
