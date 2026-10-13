import multer from 'multer';

/**
 * ============================================================================
 * UPLOAD MIDDLEWARE (upload.js) — Cloudinary-First with Memory Buffer
 * ============================================================================
 * Uses multer memoryStorage so files are held in RAM as Buffer and streamed
 * directly to Cloudinary — zero temp disk files written.
 * Hardened with safe raster images, video types, and strict size validation.
 */

const ALLOWED_MIMETYPES = [
  // Safe Raster Images (SVG excluded to prevent Stored XSS vectors)
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  // Videos
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  'video/mpeg'
];

const fileFilter = (req, file, cb) => {
  // Prevent path traversal or null byte injection in original filename
  const cleanFilename = file.originalname.replace(/[\0\r\n]/g, '').trim();
  if (cleanFilename.includes('..') || cleanFilename.includes('/') || cleanFilename.includes('\\')) {
    return cb(new Error('Invalid filename detected. Path traversal is forbidden.'), false);
  }

  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: safe images (JPG, PNG, WebP, GIF, AVIF) & videos.`), false);
  }
};

// Memory storage — file goes directly as buffer to Cloudinary stream
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max limit
    files: 1
  }
});
