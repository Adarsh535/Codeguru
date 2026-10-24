/**
 * ============================================================================
 * API CONTROLLER: ENROLLMENT & PAYMENTS CONTROLLER (enrollmentController.js)
 * ============================================================================
 * Handles REST API actions for student enrollments, payment verification,
 * and automatic synchronization with Student Lead CRM in MongoDB.
 */

import mongoose from 'mongoose';
import { Enrollment } from '../../models/Enrollment.js';
import { Course } from '../../models/Course.js';
import { Lead } from '../../models/Lead.js';
import { broadcastRealtimeEvent } from '../../services/realtimeService.js';

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Get All Enrollments
 * --------------------------------------------------------------------------
 * @route   GET /api/enrollments
 * @desc    Retrieves list of all student course enrollments sorted by latest date.
 * @access  Public / Admin
 * @returns {JSON} { success: boolean, count: number, data: Array<Enrollment> }
 */
export const getEnrollments = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role === 'Student') {
      const email = req.user.email || '';
      const phone = req.user.phone || '';
      query = {
        $or: [
          ...(email ? [{ studentEmail: email }] : []),
          ...(phone ? [{ studentPhone: phone }] : [])
        ]
      };
      if (!query.$or.length) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }
    } else if (!req.admin && (!req.user || req.user.role !== 'Master Admin')) {
      return res.status(401).json({ success: false, message: 'Authentication required to view enrollments' });
    }

    const enrollments = await Enrollment.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch enrollments' });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Create New Enrollment & Record Payment
 * --------------------------------------------------------------------------
 * @route   POST /api/enrollments
 * @desc    Submits a new student course enrollment, saves payment record to MongoDB,
 *          and auto-synchronizes student data into the Lead CRM.
 * @access  Public / Student Portal
 * @param   {Object} req.body - Enrollment & Payment details
 * @returns {JSON} { success: boolean, message: string, data: Object }
 */
