'use client';

import { User as PersonIcon, Info as InfoIcon, RefreshCw as RefreshIcon, Settings as SettingsIcon, Shield as ShieldIcon, ShieldAlert as GppMaybeIcon, File as DescriptionIcon, HelpCircle as HelpIcon, ChevronRight as ChevronRightIcon, X as CloseIcon, CheckCircle2 as CheckCircleIcon, Phone as CallIcon } from 'lucide-react';
import { WhatsAppIcon as WhatsAppIcon } from './BrandIcons';
import React, { useState, useEffect } from 'react';

export default function ProfilePage({ onOpenContactModal }) {
  const [user, setUser] = useState(null);

  const [activeModal, setActiveModal] = useState(null); // 'login', 'signup', 'about', 'refund', 'settings', 'privacy', 'cancellation', 'terms', 'help'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const u = localStorage.getItem('codeguru_user');
        if (u) setUser(JSON.parse(u));
        const isDark = localStorage.getItem('codeguru_theme') === 'dark' || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
        setIsDarkMode(isDark);
      }
    } catch (e) {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('codeguru_user');
    localStorage.removeItem('codeguru_token');
    localStorage.removeItem('token');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('codeguru_user_updated'));
  };

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [callNotice, setCallNotice] = useState(null);

  const handleCallSupport = (e, phone = '+917238829360') => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(phone);
      }
    } catch (err) {}
    setCallNotice(phone);
    setTimeout(() => setCallNotice(null), 3500);
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsAppRedirect = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const url = 'https://wa.me/917238829360?text=Hello%20CodeGurru%2C%20I%20need%20support%20assistance';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      if (nextMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('codeguru_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('codeguru_theme', 'light');
      }
      return nextMode;
    });
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1500);
  };

  const menuItems = [
    {
      id: 'about',
      title: 'About Us',
      icon: <InfoIcon className="!w-5 !h-5 text-indigo-500" />,
      badgeBg: 'bg-indigo-50',
    },
    {
      id: 'refund',
      title: 'Refund Policy',
      icon: <RefreshIcon className="!w-5 !h-5 text-rose-500" />,
      badgeBg: 'bg-rose-50',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <SettingsIcon className="!w-5 !h-5 text-slate-600" />,
      badgeBg: 'bg-slate-100',
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: <ShieldIcon className="!w-5 !h-5 text-emerald-500" />,
      badgeBg: 'bg-emerald-50',
    },
    {
      id: 'cancellation',
      title: 'Cancellation Policy',
      icon: <GppMaybeIcon className="!w-5 !h-5 text-rose-500" />,
      badgeBg: 'bg-rose-50',
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: <DescriptionIcon className="!w-5 !h-5 text-amber-600" />,
      badgeBg: 'bg-amber-50',
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: <HelpIcon className="!w-5 !h-5 text-purple-500" />,
      badgeBg: 'bg-purple-50',
    },
  ];

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setActiveModal(null);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto px-3 xxs:px-4 py-4 sm:py-6 flex flex-col gap-5 select-none animate-fadeIn">
      
      {/* 1. USER PROFILE BADGE SECTION */}
      <div className="flex flex-col items-center justify-center text-center my-1">
        <div className="relative w-16 h-16 xxs:w-20 xxs:h-20 rounded-full bg-white border-2 border-slate-100 shadow-md flex items-center justify-center mb-2.5 group">
          <PersonIcon className="!w-9 !h-9 xxs:!w-11 xxs:!h-11 text-amber-400 group-hover:scale-110 transition-transform" />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
        </div>
        <h2 className="text-lg xxs:text-xl font-bold text-slate-900 tracking-tight font-heading">
          {user ? user.name : 'Guest User'}
        </h2>
        <span className="text-xs xxs:text-xs font-bold text-slate-400 mt-0.5">
          {user ? user.email : 'LIMITED ACCESS'}
        </span>
      </div>

      {/* 2. AUTH / LOGOUT BUTTONS */}
      <div className="flex items-center justify-between gap-3">
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs xxs:text-sm py-3 rounded-2xl shadow-md hover:shadow-lg transition-all text-center cursor-pointer flex items-center justify-center gap-2"
          >
            <span>LOGOUT FROM ACCOUNT</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                setAuthMode('login');
                setActiveModal('auth');
              }}
              className="flex-1 bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-bold text-xs xxs:text-sm py-3 rounded-2xl shadow-md hover:shadow-lg transition-all text-center cursor-pointer"
            >
              LOGIN
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setActiveModal('auth');
              }}
              className="flex-1 bg-white hover:bg-amber-50/50 border-2 border-amber-400 text-amber-500 hover:text-amber-600 active:scale-95 font-bold text-xs xxs:text-sm py-2.5 rounded-2xl shadow-xs transition-all text-center cursor-pointer"
            >
              SIGN UP
            </button>
          </>
        )}
      </div>

      {/* 3. MENU CARDS LIST */}
      <div className="flex flex-col gap-2.5">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveModal(item.id)}
            className="bg-white rounded-2xl p-3 xxs:p-3.5 shadow-2xs hover:shadow-md border border-slate-200/80 hover:border-amber-300 transition-all duration-200 cursor-pointer flex items-center justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 xxs:w-10 xxs:h-10 rounded-xl ${item.badgeBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                {item.icon}
              </div>
              <span className="text-xs xxs:text-sm font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                {item.title}
              </span>
            </div>
            
            <div className="w-6 h-6 xxs:w-7 xxs:h-7 rounded-full bg-slate-50 group-hover:bg-amber-100 text-slate-400 group-hover:text-amber-700 flex items-center justify-center transition-colors">
              <ChevronRightIcon className="!w-4 !h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* MODAL POPUPS FOR EACH POLICY & AUTH */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-5 xxs:p-6 w-full max-w-lg sm:max-w-xl shadow-2xl border border-slate-100 relative max-h-[88vh] flex flex-col justify-between overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-base xxs:text-lg font-bold text-slate-900 font-heading">
                {activeModal === 'auth'
                  ? authMode === 'login'
                    ? 'Login to CodeGurru'
                    : 'Create New Account'
                  : menuItems.find((i) => i.id === activeModal)?.title || 'Settings'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <CloseIcon className="!w-4 !h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 pr-2 text-slate-700 text-xs xxs:text-sm space-y-4">
              {activeModal === 'auth' && (
                <div>
                  {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-emerald-600 gap-2">
                      <CheckCircleIcon className="!w-12 !h-12 text-emerald-500 animate-bounce" />
                      <p className="font-bold text-base">
                        {authMode === 'login' ? 'Successfully Logged In!' : 'Account Created Successfully!'}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3.5 py-1">
                      {authMode === 'signup' && (
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:outline-none text-xs font-semibold"
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="student@codeguru.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:outline-none text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:outline-none text-xs font-semibold"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-xl shadow-md text-xs mt-2 transition-all cursor-pointer"
                      >
                        {authMode === 'login' ? 'Login Now' : 'Create Account'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* 1. ABOUT US (PAGE-LENGTH DETAILED CONTENT) */}
              {activeModal === 'about' && (
                <div className="space-y-4 text-xs xxs:text-[13px] text-slate-700 leading-relaxed pr-1">
                  <div className="p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-2xl">
                    <h4 className="font-bold text-indigo-950 text-sm mb-1">
                      CodeGurru IT Training, Software Development &amp; Tech Academy
                    </h4>
                    <p className="text-indigo-800 text-xs font-medium">
                      CodeGurru (UK VK Pvt. Ltd.) is an IT training, software development and computer repair company based in Uttar Pradesh, founded by Kishan Pandey. Providing 100% job-oriented bootcamps and enterprise technology services.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-indigo-600 flex items-center gap-1.5">
                      <span>●</span> Who We Are &amp; Our Core Vision
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Bridging the Industry Gap:</strong> Established to eliminate the mismatch between standard university theory and modern high-scale software engineering requirements.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Comprehensive Tech Tracks:</strong> We provide rigorous, hands-on immersive bootcamps covering MERN Stack, Python AI/ML, Cloud DevOps, Java SpringBoot, and Android/iOS Development.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Proven Alumni Success:</strong> Over 5,000+ alumni have transitioned into prominent tech roles across leading product MNCs, unicorns, and high-growth startups with packages up to 50 LPA.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-indigo-600 flex items-center gap-1.5">
                      <span>●</span> Key Training Pillars &amp; Methodology
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Industry-Vetted Curriculum:</strong> Curriculum modules updated quarterly in consultation with senior tech leads, engineering directors, and system architects.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Production-Grade Capstone Projects:</strong> Every student builds and ships 4+ full-stack web and mobile applications with live deployments, CI/CD pipelines, and cloud databases.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>1-on-1 Daily Mentorship:</strong> Direct access to senior software mentors for daily live code debugging, architecture reviews, and personalized learning guidance.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Rigorous Placement Preparation:</strong> In-depth Data Structures &amp; Algorithms (DSA) training, system design sessions, mock technical interviews, and resume building workshops.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-indigo-600 flex items-center gap-1.5">
                      <span>●</span> Campus Infrastructure &amp; Contact
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Hi-Tech Learning Center:</strong> Centrally air-conditioned computer labs with dual-display workstations, dedicated gigabit fiber internet, and cafeteria.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Official Campus Address:</strong> Near Saket College Petrol Pump, Ayodhya, Uttar Pradesh.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Head Office &amp; Tech Center:</strong> Regional Tech Center, Lucknow, Uttar Pradesh 226012.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Student Helplines:</strong> +91 72388 29360 / +91 72388 29132 | <a href="mailto:info@codegurru.in" className="text-indigo-600 font-bold hover:underline">info@codegurru.in</a></span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 2. REFUND POLICY (PAGE-LENGTH DETAILED CONTENT) */}
              {activeModal === 'refund' && (
                <div className="space-y-4 text-xs xxs:text-[13px] text-slate-700 leading-relaxed pr-1">
                  <div className="p-3.5 bg-rose-50/80 border border-rose-100 rounded-2xl">
                    <h4 className="font-bold text-rose-950 text-sm mb-1">
                      7-Day 100% Money-Back Guarantee
                    </h4>
                    <p className="text-rose-800 text-xs font-medium">
                      We believe in absolute student satisfaction. If our training methodology does not meet your expectations, claim a 100% full refund within the first 7 days.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-rose-600 flex items-center gap-1.5">
                      <span>●</span> Refund Eligibility Criteria
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>7-Day Window:</strong> Refund claims must be formally lodged within 7 calendar days of the official batch orientation/start date.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Attendance Threshold:</strong> The student must have attended no more than 25% of total live classroom or lab hours during the initial 7-day period.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Return of Physical Kits:</strong> Any issued student ID card, RFID pass, printed book modules, or hardware kits must be returned in good condition.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Original Enrollment Verification:</strong> The applicant must provide proof of original tuition payment and registered student identification number.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-rose-600 flex items-center gap-1.5">
                      <span>●</span> Non-Refundable Situations
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Requests Beyond 7 Days:</strong> Any refund request submitted after 7 calendar days from batch commencement is strictly non-refundable under all circumstances.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Course Completion &amp; Certificates:</strong> Once any course module certification, test credentials, or placement drives have been accessed, refund rights are forfeited.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Disciplinary Suspensions:</strong> Students suspended or dismissed due to code of conduct violations or academic fraud are ineligible for tuition reimbursement.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-rose-600 flex items-center gap-1.5">
                      <span>●</span> Refund Processing &amp; Disbursement
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Payment Channel:</strong> All approved refunds are transferred directly back to the original source method (Bank Account, UPI, or Credit/Debit Card).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Turnaround Timeline:</strong> Approved claims are initiated within 48 hours and typically credit to your bank account within 5 to 7 working days.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Free Batch Rollover Alternative:</strong> Students may opt for a 1-time free batch transfer to upcoming cohorts if facing scheduling or academic conflicts.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>How to Apply:</strong> Email your registered Student ID to <a href="mailto:info@codegurru.in" className="text-rose-700 font-bold hover:underline">info@codegurru.in</a> or call our finance desk at +91 72388 29360.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 3. SETTINGS (INTERACTIVE CONTROLS + COMPREHENSIVE SETTINGS) */}
              {activeModal === 'settings' && (
                <div className="space-y-4 text-xs xxs:text-[13px] text-slate-700 leading-relaxed pr-1">
                  <div className="p-3.5 bg-slate-100/90 border border-slate-200/80 rounded-2xl">
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      Account Preferences &amp; Platform Controls
                    </h4>
                    <p className="text-slate-600 text-xs font-medium">
                      Customize your learning experience, notification channels, account security, and visual theme settings.
                    </p>
                  </div>

                  {/* Visual Theme Switcher */}
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-slate-900">App Theme Preference</span>
                      <span className="text-xs font-semibold text-slate-500">
                        {isDarkMode ? 'Dark Theme (Reduced Eye Strain)' : 'Light Theme (Classic Clean)'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={toggleTheme}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
                        isDarkMode ? 'bg-indigo-900 border border-indigo-700' : 'bg-amber-400 border border-amber-300'
                      }`}
                      title="Switch Light / Dark Theme"
                    >
                      <span
                        className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full shadow-md transition-transform duration-300 text-xs ${
                          isDarkMode ? 'translate-x-7 bg-slate-900 text-amber-300' : 'translate-x-0 bg-white text-amber-500'
                        }`}
                      >
                        {isDarkMode ? '🌙' : '☀️'}
                      </span>
                    </button>
                  </div>

                  {/* Notification Channels */}
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-slate-700 flex items-center gap-1.5">
                      <span>●</span> Notification Preferences
                    </h5>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-slate-900">WhatsApp Class Reminders</span>
                          <span className="text-xs text-slate-500">Daily batch timings, lab notices, and schedule updates</span>
                        </div>
                        <input type="checkbox" defaultChecked className="toggle-checkbox accent-emerald-600 w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-slate-900">Placement Drive Alerts</span>
                          <span className="text-xs text-slate-500">Instant notifications for new recruitment drives and eligibility criteria</span>
                        </div>
                        <input type="checkbox" defaultChecked className="toggle-checkbox accent-emerald-600 w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-slate-900">Weekly Performance Report</span>
                          <span className="text-xs text-slate-500">Email digest summarizing attendance, project scores, and quiz ranks</span>
                        </div>
                        <input type="checkbox" defaultChecked className="toggle-checkbox accent-emerald-600 w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Change Password Form */}
                  <div className="py-2 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-slate-900">Account Security</span>
                        <span className="text-xs font-semibold text-slate-500">Change or Create New Password</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-amber-200"
                      >
                        {showPasswordForm ? 'Hide' : 'Change Password'}
                      </button>
                    </div>

                    {showPasswordForm && (
                      <form onSubmit={handlePasswordUpdate} className="space-y-2.5 pt-1 animate-fadeIn">
                        {passwordSuccess && (
                          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-card-pop">
                            <CheckCircleIcon className="!w-4 !h-4 text-emerald-600" />
                            <span>Password updated successfully!</span>
                          </div>
                        )}
                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Current Password (Optional)
                          </label>
                          <input
                            type="password"
                            placeholder="Enter current password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-400 text-xs font-semibold outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Create New Password *
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Enter new password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-400 text-xs font-semibold outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Confirm New Password *
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Confirm new password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-400 text-xs font-semibold outline-none transition-all"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-xs active:scale-95 mt-1"
                        >
                          Update / Create Password
                        </button>
                      </form>
                    )}
                  </div>

                  {/* App Version Info */}
                  <div className="flex items-center justify-between py-2 border-t border-slate-100">
                    <span className="font-bold text-xs text-slate-800">App Diagnostics</span>
                    <span className="text-xs text-slate-500 font-bold">CodeGurru Engine v2.5.0 (Cloud Sync: OK)</span>
                  </div>
                </div>
              )}

              {/* 4. PRIVACY POLICY (PAGE-LENGTH DETAILED CONTENT) */}
              {activeModal === 'privacy' && (
                <div className="space-y-4 text-xs xxs:text-[13px] text-slate-700 leading-relaxed pr-1">
                  <div className="p-3.5 bg-emerald-50/80 border border-emerald-100 rounded-2xl">
                    <h4 className="font-bold text-emerald-950 text-sm mb-1">
                      Data Privacy &amp; Student Protection Policy
                    </h4>
                    <p className="text-emerald-800 text-xs font-medium">
                      CodeGurru enforces strict enterprise security and data privacy protocols to protect student personal, academic, and payment records.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-emerald-600 flex items-center gap-1.5">
                      <span>●</span> Information We Collect
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Identity &amp; Contact Details:</strong> Full legal name, phone number, WhatsApp contact, verified email address, and home city.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Academic Background:</strong> Degree, college name, branch, graduation year, and aggregate percentage scores for placement matching.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Learning Activity:</strong> Assignment submissions, project code commits, weekly quiz scores, and batch attendance logs.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Financial Records:</strong> Invoices, payment receipts, and transaction reference numbers (raw card/UPI PIN data is never captured).</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-emerald-600 flex items-center gap-1.5">
                      <span>●</span> How We Use Your Information
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Classroom &amp; LMS Provisioning:</strong> Authenticating student profiles on portal dashboards and allocating lab workstation seats.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Direct Placement Submissions:</strong> Forwarding qualified student resumes and project portfolios to partner hiring HRs upon candidate approval.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Operational Communications:</strong> Delivering class rescheduling notices, test links, project deadlines, and fee receipts.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-emerald-600 flex items-center gap-1.5">
                      <span>●</span> Zero-Spam Guarantee &amp; Security Protocols
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>No Data Selling:</strong> We strictly never sell, trade, or share your contact data with telemarketers or third-party advertising brokers.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>256-Bit SSL/TLS Encryption:</strong> All communications between your browser and our servers are encrypted via high-grade TLS protocols.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Student Data Rights:</strong> Students have the absolute right to view, modify, download, or delete their profile data by writing to <a href="mailto:info@codegurru.in" className="text-emerald-700 font-bold hover:underline">info@codegurru.in</a>.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 5. CANCELLATION POLICY (PAGE-LENGTH DETAILED CONTENT) */}
              {activeModal === 'cancellation' && (
                <div className="space-y-4 text-xs xxs:text-[13px] text-slate-700 leading-relaxed pr-1">
                  <div className="p-3.5 bg-rose-50/80 border border-rose-100 rounded-2xl">
                    <h4 className="font-bold text-rose-950 text-sm mb-1">
                      Batch Cancellation &amp; Deferral Policy
                    </h4>
                    <p className="text-rose-800 text-xs font-medium">
                      Clear, flexible rules for course cancellations, batch freeze requests, and academic deferrals.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-rose-600 flex items-center gap-1.5">
                      <span>●</span> Cancellation Prior to Batch Orientation
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Full 100% Refund:</strong> Cancel at least 24 hours prior to the batch orientation session to receive a full refund with zero deductions.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Free Seat Transfer:</strong> Alternatively, rollover your full tuition credit to any upcoming batch within the next 6 months at zero fee.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-rose-600 flex items-center gap-1.5">
                      <span>●</span> Course Freeze &amp; Batch Deferral
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>College Exam Freeze:</strong> Enrolled students facing university semester exams or medical emergencies can pause their batch for up to 6 months.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Seamless Resumption:</strong> When ready to resume, rejoin from the exact same curriculum module in any parallel active batch.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>No Extra Charges:</strong> Batch deferral requests are granted free of cost once per registered student upon submitting written notice.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-rose-600 flex items-center gap-1.5">
                      <span>●</span> Cancellation Process &amp; Key Conditions
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Cancellation Submission:</strong> Requests must be submitted via the student dashboard or handed in person at our Ayodhya Campus front desk.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Placement Cell Status:</strong> Formal cancellation of enrolment leads to immediate de-registration from the CodeGurru Placement Assistance network.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Helpline Support:</strong> For cancellation queries or emergency deferral requests, call our student desk at +91 72388 29360.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 6. TERMS & CONDITIONS (PAGE-LENGTH DETAILED CONTENT) */}
              {activeModal === 'terms' && (
                <div className="space-y-4 text-xs xxs:text-[13px] text-slate-700 leading-relaxed pr-1">
                  <div className="p-3.5 bg-amber-50/80 border border-amber-100 rounded-2xl">
                    <h4 className="font-bold text-amber-950 text-sm mb-1">
                      Institutional Terms of Service &amp; Campus Code
                    </h4>
                    <p className="text-amber-800 text-xs font-medium">
                      Please review the operational terms, academic standards, and campus rules governing student enrollment at CodeGurru Academy.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-amber-600 flex items-center gap-1.5">
                      <span>●</span> 1. Academic Standards &amp; Attendance Rules
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Minimum 80% Attendance:</strong> Students must maintain an attendance record of at least 80% to remain eligible for placement drives and course certification.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Mandatory Capstones:</strong> Successful graduation requires completion of 4 end-to-end production projects and passing weekly evaluation quizzes.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Academic Integrity:</strong> Plagiarism or submitting unauthorized code from third parties during exams will result in disqualification.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-amber-600 flex items-center gap-1.5">
                      <span>●</span> 2. Campus &amp; Lab Guidelines
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Equipment Care:</strong> High-end desktop workstations and campus fiber networking must be treated with care and used purely for coding activities.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Zero-Tolerance Misconduct:</strong> CodeGurru enforces zero tolerance toward any harassment, ragging, or disruptive behavior within campus premises.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Campus ID Mandatory:</strong> Students must carry physical or digital CodeGurru identity passes when entering offline labs.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-amber-600 flex items-center gap-1.5">
                      <span>●</span> 3. Intellectual Property &amp; Legal Jurisdiction
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Proprietary Curriculum:</strong> Lecture recordings, course slides, assessment tests, and internal repositories are the exclusive IP of CodeGurru.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Placement Assistance Obligations:</strong> CodeGurru guarantees interview opportunities with hiring partners; final employment offers depend on student technical interview performance.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Governing Law:</strong> All legal matters and disputes are subject to the exclusive jurisdiction of the civil courts of Ayodhya, Uttar Pradesh.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 7. HELP & SUPPORT (PAGE-LENGTH DETAILED CONTENT) */}
              {activeModal === 'help' && (
                <div className="space-y-4 text-xs xxs:text-[13px] text-slate-700 leading-relaxed pr-1">
                  <div className="p-3.5 bg-purple-50/80 border border-purple-100 rounded-2xl">
                    <h4 className="font-bold text-purple-950 text-sm mb-1">
                      24/7 Student Helpdesk &amp; Support Cell
                    </h4>
                    <p className="text-purple-800 text-xs font-medium">
                      We are always here to assist you with curriculum doubts, project debugging, batch rescheduling, and placement drives.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-purple-600 flex items-center gap-1.5">
                      <span>●</span> Support Channels &amp; Assistance Desks
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Technical Doubt Clearing:</strong> 1-on-1 mentor desks active Mon–Sat (10:00 AM – 7:00 PM) for real-time bug fixing and project code reviews.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Placement &amp; Resume Help:</strong> Weekly resume polishing sessions, GitHub portfolio audits, and mock technical interview slots.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Batch &amp; Timings Support:</strong> Assistance with batch scheduling, room allocations, class deferrals, and recording access.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2 text-purple-600 flex items-center gap-1.5">
                      <span>●</span> Direct Campus Coordinates
                    </h5>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Ayodhya Campus:</strong> Near Saket College Petrol Pump, Ayodhya, Uttar Pradesh.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Lucknow Head Office:</strong> Regional Tech Center, Lucknow, Uttar Pradesh 226012.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Working Hours:</strong> Mon–Sat 10:00 AM – 7:00 PM (Helplines 24/7 Active)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold shrink-0 mt-0.5">•</span>
                        <span>
                          <strong>Direct Phone Lines:</strong>{' '}
                          <button
                            type="button"
                            onClick={(e) => handleCallSupport(e, '+917238829360')}
                            className="text-purple-700 font-bold hover:underline cursor-pointer inline-flex items-center gap-1 active:scale-95 transition-transform"
                          >
                            <CallIcon className="!w-3.5 !h-3.5 text-purple-600" />
                            <span>+91 72388 29360</span>
                          </button>{' '}
                          /{' '}
                          <button
                            type="button"
                            onClick={(e) => handleCallSupport(e, '+917238829132')}
                            className="text-purple-700 font-bold hover:underline cursor-pointer inline-flex items-center gap-1 active:scale-95 transition-transform"
                          >
                            <CallIcon className="!w-3.5 !h-3.5 text-purple-600" />
                            <span>+91 72388 29132</span>
                          </button>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold shrink-0 mt-0.5">•</span>
                        <span>
                          <strong>WhatsApp Desk:</strong>{' '}
                          <button
                            type="button"
                            onClick={handleWhatsAppRedirect}
                            className="text-emerald-700 font-bold hover:underline cursor-pointer inline-flex items-center gap-1 active:scale-95 transition-transform"
                          >
                            <WhatsAppIcon className="!w-3.5 !h-3.5 text-emerald-600" />
                            <span>+91 7238829360 (Instant Support)</span>
                          </button>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold shrink-0 mt-0.5">•</span>
                        <span><strong>Official Email Support:</strong> <a href="mailto:info@codegurru.in" className="text-purple-700 font-bold hover:underline">info@codegurru.in</a></span>
                      </li>
                    </ul>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="pt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleCallSupport(e, '+917238829360')}
                        className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl text-xs text-center transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer select-none"
                        title="Click to Call +91 72388 29360"
                      >
                        <CallIcon className="!w-4 !h-4 text-white" />
                        <span>Call Support</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleWhatsAppRedirect}
                        className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl text-xs text-center transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer select-none"
                        title="Click to Open WhatsApp Chat"
                      >
                        <WhatsAppIcon className="!w-4 !h-4 text-white" />
                        <span>WhatsApp</span>
                      </button>
                    </div>

                    {callNotice && (
                      <div className="bg-purple-50 border border-purple-200 text-purple-900 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
                        <span className="flex items-center gap-1.5">
                          <CallIcon className="!w-3.5 !h-3.5 text-purple-600 animate-pulse" />
                          <span>Connecting / Copied: <strong>{callNotice}</strong></span>
                        </span>
                        <span className="text-xs bg-purple-200/80 text-purple-900 px-1.5 py-0.5 rounded font-bold">Dialing</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
