'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Code2,
  Smartphone,
  Wrench,
  GraduationCap,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/business';

export default function ServicesPage({ onOpenContactModal }) {
  const [selectedService, setSelectedService] = useState('all');

  const servicesList = [
    {
      id: 'software',
      icon: Code2,
      category: 'SOFTWARE ENGINEERING',
      title: 'Custom Web & Software Development',
      badge: 'POPULAR B2B',
      badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: 'End-to-end bespoke web applications, enterprise ERPs, and cloud SaaS platforms engineered by UK VK Pvt. Ltd.',
      features: [
        'Full Stack Architecture (MERN, Next.js, Python, Java)',
        'Custom Business Billing & GST Inventory Software',
        'High-Converting E-Commerce & Commercial Portals',
        'Cloud Database Design, REST & GraphQL APIs'
      ],
      deliverables: 'Live Deployment, Cloud Security, 6 Months Free Maintenance'
    },
    {
      id: 'mobile',
      icon: Smartphone,
      category: 'APP ENGINEERING',
      title: 'Mobile App Development (Android & iOS)',
      badge: 'HIGH DEMAND',
      badgeStyle: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      description: 'Native and cross-platform mobile apps built with React Native and Flutter for startups and established enterprises.',
      features: [
        'User-Friendly Modern UI/UX Interactive Screens',
        'Push Notifications, Payment Gateway & OTP Integration',
        'Offline Sync, Realtime WebSockets & Geo-Tracking',
        'Google Play Store & Apple App Store Publishing'
      ],
      deliverables: 'Source Code, Admin Dashboard, Store Approval Support'
    },
    {
      id: 'repair',
      icon: Wrench,
      category: 'HARDWARE & DIAGNOSTICS',
      title: 'Computer & Laptop Repair Service',
      badge: 'SAME-DAY FIX',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Certified hardware technicians providing same-day doorstep diagnostics, chip-level motherboard repair, and screen replacements in Lucknow & Ayodhya.',
      features: [
        'Broken Laptop Screen & Display Panel Replacement',
        'Chip-Level Motherboard Diagnostics & Liquid Spill Fix',
        'Slow Laptop Speed Fix: SSD Upgrade & RAM Expansion',
        'Genuine Battery, Keyboard & Hinge Replacement'
      ],
      deliverables: 'Doorstep Pickup & Drop, 90-Day Service Warranty, Genuine Spares'
    },
    {
      id: 'training',
      icon: GraduationCap,
      category: 'VOCATIONAL EDUCATION',
      title: 'Job-Ready IT Training & Corporate Upskilling',
      badge: '100% PLACEMENT',
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Immersive coding bootcamps for engineering students, BCA freshers, and corporate teams with daily live mentorship and hiring drives.',
      features: [
        'MERN Stack, Python AI/ML, Java, C++ & DSA',
        '4+ Production-Grade Capstones with Cloud Deployments',
        'Mock Technical Interviews & Resume Polishing',
        'Direct Campus Recruitment Drives across UP'
      ],
      deliverables: 'Industry Certificate, Verified Portfolio, Lifetime Placement Support'
    }
  ];

  const handleCall = () => {
    window.location.href = `tel:${BUSINESS_CONFIG.contact.primaryPhone.replace(/\s+/g, '')}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/917238829360?text=Hello%20CodeGurru%2C%20I%20am%20interested%20in%20your%20services`, '_blank');
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      
      {/* HERO SECTION */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white px-4 pt-12 pb-16 sm:pb-20 relative overflow-hidden select-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs sm:text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UK VK PVT. LTD. ENTERPRISE ECOSYSTEM</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight mb-3">
            IT Services, Custom Software &amp; Tech Care
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
            From high-scale web development and mobile applications to job-guaranteed coding bootcamps and rapid doorstep laptop repairs across Uttar Pradesh.
          </p>

          {/* QUICK ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleWhatsApp}
              className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Instant WhatsApp Quote</span>
            </button>
            <button
              onClick={handleCall}
              className="bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Call Helpline: +91 72388 29360</span>
            </button>
          </div>
        </div>
      </div>

      {/* SERVICES CARDS GRID */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {servicesList.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 block">
                          {service.category}
                        </span>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-snug">
                          {service.title}
                        </h2>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${service.badgeStyle} shrink-0`}>
                      {service.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-5">
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-semibold">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-xs text-slate-500 font-medium">
                    <strong className="text-slate-800">Support:</strong> {service.deliverables}
                  </div>
                  <button
                    onClick={onOpenContactModal}
                    className="bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Inquire Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM GUARANTEE BANNER */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                100% Quality &amp; Satisfaction Guarantee
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Operated with pride by UK VK Pvt. Ltd. Serving Lucknow, Ayodhya, and clients across Uttar Pradesh.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenContactModal}
            className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
          >
            Connect with Experts
          </button>
        </div>
      </div>

    </div>
  );
}
