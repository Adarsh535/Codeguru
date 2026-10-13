/**
 * ============================================================================
 * SECURITY UTILITY: JWT & SESSION TOKEN MANAGER (backend/utils/jwtHelper.js)
 * ============================================================================
 * Handles cryptographic JWT token generation, signature validation,
 * and secure HttpOnly cookie management.
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'codeguru_super_secret_jwt_key_2026';
const JWT_ISSUER = 'codeguru-security-auth';
const JWT_AUDIENCE = 'codeguru-clients';

// Access Token Lifetime: 7 days
const TOKEN_EXPIRY = '7d';

/**
 * Generate cryptographically signed JWT token
 * @param {Object} payload - { id, email, role, phone }
 * @returns {string} Signed JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(
    {
      id: payload.id || payload._id,
      email: payload.email,
      role: payload.role || 'Student',
      phone: payload.phone || ''
    },
    JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: TOKEN_EXPIRY,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    }
  );
};

/**
 * Verify and decode JWT token with strict signature & claim validation
 * @param {string} token
 * @returns {Object|null} Decoded token payload or null if invalid/expired
 */
export const verifyToken = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    });
  } catch (error) {
    return null;
  }
};

/**
 * Attach HttpOnly, Secure, SameSite cookie to response
 * @param {Object} res - Express response object
 * @param {string} cookieName - Name of the cookie (e.g. 'cg_token' or 'cg_admin_token')
 * @param {string} token - Signed JWT string
 */
export const attachAuthCookie = (res, cookieName, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    // Use 'none' for cross-subdomain/cross-origin production setups with HTTPS, 'lax' for same-site/dev
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/'
  });
};

/**
 * Clear authentication cookie on logout
 * @param {Object} res - Express response object
 * @param {string} cookieName
 */
export const clearAuthCookie = (res, cookieName) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  });
};
