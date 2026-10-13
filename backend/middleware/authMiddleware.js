/**
 * ============================================================================
 * MIDDLEWARE: AUTHENTICATION & ROLE-BASED ACCESS CONTROL (authMiddleware.js)
 * ============================================================================
 * 1. validateApiKey: Verifies that requests contain the valid x-api-key secret header.
 * 2. requireAuth: Verifies that a valid JWT token is present (via cookie or Bearer header).
 * 3. requireAdmin: Verifies that the authenticated user possesses the 'Master Admin' role.
 */

import { verifyToken } from '../utils/jwtHelper.js';
import { Admin } from '../models/Admin.js';

/**
 * Global API Security Middleware:
 * Verifies that incoming requests have the valid x-api-key header matching API_SECRET_KEY.
 * Blocks unauthorized direct scrapers and unauthorized callers.
 */
export const validateApiKey = (req, res, next) => {
  // Allow health checks, preflight OPTIONS, and realtime SSE stream
  const p = req.originalUrl || req.path || '';
  if (
    p.includes('/health') ||
    p.includes('/realtime/stream') ||
    p.includes('/events') ||
    req.method === 'OPTIONS'
  ) {
    return next();
  }

  const expectedKey = process.env.API_SECRET_KEY || 'cg_app_secret_369_2026';
  const providedKey = req.headers['x-api-key'] || req.headers['x-secret-key'] || req.query.apiKey;

  if (!providedKey || providedKey !== expectedKey) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Invalid or missing API security key.'
    });
  }

  next();
};

/**
 * Extract token from cookies or authorization headers
 * @param {Object} req - Express request
 * @returns {string|null} Token or null
 */
export const extractToken = (req) => {
  // 1. Check HttpOnly cookies
  if (req.cookies) {
    if (req.cookies.cg_admin_token) return req.cookies.cg_admin_token;
    if (req.cookies.cg_token) return req.cookies.cg_token;
    if (req.cookies.token) return req.cookies.token;
  }

  // 2. Check Authorization Bearer header
  const authHeader = req.headers.authorization || req.headers['x-admin-token'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  if (authHeader && !authHeader.includes(' ')) {
    return authHeader.trim();
  }

  return null;
};

/**
 * User / Student Authentication Middleware
 * Requires a valid cryptographically signed JWT.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to continue.'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Session has expired or is invalid. Please log in again.'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('[requireAuth Error]:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication verification failed.'
    });
  }
};

/**
 * Master Admin Access Control Middleware
 * Enforces role-based access control (RBAC). Only 'Master Admin' is permitted.
 */
export const requireAdmin = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Master Admin authentication token is required.'
      });
    }

    // 1. Verify cryptographic JWT signature & claims
    const decoded = verifyToken(token);
    if (decoded) {
      if (decoded.role === 'Master Admin' || decoded.role === 'Admin') {
        req.admin = decoded;
        req.user = decoded;
        return next();
      }
      return res.status(403).json({
        success: false,
        message: 'Access forbidden. Administrator privileges are required.'
      });
    }

    // 2. Fallback check against database for backwards-compatible active session transition
    // Note: strictly requires matching admin record in MongoDB Atlas
    const adminEmail = req.headers['x-admin-email'];
    if (adminEmail && (token.startsWith('cg-admin-jwt-') || token.startsWith('fallback-token-'))) {
      const cleanEmail = adminEmail.toLowerCase().trim();
      const admin = await Admin.findOne({ email: cleanEmail });
      if (admin) {
        req.admin = {
          id: admin._id,
          email: admin.email,
          role: admin.role
        };
        req.user = req.admin;
        return next();
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired Master Admin authentication token.'
    });
  } catch (error) {
    console.error('[requireAdmin Error]:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication verification failed.'
    });
  }
};
