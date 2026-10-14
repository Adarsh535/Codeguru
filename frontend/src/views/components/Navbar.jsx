'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, LogIn, UserPlus, LogOut, User, BookOpen, Layers, GraduationCap, School } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar({
  selectedLocation,
  onOpenLocationModal,
  onOpenContactModal,
  onOpenInquiryModal,
  onOpenLogin,
  onOpenRegister,
  setActiveTab
}) {
  const [user, setUser] = useState(null);
  const [showMyBatch, setShowMyBatch] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkUser = () => {
    try {
      const userRaw = localStorage.getItem('codeguru_user');
      if (userRaw) {
        setUser(JSON.parse(userRaw));
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    }
  };

  const fetchSettings = () => {
    try {
      const base = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://369.codegurru.in/api') : 'https://369.codegurru.in/api';
      fetch(`${base}/settings`)
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.data && data.data.showMyBatchNav !== undefined) {
            setShowMyBatch(Boolean(data.data.showMyBatchNav));
          }
        })
        .catch(() => {});
    } catch (e) {}
  };

  useEffect(() => {
    checkUser();
    fetchSettings();

    window.addEventListener('storage', checkUser);
    window.addEventListener('codeguru_user_updated', checkUser);
    window.addEventListener('codeguru_refresh_all', fetchSettings);
    window.addEventListener('focus', fetchSettings);

    const interval = setInterval(fetchSettings, 5000);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('codeguru_user_updated', checkUser);
      window.removeEventListener('codeguru_refresh_all', fetchSettings);
      window.removeEventListener('focus', fetchSettings);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('codeguru_user');
    localStorage.removeItem('codeguru_token');
    localStorage.removeItem('token');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('codeguru_user_updated'));
    if (setActiveTab) setActiveTab('home');
    if (router) router.push('/');
  };

  const handleBrandClick = () => {
    if (setActiveTab) setActiveTab('home');
    if (router) router.push('/');
  };

  const handleProfileClick = () => {
    if (setActiveTab) setActiveTab('profile');
    if (router) router.push('/profile');
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs z-50">
      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-20 py-1 sm:py-0 w-full gap-1 sm:gap-4">
          
          {/* LEFT SIDE: LOGO ICON, LOGO TEXT, AND LOCATION */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-shrink-0">
            {/* Logo Icon */}
            <button
              suppressHydrationWarning
              onClick={handleBrandClick}
              className="w-8 h-8 min-w-[32px] sm:w-11 sm:h-11 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center bg-transparent cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title="CodeGurru Home"
            >
              <img
                src="/logo.png"
                alt="CODE GURRU"
                className="w-full h-full object-contain drop-shadow-xs"
                onError={(e) => {
                  e.target.src = '/logo-icon.png';
                }}
              />
            </button>

            {/* Brand Title & Subtitle (Image 1: CODE GURRU + CODEGURU PLACEMENT ACADEMY) */}
            <div className="flex flex-col justify-center min-w-0 flex-shrink">
              <div
                onClick={handleBrandClick}
                className="flex items-center cursor-pointer min-w-0"
                title="CodeGurru Home"
              >
                <span className="text-[17px] min-[360px]:text-[19px] sm:text-xl md:text-2xl font-black tracking-tight font-heading leading-tight flex items-center gap-1 select-none">
                  <span className="text-slate-900">CODE</span>
                  <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">GURRU</span>
                </span>
              </div>

              {/* Location Tag */}
              {selectedLocation && (
                <div className="flex items-center min-w-0 mt-0.5">
                  <button
                    onClick={onOpenLocationModal}
                    className="inline-flex items-center gap-0.5 text-[9px] text-slate-400 hover:text-amber-600 font-semibold transition-colors cursor-pointer"
                    title="Change Location"
                  >
                    <MapPin className="text-amber-500 flex-shrink-0 w-2.5 h-2.5" />
                    <span className="truncate">{selectedLocation.name}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MIDDLE DESKTOP NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 mx-2 lg:mx-4 flex-shrink-0">
            <Link
              href="/"
              onClick={() => setActiveTab && setActiveTab('home')}
              className={`px-3 py-2 rounded-xl font-bold text-xs lg:text-sm transition-colors ${
                pathname === '/' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              href="/courses"
              onClick={() => setActiveTab && setActiveTab('courses')}
              className={`px-3 py-2 rounded-xl font-bold text-xs lg:text-sm transition-colors ${
                pathname === '/courses' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              Courses
            </Link>
            <Link
              href="/services"
              onClick={() => setActiveTab && setActiveTab('services')}
              className={`px-3 py-2 rounded-xl font-bold text-xs lg:text-sm transition-colors ${
                pathname === '/services' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              Services
            </Link>
            <Link
              href="/placements"
              onClick={() => setActiveTab && setActiveTab('placements')}
              className={`px-3 py-2 rounded-xl font-bold text-xs lg:text-sm transition-colors ${
                pathname === '/placements' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              Placements
            </Link>
            <Link
              href="/about"
              onClick={() => setActiveTab && setActiveTab('about')}
              className={`px-3 py-2 rounded-xl font-bold text-xs lg:text-sm transition-colors ${
                pathname === '/about' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setActiveTab && setActiveTab('contact')}
              className={`px-3 py-2 rounded-xl font-bold text-xs lg:text-sm transition-colors ${
                pathname === '/contact' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              Contact
            </Link>
            {user && showMyBatch && (
              <Link
                href="/my-batch"
                onClick={() => setActiveTab && setActiveTab('my-batch')}
                className={`px-3 py-2 rounded-xl font-bold text-xs lg:text-sm transition-colors flex items-center gap-1.5 ${
                  pathname === '/my-batch' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
                }`}
              >
                <School className="w-4 h-4 text-orange-500" />
                <span>My Batch</span>
              </Link>
            )}
          </nav>

          {/* RIGHT SIDE: USER PROFILE / LOGIN / REGISTER BUTTONS */}
          <div className="flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-3 md:gap-4 flex-shrink-0 ml-auto">
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  suppressHydrationWarning
                  onClick={handleProfileClick}
                  className="flex items-center justify-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-2 pr-2.5 sm:pr-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 border-l-[3.5px] border-l-orange-500 text-slate-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 group"
                  title="View Profile"
                >
                  <span className="w-6 h-6 sm:w-7 sm:h-7 min-w-[24px] min-h-[24px] sm:min-w-[28px] sm:min-h-[28px] aspect-square rounded-lg sm:rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-xs sm:text-sm shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                    {user.name?.[0] || 'U'}
                  </span>
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm capitalize tracking-tight truncate max-w-[75px] sm:max-w-[115px]">
                    {user.name}
                  </span>
                </button>

                <button
                  suppressHydrationWarning
                  onClick={handleLogout}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40 flex items-center justify-center transition-all cursor-pointer active:scale-90 shrink-0"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.2]" />
                </button>
              </div>
            ) : (
              <div className="inline-flex items-stretch rounded-full bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex-shrink-0 animate-glow-pulse">
                {/* LOGIN BUTTON */}
                <button
                  suppressHydrationWarning
                  onClick={onOpenLogin || onOpenContactModal}
                  className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-slate-800 hover:text-slate-950 hover:bg-slate-50 font-extrabold text-[11px] sm:text-sm transition-all duration-200 cursor-pointer active:scale-95 group"
                  title="Student Login"
                >
                  <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900 stroke-[2.3] group-hover:translate-x-0.5 transition-transform duration-200 shrink-0" />
                  <span className="font-extrabold text-slate-900 tracking-tight">Login</span>
                </button>

                {/* REGISTER BUTTON */}
                <button
                  suppressHydrationWarning
                  onClick={onOpenRegister || onOpenInquiryModal}
                  className="flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-[11px] sm:text-sm transition-all duration-200 cursor-pointer active:scale-95 group relative overflow-hidden"
                  title="New Registration"
                >
                  {/* Subtle Light Shimmer Sweep Animation */}
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-btn-shimmer pointer-events-none" />

                  <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.3] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200 shrink-0 relative z-10" />
                  <span className="font-extrabold text-white tracking-tight relative z-10">Register</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
