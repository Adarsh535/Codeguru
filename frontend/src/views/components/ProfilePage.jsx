'use client';

import React, { useState, useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import ShieldIcon from '@mui/icons-material/Shield';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import DescriptionIcon from '@mui/icons-material/Description';
import HelpIcon from '@mui/icons-material/Help';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
        <h2 className="text-lg xxs:text-xl font-black text-slate-900 tracking-tight font-heading">
          {user ? user.name : 'Guest User'}
        </h2>
        <span className="text-[9px] xxs:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
          {user ? user.email : 'LIMITED ACCESS'}
        </span>
      </div>

      {/* 2. AUTH / LOGOUT BUTTONS */}
      <div className="flex items-center justify-between gap-3">
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs xxs:text-sm uppercase py-3 rounded-2xl shadow-md hover:shadow-lg transition-all tracking-wider text-center cursor-pointer flex items-center justify-center gap-2"
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
              className="flex-1 bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-black text-xs xxs:text-sm uppercase py-3 rounded-2xl shadow-md hover:shadow-lg transition-all tracking-wider text-center cursor-pointer"
            >
              LOGIN
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setActiveModal('auth');
              }}
              className="flex-1 bg-white hover:bg-amber-50/50 border-2 border-amber-400 text-amber-500 hover:text-amber-600 active:scale-95 font-black text-xs xxs:text-sm uppercase py-2.5 rounded-2xl shadow-xs transition-all tracking-wider text-center cursor-pointer"
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
          <div className="bg-white rounded-3xl p-5 xxs:p-6 w-full max-w-md shadow-2xl border border-slate-100 relative max-h-[85vh] flex flex-col justify-between overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-base xxs:text-lg font-black text-slate-900 font-heading">
                {activeModal === 'auth'
                  ? authMode === 'login'
                    ? 'Login to CodeGuru'
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
            <div className="overflow-y-auto flex-1 pr-1 text-slate-700 text-xs xxs:text-sm space-y-3">
              {activeModal === 'auth' && (
                <div>
                  {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-emerald-600 gap-2">
                      <CheckCircleIcon className="!w-12 !h-12 text-emerald-500 animate-bounce" />
                      <p className="font-black text-base">
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
                        className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-3 rounded-xl shadow-md uppercase tracking-wider text-xs mt-2 transition-all cursor-pointer"
                      >
                        {authMode === 'login' ? 'Login Now' : 'Create Account'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {activeModal === 'about' && (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-800">
                    Welcome to CodeGuru - India's leading coding & career placement academy!
                  </p>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    We empower students and working professionals with industry-ready software engineering, cloud computing, and full-stack development skills to crack top TECH CTC placements up to 50 LPA.
                  </p>
                </div>
              )}

              {activeModal === 'refund' && (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-800">7-Day Money-Back Guarantee</p>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    If you are not satisfied with any registered course module within 7 days of enrollment, you can submit a refund request for 100% full refund with zero questions asked.
                  </p>
                </div>
              )}

              {activeModal === 'settings' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-800">Push Notifications</span>
                    <input type="checkbox" defaultChecked className="toggle-checkbox accent-amber-500" />
                  </div>
                  {/* WORKING DARK / LIGHT MODE TOGGLE SWITCH */}
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-slate-800">App Theme</span>
                      <span className="text-[10px] font-bold text-amber-600">
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
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

                  {/* CHANGE / CREATE NEW PASSWORD SECTION */}
                  <div className="py-2 border-b border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-slate-800">Account Security</span>
                        <span className="text-[10px] font-semibold text-slate-400">Change or Create New Password</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="text-xs font-black text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
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
                          <label className="text-[10px] font-extrabold text-slate-700 block mb-1">
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
                          <label className="text-[10px] font-extrabold text-slate-700 block mb-1">
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
                          <label className="text-[10px] font-extrabold text-slate-700 block mb-1">
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
                          className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 mt-1"
                        >
                          Update / Create Password
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="font-bold text-xs text-slate-800">App Version</span>
                    <span className="text-xs text-slate-400 font-bold">v2.4.0</span>
                  </div>
                </div>
              )}

              {activeModal === 'privacy' && (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-800">Data Privacy & Security</p>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Your personal details, contact number, and academic records are 100% encrypted and protected under strict privacy protocols. We never sell or share your data with third parties.
                  </p>
                </div>
              )}

              {activeModal === 'cancellation' && (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-800">Easy Cancellation</p>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Course registrations and subscription plans can be cancelled anytime before batch commencement directly from your student portal or by contacting campus helpdesk.
                  </p>
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-800">Terms of Service</p>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    By accessing CodeGuru learning platform and offline campus facilities, you agree to abide by our student code of conduct, intellectual property rights, and placement assistance guidelines.
                  </p>
                </div>
              )}

              {activeModal === 'help' && (
                <div className="space-y-3">
                  <p className="font-semibold text-slate-800">Need Assistance?</p>
                  <p className="text-slate-600 text-xs">
                    Our student support team is available 24/7 to answer your queries regarding courses, fees, or placement drives.
                  </p>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      onOpenContactModal();
                    }}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Contact Support Team
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
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
