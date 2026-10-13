/**
 * ============================================================================
 * RATE LIMITER (backend/middleware/rateLimiter.js)
 * ============================================================================
 * Rate limiting disabled as per configuration. Pass-through middlewares.
 */

export const authLimiter = (req, res, next) => next();
export const otpLimiter = (req, res, next) => next();
export const generalApiLimiter = (req, res, next) => next();
