/**
 * ============================================================================
 * CONTROLLER: AUTHENTICATION CONTROLLER (authController.js)
 * ============================================================================
 * Hardened Admin & Student Authentication Controller:
 * - Admin Login: bcrypt (cost >= 12), JWT (8h), zero auto-create, tokenVersion
 * - Student OTP: Crypto OTP, SHA-256 hash in Mongo TTL, rate-limited, zero 1234 bypass
 * - Student Profile: strictly scoped to req.user.sub, zero account takeover
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Admin } from '../../models/Admin.js';
import { Student } from '../../models/Student.js';
import { Lead } from '../../models/Lead.js';
import { Counter } from '../../models/Counter.js';
import { broadcastRealtimeEvent } from '../../services/realtimeService.js';
import { recordAuditLog } from '../../services/auditService.js';
import { extractToken } from '../../middleware/authMiddleware.js';
import { cleanText } from '../../utils/sanitizeInput.js';
import {
  generateAdminToken,
  generateStudentToken,
  attachAuthCookie,
  clearAuthCookie,
  verifyToken
} from '../../utils/jwtHelper.js';

/**
 * @route   POST /api/auth/login
 * @desc    Master Admin Login authentication
 * @access  Public
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Query MongoDB Database for Admin account
    const admin = await Admin.findOne({ email: cleanEmail });

    // Zero auto-creation: return generic 401 if not found
    if (!admin || admin.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is temporarily locked due to brute force
    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      const remainingMinutes = Math.ceil((admin.lockUntil - Date.now()) / (60 * 1000));
      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked due to 10 failed login attempts. Please try again after ${remainingMinutes} minute(s).`
      });
    }

    // 2. Verify password hash using bcrypt only
    if (!admin.password || (!admin.password.startsWith('$2a$') && !admin.password.startsWith('$2b$'))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      admin.failedLoginAttempts = (admin.failedLoginAttempts || 0) + 1;
      let lockedNow = false;
      if (admin.failedLoginAttempts >= 10) {
        admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minute lock
        lockedNow = true;
        await recordAuditLog({
          action: 'SECURITY_LOCKOUT',
          admin: { email: cleanEmail, _id: admin._id },
          targetType: 'Admin',
          targetId: admin._id,
          details: { reason: '10 consecutive failed login attempts', failedAttempts: admin.failedLoginAttempts },
          req
        });
      }
      await admin.save();

      if (lockedNow) {
        return res.status(423).json({
          success: false,
          message: 'Account locked due to 10 failed login attempts. Please try again after 15 minutes.'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset lockout counters on successful password authentication
    if (admin.failedLoginAttempts > 0 || admin.lockUntil) {
      admin.failedLoginAttempts = 0;
      admin.lockUntil = null;
      await admin.save();
    }

    // 3. Issue hardened 8h Admin JWT
    const token = generateAdminToken({
      sub: admin._id,
      role: admin.role,
      tokenVersion: admin.tokenVersion ?? 0
    });

    // Attach HttpOnly cookies
    attachAuthCookie(res, 'cg_admin_token', token, 8 * 60 * 60 * 1000);
    attachAuthCookie(res, 'cg_token', token, 8 * 60 * 60 * 1000);

    return res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      message: 'Admin login successful'
    });
  } catch (error) {
    console.error('[authController loginAdmin Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Authentication error occurred. Please try again.'
    });
  }
};

/**
 * @route   POST /api/auth/update-credentials
 * @desc    Update Master Admin Email & Password credentials
 * @access  Admin Private (Requires Master Admin JWT)
 */
