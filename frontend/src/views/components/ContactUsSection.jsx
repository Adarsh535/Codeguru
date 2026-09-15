'use client';

import React from 'react';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Logo from './Logo';
import { useContactFormController } from '../../controllers/useContactFormController';

export default function ContactUsSection() {
  const {
    formData,
    isCaptchaChecked,
    isSubmitted,
    handleChange,
    handleSubmit,
    toggleCaptcha
  } = useContactFormController();

  return (
    <div className="w-full max-w-7xl mx-auto px-2 xxs:px-3 sm:px-6 my-1 select-none">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl xxs:rounded-[32px] p-4 xxs:p-5 sm:p-7 border border-slate-200/90 shadow-2xs relative overflow-hidden flex flex-col gap-2.5 xxs:gap-3">
        
        {/* FORM TITLE: CODEGURU LOGO + GET IN TOUCH */}
        <div className="flex flex-col gap-1 border-b border-slate-100 pb-2">
          <div className="flex items-center justify-between gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 xxs:gap-2.5">
              <div className="w-7 h-7 xxs:w-8 xxs:h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200/90 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                <img
                  src="/logo-icon.png"
                  alt="CodeGuru Mascot"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <img
                src="/brand-text-logo.png"
                alt="CODE GURRU"
                className="h-5 xxs:h-6 sm:h-7 w-auto object-contain shrink-0"
              />
            </div>
            <h3 className="text-base xxs:text-lg sm:text-xl font-black text-slate-900 font-heading tracking-tight">
              Get in Touch
            </h3>
          </div>
          <div className="w-12 h-0.5 bg-amber-500 rounded-full mt-0.5" />
        </div>

        {/* SUCCESS NOTIFICATION TOAST */}
        {isSubmitted && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-2.5 rounded-full flex items-center gap-2 text-xs font-bold animate-card-pop">
            <CheckCircleIcon className="!w-4 !h-4 text-emerald-600 shrink-0" />
            <span>Thank you! Your query has been submitted successfully. Our team will contact you shortly.</span>
          </div>
        )}

          {/* 1:1 CONTACT FORM WITH FULL FIELDS */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 xxs:gap-3" suppressHydrationWarning>
            
            {/* ROW 1: YOUR NAME & YOUR PHONE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 xxs:gap-3">
              
              {/* Your Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-slate-800 tracking-tight flex items-center gap-1">
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
                  className="w-full px-4 py-2.5 rounded-full border border-slate-200/90 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
              </div>

              {/* Your Phone */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-slate-800 tracking-tight flex items-center gap-1">
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
                  className="w-full px-4 py-2.5 rounded-full border border-slate-200/90 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
              </div>

            </div>

            {/* ROW 2: INTERESTED COURSE */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-slate-800 tracking-tight flex items-center gap-1">
                <span>Interested Course</span>
              </label>
              <select
                suppressHydrationWarning
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-full border border-slate-200/90 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-xs font-semibold text-slate-900 outline-none transition-all bg-white"
              >
                <option value="Full Stack Web Development">Full Stack Web Development</option>
                <option value="Java Full Stack & DSA">Java Full Stack & DSA</option>
                <option value="Python Data Science & AI">Python Data Science & AI</option>
                <option value="C++ & Competitive Programming">C++ & Competitive Programming</option>
                <option value="DevOps & Cloud Engineering">DevOps & Cloud Engineering</option>
                <option value="Cyber Security & Ethical Hacking">Cyber Security & Ethical Hacking</option>
              </select>
            </div>

            {/* SUBMIT BUTTON (SEND QUERY) */}
            <button
              suppressHydrationWarning
              type="submit"
              className="w-full bg-[#549ebf] hover:bg-[#4387a6] active:bg-[#35728f] text-white font-black text-xs xxs:text-sm uppercase tracking-wider py-2.5 xxs:py-3 px-4 rounded-full transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] mt-0.5"
            >
              <span>SEND QUERY</span>
              <SendIcon className="!w-4 !h-4" />
            </button>

        </form>

      </div>
    </div>
  );
}
