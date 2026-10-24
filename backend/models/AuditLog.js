/**
 * ============================================================================
 * MONGOOSE MODEL: AUDIT LOG (AuditLog.js)
 * ============================================================================
 * Immutable system action audit trail.
 * Records administrative modifications, deletions, role changes, and content edits:
 * - Who (kisne): adminId, adminEmail, adminName
 * - What (kya): action, targetType, targetId, details
 * - When (kab): timestamp (createdAt)
 */

import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'USER_DELETE',
      'ROLE_CHANGE',
      'CONTENT_EDIT',
      'SETTINGS_UPDATE',
      'CREDENTIAL_UPDATE',
      'SECURITY_LOCKOUT',
      'ENROLLMENT_DELETE',
      'LEAD_DELETE'
    ]
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  adminEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    default: 'system@codegurru.in'
  },
  adminName: {
    type: String,
    default: 'Administrator'
  },
  targetType: {
    type: String,
    required: true // 'User', 'Student', 'Admin', 'Course', 'Banner', 'Settings', etc.
  },
  targetId: {
    type: String,
    default: null
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ip: {
    type: String,
    default: '127.0.0.1'
  },
  userAgent: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Provides createdAt (kab) and updatedAt
});

// Index for fast query by action, target, and timestamp
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ adminEmail: 1, createdAt: -1 });

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
