import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { apiService } from '../../services/apiService';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMode(initialMode);
    setIsSubmitted(false);
    setLoading(false);
    setServerError('');
    setErrors({});
    setFormData({ name: '', email: '', password: '' });
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setServerError('');
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (mode === 'register' && !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await apiService.registerStudent({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        });

        if (!res.success) {
          setServerError(res.message || 'Registration failed');
          setLoading(false);
          return;
        }

        const userPayload = {
          name: res.user?.name || formData.name,
          email: res.user?.email || formData.email,
          isLoggedIn: true,
          token: res.token,
          loginTime: new Date().toISOString()
        };

        localStorage.setItem('codeguru_user', JSON.stringify(userPayload));

        // Submit lead notification
        try {
          const newLead = {
            id: `LEAD-${Date.now().toString().slice(-4)}`,
            name: formData.name.trim(),
            phone: formData.email,
            course: 'Full Stack Web Development (New Registered Student)',
            status: 'New',
            createdAt: new Date().toISOString(),
            notes: `New Student Registered (${formData.email})`
          };
          apiService.submitLead(newLead);
          const existingRaw = localStorage.getItem('codeguru_leads');
          const existingLeads = existingRaw ? JSON.parse(existingRaw) : [];
          localStorage.setItem('codeguru_leads', JSON.stringify([newLead, ...existingLeads]));
          window.dispatchEvent(new CustomEvent('codeguru_lead_added', { detail: newLead }));
        } catch (err) {}

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('codeguru_user_updated'));

        setIsSubmitted(true);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(userPayload);
          onClose();
        }, 1200);

      } else {
        // LOGIN MODE
        const res = await apiService.loginStudent({
          email: formData.email.trim(),
          password: formData.password
        });

        if (!res.success) {
          setServerError(res.message || 'Invalid email or password');
          setLoading(false);
          return;
        }

        const userPayload = {
          name: res.user?.name || formData.email.split('@')[0],
          email: res.user?.email || formData.email,
          isLoggedIn: true,
          token: res.token,
          loginTime: new Date().toISOString()
        };

        localStorage.setItem('codeguru_user', JSON.stringify(userPayload));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('codeguru_user_updated'));

        setIsSubmitted(true);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(userPayload);
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setServerError('Server error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xxs:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      
      {/* MODAL CARD */}
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl xxs:rounded-[36px] shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* TOP BRAND HEADER (COMPACT WHITE THEME) */}
        <div className="bg-white text-slate-900 p-3.5 xxs:p-4 pb-2 text-center relative border-b border-slate-100">

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
            title="Close"
          >
            <CloseIcon className="!w-4 !h-4" />
          </button>

          {/* CODEGURU LOGO ICON */}
          <div className="w-8 h-8 mx-auto mb-1 rounded-[50%] bg-white border border-slate-200/80 p-0.5 shadow-2xs flex items-center justify-center">
            <img src="/logo.png" alt="CodeGuru" className="w-full h-full object-contain rounded-[50%]" />
          </div>

          <h2 className="text-base xxs:text-lg font-black font-heading tracking-tight text-slate-900 leading-tight">
            {mode === 'login' ? 'Welcome Back!' : 'Join CodeGuru'}
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            {mode === 'login' 
              ? 'Sign in to access your course dashboard' 
              : 'Create an account to start learning today'}
          </p>

          {/* TAB TOGGLE SWITCH */}
          <div className="mt-2.5 inline-flex p-0.5 bg-slate-100 rounded-full border border-slate-200/80 text-[11px] font-bold w-full max-w-[210px]">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrors({}); }}
              className={`flex-1 py-1 rounded-full transition-all cursor-pointer font-extrabold ${
                mode === 'login' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrors({}); }}
              className={`flex-1 py-1 rounded-full transition-all cursor-pointer font-extrabold ${
                mode === 'register' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 xxs:p-5">

          {isSubmitted ? (
            /* SUCCESS STATE */
            <div className="py-6 text-center flex flex-col items-center gap-2 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircleIcon className="!w-8 !h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900 font-heading">
                {mode === 'login' ? 'Logged In Successfully!' : 'Account Created Successfully!'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Welcome to CodeGuru. Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5" noValidate>
              
              {serverError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2 rounded-xl text-xs font-bold animate-fadeIn flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* 1. NAME FIELD (REGISTER MODE ONLY) */}
              {mode === 'register' && (
                <div className="flex flex-col gap-0.5">
                  <label className="text-[11px] font-extrabold text-slate-700 font-heading ml-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <PersonOutlinedIcon className="absolute left-3.5 !w-4 !h-4 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 py-2 bg-slate-50 border ${
                        errors.name ? 'border-rose-500 focus:ring-rose-200' : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-100'
                      } rounded-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`}
                    />
                  </div>
                  {errors.name && (
                    <span className="text-[10px] font-bold text-rose-500 ml-3">{errors.name}</span>
                  )}
                </div>
              )}

              {/* 2. EMAIL FIELD */}
              <div className="flex flex-col gap-0.5">
                <label className="text-[11px] font-extrabold text-slate-700 font-heading ml-2">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <MailOutlinedIcon className="absolute left-3.5 !w-4 !h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-4 py-2 bg-slate-50 border ${
                      errors.email ? 'border-rose-500 focus:ring-rose-200' : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-100'
                    } rounded-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`}
                  />
                </div>
                {errors.email && (
                  <span className="text-[10px] font-bold text-rose-500 ml-3">{errors.email}</span>
                )}
              </div>

              {/* 3. PASSWORD FIELD */}
              <div className="flex flex-col gap-0.5">
                <label className="text-[11px] font-extrabold text-slate-700 font-heading ml-2">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <LockOutlinedIcon className="absolute left-3.5 !w-4 !h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2 bg-slate-50 border ${
                      errors.password ? 'border-rose-500 focus:ring-rose-200' : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-100'
                    } rounded-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon className="!w-4 !h-4" />
                    ) : (
                      <VisibilityOutlinedIcon className="!w-4 !h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-[10px] font-bold text-rose-500 ml-3">{errors.password}</span>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs shadow-xs shadow-orange-500/20 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer font-heading disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{mode === 'login' ? 'Signing In...' : 'Saving Account...'}</span>
                  </>
                ) : (
                  <span>{mode === 'login' ? 'Login Now' : 'Create Account & Register'}</span>
                )}
              </button>

              {/* FOOTER SWITCH LINK */}
              <div className="mt-0.5 text-center text-[11px] text-slate-500">
                {mode === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('register'); setErrors({}); }}
                      className="font-bold text-amber-600 hover:underline cursor-pointer"
                    >
                      Register here
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setErrors({}); }}
                      className="font-bold text-amber-600 hover:underline cursor-pointer"
                    >
                      Login here
                    </button>
                  </p>
                )}
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
