import React, { useState, useEffect } from 'react';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { TOP_PLACEMENTS_STUDENTS } from '../../models/placementModel';
import { useAutoSlideController } from '../../controllers/useAutoSlideController';
import { apiService } from '../../services/apiService';

export default function TopPlacementSlider({ onOpenContactModal }) {
  const [students, setStudents] = useState(TOP_PLACEMENTS_STUDENTS);

  useEffect(() => {
    let isMounted = true;
    apiService.getPlacements().then(data => {
      if (isMounted && data && data.length > 0) {
        setStudents(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const {
    scrollRef,
    handleMouseEnter,
    handleMouseLeave
  } = useAutoSlideController(235, 1500);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 xxs:px-3 sm:px-6 my-1.5 select-none">
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="bg-white/95 backdrop-blur-xl rounded-3xl xxs:rounded-[32px] p-2.5 xxs:p-3 sm:p-4 border border-slate-200/90 shadow-2xs relative overflow-hidden flex flex-col gap-2"
      >
        
        {/* HEADER SECTION: TITLE ONLY */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
          <h3 className="text-xs xxs:text-sm sm:text-base font-black text-slate-900 font-heading tracking-tight truncate">
            Top Placements & Star Achievers
          </h3>
        </div>

        {/* STEP-BY-STEP HORIZONTAL SLIDER CONTAINER */}
        <div className="relative w-full overflow-hidden">
          {/* Subtle gradient side overlays for smooth visual edges */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Cards Scroll Container */}
          <div
            ref={scrollRef}
            className="flex gap-2 xxs:gap-2.5 overflow-x-auto scrollbar-none scroll-smooth py-1 px-0.5 min-w-full"
          >
            {students.map((student) => (
              <div
                key={student.id}
                onClick={onOpenContactModal}
                className="w-[205px] xxs:w-[225px] sm:w-[245px] shrink-0 bg-white hover:bg-gradient-to-b hover:from-white hover:via-cyan-50/20 hover:to-blue-50/30 border border-slate-200/90 hover:border-cyan-400/90 rounded-2xl xxs:rounded-3xl shadow-2xs hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-[0.98] relative overflow-hidden"
              >
                {/* TOP BANNER: BATCH & CONGRATS BADGE */}
                <div className="bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-800 text-white px-2 py-0.5 xxs:px-2.5 xxs:py-1 flex items-center justify-between text-[9px] xxs:text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  <span>{student.batch}</span>
                  <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black text-[8px] xxs:text-[9px] shadow-2xs">
                    CONGRATS!
                  </span>
                </div>

                <div className="p-2 xxs:p-2.5 flex flex-col gap-1.5 flex-1 justify-between">
                  {/* STUDENT PHOTO + NAME + COLLEGE */}
                  <div className="flex items-start gap-2 min-w-0">
                    {/* Student Photo with ring highlight */}
                    <div className="relative shrink-0">
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="w-10 h-10 xxs:w-11 xxs:h-11 rounded-lg object-cover ring-2 ring-cyan-400/60 shadow-xs group-hover:scale-105 group-hover:ring-cyan-500 transition-all duration-200"
                      />
                      {student.verified && (
                        <VerifiedIcon
                          className="!w-3.5 !h-3.5 text-blue-500 bg-white rounded-full absolute -bottom-1 -right-1 shadow-2xs"
                          title="Verified Placement"
                        />
                      )}
                    </div>

                    {/* Student Name & College */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs xxs:text-sm font-black text-slate-900 group-hover:text-cyan-700 transition-colors uppercase font-heading leading-tight truncate">
                        {student.name}
                      </h4>
                      
                      <div className="flex items-start gap-1 mt-0.5 min-w-0">
                        <SchoolIcon className="!w-3 !h-3 text-cyan-600 shrink-0 mt-0.5" />
                        <span className="text-[9px] xxs:text-[10px] font-bold text-slate-600 leading-snug line-clamp-2 uppercase">
                          {student.college}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ON YOUR FIRST JOB IN [COMPANY] AS [ROLE] */}
                  <div className="rounded-lg p-1.5 xxs:p-2 flex flex-col gap-1 transition-all">
                    <div className="flex items-center justify-between text-[8px] xxs:text-[9px] font-black text-cyan-800 uppercase tracking-wider">
                      <span>FIRST JOB PLACEMENT:</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-ping" />
                    </div>
                    
                    {/* Company Name & Location */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-5 h-5 rounded-md bg-white p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
                        <img
                          src={student.companyLogo}
                          alt={student.company}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[10px] xxs:text-[11px] font-black text-slate-900 uppercase truncate">
                        {student.company}
                      </span>
                    </div>

                    {/* Job Role */}
                    <div className="pt-0.5 flex items-center justify-between min-w-0 gap-1">
                      <span className="text-[8px] font-black text-slate-500 uppercase shrink-0">ROLE:</span>
                      <span className="text-[8px] xxs:text-[9px] font-black text-indigo-900 bg-indigo-100/80 px-1.5 py-0.2 rounded uppercase truncate">
                        {student.role}
                      </span>
                    </div>
                  </div>

                  {/* FOOTER VERIFIED BADGE & INQUIRE ACTION */}
                  <div className="flex items-center justify-between pt-0.5 border-t border-slate-100 text-[8px] xxs:text-[9px] font-bold">
                    <span className="flex items-center gap-0.5 text-emerald-600 font-extrabold">
                      <VerifiedIcon className="!w-2.5 !h-2.5" /> 100% Verified
                    </span>
                    <span className="px-1.5 py-0.2 bg-cyan-50 group-hover:bg-cyan-600 text-cyan-700 group-hover:text-white rounded-md text-[8px] xxs:text-[9px] font-extrabold transition-all duration-200 flex items-center gap-0.5 shadow-2xs">
                      Inquire
                      <ArrowForwardIcon className="!w-2 !h-2" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
