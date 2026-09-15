'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, LogIn, UserPlus, LogOut, User, BookOpen, Layers, GraduationCap, School } from 'lucide-react';
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

  useEffect(() => {
    checkUser();
    window.addEventListener('storage', checkUser);
    window.addEventListener('codeguru_user_updated', checkUser);
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('codeguru_user_updated', checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('codeguru_user');
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
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-20 py-1 sm:py-0 w-full overflow-hidden gap-1.5 sm:gap-4">
          
          {/* LEFT SIDE: LOGO ICON, LOGO TEXT, AND LOCATION */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-shrink-0">
            {/* Logo Icon */}
            <button
              suppressHydrationWarning
              onClick={handleBrandClick}
              className="w-8 h-8 min-w-[32px] sm:w-10 sm:h-10 md:w-11 md:h-11 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full border border-gray-200/90 bg-white shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-transform p-0.5"
              title="CodeGuru Home"
            >
              <img
                src="/logo-icon.png"
                alt="Code Guru Icon"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  e.target.src = '/logo.png';
                }}
              />
            </button>

            {/* Brand Title & Location */}
            <div className="flex flex-col justify-center min-w-0 flex-shrink">
              <div
                onClick={handleBrandClick}
                className="flex items-center cursor-pointer min-w-0"
                title="CodeGuru Home"
              >
                <img
                  src="/brand-text-logo.png"
                  alt="CODE GURRU"
                  className="h-[14px] min-[360px]:h-[16px] sm:h-5 md:h-6 lg:h-[24px] w-auto max-w-[110px] min-[360px]:max-w-[140px] sm:max-w-[180px] lg:max-w-[210px] object-contain hover:scale-[1.01] transition-transform"
                />
              </div>

              {/* Location Picker Pill */}
              <div
                onClick={onOpenLocationModal}
                className="flex items-center gap-0.5 sm:gap-1 text-slate-500 text-[8px] min-[360px]:text-[9px] sm:text-[10px] cursor-pointer hover:text-slate-700 transition-colors truncate w-full mt-0.5 pl-0.5"
                title="Change Location"
              >
                <MapPin className="text-orange-400 flex-shrink-0 w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="font-semibold truncate leading-none">
                  {selectedLocation ? selectedLocation.name : 'Detecting...'}
                </span>
                <Navigation className="text-orange-400 animate-pulse flex-shrink-0 w-2 h-2 sm:w-2.5 sm:h-2.5" />
              </div>
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
            {user && (
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
                  className="flex items-center justify-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-full border border-gray-200 text-slate-800 font-bold text-[9px] sm:text-sm bg-white hover:bg-gray-50 transition-colors shadow-xs cursor-pointer active:scale-95"
                  title="View Profile"
                >
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-black flex items-center justify-center text-[10px] sm:text-xs">
                    {user.name?.[0] || 'U'}
                  </span>
                  <span className="truncate max-w-[80px] sm:max-w-[120px]">{user.name}</span>
                </button>

                <button
                  suppressHydrationWarning
                  onClick={handleLogout}
                  className="p-1.5 sm:px-3 sm:py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-[9px] sm:text-xs transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  suppressHydrationWarning
                  onClick={onOpenLogin || onOpenContactModal}
                  className="flex items-center justify-center gap-1 sm:gap-2 px-2 py-1 min-[360px]:px-2.5 min-[360px]:py-1.5 sm:px-5 sm:py-2 rounded-full border border-gray-200 text-slate-700 font-bold text-[10px] min-[360px]:text-xs sm:text-sm hover:bg-gray-50 transition-colors shadow-xs bg-white whitespace-nowrap active:scale-95 flex-shrink-0 cursor-pointer"
                >
                  <LogIn className="text-teal-600 w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                  <span>Login</span>
                </button>

                <button
                  suppressHydrationWarning
                  onClick={onOpenRegister || onOpenInquiryModal}
                  className="flex items-center justify-center gap-1 sm:gap-2 px-2 py-1 min-[360px]:px-2.5 min-[360px]:py-1.5 sm:px-6 sm:py-2 rounded-full text-white font-bold text-[10px] min-[360px]:text-xs sm:text-sm bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 transition-all shadow-xs active:scale-95 whitespace-nowrap flex-shrink-0 cursor-pointer"
                >
                  <UserPlus className="text-white w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                  <span>Register</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
