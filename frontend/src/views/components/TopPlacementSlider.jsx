'use client';

import React, { useState, useEffect } from 'react';
import { TOP_PLACEMENTS_STUDENTS } from '../../models/placementModel';
import { apiService } from '../../services/apiService';

export default function TopPlacementSlider({ onOpenContactModal }) {
  const [students, setStudents] = useState(TOP_PLACEMENTS_STUDENTS);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchPlacements = () => {
      apiService.getPlacements().then(data => {
        if (isMounted && Array.isArray(data)) {
          const formatted = data
            .filter(item => item.isActive !== false && !item.isHidden && item.status !== 'hidden')
            .map(item => ({
              ...item,
              id: item.id || item._id,
              photo: item.photo || item.avatarUrl || item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
              companyLogo: item.companyLogo || item.logo || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg'
            }));
          setStudents(formatted);
        }
      }).catch(() => {});
    };

    fetchPlacements();

    // 1. Live SSE update listeners
    window.addEventListener('codeguru_refresh_placements', fetchPlacements);
    window.addEventListener('codeguru_refresh_all', fetchPlacements);
    window.addEventListener('focus', fetchPlacements);

    return () => {
      isMounted = false;
      window.removeEventListener('codeguru_refresh_placements', fetchPlacements);
      window.removeEventListener('codeguru_refresh_all', fetchPlacements);
      window.removeEventListener('focus', fetchPlacements);
    };
  }, []);

  const doubleStudents = [...students, ...students, ...students];

  return (
    <section className="w-full px-3 sm:px-4 py-3 sm:py-5 bg-[#f8fafc] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto border border-slate-200/90 rounded-[20px] sm:rounded-2xl bg-white pt-4 pb-4 sm:pt-5 sm:pb-6 shadow-xs relative z-10 w-full overflow-hidden">
        
        {/* HEADING */}
        <div className="flex justify-between items-center px-4 md:px-8 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight font-heading">
            Top Placements & Achievers
          </h2>
          <span className="text-emerald-800 font-semibold text-[9.5px] sm:text-xs hidden sm:block bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
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
                className="w-[160px] xs:w-[175px] sm:w-[190px] flex-shrink-0 bg-white border border-slate-200/90 rounded-[16px] shadow-lg flex flex-col mx-1.5 relative overflow-hidden group cursor-pointer hover:shadow-md hover:border-blue-300 transition-all select-none"
              >
                {/* TOP PORTRAIT PHOTO AREA - EXACT SAME CLEAN DISPLAY AS OUR TEAM */}
                <div 
                  className="w-full bg-slate-100 relative overflow-hidden flex items-center justify-center shrink-0"
                  style={{ height: '175px', minHeight: '175px' }}
                >
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* BOTTOM WHITE CONTENT CONTAINER */}
                <div className="p-2.5 sm:p-3 bg-white flex flex-col flex-1 justify-between border-t border-slate-100">
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-slate-900 text-xs sm:text-[13px] tracking-tight leading-snug mb-0.5 truncate">
                      {student.name}
                    </h3>
                    <p className="text-slate-500 text-[9.5px] sm:text-xs leading-snug font-medium line-clamp-1">
                      {student.role || student.trainingType || 'Full Stack & System Design'}
                    </p>
                  </div>

                  {/* FOOTER COMPANY & PACKAGE DETAILS WITH CLEAN GAP */}
                  <div className="pt-2 mt-2 border-t border-slate-100 w-full flex flex-col gap-1.5">
                    <span className="text-[10.5px] sm:text-[11.5px] font-semibold text-slate-800 truncate" title={student.company || student.batch}>
                      {student.company || student.batch || 'Placed Student'}
                    </span>

                    {student.package && (
                      <div className="flex items-center justify-between gap-1 pt-0.5">
                        <span className="text-[8.5px] sm:text-xs font-bold text-slate-400">
                          Package
                        </span>
                        <span className="text-[9.5px] sm:text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shrink-0 shadow-2xs">
                          {student.package.startsWith('₹') ? student.package : `₹ ${student.package}`}
                        </span>
                      </div>
                    )}
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
