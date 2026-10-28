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
        const banners = data.data
          .filter(item => item && item.active !== false)
          .map((item, idx) => {
            const rawMedia = item.mediaUrl || item.imageUrl || item.videoUrl || item.poster || '';
            const isVid = item.type === 'video' || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(rawMedia) || (typeof rawMedia === 'string' && rawMedia.includes('/video/'));
            const mediaUrl = rawMedia;
            const imageUrl = item.imageUrl || (!isVid ? rawMedia : (item.poster || ''));
            const videoUrl = item.videoUrl || (isVid ? rawMedia : '');

            return {
              ...item,
              id: item._id || item.id || idx,
              _id: item._id || item.id,
              type: isVid ? 'video' : 'image',
              mediaUrl,
              imageUrl,
              videoUrl,
              poster: item.poster || item.thumbnailUrl || (isVid ? (item.imageUrl || '') : rawMedia),
              title: item.title ? String(item.title).trim() : '',
              subtitle: item.subtitle ? String(item.subtitle).trim() : '',
              badge: item.badge ? String(item.badge).trim() : '',
              badgeColor: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 text-slate-950 font-bold border-amber-300 shadow-md',
              ctaText: item.ctaText ? String(item.ctaText).trim() : '',
              ctaColor: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400',
              order: Number(item.order) || 0,
              active: item.active !== false
            };
          });

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
          if (Array.isArray(parsed) && parsed.length > 0) {
            const valid = parsed.filter(p => p && (p.mediaUrl || p.imageUrl || p.videoUrl || p.poster));
            if (valid.length > 0) return valid;
          }
        }
      } catch (e) {}
    }
    return [];
  }
};
