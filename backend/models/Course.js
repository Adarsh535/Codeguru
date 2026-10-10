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
  highlights: [{ type: String }],
  subtitle: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  featurePills: [{ type: String }],
  whatYouWillLearn: [{ type: String }],
  syllabusModules: [{
    title: { type: String },
    desc: { type: String }
  }],
  projectsList: [{
    name: { type: String },
    tech: { type: String },
    desc: { type: String }
  }],
  batchClasses: { type: String, default: 'Live + Recorded' },
  batchTimings: { type: String, default: 'Morning/Evening' },
  batchMode: { type: String, default: 'Online / Offline' },
  certificateProvided: { type: String, default: 'Provided' }
}, {
  timestamps: true,
  strict: false
});

export const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
