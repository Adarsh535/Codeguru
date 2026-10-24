/**
 * ============================================================================
 * MODEL LAYER: ADMIN CMS DATA MODEL & API SERVICE (adminCmsModel.js)
 * ============================================================================
 * Manages Website Content Management System (CMS) data operations:
 * - File / Media Upload API
 * - Banner Sliders API
 * - Courses Directory API
 * - Placement Drives API
 * - Team Members API
 * - Live Visitor & Course Search Traffic Analytics API
 */

import { apiFetch, API_BASE } from './apiClient';

export const adminCmsModel = {
  /**
   * Upload Media File (Image/Video). Throws on failure (A7).
   * @param {File} file
   * @returns {Promise<string>}
   */
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiFetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `File upload failed (${res.status})`);
    }
    const data = await res.json();
    if (data.success && data.url) {
      return data.url;
    }
    throw new Error(data.message || 'File upload failed');
  },

  /**
   * Get Banners List
   */
  getBanners: async () => {
    try {
      const res = await apiFetch(`${API_BASE}/banners`);
      if (!res.ok) return [];
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item._id || item.id
        }));
      }
    } catch (err) {
      console.warn('[adminCmsModel API Warning] Banners API call failed:', err);
    }
    return [];
  },

  /**
   * Add New Banner. Throws on failure (A7).
   */
  addBanner: async (payload) => {
    const res = await apiFetch(`${API_BASE}/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to add banner (${res.status})`);
    }
    const data = await res.json();
    const item = data.data;
    return item ? { ...item, id: item._id || item.id } : null;
  },

  /**
   * Delete Banner. Throws on failure (A7).
   */
  deleteBanner: async (id) => {
    const res = await apiFetch(`${API_BASE}/banners/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to delete banner (${res.status})`);
    }
    return res.json();
  },

  /**
   * Update Banner. Throws on failure (A7).
   */
  updateBanner: async (id, payload) => {
    const res = await apiFetch(`${API_BASE}/banners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update banner (${res.status})`);
    }
    const data = await res.json();
    const item = data.data;
    return item ? { ...item, id: item._id || item.id } : null;
  },

  /**
   * Get Promotional / Advertisement Banners List
   */
  getAds: async () => {
    try {
      const res = await apiFetch(`${API_BASE}/ads`);
      if (!res.ok) return [];
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item._id || item.id
        }));
      }
      return [];
    } catch (err) {
      console.warn('[adminCmsModel API Warning] Ads API call failed:', err);
      return [];
    }
  },

  /**
   * Create New Ad Banner. Throws on failure (A7).
   */
  createAd: async (payload) => {
    const res = await apiFetch(`${API_BASE}/ads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create ad (${res.status})`);
    }
    const data = await res.json();
    const item = data.data;
    return item ? { ...item, id: item._id || item.id } : null;
  },

  /**
   * Update Existing Ad Banner. Throws on failure (A7).
   */
  updateAd: async (id, payload) => {
    const res = await apiFetch(`${API_BASE}/ads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update ad (${res.status})`);
    }
    const data = await res.json();
    const item = data.data;
    return item ? { ...item, id: item._id || item.id } : null;
  },

  /**
   * Delete Ad Banner. Throws on failure (A7).
   */
  deleteAd: async (id) => {
    const res = await apiFetch(`${API_BASE}/ads/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to delete ad (${res.status})`);
    }
    return res.json();
  },

  /**
   * Get All Courses
   */
  getCourses: async () => {
    try {
      const res = await apiFetch(`${API_BASE}/courses?all=true`);
      if (!res.ok) return [];
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item._id || item.id
        }));
      }
      return [];
    } catch (err) {
      console.warn('[adminCmsModel API Warning] Courses API call failed:', err);
      return [];
    }
  },

  /**
   * Add New Course. Throws on failure (A7).
   */
  addCourse: async (payload) => {
    const res = await apiFetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to add course (${res.status})`);
    }
    const data = await res.json();
    const item = data.data;
    return item ? { ...item, id: item._id || item.id } : null;
  },

  /**
   * Delete Course. Throws on failure (A7).
   */
  deleteCourse: async (id) => {
    const res = await apiFetch(`${API_BASE}/courses/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to delete course (${res.status})`);
    }
    return res.json();
  },

  /**
   * Update Course. Throws on failure (A7).
   */
  updateCourse: async (id, payload) => {
    const res = await apiFetch(`${API_BASE}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update course (${res.status})`);
    }
    const data = await res.json();
    const item = data.data;
    return item ? { ...item, id: item._id || item.id } : null;
  },

  /**
   * Get Student Placements Records
   */
  getPlacements: async () => {
    try {
      const res = await apiFetch(`${API_BASE}/placements`);
      if (!res.ok) return [];
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item._id || item.id
        }));
      }
      return [];
    } catch (err) {
      console.warn('[adminCmsModel API Warning] Placements API error:', err);
      return [];
    }
  },

  /**
   * Add New Student Placement Record. Throws on failure (A7).
   */
  addPlacement: async (payload) => {
    const res = await apiFetch(`${API_BASE}/placements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to add placement (${res.status})`);
    }
    const data = await res.json();
    const item = data.data;
    return item ? { ...item, id: item._id || item.id } : null;
  },

  /**
   * Delete Placement Record. Throws on failure (A7).
   */
  deletePlacement: async (id) => {
    const res = await apiFetch(`${API_BASE}/placements/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to delete placement (${res.status})`);
    }
    return res.json();
  },

  /**
   * Update Student Placement Record. Throws on failure (A7).
   */
  updatePlacement: async (id, payload) => {
    const res = await apiFetch(`${API_BASE}/placements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update placement (${res.status})`);
    }
    const data = await res.json();
    const item = data.data;
    return item ? { ...item, id: item._id || item.id } : null;
  },

  /**
   * Get CodeGuru Team Members & Instructors
   */
  getTeam: async () => {
    try {
      const res = await apiFetch(`${API_BASE}/team`);
      if (!res.ok) return [];
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item._id || item.id
        }));
      }
      return [];
    } catch (err) {
      console.warn('[adminCmsModel API Warning] Team API error:', err);
      return [];
    }
  },

  /**
   * Add New Team Member. Throws on failure (A7).
   */
  addTeamMember: async (payload) => {
    const res = await apiFetch(`${API_BASE}/team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to add team member (${res.status})`);
    }
    const data = await res.json();
    const item = data.data;
    return item ? { ...item, id: item._id || item.id } : null;
  },

  /**
   * Delete Team Member. Throws on failure (A7).
   */
  deleteTeamMember: async (id) => {
    const res = await apiFetch(`${API_BASE}/team/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to delete team member (${res.status})`);
    }
    return res.json();
  },

  /**
   * Update Team Member. Throws on failure (A7).
   */
  updateTeamMember: async (id, payload) => {
    const res = await apiFetch(`${API_BASE}/team/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update team member (${res.status})`);
    }
    const data = await res.json();
    const item = data.data;
    return item ? { ...item, id: item._id || item.id } : null;
  },

  /**
   * Get Traffic & Live Visitor Analytics
   */
  getTrafficStats: async () => {
    try {
      const res = await apiFetch(`${API_BASE}/traffic/stats`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          return data.data;
        }
      }
    } catch (err) {
      console.warn('[adminCmsModel API Warning] Traffic API call error:', err);
    }
    return {
      todayVisitors: 0,
      liveActive: 0,
      totalVisitors: 0,
      dailyTrend: [],
      topSearchedCourses: [],
      cityBreakdown: []
    };
  },

  /**
   * Get Course Categories (Backend API only, no fake localStorage merge - A9)
   */
  getCategories: async () => {
    try {
      const res = await apiFetch(`${API_BASE}/categories`);
      if (!res.ok) return [];
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item._id || item.id
        }));
      }
    } catch (err) {
      console.warn('[adminCmsModel API Warning] Categories API call error:', err);
    }
    return [];
  },

  /**
   * Add New Course Category. Real API only, throws on error (A7, A9).
   */
  addCategory: async (payload) => {
    const res = await apiFetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create category (${res.status})`);
    }
    const data = await res.json();
    if (data.success && data.data) {
      const item = data.data;
      return { success: true, data: { ...item, id: item._id || item.id } };
    }
    throw new Error(data.message || 'Failed to create category');
  },

  /**
   * Update Course Category. Throws on error (A7).
   */
  updateCategory: async (id, payload) => {
    const res = await apiFetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update category (${res.status})`);
    }
    const data = await res.json();
    const item = data.data;
    return item ? { ...item, id: item._id || item.id } : null;
  },

  /**
   * Delete Course Category. Throws on error (A7).
   */
  deleteCategory: async (id) => {
    const res = await apiFetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to delete category (${res.status})`);
    }
    return res.json();
  }
};
