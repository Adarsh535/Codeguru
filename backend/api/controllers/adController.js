/**
 * ============================================================================
 * API CONTROLLER: ADVERTISEMENT CONTROLLER (adController.js)
 * ============================================================================
 * Manages website advertisement and promotional banners CRUD logic with
 * MongoDB Atlas / local persistence and real-time syncing.
 */

import mongoose from 'mongoose';
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

// In-memory cache for daily click throttling per IP+Ad (Section 2.5, B-T)
const adClickCache = new Map();
setInterval(() => {
  adClickCache.clear();
}, 24 * 60 * 60 * 1000); // Reset daily

/**
 * @route   GET /api/ads
 * @desc    Retrieves all promotional ads for Admin CRM or website
 * @access  Public
 */
export const getAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
    return res.json({
      success: true,
      count: ads.length,
      data: ads
    });
  } catch (err) {
    console.error('[adController getAds Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve advertisements',
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
    // Cast query.position strictly to string to avoid NoSQL object injection (Section 2.6)
    const position = typeof req.query.position === 'string' ? req.query.position.trim() : 'home_featured';
    let query = { active: true };
    if (position && position !== 'all') {
      query.position = position;
    }

    let ads = await Ad.find(query).sort({ displayOrder: 1, createdAt: -1 }).lean();

    return res.json({
      success: true,
      data: ads
    });
  } catch (err) {
    console.error('[adController getActiveAds Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve active advertisements',
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
      title: typeof title === 'string' ? title.trim() : 'New Promotional Ad',
      subtitle: typeof subtitle === 'string' ? subtitle.trim() : '',
      imageUrl: typeof imageUrl === 'string' ? imageUrl.trim() : '',
      linkUrl: typeof linkUrl === 'string' ? linkUrl.trim() : '',
      badge: typeof badge === 'string' ? badge.trim() : 'SPECIAL FEATURE',
      position: typeof position === 'string' ? position.trim() : 'home_featured',
      openInNewTab: openInNewTab !== undefined ? Boolean(openInNewTab) : true,
      active: active !== undefined ? Boolean(active) : true,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
      clicks: 0
    });

    broadcastRealtimeEvent('ads_updated', { type: 'ads_updated' });

    return res.status(201).json({
      success: true,
      message: 'Ad banner created successfully',
      data: newAd
    });
  } catch (err) {
    console.error('[adController createAd Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create ad banner'
    });
  }
};

/**
 * @route   PUT /api/ads/:id
 * @desc    Updates existing ad banner by ID (whitelisted fields only)
 * @access  Admin Private
 */
export const updateAd = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Ad ID' });
    }

    // Whitelist allowed fields only (B22)
    const allowed = {};
    const b = req.body || {};
    if (typeof b.title === 'string') allowed.title = b.title.trim();
    if (typeof b.subtitle === 'string') allowed.subtitle = b.subtitle.trim();
    if (typeof b.imageUrl === 'string') allowed.imageUrl = b.imageUrl.trim();
    if (typeof b.linkUrl === 'string') allowed.linkUrl = b.linkUrl.trim();
    if (typeof b.badge === 'string') allowed.badge = b.badge.trim();
    if (typeof b.position === 'string') allowed.position = b.position.trim();
    if (b.openInNewTab !== undefined) allowed.openInNewTab = Boolean(b.openInNewTab);
    if (b.active !== undefined) allowed.active = Boolean(b.active);
    if (b.displayOrder !== undefined) allowed.displayOrder = Number(b.displayOrder);

    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id,
      { $set: allowed },
      { new: true, runValidators: true }
    );

    if (!updatedAd) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement banner not found'
      });
    }

    broadcastRealtimeEvent('ads_updated', { type: 'ads_updated' });

    return res.json({
      success: true,
      message: 'Ad banner updated successfully',
      data: updatedAd
    });
  } catch (err) {
    console.error('[adController updateAd Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update ad banner'
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
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Ad ID' });
    }

    const deleted = await Ad.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Ad banner not found'
      });
    }

    broadcastRealtimeEvent('ads_updated', { type: 'ads_updated' });

    return res.json({
      success: true,
      message: 'Ad banner deleted successfully'
    });
  } catch (err) {
    console.error('[adController deleteAd Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete ad banner'
    });
  }
};

/**
 * @route   POST /api/ads/:id/click
 * @desc    Increments click analytics counter for an ad banner with daily rate limiting per IP+Ad (B-T)
 * @access  Public
 */
export const trackAdClick = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Ad ID' });
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const clickKey = `${ip}_${req.params.id}`;

    // Throttle: max 1 count per IP per ad per day
    if (!adClickCache.has(clickKey)) {
      adClickCache.set(clickKey, Date.now());
      await Ad.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('[adController trackAdClick Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to record click' });
  }
};
