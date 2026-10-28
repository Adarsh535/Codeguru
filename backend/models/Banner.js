/**
 * ============================================================================
 * MONGOOSE MODEL: HERO BANNER (Banner.js)
 * ============================================================================
 * Mongoose Schema defining homepage image & video promotional sliders in MongoDB.
 */

import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  mediaUrl: { type: String, required: true },
  videoUrl: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  badge: { type: String, default: '' },
  ctaText: { type: String, default: '' },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
