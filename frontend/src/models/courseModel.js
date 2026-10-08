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
          categoryId: item.category || 'coding',
          subCategory: item.subCat || 'web',
          title: item.title,
          name: item.title,
          duration: item.duration || '6 Months',
          level: item.level || 'Intermediate',
          mode: item.mode || 'Live Classes',
          price: item.price ? (String(item.price).startsWith('₹') ? item.price : `₹${item.price}`) : '₹14,999',
          originalPrice: item.originalPrice || item.original || '₹24,999',
          discount: item.discount || '35% OFF',
          tag: item.badge || item.tag || null,
          icon: item.logoUrl || item.icon || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
          iconBg: 'bg-blue-50',
          description: item.description || ''
        }));
      }
    } catch (err) {
      console.warn('[courseModel API Warning] Live courses fetch error:', err);
    }
    return [];
  }
};
