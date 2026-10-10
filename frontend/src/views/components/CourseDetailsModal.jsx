'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Share2,
  Play,
  Clock,
  Video,
  Award,
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
  ShieldCheck,
  Star,
  X,
  ChevronRight,
  BookOpen,
  Sparkles,
  Headphones
} from 'lucide-react';

export default function CourseDetailsModal({ isOpen, onClose, course, onEnroll }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (showVideoModal) {
          setShowVideoModal(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showVideoModal, onClose]);

  if (!isOpen || !course) return null;

  const titleLower = (course.title || '').toLowerCase();
  const isMern = course.id === 'mern-stack' || titleLower.includes('mern');

  const courseDuration = course.duration || '3 Months';
  const rawLevel = course.level || 'Intermediate';
  const displayLevel = rawLevel.toLowerCase().includes('begin') ? 'Beginner' : rawLevel.toLowerCase().includes('master') ? 'Master' : 'Intermediate';
  const courseLevel = displayLevel;
  const formatPrice = (val) => {
    if (!val) return '';
    const s = String(val).trim();
    return s.startsWith('₹') ? s : `₹${s}`;
  };

  const rawPrice = course.price;
  const coursePrice = rawPrice ? formatPrice(rawPrice) : '₹7,999';
  const rawOriginalPrice = course.originalPrice;
  const courseOriginalPrice = rawOriginalPrice ? formatPrice(rawOriginalPrice) : '';
  const showPrice = course.showPrice !== false && !!coursePrice;

  const isDiscountActive = course.isDiscountActive !== false;
  let discountDisplay = '';
  const hasDiscount = isDiscountActive && (course.discountPercent > 0 || (courseOriginalPrice && courseOriginalPrice !== coursePrice));

  if (isDiscountActive) {
    if (course.discountPercent && course.discountPercent > 0) {
      discountDisplay = `${course.discountPercent}% OFF`;
    } else if (course.discount) {
      discountDisplay = course.discount;
    } else if (courseOriginalPrice && courseOriginalPrice !== coursePrice) {
      const origNum = parseInt(String(courseOriginalPrice).replace(/[^0-9]/g, ''));
      const currNum = parseInt(String(coursePrice).replace(/[^0-9]/g, ''));
      if (origNum && currNum && origNum > currNum) {
        discountDisplay = `${Math.round(((origNum - currNum) / origNum) * 100)}% OFF`;
      } else {
        discountDisplay = 'OFFER';
      }
    }
  }

  const courseMode = course.mode || 'Online / Offline';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: `Check out ${course.title} on CodeGurru!`,
          url: window.location.href,
        });
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const getEmbedVideoUrl = (rawUrl) => {
    if (!rawUrl) return 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
    if (rawUrl.includes('embed/')) return rawUrl.includes('autoplay=1') ? rawUrl : `${rawUrl}?autoplay=1`;
    const match = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match && match[1] ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : rawUrl;
  };

  const getWhatYouWillLearn = () => {
    if (Array.isArray(course.whatYouWillLearn) && course.whatYouWillLearn.length > 0) {
      return course.whatYouWillLearn;
    }
    if (isMern) {
      return [
        'HTML, CSS, JavaScript (Advance)',
        'React.js (Frontend)',
        'Node.js & Express.js (Backend)',
        'MongoDB (Database)',
        'Build Real Projects (Portfolio + Live)',
        'Deployment & Hosting',
        'Resume & Interview Preparation'
      ];
    } else if (titleLower.includes('java')) {
      return [
        'Core Java Fundamentals & OOPs Concepts',
        'Spring Boot Framework & RESTful APIs',
        'Microservices Architecture & API Gateway',
        'Hibernate, JPA & Database (MySQL/PostgreSQL)',
        'Docker & CI/CD Deployment Basics',
        'Enterprise Project Development',
        'System Design & Interview Preparation'
      ];
    } else if (titleLower.includes('python') || titleLower.includes('data') || titleLower.includes('ai')) {
      return [
        'Python Programming & Advanced Data Structures',
        'Data Analysis with Pandas, NumPy & Matplotlib',
        'Machine Learning Algorithms & Scikit-Learn',
        'Deep Learning & Neural Networks with TensorFlow',
        'Generative AI & LLM Integration Basics',
        'Real-world AI & Data Science Projects',
        'Portfolio Building & Interview Assistance'
      ];
    } else if (titleLower.includes('repair') || titleLower.includes('chip') || titleLower.includes('mobile') || titleLower.includes('laptop')) {
      return [
        'Motherboard Circuit & Schematic Diagram Reading',
        'Micro-Soldering & BGA IC Reballing Techniques',
        'Power IC, CPU & RAM Replacement Masterclass',
        'Short Circuit & Leakage Diagnostics with DC Power',
        'BIOS Flashing & Firmware Programming',
        '100% Practical Lab Training with Live Devices',
        'Shop Setup Guidance & Lifetime Tech Support'
      ];
    } else if (titleLower.includes('ac') || titleLower.includes('fridge') || titleLower.includes('electrical')) {
      return [
        'Inverter AC PCB Circuit Repairing',
        'Gas Charging, Vacuuming & Leak Testing',
        'Compressor Wiring & Capacitor Diagnostics',
        'Single & Double Door Refrigerator Maintenance',
        'Washing Machine Motor & PCB Repair',
        'Field Practical Work & Customer Site Exposure',
        'Self-Employment & Technician Certification'
      ];
    } else if (titleLower.includes('marketing') || titleLower.includes('seo')) {
      return [
        'Digital Marketing Strategy & Sales Funnel Design',
        'Google Search & Display Ads Campaign Management',
        'Meta (Facebook & Instagram) Ads & Pixel Tracking',
        'Search Engine Optimization (SEO) & Keyword Strategy',
        'Content Marketing & Social Media Growth',
        'Live Campaign Budget Allocation & ROAS Optimization',
        'Freelancing & Client Acquisition Masterclass'
      ];
    } else {
      return [
        `${course.title} Comprehensive Core Concepts`,
        'Hands-on Practical Training with Industry Experts',
        'Real-world Live Projects for Portfolio',
        'Problem Solving & Architecture Design',
        'Industry Standard Tools & Workflow',
        'Certification of Completion Provided',
        '100% Placement Assistance & Interview Prep'
      ];
    }
  };

  const getSyllabusModules = () => {
    if (Array.isArray(course.syllabusModules) && course.syllabusModules.length > 0) {
      return course.syllabusModules;
    }
    if (isMern) {
      return [
        { title: 'Module 1: Web Fundamentals', desc: 'HTML5, CSS3, Flexbox, Grid, Responsive Design, Git & GitHub' },
        { title: 'Module 2: Advanced JavaScript (ES6+)', desc: 'DOM, Async/Await, Promises, Closures, APIs & ES6 Modules' },
        { title: 'Module 3: Frontend Development with React.js', desc: 'Components, State, Props, Hooks, Router & Redux Toolkit' },
        { title: 'Module 4: Backend Engineering with Node & Express', desc: 'REST APIs, Middleware, JWT Authentication, File Uploads' },
        { title: 'Module 5: Database Mastery with MongoDB', desc: 'CRUD operations, Schema Design, Aggregation Framework & Mongoose' },
        { title: 'Module 6: Capstone Project & Cloud Deployment', desc: 'Full Stack App, AWS/Vercel Deployment & Portfolio' }
      ];
    } else {
      return [
        { title: 'Module 1: Foundations & Core Concepts', desc: 'Basic fundamentals, setup environment, essential tools & workflows' },
        { title: 'Module 2: Intermediate Concepts & Practical Application', desc: 'Hands-on practice, deep dive into core methodologies' },
        { title: 'Module 3: Advanced Techniques & Optimization', desc: 'Industry level practices, error handling & performance tuning' },
        { title: 'Module 4: Live Capstone Project & Deployment', desc: 'Building end-to-end real world project, testing & certification' }
      ];
    }
  };

  const getProjectsList = () => {
    if (Array.isArray(course.projectsList) && course.projectsList.length > 0) {
      return course.projectsList;
    }
    return [
      { name: 'Full-Scale E-Commerce Application', tech: 'React, Node, Express, MongoDB', desc: 'Complete store with cart, user auth, admin panel & payment gateway.' },
      { name: 'Real-Time Chat & Collaboration Tool', tech: 'WebSockets, Socket.io, React', desc: 'Instant messaging app with room creation & online media sharing.' },
      { name: 'LMS Student Learning Portal', tech: 'MERN Stack, JWT, Cloudinary', desc: 'Multi-role portal for students & instructors with video streaming.' }
    ];
  };

  const getReviewsList = () => {
    return [
      { name: 'Rahul Sharma', role: 'Full Stack Developer at TCS', rating: 5, comment: 'Awesome course! Practical project-based approach helped me crack my dream job.' },
      { name: 'Priya Verma', role: 'Software Engineer', rating: 5, comment: 'The mentors explain complex topics in easy Hindi/English language. 100% worth it.' },
      { name: 'Amit Kumar', role: 'Freelance Developer', rating: 5, comment: 'Great depth in syllabus and hands-on lab sessions. Excellent placement guidance.' }
    ];
  };

  return (
    <div className="fixed inset-0 z-[100] w-full h-full bg-white flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* FULL PAGE CONTAINER */}
      <div className="relative w-full h-full max-w-2xl mx-auto bg-white flex flex-col overflow-hidden">
        
        {/* TOP NAVBAR */}
        <div className="bg-white/95 border-b border-slate-100 px-3.5 py-2.5 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* CODE GURRU LOGO HEADER */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-slate-200 bg-white p-0.5 shadow-2xs overflow-hidden flex-shrink-0 flex items-center justify-center">
              <img
                src="/logo-icon.png"
                alt="CodeGuru Logo"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  e.target.src = '/logo.png';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight leading-none flex items-center gap-1">
                CODE <span className="text-orange-500">GURRU</span>
              </span>
              <span className="text-[9px] font-semibold text-slate-500 leading-none mt-0.5">
                Skills Today, Better Tomorrow
              </span>
            </div>
          </div>

          {/* SHARE BUTTON */}
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer relative"
            title="Share Course"
          >
            <Share2 className="w-4 h-4" />
            {copiedShare && (
              <span className="absolute -bottom-7 right-0 bg-slate-900 text-white text-[9.5px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
        </div>

        {/* INNER CONTAINER WITH COMPACT SCROLLING */}
        <div className="flex-1 overflow-y-auto px-2.5 sm:px-3 py-2 space-y-2 scrollbar-thin">
                 {/* DARK HERO CARD (PERFECTLY PROPORTIONED & STUNNING) */}
          <div className="relative w-full bg-[#14161d] border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col items-center text-center shadow-lg overflow-hidden">
            {/* BACKGROUND GLOW BLOBS */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* TECH STACK LOGOS / FLOW ROW */}
            {isMern ? (
              <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2.5 mb-1">
                {/* M - MongoDB */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 aspect-square rounded-xl bg-[#222530] border border-slate-700/80 flex items-center justify-center text-[#10b981] font-black text-sm sm:text-base shadow-xs flex-shrink-0">
                    M
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-1.5">
                    MongoDB
                  </span>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-600 mb-4 flex-shrink-0" />

                {/* E - Express */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 aspect-square rounded-xl bg-[#222530] border border-slate-700/80 flex items-center justify-center text-white font-black text-sm sm:text-base shadow-xs flex-shrink-0">
                    E
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-1.5">
                    Express
                  </span>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-600 mb-4 flex-shrink-0" />

                {/* R - React */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 aspect-square rounded-xl bg-[#222530] border border-slate-700/80 flex items-center justify-center text-[#f59e0b] font-black text-sm sm:text-base shadow-xs flex-shrink-0">
                    R
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-1.5">
                    React
                  </span>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-600 mb-4 flex-shrink-0" />

                {/* N - Node.js */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 aspect-square rounded-xl bg-[#222530] border border-slate-700/80 flex items-center justify-center text-[#84cc16] font-black text-sm sm:text-base shadow-xs flex-shrink-0">
                    N
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-1.5">
                    Node.js
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 aspect-square rounded-xl bg-[#222530] border border-slate-700/80 p-2.5 flex items-center justify-center shadow-xs mb-1.5 flex-shrink-0">
                <img src={course.icon} alt={course.title} className="w-full h-full object-contain" />
              </div>
            )}

            {/* TITLE & SUBTITLE */}
            <div className="relative z-10 text-center space-y-1 max-w-sm mx-auto mt-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                {course.subtitle || course.description || 'Learn to build real-world web applications from scratch'}
              </p>

              {/* HERO PRICE BADGE */}
              {showPrice && (
                <div className="pt-1.5 flex items-center justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-full shadow-inner">
                    <span className="text-white font-black text-xs sm:text-sm tracking-tight">
                      {coursePrice}
                    </span>
                    {hasDiscount && courseOriginalPrice && (
                      <span className="line-through text-slate-400 text-[11px] font-semibold">
                        {courseOriginalPrice}
                      </span>
                    )}
                    {hasDiscount && discountDisplay && (
                      <span className="bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-[9.5px] font-black px-1.5 py-0.2 rounded-full">
                        {discountDisplay}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* WATCH INTRO VIDEO BUTTON */}
            <button
              onClick={() => setShowVideoModal(true)}
              className="relative z-10 w-full bg-[#f59e0b] hover:bg-[#e08e00] text-slate-950 font-black text-xs sm:text-sm py-2.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer mt-3"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950 translate-x-0.5" />
              <span>Watch Intro Video</span>
            </button>
          </div>

          {/* NEW HIGHLIGHTS CARD */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 space-y-2 shadow-2xs">
            {/* TOP ROW: DURATION CARD */}
            <div className="bg-[#f8fafc] border border-slate-100 rounded-lg p-2 flex items-center gap-2.5">
              <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#047857]"
                    strokeDasharray="68, 100"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-black text-slate-900 text-xs leading-none">
                  {(courseDuration.match(/\d+/) || ['6'])[0]}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight truncate">
                  {courseDuration}
                </span>
                <span className="text-[10px] font-medium text-slate-400 leading-tight">
                  Duration
                </span>
              </div>
            </div>

            {/* BOTTOM ROW: 2x2 GRID ROUNDED PILLS */}
            <div className="grid grid-cols-2 gap-1.5">
              {(() => {
                const defaultPills = ['Live + recordings', 'Certificate', '2 to 3 projects', 'Placement support'];
                const pillsList = Array.isArray(course.featurePills) && course.featurePills.length > 0
                  ? course.featurePills
                  : defaultPills;
                const icons = [Video, Award, Briefcase, Headphones, GraduationCap, BookOpen, Sparkles, Clock];

                return pillsList.slice(0, 4).map((pill, idx) => {
                  const IconComponent = icons[idx % icons.length] || Video;
                  return (
                    <div key={idx} className="bg-white border border-slate-200/90 rounded-full px-2.5 py-1 flex items-center gap-1.5 text-[10.5px] font-bold text-slate-700 shadow-2xs">
                      <IconComponent className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                      <span className="truncate">{typeof pill === 'string' ? pill : pill.text}</span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* WHAT YOU WILL LEARN */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-2xs">
            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-1.5">
              What You Will Learn
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {getWhatYouWillLearn().map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-700">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8.5px] font-black flex-shrink-0 shadow-2xs">
                    ✓
                  </span>
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BATCH DETAILS */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-2.5 sm:p-3 shadow-2xs">
            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-2">
              Batch Details
            </h3>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
              {/* DURATION */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#f2f6fd] border border-blue-100/70">
                <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden">
                  <Calendar className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                </div>
                <span className="text-[10.5px] sm:text-[11px] leading-snug">
                  <strong className="font-extrabold text-slate-900">Duration:</strong>{' '}
                  <span className="text-slate-600 font-normal">{courseDuration}</span>
                </span>
              </div>

              {/* CLASSES */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#f2f6fd] border border-blue-100/70">
                <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden">
                  <Video className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                </div>
                <span className="text-[10.5px] sm:text-[11px] leading-snug">
                  <strong className="font-extrabold text-slate-900">Classes:</strong>{' '}
                  <span className="text-slate-600 font-normal">{course.batchClasses || 'Live + Recorded'}</span>
                </span>
              </div>

              {/* BATCH */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#f2f6fd] border border-blue-100/70">
                <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden">
                  <Clock className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                </div>
                <span className="text-[10.5px] sm:text-[11px] leading-snug">
                  <strong className="font-extrabold text-slate-900">Batch:</strong>{' '}
                  <span className="text-slate-600 font-normal">{course.batchTimings || 'Morning/Evening'}</span>
                </span>
              </div>

              {/* MODE */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#f2f6fd] border border-blue-100/70">
                <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden">
                  <MapPin className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                </div>
                <span className="text-[10.5px] sm:text-[11px] leading-snug">
                  <strong className="font-extrabold text-slate-900">Mode:</strong>{' '}
                  <span className="text-slate-600 font-normal">{course.batchMode || courseMode}</span>
                </span>
              </div>

              {/* CERTIFICATE */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#f2f6fd] border border-blue-100/70">
                <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden">
                  <ShieldCheck className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                </div>
                <span className="text-[10.5px] sm:text-[11px] leading-snug">
                  <strong className="font-extrabold text-slate-900">Certificate:</strong>{' '}
                  <span className="text-slate-600 font-normal">{course.certificateProvided || 'Provided'}</span>
                </span>
              </div>
            </div>
          </div>

          {activeTab === 'reviews' && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-slate-900 flex items-center gap-1">
                    4.9 <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500">Based on 450+ Student Ratings</div>
                </div>
                <div className="text-[10px] font-bold text-blue-600 bg-white px-2.5 py-1 rounded border border-blue-200">
                  100% Verified
                </div>
              </div>

              {getReviewsList().map((rev, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-slate-200/80 p-2.5 shadow-2xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold text-slate-900 text-[11px]">{rev.name}</div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10.5px] text-slate-600 italic font-medium">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* COMPACT FIXED BOTTOM BAR */}
        <div className="bg-white border-t border-slate-100 px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-3 shadow-md flex-shrink-0">
          {showPrice ? (
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {coursePrice}
                </span>
                {hasDiscount && courseOriginalPrice && (
                  <span className="line-through text-slate-400 text-xs font-semibold leading-tight">
                    {courseOriginalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {hasDiscount && discountDisplay ? (
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 leading-none">
                    {discountDisplay}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-500 leading-none">
                    Course Fee
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-extrabold text-slate-900 leading-tight">Admissions Open</span>
              <span className="text-[10px] font-medium text-slate-500 leading-tight">Limited seats available</span>
            </div>
          )}

          {/* ENROLL NOW BUTTON */}
          <button
            onClick={() => {
              onClose();
              if (onEnroll) onEnroll(course);
            }}
            className="w-auto min-w-[130px] sm:min-w-[160px] bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 rounded-full text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap ml-auto"
          >
            Enroll Now <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

      </div>

      {/* INTRO VIDEO MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src={getEmbedVideoUrl(course.videoUrl)}
                title="Course Intro Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
