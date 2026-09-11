/**
 * ============================================================================
 * MODEL LAYER: COURSE MODEL & API SERVICE (courseModel.js)
 * ============================================================================
 * Handles fetching training courses catalog from Express REST API Backend with fallbacks.
 */

import { API_BASE } from './apiClient';

export const courseModel = {
  /**
   * --------------------------------------------------------------------------
   * API: Get Courses Catalog
   * --------------------------------------------------------------------------
   * @route   GET http://localhost:5000/api/courses
   * @desc    Website frontend course catalog (Web Dev, App Dev, Data Science, Cyber Security) fetch karta hai.
   * @access  Public
   * @returns {Promise<Array>} Normalized array of course catalog items
   */
  getCourses: async () => {
    try {
      const res = await fetch(`${API_BASE}/courses`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map((item, idx) => ({
          id: item._id || item.id || idx,
          title: item.title,
          name: item.title,
          sub: item.description || item.sub || 'Comprehensive Certification & Hands-on Project Track',
          category: item.category || 'coding',
          subCat: item.subCat || 'web',
          duration: item.duration || '6 Months',
          price: item.price ? (String(item.price).startsWith('₹') ? item.price : `₹${item.price}`) : '₹24,999',
          original: item.original ? (String(item.original).startsWith('₹') ? item.original : `₹${item.original}`) : '₹34,999',
          rating: item.rating || 4.9,
          badge: item.badge || 'BESTSELLER',
          logoUrl: item.logoUrl || item.mediaUrl || 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
        }));
      }
    } catch (err) {
      console.warn('[courseModel API Warning] Live courses fetch error:', err);
    }
    return [];
  }
};
