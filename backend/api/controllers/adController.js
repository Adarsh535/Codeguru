/**
 * ============================================================================
 * API CONTROLLER: ADVERTISEMENT CONTROLLER (adController.js)
 * ============================================================================
 * Manages website advertisement and promotional banners CRUD logic with
 * MongoDB Atlas / local persistence and real-time syncing.
 */

import { Ad } from '../../models/Ad.js';
import { broadcastRealtimeEvent } from '../../services/realtimeService.js';

// Default initial ad seed to preserve existing Arena Animation banner
const DEFAULT_INITIAL_AD = {
  title: 'Celebrating 25 Years - Arena Animation',
  subtitle: 'Animation, VFX, Gaming & Web Design Leading Institute',
  imageUrl: '/images/arena-25-years.jpg',
  linkUrl: 'https://www.arena-multimedia.com',
  badge: 'FEATURED PARTNER',
  position: 'home_featured',
  openInNewTab: true,
  active: true,
  displayOrder: 1,
  clicks: 0
};

/**
 * Auto-seed default ad if none exist in the collection
 */
const ensureDefaultAdExists = async () => {
  try {
    const count = await Ad.countDocuments();
    if (count === 0) {
      const seeded = await Ad.create(DEFAULT_INITIAL_AD);
      console.log('✅ [adController] Seeded default Arena Animation ad banner in database');
      return [seeded];
    }
  } catch (err) {
    console.warn('[adController] Error auto-seeding ad banner:', err.message);
  }
  return null;
};

/**
 * @route   GET /api/ads
 * @desc    Retrieves all promotional ads for Admin CRM or website
 * @access  Public
 */
export const getAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ displayOrder: 1, createdAt: -1 });

    return res.json({
      success: true,
      count: ads.length,
      data: ads
    });
  } catch (err) {
    console.error('[adController getAds Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      data: [DEFAULT_INITIAL_AD]
    });
  }
};

/**
 * @route   GET /api/ads/active
 * @desc    Retrieves active promotional ads filtered by position
 * @access  Public
 */
export const getActiveAds = async (req, res) => {
  try {
    const position = req.query.position || 'home_featured';
    let query = { active: true };
    if (position && position !== 'all') {
      query.position = position;
    }

    let ads = await Ad.find(query).sort({ displayOrder: 1, createdAt: -1 });

    return res.json({
      success: true,
      data: ads
    });
  } catch (err) {
    console.error('[adController getActiveAds Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      data: [DEFAULT_INITIAL_AD]
    });
  }
};

/**
 * @route   POST /api/ads
 * @desc    Creates a new promotional ad banner
 * @access  Admin Private
 */
export const createAd = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      imageUrl,
      linkUrl,
      badge,
      position,
      openInNewTab,
      active,
      displayOrder
    } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL or banner upload is required.'
      });
    }

    const newAd = await Ad.create({
      title: title || 'New Promotional Ad',
      subtitle: subtitle || '',
      imageUrl,
      linkUrl: linkUrl || '',
      badge: badge || 'SPECIAL FEATURE',
      position: position || 'home_featured',
      openInNewTab: openInNewTab !== undefined ? Boolean(openInNewTab) : true,
      active: active !== undefined ? Boolean(active) : true,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
      clicks: 0
    });

    broadcastRealtimeEvent('ads', newAd);

    return res.status(201).json({
      success: true,
      message: 'Ad banner created successfully',
      data: newAd
    });
  } catch (err) {
    console.error('[adController createAd Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * @route   PUT /api/ads/:id
 * @desc    Updates existing ad banner by ID
 * @access  Admin Private
 */
export const updateAd = async (req, res) => {
  try {
    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedAd) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement banner not found'
      });
    }

    broadcastRealtimeEvent('ads', updatedAd);

    return res.json({
      success: true,
      message: 'Ad banner updated successfully',
      data: updatedAd
    });
  } catch (err) {
    console.error('[adController updateAd Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * @route   DELETE /api/ads/:id
 * @desc    Deletes an ad banner by ID
 * @access  Admin Private
 */
export const deleteAd = async (req, res) => {
  try {
    const deleted = await Ad.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Ad banner not found'
      });
    }

    broadcastRealtimeEvent('ads', { id: req.params.id, deleted: true });

    return res.json({
      success: true,
      message: 'Ad banner deleted successfully'
    });
  } catch (err) {
    console.error('[adController deleteAd Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * @route   POST /api/ads/:id/click
 * @desc    Increments click analytics counter for an ad banner
 * @access  Public
 */
export const trackAdClick = async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
