/**
 * ============================================================================
 * API ROUTER: UPLOAD ROUTES (uploadRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Media File Uploads (Images & Promo Videos).
 */

import express from 'express';
import { upload } from '../../middleware/upload.js';
import { handleFileUpload, getUploadStatus, deleteFile } from '../controllers/uploadController.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @api    GET /api/upload/status
 * @desc   Checks Cloudinary credentials and connectivity status
 * @access Public
 */
router.get('/status', getUploadStatus);

/**
 * @api    POST /api/upload
 * @desc   Uploads a single media file (Image/Video) to Cloudinary or Local Storage
 * @access Admin Private
 */
router.post('/', requireAdmin, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('[Multer Upload Error]:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    }
    next();
  });
}, handleFileUpload);

/**
 * @api    DELETE /api/upload
 * @desc   Deletes file from Cloudinary by public_id
 * @access Admin Private
 */
router.delete('/', requireAdmin, deleteFile);

export default router;
