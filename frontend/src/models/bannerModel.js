/**
 * ============================================================================
 * MODEL LAYER: HERO BANNER MODEL & API SERVICE (bannerModel.js)
 * ============================================================================
 * Handles fetching homepage hero section image and video banners from Express REST API
 * with instant caching.
 */

import { API_BASE, apiFetch } from './apiClient';

export const bannerModel = {
  /**
   * --------------------------------------------------------------------------
   * API: Get All Hero Banners (Direct from Database)
   * --------------------------------------------------------------------------
   * @route   GET /api/banners
   * @desc    Website homepage slider banners (image & video slides) fetch karta hai.
   * @access  Public
   * @returns {Promise<Array>} List of hero banner objects
   */
  getBanners: async () => {
    try {
      const res = await apiFetch('/banners');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const banners = data.data.map((item, idx) => ({
          id: item._id || item.id || idx,
          type: item.type || 'image',
          title: item.title ? String(item.title).trim() : '',
          subtitle: item.subtitle ? String(item.subtitle).trim() : '',
          videoUrl: item.type === 'video' ? item.mediaUrl : null,
          poster: item.poster || item.thumbnailUrl || (item.type === 'video' ? (item.imageUrl || '') : item.mediaUrl),
          badge: item.badge ? String(item.badge).trim() : '',
          badgeColor: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 text-slate-950 font-bold border-amber-300 shadow-md',
          ctaText: item.ctaText ? String(item.ctaText).trim() : '',
          ctaColor: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400'
        }));
        if (typeof window !== 'undefined' && banners.length > 0) {
          try { sessionStorage.setItem('cg_cached_banners', JSON.stringify(banners)); } catch (e) {}
        }
        return banners;
      }
    } catch (err) {
      console.warn('[bannerModel API Warning] Live API fetch error:', err);
    }
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('cg_cached_banners');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return [];
  }
};
