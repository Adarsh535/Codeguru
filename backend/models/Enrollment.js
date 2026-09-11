/**
 * ============================================================================
 * MONGOOSE MODEL: STUDENT ENROLLMENT & PAYMENT (Enrollment.js)
 * ============================================================================
 * Defines MongoDB schema for student course enrollments, fee details, and payments.
 */

import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  enrollmentId: { type: String, required: true, unique: true },
  studentId: { type: String, default: '' },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentPhone: { type: String, required: true },
  courseName: { type: String, required: true },
  batchCode: { type: String, default: 'FS-2026-42' },
  timing: { type: String, default: '09:00 AM - 11:00 AM (Mon-Fri)' },
  mentor: { type: String, default: 'Vikrant Shinde' },
  startDate: { type: String, default: '15 Sept 2026' },
  fee: { type: String, required: true },
  paymentPlan: { type: String, default: 'Full Payment' },
  paidAmount: { type: String, required: true },
  pendingAmount: { type: String, default: '₹0' },
  feeStatus: { type: String, enum: ['Paid', 'Installment Pending'], default: 'Paid' },
  paymentMethod: { type: String, default: 'UPI QR' },
  transactionId: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Pending Verification', 'Completed'], default: 'Active' },
  enrollmentDate: { type: String, default: () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
}, {
  timestamps: true
});

export const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);
