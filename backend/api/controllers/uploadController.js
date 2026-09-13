import fs from 'fs';
import cloudinary, { isCloudinaryConfigured, checkCloudinaryConnection } from '../../config/cloudinary.js';

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Handle File Upload Response (Cloudinary / Local Fallback)
 * --------------------------------------------------------------------------
 * @route   POST /api/upload
 * @desc    Uploads file to Cloudinary cloud storage or local disk storage.
 * @access  Public / Upload
 * @param   {Object} req.file - Multer file object
 * @returns {JSON} { success: boolean, url: string, public_id: string, filename: string, mimetype: string, size: number, provider: string }
 */
export const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Check if Cloudinary credentials are provided in .env
    if (isCloudinaryConfigured()) {
      // Re-apply config to ensure env vars are populated
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
      });

      const isVideo = req.file.mimetype.startsWith('video/') || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(req.file.originalname);

      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'codeguru_uploads',
        resource_type: isVideo ? 'video' : 'auto',
        timeout: 180000
      });

      // Cleanup local temp file after cloud upload
      fs.unlink(req.file.path, () => {});

      return res.json({
        success: true,
        message: `File uploaded to Cloudinary successfully (${isVideo ? 'Video' : 'Image'})`,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        provider: 'Cloudinary',
        resource_type: uploadResult.resource_type || (isVideo ? 'video' : 'image')
      });
    }

    // Fallback: Local Server Storage
    const host = req.protocol + '://' + req.get('host');
    const fileUrl = `${host}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'File uploaded to local storage successfully',
      url: fileUrl,
      public_id: null,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      provider: 'Local Storage'
    });
  } catch (error) {
    console.error('Upload Error:', error);
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Check Cloudinary Service Status
 * --------------------------------------------------------------------------
 * @route   GET /api/upload/status
 * @desc    Returns status of Cloudinary configuration and connection.
 * @access  Public
 */
export const getUploadStatus = async (req, res) => {
  try {
    const status = await checkCloudinaryConnection();
    res.json({
      success: true,
      status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking Cloudinary status',
      error: error.message
    });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Delete File from Cloudinary
 * --------------------------------------------------------------------------
 * @route   DELETE /api/upload
 * @desc    Deletes asset from Cloudinary using public_id.
 * @access  Public / Upload
 */
export const deleteFile = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ success: false, message: 'public_id is required' });
    }

    if (isCloudinaryConfigured()) {
      const result = await cloudinary.uploader.destroy(public_id);
      return res.json({
        success: result.result === 'ok',
        result,
        message: result.result === 'ok' ? 'File deleted from Cloudinary' : 'Failed to delete file'
      });
    }

    return res.status(400).json({ success: false, message: 'Cloudinary not configured' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
};

