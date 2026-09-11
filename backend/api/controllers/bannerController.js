/**
 * ============================================================================
 * API CONTROLLER: BANNER CONTROLLER (bannerController.js)
 * ============================================================================
 * Manages homepage hero section banners (Image & Video banners) CRUD logic
 * with MongoDB Mongoose persistence & JSON Store dual fallback.
 */

import { Banner } from '../../models/Banner.js';
import { getDB, saveDB } from '../../db/jsonStore.js';

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Get All Banners
 * --------------------------------------------------------------------------
 * @route   GET /api/banners
 * @desc    Retrieves all homepage slide banners sorted by creation date.
 * @access  Public
 * @returns {JSON} { success: boolean, data: Array<Object> }
 */
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    if (banners && banners.length > 0) {
      return res.json({ success: true, data: banners });
    }
  } catch (e) {
    console.warn('[bannerController Warning] MongoDB query error, using JSON store fallback:', e.message);
  }
  const db = getDB();
  res.json({ success: true, data: db.banners || [] });
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Add New Banner
 * --------------------------------------------------------------------------
 * @route   POST /api/banners
 * @desc    Creates a new image or video banner slide in database.
 * @access  Admin Private
 * @param   {Object} req.body - { title, subtitle, type, mediaUrl, badge, ctaText }
 * @returns {JSON} { success: boolean, message: string, data: Object }
 */
export const addBanner = async (req, res) => {
  try {
    const banner = await Banner.create({
      title: req.body.title || 'New Banner Title',
      subtitle: req.body.subtitle || '',
      type: req.body.type || 'image',
      mediaUrl: req.body.mediaUrl || '',
      badge: req.body.badge || 'PROMOTION',
      ctaText: req.body.ctaText || 'Learn More',
      active: true
    });
    
    // Mirror to JSON Store
    const db = getDB();
    db.banners = [banner, ...(db.banners || [])];
    saveDB(db);

    return res.status(201).json({ success: true, message: 'Banner added to MongoDB', data: banner });
  } catch (err) {
    console.warn('[bannerController Warning] Fallback adding banner to JSON Store:', err.message);
    const db = getDB();
    const newBanner = {
      id: `b-${Date.now()}`,
      title: req.body.title || 'New Banner Title',
      subtitle: req.body.subtitle || '',
      type: req.body.type || 'image',
      mediaUrl: req.body.mediaUrl || '',
      badge: req.body.badge || 'PROMOTION',
      ctaText: req.body.ctaText || 'Learn More',
      active: true,
      createdAt: new Date().toISOString()
    };
    db.banners = [newBanner, ...(db.banners || [])];
    saveDB(db);
    return res.status(201).json({ success: true, message: 'Banner added to JSON Store', data: newBanner });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Update Banner Details
 * --------------------------------------------------------------------------
 * @route   PUT /api/banners/:id
 * @desc    Updates banner details by ID.
 * @access  Admin Private
 * @param   {string} req.params.id - Banner MongoDB _id or local ID
 * @returns {JSON} { success: boolean, message: string, data?: Object }
 */
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (banner) return res.json({ success: true, message: 'Banner updated in MongoDB', data: banner });
  } catch (e) {}

  const db = getDB();
  const index = (db.banners || []).findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    db.banners[index] = { ...db.banners[index], ...req.body };
    saveDB(db);
    return res.json({ success: true, message: 'Banner updated in JSON Store', data: db.banners[index] });
  }

  res.status(404).json({ success: false, message: 'Banner not found' });
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Delete Banner
 * --------------------------------------------------------------------------
 * @route   DELETE /api/banners/:id
 * @desc    Deletes a hero banner slide by ID.
 * @access  Admin Private
 * @param   {string} req.params.id - Banner MongoDB _id or local ID
 * @returns {JSON} { success: boolean, message: string }
 */
export const deleteBanner = async (req, res) => {
  try {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      await Banner.findByIdAndDelete(req.params.id);
    } else {
      await Banner.deleteMany({ id: req.params.id });
    }
  } catch (e) {
    console.warn('[bannerController Warning] Error deleting banner from MongoDB:', e.message);
  }

  const db = getDB();
  db.banners = (db.banners || []).filter(b => b.id !== req.params.id && b._id?.toString() !== req.params.id);
  saveDB(db);

  res.json({ success: true, message: 'Banner deleted successfully' });
};
