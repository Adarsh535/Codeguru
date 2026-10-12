import { Readable } from 'stream';
import cloudinary, { isCloudinaryConfigured, checkCloudinaryConnection } from '../../config/cloudinary.js';

/**
 * ============================================================================
 * UPLOAD CONTROLLER (uploadController.js) — Cloudinary Direct Stream Upload
 * ============================================================================
 * Streams file buffer directly from memory to Cloudinary.
 * No temp disk files. Fully cloud-first.
 */

/**
 * Streams a buffer directly to Cloudinary upload_stream
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {Object} options - Cloudinary upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
function streamToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    Readable.from(buffer).pipe(uploadStream);
  });
}

/**
 * @route   POST /api/upload
 * @desc    Streams uploaded file buffer directly to Cloudinary
 * @access  Public / Upload
 */
export const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded. Please select a file.' });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to backend .env'
      });
    }

    // Ensure latest config is applied
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });

    const isVideo = req.file.mimetype.startsWith('video/') || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(req.file.originalname);

    // Stream buffer directly to Cloudinary — no disk write
    const uploadResult = await streamToCloudinary(req.file.buffer, {
      folder: 'codeguru_uploads',
      resource_type: isVideo ? 'video' : 'auto',
      timeout: 180000,
      // Auto-generate a clean public_id from original filename
      public_id: `${Date.now()}_${req.file.originalname.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')}`,
    });

    console.log(`✅ [Cloudinary Upload] ${uploadResult.resource_type} uploaded: ${uploadResult.secure_url}`);

    return res.json({
      success: true,
      message: `File uploaded to Cloudinary successfully`,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      provider: 'Cloudinary',
      resource_type: uploadResult.resource_type
    });

  } catch (error) {
    console.error('[Cloudinary Upload Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'File upload to Cloudinary failed',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/upload/status
 * @desc    Returns Cloudinary configuration and connection status
 * @access  Public
 */
export const getUploadStatus = async (req, res) => {
  try {
    const status = await checkCloudinaryConnection();
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking Cloudinary status',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/upload
 * @desc    Deletes asset from Cloudinary by public_id
 * @access  Public / Upload
 */
export const deleteFile = async (req, res) => {
  try {
    const { public_id, resource_type } = req.body;
    if (!public_id) {
      return res.status(400).json({ success: false, message: 'public_id is required to delete a file' });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(400).json({ success: false, message: 'Cloudinary not configured' });
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type || 'image'
    });

    return res.json({
      success: result.result === 'ok',
      result,
      message: result.result === 'ok' ? 'File deleted from Cloudinary successfully' : 'Failed to delete file from Cloudinary'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting file from Cloudinary',
      error: error.message
    });
  }
};
