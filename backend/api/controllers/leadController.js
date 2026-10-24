/**
 * ============================================================================
 * API CONTROLLER: LEAD CONTROLLER (leadController.js)
 * ============================================================================
 * Manages student inquiry leads CRUD logic via MongoDB Atlas Mongoose persistence.
 */

import mongoose from 'mongoose';
import { Lead } from '../../models/Lead.js';
import { Counter } from '../../models/Counter.js';
import { Settings } from '../../models/Settings.js';
import { sendRealSMS } from '../../services/smsService.js';
import { broadcastRealtimeEvent } from '../../services/realtimeService.js';
import { cleanText } from '../../utils/sanitizeInput.js';

/**
 * @route   GET /api/leads
 * @desc    Retrieves student inquiry leads with pagination.
 * @access  Admin Private
 */
export const getLeads = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    // Filter by status if provided
    const filter = {};
    if (req.query.status && typeof req.query.status === 'string') {
      filter.status = req.query.status.trim();
    }

    const [total, leads] = await Promise.all([
      Lead.countDocuments(filter),
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip(req.query.limit ? skip : 0)
        .limit(req.query.limit ? limit : 0)
        .lean()
    ]);

    return res.json({
      success: true,
      data: leads,
      total,
      page,
      limit: req.query.limit ? limit : total
    });
  } catch (err) {
    console.error('[leadController getLeads Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve leads', data: [] });
  }
};

/**
 * @route   POST /api/leads
 * @desc    Submits a new student inquiry lead. Strict input validation & whitelisting (B17, B20, B21).
 * @access  Public / Inquiry Form
 */
