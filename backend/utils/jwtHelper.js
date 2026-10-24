/**
 * ============================================================================
 * SECURITY UTILITY: JWT & SESSION TOKEN MANAGER (backend/utils/jwtHelper.js)
 * ============================================================================
 * Cryptographic JWT token issuance and signature verification.
 * Adheres strictly to zero-trust target architecture:
 * - Admin Token: sub, role, type: 'admin', tv: tokenVersion, expiry 8h
 * - Student Token: sub, type: 'student', expiry 7d
 */

import jwt from 'jsonwebtoken';

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      console.error('FATAL: JWT_SECRET must be at least 32 characters in production.');
      process.exit(1);
    }
    // Return a warning-safe fallback for local development if not set, but enforce >= 32 chars
    return secret || 'dev_insecure_jwt_secret_must_be_at_least_32_characters_long!';
  }
  return secret;
};

const JWT_ISSUER = 'codeguru-security-auth';
const JWT_AUDIENCE = 'codeguru-clients';

/**
 * Generate Admin JWT token (8 hours expiry)
 * payload: { sub, role, tv }
 */
export const generateAdminToken = ({ sub, id, _id, role, tokenVersion = 0, email }) => {
  const secret = getJwtSecret();
  const adminId = (sub || id || _id).toString();
  return jwt.sign(
    {
      sub: adminId,
      id: adminId,
      email: email || undefined,
      role: role || 'Admin',
      type: 'admin',
      tv: tokenVersion
    },
    secret,
    {
      algorithm: 'HS256',
      expiresIn: '8h',
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    }
  );
};

/**
 * Generate Student JWT token (7 days max expiry)
 * payload: { sub, phone, email }
 */
export const generateStudentToken = ({ sub, id, _id, phone, email }) => {
  const secret = getJwtSecret();
  const studentId = (sub || id || _id).toString();
  return jwt.sign(
    {
      sub: studentId,
      id: studentId,
      type: 'student',
      role: 'Student',
      phone: phone || '',
      email: email || ''
    },
    secret,
    {
      algorithm: 'HS256',
      expiresIn: '7d',
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    }
  );
};

/**
 * General token generation for backward compatibility
 */
export const generateToken = (payload) => {
  if (payload.type === 'admin' || payload.role === 'Master Admin' || payload.role === 'Admin' || payload.role === 'Counselor') {
    return generateAdminToken({
      sub: payload.sub || payload.id || payload._id,
      email: payload.email,
      role: payload.role,
      tokenVersion: payload.tv ?? payload.tokenVersion ?? 0
    });
  }
  return generateStudentToken({
    sub: payload.sub || payload.id || payload._id,
    phone: payload.phone,
    email: payload.email
  });
};

/**
 * Strict verification of cryptographic JWT signature
 */
export const verifyToken = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret, {
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
 */
export const attachAuthCookie = (res, cookieName, token, maxAgeMs = 8 * 60 * 60 * 1000) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: maxAgeMs,
    path: '/'
  });
};

/**
 * Clear authentication cookie on logout
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
