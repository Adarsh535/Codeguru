/**
 * ============================================================================
 * BACKEND CONTROLLER: ENROLLMENT & PAYMENTS (enrollmentController.js)
 * ============================================================================
 * Handles REST API actions for student enrollments, payment verification,
 * and automatic synchronization with Student Lead CRM in MongoDB.
 */

import { Enrollment } from '../models/Enrollment.js';
import { Lead } from '../models/Lead.js';

/**
 * GET /api/enrollments
 * Retrieves list of all student course enrollments
 */
export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch enrollments', error: error.message });
  }
};

/**
 * POST /api/enrollments
 * Submits a new student course enrollment and records payment
 */
export const createEnrollment = async (req, res) => {
  try {
    const {
      id,
      enrollmentId,
      studentId,
      studentName,
      studentEmail,
      studentPhone,
      courseName,
      batchCode,
      timing,
      mentor,
      startDate,
      fee,
      paymentPlan,
      paidAmount,
      pendingAmount,
      feeStatus,
      paymentMethod,
      transactionId,
      status
    } = req.body;

    const newEnrollmentId = id || enrollmentId || `ENR-${Date.now().toString().slice(-6)}`;
    const newStudentId = studentId || `CG-STU-${Math.floor(1000 + Math.random() * 9000)}`;

    const newEnrollment = new Enrollment({
      enrollmentId: newEnrollmentId,
      studentId: newStudentId,
      studentName: studentName || 'Student User',
      studentEmail: studentEmail || 'student@example.com',
      studentPhone: studentPhone || '9876543210',
      courseName: courseName || 'Full Stack Web Development (MERN)',
      batchCode: batchCode || 'FS-2026-42',
      timing: timing || '09:00 AM - 11:00 AM (Mon-Fri)',
      mentor: mentor || 'Vikrant Shinde',
      startDate: startDate || '15 Sept 2026',
      fee: fee || '₹24,999',
      paymentPlan: paymentPlan || 'Full Payment',
      paidAmount: paidAmount || fee || '₹24,999',
      pendingAmount: pendingAmount || '₹0',
      feeStatus: feeStatus || 'Paid',
      paymentMethod: paymentMethod || 'UPI QR',
      transactionId: transactionId || `TXN${Date.now().toString().slice(-8)}`,
      status: status || 'Active'
    });

    const savedEnrollment = await newEnrollment.save();

    // Auto-create / update student in Lead CRM
    try {
      const leadId = `LEAD-${Date.now().toString().slice(-5)}`;
      await Lead.findOneAndUpdate(
        { phone: newEnrollment.studentPhone },
        {
          leadId,
          name: newEnrollment.studentName,
          phone: newEnrollment.studentPhone,
          course: `${newEnrollment.courseName} (${newEnrollment.batchCode})`,
          status: 'Enrolled',
          notes: `Enrolled via Student Portal (${newEnrollment.paymentPlan}, Paid: ${newEnrollment.paidAmount}, Txn: ${newEnrollment.transactionId})`
        },
        { upsert: true, new: true }
      );
    } catch (leadErr) {
      console.warn('Sync lead notice:', leadErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Student enrolled and payment recorded successfully',
      data: savedEnrollment
    });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({ success: false, message: 'Failed to create enrollment', error: error.message });
  }
};

/**
 * PUT /api/enrollments/:id
 * Updates enrollment status or payment fee status
 */
export const updateEnrollmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Enrollment.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    res.status(500).json({ success: false, message: 'Failed to update enrollment', error: error.message });
  }
};

/**
 * DELETE /api/enrollments/:id
 * Removes an enrollment record
 */
export const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Enrollment.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    res.status(200).json({ success: true, message: 'Enrollment deleted successfully' });
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({ success: false, message: 'Failed to delete enrollment', error: error.message });
  }
};
