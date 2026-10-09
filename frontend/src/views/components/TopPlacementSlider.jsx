'use client';

import React, { useState, useEffect } from 'react';
import { Award, Check, ArrowRight } from 'lucide-react';
import { TOP_PLACEMENTS_STUDENTS } from '../../models/placementModel';
import { apiService } from '../../services/apiService';

export default function TopPlacementSlider({ onOpenContactModal }) {
  const [students, setStudents] = useState(TOP_PLACEMENTS_STUDENTS);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;
    apiService.getPlacements().then(data => {
      if (isMounted && data && data.length > 0) {
        const formatted = data.map(item => ({
          ...item,
          id: item.id || item._id,
          photo: item.photo || item.avatarUrl || item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          companyLogo: item.companyLogo || item.logo || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg'
        }));
        setStudents(formatted);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const doubleStudents = [...students, ...students, ...students];

  return (
    <section className="w-full px-3 sm:px-4 py-3 sm:py-5 bg-[#f8fafc] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto border border-slate-200/90 rounded-[20px] sm:rounded-[28px] bg-white pt-4 pb-4 sm:pt-5 sm:pb-6 shadow-xs relative z-10 w-full overflow-hidden">
        
        {/* HEADING */}
        <div className="flex justify-between items-center px-4 md:px-8 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex-shrink-0 relative flex items-center justify-center -my-2">
              <img
                src="/images/top-achiever-3d-icon.png"
                alt="Top Placements Trophy"
                className="w-full h-full object-contain drop-shadow-md hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Top Placements & Achievers
            </h2>
          </div>
          <span className="text-emerald-800 font-extrabold text-[9.5px] sm:text-xs uppercase tracking-widest hidden sm:block bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            100% Verified Placements
          </span>
        </div>

        {/* MARQUEE CAROUSEL */}
        <div className="w-full overflow-hidden sm:[mask-image:_linear-gradient(to_right,transparent_0,_black_40px,_black_calc(100%-40px),transparent_100%)]">
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onTouchCancel={() => setIsPaused(false)}
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
            className="flex w-max animate-[marquee-reverse_36s_linear_infinite] md:animate-[marquee-reverse_48s_linear_infinite] py-2 active:[animation-play-state:paused] hover:[animation-play-state:paused] px-4 md:px-0"
          >
            {doubleStudents.map((student, idx) => (
              <div
                key={`${student.id}-${idx}`}
                onClick={(e) => {
                  if (onOpenContactModal) onOpenContactModal();
                  const contactElem = document.getElementById('contact-section');
                  if (contactElem) {
                    contactElem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-[210px] xs:w-[230px] sm:w-[250px] flex-shrink-0 bg-white border border-slate-200/90 rounded-[18px] sm:rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col mx-2 relative overflow-hidden group cursor-pointer hover:scale-[0.97] hover:shadow-md hover:border-blue-400 transition-all duration-300 ease-out select-none"
              >
                {/* TOP PORTRAIT PHOTO AREA - EDGE TO EDGE FULL COVER FIT */}
                <div className="w-full h-[190px] sm:h-[210px] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-105"
                  />

                  {/* GREEN DIAGONAL CORNER RIBBON: PLACED */}
                  <div className="absolute top-0 right-0 w-[72px] h-[72px] overflow-hidden pointer-events-none z-20">
                    <div className="absolute top-[12px] -right-[22px] w-[95px] transform rotate-45 bg-emerald-600 text-white font-black text-[8.5px] sm:text-[9px] uppercase tracking-widest text-center py-0.5 shadow-sm">
                      PLACED
                    </div>
                  </div>
                  
                  {/* SLEEK PACKAGE BADGE ON BOTTOM LEFT */}
                  <div className="absolute bottom-2 left-2 z-20 bg-slate-900/90 text-white font-black text-[9px] sm:text-[9.5px] px-2.5 py-0.5 rounded-lg shadow-sm border border-slate-700/80">
                    {student.package || '6.5 LPA'}
                  </div>
                </div>

                {/* CARD CONTENT */}
                <div className="p-3 sm:p-3.5 bg-white flex flex-col flex-1 justify-between">
                  <div>
                    {/* STUDENT NAME & ROLE (INLINE ON SAME LINE) */}
                    <div className="flex items-center gap-1.5 min-w-0 w-full truncate mb-0.5">
                      <h3 className="font-extrabold text-slate-900 text-[12.5px] sm:text-[13.5px] tracking-tight truncate flex-shrink-0 max-w-[58%]">
                        {student.name}
                      </h3>
                      <span className="text-slate-400 font-medium text-[10px] flex-shrink-0">•</span>
                      <span className="text-slate-500 font-semibold text-[10px] sm:text-[10.5px] truncate flex-1">
                        {student.role}
                      </span>
                    </div>

                    {/* COMPANY BRANDING & TRAINING TYPE ROW */}
                    <div className="flex items-center justify-between gap-1.5 mt-2 pt-2 border-t border-slate-100 w-full">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <img
                          src={student.companyLogo || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg'}
                          alt={student.company}
                          className="w-4 h-4 object-contain flex-shrink-0"
                        />
                        <span className="font-bold text-slate-800 text-[11px] sm:text-[11.5px] truncate">
                          {student.company}
                        </span>
                      </div>

                      <div className="bg-slate-100 text-slate-600 font-extrabold text-[8px] sm:text-[8.5px] px-2 py-0.5 rounded-full border border-slate-200/80 flex-shrink-0 tracking-tight">
                        {student.trainingType || 'Internship Training'}
                      </div>
                    </div>
                  </div>

                  {/* FOOTER ROW */}
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 w-full">
                    <span className="text-[9px] sm:text-[9.5px] font-extrabold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3.5px] text-emerald-600" /> Placed & Verified
                    </span>
                    <button
                      suppressHydrationWarning
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenContactModal) onOpenContactModal();
                        const contactElem = document.getElementById('contact-section');
                        if (contactElem) {
                          contactElem.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-[8.5px] sm:text-[9px] px-2.5 py-1 rounded-full shadow-2xs hover:shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-2.5 h-2.5 stroke-[3px]" />
                    </button>
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
