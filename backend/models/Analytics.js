/**
 * ============================================================================
 * MONGOOSE MODEL: WEBSITE VISITOR ANALYTICS (Analytics.js)
 * ============================================================================
 * Stores granular page view tracking events and daily analytics rollups
 * for CodeGuru Admin Dashboard visitor analytics.
 */

import mongoose from 'mongoose';

// 1. PageView Event Schema (records individual page visit events)
const pageViewSchema = new mongoose.Schema({
  visitorId: { 
    type: String, 
    required: true, 
    index: true 
  },
  sessionId: { 
    type: String, 
    required: true, 
    index: true 
  },
  path: { 
    type: String, 
    required: true, 
    trim: true,
    index: true 
  },
  url: { 
    type: String, 
    trim: true 
  },
  title: { 
    type: String, 
    trim: true 
  },
  referrer: { 
    type: String, 
    default: 'Direct' 
  },
  referrerCategory: {
    type: String,
    enum: ['Direct', 'Search', 'Social', 'Referral', 'Other'],
    default: 'Direct'
  },
  device: { 
    type: String, 
    enum: ['desktop', 'mobile', 'tablet'], 
    default: 'desktop' 
  },
  browser: { 
    type: String, 
    default: 'Other' 
  },
  os: { 
    type: String, 
    default: 'Other' 
  },
  ipHash: { 
    type: String, 
    index: true 
  },
  date: { 
    type: String, 
    required: true, 
    index: true 
  },
  isNewVisitor: { 
    type: Boolean, 
    default: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now, 
    index: true 
  }
}, {
  timestamps: true
});

// Compound indexes for optimal query aggregation performance
pageViewSchema.index({ date: 1, visitorId: 1 });
pageViewSchema.index({ date: 1, path: 1 });
pageViewSchema.index({ date: 1, device: 1 });
pageViewSchema.index({ date: 1, timestamp: -1 });

export const PageView = mongoose.models.PageView || mongoose.model('PageView', pageViewSchema);

// 2. Daily Metric Aggregate Schema (pre-aggregated daily rollups for ultra-fast queries)
const dailyMetricSchema = new mongoose.Schema({
  date: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  totalPageViews: { 
    type: Number, 
    default: 0 
  },
  uniqueVisitorsCount: { 
    type: Number, 
    default: 0 
  },
  newVisitorsCount: { 
    type: Number, 
    default: 0 
  },
  returningVisitorsCount: { 
    type: Number, 
    default: 0 
  },
  desktopViews: { 
    type: Number, 
    default: 0 
  },
  mobileViews: { 
    type: Number, 
    default: 0 
  },
  tabletViews: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

export const DailyMetric = mongoose.models.DailyMetric || mongoose.model('DailyMetric', dailyMetricSchema);
