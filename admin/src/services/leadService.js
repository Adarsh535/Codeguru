/**
 * ============================================================================
 * LEAD SERVICE (Backward Compatibility Bridge to leadModel)
 * Handles lead retrieval, analytics stats, status updates, deletion, and addition.
 * ============================================================================
 */

import { leadModel } from '../models/leadModel';

export const leadService = {
  /**
   * API: Retrieve all student inquiry leads from MongoDB Backend API
   * @route GET http://localhost:5000/api/leads
   */
  getLeads: () => leadModel.getLeads(),

  /**
   * DATA TRANSFORMER: Calculate live analytics stats from leads list
   * @param {Array} leadsList - Array of lead objects
   */
  getStats: (leadsList) => leadModel.getStats(leadsList),

  /**
   * API: Update lead status in Backend MongoDB
   * @route PUT http://localhost:5000/api/leads/:id
   * @param {string} id - Lead MongoDB _id
   * @param {string} newStatus - New status ('New'|'Contacted'|'In Progress'|'Enrolled')
   */
  updateStatus: (id, newStatus) => leadModel.updateStatus(id, newStatus),

  /**
   * API: Delete lead from Backend MongoDB
   * @route DELETE http://localhost:5000/api/leads/:id
   * @param {string} id - Lead MongoDB _id
   */
  deleteLead: (id) => leadModel.deleteLead(id),

  /**
   * API: Add new student inquiry lead directly via Backend API
   * @route POST http://localhost:5000/api/leads
   * @param {Object} leadData - Lead details payload
   */
  addLead: (leadData) => leadModel.addLead(leadData)
};


