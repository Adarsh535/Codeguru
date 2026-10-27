'use client';

import { X as CloseIcon, CheckCircle2 as CheckCircleIcon, ArrowRight as ArrowForwardIcon, Phone as CallIcon, GraduationCap as SchoolIcon, LogOut as LogoutIcon, User as PersonIcon, Mail as EmailIcon, Pencil as EditIcon } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../../services/apiService';
import { getApiBase } from '../../models/apiClient';
import { getQuickLocationSync } from '../../utils/geoLocator';

export default function BottomBarOtpSheet({
  isOpen,
  onClose,
  user,
  onLoginSuccess,
  onOpenContactModal
}) {
  const [renderSheet, setRenderSheet] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Flow steps: 'phone' -> 'details' -> 'success' (Zero OTP)
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [createdLeadId, setCreatedLeadId] = useState(null);
  const createdLeadIdRef = useRef(null);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const phoneInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  const [showMyBatch, setShowMyBatch] = useState(true);

  // Fetch showMyBatchNav setting from backend
  useEffect(() => {
    try {
      fetch(`${getApiBase()}/settings`)
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.data && data.data.showMyBatchNav !== undefined) {
            setShowMyBatch(Boolean(data.data.showMyBatchNav));
          }
        })
        .catch(() => {});
    } catch (e) {}
  }, [isOpen]);

  // Handle open/close animation & state resets
  useEffect(() => {
    if (isOpen) {
      setRenderSheet(true);
      setIsClosing(false);
      setStep('phone');
      setErrorMsg('');
      setLoading(false);
      setPhoneLoading(false);
      setCreatedLeadId(null);
      createdLeadIdRef.current = null;
    } else if (renderSheet) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setRenderSheet(false);
        setIsClosing(false);
        setCreatedLeadId(null);
        createdLeadIdRef.current = null;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, user]);

  if (!renderSheet) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 280);
  };

  // STEP 1: Phone submission -> Immediately creates Lead in Admin, then moves to Name & Email step
  const handlePhoneNext = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setPhoneLoading(true);
    const userLoc = getQuickLocationSync() || 'Online Visitor';

    try {
      // 1. Immediately send Step 1 Lead to Admin so phone number is saved even if user drops off
      const leadRes = await apiService.submitLead({
        phone: cleanPhone,
        name: 'Student Applicant',
        location: userLoc,
        course: 'Admission & Training Inquiry',
        notes: `Step 1: Mobile entered (${cleanPhone}), profile pending`,
        status: 'New'
      });

      if (leadRes && leadRes.data) {
        const savedId = leadRes.data.id || leadRes.data._id || leadRes.data.leadId;
        if (savedId) {
          createdLeadIdRef.current = savedId;
          setCreatedLeadId(savedId);
        }
      }

      setStep('details');
      setErrorMsg('');
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 150);
    } catch (err) {
      console.warn('Step 1 lead submit error:', err);
      // Still proceed so user isn't stuck
      setStep('details');
    } finally {
      setPhoneLoading(false);
    }
  };

  // STEP 2: Name & Email submission -> Updates the Step 1 lead in Admin & logs in Student
  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanName = name.trim();
    if (!cleanName || cleanName.length < 2) {
      setErrorMsg('Please enter your full name');
      if (nameInputRef.current) nameInputRef.current.focus();
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address');
      if (emailInputRef.current) emailInputRef.current.focus();
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    setLoading(true);
    const userLoc = getQuickLocationSync() || 'Online Visitor';

    try {
      // 1. Single reliable update: update the Step 1 lead in Admin database with student Name & Email
      const targetLeadId = createdLeadIdRef.current || createdLeadId;
      await apiService.updateLead(targetLeadId, {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        location: userLoc,
        notes: `Inquiry completed by student\nName: ${cleanName}\nEmail: ${cleanEmail}\nPhone: ${cleanPhone}`
      }).catch(err => console.warn('updateLead non-fatal:', err));

      // 2. Establish active student session
      const userPayload = {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };

      try {
        localStorage.setItem('codeguru_user', JSON.stringify(userPayload));
        // Auth tokens reside in HttpOnly cookies; purge any legacy localStorage tokens
        localStorage.removeItem('codeguru_token');
        localStorage.removeItem('token');
        localStorage.setItem('codeguru_lead_submitted', cleanPhone);
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('codeguru_user_updated'));
      } catch (storageErr) {}

      setStep('success');

      if (onLoginSuccess) {
        onLoginSuccess(userPayload);
      }

      // Smooth auto-dismiss after success confirmation
      setTimeout(() => {
        handleClose();
      }, 2200);

    } catch (err) {
      console.error('Final registration error:', err);
      setErrorMsg('Unable to submit inquiry. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('codeguru_user');
    localStorage.removeItem('codeguru_token');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('codeguru_user_updated'));
    handleClose();
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 transition-opacity duration-300 ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      suppressHydrationWarning
    >
      {/* BACKDROP OVERLAY */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-backdrop-in"
        onClick={handleClose}
      />

      {/* ============================================================== */}
      {/* BADHA CARD (BACKGROUND ELEVATED CARD / FRAME)                   */}
      {/* ============================================================== */}
      <div 
        className={`relative z-10 w-full max-w-[440px] mx-auto rounded-t-2xl sm:rounded-2xl p-2.5 sm:p-3.5 bg-slate-100 shadow-2xl border-t sm:border border-slate-200 transform transition-all duration-300 ease-out ${
          isClosing ? 'translate-y-full sm:translate-y-2 sm:scale-95 opacity-0' : 'animate-modal-slide-up'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP DRAG HANDLE ON BADHA CARD */}
        <div className="pt-0.5 pb-2 flex justify-center cursor-pointer" onClick={handleClose}>
          <div className="w-12 h-1.5 bg-slate-400/50 rounded-full hover:bg-slate-400 transition-colors" />
        </div>

        {/* ============================================================== */}
        {/* CHHOTA CARD (INNER WHITE CARD WITH MULTI-STEP FORM)            */}
        {/* ============================================================== */}
        <div 
          className="relative w-full bg-white rounded-2xl sm:rounded-2xl shadow-lg border border-slate-100/80 px-6 sm:px-7 pt-5 pb-6 overflow-hidden flex flex-col"
          style={{
            background: 'radial-gradient(circle at 50% 10%, rgba(249, 115, 22, 0.08) 0%, rgba(255, 255, 255, 0) 65%), #ffffff'
          }}
        >
          {/* FLOATING LIGHT CIRCULAR CLOSE (X) BUTTON */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            title="Close"
          >
            <CloseIcon className="!w-4 !h-4 text-slate-700" />
          </button>

          {/* ---------------- 1. ALREADY LOGGED IN VIEW ---------------- */}
          {user ? (
            <div className="flex flex-col gap-4 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fb923c] to-[#ea580c] text-white flex items-center justify-center shadow-lg mx-auto font-bold text-2xl">
                {user.name ? user.name[0] : 'S'}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{user.name}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{user.email || user.phone}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                  ● Active Student
                </span>
              </div>

              <div className={`grid ${showMyBatch ? 'grid-cols-2' : 'grid-cols-1'} gap-2.5 mt-2`}>
                {showMyBatch && (
                  <a
                    href="/my-batch"
                    className="flex items-center justify-center gap-2 py-3 px-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <SchoolIcon className="!w-4 !h-4 text-orange-400" />
                    <span>My Batches</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    if (onOpenContactModal) onOpenContactModal();
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-3 bg-orange-50 text-orange-950 border border-orange-200 rounded-2xl text-xs font-bold hover:bg-orange-100 transition-colors"
                >
                  <CallIcon className="!w-4 !h-4 text-orange-600" />
                  <span>Call Support</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full mt-1 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogoutIcon className="!w-4 !h-4" />
                <span>Logout Account</span>
              </button>
            </div>

          ) : step === 'phone' ? (
            /* ---------------- 2. STEP 1: MOBILE NUMBER ENTRY ---------------- */
            <form onSubmit={handlePhoneNext} className="flex flex-col">
              
              {/* SOCIAL PROOF AVATAR CLUSTER */}
              <div className="flex items-center justify-center -space-x-2 pt-1 mb-2 select-none">
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f97316] text-white font-semibold text-sm flex items-center justify-center ring-2 ring-white shadow-xs">
                  R
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#8b5cf6] text-white font-semibold text-sm flex items-center justify-center ring-2 ring-white shadow-xs">
                  A
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0ea5e9] text-white font-semibold text-sm flex items-center justify-center ring-2 ring-white shadow-xs">
                  S
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#10b981] text-white font-semibold text-sm flex items-center justify-center ring-2 ring-white shadow-xs">
                  P
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0f172a] text-white font-bold text-xs sm:text-xs flex items-center justify-center ring-2 ring-white shadow-xs">
                  5k+
                </span>
              </div>

              {/* SOCIAL PROOF SUB-BANNER */}
              <p className="text-center text-xs sm:text-[13px] text-slate-600 font-medium mb-4 select-none">
                Join <strong className="text-orange-500 font-bold">5000+</strong> students learning with us
              </p>

              {/* HEADLINE & SUBTITLE */}
              <div className="text-center mb-5">
                <h2 className="text-[25px] sm:text-[27px] font-bold text-slate-900 tracking-tight font-heading">
                  Login / Sign up
                </h2>
                <p className="text-xs sm:text-[13.5px] font-medium text-slate-500 mt-1">
                  Enter your mobile number to continue
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* PHONE NUMBER INPUT CARD */}
              <div className="bg-white border border-slate-200/90 hover:border-slate-300 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 rounded-2xl px-4 py-3 sm:py-3.5 flex items-center gap-3 transition-all mb-4 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 select-none shrink-0">
                  <span className="font-semibold text-slate-900">IN</span>
                  <span className="font-semibold text-slate-900">+91</span>
                </div>
                <div className="h-5 w-[1px] bg-slate-200 shrink-0" />
                <input
                  ref={phoneInputRef}
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^0-9]/g, '');
                    setPhone(clean);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="98765 43210"
                  className="w-full bg-transparent text-base sm:text-lg font-bold text-slate-900 placeholder:text-slate-400 outline-none tracking-wide"
                />
                {phone && (
                  <button
                    type="button"
                    onClick={() => { setPhone(''); if (errorMsg) setErrorMsg(''); }}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                    title="Clear number"
                  >
                    <CloseIcon className="!w-4 !h-4" />
                  </button>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={phone.length < 10 || phoneLoading}
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold text-base sm:text-[17px] tracking-wide shadow-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {phoneLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Inquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit</span>
                    <ArrowForwardIcon className="!w-4 !h-4 text-white" />
                  </>
                )}
              </button>

              {/* TERMS & PRIVACY */}
              <p className="text-xs sm:text-xs text-slate-400 text-center font-medium mt-4 sm:mt-5 leading-relaxed select-none">
                By continuing, you agree to our Terms &amp; Privacy Policy
              </p>
            </form>

          ) : step === 'details' ? (
            /* ---------------- 3. STEP 2: NAME & EMAIL POPUP ---------------- */
            <form onSubmit={handleFinalSubmit} className="flex flex-col animate-fadeIn">
              
              {/* EDITABLE PHONE HEADER PILL */}
              <div className="flex items-center justify-between bg-orange-50/80 border border-orange-200/70 rounded-2xl px-3.5 py-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-600">Mobile:</span>
                  <span className="text-xs font-semibold text-slate-900">+91 {phone}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setErrorMsg(''); }}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <EditIcon className="!w-3 !h-3" />
                  <span>Change</span>
                </button>
              </div>

              {/* HEADLINE & SUBTITLE */}
              <div className="text-center mb-4">
                <h2 className="text-[23px] sm:text-[25px] font-bold text-slate-900 tracking-tight font-heading">
                  Complete Your Profile
                </h2>
                <p className="text-xs sm:text-[13px] font-medium text-slate-500 mt-0.5">
                  Enter your name &amp; email to proceed
                </p>
              </div>

              {errorMsg && (
                <div className="mb-3.5 bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* FULL NAME INPUT */}
              <div className="flex flex-col gap-1 mb-3">
                <label className="text-[10.5px] font-bold text-slate-500 pl-1">
                  Full Name
                </label>
                <div className="bg-white border border-slate-200/90 hover:border-slate-300 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 rounded-2xl px-3.5 py-3 flex items-center gap-2.5 transition-all shadow-xs">
                  <PersonIcon className="!w-4 !h-4 text-slate-400 shrink-0" />
                  <input
                    ref={nameInputRef}
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-transparent text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>

              {/* EMAIL ADDRESS INPUT */}
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-[10.5px] font-bold text-slate-500 pl-1">
                  Email Address
                </label>
                <div className="bg-white border border-slate-200/90 hover:border-slate-300 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 rounded-2xl px-3.5 py-3 flex items-center gap-2.5 transition-all shadow-xs">
                  <EmailIcon className="!w-4 !h-4 text-slate-400 shrink-0" />
                  <input
                    ref={emailInputRef}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. rahul@gmail.com"
                    className="w-full bg-transparent text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading || !name.trim() || !email.trim()}
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold text-base sm:text-[17px] tracking-wide shadow-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting Lead &amp; Logging In...</span>
                  </>
                ) : (
                  <>
                    <span>Submit &amp; Login</span>
                    <ArrowForwardIcon className="!w-4 !h-4 text-white" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setStep('phone'); setErrorMsg(''); }}
                className="mt-3 text-xs font-semibold text-slate-500 hover:text-slate-700 text-center cursor-pointer transition-colors"
              >
                ← Back to Mobile Number
              </button>
            </form>

          ) : (
            /* ---------------- 4. STEP 3: INSTANT SUCCESS CONFIRMATION ---------------- */
            <div className="py-6 text-center flex flex-col items-center gap-3.5 animate-fadeIn">
              <div className="w-18 h-18 rounded-full bg-emerald-50 border-4 border-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg relative">
                <CheckCircleIcon className="!w-12 !h-12 text-emerald-500" />
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-25" />
              </div>
              
              <div className="flex flex-col gap-1">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading">
                  Inquiry Submitted!
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-center mt-0.5">
                  ● Lead Sent to Admin
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Welcome, <strong className="text-slate-900 font-semibold">{name || 'Student'}</strong>! Our counselor will call you at <strong className="text-slate-900 font-semibold">+91 {phone}</strong> shortly.
                </p>
              </div>

              {/* LOADER PROGRESS BAR */}
              <div className="w-full max-w-[200px] bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-full animate-progress-fill" />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
