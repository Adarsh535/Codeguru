/**
 * ============================================================================
 * API CONTROLLER: SUBMISSION CONTROLLER (submissionController.js)
 * ============================================================================
 * Handles code & assignment submissions with IDOR protection.
 * Ensures User A cannot access User B's code submissions.
 */

import mongoose from 'mongoose';
import { Submission } from '../../models/Submission.js';

/**
 * In-memory fallback submissions map for offline test execution
 */
export const inMemorySubmissions = new Map();

/**
 * @route   GET /api/submissions/:id
 * @desc    Retrieves code submission by ID with strict IDOR ownership checks
 * @access  Authenticated User (Owner or Master Admin only)
 */
export const getSubmissionById = async (req, res) => {
  try {
    const submissionId = req.params.id;

    if (!submissionId || typeof submissionId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission ID parameter'
      });
    }

    if (!req.user || !req.user.sub) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const callerId = req.user.sub.toString();
    const callerRole = req.user.role;
    const isAdmin = callerRole === 'Master Admin' || callerRole === 'Admin' || req.user.type === 'admin';

    // 1. Check in-memory store (for unit tests)
    let submission = inMemorySubmissions.get(submissionId);

    // 2. Query MongoDB if not found in memory
    if (!submission && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(submissionId)) {
      submission = await Submission.findById(submissionId).lean();
    }

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Strict IDOR Check
    const ownerId = (submission.studentId?._id || submission.studentId || '').toString();
    if (!isAdmin && callerId !== ownerId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to access another user\'s submission'
      });
    }

    return res.status(200).json({
      success: true,
      data: submission
    });
  } catch (err) {
    console.error('[submissionController getSubmissionById Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve submission'
    });
  }
};

/**
 * @route   POST /api/submissions
 * @desc    Creates a new code submission tied to authenticated student
 * @access  Authenticated Student
 */
export const createSubmission = async (req, res) => {
  try {
    const { language, code, assignmentId, courseId } = req.body || {};

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        message: 'Language and code are required'
      });
    }

    const callerId = req.user.sub.toString();
    const newSubmission = {
      _id: new mongoose.Types.ObjectId().toString(),
      studentId: callerId,
      assignmentId: assignmentId || 'ASSIGN-DEFAULT',
      courseId: courseId || 'COURSE-DEFAULT',
      language,
      code,
      status: 'Submitted',
      createdAt: new Date()
    };

    inMemorySubmissions.set(newSubmission._id, newSubmission);

    if (mongoose.connection.readyState === 1) {
      const dbDoc = new Submission({
        studentId: callerId,
        assignmentId: newSubmission.assignmentId,
        courseId: newSubmission.courseId,
        language,
        code,
        status: 'Submitted'
      });
      await dbDoc.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Submission received successfully',
      data: newSubmission
    });
  } catch (err) {
    console.error('[submissionController createSubmission Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create submission'
    });
  }
};
