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
  subCategories: [{ type: String }],
  duration: { type: String, default: '6 Months' },
  price: { type: String, required: true },
  level: { type: String, default: 'Beginner to Advanced' },
  badge: { type: String, default: 'Job Guarantee Batch' },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  icon: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  showPrice: { type: Boolean, default: true },
  discountPercent: { type: Number, default: 0 },
  originalPrice: { type: String, default: '' },
  isDiscountActive: { type: Boolean, default: false },
  internships: { type: String, default: '5 Internships' },
  mockTests: { type: String, default: '5 Mock Tests' },
  projects: { type: String, default: '5 Projects' },
  highlights: [{ type: String }]
}, {
  timestamps: true
});

export const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
