import React, { useState } from 'react';
import ShieldIcon from '@mui/icons-material/Shield';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../context/AuthContext';

export default function LoginView() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@codeguru.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both Email and Password.');
      return;
    }

    setIsSubmitting(true);
    setIsSuccessModalOpen(true);

    setTimeout(async () => {
      const res = await login(email, password);
      if (!res.success) {
        setIsSuccessModalOpen(false);
        setIsSubmitting(false);
        setError(res.message);
      }
    }, 1400);
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative z-10 animate-fade-in flex flex-col gap-6">
        
        {/* BRAND LOGO HEADER */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-3 bg-white border border-slate-200/80 px-4 py-2 rounded-2xl shadow-md">
            <img src="/logo.png" alt="CodeGuru Icon" className="w-10 h-10 object-contain rounded-full" />
            <img src="/brand-text-logo.png" alt="CODE GURRU" className="h-7 w-auto object-contain" />
          </div>
          <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mt-1">
            Admin Portal Management
          </span>
          <p className="text-xs font-semibold text-slate-500 max-w-xs">
            Sign in to manage contact leads, student inquiries, and course analytics.
          </p>
        </div>

        {/* ERROR NOTIFICATION */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-xs font-bold animate-pulse">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* EMAIL FIELD */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-slate-700">Admin Email / Username</label>
            <div className="relative">
              <EmailIcon className="!w-4 !h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@codeguru.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs font-semibold text-slate-900 outline-none transition-all"
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-slate-700">Password</label>
            <div className="relative">
              <LockIcon className="!w-4 !h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs font-semibold text-slate-900 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <VisibilityOffIcon className="!w-4 !h-4" /> : <VisibilityIcon className="!w-4 !h-4" />}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer mt-1 disabled:opacity-70"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

      </div>

      {/* LAPTOP CENTER SCREEN CONFIRMATION POPUP MODAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 select-none animate-backdrop-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-2xl flex flex-col items-center text-center gap-4 animate-modal-slide-up relative overflow-hidden">
            
            {/* Ambient emerald radial glow */}
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
            
            {/* ANIMATED ICON BADGE */}
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg relative">
              <CheckCircleIcon className="!w-12 !h-12 text-emerald-500 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-25" />
            </div>

            {/* CONFIRMATION TEXTS */}
            <div className="flex flex-col gap-1 z-10">
              <h3 className="text-xl font-black text-slate-900 font-heading tracking-tight">
                Login Successful!
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-center">
                ● Authentication Confirmed
              </span>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Welcome back, <strong>Super Admin</strong>! Opening CodeGuru Dashboard...
              </p>
            </div>

            {/* PROGRESS BAR LOADER */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1 border border-slate-200/80">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-progress-fill w-full transition-all duration-1000" />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

