'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle2, ArrowRight } from 'lucide-react';

/**
 * ============================================================================
 * PWA MOBILE CHROME INSTALL BANNER (PwaInstallBanner.jsx)
 * ============================================================================
 * Prompts mobile visitors (especially Chrome on Android) to install CodeGurru
 * to their phone's home screen. Triggers native Chrome install prompt or provides
 * instant guidance.
 */
export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect standalone PWA mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed in this session
    if (sessionStorage.getItem('cg_pwa_dismissed')) {
      return;
    }

    const ua = navigator.userAgent || '';
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || window.innerWidth <= 768;
    const isApple = /iPhone|iPad|iPod/i.test(ua);
    setIsIOS(isApple);

    // Capture Chrome's native beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide if successfully installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    // On mobile devices, show the top banner after 2 seconds even if prompt event is queued
    const timer = setTimeout(() => {
      if (isMobile && !sessionStorage.getItem('cg_pwa_dismissed')) {
        setShowBanner(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setShowBanner(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        setShowGuideModal(true);
      }
    } else {
      // If browser doesn't expose prompt programmatically (iOS or Chrome variant), show guide modal
      setShowGuideModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      sessionStorage.setItem('cg_pwa_dismissed', '1');
    } catch (e) {}
  };

  if (isInstalled || !showBanner) return null;

  return (
    <>
      {/* 1. TOP MOBILE POPUP BANNER */}
      <div className="fixed top-2 left-2.5 right-2.5 sm:left-4 sm:right-4 z-[99990] max-w-md mx-auto animate-slide-down select-none">
        <div className="bg-slate-950/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-2.5 sm:p-3 shadow-[0_10px_35px_rgba(0,0,0,0.65)] flex items-center justify-between gap-2.5">
          
          {/* Logo & Text info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 p-1 flex items-center justify-center shrink-0 shadow-md">
              <img
                src="/images/codeguru-guru-logo.png"
                alt="CodeGurru App"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white font-heading tracking-tight truncate">
                  CodeGurru App
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                  FREE
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium truncate mt-0.5">
                Install for smooth offline learning
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Install</span>
            </button>

            <button
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. CHROME / SAFARI MANUAL INSTALL GUIDE MODAL (IF NATIVE PROMPT BLOCKED) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-sm p-5 text-white shadow-2xl relative">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-amber-500/40 p-1.5 flex items-center justify-center shrink-0">
                <img src="/images/codeguru-guru-logo.png" alt="App" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-base font-black text-white font-heading">Install CodeGurru</h3>
                <p className="text-xs text-slate-400">Easy 2-step setup</p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 text-xs">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                    <p className="text-slate-300">Tap the <strong>Share</strong> button (⎋) at bottom of Safari.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                    <p className="text-slate-300">Scroll down and tap <strong>"Add to Home Screen"</strong>.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                    <p className="text-slate-300">Tap Chrome's top-right <strong>three-dots menu (⋮)</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                    <p className="text-slate-300">Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </>
  );
}

