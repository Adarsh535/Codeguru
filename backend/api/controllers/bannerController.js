/**
 * ============================================================================
 * API CONTROLLER: BANNER CONTROLLER (bannerController.js)
 * ============================================================================
 * Manages homepage hero section banners CRUD logic with MongoDB Atlas persistence.
 */

import { Banner } from '../../models/Banner.js';
import { broadcastRealtimeEvent } from '../../services/realtimeService.js';

/**
 * @route   GET /api/banners
 * @desc    Retrieves all homepage slide banners from MongoDB Atlas sorted by creation date.
 * @access  Public
 */
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
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
    const mediaUrl = req.body.mediaUrl || '';
    const isVideo = req.body.type === 'video' || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(mediaUrl) || (typeof mediaUrl === 'string' && mediaUrl.includes('/video/'));

    const banner = await Banner.create({
      title: req.body.title !== undefined ? String(req.body.title).trim() : '',
      subtitle: req.body.subtitle !== undefined ? String(req.body.subtitle).trim() : '',
      type: isVideo ? 'video' : (req.body.type || 'image'),
      mediaUrl: mediaUrl,
      videoUrl: req.body.videoUrl || (isVideo ? mediaUrl : ''),
      imageUrl: req.body.imageUrl || (!isVideo ? mediaUrl : ''),
      badge: req.body.badge !== undefined ? String(req.body.badge).trim() : '',
      ctaText: req.body.ctaText !== undefined ? String(req.body.ctaText).trim() : '',
      order: req.body.order !== undefined ? (Number(req.body.order) || 0) : 0,
      active: true
    });

    broadcastRealtimeEvent('banners', banner);

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
    const updateData = { ...req.body };
    if (updateData.title !== undefined) updateData.title = String(updateData.title).trim();
    if (updateData.subtitle !== undefined) updateData.subtitle = String(updateData.subtitle).trim();
    if (updateData.badge !== undefined) updateData.badge = String(updateData.badge).trim();
    if (updateData.ctaText !== undefined) updateData.ctaText = String(updateData.ctaText).trim();
    if (updateData.order !== undefined) updateData.order = Number(updateData.order) || 0;

    const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (banner) {
      broadcastRealtimeEvent('banners', banner);
      return res.json({ success: true, message: 'Banner updated in MongoDB Atlas', data: banner });
    }
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
    broadcastRealtimeEvent('banners', { id: req.params.id, deleted: true });
    return res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
