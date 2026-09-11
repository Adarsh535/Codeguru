/**
 * ============================================================================
 * MONGOOSE MODEL: NAVIGATION MENU (NavMenu.js)
 * ============================================================================
 * Mongoose Schema defining dynamic website navbar menus in MongoDB.
 */

import mongoose from 'mongoose';

const navMenuSchema = new mongoose.Schema({
  menuId: { type: String, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, default: 'code' },
  items: [{ type: String }]
}, {
  timestamps: true
});

export const NavMenu = mongoose.models.NavMenu || mongoose.model('NavMenu', navMenuSchema);
