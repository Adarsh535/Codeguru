/**
 * ============================================================================
 * MIDDLEWARE: AUTHENTICATION & ROLE-BASED ACCESS CONTROL (authMiddleware.js)
 * ============================================================================
 * Zero-trust authentication enforcement:
 * - Real cryptographically signed JWTs
 * - Live MongoDB admin validation, tokenVersion check, active status check
 * - Complete removal of all query token / header bypasses
 */

import mongoose from 'mongoose';
import { verifyToken } from '../utils/jwtHelper.js';
import { Admin } from '../models/Admin.js';
import { Student } from '../models/Student.js';
import { inMemoryUsers } from '../api/controllers/userController.js';
import { consumeRealtimeTicket } from '../services/ticketService.js';

/**
 * Legacy stub: No-op to preserve interface without fake API key bypass
 */
export const validateApiKey = (req, res, next) => {
  next();
};

/**
 * CSRF hardening: for state-changing methods, require a JSON Content-Type.
 * A cross-site auto-submitting HTML form (the CSRF vector) can only send
 * text/plain, urlencoded or multipart — never application/json — so this
 * blocks forged state changes while leaving the admin UI (which always
 * sends JSON) and GET requests untouched.
 */
export const requireJson = (req, res, next) => {
  const method = (req.method || '').toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return next();
  const ct = (req.headers['content-type'] || '').toLowerCase();
  if (!ct.includes('application/json')) {
    return res.status(415).json({
      success: false,
      message: 'Unsupported request. Admin actions must be sent as application/json.'
    });
  }
  next();
};

/**
 * Extract token ONLY from Authorization header or HttpOnly cookies.
 * Strictly ignores query string tokens to eliminate token leakage in access logs.
 */
export const extractToken = (req) => {
  // 1. Check HttpOnly cookies
  if (req.cookies) {
    if (req.cookies.cg_admin_token) return req.cookies.cg_admin_token;
    if (req.cookies.cg_token) return req.cookies.cg_token;
    if (req.cookies.token) return req.cookies.token;
  }

  // 2. Check Authorization Bearer header
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  if (authHeader && !authHeader.includes(' ')) {
    return authHeader.trim();
  }

  return null;
};

/**
 * Enforce Admin Authentication
 * Validates JWT, verifies admin exists in DB, is active, and tokenVersion matches.
 */
export const requireAdmin = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Admin authentication token is required.'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.'
      });
    }

    // Must be admin type or possess recognized admin role
    const adminRoles = ['Master Admin', 'Admin', 'Counselor'];
    if (decoded.type !== 'admin' && !adminRoles.includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Admin privileges required.'
      });
    }

    const adminId = decoded.sub || decoded.id;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token subject.'
      });
    }

    // Live DB validation (prevents access from deleted or modified admins)
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or has been removed.'
      });
    }

    if (admin.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is deactivated.'
      });
    }

    // Verify token version (revokes tokens issued prior to password/credential reset)
    const expectedTv = admin.tokenVersion ?? 0;
    const tokenTv = decoded.tv ?? 0;
    if (tokenTv !== expectedTv) {
      return res.status(401).json({
        success: false,
        message: 'Session has been invalidated. Please log in again.'
      });
    }

    req.admin = admin;
    req.user = {
      sub: admin._id.toString(),
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
      type: 'admin'
    };

    next();
  } catch (error) {
    console.error('[requireAdmin Error]:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication verification failed.'
    });
  }
};

/**
 * Admin or Short-Lived SSE Ticket Authentication Middleware
 * Specifically for browser EventSource endpoints where headers cannot be attached.
 */
export const requireAdminOrTicket = async (req, res, next) => {
  if (req.query?.ticket) {
    const ticketData = consumeRealtimeTicket(req.query.ticket);
    if (ticketData) {
      req.admin = ticketData;
      req.user = ticketData;
      return next();
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired realtime ticket.'
    });
  }
  return requireAdmin(req, res, next);
};

/**
 * Role-Based Access Control Middleware
 * Usage: requireRole('Master Admin') or requireRole('Master Admin', 'Admin')
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const userRole = req.admin.role || req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: This action requires one of the following roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Student Authentication Middleware
 */
export const requireStudent = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in as a student.'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Session has expired or is invalid. Please log in again.'
      });
    }

    const studentId = (decoded.sub || decoded.id || '').toString();
    let student = inMemoryUsers.get(studentId);
    if (!student && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(studentId)) {
      student = await Student.findById(studentId);
    }
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Student account not found.'
      });
    }

    req.student = student;
    req.user = {
      sub: (student._id || studentId).toString(),
      id: (student._id || studentId).toString(),
      email: student.email,
      phone: student.phone || '',
      role: 'Student',
      type: 'student'
    };

    next();
  } catch (error) {
    console.error('[requireStudent Error]:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Student authentication verification failed.'
    });
  }
};

/**
 * General Authentication Middleware (accepts either valid Admin or valid Student)
 */
export const requireAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Session has expired or is invalid. Please log in again.'
      });
    }

    if (decoded.type === 'admin' || ['Master Admin', 'Admin', 'Counselor'].includes(decoded.role)) {
      const adminId = (decoded.sub || decoded.id || '').toString();
      let admin = null;
      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(adminId)) {
        admin = await Admin.findById(adminId);
      }
      // SECURITY: fail closed. Never fabricate an admin when the DB cannot
      // confirm the account (previously this let revoked/deactivated admins
      // back in during any DB outage).
      if (!admin || admin.isActive === false) {
        return res.status(401).json({ success: false, message: 'Invalid admin session.' });
      }
      if ((decoded.tv ?? 0) !== (admin.tokenVersion ?? 0)) {
        return res.status(401).json({ success: false, message: 'Session invalidated.' });
      }
      req.admin = admin;
      req.user = {
        sub: admin._id.toString(),
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role,
        type: 'admin'
      };
      return next();
    }

    // Otherwise student
    const studentId = (decoded.sub || decoded.id || '').toString();
    let student = inMemoryUsers.get(studentId);
    if (!student && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(studentId)) {
      student = await Student.findById(studentId);
    }
    if (!student) {
      return res.status(401).json({ success: false, message: 'Student account not found.' });
    }

    req.student = student;
    req.user = {
      sub: (student._id || studentId).toString(),
      id: (student._id || studentId).toString(),
      email: student.email,
      phone: student.phone || '',
      role: 'Student',
      type: 'student'
    };

    next();
  } catch (error) {
    console.error('[requireAuth Error]:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication verification failed.'
    });
  }
};
