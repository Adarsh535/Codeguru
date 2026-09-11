/**
 * ============================================================================
 * MONGOOSE MODEL: STUDENT PLACEMENT (Placement.js)
 * ============================================================================
 * Mongoose Schema defining student placement drive achievers in MongoDB.
 */

import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentName: { type: String },
  company: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  role: { type: String, default: 'Software Engineer' },
  package: { type: String, required: true },
  photo: { type: String, default: '' },
  batch: { type: String, default: 'PLACEMENT BATCH 2026' }
}, {
  timestamps: true
});

export const Placement = mongoose.models.Placement || mongoose.model('Placement', placementSchema);
