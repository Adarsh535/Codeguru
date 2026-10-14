/**
 * ============================================================================
 * API CONTROLLER: LEAD CONTROLLER (leadController.js)
 * ============================================================================
 * Manages student inquiry leads CRUD logic via MongoDB Atlas Mongoose persistence.
 */

import { Lead } from '../../models/Lead.js';
import { Settings } from '../../models/Settings.js';
import { sendRealSMS } from '../../services/smsService.js';
import { broadcastRealtimeEvent } from '../../services/realtimeService.js';

/**
 * @route   GET /api/leads
 * @desc    Retrieves all student inquiry lead records sorted newest first.
 * @access  Admin Private
 */
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    // Auto-migrate & sanitize: Any lead with email address in phone field should have it in email field
    const cleanedLeads = await Promise.all(leads.map(async (lead) => {
      let phone = (lead.phone || '').trim();
      let email = (lead.email || '').trim();
      let modified = false;

      // If phone contains '@', it is actually an email
      if (phone.includes('@')) {
        if (!email) email = phone;
        phone = '';
        modified = true;
      }

      // If email doesn't contain '@' and looks like digits, it is actually a phone
      if (email && !email.includes('@') && /^[\d\s\+\-\(\)]{7,15}$/.test(email)) {
        if (!phone) phone = email;
        email = '';
        modified = true;
      }

      if (modified) {
        lead.phone = phone;
        lead.email = email;
        await lead.save().catch(() => {});
      }

      return lead;
    }));

    return res.json({ success: true, data: cleanedLeads });
  } catch (err) {
    console.error('[leadController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message, data: [] });
  }
};

/**
 * @route   POST /api/leads
 * @desc    Submits a new student inquiry lead into database and triggers background SMS notification.
 * @access  Public / Inquiry Form
 */
export const addLead = async (req, res) => {
  try {
    const newId = `LEAD-${Math.floor(1000 + Math.random() * 9000)}`;

    let phone = (req.body.phone || '').trim();
    let email = (req.body.email || '').trim();

    // If phone contains '@', it is actually an email address
    if (phone.includes('@')) {
      if (!email) email = phone;
      phone = '';
    }

    // If email has no '@' and looks like digits, it is actually a phone number
    if (email && !email.includes('@') && /^[\d\s\+\-\(\)]{7,15}$/.test(email)) {
      if (!phone) phone = email;
      email = '';
    }

    const lead = await Lead.create({
      leadId: req.body.leadId || newId,
      name: req.body.name || 'Anonymous Student',
      phone: phone,
      email: email,
      location: req.body.location || 'Ayodhya, UP',
      course: req.body.course || 'Full Stack Web Development',
      status: req.body.status || 'New',
      notes: req.body.notes || 'Inquired from CodeGurru Portal'
    });

    // Realtime SSE Broadcast for instant live dashboard update across all open admins & tabs
    broadcastRealtimeEvent('leads', lead);

    // Fetch dynamic Admin Notification Phone Number (Default: 9670912923)
    let settings = await Settings.findOne();
    const adminPhone = settings?.adminPhone || '9670912923';

    // Format text message for Cellular SIM SMS Delivery
    const smsMessage = `CodeGurru Alert: New Query! Student: ${lead.name}, Phone: ${lead.phone}, Course: ${lead.course}, Location: ${lead.location}`;

    // Dispatch Real SMS Gateway Service
    sendRealSMS(adminPhone, smsMessage).catch(err => {
      console.warn('Background SMS Dispatch error:', err.message);
    });

    return res.status(201).json({ 
      success: true, 
      message: `Lead recorded in MongoDB Atlas. Notification dispatched to ${adminPhone}`, 
      data: lead 
    });
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
    if (lead) {
      broadcastRealtimeEvent('leads', lead);
      return res.json({ success: true, message: 'Lead status updated in MongoDB Atlas', data: lead });
    }
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
    broadcastRealtimeEvent('leads', { id: req.params.id, deleted: true });
    return res.json({ success: true, message: 'Lead record deleted successfully from MongoDB Atlas' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
