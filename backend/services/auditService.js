/**
 * ============================================================================
 * SERVICE: AUDIT LOGGING SERVICE (auditService.js)
 * ============================================================================
 * Provides central helper to record administrative actions into MongoDB.
 * Captures:
 * - Who (kisne): admin identity (email, id, name)
 * - What (kya): action performed, target resource, modification diff/details
 * - When (kab): timestamp (createdAt)
 */

import mongoose from 'mongoose';
import { AuditLog } from '../models/AuditLog.js';

// In-memory buffer for test and offline operation
export const inMemoryAuditLogs = [];

/**
 * Record an audit log entry in MongoDB (with memory fallback when disconnected)
 * @param {Object} params
 * @param {string} params.action - Action name (USER_DELETE, ROLE_CHANGE, CONTENT_EDIT, etc.)
 * @param {Object} [params.admin] - Admin object or payload
 * @param {string} params.targetType - Type of modified entity (User, Course, Settings, etc.)
 * @param {string|mongoose.Types.ObjectId} [params.targetId] - ID of affected entity
 * @param {Object|string} [params.details] - Metadata or description of the action
 * @param {Object} [params.req] - Express request object (extracts IP and user-agent)
 */
export const recordAuditLog = async ({
  action,
  admin,
  targetType,
  targetId,
  details = {},
  req
}) => {
  try {
    const adminEmail = (admin?.email || req?.admin?.email || req?.user?.email || 'system@codegurru.in').toLowerCase().trim();
    const adminId = admin?._id || req?.admin?._id || req?.user?.id || req?.user?.sub || null;
    const adminName = admin?.name || req?.admin?.name || req?.user?.name || 'Administrator';
    
    // Extract client IP cleanly
    const forwarded = req?.headers?.['x-forwarded-for'];
    const ip = forwarded
      ? (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : forwarded[0])
      : (req?.socket?.remoteAddress || req?.ip || '127.0.0.1');

    const userAgent = req?.headers?.['user-agent'] || 'API Client';

    const logPayload = {
      action,
      adminId,
      adminEmail,
      adminName,
      targetType,
      targetId: targetId ? targetId.toString() : null,
      details,
      ip,
      userAgent,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return await AuditLog.create(logPayload);
    }

    inMemoryAuditLogs.push(logPayload);
    return logPayload;
  } catch (error) {
    console.error('[auditService Error]: Failed to create audit log entry:', error.message);
    return null;
  }
};
