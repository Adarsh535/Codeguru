/**
 * ============================================================================
 * MODEL LAYER: LEAD MODEL & API SERVICE (leadModel.js)
 * ============================================================================
 * Handles submitting student admission inquiry leads to Express Backend API
 * and pinging student traffic analytics.
 */

import { API_BASE, apiFetch } from './apiClient';

export const leadModel = {
  /**
   * --------------------------------------------------------------------------
   * API: Submit Student Lead Inquiry
   * --------------------------------------------------------------------------
   * @route   POST http://localhost:5000/api/leads
   * @desc    Website enrollment / contact modal se student inquiry form backend me post karta hai.
   * @access  Public
   * @param   {Object} leadData - { name, phone, course, location, notes }
   * @returns {Promise<Object>} API JSON response object
   */
  submitLead: async (leadData) => {
    try {
      const res = await apiFetch('/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      return await res.json();
    } catch (err) {
      console.warn('[leadModel API Warning] Backend API submission failed, fallback local sync:', err);
      return { success: false, message: 'Server offline' };
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Update Student Lead Inquiry with Profile Details (Step 2)
   * --------------------------------------------------------------------------
   * @route   POST http://localhost:5000/api/leads/update-details
   * @desc    Updates the Step 1 lead in Admin database with student Name & Email
   * @access  Public
   */
  updateLead: async (leadId, updateData) => {
    try {
      const res = await apiFetch('/leads/update-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, ...updateData })
      });
      return await res.json();
    } catch (err) {
      console.warn('[leadModel updateLead Warning]:', err);
      return { success: false, message: 'Update failed' };
    }
  },

  /**
   * --------------------------------------------------------------------------
   * API: Ping Student Visitor Traffic Analytics
   * --------------------------------------------------------------------------
   * @route   POST http://localhost:5000/api/traffic/ping
   * @desc    Sends student search query & location data to backend traffic logger.
   * @access  Public
   * @param   {string} searchQuery - Course search keyword
   * @param   {string} city - User detected city
   * @returns {Promise<void>}
   */
  pingTraffic: async (searchQuery = '', city = '') => {
    try {
      await apiFetch('/traffic/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchQuery, city })
      });
    } catch (e) {}
  }
};
