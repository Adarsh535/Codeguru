'use client';

import React, { useState, useEffect, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import CallIcon from '@mui/icons-material/Call';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import SmsIcon from '@mui/icons-material/Sms';
import { apiService } from '../../services/apiService';

export default function BottomBarOtpSheet({
  isOpen,
  onClose,
  user,
  onLoginSuccess,
  onOpenContactModal
}) {
  const [renderSheet, setRenderSheet] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Form states: 'phone' | 'otp' | 'details' | 'success'
  const [step, setStep] = useState('phone');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [smsNotification, setSmsNotification] = useState(null);
  const [activeOtp, setActiveOtp] = useState('');
  const [verifiedToken, setVerifiedToken] = useState('');
  const [verifiedStudentId, setVerifiedStudentId] = useState('');

  const phoneInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Animate open/close
  useEffect(() => {
    if (isOpen) {
      setRenderSheet(true);
      setIsClosing(false);
      setStep('phone');
      setErrorMsg('');
      setOtpDigits(['', '', '', '', '', '']);
      // Keyboard will only open when user manually clicks/taps the input field
    } else if (renderSheet) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setRenderSheet(false);
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, user]);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!renderSheet) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 280);
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.sendOtp(cleanPhone);
      if (res.success) {
        setStep('otp');
        setResendTimer(45);
        setActiveOtp(res.demoOtp || '1234');
        setSmsNotification({
          otp: res.demoOtp || null,
          isRealSMS: res.isRealSMS || false,
          message: res.message || ''
        });

        setTimeout(() => {
          if (otpRefs[0].current) otpRefs[0].current.focus();
        }, 150);
      } else {
        setErrorMsg(res.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit inputs (6-digit support)
  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
    setErrorMsg('');

    // Jump to next box
    if (cleanVal && index < 5 && otpRefs[index + 1]?.current) {
      otpRefs[index + 1].current.focus();
    }

    // Auto verify if all 6 digits entered
    if (cleanVal && index === 5 && newDigits.every((d) => d !== '')) {
      handleVerifyOtp(newDigits.join(''));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs[index - 1]?.current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasteData) {
      const newDigits = ['', '', '', '', '', ''];
      for (let i = 0; i < pasteData.length; i++) {
        newDigits[i] = pasteData[i];
      }
      setOtpDigits(newDigits);
      if (pasteData.length === 6 || pasteData === '1234') {
        handleVerifyOtp(pasteData);
      } else if (otpRefs[pasteData.length]?.current) {
        otpRefs[pasteData.length].current.focus();
      }
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (customOtpString = null) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const entered = (customOtpString || otpDigits.join('')).replace(/[^0-9]/g, '');

    if (!entered || (entered.length < 4)) {
      setErrorMsg('Please enter the 6-digit OTP code received on your mobile');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await apiService.verifyOtp({
        phone: cleanPhone,
        otp: entered,
        name: ''
      });

      if (res.success && res.student) {
        setVerifiedToken(res.token || '');
        setVerifiedStudentId(res.student.id || res.student._id || '');

        const existingName = res.student.name && !res.student.name.startsWith('Student ') ? res.student.name : '';
        const existingEmail = res.student.email && !res.student.email.endsWith('@student.codeguru.in') ? res.student.email : '';
        setStudentName(existingName);
        setStudentEmail(existingEmail);

        // Smoothly transition to Step 3: Enter Name & Email!
        setStep('details');
        setErrorMsg('');
        setTimeout(() => {
          if (nameInputRef.current) {
            nameInputRef.current.focus();
          }
        }, 200);
      } else {
        setErrorMsg(res.message || 'Incorrect OTP code. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Verification failed. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save Name & Email Profile Details
  const handleSaveDetails = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!studentName.trim()) {
      setErrorMsg('Please enter your full name');
      if (nameInputRef.current) nameInputRef.current.focus();
      return;
    }

    if (!studentEmail.trim()) {
      setErrorMsg('Please enter your email address');
      if (emailInputRef.current) emailInputRef.current.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail.trim())) {
      setErrorMsg('Please enter a valid email address');
      if (emailInputRef.current) emailInputRef.current.focus();
      return;
    }

    setLoading(true);
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);

    try {
      const res = await apiService.updateStudentProfile({
        phone: cleanPhone,
        name: studentName.trim(),
        email: studentEmail.trim().toLowerCase()
      });

      if (res.success && res.student) {
        setStep('success');

        const userPayload = {
          name: res.student.name || studentName.trim(),
          email: res.student.email || studentEmail.trim(),
          phone: res.student.phone || cleanPhone,
          isLoggedIn: true,
          token: res.token || verifiedToken || `cg-student-jwt-${Date.now()}`,
          loginTime: new Date().toISOString()
        };

        // Persist to localStorage
        localStorage.setItem('codeguru_user', JSON.stringify(userPayload));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('codeguru_user_updated'));

        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(userPayload);
          handleClose();
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Failed to save profile. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('codeguru_user');
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
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* SMOOTH CARD MODAL / BOTTOM SHEET (EXACT 1-TO-1 MATCH TO REFERENCE IMAGE) */}
      <div 
        className={`relative z-10 w-full max-w-[420px] mx-auto rounded-t-[32px] sm:rounded-[34px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border-t sm:border border-slate-100/90 overflow-hidden transform transition-all duration-300 ease-out px-6 sm:px-8 pt-3.5 pb-7 sm:pb-8 ${
          isClosing ? 'translate-y-full sm:scale-95 opacity-0' : 'translate-y-0 sm:scale-100 opacity-100'
        }`}
        style={{
          background: 'radial-gradient(circle at 50% 12%, rgba(255, 190, 26, 0.16) 0%, rgba(255, 255, 255, 0) 65%), #ffffff'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP DRAG HANDLE */}
        <div className="pt-0.5 pb-2.5 flex justify-center cursor-pointer" onClick={handleClose}>
          <div className="w-12 h-1 bg-slate-300/80 rounded-full hover:bg-slate-400 transition-colors" />
        </div>

        {/* FLOATING DARK CIRCULAR CLOSE BUTTON */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#111827] hover:bg-black text-white flex items-center justify-center shadow-md transition-all active:scale-90 cursor-pointer"
          title="Close"
        >
          <CloseIcon className="!w-4 !h-4 text-white" />
        </button>

        {/* ---------------- ALREADY LOGGED IN VIEW ---------------- */}
        {user ? (
          <div className="flex flex-col gap-4 pt-2">
            <div className="w-16 h-16 rounded-2xl bg-[#ffbe1a] text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/25 mx-auto font-black text-2xl uppercase">
              {user.name ? user.name[0] : 'S'}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{user.name}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{user.email || user.phone}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold rounded-full">
                ● Active Student
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-2">
              <a
                href="/my-batch"
                className="flex items-center justify-center gap-2 py-3 px-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <SchoolIcon className="!w-4 !h-4 text-amber-400" />
                <span>My Batches</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  handleClose();
                  if (onOpenContactModal) onOpenContactModal();
                }}
                className="flex items-center justify-center gap-2 py-3 px-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                <CallIcon className="!w-4 !h-4 text-amber-600" />
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
          /* ---------------- STEP 1: WELCOME BACK (IDENTICAL TO SCREENSHOT) ---------------- */
          <form onSubmit={handleSendOtp} className="flex flex-col">
            
            {/* HERO PHONE ICON SQUIRCLE */}
            <div className="w-16 h-16 rounded-[22px] bg-[#ffbe1a] text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/30 mx-auto mt-1 mb-4">
              <svg 
                className="w-7 h-7 text-slate-950" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="5.5" y="2.5" width="13" height="19" rx="3.5" ry="3.5" />
                <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
              </svg>
            </div>

            {/* HEADLINE & SUBTITLE */}
            <div className="text-center mb-6">
              <h2 className="text-[25px] sm:text-[27px] font-black text-slate-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                Enter your WhatsApp number to continue
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* MOBILE NUMBER INPUT */}
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                MOBILE NUMBER
              </label>
              <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl px-4 py-3.5 flex items-center gap-3 focus-within:bg-white focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/20 transition-all">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 select-none shrink-0">
                  <span>IN</span>
                  <span>+91</span>
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
                  placeholder="5151222032"
                  className="w-full bg-transparent text-lg font-bold text-slate-900 placeholder-slate-300 outline-none tracking-wide"
                />
              </div>
            </div>

            {/* GET OTP BUTTON */}
            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className={`w-full py-4 px-4 rounded-2xl text-base font-black text-slate-950 flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 transition-all cursor-pointer ${
                loading || phone.length < 10
                  ? 'bg-amber-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-[#ffbe1a] hover:bg-[#f5b40f] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <span>Get OTP</span>
                  <ArrowForwardIcon className="!w-4 !h-4" />
                </>
              )}
            </button>

            {/* TERMS & PRIVACY */}
            <p className="text-[11px] sm:text-xs text-slate-400 text-center font-medium mt-4 sm:mt-5 leading-relaxed">
              By continuing, you agree to our Terms of Service & Privacy Policy
            </p>
          </form>

        ) : step === 'otp' ? (
          /* ---------------- STEP 2: VERIFY OTP ---------------- */
          <div className="flex flex-col">
            
            {/* HERO OTP ICON */}
            <div className="w-16 h-16 rounded-[22px] bg-[#ffbe1a] text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/30 mx-auto mt-1 mb-4">
              <svg 
                className="w-7 h-7 text-slate-950" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            {/* HEADLINE & SUBTITLE */}
            <div className="text-center mb-5">
              <h2 className="text-[25px] sm:text-[27px] font-black text-slate-900 tracking-tight">
                Verify OTP
              </h2>
              <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                <span>Code sent to</span>
                <span className="font-bold text-slate-800">+91 {phone}</span>
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setErrorMsg(''); }}
                  className="text-amber-600 hover:text-amber-700 font-extrabold underline cursor-pointer ml-1"
                >
                  Edit
                </button>
              </div>
            </div>

            {smsNotification?.otp && (
              <div className="mb-4 p-3 sm:p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border border-amber-300 rounded-2xl flex items-center justify-between gap-3 animate-fadeIn shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                      <span>Trial OTP:</span>
                      <span className="font-mono text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded-md font-extrabold tracking-widest">{smsNotification.otp}</span>
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 truncate">
                      SMS Trial mode active • Tap to auto-fill
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const otpStr = smsNotification.otp.toString();
                    const digits = otpStr.split('');
                    const padded = [...digits, ...Array(Math.max(0, 6 - digits.length)).fill('')];
                    setOtpDigits(padded);
                    handleVerifyOtp(otpStr);
                  }}
                  className="px-3 py-1.5 bg-[#ffbe1a] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  Auto Fill
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 6 DIGIT OTP BOXES */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-2 mb-5" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpRefs[idx]}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className={`w-11 h-12 sm:w-12 sm:h-14 aspect-square shrink-0 text-center text-xl sm:text-2xl font-black rounded-2xl border-2 transition-all outline-none shadow-sm flex items-center justify-center ${
                    digit
                      ? 'border-[#ffbe1a] bg-amber-50/50 text-slate-900 ring-2 ring-amber-400/20'
                      : 'border-slate-200 bg-[#f8fafc] text-slate-900 focus:border-[#ffbe1a] focus:bg-white focus:ring-4 focus:ring-amber-400/20'
                  }`}
                />
              ))}
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="button"
              onClick={() => handleVerifyOtp()}
              disabled={loading || otpDigits.filter(Boolean).length < 4}
              className={`w-full py-4 px-4 rounded-2xl text-base font-black text-slate-950 flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 transition-all cursor-pointer ${
                loading || otpDigits.filter(Boolean).length < 4
                  ? 'bg-amber-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-[#ffbe1a] hover:bg-[#f5b40f] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify Code</span>
                  <ArrowForwardIcon className="!w-4 !h-4" />
                </>
              )}
            </button>

            {/* RESEND OTP */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-4 px-1">
              <span>Didn't receive code?</span>
              {resendTimer > 0 ? (
                <span className="text-slate-400 font-semibold">Resend in {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-amber-600 hover:underline inline-flex items-center gap-1 font-extrabold cursor-pointer"
                >
                  <RefreshIcon className="!w-3.5 !h-3.5" />
                  <span>Resend OTP</span>
                </button>
              )}
            </div>
          </div>

        ) : step === 'details' ? (
          /* ---------------- STEP 3: COMPLETE YOUR PROFILE (NAME & EMAIL) ---------------- */
          <form onSubmit={handleSaveDetails} className="flex flex-col animate-fadeIn">
            
            {/* HERO PROFILE ICON */}
            <div className="w-16 h-16 rounded-[22px] bg-[#ffbe1a] text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/30 mx-auto mt-1 mb-4">
              <svg 
                className="w-7 h-7 text-slate-950" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            {/* HEADLINE & SUBTITLE */}
            <div className="text-center mb-5">
              <h2 className="text-[25px] sm:text-[27px] font-black text-slate-900 tracking-tight">
                Complete Your Profile
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                Enter your name & email to finish setup
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* FULL NAME INPUT */}
            <div className="flex flex-col gap-1.5 mb-3.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                FULL NAME
              </label>
              <div className="bg-[#f8fafc] border border-slate-200/90 rounded-2xl px-4 py-3.5 flex items-center gap-3 focus-within:bg-white focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/20 transition-all">
                <PersonIcon className="!w-5 !h-5 text-slate-400" />
                <input
                  ref={nameInputRef}
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-transparent text-sm font-bold text-slate-900 placeholder-slate-400 outline-none"
                />
              </div>
            </div>

            {/* EMAIL ADDRESS INPUT */}
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                EMAIL ADDRESS
              </label>
              <div className="bg-[#f8fafc] border border-slate-200/90 rounded-2xl px-4 py-3.5 flex items-center gap-3 focus-within:bg-white focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/20 transition-all">
                <EmailIcon className="!w-5 !h-5 text-slate-400" />
                <input
                  ref={emailInputRef}
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => {
                    setStudentEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="e.g. rahul@gmail.com"
                  className="w-full bg-transparent text-sm font-bold text-slate-900 placeholder-slate-400 outline-none"
                />
              </div>
            </div>

            {/* COMPLETE LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading || !studentName.trim() || !studentEmail.trim()}
              className={`w-full py-4 px-4 rounded-2xl text-base font-black text-slate-950 flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 transition-all cursor-pointer ${
                loading || !studentName.trim() || !studentEmail.trim()
                  ? 'bg-amber-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-[#ffbe1a] hover:bg-[#f5b40f] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <span>Complete Login</span>
                  <ArrowForwardIcon className="!w-4 !h-4" />
                </>
              )}
            </button>
          </form>

        ) : (
          /* ---------------- STEP 4: SUCCESS & LOGGED IN ---------------- */
          <div className="py-6 text-center flex flex-col items-center gap-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce shadow-md">
              <CheckCircleIcon className="!w-10 !h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Welcome, {studentName || 'Student'}!
            </h3>
            <p className="text-xs text-slate-500 font-semibold max-w-xs">
              Your account has been verified. You are now logged in!
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
