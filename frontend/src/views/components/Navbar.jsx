import React, { useState, useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LogoutIcon from '@mui/icons-material/Logout';
import VerifiedIcon from '@mui/icons-material/Verified';

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
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-slate-50/95 backdrop-blur-xl border-b border-slate-200/70 shadow-xs select-none pt-safe">
      <div className="w-full max-w-7xl mx-auto px-2 xxs:px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
        
        {/* LEFT SIDE: LOGO & LOCATION */}
        <div className="flex items-center gap-2 xxs:gap-2.5 shrink min-w-0">
          
          <button
            onClick={() => setActiveTab && setActiveTab('home')}
            className="relative w-8 h-8 xxs:w-9 xxs:h-9 sm:w-10 sm:h-10 rounded-[50%] bg-white border border-slate-200/80 p-0.5 shadow-2xs hover:shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center justify-center overflow-hidden"
            title="CodeGuru Home"
          >
            <img
              src="/logo.png"
              alt="CodeGuru Logo"
              className="w-full h-full object-contain rounded-[50%] transform hover:scale-110 transition-transform"
            />
          </button>

          <div className="flex flex-col justify-center min-w-0">
            <img
              src="/brand-text-logo.png"
              alt="CODE GURRU"
              className="h-3.5 xxs:h-4.5 sm:h-5.5 w-auto object-contain object-left filter drop-shadow-2xs"
            />
            
            <button
              onClick={onOpenLocationModal}
              className="flex items-center gap-0.5 text-[10px] xxs:text-[11px] font-bold text-slate-500 hover:text-amber-600 transition-colors cursor-pointer min-w-0 group mt-1 xxs:mt-1.5"
              title="Change Location"
            >
              <LocationOnOutlinedIcon className="!w-3 !h-3 xxs:!w-3.5 xxs:!h-3.5 text-amber-500 shrink-0" />
              <span className="truncate font-semibold tracking-tight text-slate-600 group-hover:text-amber-600">
                {selectedLocation ? selectedLocation.name : 'Select Location'}
              </span>
              <EditOutlinedIcon className="!w-2.5 !h-2.5 xxs:!w-3 xxs:!h-3 text-amber-500/90 shrink-0 ml-0.5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

        </div>

        {/* RIGHT SIDE: MY BATCH BUTTON & USER ACTIONS */}
        <div className="flex items-center gap-1.5 xxs:gap-2 sm:gap-2.5 shrink-0">
          


          {user ? (
            /* LOGGED IN USER: PROFILE PILL & LOGOUT BUTTON */
            <div className="flex items-center gap-1.5 xxs:gap-2">
              <button
                onClick={() => setActiveTab && setActiveTab('profile')}
                className="px-2.5 py-1 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 text-xs font-extrabold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="View Profile"
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white text-[10px] font-black flex items-center justify-center uppercase">
                  {user.name?.[0] || 'U'}
                </span>
                <span className="truncate max-w-[80px] hidden sm:inline">{user.name}</span>
              </button>

              <button
                onClick={handleLogout}
                className="p-1.5 xxs:px-2.5 xxs:py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                title="Logout Student Account"
              >
                <LogoutIcon className="!w-3.5 !h-3.5 text-rose-600" />
                <span className="hidden xxs:inline">Logout</span>
              </button>
            </div>
          ) : (
            /* NOT LOGGED IN: ONLY LOGIN & REGISTER BUTTONS (NO MY BATCH) */
            <>
              <button
                onClick={onOpenLogin || onOpenContactModal}
                className="px-2.5 py-1 xxs:px-3 py-1.5 rounded-full border border-slate-300/90 hover:border-cyan-500 bg-white/95 hover:bg-cyan-50/60 text-slate-800 hover:text-cyan-900 text-[11px] xxs:text-xs font-extrabold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <LoginIcon className="!w-3.5 !h-3.5 text-cyan-600" />
                <span>Login</span>
              </button>

              <button
                onClick={onOpenRegister || onOpenInquiryModal}
                className="px-2.5 py-1 xxs:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-[11px] xxs:text-xs font-black shadow-md shadow-orange-500/25 transition-all flex items-center gap-1 cursor-pointer"
              >
                <PersonAddAlt1Icon className="!w-3.5 !h-3.5" />
                <span>Register</span>
              </button>
            </>
          )}

        </div>

      </div>
    </header>
  );
}
