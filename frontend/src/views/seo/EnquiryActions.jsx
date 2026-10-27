'use client';

import { Phone, MessageCircle, Send } from 'lucide-react';
import { useModals } from '../../context/ModalsContext';
import { BUSINESS_CONFIG } from '../../config/business';

const digits = (phone) => phone.replace(/[^0-9]/g, '');

/**
 * Call / WhatsApp / enquiry buttons for SEO landing pages.
 * The enquiry button opens the site's existing inquiry modal (lead goes to the admin CRM).
 */
export default function EnquiryActions({ lang = 'en', topicName = '' }) {
  const { openInquiryModal } = useModals();
  const hi = lang === 'hi';
  const waText = encodeURIComponent(hi ? `नमस्ते, मुझे ${topicName} कोर्स की जानकारी चाहिए।` : `Hi, I want details of the ${topicName} course.`);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => openInquiryModal()}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold"
      >
        <Send className="w-4 h-4" />
        {hi ? 'फ्री काउंसलिंग बुक करें' : 'Book free counselling'}
      </button>
      <a
        href={`tel:${digits(BUSINESS_CONFIG.contact.primaryPhone)}`}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-bold hover:border-slate-300"
      >
        <Phone className="w-4 h-4" />
        {BUSINESS_CONFIG.contact.primaryPhone}
      </a>
      <a
        href={`https://wa.me/${digits(BUSINESS_CONFIG.contact.whatsapp)}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </a>
    </div>
  );
}
