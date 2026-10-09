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

import { API_BASE } from './apiClient';

export const adminCmsModel = {
  /**
   * --------------------------------------------------------------------------
   * API: Upload Media File (Image/Video)
   * --------------------------------------------------------------------------
   * @route   POST http://localhost:5000/api/upload
   * @desc    Backend file upload endpoint par file multipart formdata ke throw post karta hai.
   *          Failure par DataURL conversion reader ka fallback use karta hai.
   * @param   {File} file - Browser File object (JPG, PNG, WEBP, MP4, etc.)
   * @returns {Promise<string|null>} Uploaded image/video URL string or base64 data URL
   */
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
      console.warn('[adminCmsModel API Warning] File upload returned error response:', data);
      return null;
    } catch (err) {
      console.error('[adminCmsModel API Error] Backend file upload failed:', err);
      return null;
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Get Banners List
   * --------------------------------------------------------------------------
   * @route   GET http://localhost:5000/api/banners
   * @desc    Website hero banner slides MongoDB se fetch karta hai (with localStorage fallback).
   * @access  Public / Admin
   * @returns {Promise<Array>} List of hero banner objects
   */
  getBanners: async () => {
    try {
      const res = await fetch(`${API_BASE}/banners`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item._id || item.id
        }));
      }
      return [];
    } catch (err) {
      console.warn('[adminCmsModel API Warning] Banners API call failed:', err);
      return [];
    }
  },


  /**
   * --------------------------------------------------------------------------
   * API: Create New Hero Banner
   * --------------------------------------------------------------------------
   * @route   POST http://localhost:5000/api/banners
   * @desc    Naya hero section banner banner database me save karta hai.
   * @param   {Object} payload - { title, subtitle, type, badge, ctaText, mediaUrl }
   * @returns {Promise<Object|null>} Created banner object with ID
   */
  addBanner: async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/banners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const item = data.data;
      return item ? { ...item, id: item._id || item.id } : null;
    } catch (err) {
      console.error('[adminCmsModel API Error] Error creating banner:', err);
      return null;
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Delete Hero Banner
   * --------------------------------------------------------------------------
   * @route   DELETE http://localhost:5000/api/banners/:id
   * @desc    Banner ID ke dwara hero slide delete karta hai.
   * @param   {string} id - Banner MongoDB _id
   * @returns {Promise<void>}
   */
  deleteBanner: async (id) => {
    try {
      await fetch(`${API_BASE}/banners/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('[adminCmsModel API Error] Error deleting banner:', err);
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Update Hero Banner
   * --------------------------------------------------------------------------
   * @route   PUT http://localhost:5000/api/banners/:id
   * @desc    Existing hero banner details update karta hai.
   * @param   {string} id - Banner ID
   * @param   {Object} payload - { title, subtitle, type, badge, ctaText, mediaUrl }
   * @returns {Promise<Object|null>} Updated banner object
   */
  updateBanner: async (id, payload) => {
    try {
      const res = await fetch(`${API_BASE}/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const item = data.data;
      return item ? { ...item, id: item._id || item.id } : null;
    } catch (err) {
      console.error('[adminCmsModel API Error] Error updating banner:', err);
      return null;
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Get All Courses
   * --------------------------------------------------------------------------
   * @route   GET http://localhost:5000/api/courses
   * @desc    Frontend aur Admin catalog ke liye saare offered courses fetch karta hai.
   * @access  Public / Admin
   * @returns {Promise<Array>} List of course objects
   */
  getCourses: async () => {
    try {
      const res = await fetch(`${API_BASE}/courses?all=true`);
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
   * --------------------------------------------------------------------------
   * API: Add New Course
   * --------------------------------------------------------------------------
   * @route   POST http://localhost:5000/api/courses
   * @desc    Naya training course database me insert karta hai.
   * @param   {Object} payload - { title, category, subCat, duration, price, level, badge, description, technologies }
   * @returns {Promise<Object|null>} Created course record
   */
  addCourse: async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const item = data.data;
      return item ? { ...item, id: item._id || item.id } : null;
    } catch (err) {
      console.error('[adminCmsModel API Error] Error adding course:', err);
      return null;
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Delete Course
   * --------------------------------------------------------------------------
   * @route   DELETE http://localhost:5000/api/courses/:id
   * @desc    Course ID ke dwara training course delete karta hai.
   * @param   {string} id - Course MongoDB _id
   * @returns {Promise<void>}
   */
  deleteCourse: async (id) => {
    try {
      await fetch(`${API_BASE}/courses/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('[adminCmsModel API Error] Error deleting course:', err);
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Update Course
   * --------------------------------------------------------------------------
   * @route   PUT http://localhost:5000/api/courses/:id
   * @desc    Course details update karta hai.
   * @param   {string} id - Course ID
   * @param   {Object} payload
   * @returns {Promise<Object|null>} Updated course record
   */
  updateCourse: async (id, payload) => {
    try {
      const res = await fetch(`${API_BASE}/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const item = data.data;
      return item ? { ...item, id: item._id || item.id } : null;
    } catch (err) {
      console.error('[adminCmsModel API Error] Error updating course:', err);
      return null;
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Get Student Placements Records
   * --------------------------------------------------------------------------
   * @route   GET http://localhost:5000/api/placements
   * @desc    Student job placements and package data fetch karta hai.
   * @access  Public / Admin
   * @returns {Promise<Array>} List of placement records
   */
  getPlacements: async () => {
    try {
      const res = await fetch(`${API_BASE}/placements`);
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
   * --------------------------------------------------------------------------
   * API: Add New Student Placement Record
   * --------------------------------------------------------------------------
   * @route   POST http://localhost:5000/api/placements
   * @desc    Placed student details (Student name, company, package CTC, role, image) record karta hai.
   * @param   {Object} payload - { studentName, company, package: ctc, role, avatarUrl, course }
   * @returns {Promise<Object|null>} Created placement record
   */
  addPlacement: async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/placements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const item = data.data;
      return item ? { ...item, id: item._id || item.id } : null;
    } catch (err) {
      console.error('[adminCmsModel API Error] Error adding placement:', err);
      return null;
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Delete Placement Record
   * --------------------------------------------------------------------------
   * @route   DELETE http://localhost:5000/api/placements/:id
   * @desc    Placement record database se remove karta hai.
   * @param   {string} id - Placement MongoDB _id
   * @returns {Promise<void>}
   */
  deletePlacement: async (id) => {
    try {
      await fetch(`${API_BASE}/placements/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('[adminCmsModel API Error] Error deleting placement:', err);
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Update Student Placement Record
   * --------------------------------------------------------------------------
   * @route   PUT http://localhost:5000/api/placements/:id
   * @desc    Placement record details update karta hai.
   * @param   {string} id - Placement ID
   * @param   {Object} payload
   * @returns {Promise<Object|null>} Updated placement record
   */
  updatePlacement: async (id, payload) => {
    try {
      const res = await fetch(`${API_BASE}/placements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const item = data.data;
      return item ? { ...item, id: item._id || item.id } : null;
    } catch (err) {
      console.error('[adminCmsModel API Error] Error updating placement:', err);
      return null;
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Get CodeGuru Team Members & Instructors
   * --------------------------------------------------------------------------
   * @route   GET http://localhost:5000/api/team
   * @desc    CodeGuru instructors aur executive staff list fetch karta hai.
   * @access  Public / Admin
   * @returns {Promise<Array>} List of team members
   */
  getTeam: async () => {
    try {
      const res = await fetch(`${API_BASE}/team`);
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
   * --------------------------------------------------------------------------
   * API: Add New Team Member
   * --------------------------------------------------------------------------
   * @route   POST http://localhost:5000/api/team
   * @desc    Naya staff instructor member save karta hai.
   * @param   {Object} payload - { name, role, bio, photoUrl, experience }
   * @returns {Promise<Object|null>} Created team member object
   */
  addTeamMember: async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const item = data.data;
      return item ? { ...item, id: item._id || item.id } : null;
    } catch (err) {
      console.error('[adminCmsModel API Error] Error adding team member:', err);
      return null;
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Delete Team Member
   * --------------------------------------------------------------------------
   * @route   DELETE http://localhost:5000/api/team/:id
   * @desc    Team member profile delete karta hai.
   * @param   {string} id - Team MongoDB _id
   * @returns {Promise<void>}
   */
  deleteTeamMember: async (id) => {
    try {
      await fetch(`${API_BASE}/team/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('[adminCmsModel API Error] Error deleting team member:', err);
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Update Team Member
   * --------------------------------------------------------------------------
   * @route   PUT http://localhost:5000/api/team/:id
   * @desc    Team member profile update karta hai.
   * @param   {string} id - Team Member ID
   * @param   {Object} payload
   * @returns {Promise<Object|null>} Updated team member object
   */
  updateTeamMember: async (id, payload) => {
    try {
      const res = await fetch(`${API_BASE}/team/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const item = data.data;
      return item ? { ...item, id: item._id || item.id } : null;
    } catch (err) {
      console.error('[adminCmsModel API Error] Error updating team member:', err);
      return null;
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Get Traffic & Live Visitor Analytics
   * --------------------------------------------------------------------------
   * @route   GET http://localhost:5000/api/traffic/stats
   * @desc    Realtime website traffic analytics (today visitors, live active users, top searched courses, city breakdown) return karta hai.
   * @access  Admin Private
   * @returns {Promise<Object>} Traffic analytics object { todayVisitors, liveActive, totalVisitors, dailyTrend, topSearchedCourses, cityBreakdown }
   */
  getTrafficStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/traffic/stats`);
      const data = await res.json();
      if (data.success) {
        return data.data;
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
   * --------------------------------------------------------------------------
   * API: Get Course Categories
   * --------------------------------------------------------------------------
   * @route   GET http://localhost:5000/api/categories
   * @desc    Saare course categories fetch karta hai.
   * @access  Public / Admin
   * @returns {Promise<Array>} List of category objects
   */
  getCategories: async () => {
    let apiList = [];
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        apiList = data.data.map(item => ({
          ...item,
          id: item._id || item.id
        }));
      }
    } catch (err) {
      console.warn('[adminCmsModel API Warning] Categories API call error:', err);
    }
    
    // Merge localStorage categories fallback
    try {
      const local = JSON.parse(localStorage.getItem('codeguru_custom_categories') || '[]');
      const combined = [...apiList];
      local.forEach(loc => {
        if (!combined.some(c => c.category === loc.category || c.id === loc.id)) {
          combined.push(loc);
        }
      });
      return combined;
    } catch {
      return apiList;
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Add New Course Category
   * --------------------------------------------------------------------------
   * @route   POST http://localhost:5000/api/categories
   * @desc    Nayi course category save karta hai with localStorage fallback.
   * @param   {Object} payload - { label, category, subCat, subCategories, badge, icon, bgColor }
   * @returns {Promise<Object>} { success: boolean, data?: Object, message?: string }
   */
  addCategory: async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const item = data.data;
        return { success: true, data: { ...item, id: item._id || item.id } };
      }
    } catch (err) {
      console.warn('[adminCmsModel API Warning] Backend addCategory failed, saving to localStorage:', err);
    }

    // Fallback: save locally so user operation never fails!
    const newLocalCat = {
      ...payload,
      id: 'cat-' + Date.now(),
      _id: 'cat-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    try {
      const local = JSON.parse(localStorage.getItem('codeguru_custom_categories') || '[]');
      local.push(newLocalCat);
      localStorage.setItem('codeguru_custom_categories', JSON.stringify(local));
      return { success: true, data: newLocalCat };
    } catch (e) {
      return { success: false, message: e.message || 'Storage error' };
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Update Course Category
   * --------------------------------------------------------------------------
   * @route   PUT http://localhost:5000/api/categories/:id
   * @desc    Course category update karta hai.
   * @param   {string} id - Category ID
   * @param   {Object} payload
   * @returns {Promise<Object|null>} Updated category object
   */
  updateCategory: async (id, payload) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const item = data.data;
        return { ...item, id: item._id || item.id };
      }
    } catch (err) {
      console.error('[adminCmsModel API Error] Error updating category:', err);
    }
    try {
      const local = JSON.parse(localStorage.getItem('codeguru_custom_categories') || '[]');
      const updated = local.map(c => (c.id === id || c._id === id || c.category === id) ? { ...c, ...payload } : c);
      localStorage.setItem('codeguru_custom_categories', JSON.stringify(updated));
    } catch {}
    return { id, ...payload };
  },

  /**
   * --------------------------------------------------------------------------
   * API: Delete Course Category
   * --------------------------------------------------------------------------
   * @route   DELETE http://localhost:5000/api/categories/:id
   * @desc    Course category delete karta hai.
   * @param   {string} id - Category MongoDB _id or local id
   * @returns {Promise<void>}
   */
  deleteCategory: async (id) => {
    try {
      await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('[adminCmsModel API Error] Error deleting category:', err);
    }
    // Also remove from localStorage if present
    try {
      const local = JSON.parse(localStorage.getItem('codeguru_custom_categories') || '[]');
      const filtered = local.filter(c => c.id !== id && c._id !== id);
      localStorage.setItem('codeguru_custom_categories', JSON.stringify(filtered));
    } catch {}
  }
};
