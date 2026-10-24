/**
 * ============================================================================
 * ENVIRONMENT VARIABLE VALIDATOR (config/env.js)
 * ============================================================================
 * Validates critical environment variables at startup (B3, B17, Section 2.5).
 * In production, refuses to start if required variables are missing or insecure.
 */

export const validateEnv = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const missing = [];
  const errors = [];

  // 1. MongoDB URI
  if (!process.env.MONGODB_URI) {
    missing.push('MONGODB_URI');
  }

  // 2. JWT Secret (must exist and be >= 32 characters)
  if (!process.env.JWT_SECRET) {
    missing.push('JWT_SECRET');
  } else if (process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long for cryptographic security.');
  }

  // 3. CORS Origins in production
  if (isProduction && !process.env.CORS_ORIGINS && !process.env.FRONTEND_URL) {
    missing.push('CORS_ORIGINS (or FRONTEND_URL)');
  }

  // 4. Cloudinary (warn in dev, required in production if file uploads are used)
  const cloudinaryVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missingCloudinary = cloudinaryVars.filter(v => !process.env[v]);
  if (missingCloudinary.length > 0 && isProduction) {
    console.warn(`[Warning] Missing Cloudinary env vars: ${missingCloudinary.join(', ')}. Local uploads are not persisted across deploys.`);
  }

  // If in production and critical variables are missing/invalid, abort immediately
  if (isProduction && (missing.length > 0 || errors.length > 0)) {
    console.error('================================================================');
    console.error('FATAL ERROR: Environment configuration is missing or invalid!');
    if (missing.length > 0) {
      console.error('Missing required environment variables:');
      missing.forEach(v => console.error(`  - ${v}`));
    }
    if (errors.length > 0) {
      console.error('Validation errors:');
      errors.forEach(e => console.error(`  - ${e}`));
    }
    console.error('Please configure these in your deployment dashboard (e.g. Render).');
    console.error('================================================================');
    process.exit(1);
  } else if (missing.length > 0 || errors.length > 0) {
    // Development warning
    console.warn('[Env Validation Warning]:', {
      missing,
      errors
    });
  }
};
