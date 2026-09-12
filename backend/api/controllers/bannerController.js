/**
 * ============================================================================
 * API CONTROLLER: BANNER CONTROLLER (bannerController.js)
 * ============================================================================
 * Manages homepage hero section banners CRUD logic with MongoDB Atlas persistence.
 */

import { Banner } from '../../models/Banner.js';

/**
 * @route   GET /api/banners
 * @desc    Retrieves all homepage slide banners from MongoDB Atlas sorted by creation date.
 * @access  Public
 */
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: banners });
  } catch (err) {
    console.error('[bannerController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message, data: [] });
  }
};

/**
 * @route   POST /api/banners
 * @desc    Creates a new image or video banner slide in MongoDB Atlas.
 * @access  Admin Private
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
    return res.status(201).json({ success: true, message: 'Banner added to MongoDB Atlas', data: banner });
  } catch (err) {
    console.error('[bannerController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   PUT /api/banners/:id
 * @desc    Updates banner details in MongoDB Atlas by ID.
 * @access  Admin Private
 */
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (banner) return res.json({ success: true, message: 'Banner updated in MongoDB Atlas', data: banner });
    return res.status(404).json({ success: false, message: 'Banner not found' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   DELETE /api/banners/:id
 * @desc    Deletes a hero banner slide from MongoDB Atlas by ID.
 * @access  Admin Private
 */
export const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
