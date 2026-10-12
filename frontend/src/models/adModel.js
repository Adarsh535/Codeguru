/**
 * ============================================================================
 * MODEL LAYER: ADVERTISEMENT MODEL & API SERVICE (adModel.js)
 * ============================================================================
 * Handles fetching dynamic promotional and advertisement banners from Express REST API
 * with fallback to the featured Arena Animation 25 Years banner.
 */

import { API_BASE } from './apiClient';

export const FALLBACK_AD = {
  _id: 'default-arena-ad',
  id: 'default-arena-ad',
  title: 'Celebrating 25 Years - Arena Animation',
  subtitle: 'Premier Animation, VFX & Gaming Training Partner',
  imageUrl: '/images/arena-25-years.jpg',
  linkUrl: '',
  badge: 'SPECIAL FEATURE',
  position: 'home_featured',
  openInNewTab: true,
  active: true,
  displayOrder: 1,
  clicks: 0
};

export const adModel = {
  /**
   * API: Get Active Advertisements
   * @param {string} position - 'home_featured' | 'header_top' | 'all'
   * @returns {Promise<Array>} List of active ad banner objects
   */
  getActiveAds: async (position = 'all') => {
    try {
      // When 'all', skip position filter so every active ad is returned
      const url = (position && position !== 'all')
        ? `${API_BASE}/ads/active?position=${encodeURIComponent(position)}`
        : `${API_BASE}/ads/active?position=all`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map(item => ({
          ...item,
          id: item._id || item.id
        }));
      }
    } catch (err) {
      console.warn('[adModel API Warning] Live ads fetch error, using fallback:', err);
    }
    return [];
  },

  /**
   * API: Track Ad Click Counter
   * @param {string} id - Ad ID
   */
  trackClick: async (id) => {
    if (!id || id.startsWith('default-')) return;
    try {
      await fetch(`${API_BASE}/ads/${id}/click`, { method: 'POST' });
    } catch (err) {
      // Non-critical analytics tracking
      console.debug('[adModel] Click track error:', err);
    }
  }
};
