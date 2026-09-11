import React, { useState, useEffect } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LayersIcon from '@mui/icons-material/Layers';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

export default function BottomNav({ activeTab: externalActiveTab, setActiveTab: externalSetActiveTab, onOpenContactModal, onOpenPlacementModal }) {
  const [internalActiveTab, setInternalActiveTab] = useState('home');
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const setActiveTab = externalSetActiveTab || setInternalActiveTab;
  const [isCallPressed, setIsCallPressed] = useState(false);
  const [user, setUser] = useState(null);

  const checkUser = () => {
    try {
      const u = localStorage.getItem('codeguru_user');
      setUser(u ? JSON.parse(u) : null);
    } catch (e) {
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

  const handleCallClick = () => {
    setIsCallPressed(true);
    setTimeout(() => {
      setIsCallPressed(false);
      onOpenContactModal?.();
    }, 150);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl rounded-t-2xl xxs:rounded-t-3xl border-t border-amber-200/90 shadow-[0_-4px_20px_rgba(245,158,11,0.12)] px-0.5 xxs:px-1.5 sm:px-4 py-0.5 xxs:py-1 select-none w-full max-w-full md:max-w-md md:mx-auto md:mb-3 overflow-visible">
      <div className="flex items-end justify-between w-full max-w-md mx-auto relative px-0.5 xxs:px-1 sm:px-2">
        
        {/* TAB 1: HOME */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center gap-0.5 py-0.5 px-0.5 xxs:px-1 shrink min-w-0 transition-all cursor-pointer ${
            activeTab === 'home' ? 'text-amber-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className="relative flex flex-col items-center">
            <HomeIcon className={`!w-4 !h-4 xxs:!w-[19px] xxs:!h-[19px] sm:!w-5 sm:!h-5 ${activeTab === 'home' ? 'text-amber-500' : ''}`} />
            {activeTab === 'home' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -bottom-1 shadow-xs" />
            )}
          </div>
          <span className="text-[9px] xxs:text-[10px] sm:text-[11px] leading-tight truncate mt-0.5 font-heading">Home</span>
        </button>

        {/* TAB 2: MY BATCH (LOGGED IN) / PLACEMENT (LOGGED OUT) */}
        {user ? (
          <button
            onClick={() => setActiveTab('my-batch')}
            className={`flex flex-col items-center justify-center gap-0.5 py-0.5 px-0.5 xxs:px-1 shrink min-w-0 transition-all cursor-pointer ${
              activeTab === 'my-batch' ? 'text-blue-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <div className="relative flex flex-col items-center">
              <SchoolIcon className={`!w-4 !h-4 xxs:!w-[19px] xxs:!h-[19px] sm:!w-5 sm:!h-5 ${activeTab === 'my-batch' ? 'text-blue-600' : ''}`} />
              {activeTab === 'my-batch' && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute -bottom-1 shadow-xs" />
              )}
            </div>
            <span className="text-[9px] xxs:text-[10px] sm:text-[11px] leading-tight truncate mt-0.5 font-heading">My Batch</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setActiveTab('placements');
              onOpenPlacementModal?.();
            }}
            className={`flex flex-col items-center justify-center gap-0.5 py-0.5 px-0.5 xxs:px-1 shrink min-w-0 transition-all cursor-pointer ${
              activeTab === 'placements' ? 'text-amber-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <div className="relative flex flex-col items-center">
              <WorkIcon className={`!w-4 !h-4 xxs:!w-[19px] xxs:!h-[19px] sm:!w-5 sm:!h-5 ${activeTab === 'placements' ? 'text-amber-500' : ''}`} />
              {activeTab === 'placements' && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -bottom-1 shadow-xs" />
              )}
            </div>
            <span className="text-[9px] xxs:text-[10px] sm:text-[11px] leading-tight truncate mt-0.5 font-heading">Placement</span>
          </button>
        )}

        {/* CENTER FLOATING ACTION BUTTON */}
        <div className="flex flex-col items-center relative -top-[16px] xxs:-top-[18px] sm:-top-[20px] -mb-[12px] xxs:-mb-[14px] sm:-mb-[16px] z-50 shrink-0 px-0.5 group">
          <button
            onClick={handleCallClick}
            className={`relative w-[38px] h-[38px] xxs:w-[44px] xxs:h-[44px] sm:w-[48px] sm:h-[48px] bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 rounded-full border-2 border-white shadow-[0_6px_20px_rgba(245,158,11,0.4)] flex items-center justify-center hover:scale-105 active:scale-90 transition-all duration-150 cursor-pointer ${
              isCallPressed ? 'scale-90 ring-2 ring-amber-300' : ''
            }`}
            title="Open Contact Channels"
          >
            <span className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping pointer-events-none opacity-40" />
            <PhoneIcon className="!w-4.5 !h-4.5 xxs:!w-5.5 xxs:!h-5.5 text-slate-950 group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>

        {/* TAB 3: OUR COURSES */}
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex flex-col items-center justify-center gap-0.5 py-0.5 px-0.5 xxs:px-1 shrink min-w-0 transition-all cursor-pointer ${
            activeTab === 'courses' ? 'text-amber-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className="relative flex flex-col items-center">
            <MenuBookIcon className={`!w-4 !h-4 xxs:!w-[19px] xxs:!h-[19px] sm:!w-5 sm:!h-5 ${activeTab === 'courses' ? 'text-amber-500' : ''}`} />
            {activeTab === 'courses' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -bottom-1 shadow-xs" />
            )}
          </div>
          <span className="text-[9px] xxs:text-[10px] sm:text-[11px] leading-tight truncate mt-0.5 font-heading">Courses</span>
        </button>

        {/* TAB 4: PROFILE */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center gap-0.5 py-0.5 px-0.5 xxs:px-1 shrink min-w-0 transition-all cursor-pointer ${
            activeTab === 'profile' ? 'text-amber-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className="relative flex flex-col items-center">
            <PersonIcon className={`!w-4 !h-4 xxs:!w-[19px] xxs:!h-[19px] sm:!w-5 sm:!h-5 ${activeTab === 'profile' ? 'text-amber-500' : ''}`} />
            {activeTab === 'profile' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -bottom-1 shadow-xs" />
            )}
          </div>
          <span className="text-[9px] xxs:text-[10px] sm:text-[11px] leading-tight truncate mt-0.5 font-heading">Profile</span>
        </button>

      </div>
    </div>
  );
}
