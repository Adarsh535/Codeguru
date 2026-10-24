/**
 * ============================================================================
 * MONGOOSE MODEL: CODE / ASSIGNMENT SUBMISSION (Submission.js)
 * ============================================================================
 * Stores student code submissions with owner studentId for IDOR protection.
 */

import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  assignmentId: {
    type: String,
    default: 'ASSIGN-DEFAULT'
  },
  courseId: {
    type: String,
    default: 'COURSE-DEFAULT'
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'cpp', 'java', 'c']
  },
  code: {
    type: String,
    required: true
  },
  output: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Submitted', 'Evaluating', 'Passed', 'Failed'],
    default: 'Submitted'
  },
  executionTimeMs: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

submissionSchema.index({ studentId: 1, createdAt: -1 });

export const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
