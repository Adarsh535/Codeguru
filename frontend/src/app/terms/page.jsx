import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | CodeGurru Academy',
  description: 'Terms and Conditions of service and training enrollment for CodeGurru.'
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-slate-800 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-500 mt-1">Last updated: October 2026</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-800 font-medium">
        <strong>Notice:</strong> [OWNER TO REVIEW] These terms govern your use of the CodeGurru website, course enrollments, and academic facilities.
      </div>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
        <p>
          [OWNER TO REVIEW] By accessing our portal or enrolling in any technology course batch, you agree to be bound by these terms of service and applicable local laws.
        </p>

        <h2 className="text-lg font-bold text-slate-900">2. Student Code of Conduct</h2>
        <p>
          [OWNER TO REVIEW] Students enrolled in classroom or online batches must adhere to high academic integrity and respect mentors and peers. Intellectual property of course study materials remains with CodeGurru.
        </p>

        <h2 className="text-lg font-bold text-slate-900">3. Certification & Course Completion</h2>
        <p>
          [OWNER TO REVIEW] Official graduation certificates are issued only upon satisfactory completion of batch modules, practical project submissions, and required attendance thresholds.
        </p>

        <h2 className="text-lg font-bold text-slate-900">4. Modifications to Programs</h2>
        <p>
          CodeGurru reserves the right to update technology curricula, batch timings, and mentor allocations to align with latest software industry standards.
        </p>
      </section>
    </div>
  );
}
