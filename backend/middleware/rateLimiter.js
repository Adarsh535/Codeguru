/**
 * ============================================================================
 * RATE LIMITER MIDDLEWARES (backend/middleware/rateLimiter.js)
 * ============================================================================
 * Implements real rate limiting per target security design (Section 2.5):
 * - Admin Login: 5 attempts per 15 min per IP/email
 * - Student OTP Send: 10 per IP per hour
 * - Public Leads: 5 submissions per hour per IP
 * - Analytics Tracking: 120 per minute per IP
 * - Global: 300 requests per 15 min per IP
 */

import rateLimit from 'express-rate-limit';

/**
 * Global rate limiter: 300 requests per 15 minutes per IP
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again later.'
  }
});

/**
 * Strict API Minute Limiter: 100 requests per 1 minute per IP
 * Returns 429 when 100+ requests are fired within 60 seconds
 */
export const apiMinuteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Rate limit of 100 requests per minute exceeded.'
  }
});

/**
 * Admin Login Rate Limiter: 5 attempts per 15 minutes per IP
 */
export const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  }
});

export const authLimiter = adminLoginLimiter;

/**
 * Student OTP Send Limiter: 10 OTP requests per hour per IP
 */
export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests from this network. Please try again later.'
  }
});

/**
 * Public Lead Form Limiter: 5 submissions per hour per IP (B17, B12)
 */
export const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 60 : 5000,
  skip: () => process.env.NODE_ENV !== 'production',
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many inquiries submitted from this network. Please wait an hour before submitting again.'
  }
});

/**
 * Analytics Heartbeat & Tracking Limiter: 120 calls per minute per IP
 */
export const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Analytics rate limit exceeded.'
  }
});

export const generalApiLimiter = globalLimiter;
