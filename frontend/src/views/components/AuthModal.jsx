'use client';

import React, { useState, useEffect, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { apiService } from '../../services/apiService';
import { getQuickLocationSync } from '../../utils/geoLocator';

export default function AuthModal({ isOpen, onClose, initialMode = 'otp', onAuthSuccess }) {
  // Step in OTP flow: 'phone' | 'verify' | 'profile'
  const [authMethod, setAuthMethod] = useState('otp'); // 'otp' | 'password'
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Email / Password mode states
  const [pwMode, setPwMode] = useState('login'); // 'login' | 'register'
  const [pwEmail, setPwEmail] = useState('');
  const [pwPassword, setPwPassword] = useState('');
  const [pwName, setPwName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Common states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const otpInputsRef = useRef([]);

  // Reset modal state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setUserName('');
      setUserEmail('');
      setErrorMessage('');
      setSuccessMessage('');
      setIsSuccess(false);
      setLoading(false);
      setTimer(30);
      setCanResend(false);
      setAuthMethod('otp');
    }
  }, [isOpen]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval = null;
    if (step === 'verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  // Handle Phone Input Change (numeric only, max 10 digits)
  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    setErrorMessage('');
  };

  // Direct Lead Submission without OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const leadPayload = {
        name: 'Student Applicant',
        phone: phone,
        email: '',
        location: 'Online Visitor',
        course: 'Admission & Training Inquiry',
        notes: 'Submitted via Login / WhatsApp Modal (Direct Lead)',
        status: 'New'
      };

      await apiService.submitLead(leadPayload);

      const userPayload = {
        name: 'Student Applicant',
        phone: phone,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('codeguru_user', JSON.stringify(userPayload));
      localStorage.setItem('codeguru_lead_submitted', phone);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('codeguru_user_updated'));

      setSuccess(true);
      setSuccessMessage('Inquiry Submitted! Our counselor will connect with you shortly.');

      if (onAuthSuccess) {
        onAuthSuccess(userPayload);
      }

      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err) {
      setErrorMessage('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Box handling
  const handleOtpDigitChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);
    setErrorMessage('');

    // Auto-focus next input
    if (cleanVal && index < 5 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1].focus();
    }

    // Auto-submit if all 6 digits entered
    if (cleanVal && index === 5 && newOtp.every((d) => d !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpInputsRef.current[index - 1]) {
      otpInputsRef.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      if (pasted.length === 6) {
        handleVerifyOtp(pasted);
      }
    }
  };

  // VERIFY OTP HANDLER
  const handleVerifyOtp = async (codeToVerify) => {
    const enteredCode = typeof codeToVerify === 'string' ? codeToVerify : otp.join('');
    if (enteredCode.length < 4) {
      setErrorMessage('Please enter the complete verification code');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    const studentLoc = getQuickLocationSync() || 'Ayodhya, UP';

    try {
      const res = await apiService.verifyOtp({
        phone,
        otp: enteredCode,
        name: userName || `Student ${phone.slice(-4)}`,
        location: studentLoc
      });

      if (res && res.success !== false) {
        const userPayload = {
          name: res.user?.name || `Student +91 ${phone}`,
          phone: phone,
          email: res.user?.email || `${phone}@student.codeguru.in`,
          isLoggedIn: true,
          token: res.token || `token-${Date.now()}`,
          loginTime: new Date().toISOString()
        };

        // Lead capture sync
        try {
          const newLead = {
            id: `LEAD-${Date.now().toString().slice(-4)}`,
            name: userPayload.name,
            phone: phone,
            email: userPayload.email,
            location: studentLoc,
            course: 'Full Stack Web Development (WhatsApp OTP Login)',
            status: 'New',
            createdAt: new Date().toISOString(),
            notes: `Verified via WhatsApp OTP (${phone}, Location: ${studentLoc})`
          };
          apiService.submitLead(newLead);
          const existingRaw = localStorage.getItem('codeguru_leads');
          const existingLeads = existingRaw ? JSON.parse(existingRaw) : [];
          localStorage.setItem('codeguru_leads', JSON.stringify([newLead, ...existingLeads]));
          window.dispatchEvent(new CustomEvent('codeguru_lead_added', { detail: newLead }));
        } catch (err) {}

        localStorage.setItem('codeguru_user', JSON.stringify(userPayload));
        if (userPayload.token) {
          localStorage.setItem('codeguru_token', userPayload.token);
          localStorage.setItem('token', userPayload.token);
        }
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('codeguru_user_updated'));

        setIsSuccess(true);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(userPayload);
          onClose();
        }, 1200);
      } else {
        setErrorMessage(res?.message || 'Invalid or expired OTP. Please try again.');
      }
    } catch (err) {
      // Demo / offline fallback
      const userPayload = {
        name: `Student +91 ${phone}`,
        phone: phone,
        email: `${phone}@student.codeguru.in`,
        isLoggedIn: true,
        token: `token-${Date.now()}`,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('codeguru_user', JSON.stringify(userPayload));
      localStorage.setItem('codeguru_token', userPayload.token);
      localStorage.setItem('token', userPayload.token);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('codeguru_user_updated'));

      setIsSuccess(true);
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(userPayload);
        onClose();
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  // EMAIL / PASSWORD LOGIN & REGISTER HANDLER
  const handlePasswordAuth = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (pwMode === 'register' && !pwName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!pwEmail.trim() || !/\S+@\S+\.\S+/.test(pwEmail)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!pwPassword || pwPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (pwMode === 'register') {
        const res = await apiService.registerStudent({
          name: pwName.trim(),
          email: pwEmail.trim(),
          password: pwPassword
        });
        if (!res.success) {
          setErrorMessage(res.message || 'Registration failed');
          setLoading(false);
          return;
        }
        const userPayload = {
          name: res.user?.name || pwName,
          email: res.user?.email || pwEmail,
          isLoggedIn: true,
          token: res.token,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('codeguru_user', JSON.stringify(userPayload));
        if (userPayload.token) {
          localStorage.setItem('codeguru_token', userPayload.token);
          localStorage.setItem('token', userPayload.token);
        }
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('codeguru_user_updated'));
        setIsSuccess(true);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(userPayload);
          onClose();
        }, 1200);
      } else {
        const res = await apiService.loginStudent({
          email: pwEmail.trim(),
          password: pwPassword
        });
        if (!res.success) {
          setErrorMessage(res.message || 'Invalid email or password');
          setLoading(false);
          return;
        }
        const userPayload = {
          name: res.user?.name || pwEmail.split('@')[0],
          email: res.user?.email || pwEmail,
          isLoggedIn: true,
          token: res.token,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('codeguru_user', JSON.stringify(userPayload));
        if (userPayload.token) {
          localStorage.setItem('codeguru_token', userPayload.token);
          localStorage.setItem('token', userPayload.token);
        }
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('codeguru_user_updated'));
        setIsSuccess(true);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(userPayload);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setErrorMessage('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-fadeIn"
      onClick={onClose}
    >
      {/* ============================================================== */}
      {/* SECTION 1: BADHA CARD (BACKGROUND ELEVATED CARD / FRAME)        */}
      {/* ============================================================== */}
      <div
        className="relative w-full max-w-[440px] rounded-[36px] sm:rounded-[40px] p-2.5 sm:p-3.5 bg-gradient-to-b from-slate-100/95 via-slate-200/90 to-slate-300/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.4)] backdrop-blur-xl border border-white/50 transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP SHEET PULL BAR ON BADHA CARD */}
        <div className="w-12 h-1.5 bg-slate-400/50 rounded-full mx-auto mt-0.5 mb-2.5" />

        {/* ============================================================== */}
        {/* SECTION 2: CHHOTA CARD (INNER WHITE CARD WITH FULL OTP SYSTEM)  */}
        {/* ============================================================== */}
        <div
          className="relative w-full bg-white rounded-[28px] sm:rounded-[30px] shadow-[0_12px_36px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden border border-slate-100/80 p-6 sm:p-7 flex flex-col"
          style={{
            background: 'radial-gradient(circle at 50% 10%, rgba(249, 115, 22, 0.08) 0%, rgba(255, 255, 255, 0) 65%), #ffffff'
          }}
        >
          {/* FLOATING LIGHT CIRCULAR CLOSE (X) BUTTON */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            title="Close modal"
          >
            <CloseIcon className="!w-4 !h-4 text-slate-700" />
          </button>

        {/* MAIN INNER CONTENT CONTAINER */}
        <div className="relative z-10 w-full flex flex-col items-center">

          {/* SUCCESS VIEW */}
          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center gap-3 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-md animate-bounce">
                <CheckCircleRoundedIcon className="!w-10 !h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Welcome to CodeGurru!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Your phone has been verified. Taking you to your dashboard...
              </p>
            </div>
          ) : authMethod === 'otp' ? (
            /* ============================================================ */
            /* OTP FLOW: PHONE INPUT / VERIFY OTP                          */
            /* ============================================================ */
            <>
              {/* SOCIAL PROOF AVATAR CLUSTER */}
              <div className="flex items-center justify-center -space-x-2 pt-1 mb-2 select-none">
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f97316] text-white font-extrabold text-sm flex items-center justify-center ring-2 ring-white shadow-xs">
                  R
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#8b5cf6] text-white font-extrabold text-sm flex items-center justify-center ring-2 ring-white shadow-xs">
                  A
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0ea5e9] text-white font-extrabold text-sm flex items-center justify-center ring-2 ring-white shadow-xs">
                  S
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#10b981] text-white font-extrabold text-sm flex items-center justify-center ring-2 ring-white shadow-xs">
                  P
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0f172a] text-white font-black text-[11px] sm:text-xs flex items-center justify-center ring-2 ring-white shadow-xs">
                  5k+
                </span>
              </div>

              {/* SOCIAL PROOF SUB-BANNER */}
              <p className="text-center text-xs sm:text-[13px] text-slate-600 font-medium mb-4 select-none">
                Join <strong className="text-orange-500 font-black">5000+</strong> students learning with us
              </p>

              {/* HEADING & SUBTITLE */}
              <h2 className="text-2xl sm:text-[27px] font-black tracking-tight text-slate-900 text-center mb-1 font-heading">
                {step === 'phone' ? 'Welcome Back' : 'Verify Code'}
              </h2>
              <p className="text-xs sm:text-[13.5px] text-slate-500 text-center mb-5 font-medium">
                {step === 'phone' ? (
                  'Enter your WhatsApp number to continue'
                ) : (
                  <span className="flex items-center justify-center gap-1.5 flex-wrap">
                    <span>Code sent to</span>
                    <strong className="text-slate-800 font-bold">+91 {phone}</strong>
                    <button
                      type="button"
                      onClick={() => { setStep('phone'); setErrorMessage(''); }}
                      className="text-orange-600 hover:text-orange-700 font-bold inline-flex items-center gap-0.5 ml-1 text-xs underline cursor-pointer"
                    >
                      <EditRoundedIcon className="!w-3 !h-3" /> Edit
                    </button>
                  </span>
                )}
              </p>

              {/* ERROR ALERT */}
              {errorMessage && (
                <div className="w-full mb-4 px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* SUCCESS ALERT (E.G. OTP SENT) */}
              {successMessage && !errorMessage && (
                <div className="w-full mb-4 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* STEP 1: PHONE NUMBER FORM */}
              {step === 'phone' && (
                <form onSubmit={handleSendOtp} className="w-full flex flex-col">
                  {/* INPUT FIELD CONTAINER */}
                  <div className="relative flex items-center bg-white hover:border-slate-300 focus-within:border-orange-500 rounded-2xl border border-slate-200/90 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all px-4 py-3 sm:py-3.5 mb-4 shadow-xs">
                    {/* COUNTRY CODE PILL */}
                    <div className="flex items-center gap-1.5 text-slate-900 font-black text-sm select-none shrink-0">
                      <span className="font-extrabold text-slate-900">IN</span>
                      <span className="font-extrabold text-slate-900">+91</span>
                    </div>
                    <div className="h-5 w-[1px] bg-slate-200 mx-3 shrink-0" />
                    {/* PHONE NUMBER INPUT */}
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="98765 43210"
                      maxLength={10}
                      autoFocus
                      className="w-full bg-transparent text-base sm:text-lg font-bold text-slate-900 tracking-wider placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
                    />
                    {phone && (
                      <button
                        type="button"
                        onClick={() => { setPhone(''); setErrorMessage(''); }}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                        title="Clear number"
                      >
                        <CloseIcon className="!w-4 !h-4" />
                      </button>
                    )}
                  </div>

                  {/* SUBMIT ACTION BUTTON */}
                  <button
                    type="submit"
                    disabled={loading || phone.length !== 10}
                    className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-black text-base sm:text-[17px] tracking-wide shadow-[0_8px_20px_rgba(249,115,22,0.28)] hover:shadow-[0_10px_24px_rgba(249,115,22,0.38)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit</span>
                        <ArrowForwardRoundedIcon className="!w-5 !h-5" />
                      </>
                    )}
                  </button>

                  {/* TERMS & PRIVACY */}
                  <p className="text-[11px] sm:text-xs text-slate-400 text-center font-medium mt-4 sm:mt-5 leading-relaxed select-none">
                    By continuing, you agree to our Terms &amp; Privacy Policy
                  </p>
                </form>
              )}

                {/* STEP 2: VERIFY OTP FORM */}
                {step === 'verify' && (
                  <div className="w-full flex flex-col gap-4 animate-fadeIn">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 text-left pl-1">
                      ENTER 6-DIGIT OTP
                    </label>

                    {/* OTP 6-BOX GRID */}
                    <div className="flex items-center justify-between gap-1.5 sm:gap-2" onPaste={handleOtpPaste}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputsRef.current[idx] = el)}
                          type="tel"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black text-slate-900 bg-[#f8fafc] hover:bg-slate-100 focus:bg-white rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 outline-none transition-all shadow-xs"
                        />
                      ))}
                    </div>

                    {/* VERIFY BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleVerifyOtp()}
                      disabled={loading || otp.join('').length < 4}
                      className="w-full mt-2 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ffb422] to-[#f97316] hover:from-[#f59e0b] hover:to-[#ea580c] active:scale-[0.99] text-white font-black text-sm sm:text-base tracking-wide shadow-[0_8px_20px_rgba(249,115,22,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify &amp; Continue</span>
                          <ArrowForwardRoundedIcon className="!w-5 !h-5" />
                        </>
                      )}
                    </button>

                    {/* RESEND TIMER ROW */}
                    <div className="flex items-center justify-between text-xs text-slate-500 px-1 mt-1">
                      <span>Didn't receive code?</span>
                      {canResend ? (
                        <button
                          type="button"
                          onClick={() => handleSendOtp()}
                          className="text-amber-600 hover:text-amber-700 font-extrabold underline cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <span className="font-bold text-slate-400">
                          Resend in <span className="text-amber-600">{timer}s</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* BOTTOM SWITCH LINK: EMAIL / PASSWORD */}
                <div className="w-full pt-4 mt-3 border-t border-slate-100 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('password'); setErrorMessage(''); }}
                    className="text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <MailOutlineRoundedIcon className="!w-4 !h-4" />
                    <span>Or sign in with Email &amp; Password</span>
                  </button>
                </div>
              </>
            ) : (
              /* ============================================================ */
              /* EMAIL / PASSWORD FORM ALTERNATIVE                           */
              /* ============================================================ */
              <div className="w-full flex flex-col items-center animate-fadeIn">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ffb422] to-[#f97316] flex items-center justify-center shadow-md mb-3">
                  <LockOutlinedIcon className="!w-7 !h-7 text-white" />
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-1 font-heading">
                  {pwMode === 'login' ? 'Email Login' : 'Create Account'}
                </h2>
                <p className="text-xs text-slate-500 mb-5 font-medium">
                  {pwMode === 'login' ? 'Enter your credentials to continue' : 'Sign up to begin your learning journey'}
                </p>

                {errorMessage && (
                  <div className="w-full mb-3 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordAuth} className="w-full flex flex-col gap-3">
                  {pwMode === 'register' && (
                    <div className="relative">
                      <PersonOutlineRoundedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 !w-4 !h-4 text-slate-400" />
                      <input
                        type="text"
                        value={pwName}
                        onChange={(e) => setPwName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <MailOutlineRoundedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 !w-4 !h-4 text-slate-400" />
                    <input
                      type="email"
                      value={pwEmail}
                      onChange={(e) => setPwEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>

                  <div className="relative">
                    <LockOutlinedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 !w-4 !h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={pwPassword}
                      onChange={(e) => setPwPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <VisibilityOffOutlinedIcon className="!w-4 !h-4" /> : <VisibilityOutlinedIcon className="!w-4 !h-4" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ffb422] to-[#f97316] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Loading...</span>
                    ) : (
                      <span>{pwMode === 'login' ? 'Login with Email' : 'Register with Email'}</span>
                    )}
                  </button>
                </form>

                {/* TOGGLE REGISTER / LOGIN & BACK TO OTP */}
                <div className="flex flex-col gap-2 mt-4 text-center text-xs text-slate-500 w-full">
                  <div>
                    {pwMode === 'login' ? (
                      <>
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setPwMode('register')}
                          className="text-amber-600 font-bold hover:underline cursor-pointer"
                        >
                          Register
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setPwMode('login')}
                          className="text-amber-600 font-bold hover:underline cursor-pointer"
                        >
                          Login
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => { setAuthMethod('otp'); setErrorMessage(''); }}
                    className="text-amber-600 font-bold hover:underline cursor-pointer pt-2 border-t border-slate-100"
                  >
                    ← Back to WhatsApp OTP Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
