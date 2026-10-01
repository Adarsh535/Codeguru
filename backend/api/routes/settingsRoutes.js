/**
 * ============================================================================
 * EXPRESS ROUTER: SYSTEM SETTINGS (settingsRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for dynamic admin settings.
 */

import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
