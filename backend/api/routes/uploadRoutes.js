/**
 * ============================================================================
 * API ROUTER: UPLOAD ROUTES (uploadRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Media File Uploads (Images & Promo Videos).
 */

import express from 'express';
import { upload } from '../../middleware/upload.js';
import { handleFileUpload } from '../controllers/uploadController.js';

const router = express.Router();

/**
 * @api    POST /api/upload
 * @desc   Uploads a single media file (Image/Video) and returns public file URL
 * @access Public / Upload
 */
router.post('/', upload.single('file'), handleFileUpload);

export default router;
