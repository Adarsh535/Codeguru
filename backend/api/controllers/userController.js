/**
 * ============================================================================
 * API CONTROLLER: USER PROFILE CONTROLLER (userController.js)
 * ============================================================================
 * Provides secure profile retrieval with strict IDOR (Insecure Direct Object Reference)
 * protection. Ensures User A cannot inspect User B's profile.
 */

import mongoose from 'mongoose';
import { Student } from '../../models/Student.js';

/**
 * In-memory fallback users for offline / disconnected test environments
 */
export const inMemoryUsers = new Map();

/**
 * @route   GET /api/users/:id
 * @desc    Retrieves user profile by ID with strict IDOR ownership checks
 * @access  Authenticated User (Own Profile or Master Admin only)
 */
export const getUserById = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    if (!targetUserId || typeof targetUserId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID parameter'
      });
    }

    // Authenticated caller must exist
    if (!req.user || !req.user.sub) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const callerId = req.user.sub.toString();
    const callerRole = req.user.role;
    const isAdmin = callerRole === 'Master Admin' || callerRole === 'Admin' || req.user.type === 'admin';

    // Strict IDOR Check: Caller can only access their own profile unless they are an Admin
    if (!isAdmin && callerId !== targetUserId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to access another user\'s profile'
      });
    }

    // Try in-memory store first (for test mocks)
    if (inMemoryUsers.has(targetUserId)) {
      const user = inMemoryUsers.get(targetUserId);
      return res.status(200).json({
        success: true,
        data: {
          id: user._id || targetUserId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    }

    // Query MongoDB Atlas
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(targetUserId)) {
      const student = await Student.findById(targetUserId).select('-password');
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: {
          id: student._id.toString(),
          name: student.name,
          email: student.email,
          phone: student.phone,
          role: student.role
        }
      });
    }

    return res.status(404).json({
      success: false,
      message: 'User profile not found'
    });
  } catch (err) {
    console.error('[userController getUserById Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile'
    });
  }
};
