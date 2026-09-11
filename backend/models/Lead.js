/**
 * ============================================================================
 * MONGOOSE MODEL: STUDENT LEAD INQUIRY (Lead.js)
 * ============================================================================
 * Mongoose Schema defining student admission inquiry records in MongoDB.
 */

import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  leadId: { type: String, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, default: 'Lucknow, UP' },
  course: { type: String, default: 'Full Stack Web Development' },
  status: { type: String, enum: ['New', 'Contacted', 'In Progress', 'Enrolled'], default: 'New' },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
