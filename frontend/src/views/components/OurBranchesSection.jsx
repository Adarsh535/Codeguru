'use client';

import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessIcon from '@mui/icons-material/Business';
import { OUR_BRANCHES_DATA } from '../../models/placementModel';

export default function OurBranchesSection({ onOpenContactModal }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-2 xxs:px-3 sm:px-6 my-1.5 select-none">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 xxs:p-3 sm:p-4 border border-slate-200/90 shadow-2xs relative overflow-hidden flex flex-col gap-3">
        
        {/* HEADER SECTION: OUR BRANCHES */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <h3 className="text-xs xxs:text-sm sm:text-base font-black text-slate-900 font-heading tracking-tight truncate">
            Our Offices & Branch Locations
          </h3>
        </div>

        {/* ALL BRANCH POSTER CARDS DISPLAY */}
        <div className="flex flex-col gap-2.5">
          {OUR_BRANCHES_DATA.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-2.5 xxs:p-3 sm:p-4 flex flex-col md:flex-row items-center gap-2.5 md:gap-5 relative overflow-hidden group hover:border-cyan-400 transition-all duration-200"
            >
              {/* LEFT SIDE: PHOTO COLLAGE WITH DIAMOND CENTER CUTOUT */}
              <div className="w-full md:w-[42%] lg:w-[40%] h-[120px] xxs:h-[140px] sm:h-[190px] shrink-0 relative rounded-lg xxs:rounded-xl overflow-hidden bg-slate-900 shadow-sm">
                {/* Background Collage Grid */}
                <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5">
                  <img
                    src={branch.photoCollage[0]}
                    alt="Office Classroom"
                    className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                  />
                  <img
                    src={branch.photoCollage[1]}
                    alt="Building Exterior"
                    className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                  />
                  <img
                    src={branch.photoCollage[2] || branch.photoCollage[0]}
                    alt="Students Working"
                    className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                  />
                  <img
                    src={branch.photoCollage[3] || branch.photoCollage[1]}
                    alt="Reception Area"
                    className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* DIAMOND CENTER CUTOUT PHOTO */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-13 h-13 xxs:w-16 xxs:h-16 rotate-45 rounded-xl border-3 border-amber-400 overflow-hidden shadow-xl shadow-slate-950/80 bg-white">
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
                      alt="Branch Mentors"
                      className="-rotate-45 scale-135 w-full h-full object-cover object-center"
                    />
                  </div>
                </div>

                {/* Subtle Gradient Overlays */}
                <div className="absolute inset-0 ring-1 ring-black/10 rounded-xl pointer-events-none" />
              </div>

              {/* RIGHT SIDE: BRANCH DETAILS */}
              <div className="w-full md:w-[58%] lg:w-[60%] flex flex-col justify-between gap-2">
                <div>
                  {/* Category Subtitle */}
                  <span className="text-[8px] xxs:text-[9px] sm:text-[10px] font-black text-cyan-700 uppercase tracking-wider">
                    {branch.category}
                  </span>

                  {/* Branch Title / Name */}
                  <h2 className="text-xs xxs:text-sm sm:text-lg font-black text-slate-900 font-heading mt-0.5 leading-tight">
                    {branch.title}
                  </h2>

                  {/* Location Address */}
                  <div className="flex items-start gap-1.5 mt-1.5">
                    <LocationOnIcon className="!w-3 !h-3 xxs:!w-3.5 xxs:!h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                    <p className="text-[8.5px] xxs:text-[9.5px] sm:text-xs font-extrabold text-slate-700 uppercase leading-tight">
                      {branch.address}
                    </p>
                  </div>

                  {/* Phone Contact */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <CallIcon className="!w-3 !h-3 xxs:!w-3.5 xxs:!h-3.5 text-cyan-600 shrink-0" />
                    <p className="text-[9.5px] xxs:text-[10.5px] sm:text-xs font-black text-slate-800">
                      {branch.phone}
                    </p>
                  </div>

                  {/* Working Hours / Timings */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <AccessTimeIcon className="!w-3 !h-3 xxs:!w-3.5 xxs:!h-3.5 text-cyan-600 shrink-0" />
                    <p className="text-[8.5px] xxs:text-[9.5px] sm:text-xs font-extrabold text-slate-700">
                      {branch.timings}
                    </p>
                  </div>
                </div>

                {/* ACTION BUTTON: KNOW MORE */}
                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1">
                  <button
                    suppressHydrationWarning
                    onClick={onOpenContactModal}
                    className="border-2 border-cyan-600 hover:bg-cyan-600 text-cyan-700 hover:text-white px-2.5 py-1 rounded-lg text-[8.5px] xxs:text-[9.5px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <span>Know More</span>
                    <ArrowForwardIcon className="!w-3 !h-3" />
                  </button>

                  <span className="text-[8px] xxs:text-[9px] font-bold text-slate-400 truncate">
                    Official Campus Location
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
