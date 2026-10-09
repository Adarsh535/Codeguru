/**
 * ============================================================================
 * MONGOOSE MODEL: COURSE CATEGORY (Category.js)
 * ============================================================================
 * Mongoose Schema defining course categories and sub-categories in MongoDB.
 */

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: { type: String },
  label: { type: String, required: true },
  category: { type: String, required: true },
  subCat: { type: String, default: 'all' },
  subCategories: [{
    id: { type: String },
    label: { type: String }
  }],
  badge: { type: String, default: '' },
  icon: { type: String, default: '' },
  bgColor: { type: String, default: 'bg-blue-50' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
