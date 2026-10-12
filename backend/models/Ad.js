/**
 * ============================================================================
 * MONGOOSE MODEL: ADVERTISEMENT (Ad.js)
 * ============================================================================
 * Mongoose Schema defining dynamic promotional and advertisement banners
 * displayed across the website (e.g. Featured Arena 25-Year Banner).
 */

import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    default: 'Celebrating 25 Years - Arena Animation' 
  },
  subtitle: { 
    type: String, 
    default: 'Premier Animation, VFX & Gaming Training Partner' 
  },
  imageUrl: { 
    type: String, 
    required: true,
    default: '/images/arena-25-years.jpg'
  },
  linkUrl: { 
    type: String, 
    default: '' 
  },
  badge: { 
    type: String, 
    default: 'SPECIAL FEATURE' 
  },
  position: { 
    type: String, 
    default: 'home_featured' // e.g. home_featured, popup, header
  },
  openInNewTab: { 
    type: Boolean, 
    default: true 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  displayOrder: { 
    type: Number, 
    default: 0 
  },
  clicks: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

export const Ad = mongoose.models.Ad || mongoose.model('Ad', adSchema);