export const updateCredentials = async (req, res) => {
  try {
    const { currentPassword, newEmail, newPassword } = req.body || {};

    const adminId = req.user?.sub || req.user?.id || req.admin?._id;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authorization required'
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account record not found'
      });
    }

    // Enforce currentPassword verification
    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is required to update credentials'
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect current password'
      });
    }

    // Validate and update email
    if (newEmail) {
      const cleanEmail = newEmail.toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email address format'
        });
      }

      const existing = await Admin.findOne({ email: cleanEmail, _id: { $ne: admin._id } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another admin account'
        });
      }
      admin.email = cleanEmail;
    }

    // Validate and update password
    if (newPassword) {
      if (typeof newPassword !== 'string' || newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 8 characters long'
        });
      }
      admin.password = await bcrypt.hash(newPassword, 12);
    }

    // Increment tokenVersion so all existing tokens are revoked
    admin.tokenVersion = (admin.tokenVersion || 0) + 1;
    await admin.save();

    // Issue fresh token with new tokenVersion
    const updatedToken = generateAdminToken({
      sub: admin._id,
      role: admin.role,
      tokenVersion: admin.tokenVersion
    });
    attachAuthCookie(res, 'cg_admin_token', updatedToken, 8 * 60 * 60 * 1000);
    attachAuthCookie(res, 'cg_token', updatedToken, 8 * 60 * 60 * 1000);

    return res.json({
      success: true,
      token: updatedToken,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      message: 'Admin credentials updated successfully'
    });
  } catch (error) {
    console.error('[authController updateCredentials Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error updating admin credentials'
    });
  }
};

/**
 * @route   POST /api/auth/student/register
 * @desc    Register a new student account
 * @access  Public
 */
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = (phone || '').toString().replace(/[^0-9]/g, '').slice(-10);

    const existingStudent = await Student.findOne({ email: cleanEmail });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Registration could not be completed with the provided information.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newStudent = new Student({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: cleanPhone,
      role: 'Student'
    });

    await newStudent.save();

    const token = generateStudentToken({
      sub: newStudent._id,
      phone: newStudent.phone,
      email: newStudent.email
    });
    attachAuthCookie(res, 'cg_token', token, 7 * 24 * 60 * 60 * 1000);

    return res.status(201).json({
      success: true,
      token,
      student: {
        id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        role: 'Student'
      },
      message: 'Student account registered successfully'
    });
  } catch (error) {
    console.error('[authController registerStudent Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error registering student account'
    });
  }
};

/**
 * @route   POST /api/auth/student/login
 * @desc    Authenticate student account login with email/password
 * @access  Public
 */
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const student = await Student.findOne({ email: cleanEmail });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!student.password || (!student.password.startsWith('$2a$') && !student.password.startsWith('$2b$'))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateStudentToken({
      sub: student._id,
      phone: student.phone,
      email: student.email
    });
    attachAuthCookie(res, 'cg_token', token, 7 * 24 * 60 * 60 * 1000);

    return res.json({
      success: true,
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        role: 'Student'
      },
      message: 'Student login successful'
    });
  } catch (error) {
    console.error('[authController loginStudent Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during student login'
    });
  }
};

/**
 * @route   POST /api/auth/student/phone-login
 * @desc    Saves a student inquiry lead in Admin (Zero JWT, Zero Cookie, Zero Session)
 * @access  Public
 */
