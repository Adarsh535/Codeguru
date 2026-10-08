'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Share2,
  Play,
  Check,
  CheckCircle2,
  Clock,
  BarChart3,
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
  Layers,
  Sparkles,
  Users
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

  // Dynamic dynamic course info resolution
  const courseDuration = course.duration || '3 Months';
  const courseLevel = course.level || 'Intermediate Level';
  const coursePrice = course.price || '₹7,999';
  const courseOriginalPrice = course.originalPrice || '₹12,999';
  const courseDiscount = course.discount || '38% OFF';
  const courseMode = course.mode || 'Online / Offline (Ayodhya)';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: `Check out ${course.title} on CodeGurru!`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
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

  // Content for Tabs
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
        'Inverter AC PCB Circuit Troubleshooting & Repair',
        'Gas Charging, Vacuuming & Leak Testing',
        'Compressor Wiring, Relay & Capacitor Diagnostics',
        'Single & Double Door Refrigerator Maintenance',
        'Washing Machine Motor & PCB Circuit Repair',
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
    } else if (titleLower.includes('robotics') || titleLower.includes('iot')) {
      return [
        'C/C++ Programming for Microcontrollers',
        'Arduino & ESP32 Hardware Circuit Design',
        'Sensors, Motors, Relays & Wireless Interfacing',
        'IoT Cloud Dashboard Integration & Automation',
        'Raspberry Pi & Linux Embedded Systems',
        'Autonomous Robot & Smart Home Projects',
        'Innovation Competition & Project Mentorship'
      ];
    } else if (titleLower.includes('networking') || titleLower.includes('cyber')) {
      return [
        'Cisco CCNA 200-301 Networking Fundamentals',
        'IP Addressing, Subnetting, VLANs & Routing',
        'Network Security, Firewalls & VPN Configuration',
        'Linux System Administration & Command Line',
        'Ethical Hacking & Penetration Testing Basics',
        'Live Router & Switch Hardware Lab Access',
        'Global Certification Exam Preparation'
      ];
    } else {
      return [
        `${course.title} Comprehensive Core Concepts`,
        'Hands-on Practical Training with Industry Experts',
        'Real-world Live Projects for Portfolio',
        'Problem Solving & Architecture Design',
        'Industry Standard Tools & Workflow',
        'Certification of Completion Provided',
        '100% Placement Assistance & Interview Preparation'
      ];
    }
  };

  const getSyllabusModules = () => {
    if (isMern) {
      return [
        { title: 'Module 1: Web Fundamentals', desc: 'HTML5, CSS3, Flexbox, Grid, Responsive Design, Git & GitHub' },
        { title: 'Module 2: Advanced JavaScript (ES6+)', desc: 'DOM, Async/Await, Promises, Closures, APIs & ES6 Modules' },
        { title: 'Module 3: Frontend Development with React.js', desc: 'Components, State, Props, Hooks, Router, Redux Toolkit & Tailwind CSS' },
        { title: 'Module 4: Backend Engineering with Node & Express', desc: 'REST APIs, Middleware, JWT Authentication, File Uploads & Security' },
        { title: 'Module 5: Database Mastery with MongoDB', desc: 'CRUD operations, Schema Design, Aggregation Framework, Mongoose ORM' },
        { title: 'Module 6: Capstone Project & Cloud Deployment', desc: 'Full Stack App, AWS/Vercel/Render Deployment, CI/CD Pipeline & Portfolio' }
      ];
    } else {
      return [
        { title: 'Module 1: Foundations & Core Concepts', desc: 'Basic fundamentals, setup environment, essential tools & workflows' },
        { title: 'Module 2: Intermediate Concepts & Practical Application', desc: 'Hands-on practice, deep dive into core methodologies & architecture' },
        { title: 'Module 3: Advanced Techniques & Optimization', desc: 'Industry level practices, error handling, performance tuning & security' },
        { title: 'Module 4: Live Capstone Project & Deployment', desc: 'Building end-to-end real world project, testing, deployment & certification' }
      ];
    }
  };

  const getProjectsList = () => {
    return [
      { name: 'Full-Scale E-Commerce Application', tech: 'React, Node, Express, MongoDB, Payment Gateway', desc: 'Complete store with cart, user authentication, admin panel & payment integration.' },
      { name: 'Real-Time Communication & Chat Platform', tech: 'WebSockets, Socket.io, React, Express', desc: 'Instant messaging app with room creation, active status & online media sharing.' },
      { name: 'Learning Management System (LMS) Portal', tech: 'MERN Stack, Cloudinary, JWT', desc: 'Multi-role platform for students & instructors with video streaming & progress tracking.' }
    ];
  };

  const getReviewsList = () => {
    return [
      { name: 'Rahul Sharma', role: 'Full Stack Developer at TCS', rating: 5, comment: 'Awesome course! The practical project-based approach helped me crack my dream interview. Highly recommended!' },
      { name: 'Priya Verma', role: 'Software Engineer', rating: 5, comment: 'The mentors at CodeGurru explain complex topics in such an easy Hindi/English language. 100% worth it.' },
      { name: 'Amit Kumar', role: 'Freelance Developer', rating: 5, comment: 'Great depth in syllabus and hands-on lab sessions. Placement support team guided me right till job offer.' }
    ];
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-900/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      
      {/* MAIN CONTAINER (MOBILE PHONE APP DESIGN FEELING) */}
      <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col min-h-screen sm:min-h-0 sm:max-h-[92vh] border border-slate-100">
        
        {/* TOP NAVBAR (STICKY HEADER) */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* CODE GURRU LOGO HEADER */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
              CG
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight leading-none flex items-center gap-1">
                CODE <span className="text-orange-500">GURRU</span>
              </span>
              <span className="text-[9.5px] font-semibold text-slate-500 leading-none mt-0.5">
                Skills Today, Better Tomorrow
              </span>
            </div>
          </div>

          {/* SHARE BUTTON */}
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer relative"
            title="Share Course"
          >
            <Share2 className="w-4.5 h-4.5" />
            {copiedShare && (
              <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                Link Copied!
              </span>
            )}
          </button>
        </div>

        {/* SCROLLABLE BODY CONTENT */}
        <div className="flex-1 overflow-y-auto px-3.5 sm:px-5 py-4 space-y-4 sm:space-y-5 scrollbar-thin">
          
          {/* DARK HERO BANNER CARD */}
          <div className="relative w-full bg-gradient-to-b from-[#0a1120] via-[#0d1830] to-[#080d1b] rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white overflow-hidden shadow-xl border border-slate-800">
            {/* BACKGROUND GLOW */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* TECH STACK LOGOS ROW */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
              {isMern ? (
                <>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800/80 border border-slate-700/80 p-2 flex items-center justify-center shadow-md">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800/80 border border-slate-700/80 p-2 flex items-center justify-center shadow-md">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express" className="w-full h-full object-contain filter invert opacity-90" />
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800/80 border border-slate-700/80 p-2 flex items-center justify-center shadow-md">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-full h-full object-contain animate-spin-slow" />
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800/80 border border-slate-700/80 p-2 flex items-center justify-center shadow-md">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-full h-full object-contain" />
                  </div>
                </>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2.5 flex items-center justify-center shadow-md">
                  <img src={course.icon} alt={course.title} className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            {/* TITLE & SUBTITLE */}
            <div className="text-center space-y-1.5 max-w-md mx-auto">
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
                {course.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Learn to build real-world web applications from scratch
              </p>
            </div>

            {/* WATCH INTRO VIDEO BUTTON */}
            <div className="mt-5 flex justify-center">
              <button
                onClick={() => setShowVideoModal(true)}
                className="w-auto bg-white/10 hover:bg-white/20 border border-white/25 rounded-full px-5 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer backdrop-blur-md"
              >
                <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                </span>
                Watch Intro Video
              </button>
            </div>
          </div>

          {/* 6-PILL HIGHLIGHTS GRID (2 x 3) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            <div className="bg-[#f4f8ff] border border-[#dbeafe] rounded-xl sm:rounded-2xl p-2.5 text-center flex flex-col items-center justify-center gap-1">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                <Clock className="w-4 h-4" />
              </span>
              <span className="font-extrabold text-slate-900 text-[11px] sm:text-xs leading-none">{courseDuration}</span>
              <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-slate-500 leading-none">Duration</span>
            </div>

            <div className="bg-[#f4f8ff] border border-[#dbeafe] rounded-xl sm:rounded-2xl p-2.5 text-center flex flex-col items-center justify-center gap-1">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
                <BarChart3 className="w-4 h-4" />
              </span>
              <span className="font-extrabold text-slate-900 text-[11px] sm:text-xs leading-none truncate max-w-full">{courseLevel}</span>
              <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-slate-500 leading-none">Level</span>
            </div>

            <div className="bg-[#f4f8ff] border border-[#dbeafe] rounded-xl sm:rounded-2xl p-2.5 text-center flex flex-col items-center justify-center gap-1">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                <Video className="w-4 h-4" />
              </span>
              <span className="font-extrabold text-slate-900 text-[11px] sm:text-xs leading-none truncate max-w-full">Live Classes</span>
              <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-slate-500 leading-none">& Recording</span>
            </div>

            <div className="bg-[#f4f8ff] border border-[#dbeafe] rounded-xl sm:rounded-2xl p-2.5 text-center flex flex-col items-center justify-center gap-1">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                <Award className="w-4 h-4" />
              </span>
              <span className="font-extrabold text-slate-900 text-[11px] sm:text-xs leading-none truncate max-w-full">Certificate</span>
              <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-slate-500 leading-none">Provided</span>
            </div>

            <div className="bg-[#f4f8ff] border border-[#dbeafe] rounded-xl sm:rounded-2xl p-2.5 text-center flex flex-col items-center justify-center gap-1">
              <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                <Briefcase className="w-4 h-4" />
              </span>
              <span className="font-extrabold text-slate-900 text-[11px] sm:text-xs leading-none truncate max-w-full">Real Projects</span>
              <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-slate-500 leading-none">(2-3)</span>
            </div>

            <div className="bg-[#f4f8ff] border border-[#dbeafe] rounded-xl sm:rounded-2xl p-2.5 text-center flex flex-col items-center justify-center gap-1">
              <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">
                <GraduationCap className="w-4 h-4" />
              </span>
              <span className="font-extrabold text-slate-900 text-[11px] sm:text-xs leading-none truncate max-w-full">Placement</span>
              <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-slate-500 leading-none">Support</span>
            </div>
          </div>

          {/* SEGMENTED TABS BAR */}
          <div className="flex items-center justify-between bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 text-xs font-extrabold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
                activeTab === 'syllabus'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Syllabus
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reviews
            </button>
          </div>

          {/* TAB CONTENT PANELS */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* WHAT YOU WILL LEARN */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" /> What You Will Learn
                </h3>
                <div className="space-y-2.5">
                  {getWhatYouWillLearn().map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5 shadow-2xs">
                        ✓
                      </span>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BATCH DETAILS */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Batch Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">Duration: </span>
                      <span className="text-slate-600 font-medium">{courseDuration} (Flexible)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Video className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">Classes: </span>
                      <span className="text-slate-600 font-medium">Live + Recorded Access</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">Batch Timing: </span>
                      <span className="text-slate-600 font-medium">Morning / Evening</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <BarChart3 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">Level: </span>
                      <span className="text-slate-600 font-medium">{courseLevel}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">Mode: </span>
                      <span className="text-slate-600 font-medium">{courseMode}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">Certificate: </span>
                      <span className="text-slate-600 font-medium">Provided</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1">
                Detailed Course Syllabus
              </h3>
              {getSyllabusModules().map((mod, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs">
                  <div className="font-extrabold text-slate-900 text-xs sm:text-sm text-blue-600 mb-1">
                    {mod.title}
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1">
                Real-World Capstone Projects
              </h3>
              {getProjectsList().map((proj, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      {proj.name}
                    </h4>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
                      Live Project
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{proj.desc}</p>
                  <div className="text-[10.5px] font-semibold text-slate-400">
                    Tech Stack: {proj.tech}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-base font-black text-slate-900 flex items-center gap-1">
                    4.9 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="text-xs font-semibold text-slate-500">Based on 450+ Student Ratings</div>
                </div>
                <div className="text-xs font-bold text-blue-600 bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-2xs">
                  100% Verified Reviews
                </div>
              </div>

              {getReviewsList().map((rev, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 font-bold text-xs flex items-center justify-center text-slate-700">
                        {rev.name[0]}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs">{rev.name}</div>
                        <div className="text-[10px] font-semibold text-slate-400">{rev.role}</div>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 italic font-medium pt-1">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* FIXED BOTTOM BAR (PRICE & ENROLL NOW CTA) */}
        <div className="sticky bottom-0 z-30 bg-white border-t border-slate-100 p-3 sm:p-4 flex items-center justify-between gap-3 shadow-lg">
          {/* PRICE SECTION */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {coursePrice}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 line-through">
                {courseOriginalPrice}
              </span>
            </div>
            <span className="text-xs font-extrabold text-emerald-600">
              {courseDiscount}
            </span>
          </div>

          {/* ENROLL NOW BUTTON */}
          <button
            onClick={() => {
              onClose();
              if (onEnroll) onEnroll(course);
            }}
            className="w-auto bg-[#ff4d00] hover:bg-[#e04400] text-white px-6 sm:px-8 py-3 rounded-2xl text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap"
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
