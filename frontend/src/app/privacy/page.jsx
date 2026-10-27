import React from 'react';

export const metadata = {
  title: 'Privacy Policy | CodeGurru Academy',
  description: 'Privacy Policy and data protection terms for CodeGurru educational platform.'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-slate-800 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mt-1">Last updated: October 2026</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-800 font-medium">
        <strong>Notice:</strong> [OWNER TO REVIEW] This privacy policy outlines how CodeGurru collects, uses, and protects student and visitor personal information.
      </div>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
        <p>
          [OWNER TO REVIEW] We collect information you provide directly to us when you fill out course inquiry forms, register for student account OTP authentication, enroll in courses, or contact our support team. This may include your name, contact phone number, email address, city, and course interests.
        </p>

        <h2 className="text-lg font-bold text-slate-900">2. How We Use Your Information</h2>
        <p>
          [OWNER TO REVIEW] We use personal information to deliver our technology educational services, provide student counseling, process batch enrollments, verify student credentials, and communicate course updates.
        </p>

        <h2 className="text-lg font-bold text-slate-900">3. Data Security & Storage</h2>
        <p>
          [OWNER TO REVIEW] All passwords and sensitive credentials are encrypted using industry-standard cryptographic hashes (bcrypt). Personal data is protected and never sold or traded to third-party commercial brokers.
        </p>

        <h2 className="text-lg font-bold text-slate-900">4. Contact Information</h2>
        <p>
          For privacy-related inquiries or data modification requests, please contact us at support@codegurru.in or visit our Ayodhya campus.
        </p>
      </section>
    </div>
  );
}
