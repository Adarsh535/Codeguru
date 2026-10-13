/**
 * ============================================================================
 * RATE LIMITING & BRUTE FORCE PROTECTION (backend/middleware/rateLimiter.js)
 * ============================================================================
 * Protects login, registration, and OTP endpoints against credential stuffing
 * and brute force attacks.
 */

import rateLimit from 'express-rate-limit';

/**
 * Standard message formatter for rate limit responses
 */
const createLimiterResponse = (message) => ({
  success: false,
  message
});

/**
 * Strict limiter for sensitive authentication endpoints (Admin/Student Login)
 * Max 15 attempts per 15-minute window per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: createLimiterResponse('Too many login attempts. Please try again after 15 minutes.')
});

/**
 * Very strict limiter for OTP Generation (SMS costs and spam prevention)
 * Max 6 requests per 15-minute window per IP
 */
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: createLimiterResponse('Too many OTP requests from this connection. Please try again after 15 minutes.')
});

/**
 * General API Limiter for public endpoints
 * Max 600 requests per 15-minute window per IP
 */
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: createLimiterResponse('Too many requests. Please slow down.')
});
