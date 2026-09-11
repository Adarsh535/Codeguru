import React, { useState, useEffect, useRef } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';
import PublicIcon from '@mui/icons-material/Public';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '../context/AuthContext';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'visitor',
    title: 'New Student Visitor',
    message: 'A student from Lucknow, UP is currently active on the Homepage & Full-Stack Course.',
    city: 'Lucknow, UP',
    time: 'Just now',
    isUnread: true
  },
  {
    id: 'n2',
    type: 'lead',
    title: 'New Contact Lead Submitted',
    message: 'Saurabh Kumar (+91 9876543210) submitted a course inquiry for Full Stack Web Development.',
    city: 'Lucknow, UP',
    time: '2 mins ago',
    isUnread: true
  },
  {
    id: 'n3',
    type: 'visitor',
    title: 'Searching Visitor Active',
    message: 'A student from Ayodhya, UP is searching for Python AI & Data Science batch details.',
    city: 'Ayodhya, UP',
    time: '5 mins ago',
    isUnread: true
  },
  {
    id: 'n4',
    type: 'visitor',
    title: 'Curriculum PDF Download',
    message: 'A student from Kanpur, UP viewed and downloaded the Java Full Stack & DSA Syllabus.',
    city: 'Kanpur, UP',
    time: '12 mins ago',
    isUnread: true
  },
  {
    id: 'n5',
    type: 'lead',
    title: 'Callback Inquiry Received',
    message: 'Ananya Mishra (+91 9123456789) requested a callback for Ayodhya branch campus.',
    city: 'Ayodhya, UP',
    time: '18 mins ago',
    isUnread: true
  },
  {
    id: 'n6',
    type: 'visitor',
    title: 'Website Searching Student',
    message: 'A student from Noida (Delhi NCR) is viewing Placement Records & Package stats.',
    city: 'Noida, UP',
    time: '25 mins ago',
    isUnread: true
  },
  {
    id: 'n7',
    type: 'visitor',
    title: 'Active Website Visitor',
    message: 'A student from Varanasi, UP searched for C++ System Design & DSA offline batch.',
    city: 'Varanasi, UP',
    time: '32 mins ago',
    isUnread: true
  },
  {
    id: 'n8',
    type: 'visitor',
    title: 'Contact Page Opened',
    message: 'A student from Prayagraj, UP opened Contact Us section and clicked Location Map.',
    city: 'Prayagraj, UP',
    time: '45 mins ago',
    isUnread: true
  },
  {
    id: 'n9',
    type: 'visitor',
    title: 'Mobile Visitor Ping',
    message: 'A student from Gorakhpur, UP visited CodeGuru Web from Android Mobile Browser.',
    city: 'Gorakhpur, UP',
    time: '1 hour ago',
    isUnread: true
  },
  {
    id: 'n10',
    type: 'lead',
    title: 'Demo Session Inquiry',
    message: 'Vikas Sharma (+91 9988776655) enrolled for Python Data Science weekend demo.',
    city: 'Delhi-NCR',
    time: '2 hours ago',
    isUnread: true
  },
  {
    id: 'n11',
    type: 'visitor',
    title: 'Active Website Visitor',
    message: 'A student from Agra, UP visited CodeGuru Web about Machine Learning bootcamp.',
    city: 'Agra, UP',
    time: '3 hours ago',
    isUnread: true
  }
];

export default function Topbar({ onToggleSidebar, searchQuery, setSearchQuery, todayLeadsCount, onRefresh }) {
  const { user, logout } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState('all'); // all, visitor, lead
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefreshToast, setShowRefreshToast] = useState(false);
  const notifRef = useRef(null);

  const handleRefreshClick = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    if (typeof onRefresh === 'function') {
      try {
        await onRefresh();
      } catch (err) {
        console.error("Refresh error:", err);
      }
    }

    // Broadcast global refresh event across all admin modules
    window.dispatchEvent(new CustomEvent('codeguru_refresh_all'));
    window.dispatchEvent(new Event('storage'));

    setShowRefreshToast(true);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);

    setTimeout(() => {
      setShowRefreshToast(false);
    }, 2500);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for live student lead additions
  useEffect(() => {
    const handleNewLead = (e) => {
      const detail = e.detail;
      if (detail && detail.name) {
        const newNotif = {
          id: `lead-${Date.now()}`,
          type: 'lead',
          title: '⚡ Live Student Lead Submission!',
          message: `${detail.name} (+91 ${detail.phone}) submitted an inquiry for ${detail.course}.`,
          city: detail.location || 'Lucknow, UP',
          time: 'Just now',
          isUnread: true
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    };

    window.addEventListener('codeguru_lead_added', handleNewLead);
    return () => window.removeEventListener('codeguru_lead_added', handleNewLead);
  }, []);

  const unreadCount = notifications.filter(n => n.isUnread).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  const filteredNotifs = notifications.filter(n => {
    if (notifFilter === 'visitor') return n.type === 'visitor';
    if (notifFilter === 'lead') return n.type === 'lead';
    return true;
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      
      {/* LEFT: HAMBURGER & SEARCH INPUT */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <MenuIcon className="!w-5 !h-5" />
        </button>

        <div className="relative w-full max-w-sm">
          <SearchIcon className="!w-4 !h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads, student names, courses..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* RIGHT: ACTION ICONS & USER PROFILE */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Refresh Leads & Admin Data Button */}
        <div className="relative">
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className={`p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center border border-transparent ${
              isRefreshing
                ? 'bg-blue-50 text-blue-600 border-blue-200 scale-105 shadow-sm ring-2 ring-blue-500/20'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 hover:border-slate-200 active:scale-95'
            }`}
            title="Refresh Admin Data & Sync"
          >
            <RefreshIcon className={`!w-4.5 !h-4.5 transition-transform duration-500 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Refresh Success Toast Badge */}
          {showRefreshToast && (
            <div className="absolute right-0 top-11 whitespace-nowrap bg-slate-900/95 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 z-50 animate-fade-in border border-slate-700/80 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Admin Refreshed & Synced! ⚡</span>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

        {/* Admin User Info Badge & Quick Logout */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
            {user?.name?.[0] || 'A'}
          </div>
          
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-none">
              {user?.name || 'Super Admin'}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 leading-tight">
              ● Online
            </span>
          </div>

          <button
            onClick={logout}
            className="ml-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            title="Logout"
          >
            <LogoutIcon className="!w-3.5 !h-3.5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>

      </div>

    </header>
  );
}

