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
  const coursePrice = course.price || '₹7,999';
  const courseOriginalPrice = course.originalPrice || '₹12,999';
  const courseDiscount = course.discount || '38% OFF';
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

  const getWhatYouWillLearn = () => {
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
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3 scrollbar-thin">
          
          {/* DARK HERO CARD (MATCHING EXACT USER SCREENSHOT COLOR COMBINATION) */}
          <div className="relative w-full bg-[#181a20] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center shadow-lg overflow-hidden">
            {/* TECH STACK LOGOS / FLOW ROW */}
            {isMern ? (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 mb-1">
                {/* M - MongoDB */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#252830] border border-slate-700/60 flex items-center justify-center text-[#10b981] font-black text-base sm:text-lg shadow-xs">
                    M
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-1.5">
                    MongoDB
                  </span>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-600 mb-4 flex-shrink-0" />

                {/* E - Express */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#252830] border border-slate-700/60 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-xs">
                    E
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-1.5">
                    Express
                  </span>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-600 mb-4 flex-shrink-0" />

                {/* R - React */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#252830] border border-slate-700/60 flex items-center justify-center text-[#f59e0b] font-black text-base sm:text-lg shadow-xs">
                    R
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-1.5">
                    React
                  </span>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-600 mb-4 flex-shrink-0" />

                {/* N - Node.js */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#252830] border border-slate-700/60 flex items-center justify-center text-[#84cc16] font-black text-base sm:text-lg shadow-xs">
                    N
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-1.5">
                    Node.js
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-[#252830] border border-slate-700/60 p-2.5 flex items-center justify-center shadow-xs mb-2">
                <img src={course.icon} alt={course.title} className="w-full h-full object-contain" />
              </div>
            )}

            {/* TITLE & SUBTITLE */}
            <div className="text-center space-y-1 max-w-sm mx-auto mt-2.5">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                Learn to build real-world web applications from scratch
              </p>
            </div>

            {/* WATCH INTRO VIDEO BUTTON (BRIGHT AMBER / GOLDEN ORANGE) */}
            <button
              onClick={() => setShowVideoModal(true)}
              className="w-full bg-[#f59e0b] hover:bg-[#e08e00] text-slate-950 font-black text-xs sm:text-sm py-2.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer mt-3.5"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950 translate-x-0.5" />
              <span>Watch Intro Video</span>
            </button>
          </div>

          {/* NEW HIGHLIGHTS CARD */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 space-y-2.5 shadow-2xs">
            {/* TOP ROW: DURATION CARD (MATCHING USER CIRCULAR PROGRESS RING DESIGN) */}
            <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3 flex items-center gap-3">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
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
                <span className="absolute font-black text-slate-900 text-xs sm:text-sm leading-none">
                  {(courseDuration.match(/\d+/) || ['6'])[0]}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                  {courseDuration}
                </span>
                <span className="text-xs font-medium text-slate-400 leading-tight">
                  Duration
                </span>
              </div>
            </div>

            {/* BOTTOM ROW: 2x2 GRID ROUNDED PILLS */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-slate-200/90 rounded-full px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 shadow-2xs">
                <Video className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <span className="truncate">Live + recordings</span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-full px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 shadow-2xs">
                <Award className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <span className="truncate">Certificate</span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-full px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 shadow-2xs">
                <Briefcase className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <span className="truncate">2 to 3 projects</span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-full px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 shadow-2xs">
                <Headphones className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <span className="truncate">Placement support</span>
              </div>
            </div>
          </div>

          {/* COMPACT SEGMENTED TABS BAR */}
          <div className="flex items-center justify-between bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-[11px] font-extrabold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                activeTab === 'syllabus'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Syllabus
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Projects
            </button>
          </div>

          {/* COMPACT TAB CONTENT PANELS */}
          {activeTab === 'overview' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* WHAT YOU WILL LEARN */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs">
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-2">
                  What You Will Learn
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {getWhatYouWillLearn().map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black flex-shrink-0 shadow-2xs">
                        ✓
                      </span>
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BATCH DETAILS */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs">
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-2">
                  Batch Details
                </h3>
                <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
                  <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate"><strong className="text-slate-900">Duration:</strong> {courseDuration}</span>
                  </div>

                  <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <Video className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate"><strong className="text-slate-900">Classes:</strong> Live + Recorded</span>
                  </div>

                  <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate"><strong className="text-slate-900">Batch:</strong> Morning/Evening</span>
                  </div>


                  <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate"><strong className="text-slate-900">Mode:</strong> {courseMode}</span>
                  </div>

                  <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate"><strong className="text-slate-900">Certificate:</strong> Provided</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <h3 className="font-extrabold text-slate-900 text-xs mb-1">
                Detailed Course Syllabus
              </h3>
              {getSyllabusModules().map((mod, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-slate-200/80 p-2.5 shadow-2xs">
                  <div className="font-extrabold text-slate-900 text-[11px] text-blue-600 mb-0.5">
                    {mod.title}
                  </div>
                  <p className="text-[10.5px] text-slate-600 font-medium leading-snug">
                    {mod.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <h3 className="font-extrabold text-slate-900 text-xs mb-1">
                Real-World Capstone Projects
              </h3>
              {getProjectsList().map((proj, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-slate-200/80 p-2.5 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-[11px]">
                      {proj.name}
                    </h4>
                    <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                      Live Project
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 font-medium">{proj.desc}</p>
                </div>
              ))}
            </div>
          )}

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
        <div className="bg-white border-t border-slate-100 px-3.5 py-2.5 flex items-center justify-center shadow-lg flex-shrink-0">
          {/* ENROLL NOW BUTTON (FULL WIDTH ROYAL BLUE PILL) */}
          <button
            onClick={() => {
              onClose();
              if (onEnroll) onEnroll(course);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full text-sm sm:text-base font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Enroll Now <ChevronRight className="w-5 h-5 stroke-[3]" />
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
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
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
