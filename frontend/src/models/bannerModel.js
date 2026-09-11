/**
 * ============================================================================
 * MODEL LAYER: HERO BANNER MODEL & API SERVICE (bannerModel.js)
 * ============================================================================
 * Handles fetching homepage hero section image and video banners from Express REST API
 * with fallback seed banners.
 */

import { API_BASE } from './apiClient';

export const FALLBACK_BANNERS = [
  {
    id: 'b-1',
    type: 'image',
    title: 'STAR ACHIEVERS & PLACEMENT DRIVES 2026',
    subtitle: 'CodeGuru Alumni placed at Top MNCs & Unicorn Startups with packages up to 18.5 LPA',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80',
    badge: 'TOP PLACEMENTS 2026',
    badgeColor: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 text-slate-950 font-black border-amber-300 shadow-md',
    ctaText: 'Explore Placement Drives',
    ctaColor: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 shadow-emerald-900/30'
  }
];

export const bannerModel = {
  /**
   * --------------------------------------------------------------------------
   * API: Get All Hero Banners
   * --------------------------------------------------------------------------
   * @route   GET http://localhost:5000/api/banners
   * @desc    Website homepage slider banners (image & video slides) fetch karta hai.
   *          Failure par fallback banner list return karta hai.
   * @access  Public
   * @returns {Promise<Array>} List of hero banner objects
   */
  getBanners: async () => {
    try {
      const res = await fetch(`${API_BASE}/banners`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map((item, idx) => ({
          id: item._id || item.id || idx,
          type: item.type || 'image',
          title: item.title,
          subtitle: item.subtitle,
          imageUrl: item.mediaUrl || item.imageUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
          videoUrl: item.type === 'video' ? item.mediaUrl : null,
          poster: item.mediaUrl,
          badge: item.badge || 'TOP PLACEMENT DRIVES 2026',
          badgeColor: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 text-slate-950 font-black border-amber-300 shadow-md',
          ctaText: item.ctaText || 'Explore Placement Drives',
          ctaColor: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 shadow-emerald-900/30'
        }));
      }
    } catch (err) {
      console.warn('[bannerModel API Warning] Live API fetch error, using fallback:', err);
    }
    return FALLBACK_BANNERS;
  }
};