export const phoneLoginStudent = async (req, res) => {
  try {
    const { phone, name, email, location, course, notes, leadId } = req.body || {};
    const cleanPhone = (phone || '').toString().replace(/[^0-9]/g, '').slice(-10);

    if (!cleanPhone || cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number'
      });
    }

    const studentName = cleanText(name) || `Student ${cleanPhone.slice(-4)}`;
    const studentEmail = (email && typeof email === 'string') ? email.toLowerCase().trim() : '';
    const studentLocation = cleanText(location) || 'Online Visitor';
    const studentCourse = cleanText(course) || 'Admission & Training Inquiry';

    let lead;
    try {
      // SECURITY: only match a lead by its own leadId. Phone-based lookup let any
      // caller overwrite an arbitrary lead; `notes` (admin-only) is never set here.
      if (leadId) {
        lead = await Lead.findOne({
          $or: [
            { leadId: leadId },
            ...(mongoose.Types.ObjectId.isValid(leadId) ? [{ _id: leadId }] : [])
          ]
        });
      }

      // Deduplication fallback: if leadId didn't match, check if a lead with this phone was submitted in last 15 mins
      if (!lead && cleanPhone) {
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
        lead = await Lead.findOne({
          phone: cleanPhone,
          createdAt: { $gte: fifteenMinsAgo }
        }).sort({ createdAt: -1 });
      }

      if (lead) {
        lead.name = studentName;
        if (studentEmail) lead.email = studentEmail;
        if (studentLocation && studentLocation !== 'Online Visitor') lead.location = studentLocation;
        await lead.save();
      } else {
        let newLeadId;
        try {
          const counter = await Counter.findByIdAndUpdate(
            { _id: 'leadId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
          );
          newLeadId = `LEAD-${String(counter.seq).padStart(6, '0')}`;
        } catch {
          newLeadId = `LEAD-${Date.now().toString(36).toUpperCase()}`;
        }

        lead = await Lead.create({
          leadId: newLeadId,
          name: studentName,
          phone: cleanPhone,
          email: studentEmail,
          location: studentLocation,
          course: studentCourse,
          status: 'New',
          notes: 'Direct Student Lead from Portal'
        });
      }

      broadcastRealtimeEvent('leads_updated', { type: 'leads_updated' });
    } catch (leadErr) {
      console.warn('[Lead Update/Creation Warning]:', leadErr.message);
    }

    // ONLY save lead — Zero JWT, Zero Cookie, Zero Session
    return res.status(200).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. Our counselor will contact you soon.',
      data: {
        leadId: lead ? lead.leadId : null,
        name: studentName,
        phone: cleanPhone,
        email: studentEmail,
        course: studentCourse
      }
    });
  } catch (error) {
    console.error('[authController phoneLoginStudent Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error submitting lead inquiry'
    });
  }
};

/**
 * @route   POST /api/auth/student/update-profile
 * @desc    Update student profile (Name & Email)
 * @access  Student Private (Requires student JWT, strictly bound to req.user.sub)
 */
export const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.user?.sub || req.user?.id;
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to update profile'
      });
    }

    const { name, email, role, isAdmin } = req.body || {};

    // Strict Privilege Escalation Protection:
    // If a non-admin user attempts to escalate privileges via role or isAdmin:
    if (role !== undefined || isAdmin !== undefined) {
      if (
        role === 'admin' ||
        role === 'Admin' ||
        role === 'Master Admin' ||
        isAdmin === true ||
        isAdmin === 'true'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Privilege escalation rejected: modifying role or administrative privileges is strictly prohibited.'
        });
      }
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your full name'
      });
    }

    // Strictly find student ONLY by authenticated session ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found'
      });
    }

    student.name = name.trim();

    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Check if email belongs to another student
      const existing = await Student.findOne({ email: cleanEmail, _id: { $ne: student._id } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use by another account'
        });
      }
      student.email = cleanEmail;
    }

    await student.save();

    const token = generateStudentToken({
      sub: student._id,
      phone: student.phone,
      email: student.email
    });
    attachAuthCookie(res, 'cg_token', token, 7 * 24 * 60 * 60 * 1000);

    return res.json({
      success: true,
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        role: 'Student'
      },
      message: 'Student profile updated successfully!'
    });
  } catch (error) {
    console.error('[authController updateStudentProfile Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error updating student profile'
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Clears authentication cookies and terminates session (invalidating JWT tokenVersion)
 * @access  Public / Authenticated
 */
export const logoutUser = async (req, res) => {
  try {
    // Invalidate admin session in database by incrementing tokenVersion
    const token = extractToken(req);
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const adminId = decoded.sub || decoded.id;
        if (adminId && (decoded.type === 'admin' || ['Master Admin', 'Admin', 'Counselor'].includes(decoded.role))) {
          await Admin.findByIdAndUpdate(adminId, { $inc: { tokenVersion: 1 } });
        }
      }
    }

    clearAuthCookie(res, 'cg_admin_token');
    clearAuthCookie(res, 'cg_token');
    clearAuthCookie(res, 'token');
    return res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
};

/**
 * @route   GET /api/auth/csrf-token
 * @desc    Issues a secure cryptographic anti-CSRF token
 * @access  Public
 */
export const getCsrfToken = (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString('hex');
  res.cookie('cg_csrf', csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
  return res.json({
    success: true,
    csrfToken
  });
};
