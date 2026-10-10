/**
 * ============================================================================
 * API ROUTER: AUTHENTICATION ROUTES (authRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Master Admin authentication & security credentials.
 */

import express from 'express';
import { 
  loginAdmin, 
  updateCredentials, 
  registerStudent, 
  loginStudent,
  sendStudentOtp,
  verifyStudentOtp,
  updateStudentProfile
} from '../controllers/authController.js';

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
 * @access Admin Private
 */
router.post('/update-credentials', updateCredentials);

/**
 * @api    POST /api/auth/student/register
 * @desc   Registers a new student account into MongoDB students collection
 * @access Public
 */
router.post('/student/register', registerStudent);

/**
 * @api    POST /api/auth/student/login
 * @desc   Authenticates student user against MongoDB students collection
 * @access Public
 */
router.post('/student/login', loginStudent);

/**
 * @api    POST /api/auth/student/send-otp
 * @desc   Sends 4-digit mobile verification OTP to student phone
 * @access Public
 */
router.post('/student/send-otp', sendStudentOtp);

/**
 * @api    POST /api/auth/student/verify-otp
 * @desc   Verifies OTP code and logs in/registers student
 * @access Public
 */
router.post('/student/verify-otp', verifyStudentOtp);
router.post('/student/update-profile', updateStudentProfile);

export default router;
