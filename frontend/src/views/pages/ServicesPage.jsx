'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  ArrowLeft,
  Rocket,
  Bell,
  CheckCircle2,
  PhoneCall,
  Briefcase,
  GraduationCap,
  Cloud,
  Code2
} from 'lucide-react';

export default function ServicesPage({ onOpenContactModal }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotify = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3500);
    }
  };

  const upcomingServices = [
    {
      icon: Briefcase,
      title: 'Corporate Training',
      desc: 'Tailored technology upskilling programs for enterprise teams.'
    },
    {
      icon: Code2,
      title: 'Custom Software Development',
      desc: 'Full-stack bespoke web and mobile applications for modern business.'
    },
    {
      icon: GraduationCap,
      title: 'Campus Hiring Drives',
      desc: 'Connecting top colleges with leading IT hiring companies.'
    },
    {
      icon: Cloud,
      title: 'Cloud & DevOps Solutions',
      desc: 'Architecture migration, Docker, Kubernetes & CI/CD deployment.'
    }
  ];

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-10 sm:py-16 bg-gradient-to-b from-slate-50 via-white to-orange-50/40 relative overflow-hidden">
      
      {/* BACKGROUND AMBIENT GLOWS */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-orange-400/15 via-amber-300/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-2xl mx-auto text-center flex flex-col items-center">
        
        {/* ANIMATED ICON BADGE */}
        <div className="relative mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-xl shadow-orange-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Layers className="w-10 h-10 sm:w-12 sm:h-12 text-orange-400 stroke-[2.2]" />
            </div>
          </div>
          <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-1.5 rounded-full shadow-md animate-bounce">
            <Sparkles className="w-4 h-4 fill-white stroke-none" />
          </div>
        </div>

        {/* PILL STATUS */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 border border-orange-200/90 text-orange-700 text-[11px] sm:text-xs font-black tracking-wide uppercase mb-4 shadow-2xs">
          <Rocket className="w-3.5 h-3.5 text-orange-600" />
          <span>Services Portal Under Development</span>
        </div>

        {/* PRIMARY HEADING */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
          Coming Soon
        </h1>

        {/* SUBTITLE */}
        <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed mb-8 font-medium">
          We are crafting premium <strong className="text-slate-900 font-extrabold">Corporate Training</strong> &{' '}
          <strong className="text-slate-900 font-extrabold">IT Consultancy Services</strong> to accelerate business and student growth.
        </p>

        {/* UPCOMING SERVICES GRID TEASER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8 text-left">
          {upcomingServices.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                      {srv.title}
                    </h3>
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.2 rounded-md">
                      Soon
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-snug line-clamp-2">
                    {srv.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* NOTIFY ME EMAIL FORM */}
        <form onSubmit={handleNotify} className="w-full max-w-md mb-8">
          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs sm:text-sm font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Thank you! We'll notify you as soon as services go live.</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email to get notified"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none rounded-xl sm:rounded-full px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl sm:rounded-full shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Bell className="w-4 h-4" />
                <span>Notify Me</span>
              </button>
            </div>
          )}
        </form>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-extrabold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <span>Explore Courses</span>
          </Link>

          {onOpenContactModal && (
            <button
              type="button"
              onClick={onOpenContactModal}
              className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold shadow-sm shadow-blue-500/20 transition-transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Contact Us</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
