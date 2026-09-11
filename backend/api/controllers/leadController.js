/**
 * ============================================================================
 * API CONTROLLER: LEAD CONTROLLER (leadController.js)
 * ============================================================================
 * Manages student inquiry leads CRUD logic, MongoDB Mongoose persistence,
 * lead status transitions, and fallback JSON storage.
 */

import { Lead } from '../../models/Lead.js';
import { getDB, saveDB } from '../../db/jsonStore.js';

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Get All Student Inquiry Leads
 * --------------------------------------------------------------------------
 * @route   GET /api/leads
 * @desc    Retrieves all student inquiry lead records sorted newest first.
 * @access  Admin Private
 * @returns {JSON} { success: boolean, data: Array<Object> }
 */
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    if (leads && leads.length > 0) {
      return res.json({ success: true, data: leads });
    }
  } catch (e) {
    console.warn('[leadController Warning] MongoDB query error, using JSON store fallback:', e.message);
  }
  const db = getDB();
  res.json({ success: true, data: db.leads || [] });
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Submit / Add New Lead Inquiry
 * --------------------------------------------------------------------------
 * @route   POST /api/leads
 * @desc    Submits a new student inquiry lead into database.
 * @access  Public / Inquiry Form
 * @param   {Object} req.body - { name, phone, course, location, notes, status }
 * @returns {JSON} { success: boolean, message: string, data: Object }
 */
export const addLead = async (req, res) => {
  try {
    const newId = `LEAD-${Math.floor(1000 + Math.random() * 9000)}`;
    const lead = await Lead.create({
      leadId: req.body.leadId || newId,
      name: req.body.name || 'Anonymous Student',
      phone: req.body.phone || '',
      location: req.body.location || 'Lucknow, UP',
      course: req.body.course || 'Full Stack Web Development',
      status: req.body.status || 'New',
      notes: req.body.notes || 'Inquired from CodeGuru Portal'
    });

    const db = getDB();
    db.leads = [lead, ...(db.leads || [])];
    saveDB(db);

    return res.status(201).json({ success: true, message: 'Lead recorded in MongoDB', data: lead });
  } catch (err) {
    console.warn('[leadController Warning] Fallback adding lead to JSON Store:', err.message);
    const db = getDB();
    const newId = `LEAD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead = {
      id: newId,
      leadId: newId,
      name: req.body.name || 'Anonymous Student',
      phone: req.body.phone || '',
      location: req.body.location || 'Lucknow, UP',
      course: req.body.course || 'Full Stack Web Development',
      status: req.body.status || 'New',
      notes: req.body.notes || 'Inquired from CodeGuru Portal',
      createdAt: new Date().toISOString()
    };
    db.leads = [newLead, ...(db.leads || [])];
    saveDB(db);
    return res.status(201).json({ success: true, message: 'Lead saved to JSON Store', data: newLead });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Update Lead Status
 * --------------------------------------------------------------------------
 * @route   PUT /api/leads/:id
 * @desc    Updates student lead status ('New' | 'Contacted' | 'In Progress' | 'Enrolled').
 * @access  Admin Private
 * @param   {string} req.params.id - Lead MongoDB _id or leadId
 * @param   {Object} req.body - { status: string }
 * @returns {JSON} { success: boolean, message: string, data?: Object }
 */
export const updateLeadStatus = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (lead) return res.json({ success: true, message: 'Lead status updated in MongoDB', data: lead });
  } catch (e) {}

  const db = getDB();
  const index = (db.leads || []).findIndex(l => l.id === req.params.id || l.leadId === req.params.id || l._id?.toString() === req.params.id);
  if (index !== -1) {
    db.leads[index] = { ...db.leads[index], ...req.body };
    saveDB(db);
    return res.json({ success: true, message: 'Lead updated in JSON Store', data: db.leads[index] });
  }

  res.status(404).json({ success: false, message: 'Lead not found' });
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Delete Student Lead
 * --------------------------------------------------------------------------
 * @route   DELETE /api/leads/:id
 * @desc    Permanently deletes a student lead inquiry from database.
 * @access  Admin Private
 * @param   {string} req.params.id - Lead MongoDB _id or leadId
 * @returns {JSON} { success: boolean, message: string }
 */
export const deleteLead = async (req, res) => {
  try {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      await Lead.findByIdAndDelete(req.params.id);
    } else {
      await Lead.deleteMany({ leadId: req.params.id });
    }
  } catch (e) {
    console.warn('[leadController Warning] Error deleting lead from MongoDB:', e.message);
  }

  const db = getDB();
  db.leads = (db.leads || []).filter(l => l.id !== req.params.id && l.leadId !== req.params.id && l._id?.toString() !== req.params.id);
  saveDB(db);

  res.json({ success: true, message: 'Lead record deleted successfully' });
};
