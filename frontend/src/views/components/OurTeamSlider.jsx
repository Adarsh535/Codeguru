'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Briefcase, Award } from 'lucide-react';
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
    phone: '9198483...'
  },
  {
    id: 'aman',
    name: 'Aman Kumar',
    role: 'Lead Full Stack',
    tag: '#TEAMCODEGURRU',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=faces',
    bio: 'Specializing in React, Node.js and architecting scalable enterprise systems.',
    phone: '9198483...'
  },
  {
    id: 'kishan',
    name: 'Kishan Sharma',
    role: 'Founder & CEO',
    tag: '#FOUNDER',
    photo: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=500&fit=crop&crop=faces',
    bio: 'Driving technical excellence and high-yield student success initiatives.',
    phone: '9198483...'
  },
  {
    id: 'priya',
    name: 'Priya Singh',
    role: 'UI/UX Lead Designer',
    tag: '#DESIGNTEAM',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=faces',
    bio: 'Ensuring premium layouts and seamless, beautiful user experiences.',
    phone: '9198483...'
  }
];

export default function OurTeamSlider({ onOpenContactModal }) {
  const [teamMembers, setTeamMembers] = useState(DEFAULT_MEMBERS);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;
    apiService.getTeam().then(data => {
      if (isMounted && data && data.length > 0) {
        const formatted = data.map(item => ({
          id: item.id || item._id,
          name: item.name,
          role: item.role || 'Senior Tech Instructor',
          tag: '#TEAMCODEGURRU',
          photo: item.photoUrl || item.photo || item.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=faces',
          bio: item.bio || item.specialization || 'Full Stack & Software Engineering Expert.',
          phone: item.phone || '9198483...'
        }));
        setTeamMembers(formatted);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const doubleMembers = [...teamMembers, ...teamMembers, ...teamMembers];

  return (
    <section className="w-full px-2 sm:px-4 py-2 sm:py-3 bg-[#f8fafc] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto border border-slate-200 rounded-[18px] sm:rounded-[24px] bg-white pt-2.5 pb-3 sm:pt-3.5 sm:pb-4 shadow-xs relative z-10 w-full overflow-hidden">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 sm:px-6 mb-2 sm:mb-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            Our Team & Mentors
          </h2>
          <span className="text-slate-400 font-bold text-[9px] sm:text-[10.5px] uppercase tracking-widest hidden sm:block">
            #TEAMCODEGURRU
          </span>
        </div>

        {/* MARQUEE ROW */}
        <div className="w-full overflow-hidden sm:[mask-image:_linear-gradient(to_right,transparent_0,_black_30px,_black_calc(100%-30px),transparent_100%)] px-3">
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onTouchCancel={() => setIsPaused(false)}
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
            className="flex w-max animate-[marquee_36s_linear_infinite] md:animate-[marquee_48s_linear_infinite] py-1 active:[animation-play-state:paused] hover:[animation-play-state:paused]"
          >
            {doubleMembers.map((member, idx) => (
              <div
                key={`${member.id}-${idx}`}
                onClick={onOpenContactModal}
                className="w-[160px] xs:w-[175px] sm:w-[190px] flex-shrink-0 bg-white border border-slate-200/90 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col mx-1.5 relative overflow-hidden group cursor-pointer hover:shadow-md hover:border-blue-300 transition-all select-none"
              >
                {/* TOP PHOTO AREA */}
                <div className="w-full h-[125px] sm:h-[140px] bg-gradient-to-b from-slate-100/70 via-slate-50 to-white relative overflow-hidden flex items-end justify-center">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* BOTTOM WHITE CONTENT CONTAINER */}
                <div className="p-2.5 sm:p-3 bg-white flex flex-col flex-1 justify-between border-t border-slate-100">
                  <div className="flex flex-col">
                    <h3 className="font-extrabold text-slate-900 text-[12px] sm:text-[13px] tracking-tight leading-snug mb-0.5 truncate">
                      {member.name}
                    </h3>
                    <p className="text-slate-500 text-[9.5px] sm:text-[10px] leading-snug font-medium line-clamp-1">
                      {member.bio}
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
