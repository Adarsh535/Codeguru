'use client';

import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import Logo from './Logo';
import AlertModal from './AlertModal';
import { useContactFormController } from '../../controllers/useContactFormController';

export default function ContactUsSection() {
  const [isManualEdit, setIsManualEdit] = useState(false);

  const {
    formData,
    locationStatus,
    isDetectingLocation,
    locationData,
    manualCity,
    ipSuggestion,
    setManualCity,
    acceptIpSuggestion,
    retryLocationDetection,
    isCaptchaChecked,
    isSubmitting,
    isSubmitted,
    alertModalConfig,
    closeAlertModal,
    handleChange,
    handleSubmit,
    toggleCaptcha
  } = useContactFormController();

  return (
    <div id="contact-section" className="w-full max-w-7xl mx-auto px-2 xxs:px-3 sm:px-6 my-1 select-none">
      {/* POPUP ALERT MODAL */}
      <AlertModal
        isOpen={alertModalConfig.isOpen}
        type={alertModalConfig.type}
        title={alertModalConfig.title}
        message={alertModalConfig.message}
        buttonText={alertModalConfig.buttonText}
        onClose={closeAlertModal}
      />

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl xxs:rounded-[32px] p-4 xxs:p-5 sm:p-7 border border-slate-200/90 shadow-2xs relative overflow-hidden flex flex-col gap-2.5 xxs:gap-3">
        
        {/* FORM TITLE: CODEGURU LOGO + GET IN TOUCH */}
        <div className="flex flex-col gap-1 border-b border-slate-100 pb-2">
          <div className="flex items-center justify-between gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 xxs:gap-2.5">
              <div className="w-7 h-7 xxs:w-8 xxs:h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200/90 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                <img
                  src="/logo-icon.png"
                  alt="CodeGurru Mascot"
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
                inputMode="numeric"
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

          {/* ROW 3: STUDENT CURRENT CITY (GPS / MANUAL) */}
          <div className="flex flex-col gap-1">
            {isDetectingLocation ? (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-cyan-50/80 border border-cyan-200 text-cyan-800 text-xs">
                <div className="w-3.5 h-3.5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="font-semibold">Detecting your location...</span>
              </div>
            ) : locationStatus === 'detected' && !isManualEdit ? (
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-950 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-emerald-600 text-sm shrink-0">📍</span>
                  <span className="truncate font-bold">
                    {locationData.city}{locationData.state ? `, ${locationData.state}` : ''}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black uppercase shrink-0">
                    GPS Verified
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsManualEdit(true);
                    setManualCity(locationData.city || '');
                  }}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline ml-2 shrink-0 cursor-pointer"
                >
                  Change
                </button>
              </div>
            ) : locationStatus === 'ip_approx' && !isManualEdit ? (
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-amber-600 text-sm shrink-0">📍</span>
                  <span className="truncate font-bold">
                    {manualCity || locationData.city}
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-black shrink-0">
                    Approximate (IP)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsManualEdit(true)}
                  className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline ml-2 shrink-0 cursor-pointer"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>Your Current City</span>
                    <span className="text-red-500 font-bold">*</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsManualEdit(false);
                      retryLocationDetection();
                    }}
                    className="text-[11px] text-cyan-600 hover:text-cyan-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <MyLocationIcon className="!w-3 !h-3" />
                    <span>Auto-detect</span>
                  </button>
                </label>
                <input
                  suppressHydrationWarning
                  type="text"
                  name="manualCity"
                  required
                  value={manualCity}
                  onChange={setManualCity}
                  placeholder="Enter your city (e.g. Pune, Lucknow, Ayodhya)"
                  className="w-full px-4 py-2.5 rounded-full border border-slate-200/90 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
                {ipSuggestion && !manualCity && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span>Near:</span>
                    <button
                      type="button"
                      onClick={() => {
                        acceptIpSuggestion();
                        setIsManualEdit(false);
                      }}
                      className="text-cyan-700 hover:underline font-bold cursor-pointer"
                    >
                      {ipSuggestion.city} (approximate internet location)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON (SEND QUERY) */}
          <button
            suppressHydrationWarning
            type="submit"
            disabled={isSubmitting || isSubmitted}
            className={`w-full ${
              isSubmitting || isSubmitted
                ? 'bg-slate-400 cursor-not-allowed opacity-80'
                : 'bg-[#549ebf] hover:bg-[#4387a6] active:bg-[#35728f] cursor-pointer active:scale-[0.99]'
            } text-white font-black text-xs xxs:text-sm uppercase tracking-wider py-2.5 xxs:py-3 px-4 rounded-full transition-all duration-200 shadow-sm flex items-center justify-center gap-2 mt-0.5`}
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting Query...</span>
              </>
            ) : isDetectingLocation ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Detecting Location...</span>
              </>
            ) : (
              <>
                <span>SEND QUERY</span>
                <SendIcon className="!w-4 !h-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
