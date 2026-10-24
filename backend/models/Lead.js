/**
 * ============================================================================
 * MONGOOSE MODEL: STUDENT LEAD INQUIRY (Lead.js)
 * ============================================================================
 * Mongoose Schema defining student admission inquiry records in MongoDB.
 * Captures student's city, state, coordinates, and location_source (gps / manual / ip).
 */

import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  leadId: { type: String, unique: true },
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  location_source: {
    type: String,
    enum: ['gps', 'manual', 'ip', 'unknown'],
    default: 'unknown'
  },
  location: { type: String, default: '' },
  course: { type: String, default: 'Full Stack Web Development' },
  status: { type: String, enum: ['New', 'Contacted', 'In Progress', 'Enrolled'], default: 'New' },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

// Require at least one of phone or email (B20)
leadSchema.pre('validate', function(next) {
  const phone = (this.phone || '').trim();
  const email = (this.email || '').trim();
  if (!phone && !email) {
    this.invalidate('phone', 'Either a contact phone number or email address is required.');
  }
  if (typeof next === 'function') {
    next();
  }
});

// Compound and lookup indexes (Section 2.7)
leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1 });
leadSchema.index({ phone: 1 });

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
