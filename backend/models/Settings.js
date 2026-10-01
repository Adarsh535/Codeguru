/**
 * ============================================================================
 * MONGOOSE MODEL: SYSTEM SETTINGS (Settings.js)
 * ============================================================================
 * Mongoose Schema defining dynamic system & admin configuration in MongoDB.
 */

import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  adminPhone: { type: String, required: true, default: '9670912923' },
  adminEmail: { type: String, default: 'admin@codeguru.com' },
  siteTitle: { type: String, default: 'CodeGuru Student Placement & Learning Platform' },
  whatsappNotificationEnabled: { type: Boolean, default: true },
  autoWhatsappRedirect: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
