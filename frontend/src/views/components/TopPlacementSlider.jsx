'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Check, ArrowRight } from 'lucide-react';
import { TOP_PLACEMENTS_STUDENTS } from '../../models/placementModel';
import { apiService } from '../../services/apiService';

export default function TopPlacementSlider({ onOpenContactModal }) {
  const [students, setStudents] = useState(TOP_PLACEMENTS_STUDENTS);

  useEffect(() => {
    let isMounted = true;
    apiService.getPlacements().then(data => {
      if (isMounted && data && data.length > 0) {
        const formatted = data.map(item => ({
          ...item,
          id: item.id || item._id,
          photo: item.photo || item.avatarUrl || item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          companyLogo: item.companyLogo || item.logo || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg'
        }));
        setStudents(formatted);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const doubleStudents = [...students, ...students, ...students];

  const bannerColors = ['bg-blue-600', 'bg-teal-600', 'bg-indigo-600'];

  return (
    <section className="w-full px-3 sm:px-4 pt-0 pb-6 bg-[#f8fafc] overflow-hidden select-none">
      
      {/* FEATURED 25 YEARS ARENA ANIMATION BANNER */}
      <div className="max-w-7xl mx-auto mb-3 sm:mb-4 w-full">
        <div className="w-full rounded-[16px] sm:rounded-[22px] bg-white border border-slate-200/90 p-1.5 sm:p-2.5 shadow-xs flex items-center justify-center overflow-hidden hover:shadow-sm transition-shadow">
          <img
            src="/images/arena-25-years.jpg"
            alt="Celebrating 25 Years - Arena Animation"
            className="w-full h-[100px] sm:h-[160px] md:h-[200px] object-cover sm:object-fill rounded-xl mx-auto"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto border border-slate-200 rounded-[24px] sm:rounded-[32px] bg-white pt-4 pb-4 sm:pt-5 sm:pb-6 shadow-sm relative z-10 w-full overflow-hidden">
        
        {/* HEADING */}
        <h2 className="text-lg sm:text-2xl font-black text-slate-800 mb-3 sm:mb-4 px-4 md:px-8 tracking-tighter">
          Top Placements & Achievers
        </h2>

        {/* MARQUEE CAROUSEL */}
        <div className="w-full overflow-hidden sm:[mask-image:_linear-gradient(to_right,transparent_0,_black_40px,_black_calc(100%-40px),transparent_100%)]">
          <div className="flex w-max animate-[marquee-reverse_14s_linear_infinite] md:animate-[marquee-reverse_18s_linear_infinite] py-1.5 hover:[animation-play-state:paused] px-4 md:px-0">
            {doubleStudents.map((student, idx) => {
              const headerBg = bannerColors[idx % bannerColors.length];

              return (
                <div
                  key={`${student.id}-${idx}`}
                  onClick={onOpenContactModal}
                  className="w-[240px] xxs:w-[260px] sm:w-[285px] flex-shrink-0 bg-white border border-slate-200/90 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex flex-col mx-2 relative overflow-hidden cursor-pointer hover:shadow-md hover:border-blue-200 transition-all p-3 sm:p-3.5 select-none"
                >
                  {/* TOP HEADER ROW */}
                  <div className="flex items-center justify-between w-full mb-2.5">
                    <span className="bg-blue-50 text-blue-700 font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {student.batch || 'PLACEMENT 2026'}
                    </span>
                    <span className="bg-amber-100 text-amber-800 font-black text-[8.5px] sm:text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-tight">
                      CONGRATS!
                    </span>
                  </div>

                  {/* STUDENT INFO ROW */}
                  <div className="flex items-center gap-2.5 w-full mb-2.5">
                    <div className="relative flex-shrink-0">
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-blue-500/20 shadow-xs"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[1.5px] shadow-2xs">
                        <div className="w-3.5 h-3.5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-2 h-2 text-white stroke-[3.5px]" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <h3 className="font-extrabold text-slate-800 text-[12px] sm:text-[13px] uppercase tracking-tight truncate leading-tight">
                        {student.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5 text-slate-500">
                        <GraduationCap className="w-3 h-3 text-teal-600 flex-shrink-0" />
                        <span className="text-[9.5px] sm:text-[10px] font-semibold truncate leading-none">
                          {student.college}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-slate-100 mb-2.5" />

                  {/* FIRST JOB PLACEMENT ROW */}
                  <div className="flex flex-col gap-1.5 w-full mb-2">
                    <span className="text-teal-700 font-bold text-[9px] sm:text-[9.5px] tracking-wider uppercase">
                      FIRST JOB PLACEMENT:
                    </span>
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <img
                          src={student.companyLogo || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'}
                          alt={student.company}
                          className="w-4 h-4 object-contain flex-shrink-0"
                        />
                        <span className="font-black text-slate-900 text-[11px] sm:text-[12px] truncate uppercase">
                          {student.company}
                        </span>
                      </div>
                      <span className="text-[9px] sm:text-[9.5px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-tight flex-shrink-0">
                        {student.role}
                      </span>
                    </div>
                  </div>

                  {/* FOOTER ROW */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 w-full mt-auto">
                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] sm:text-[10.5px]">
                      <div className="bg-emerald-100 rounded-full p-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3.5px]" />
                      </div>
                      <span>100% Verified</span>
                    </div>
                    <button
                      suppressHydrationWarning
                      className="text-blue-600 hover:text-blue-800 font-extrabold text-[10px] sm:text-[11px] flex items-center gap-0.5 uppercase tracking-tight cursor-pointer"
                    >
                      Inquire <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

