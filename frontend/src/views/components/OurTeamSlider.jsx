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
    <section className="w-full px-3 sm:px-4 py-8 bg-[#f8fafc] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto border border-slate-200 rounded-[32px] bg-white pt-6 pb-12 shadow-sm relative z-10 w-full overflow-hidden">
        
        {/* HEADER */}
        <div className="flex justify-between items-end px-4 sm:px-8 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter">
            Our Team & Mentors
          </h2>
          <span className="text-slate-400 font-extrabold text-[11px] sm:text-xs uppercase tracking-widest hidden sm:block">
            #TEAMCODEGURRU
          </span>
        </div>

        {/* MARQUEE ROW */}
        <div className="w-full overflow-hidden sm:[mask-image:_linear-gradient(to_right,transparent_0,_black_40px,_black_calc(100%-40px),transparent_100%)] px-4">
          <div className="flex w-max animate-[marquee_40s_linear_infinite] py-4 hover:[animation-play-state:paused]">
            {doubleMembers.map((member, idx) => (
              <div
                key={`${member.id}-${idx}`}
                onClick={onOpenContactModal}
                className="w-[300px] h-[350px] flex-shrink-0 bg-white border border-slate-200 rounded-[28px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex flex-col mx-3 relative overflow-hidden group cursor-pointer"
              >
                {/* PHOTO RIGHT ALIGNED */}
                <img
                  src={member.photo}
                  alt={member.name}
                  className="absolute inset-0 w-[55%] h-full object-cover object-center right-0 left-auto z-0"
                />
                
                {/* DARK GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/95 to-transparent w-[90%] z-0" />

                {/* CONTENT */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 pr-14">
                  <div className="flex flex-col gap-1 w-full max-w-[200px] mt-1">
                    <span className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.2em] opacity-90">
                      {member.tag || '#TEAMCODEGURRU'}
                    </span>
                    <h3 className="text-white font-black text-[22px] leading-tight mt-1 truncate">
                      {member.name}
                    </h3>
                    <h4 className="text-cyan-400 font-extrabold text-[12px] truncate">
                      {member.role}
                    </h4>
                    <p className="text-slate-300 text-[12px] mt-3 font-medium leading-relaxed line-clamp-4 pr-1">
                      {member.bio}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto mb-2">
                    <span className="text-yellow-400 font-black text-[10px] uppercase tracking-wide">
                      Do you have project?
                    </span>
                    <div className="bg-white px-3 py-1.5 w-max rounded-md shadow-sm">
                      <span className="text-slate-900 font-black text-[10px] uppercase tracking-tight">
                        Connect With Us :
                      </span>
                    </div>
                    <span className="text-slate-300 text-[9px] font-bold tracking-widest mt-1 opacity-80">
                      {member.phone || '9198483...'}
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

