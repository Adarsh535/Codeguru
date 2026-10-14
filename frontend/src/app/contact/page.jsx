import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/business';

export const metadata = {
  title: 'Contact CodeGurru | Lucknow & Ayodhya Campus Helplines',
  description:
    'Contact CodeGurru (UK VK Pvt. Ltd.) at Lucknow Head Office or Ayodhya Campus. Call +91 72388 29360 for course admissions, software quotes, or laptop repair pickup.',
  keywords: [
    'Contact CodeGurru',
    'CodeGurru Phone Number',
    'CodeGurru Ayodhya Address',
    'CodeGurru Lucknow Head Office',
    'Laptop Repair Contact Lucknow',
    'IT Training Admission Ayodhya',
  ],
  alternates: {
    canonical: 'https://codegurru.in/contact',
  },
  openGraph: {
    title: 'Contact CodeGurru | Campus Coordinates & Support Desks',
    description: 'Reach our admissions, IT software consulting, and laptop repair desks in Lucknow and Ayodhya.',
    url: 'https://codegurru.in/contact',
  },
};

export default function ContactPage() {
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'CodeGurru (UK VK Pvt. Ltd.)',
    image: 'https://codegurru.in/logo.png',
    telephone: BUSINESS_CONFIG.contact.primaryPhone,
    email: BUSINESS_CONFIG.contact.email,
    url: 'https://codegurru.in/contact',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_CONFIG.branches[0].streetAddress,
      addressLocality: 'Ayodhya',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 26.7922,
      longitude: 82.1998,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:00',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <div className="w-full bg-slate-50 min-h-screen pb-16">
        
        {/* HERO BANNER */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white px-4 pt-12 pb-16 text-center select-none">
          <span className="text-amber-400 font-extrabold text-xs uppercase tracking-widest block mb-2">
            OFFICIAL CAMPUS &amp; SUPPORT HELPDESK
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight mb-3">
            Contact CodeGurru
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto font-normal">
            UK VK Pvt. Ltd. | Reach our admissions counsellors, enterprise software leads, or hardware repair specialists.
          </p>
        </div>

        {/* CAMPUS NAP DISPLAY */}
        <div className="max-w-3xl mx-auto px-4 -mt-8 relative z-20">
          <div className="w-full">

            {/* AYODHYA BRANCH */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-cyan-400 transition-all flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-600 tracking-wider block mb-1">
                  REGIONAL BRANCH &amp; TRAINING CAMPUS
                </span>
                <h2 className="text-lg font-black text-slate-900 font-heading mb-3">
                  {BUSINESS_CONFIG.branches[0].title}
                </h2>
                
                <div className="space-y-2.5 text-xs text-slate-700 mb-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Address:</strong> {BUSINESS_CONFIG.branches[0].fullAddress}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <strong>Phone:</strong>{' '}
                      <a href={`tel:${BUSINESS_CONFIG.contact.primaryPhone.replace(/\s+/g, '')}`} className="font-bold hover:text-cyan-600">
                        {BUSINESS_CONFIG.contact.primaryPhone}
                      </a>{' '}
                      /{' '}
                      <a href={`tel:${BUSINESS_CONFIG.contact.secondaryPhone.replace(/\s+/g, '')}`} className="font-bold hover:text-cyan-600">
                        {BUSINESS_CONFIG.contact.secondaryPhone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <strong>Email:</strong>{' '}
                      <a href={`mailto:${BUSINESS_CONFIG.contact.email}`} className="font-bold hover:text-cyan-600">
                        {BUSINESS_CONFIG.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-purple-500 shrink-0" />
                    <div>
                      <strong>Working Hours:</strong> {BUSINESS_CONFIG.contact.workingHours}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:${BUSINESS_CONFIG.contact.primaryPhone.replace(/\s+/g, '')}`}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs px-4 py-2 rounded-xl uppercase tracking-wider transition-all"
                >
                  Call Ayodhya Campus
                </a>
                <span className="text-[10px] text-slate-400 font-bold">Ayodhya, Uttar Pradesh</span>
              </div>
            </div>

          </div>

          {/* EMBEDDED GOOGLE MAP & INSTANT WHATSAPP CTA */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm font-heading">
                  Interactive Campus Navigation &amp; Location
                </h3>
                <p className="text-[11px] text-slate-400">
                  Located near Saket College Petrol Pump, Ayodhya, Uttar Pradesh.
                </p>
              </div>
              <a
                href="https://wa.me/917238829360?text=Hello%20CodeGurru%2C%20I%20want%20to%20visit%20your%20campus"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-4 py-2 rounded-xl uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5"
              >
                <span>💬 WhatsApp Location</span>
              </a>
            </div>
            
            <div className="w-full h-72 sm:h-80 bg-slate-100">
              <iframe
                title="CodeGurru Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113997.77709325985!2d82.13824128520286!3d26.788481546871184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399a07937e6d2823%3A0x5fc85775f0a3952f!2sAyodhya%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