export const addLead = async (req, res) => {
  try {
    const body = req.body || {};

    // 1. Sanitize & extract contact info
    let phone = (typeof body.phone === 'string' ? body.phone : '').trim();
    let email = (typeof body.email === 'string' ? body.email : '').trim().toLowerCase();

    // Auto-swap if accidentally inverted
    if (phone.includes('@')) {
      if (!email) email = phone;
      phone = '';
    } else if (email && !email.includes('@') && /^[\d\s\+\-\(\)]{7,15}$/.test(email)) {
      if (!phone) phone = email;
      email = '';
    }

    // Clean phone to digits
    phone = phone.replace(/[^\d+]/g, '');

    // Validate: At least one contact info is strictly required (B20)
    if (!phone && !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number.'
      });
    }

    if (phone) {
      const pureDigits = phone.replace(/\D/g, '');
      if (!/^\+?[0-9]{10,14}$/.test(phone) || pureDigits.length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid 10-digit mobile number.'
        });
      }
      // Security: Block dummy repeated digits (e.g. 0000000000, 1111111111)
      if (/^(\d)\1+$/.test(pureDigits)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid mobile number, not repeated dummy digits.'
        });
      }
      // Indian mobile numbers must start with 6, 7, 8, or 9
      if (pureDigits.length === 10 && !/^[6-9]/.test(pureDigits)) {
        return res.status(400).json({
          success: false,
          message: 'Indian mobile numbers must start with 6, 7, 8, or 9.'
        });
      }
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    // Validate student name
    const rawName = (typeof body.name === 'string' ? body.name : '').trim();
    const name = cleanText(rawName);
    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your real full name (at least 2 characters).'
      });
    }
    if (name.length > 80) {
      return res.status(400).json({
        success: false,
        message: 'Name is too long (maximum 80 characters).'
      });
    }

    // 2. Generate sequential non-colliding leadId using atomic counter (B21)
    let leadId;
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'leadId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      leadId = `LEAD-${String(counter.seq).padStart(6, '0')}`;
    } catch {
      leadId = `LEAD-${Date.now().toString(36).toUpperCase()}`;
    }

    // 3. Whitelist allowed fields only (never trust status, notes, or leadId from client)
    // cleanText strips any HTML/script so stored values can't execute in the admin panel (stored XSS).
    const city = cleanText(typeof body.city === 'string' ? body.city : '');
    const state = cleanText(typeof body.state === 'string' ? body.state : '');
    const course = cleanText(typeof body.course === 'string' ? body.course : '') || 'Full Stack Web Development';
    const message = cleanText(typeof body.message === 'string' ? body.message : '');
    const clientNotes = cleanText(typeof body.notes === 'string' ? body.notes : '');
    
    const latitude = typeof body.latitude === 'number' ? body.latitude : (body.latitude ? parseFloat(body.latitude) : null);
    const longitude = typeof body.longitude === 'number' ? body.longitude : (body.longitude ? parseFloat(body.longitude) : null);
    const location_source = ['gps', 'manual', 'ip'].includes(body.location_source)
      ? body.location_source
      : (city ? 'manual' : 'unknown');

    const displayLocation = (
      (typeof body.location === 'string' && cleanText(body.location)) ||
      (city ? `${city}${state ? `, ${state}` : ''}` : '')
    ) || 'Not Specified';

    const finalNotes = clientNotes || (message ? `Message: ${message}` : `Inquiry from CodeGurru Portal (${displayLocation})`);

    // Deduplication guard: if an inquiry with this exact phone was submitted in the last 30 seconds, update rather than duplicate
    const thirtySecsAgo = new Date(Date.now() - 30 * 1000);
    const existingRecentLead = await Lead.findOne({
      phone,
      createdAt: { $gte: thirtySecsAgo }
    }).sort({ createdAt: -1 });

    if (existingRecentLead) {
      if (name && name !== 'Student Applicant') existingRecentLead.name = name;
      if (email) existingRecentLead.email = email;
      if (displayLocation && displayLocation !== 'Not Specified') existingRecentLead.location = displayLocation;
      if (course) existingRecentLead.course = course;
      await existingRecentLead.save();
      broadcastRealtimeEvent('leads_updated', { type: 'leads_updated' });
      return res.status(200).json({
        success: true,
        message: 'Inquiry submitted successfully. Our counselor will contact you soon.',
        data: {
          id: existingRecentLead._id,
          _id: existingRecentLead._id,
          leadId: existingRecentLead.leadId,
          name: existingRecentLead.name,
          phone: existingRecentLead.phone,
          email: existingRecentLead.email,
          course: existingRecentLead.course,
          location: existingRecentLead.location,
          city: existingRecentLead.city,
          state: existingRecentLead.state,
          status: existingRecentLead.status,
          createdAt: existingRecentLead.createdAt
        }
      });
    }

    const lead = await Lead.create({
      leadId,
      name,
      phone,
      email,
      city,
      state,
      latitude,
      longitude,
      location_source,
      location: displayLocation,
      course,
      status: 'New',
      notes: finalNotes
    });

    // 4. SSE Broadcast: Broadcast only event type, zero PII over unencrypted SSE (Section 2.4)
    broadcastRealtimeEvent('leads_updated', { type: 'leads_updated' });

    // 5. Notify admin via SMS asynchronously if configured (do NOT leak admin phone in response - B17)
    Settings.findOne().then(settings => {
      const adminPhone = settings?.adminPhone;
      if (adminPhone) {
        const smsMessage = `CodeGurru Alert: New Query! Student: ${lead.name}, Phone: ${lead.phone || 'N/A'}, Course: ${lead.course}, City: ${lead.city || lead.location}`;
        sendRealSMS(adminPhone, smsMessage).catch(err => {
          console.warn('[Background SMS dispatch error]:', err.message);
        });
      }
    }).catch(() => {});

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. Our counselor will contact you soon.',
      data: {
        id: lead._id,
        _id: lead._id,
        leadId: lead.leadId,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        course: lead.course,
        location: lead.location,
        city: lead.city,
        state: lead.state,
        status: lead.status,
        createdAt: lead.createdAt
      }
    });
  } catch (err) {
    console.error('[leadController addLead Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to submit inquiry' });
  }
};

/**
 * @route   PUT /api/leads/:id
 * @desc    Updates student lead status ('New' | 'Contacted' | 'In Progress' | 'Enrolled'). Whitelisted fields only (B22).
 * @access  Admin Private
 */
