'use client';

import React, { useState, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import Logo from './Logo';
import { useContactFormController } from '../../controllers/useContactFormController';

export default function InquiryModal({ isOpen, onClose, onSubmitSuccess }) {
  const [renderModal, setRenderModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const {
    formData,
    isCaptchaChecked,
    isSubmitted,
    handleChange,
    handleSubmit,
    toggleCaptcha
  } = useContactFormController();

  useEffect(() => {
    if (isSubmitted) {
      onSubmitSuccess?.();
    }
  }, [isSubmitted, onSubmitSuccess]);

  useEffect(() => {
    if (isOpen) {
      setRenderModal(true);
      setIsClosing(false);
    } else if (renderModal) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setRenderModal(false);
        setIsClosing(false);
      }, 260);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && renderModal && !isClosing) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [renderModal, isClosing]);

  if (!renderModal) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 260);
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 xxs:p-4 bg-slate-950/70 backdrop-blur-md select-none transition-all duration-300 ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg bg-white rounded-3xl xxs:rounded-[36px] overflow-hidden border border-slate-200/90 shadow-2xl flex flex-col transition-all duration-300 transform ${
          isClosing ? 'animate-modal-slide-down' : 'animate-modal-slide-up'
        }`}
      >
        {/* Sticky Top Header (Clean White Theme) */}
        <div className="bg-white p-4 xxs:p-5 pr-11 xxs:pr-14 flex flex-col gap-2 relative shrink-0 border-b border-slate-100">
          {/* Close Button (Positioned safely in top-right corner) */}
          <button
            suppressHydrationWarning
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 xxs:top-4 xxs:right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-2xs shrink-0 active:scale-90 cursor-pointer"
            title="Close"
          >
            <CloseIcon className="!w-4.5 !h-4.5" />
          </button>

          {/* Top Row: Mascot Icon + Brand Text Logo */}
          <div className="flex items-center gap-2 min-w-0 max-w-full overflow-hidden">
            <div className="w-7 h-7 xxs:w-8 xxs:h-8 rounded-full bg-white border border-slate-200/90 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              <img
                src="/logo-icon.png"
                alt="CodeGuru Mascot"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <img
              src="/brand-text-logo.png"
              alt="CODE GURRU"
              className="h-4 min-[360px]:h-4.5 sm:h-5.5 w-auto max-w-[120px] min-[360px]:max-w-[150px] sm:max-w-[200px] object-contain shrink-1 min-w-0"
            />
          </div>

          {/* Bottom Row: Title & Subtitle */}
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base xxs:text-lg font-black font-heading tracking-tight text-slate-900 leading-tight">
              Get in Touch
            </h3>
            <p className="text-[10.5px] xxs:text-xs text-slate-500 font-medium">Quick Course & Placement Registration</p>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 xxs:p-5 flex flex-col gap-3.5 max-h-[80vh] overflow-y-auto">
          
          {isSubmitted && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-full flex items-center gap-2 text-xs xxs:text-sm font-bold animate-card-pop">
              <CheckCircleIcon className="!w-5 !h-5 text-emerald-600" />
              <span>Thank you! Your query has been submitted successfully. Our team will contact you shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" suppressHydrationWarning>
            
            {/* ROW 1: Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1 ml-2">
                  <span>Your Name</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  suppressHydrationWarning
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Saurabh Kumar"
                  className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-xs font-semibold outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1 ml-2">
                  <span>Your Phone</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  suppressHydrationWarning
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10 Digit Mobile Number"
                  maxLength={10}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-xs font-semibold outline-none transition-all"
                />
              </div>
            </div>

            {/* ROW 2: Interested Course */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1 ml-2">
                <span>Interested Course</span>
              </label>
              <select
                suppressHydrationWarning
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-xs font-semibold outline-none transition-all bg-white"
              >
                <option value="Full Stack Web Development">Full Stack Web Development</option>
                <option value="Java Full Stack & DSA">Java Full Stack & DSA</option>
                <option value="Python Data Science & AI">Python Data Science & AI</option>
                <option value="C++ & Competitive Programming">C++ & Competitive Programming</option>
                <option value="DevOps & Cloud Engineering">DevOps & Cloud Engineering</option>
                <option value="Cyber Security & Ethical Hacking">Cyber Security & Ethical Hacking</option>
              </select>
            </div>

            {/* ROW 3: Submit Button */}
            <button
              suppressHydrationWarning
              type="submit"
              className="w-full bg-[#549ebf] hover:bg-[#4387a6] active:bg-[#35728f] text-white font-black text-xs uppercase tracking-wider py-3 px-4 rounded-full transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] mt-1"
            >
              <span>SEND QUERY</span>
              <SendIcon className="!w-4 !h-4" />
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
