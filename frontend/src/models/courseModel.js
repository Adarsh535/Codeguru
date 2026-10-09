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
          ...item,
          id: item._id || item.id || idx,
          categoryId: item.category || 'coding',
          subCategory: item.subCat || 'web',
          subCategories: Array.isArray(item.subCategories) && item.subCategories.length > 0 ? item.subCategories : [item.subCat || 'web'],
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
          description: item.description || '',
          showPrice: item.showPrice !== false,
          internships: item.internships || '5 Internships',
          mockTests: item.mockTests || '5 Mock Tests',
          projects: item.projects || '5 Projects',
          highlights: Array.isArray(item.highlights) ? item.highlights : [],
          isDiscountActive: item.isDiscountActive !== false,
          discountPercent: item.discountPercent || 0
        }));
      }
    } catch (err) {
      console.warn('[courseModel API Warning] Live courses fetch error:', err);
    }
    return [];
  }
};
