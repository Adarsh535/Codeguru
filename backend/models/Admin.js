/**
 * ============================================================================
 * MONGOOSE MODEL: ADMIN ACCOUNT (Admin.js)
 * ============================================================================
 * Mongoose Schema defining master admin authentication accounts in MongoDB.
 */

import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Super Admin' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Master Admin', 'Admin', 'Counselor'], default: 'Admin' },
  tokenVersion: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null }
}, {
  timestamps: true
});

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