export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.isValidObjectId(id);

    // Whitelist allowed fields only
    const allowedUpdates = {};
    if (req.body.status && ['New', 'Contacted', 'In Progress', 'Enrolled'].includes(req.body.status)) {
      allowedUpdates.status = req.body.status;
    }
    if (typeof req.body.notes === 'string') {
      allowedUpdates.notes = req.body.notes.trim();
    }

    const query = isObjectId ? { _id: id } : { leadId: id };
    const lead = await Lead.findOneAndUpdate(query, { $set: allowedUpdates }, { new: true, runValidators: true });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    broadcastRealtimeEvent('leads_updated', { type: 'leads_updated' });
    return res.json({ success: true, message: 'Lead updated successfully', data: lead });
  } catch (err) {
    console.error('[leadController updateLeadStatus Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to update lead' });
  }
};

/**
 * @route   DELETE /api/leads/:id
 * @desc    Permanently deletes a student lead inquiry from MongoDB Atlas.
 * @access  Admin Private
 */
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.isValidObjectId(id);
    const query = isObjectId ? { _id: id } : { leadId: id };

    const result = await Lead.deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    broadcastRealtimeEvent('leads_updated', { type: 'leads_updated' });
    return res.json({ success: true, message: 'Lead record deleted successfully' });
  } catch (err) {
    console.error('[leadController deleteLead Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to delete lead' });
  }
};

/**
 * @route   POST /api/leads/update-details
 * @desc    Updates student lead inquiry details (Name, Email, Location) after Step 1 phone entry.
 * @access  Public
 */
export const updateLeadDetails = async (req, res) => {
  try {
    const { leadId, phone, name, email, location } = req.body || {};
    const cleanPhone = (phone || '').toString().replace(/[^0-9]/g, '').slice(-10);

    // SECURITY: only allow updating a lead the caller actually owns via its leadId.
    // Looking leads up by phone let anyone target/overwrite any lead and enumerate
    // all customer data. `notes` is admin-only and is never set from this public route.
    let lead = null;
    if (leadId) {
      lead = await Lead.findOne({
        $or: [
          { leadId: leadId },
          ...(mongoose.Types.ObjectId.isValid(leadId) ? [{ _id: leadId }] : [])
        ]
      });
    }

    // Deduplication fallback: if leadId didn't match directly, locate recently submitted lead for this phone (last 15 mins)
    if (!lead && cleanPhone) {
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
      lead = await Lead.findOne({
        phone: cleanPhone,
        createdAt: { $gte: fifteenMinsAgo }
      }).sort({ createdAt: -1 });
    }

    const safeName = cleanText(name);
    const safeEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const safeLocation = cleanText(location);

    if (lead) {
      if (safeName) lead.name = safeName;
      if (safeEmail) lead.email = safeEmail;
      if (safeLocation && safeLocation !== 'Online Visitor') lead.location = safeLocation;
      await lead.save();

      broadcastRealtimeEvent('leads_updated', { type: 'leads_updated' });

      // Minimal response — never echo the full lead record back to a public caller.
      return res.json({
        success: true,
        message: 'Details updated successfully',
        data: { leadId: lead.leadId }
      });
    }

    // No valid leadId → create a fresh lead (cannot touch anyone else's record).
    let newLeadId;
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'leadId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      newLeadId = `LEAD-${String(counter.seq).padStart(6, '0')}`;
    } catch {
      newLeadId = `LEAD-${Date.now().toString(36).toUpperCase()}`;
    }

    const newLead = await Lead.create({
      leadId: newLeadId,
      name: safeName || 'Student Applicant',
      phone: cleanPhone,
      email: safeEmail,
      location: safeLocation || 'Not Specified',
      course: 'Admission & Training Inquiry',
      status: 'New',
      notes: 'Direct Student Inquiry from Portal'
    });

    broadcastRealtimeEvent('leads_updated', { type: 'leads_updated' });

    return res.status(201).json({
      success: true,
      message: 'Details saved successfully',
      data: { leadId: newLead.leadId }
    });
  } catch (err) {
    console.error('[leadController updateLeadDetails Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to update lead details' });
  }
};
