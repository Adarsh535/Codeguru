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
   * API: Get All Courses
   * --------------------------------------------------------------------------
   * @route   GET http://localhost:5000/api/courses
   * @desc    Frontend aur Admin catalog ke liye saare offered courses fetch karta hai.
   * @access  Public / Admin
   * @returns {Promise<Array>} List of course objects
   */
  getCourses: async () => {
    try {
      const res = await fetch(`${API_BASE}/courses`);
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
  }
};
