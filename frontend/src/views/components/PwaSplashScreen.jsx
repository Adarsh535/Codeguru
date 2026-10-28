'use client';

import React, { useState, useEffect } from 'react';

/**
 * ============================================================================
 * PWA SPLASH SCREEN (PwaSplashScreen.jsx)
 * ============================================================================
 * Cinematic Mobile App Splash Screen matching CodeGurru's brand identity.
 * Shows high-resolution Guru emblem with glowing circuit aesthetics, bold
 * "CODE GURRU" typography, and a smooth fade-out exit transition into the website.
 */
export default function PwaSplashScreen() {
  const [showSplash, setShowSplash] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if launched as installed PWA standalone app OR first mobile visit in session
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const hasSeenSplash = sessionStorage.getItem('cg_splash_seen');
    const forceSplash = window.location.search.includes('splash=1');

    if (forceSplash || isStandalone || (isMobile && !hasSeenSplash)) {
      setShowSplash(true);
      try {
        sessionStorage.setItem('cg_splash_seen', '1');
      } catch (e) {}

      // Start fade out transition after 1.8 seconds
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 1800);

      // Completely remove from DOM after 700ms fade transition
      const removeTimer = setTimeout(() => {
        setShowSplash(false);
      }, 2500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  if (!showSplash) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#070b14] select-none transition-all duration-700 ease-out ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* BACKGROUND RADIANT GLOW EFFECTS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full bg-gradient-to-tr from-blue-600/20 via-amber-500/15 to-cyan-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-amber-500/10 blur-[60px] pointer-events-none" />

      {/* CENTER CONTENT */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center animate-fade-in">
        
        {/* HIGH-RES CODEGURRU GURU EMBLEM */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
          <img
            src="/images/codeguru-guru-logo.png"
            alt="CodeGurru Mascot Emblem"
            className="w-44 sm:w-52 h-auto object-contain relative drop-shadow-[0_0_40px_rgba(59,130,246,0.45)] transition-transform duration-700"
          />
        </div>

        {/* BRAND TITLE & TAGLINE (ADDED BELOW PHOTO) */}
        <div className="mt-7 flex flex-col items-center space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-[0.2em] uppercase text-white font-heading">
              CODE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 drop-shadow-[0_2px_15px_rgba(245,158,11,0.4)]">GURRU</span>
            </h1>
          </div>

          <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-300 font-sans">
            Skills Today, Better Tomorrow
          </p>

          {/* INSTITUTE TRUST PILL */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[10.5px] font-extrabold text-amber-300 shadow-lg mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Ayodhya's Premier IT Training Institute</span>
          </div>
        </div>
      </div>

      {/* BOTTOM LOADING BAR */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 w-44 sm:w-52">
        <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden p-0">
          <div className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-orange-500 rounded-full animate-progress" />
        </div>
        <span className="text-[9.5px] font-black uppercase tracking-[0.25em] text-slate-400">
          Loading CodeGurru...
        </span>
      </div>
    </div>
  );
}
