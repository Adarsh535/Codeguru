import multer from 'multer';

/**
 * ============================================================================
 * UPLOAD MIDDLEWARE (upload.js) — Cloudinary-First with Memory Buffer
 * ============================================================================
 * Uses multer memoryStorage so files are held in RAM as Buffer and streamed
 * DIRECTLY to Cloudinary — no temp disk files written at all.
 *
 * Supported: Images (jpg/png/webp/gif/svg) + Videos (mp4/webm/mov)
 */

const ALLOWED_MIMETYPES = [
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
  // Videos
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  'video/mpeg',
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: images & videos only.`), false);
  }
};

// Memory storage — file goes directly as buffer to Cloudinary stream
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  }
});
