/**
 * ============================================================================
 * MODEL LAYER: LEAD DATA MODEL & API SERVICE (leadModel.js)
 * ============================================================================
 * Handles all CRUD operations, analytics aggregation, and backend REST API
 * communication for Student Lead Inquiries using authenticated apiFetch.
 */

import { apiFetch, API_BASE } from './apiClient';

const API_URL = '/leads';

export const leadModel = {
  /**
   * Retrieves all student inquiry leads from backend database.
   * @returns {Promise<Array>}
   */
  getLeads: async () => {
    try {
      const res = await apiFetch(API_URL);
      if (!res.ok) {
        throw new Error(`Failed to fetch leads (${res.status})`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data.map(item => {
          let phone = (item.phone || '').trim();
          let email = (item.email || '').trim();

          if (phone.includes('@')) {
            if (!email) email = phone;
            phone = '';
          } else if (email && !email.includes('@') && /^[\d\s\+\-\(\)]{7,15}$/.test(email)) {
            if (!phone) phone = email;
            email = '';
          }

          return {
            ...item,
            id: item._id || item.leadId || item.id,
            phone,
            email,
            location: item.location || item.city || 'Unknown',
            createdAt: item.createdAt || null
          };
        });
      }
    } catch (err) {
      console.error('[leadModel Error] Failed to get leads:', err);
      throw err;
    }
    return [];
  },

  /**
   * Calculates Lead Analytics & Metrics from array of leads.
   * @param {Array} leadsList
   * @returns {Object}
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
   * Updates lead status on backend. Throws on error (A7).
   * @param {string} id
   * @param {string} newStatus
   */
  updateStatus: async (id, newStatus) => {
    const res = await apiFetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to update lead status (${res.status})`);
    }
    return res.json();
  },

  /**
   * Deletes a student lead record. Throws on error (A7).
   * @param {string} id
   */
  deleteLead: async (id) => {
    const res = await apiFetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to delete lead (${res.status})`);
    }
    return res.json();
  },

  /**
   * Adds a new student inquiry lead. Throws on error (A7).
   * @param {Object} leadData
   */
  addLead: async (leadData) => {
    const res = await apiFetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to record lead (${res.status})`);
    }
    const data = await res.json();
    return data.data;
  }
};
