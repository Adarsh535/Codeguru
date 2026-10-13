/**
 * ============================================================================
 * API ROUTER: AUTHENTICATION ROUTES (authRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Master Admin and Student authentication.
 * Hardened with RBAC, secure cryptographic token management, and cookies.
 */

import express from 'express';
import { 
  loginAdmin, 
  updateCredentials, 
  registerStudent, 
  loginStudent,
  sendStudentOtp,
  verifyStudentOtp,
  updateStudentProfile,
  logoutUser
} from '../controllers/authController.js';
import { requireAdmin, requireAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @api    POST /api/auth/login
 * @desc   Authenticates master admin user against MongoDB admins collection
 * @access Public
 */
router.post('/login', loginAdmin);

/**
 * @api    POST /api/auth/update-credentials
 * @desc   Updates master admin email address or password
 * @access Admin Private (Strict Master Admin JWT required)
 */
router.post('/update-credentials', requireAdmin, updateCredentials);

/**
 * @api    POST /api/auth/student/register
 * @desc   Registers a new student account
 * @access Public
 */
router.post('/student/register', registerStudent);

/**
 * @api    POST /api/auth/student/login
 * @desc   Authenticates student user
 * @access Public
 */
router.post('/student/login', loginStudent);

/**
 * @api    POST /api/auth/student/send-otp
 * @desc   Sends 6-digit verification OTP to student phone
 * @access Public
 */
router.post('/student/send-otp', sendStudentOtp);

/**
 * @api    POST /api/auth/student/verify-otp
 * @desc   Verifies OTP code and logs in/registers student
 * @access Public
 */
router.post('/student/verify-otp', verifyStudentOtp);

/**
 * @api    POST /api/auth/student/update-profile
 * @desc   Updates student name and email
 * @access Authenticated Student
 */
router.post('/student/update-profile', requireAuth, updateStudentProfile);

/**
 * @api    POST /api/auth/logout
 * @desc   Clears authentication cookies and logs user out
 * @access Public
 */
router.post('/logout', logoutUser);

export default router;