export const createEnrollment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to enroll in a batch'
      });
    }

    const {
      courseName,
      batchCode,
      timing,
      mentor,
      startDate,
      paymentPlan,
      transactionId
    } = req.body || {};

    const studentId = req.user.sub || req.user.id;
    const studentName = req.user.name || req.body.studentName || 'Student';
    const studentEmail = req.user.email || req.body.studentEmail || '';
    const studentPhone = req.user.phone || req.body.studentPhone || '';

    // Derive fee securely from Course catalog or standard fee
    let fee = '₹24,999';
    if (courseName) {
      const course = await Course.findOne({ title: courseName });
      if (course && course.price) {
        fee = course.price;
      }
    }

    const newEnrollmentId = `ENR-${Date.now().toString().slice(-6)}`;

    // Zero Trust: feeStatus and status are ALWAYS server-set to Pending Verification
    // paidAmount is 0 until admin verifies the payment
    const newEnrollment = new Enrollment({
      enrollmentId: newEnrollmentId,
      studentId: studentId.toString(),
      studentName,
      studentEmail,
      studentPhone,
      courseName: courseName || 'Full Stack Web Development (MERN)',
      batchCode: batchCode || 'FS-2026-42',
      timing: timing || '09:00 AM - 11:00 AM (Mon-Fri)',
      mentor: mentor || 'Vikrant Shinde',
      startDate: startDate || '15 Sept 2026',
      fee,
      paymentPlan: paymentPlan || 'Full Payment',
      paidAmount: '₹0',
      pendingAmount: fee,
      feeStatus: 'Pending',
      paymentMethod: 'UPI',
      transactionId: transactionId ? String(transactionId).trim().slice(0, 64) : '',
      status: 'Pending Verification'
    });

    const savedEnrollment = await newEnrollment.save();

    // Broadcast event type only — NO sensitive student PII!
    broadcastRealtimeEvent('enrollments_updated');

    res.status(201).json({
      success: true,
      message: 'Enrollment submitted successfully and is pending verification',
      data: savedEnrollment
    });
  } catch (error) {
    console.error('Error creating enrollment:', error.message);
    res.status(500).json({ success: false, message: 'Failed to create enrollment' });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Update Enrollment / Fee Status
 * --------------------------------------------------------------------------
 * @route   PUT /api/enrollments/:id
 * @desc    Updates student enrollment details or fee payment status by MongoDB ID.
 * @access  Admin Protected
 * @param   {string} req.params.id - Enrollment MongoDB ObjectId or Enrollment ID
 * @param   {Object} req.body - Fields to update
 * @returns {JSON} { success: boolean, message: string, data: Object }
 */
export const updateEnrollmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.isValidObjectId(id);
    const enrollment = isObjectId
      ? await Enrollment.findById(id)
      : await Enrollment.findOne({ enrollmentId: id });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    const { feeStatus, status, paidAmount, pendingAmount, notes } = req.body || {};

    // Helper to extract non-negative numeric amount
    const parseNumericAmount = (val) => {
      if (typeof val === 'number') {
        return isNaN(val) ? null : val;
      }
      if (typeof val === 'string') {
        const cleaned = val.replace(/[^0-9.]/g, '').trim();
        if (!cleaned) return null;
        const num = Number(cleaned);
        return isNaN(num) ? null : num;
      }
      return null;
    };

    // Parse course total fee (baseline comparison)
    const totalFeeNum = parseNumericAmount(enrollment.fee) ?? (enrollment.feeInPaise ? enrollment.feeInPaise / 100 : 0);

    // 1. Validate & apply paidAmount
    if (paidAmount !== undefined) {
      const paid = parseNumericAmount(paidAmount);
      if (paid === null || paid < 0) {
        return res.status(400).json({
          success: false,
          message: 'paidAmount must be a non-negative number'
        });
      }
      if (totalFeeNum > 0 && paid > totalFeeNum) {
        return res.status(400).json({
          success: false,
          message: `paidAmount (${paid}) cannot be more than the course fee (${totalFeeNum})`
        });
      }
      enrollment.paidAmount = typeof paidAmount === 'string' && paidAmount.includes('₹')
        ? paidAmount.trim()
        : `₹${paid.toLocaleString('en-IN')}`;
      enrollment.paidAmountInPaise = Math.round(paid * 100);
    }

    // 2. Validate & apply pendingAmount
    if (pendingAmount !== undefined) {
      const pending = parseNumericAmount(pendingAmount);
      if (pending === null || pending < 0) {
        return res.status(400).json({
          success: false,
          message: 'pendingAmount must be a non-negative number'
        });
      }
      enrollment.pendingAmount = typeof pendingAmount === 'string' && pendingAmount.includes('₹')
        ? pendingAmount.trim()
        : `₹${pending.toLocaleString('en-IN')}`;
      enrollment.pendingAmountInPaise = Math.round(pending * 100);
    }

    // 3. Validate & apply feeStatus
    if (feeStatus !== undefined) {
      const validFeeStatuses = ['Pending', 'Paid', 'Installment Pending'];
      if (!validFeeStatuses.includes(feeStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid feeStatus. Allowed values: ${validFeeStatuses.join(', ')}`
        });
      }
      enrollment.feeStatus = feeStatus;
    }

    // 4. Validate & apply status
    if (status !== undefined) {
      const validStatuses = ['Active', 'Pending Verification', 'Completed', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`
        });
      }
      enrollment.status = status;
    }

    // 5. Apply notes
    if (notes !== undefined) {
      enrollment.notes = typeof notes === 'string' ? notes.trim() : String(notes);
    }

    // Fields like courseName, studentId, studentEmail, studentPhone, fee are never mutated
    await enrollment.save();

    broadcastRealtimeEvent('enrollments', enrollment);

    return res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: enrollment
    });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return res.status(500).json({ success: false, message: 'Failed to update enrollment', error: error.message });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Delete Enrollment
 * --------------------------------------------------------------------------
 * @route   DELETE /api/enrollments/:id
 * @desc    Permanently deletes a student enrollment record from MongoDB.
 * @access  Admin Protected
 * @param   {string} req.params.id - Enrollment MongoDB ObjectId
 * @returns {JSON} { success: boolean, message: string }
 */
export const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Enrollment.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    broadcastRealtimeEvent('enrollments', { id, deleted: true });
    res.status(200).json({ success: true, message: 'Enrollment deleted successfully' });
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({ success: false, message: 'Failed to delete enrollment', error: error.message });
  }
};
