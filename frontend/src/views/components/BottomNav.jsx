'use client';

import React from 'react';
import { Home, BookOpen, Phone, Layers, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function BottomNav({ activeTab: externalActiveTab, setActiveTab: externalSetActiveTab, onOpenContactModal }) {
  const router = useRouter();
  const pathname = usePathname();

  const getTabFromPathname = (path) => {
    if (!path || path === '/') return 'home';
    if (path.includes('courses')) return 'courses';
    if (path.includes('services')) return 'services';
    if (path.includes('placements')) return 'placements';
    if (path.includes('my-batch')) return 'my-batch';
    if (path.includes('profile')) return 'profile';
    return 'home';
  };

  const currentTab = externalActiveTab || getTabFromPathname(pathname);

  const handleNavClick = (id, route) => {
    if (externalSetActiveTab) {
      externalSetActiveTab(id);
    }
    if (router && route) {
      router.push(route);
    }
  };

  const handleCallClick = (e) => {
    e.preventDefault();
    onOpenContactModal?.();
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      route: '/'
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: BookOpen,
      route: '/courses'
    },
    {
      id: 'center-call',
      label: 'Call',
      isCenter: true
    },
    {
      id: 'services',
      label: 'Services',
      icon: Layers,
      route: '/services'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      route: '/profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full h-[68px] bg-white/95 backdrop-blur-md sm:hidden z-50 rounded-t-2xl border-t border-slate-100 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 select-none" suppressHydrationWarning>
      <div className="flex justify-around items-center h-full relative max-w-md mx-auto">
        {navItems.map((item) => {
          if (item.isCenter) {
            return (
              <div key={item.id} className="relative flex flex-col items-center justify-center w-16 h-full z-20">
                <div className="absolute -top-[22px] w-[62px] h-[62px] bg-white rounded-full flex items-center justify-center z-10 shadow-md border border-slate-100">
                  <button
                    suppressHydrationWarning
                    onClick={handleCallClick}
                    className="relative bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 z-20 transition-transform active:scale-90 duration-300 cursor-pointer"
                    title="Call / Contact Us"
                  >
                    <Phone className="w-6 h-6 fill-slate-900 stroke-none rotate-[10deg]" />
                  </button>
                </div>
              </div>
            );
          }

          const isActive = currentTab === item.id;
          const IconComponent = item.icon;

          return (
            <button
              suppressHydrationWarning
              key={item.id}
              onClick={() => handleNavClick(item.id, item.route)}
              className="relative flex flex-col items-center justify-center w-14 h-full z-10 group transition-transform active:scale-90 cursor-pointer"
            >
              <div
                className={`relative flex items-center justify-center transition-all duration-500 mb-0.5 ${
                  isActive ? 'text-orange-500 scale-[1.15] -translate-y-1' : 'text-slate-400 scale-100'
                }`}
              >
                <div
                  className={`absolute w-10 h-10 bg-orange-100/70 rounded-full transition-all duration-500 ${
                    isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                />
                <IconComponent className={`relative z-10 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} width={22} height={22} />
              </div>
              <span
                className={`text-[10px] transition-all duration-500 font-bold tracking-tight ${
                  isActive ? 'text-orange-500 translate-y-0.5' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
              <div
                className={`absolute top-1.5 right-2 sm:right-3 w-1.5 h-1.5 bg-orange-500 rounded-full border border-white transition-all duration-500 ${
                  isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
