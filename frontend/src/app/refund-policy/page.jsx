import React from 'react';

export const metadata = {
  title: 'Refund & Cancellation Policy | CodeGurru Academy',
  description: 'Refund, cancellation, and fee payment policies for CodeGurru training programs.'
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-slate-800 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-slate-500 mt-1">Last updated: October 2026</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-800 font-medium">
        <strong>Notice:</strong> [OWNER TO REVIEW] This document outlines the refund, batch transfer, and cancellation guidelines for student admissions.
      </div>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900">1. Course Fee Payments</h2>
        <p>
          [OWNER TO REVIEW] Course registration fees and installment deposits must be verified through official UPI transaction references or bank transfers. Enrollments remain in pending verification until admin confirmation.
        </p>

        <h2 className="text-lg font-bold text-slate-900">2. Cancellation Prior to Batch Commencement</h2>
        <p>
          [OWNER TO REVIEW] Students requesting cancellation before batch start dates may be eligible for a refund minus administrative processing charges, subject to formal review.
        </p>

        <h2 className="text-lg font-bold text-slate-900">3. Batch Transfer & Rescheduling</h2>
        <p>
          [OWNER TO REVIEW] In cases of academic emergencies or schedule conflicts, students may request a one-time batch timing transfer to an upcoming cohort without forfeiting paid tuition fees.
        </p>

        <h2 className="text-lg font-bold text-slate-900">4. Contact & Refund Requests</h2>
        <p>
          To submit a formal fee refund or batch transfer request, please email admissions@codegurru.in along with your enrollment reference details.
        </p>
      </section>
    </div>
  );
}
