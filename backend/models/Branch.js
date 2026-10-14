/**
 * ============================================================================
 * MONGOOSE MODEL: REGIONAL BRANCH (Branch.js)
 * ============================================================================
 * Mongoose Schema defining CodeGuru training campus & branch locations in MongoDB.
 */

import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  address: { type: String, required: true },
  category: { type: String, default: 'REGIONAL BRANCH & CAMPUS' },
  phone: { type: String, default: '+91 72388 29360' },
  email: { type: String, default: 'info@codegurru.in' }
}, {
  timestamps: true
});

export const Branch = mongoose.models.Branch || mongoose.model('Branch', branchSchema);
