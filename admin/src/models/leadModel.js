/**
 * ============================================================================
 * MODEL LAYER: LEAD DATA MODEL & API SERVICE (leadModel.js)
 * ============================================================================
 * Handles all CRUD operations, analytics aggregation, local storage cache fallbacks,
 * and backend REST API communication for Student Lead Inquiries.
 */

import { API_BASE } from './apiClient';

const API_URL = `${API_BASE}/leads`;
const STORAGE_KEY = 'codeguru_leads';

export const leadModel = {
  /**
   * --------------------------------------------------------------------------
   * API: Get All Student Leads
   * --------------------------------------------------------------------------
   * @route   GET http://localhost:5000/api/leads
   * @desc    Backend MongoDB database se live student inquiry leads fetch karta hai.
   * @access  Admin Private
   * @returns {Promise<Array>} Array of lead objects fetched strictly from backend database
   */
  getLeads: async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item._id || item.leadId || item.id,
          location: item.location || 'Lucknow, UP',
          createdAt: item.createdAt || new Date().toISOString()
        }));
      }
    } catch (err) {
      console.warn('[leadModel API Warning] Backend API error:', err);
    }
    return [];
  },


  /**
   * --------------------------------------------------------------------------
   * DATA TRANSFORMER: Calculate Lead Analytics & Metrics
   * --------------------------------------------------------------------------
   * @desc    Leads array se live key metrics summarize karta hai (Today count, New, Contacted, Enrolled, Conversion Rate, Course Breakdown).
   * @param   {Array} leadsList - Array of lead objects
   * @returns {Object} Aggregated metrics object
   */
  getStats: (leadsList = []) => {
    const leads = Array.isArray(leadsList) ? leadsList : [];
    const todayStr = new Date().toLocaleDateString('en-CA');

    let todayCount = 0;
    let newCount = 0;
    let contactedCount = 0;
    let enrolledCount = 0;
    let courseCounts = {};

    leads.forEach(lead => {
      if (lead.createdAt) {
        const leadDate = new Date(lead.createdAt).toLocaleDateString('en-CA');
        if (leadDate === todayStr) {
          todayCount++;
        }
      }
      if (lead.status === 'New') newCount++;
      if (lead.status === 'Contacted') contactedCount++;
      if (lead.status === 'Enrolled') enrolledCount++;

      const courseName = lead.course || 'General';
      courseCounts[courseName] = (courseCounts[courseName] || 0) + 1;
    });

    const totalLeads = leads.length;
    const conversionRate = totalLeads > 0 ? Math.round((enrolledCount / totalLeads) * 100) : 0;

    return {
      totalLeads,
      todayCount,
      newCount,
      contactedCount,
      enrolledCount,
      conversionRate,
      courseCounts
    };
  },

  /**
   * --------------------------------------------------------------------------
   * API: Update Lead Status
   * --------------------------------------------------------------------------
   * @route   PUT http://localhost:5000/api/leads/:id
   * @desc    Backend MongoDB database me specific lead ka status ('New' | 'Contacted' | 'In Progress' | 'Enrolled') update karta hai.
   * @param   {string} id - Lead MongoDB _id ya leadId
   * @param   {string} newStatus - New updated status string
   * @returns {Promise<void>}
   */
  updateStatus: async (id, newStatus) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('[leadModel API Error] Error updating lead status on backend:', err);
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Delete Student Lead
   * --------------------------------------------------------------------------
   * @route   DELETE http://localhost:5000/api/leads/:id
   * @desc    Backend MongoDB database se specific student lead record delete karta hai.
   * @param   {string} id - Lead MongoDB _id ya leadId
   * @returns {Promise<void>}
   */
  deleteLead: async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('[leadModel API Error] Error deleting lead on backend:', err);
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Add New Student Lead
   * --------------------------------------------------------------------------
   * @route   POST http://localhost:5000/api/leads
   * @desc    Backend MongoDB database me naya student inquiry record create karta hai.
   * @param   {Object} leadData - { name, phone, course, location, notes, status }
   * @returns {Promise<Object>} Created lead object returned from server API
   */
  addLead: async (leadData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.error('[leadModel API Error] Error adding lead on backend:', err);
    }
  }
};
