'use client';

import React, { useState, useEffect } from 'react';
import { OUR_TEAM_MEMBERS } from '../../models/placementModel';
import { apiService } from '../../services/apiService';

const DEFAULT_MEMBERS = [
  {
    id: 'roshani',
    name: 'Roshani Yadav',
    role: 'Social Media Manager',
    tag: '#TEAMCODEGURRU',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=faces',
    bio: 'Overseeing content strategy, community engagement, and brand awareness.',
    phone: '7238829360'
  },
  {
    id: 'aman',
    name: 'Aman Kumar',
    role: 'Lead Full Stack',
    tag: '#TEAMCODEGURRU',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=faces',
    bio: 'Specializing in React, Node.js and architecting scalable enterprise systems.',
    phone: '7238829360'
  },
  {
    id: 'kishan',
    name: 'Kishan Pandey',
    role: 'Founder & CEO',
    tag: '#FOUNDER',
    photo: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=500&fit=crop&crop=faces',
    bio: 'Driving technical excellence and high-yield student success initiatives.',
    phone: '7238829360'
  },
  {
    id: 'priya',
    name: 'Priya Singh',
    role: 'UI/UX Lead Designer',
    tag: '#DESIGNTEAM',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=faces',
    bio: 'Ensuring premium layouts and seamless, beautiful user experiences.',
    phone: '7238829360'
  }
];

export default function OurTeamSlider({ onOpenContactModal }) {
  const [teamMembers, setTeamMembers] = useState(DEFAULT_MEMBERS);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchTeam = () => {
      apiService.getTeam().then(data => {
        if (isMounted && Array.isArray(data)) {
          const formatted = data
            .filter(item => item.isActive !== false && !item.isHidden && item.status !== 'hidden')
            .map(item => ({
              id: item.id || item._id,
              name: item.name,
              role: item.role || 'Senior Tech Instructor',
              tag: '#TEAMCODEGURRU',
              photo: item.photoUrl || item.photo || item.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=faces',
              specialization: item.specialization || '',
              bio: item.bio || item.specialization || '',
              phone: item.phone || '7238829360'
            }));
          setTeamMembers(formatted);
        }
      }).catch(() => {});
    };

    fetchTeam();

    // 1. Live SSE update listeners
    window.addEventListener('codeguru_refresh_team', fetchTeam);
    window.addEventListener('codeguru_refresh_all', fetchTeam);
    window.addEventListener('focus', fetchTeam);

    // 2. Background polling fallback (every 4 seconds)
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchTeam();
      }
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('codeguru_refresh_team', fetchTeam);
      window.removeEventListener('codeguru_refresh_all', fetchTeam);
      window.removeEventListener('focus', fetchTeam);
    };
  }, []);

  // Deduplicate members first
  const uniqueMembers = teamMembers.filter((item, index, self) =>
    index === self.findIndex((t) => (t.id && item.id && t.id === item.id) || (t.name && item.name && t.name.toLowerCase().trim() === item.name.toLowerCase().trim()))
  );

  const baseList = uniqueMembers.length > 0 ? uniqueMembers : DEFAULT_MEMBERS;
  // Ensure enough items to smoothly fill the viewport and create a seamless 50% translation loop
  const targetCopies = Math.max(2, Math.ceil(6 / baseList.length));
  const singleHalf = Array(targetCopies).fill(baseList).flat();
  const displayMembers = [...singleHalf, ...singleHalf];

  return (
    <section className="w-full px-2 sm:px-4 py-2 sm:py-3 bg-[#f8fafc] overflow-hidden select-none" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto border border-slate-200 rounded-[18px] sm:rounded-[24px] bg-white pt-2.5 pb-3 sm:pt-3.5 sm:pb-4 shadow-xs relative z-10 w-full overflow-hidden" suppressHydrationWarning>
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 sm:px-6 mb-2 sm:mb-3" suppressHydrationWarning>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
              Our Team & Mentors
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3" suppressHydrationWarning>
            <span className="text-slate-400 font-bold text-[9px] sm:text-[10.5px] uppercase tracking-widest hidden sm:block">
              #TEAMCODEGURRU
            </span>
          </div>
        </div>

        {/* MARQUEE CAROUSEL ROW */}
        <div className="w-full overflow-hidden sm:[mask-image:_linear-gradient(to_right,transparent_0,_black_30px,_black_calc(100%-30px),transparent_100%)] px-2 sm:px-3">
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onTouchCancel={() => setIsPaused(false)}
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
            className="flex w-max animate-[marquee_36s_linear_infinite] md:animate-[marquee_48s_linear_infinite] py-1 active:[animation-play-state:paused] hover:[animation-play-state:paused]"
          >
            {displayMembers.map((member, idx) => (
              <div
                key={`${member.id || member.name}-${idx}`}
                onClick={(e) => {
                  if (onOpenContactModal) onOpenContactModal();
                  const contactElem = document.getElementById('contact-section');
                  if (contactElem) {
                    contactElem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-[160px] xs:w-[175px] sm:w-[190px] flex-shrink-0 bg-white border border-slate-200/90 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col mx-1.5 relative overflow-hidden group cursor-pointer hover:shadow-md hover:border-blue-300 transition-all select-none"
              >
                {/* TOP PHOTO AREA */}
                <div 
                  className="w-full bg-slate-100 relative overflow-hidden flex items-center justify-center shrink-0"
                  style={{ height: '175px', minHeight: '175px' }}
                >
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* BOTTOM WHITE CONTENT CONTAINER */}
                <div className="p-2.5 sm:p-3 bg-white flex flex-col flex-1 justify-between border-t border-slate-100">
                  <div className="flex flex-col">
                    <h3 className="font-extrabold text-slate-900 text-[12px] sm:text-[13px] tracking-tight leading-snug mb-0.5 truncate">
                      {member.name}
                    </h3>
                    <p className="text-slate-500 text-[9.5px] sm:text-[10px] leading-snug font-medium line-clamp-2 whitespace-pre-line">
                      {member.bio || member.specialization || ''}
                    </p>
                  </div>

                  {/* FOOTER ROLE ROW */}
                  <div className="flex items-center pt-2 mt-2 border-t border-slate-100 w-full">
                    <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-700 truncate">
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
