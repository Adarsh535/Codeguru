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
        setStudents(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const doubleStudents = [...students, ...students, ...students];

  const bannerColors = ['bg-blue-600', 'bg-teal-600', 'bg-indigo-600'];

  return (
    <section className="w-full px-3 sm:px-4 py-8 bg-[#f8fafc] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto border border-slate-200 rounded-[32px] bg-white pt-6 pb-10 shadow-sm relative z-10 w-full overflow-hidden">
        
        {/* HEADING */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-6 px-4 md:px-8 tracking-tighter">
          Top Placements & Achievers
        </h2>

        {/* MARQUEE CAROUSEL */}
        <div className="w-full overflow-hidden sm:[mask-image:_linear-gradient(to_right,transparent_0,_black_40px,_black_calc(100%-40px),transparent_100%)]">
          <div className="flex w-max animate-[marquee-reverse_30s_linear_infinite] md:animate-[marquee-reverse_40s_linear_infinite] py-4 hover:[animation-play-state:paused] px-4 md:px-0">
            {doubleStudents.map((student, idx) => {
              const headerBg = bannerColors[idx % bannerColors.length];

              return (
                <div
                  key={`${student.id}-${idx}`}
                  onClick={onOpenContactModal}
                  className="w-[300px] md:w-[320px] flex-shrink-0 bg-white border border-slate-200 rounded-[28px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col mx-3 relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  {/* TOP CARD BANNER */}
                  <div className={`w-full ${headerBg} px-5 py-4 pb-10 flex justify-between items-start relative`}>
                    <span className="text-white font-black text-[12px] uppercase tracking-widest leading-none mt-1">
                      {student.batch || 'PLACEMENT 2025'}
                    </span>
                    <span className="bg-[#ffbe0b] text-[#022069] font-black text-[10px] px-2 py-0.5 rounded-[6px] tracking-tight shadow-sm z-10">
                      CONGRATS!
                    </span>
                  </div>

                  {/* CARD BODY */}
                  <div className="px-5 pb-5 -mt-6 bg-white relative rounded-t-[20px] pt-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* AVATAR & NAME */}
                      <div className="flex gap-4 items-start w-full">
                        <div className="relative -mt-10 flex-shrink-0">
                          <div className="w-16 h-16 rounded-[16px] p-0.5 bg-gradient-to-br from-cyan-400 to-blue-500 bg-white shadow-md">
                            <img
                              src={student.photo}
                              alt={student.name}
                              className="w-full h-full object-cover rounded-[14px]"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[3px] shadow-sm">
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white stroke-[4px]" />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col pt-1 w-full min-w-0 pr-1">
                          <h3 className="font-black text-slate-800 text-[14px] uppercase tracking-tight truncate">
                            {student.name}
                          </h3>
                          <div className="flex gap-1.5 items-start mt-1">
                            <GraduationCap className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-[1px]" />
                            <p className="text-[11px] font-bold text-slate-500 leading-snug uppercase tracking-tight line-clamp-2">
                              {student.college}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-px bg-slate-100 my-4" />

                      {/* FIRST JOB PLACEMENT INFO */}
                      <div className="flex flex-col gap-2.5 w-full">
                        <span className="text-teal-700 font-extrabold text-[11px] tracking-widest uppercase truncate">
                          FIRST JOB PLACEMENT:
                        </span>
                        <div className="flex items-center gap-2.5 w-full pr-1">
                          <img
                            src={student.companyLogo || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'}
                            alt={student.company}
                            className="w-5 h-5 object-contain flex-shrink-0"
                          />
                          <span className="font-black text-slate-900 text-[13px] truncate uppercase tracking-tight">
                            {student.company}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 border border-slate-100 bg-slate-50 px-2.5 py-1.5 rounded-lg w-fit">
                          <span className="text-slate-500 font-extrabold text-[10px] uppercase">ROLE:</span>
                          <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 uppercase tracking-tighter truncate">
                            {student.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CARD FOOTER */}
                    <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-50 w-full">
                      <div className="flex items-center gap-1.5">
                        <div className="bg-emerald-100 rounded-full p-0.5">
                          <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[4px]" />
                        </div>
                        <span className="text-emerald-600 font-black text-[12px] tracking-tight">
                          100% Verified
                        </span>
                      </div>
                      <button className="text-cyan-600 hover:bg-cyan-50 font-black text-[12px] px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-tight transition-colors cursor-pointer">
                        Inquire <ArrowRight className="w-3 h-3 stroke-[3px]" />
                      </button>
                    </div>

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

