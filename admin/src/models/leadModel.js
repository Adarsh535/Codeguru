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

const SEED_LEADS = [
  {
    id: 'LEAD-1001',
    leadId: 'LEAD-1001',
    name: 'Saurabh Kumar',
    phone: '9876543210',
    location: 'Lucknow, UP',
    course: 'Full Stack Web Development',
    status: 'New',
    createdAt: new Date().toISOString(),
    notes: 'Interested in MERN stack job guarantee batch'
  },
  {
    id: 'LEAD-1002',
    leadId: 'LEAD-1002',
    name: 'Ananya Mishra',
    phone: '9123456789',
    location: 'Ayodhya, UP',
    course: 'Java Full Stack & DSA',
    status: 'Contacted',
    createdAt: new Date().toISOString(),
    notes: 'Requested callback after 5 PM'
  },
  {
    id: 'LEAD-1003',
    leadId: 'LEAD-1003',
    name: 'Vikas Sharma',
    phone: '9988776655',
    location: 'Delhi-NCR',
    course: 'Python Data Science & AI',
    status: 'Enrolled',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Fee paid via UPI, joined Lucknow offline batch'
  },
  {
    id: 'LEAD-1004',
    leadId: 'LEAD-1004',
    name: 'Pooja Verma',
    phone: '9811223344',
    location: 'Noida, UP',
    course: 'DevOps & Cloud Engineering',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'Attended demo session'
  },
  {
    id: 'LEAD-1005',
    leadId: 'LEAD-1005',
    name: 'Rohan Gupta',
    phone: '9765432109',
    location: 'Ayodhya, UP',
    course: 'Cyber Security & Ethical Hacking',
    status: 'New',
    createdAt: new Date().toISOString(),
    notes: 'Inquired from Ayodhya branch'
  }
];

export const leadModel = {
  /**
   * --------------------------------------------------------------------------
   * API: Get All Student Leads
   * --------------------------------------------------------------------------
   * @route   GET http://localhost:5000/api/leads
   * @desc    Backend MongoDB se saare student inquiry leads fetch karta hai.
   *          Agar backend server offline ho to local storage cache ya initial seed data fallback data deta hai.
   * @access  Admin Private
   * @returns {Promise<Array>} Normalized array of lead objects { id, name, phone, course, location, status, createdAt }
   */
  getLeads: async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const normalized = data.data.map(item => ({
          ...item,
          id: item._id || item.leadId || item.id,
          location: item.location || 'Lucknow, UP',
          createdAt: item.createdAt || new Date().toISOString()
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      }
    } catch (err) {
      console.warn('[leadModel API Warning] Backend API offline, loading from local cache:', err);
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (err) {
      console.error('[leadModel Cache Error] Failed to load local leads:', err);
    }

    return SEED_LEADS;
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
