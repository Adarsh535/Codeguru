/**
 * ============================================================================
 * MONGOOSE MODEL: TRAFFIC ANALYTICS (Traffic.js)
 * ============================================================================
 * Mongoose Schema defining daily website visitor metrics & course search analytics.
 */

import mongoose from 'mongoose';

const trafficSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  pageViews: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  cities: [{
    name: String,
    count: Number
  }],
  searchedCourses: [{
    query: String,
    count: Number
  }]
}, {
  timestamps: true
});

export const Traffic = mongoose.models.Traffic || mongoose.model('Traffic', trafficSchema);
