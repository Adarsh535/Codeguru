/**
 * ============================================================================
 * API CONTROLLER: LEAD CONTROLLER (leadController.js)
 * ============================================================================
 * Manages student inquiry leads CRUD logic via MongoDB Atlas Mongoose persistence.
 */

import { Lead } from '../../models/Lead.js';

/**
 * @route   GET /api/leads
 * @desc    Retrieves all student inquiry lead records sorted newest first.
 * @access  Admin Private
 */
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: leads });
  } catch (err) {
    console.error('[leadController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message, data: [] });
  }
};

/**
 * @route   POST /api/leads
 * @desc    Submits a new student inquiry lead into database.
 * @access  Public / Inquiry Form
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

    return res.status(201).json({ success: true, message: 'Lead recorded in MongoDB Atlas', data: lead });
  } catch (err) {
    console.error('[leadController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   PUT /api/leads/:id
 * @desc    Updates student lead status ('New' | 'Contacted' | 'In Progress' | 'Enrolled').
 * @access  Admin Private
 */
export const updateLeadStatus = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (lead) return res.json({ success: true, message: 'Lead status updated in MongoDB Atlas', data: lead });
    return res.status(404).json({ success: false, message: 'Lead not found' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   DELETE /api/leads/:id
 * @desc    Permanently deletes a student lead inquiry from MongoDB Atlas.
 * @access  Admin Private
 */
export const deleteLead = async (req, res) => {
  try {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      await Lead.findByIdAndDelete(req.params.id);
    } else {
      await Lead.deleteMany({ leadId: req.params.id });
    }
    return res.json({ success: true, message: 'Lead record deleted successfully from MongoDB Atlas' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
