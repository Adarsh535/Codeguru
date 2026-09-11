import fs from 'fs';
import cloudinary, { isCloudinaryConfigured } from '../../config/cloudinary.js';

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Handle File Upload Response (Cloudinary / Local Fallback)
 * --------------------------------------------------------------------------
 * @route   POST /api/upload
 * @desc    Uploads file to Cloudinary cloud storage or local disk storage.
 * @access  Public / Upload
 * @param   {Object} req.file - Multer file object
 * @returns {JSON} { success: boolean, url: string, filename: string, mimetype: string, size: number, provider: string }
 */
export const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Check if Cloudinary credentials are provided in .env
    if (isCloudinaryConfigured()) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'codeguru_uploads',
        resource_type: 'auto'
      });

      // Cleanup local temp file after cloud upload
      fs.unlink(req.file.path, () => {});

      return res.json({
        success: true,
        message: 'File uploaded to Cloudinary successfully',
        url: uploadResult.secure_url,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        provider: 'Cloudinary'
      });
    }

    // Fallback: Local Server Storage
    const host = req.protocol + '://' + req.get('host');
    const fileUrl = `${host}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'File uploaded to local storage successfully',
      url: fileUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      provider: 'Local Storage'
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
};
