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
  Layers,
  MessageSquare,
  FileCheck,
  Check,
  Zap,
  ChevronDown,
  Building2,
  Award,
  Headphones,
  Laptop,
  Flame,
  HelpCircle,
  FolderGit2,
  Database,
  ExternalLink
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/business';
import { useModals } from '../../context/ModalsContext';

export default function ServicesPage({ onOpenContactModal, onOpenOtpSheet }) {
  const { openOtpSheet, openContactModal } = useModals();
  const [activeTab, setActiveTab] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);

  const handleOpenOtp = () => {
    if (typeof onOpenOtpSheet === 'function') {
      onOpenOtpSheet();
    } else if (typeof openOtpSheet === 'function') {
      openOtpSheet();
    } else if (typeof onOpenContactModal === 'function') {
      onOpenContactModal();
    } else if (typeof openContactModal === 'function') {
      openContactModal();
    }
  };

  const servicesList = [
    {
      id: 'software',
      categoryKey: 'software',
      icon: Code2,
      category: 'SOFTWARE ENGINEERING',
      title: 'Custom Web Applications & Enterprise ERPs',
      badge: 'TOP CHOICE FOR BUSINESSES',
      badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      accentColor: 'from-indigo-500 to-blue-600',
      accentBorder: 'hover:border-indigo-500/50',
      description:
        'End-to-end bespoke web platforms, GST billing software, and custom ERPs engineered specifically for your business workflow. No recurring subscription lock-ins — you own 100% of the code.',
      techStack: [
        'Next.js 15',
        'React',
        'Node.js',
        'Python / FastAPI',
        'PostgreSQL',
        'Tailwind CSS',
        'Docker',
        'AWS Cloud'
      ],
      highlights: [
        {
          label: 'Custom GST & Inventory Automation',
          desc: 'Instant invoice generation, barcode scanning, stock ledger accounting, and seamless Tally data export.'
        },
        {
          label: 'Sub-Second Page Speed & SEO',
          desc: 'SSR-optimized architecture achieving 95+ Google Lighthouse scores for maximum search visibility.'
        },
        {
          label: 'Role-Based Access Control (RBAC)',
          desc: 'Granular permissions for admin, staff, and accountants with audit logging and multi-branch data isolation.'
        },
        {
          label: 'Complete Source Code & IP Handover',
          desc: 'Clean, documented GitHub repository transfer with zero vendor lock-in and perpetual commercial usage rights.'
        }
      ],
      turnaround: '2 – 4 Weeks MVP',
      warranty: '6 Months Free Maintenance SLA',
      startingHint: 'Bespoke Fixed-Milestone Pricing',
      ctaText: 'Get Software Architecture Quote'
    },
    {
      id: 'mobile',
      categoryKey: 'mobile',
      icon: Smartphone,
      category: 'MOBILE APP ENGINEERING',
      title: 'Native & Cross-Platform Mobile Apps (iOS & Android)',
      badge: 'HIGH DEMAND',
      badgeStyle: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      accentColor: 'from-cyan-500 to-teal-600',
      accentBorder: 'hover:border-cyan-500/50',
      description:
        'Production-grade mobile apps engineered with Flutter and React Native. Fluid 60fps animations, offline data persistence, instant UPI payment gateway checkout, and guaranteed App Store & Play Store approval.',
      techStack: [
        'Flutter',
        'React Native',
        'iOS Swift',
        'Android Kotlin',
        'Firebase',
        'Razorpay / Cashfree',
        'WebSockets',
        'App Store Connect'
      ],
      highlights: [
        {
          label: 'Unified iOS & Android Experience',
          desc: 'One clean codebase delivering pixel-perfect native speed and platform-specific UI patterns.'
        },
        {
          label: 'Instant UPI, Cards & OTP Auth',
          desc: 'Seamless 1-tap checkout via PhonePe, Google Pay, Paytm, and ultra-reliable SMS/WhatsApp OTP login.'
        },
        {
          label: 'Offline-First Sync Engine',
          desc: 'Users can create records and view catalog data offline; changes auto-sync as soon as connectivity resumes.'
        },
        {
          label: 'Guaranteed Store Publishing',
          desc: 'We handle end-to-end Google Play Console and Apple Developer review compliance until your app is live.'
        }
      ],
      turnaround: '3 – 5 Weeks',
      warranty: 'Store Approval + 6 Months SLA',
      startingHint: 'Includes Web Admin Portal',
      ctaText: 'Discuss Your Mobile App Scope'
    },
    {
      id: 'repair',
      categoryKey: 'repair',
      icon: Wrench,
      category: 'PRECISION HARDWARE LAB',
      title: 'Chip-Level Laptop & Computer Repair',
      badge: 'SAME-DAY IN AYODHYA & LUCKNOW',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      accentColor: 'from-emerald-500 to-teal-600',
      accentBorder: 'hover:border-emerald-500/50',
      description:
        'Certified hardware technicians equipped with micro-soldering BGA rework stations. We fix motherboard short-circuits, liquid spill damage, broken hinges, and failing laptop displays with 100% genuine spares.',
      techStack: [
        'Apple MacBook',
        'Dell Inspiron / XPS',
        'HP Pavilion / Omen',
        'Lenovo ThinkPad',
        'Asus ROG / TUF',
        'Acer Predator'
      ],
      highlights: [
        {
          label: 'Motherboard Chip-Level BGA Diagnostics',
          desc: 'Oscilloscope testing, IC & capacitor replacement, power rail debugging, and dead motherboard revival.'
        },
        {
          label: 'Original Screen & Display Matrix Repair',
          desc: 'Same-day replacement for cracked IPS/OLED screens, flickering lines, and broken backlight inverters.'
        },
        {
          label: 'Extreme Speed Supercharge (SSD + RAM)',
          desc: 'Upgrade sluggish HDDs to ultra-fast NVMe SSDs with complete OS cloning, thermal repasting, and deep fan de-dusting.'
        },
        {
          label: 'Doorstep Pickup & Campus Diagnostics',
          desc: 'Drop off at our Ayodhya Campus or request doorstep technician pickup across Ayodhya and Lucknow.'
        }
      ],
      turnaround: '4 – 24 Hours',
      warranty: '90-Day Written Service Warranty',
      startingHint: 'Free On-Campus Diagnostics',
      ctaText: 'Book Same-Day Laptop Repair'
    },
    {
      id: 'training',
      categoryKey: 'training',
      icon: GraduationCap,
      category: 'VOCATIONAL TECH ACADEMY',
      title: 'Job-Ready IT Bootcamps & Corporate Upskilling',
      badge: '100% PLACEMENT DRIVES',
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
      accentColor: 'from-amber-500 to-orange-600',
      accentBorder: 'hover:border-amber-500/50',
      description:
        'Rigorous hands-on coding bootcamps for engineering students, BCA/MCA freshers, and corporate teams. Build production-grade capstone projects under senior software architects with daily 1-on-1 mentorship.',
      techStack: [
        'Full Stack MERN',
        'Python & AI / ML',
        'Java Spring Boot',
        'C++ & DSA',
        'Git & DevOps',
        'Mock Interviews'
      ],
      highlights: [
        {
          label: '4+ Production Cloud Capstones',
          desc: 'Graduate with deployed full-stack SaaS apps on your GitHub profile, not toy clone tutorials.'
        },
        {
          label: 'Direct Campus Placement Drives',
          desc: 'Exclusive recruitment drives and referral tie-ups with 50+ IT firms across Lucknow, Noida, and NCR.'
        },
        {
          label: 'Rigorous DSA & System Design Rounds',
          desc: 'Daily algorithm problem solving, LeetCode patterns, and behavioral mock interviews with working engineers.'
        },
        {
          label: 'ISO-Certified Industry Credential',
          desc: 'Official certificate of completion from UK VK Pvt. Ltd. with online QR verification for employer validation.'
        }
      ],
      turnaround: '3 – 6 Months Programs',
      warranty: 'Lifetime Placement Cell Support',
      startingHint: '0% EMI Options Available',
      ctaText: 'Explore Bootcamps & Syllabus'
    }
  ];

  const filteredServices =
    activeTab === 'all'
      ? servicesList
      : servicesList.filter((s) => s.categoryKey === activeTab);

  const faqs = [
    {
      q: 'Who owns the intellectual property and source code of custom software?',
      a: 'You own 100% of the intellectual property, copyright, and source code upon project completion and final milestone clearance. We transfer complete GitHub repositories, database schemas, and deployment credentials with zero vendor lock-in.'
    },
    {
      q: 'Do you sign Non-Disclosure Agreements (NDAs) before discussion?',
      a: 'Yes, absolutely. We treat your proprietary business ideas, customer data, and operational blueprints with strict confidentiality. We provide a signed mutual NDA before requirement gathering.'
    },
    {
      q: 'How fast can you diagnose and repair a broken laptop or desktop?',
      a: 'Most standard repairs — including SSD upgrades, RAM expansion, OS installation, and screen replacements — are completed within 4 to 8 hours. Complex chip-level motherboard BGA rework and liquid damage repairs take 24 to 48 hours, backed by a 90-day written warranty.'
    },
    {
      q: 'How does your payment structure work for software & app projects?',
      a: 'We work on transparent, milestone-based payments (e.g., 25% kickoff upon architecture sign-off, 25% upon UI/UX & database completion, 25% on staging demo approval, and 25% on production deployment). You review working software before each release.'
    },
    {
      q: 'What kind of support is included after our website or app goes live?',
      a: 'Every software build includes 6 months of complimentary bug fixing, cloud monitoring, and security patch updates. We also offer affordable Annual Maintenance Contracts (AMC) for ongoing feature expansions.'
    }
  ];

  const protocolSteps = [
    {
      num: '01',
      title: 'Discovery & Architecture Blueprint',
      desc: 'We analyze your workflows, database architecture, and integration requirements. You receive a detailed technical roadmap with milestone deliverables and transparent fixed pricing.'
    },
    {
      num: '02',
      title: 'Agile Sprint Engineering',
      desc: 'Our engineers build in rapid 2-week sprints. You get private staging URLs and weekly video walkthroughs to interact with live software as it gets built.'
    },
    {
      num: '03',
      title: 'Rigorous Security & QA Testing',
      desc: 'Every endpoint is audited for SQL injection, XSS, rate limiting, and peak stress loads. We benchmark across 10+ mobile device sizes and ensure 95+ performance scores.'
    },
    {
      num: '04',
      title: 'Cloud Launch & Code Handover',
      desc: 'We manage domain configuration, SSL certificates, AWS/Vercel production rollout, and hand over the keys: source code, admin manuals, and 6 months dedicated SLA support.'
    }
  ];

  const handleCall = () => {
    window.location.href = `tel:${BUSINESS_CONFIG.contact.primaryPhone.replace(/\s+/g, '')}`;
  };

  const handleWhatsApp = (serviceTitle = 'IT Services') => {
    const text = encodeURIComponent(
      `Hello CodeGurru Team, I am inquiring about: ${serviceTitle}. Could you share scope details and a project quote?`
    );
    window.open(`https://wa.me/917238829360?text=${text}`, '_blank');
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen pb-20 text-slate-900 font-sans selection:bg-orange-200 overflow-x-hidden">
      
      {/* =========================================================================
          HERO SECTION: CLEAN PREMIUM LIGHT CANVAS
      ========================================================================== */}
      <section className="relative w-full bg-white text-slate-900 pt-12 pb-16 sm:pt-20 sm:pb-24 px-3.5 sm:px-6 lg:px-8 border-b border-slate-200/80 overflow-hidden select-none">
        
        {/* Engineering Blueprint Mesh & Subtle Ambient Glow */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1.2px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] sm:w-[700px] h-[220px] sm:h-[350px] bg-gradient-to-b from-orange-100/70 via-amber-50/40 to-transparent blur-[80px] sm:blur-[110px] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-50/50 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          
          {/* Live Studio Availability Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 shadow-2xs mb-4 sm:mb-6 backdrop-blur-md max-w-full">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-700 tracking-wide truncate">
              Engineering Lab &amp; Tech Campus • Ayodhya &amp; Lucknow
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold font-heading tracking-tight text-slate-950 max-w-4xl leading-[1.2] mb-3 sm:mb-5">
            Bespoke Software Engineering &amp;{' '}
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              Precision Tech Care.
            </span>
          </h1>

          {/* Authentic, Human Sub-Headline */}
          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal mb-6 sm:mb-8 px-1">
            We architect high-performing web platforms, native mobile apps, and enterprise billing ERPs — plus same-day motherboard chip repair by certified engineers across Uttar Pradesh.
          </p>

          {/* Mobile-Optimized Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5 w-full max-w-md sm:max-w-none mb-8 sm:mb-10">
            <button
              type="button"
              suppressHydrationWarning
              onClick={handleOpenOtp}
              className="w-full sm:w-auto justify-center group bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl text-xs sm:text-sm shadow-md shadow-orange-500/25 hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Request a Project Quote</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3.5 w-full sm:w-auto">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => handleWhatsApp('General IT Services & Software')}
                className="w-full sm:w-auto justify-center bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#16a34a] hover:text-[#15803d] font-semibold px-3 sm:px-5 py-3 sm:py-3.5 rounded-xl text-[11px] sm:text-xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                suppressHydrationWarning
                onClick={handleCall}
                className="w-full sm:w-auto justify-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-slate-950 font-semibold px-3 sm:px-5 py-3 sm:py-3.5 rounded-xl text-[11px] sm:text-xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs truncate"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">Call Helpline</span>
              </button>
            </div>
          </div>

          {/* Proof / Trust Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 w-full max-w-4xl pt-6 sm:pt-8 border-t border-slate-200 text-left">
            <div className="p-3 sm:p-4 rounded-xl bg-slate-50/90 border border-slate-200/90 hover:bg-white hover:shadow-xs transition-all">
              <div className="text-lg sm:text-2xl font-black text-slate-950 font-heading">150+</div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-snug font-medium">Deployed Systems &amp; Apps</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70 hover:bg-white hover:shadow-xs transition-all">
              <div className="text-lg sm:text-2xl font-black text-emerald-600 font-heading">Same-Day</div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-snug font-medium">Hardware Chip Diagnostics</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-orange-50/60 border border-orange-200/70 hover:bg-white hover:shadow-xs transition-all">
              <div className="text-lg sm:text-2xl font-black text-orange-600 font-heading">100% IP</div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-snug font-medium">Full Code &amp; Repo Ownership</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/70 hover:bg-white hover:shadow-xs transition-all">
              <div className="text-lg sm:text-2xl font-black text-indigo-600 font-heading">6 Months</div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-snug font-medium">Complimentary Post-Launch SLA</div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE CATEGORY FILTER TABS (SMOOTH HORIZONTAL TOUCH SCROLL)
      ========================================================================== */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 -mt-5 sm:-mt-8 relative z-20">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 shadow-md flex items-center justify-start sm:justify-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'all', label: 'All Services (4)' },
            { id: 'software', label: 'Web & ERP' },
            { id: 'mobile', label: 'Mobile Apps' },
            { id: 'repair', label: 'Laptop Repair' },
            { id: 'training', label: 'IT Bootcamps' }
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                suppressHydrationWarning
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          HIGH-CRAFT SERVICE CARDS (100% RESPONSIVE & NO OVERFLOW)
      ========================================================================== */}
      <section className="max-w-6xl mx-auto px-3 sm:px-4 pt-8 sm:pt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${service.accentBorder}`}
              >
                {/* Main Content Area */}
                <div className="p-4 sm:p-6 md:p-8 flex-1">
                  
                  {/* Top Badge & Header */}
                  <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider text-slate-500 uppercase block">
                          {service.category}
                        </span>
                        <h2 className="text-base sm:text-xl font-black text-slate-950 font-heading leading-tight mt-0.5">
                          {service.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Demand Pill & Turnaround Tag */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full border ${service.badgeStyle}`}>
                      {service.badge}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full">
                      <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{service.turnaround}</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 sm:mb-5">
                    {service.description}
                  </p>

                  {/* Tech Stack Chips Grid */}
                  <div className="mb-5 sm:mb-6">
                    <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>Architecture &amp; Core Tooling</span>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {service.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-slate-100 text-slate-800 border border-slate-200/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Capabilities */}
                  <div className="space-y-2.5 sm:space-y-3 mb-2 sm:mb-4 pt-3 sm:pt-4 border-t border-slate-100">
                    <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>Key Engineering Capabilities</span>
                    </div>
                    {service.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 sm:gap-2.5 text-xs text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <div className="leading-snug">
                          <strong className="text-slate-900 block font-semibold text-[11.5px] sm:text-xs">{item.label}</strong>
                          <span className="text-slate-500 font-normal text-[11px] sm:text-xs">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Bottom Deliverables & Inquire Bar (Fully Responsive, Zero Negative Margin Bug) */}
                <div className="p-4 sm:p-5 md:px-8 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex flex-col text-xs">
                    <span className="text-slate-400 text-[10px] sm:text-[11px] font-medium">Warranty &amp; Support</span>
                    <strong className="text-slate-800 text-xs sm:text-sm font-semibold">{service.warranty}</strong>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => handleWhatsApp(service.title)}
                      className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs transition-colors shrink-0 cursor-pointer active:scale-95"
                      title="Quick WhatsApp message"
                    >
                      <MessageSquare className="w-4 h-4 text-[#25D366]" />
                    </button>
                    
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={handleOpenOtp}
                      className="flex-1 sm:flex-initial sm:w-auto bg-slate-950 hover:bg-orange-500 hover:text-slate-950 text-white font-bold text-xs px-4 h-10 sm:h-9 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>Inquire Scope</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          HOW WE DELIVER: 4-STEP ENGINEERING PROTOCOL
      ========================================================================== */}
      <section className="max-w-6xl mx-auto px-3 sm:px-4 pt-16 sm:pt-24">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-2">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>TRANSPARENT COLLABORATION</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-heading tracking-tight text-slate-950">
            Our 4-Step Engineering Protocol
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
            From technical discovery to milestone staging demos, you stay in complete control of your budget and codebase.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {protocolSteps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs relative flex flex-col justify-between"
            >
              <div>
                <span className="text-xl sm:text-2xl font-black font-heading text-orange-500/80 mb-2 sm:mb-3 block">
                  {step.num}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-heading leading-snug mb-1.5 sm:mb-2">
                  {step.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          PHYSICAL CAMPUS & LAB TRANSPARENCY
      ========================================================================== */}
      <section className="max-w-6xl mx-auto px-3 sm:px-4 pt-14 sm:pt-20">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
            <div className="lg:col-span-8 flex flex-col gap-2.5 sm:gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold w-fit">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>PHYSICAL TECH CAMPUS &amp; HARDWARE LAB</span>
              </div>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-black font-heading tracking-tight text-white">
                Visit Our Engineers in Person. No Remote Faceless Outsourcing.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                CodeGurru is operated with pride by <strong>UK VK Pvt. Ltd.</strong>, founded by Kishan Pandey. Drop by our Ayodhya Tech Campus or connect with our Lucknow team for architecture reviews, hardware drop-offs, and live software demos.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-2 sm:pt-3 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>GST Registered Corporate Entity</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ISO 9001:2015 Quality Standards</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ayodhya &amp; Lucknow Labs</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-2.5 sm:gap-3 sm:items-end">
              <button
                type="button"
                suppressHydrationWarning
                onClick={handleOpenOtp}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl shadow-lg transition-all text-center cursor-pointer"
              >
                Schedule an In-Person Meeting
              </button>
              <div className="text-[11px] sm:text-xs text-slate-400 sm:text-right">
                Campus: Near Saket College Petrol Pump, Ayodhya
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION
      ========================================================================== */}
      <section className="max-w-4xl mx-auto px-3 sm:px-4 pt-14 sm:pt-24">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-slate-700" />
            <span>CLARITY &amp; PRICING</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-heading tracking-tight text-slate-950">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Everything you need to know about code ownership, timelines, and warranties.
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-4 py-3.5 sm:px-5 sm:py-4 text-left flex items-center justify-between gap-3 font-semibold text-xs sm:text-sm text-slate-900 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  <span className="font-heading leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-orange-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          FINAL HIGH-CONVERTING BOTTOM CALLOUT
      ========================================================================== */}
      <section className="max-w-6xl mx-auto px-3 sm:px-4 pt-14 sm:pt-20">
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-black text-slate-950 font-heading">
                Ready to Build or Repair? Speak to Senior Engineers Today.
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                Get a fixed-price architectural proposal within 24 hours. Serving businesses and tech professionals across Uttar Pradesh.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => handleWhatsApp('Direct Consultation')}
              className="w-full sm:w-auto justify-center bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs px-4 py-3 rounded-xl transition-all shadow-2xs flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>Chat on WhatsApp</span>
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={handleOpenOtp}
              className="w-full sm:w-auto justify-center bg-slate-950 hover:bg-orange-500 hover:text-slate-950 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Connect with Experts</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
