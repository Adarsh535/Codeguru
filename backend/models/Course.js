/**
 * ============================================================================
 * MONGOOSE MODEL: TRAINING COURSE (Course.js)
 * ============================================================================
 * Mongoose Schema defining offered technology training courses in MongoDB.
 */

import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'coding' },
  subCat: { type: String, default: 'web' },
  duration: { type: String, default: '6 Months' },
  price: { type: String, required: true },
  level: { type: String, default: 'Beginner to Advanced' },
  badge: { type: String, default: 'Job Guarantee Batch' },
  description: { type: String, default: '' },
  technologies: [{ type: String }]
}, {
  timestamps: true
});

export const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
