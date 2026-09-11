import React, { useState, useEffect } from 'react';
import GroupsIcon from '@mui/icons-material/Groups';
import { OUR_TEAM_MEMBERS } from '../../models/placementModel';
import { apiService } from '../../services/apiService';

export default function OurTeamSlider({ onOpenContactModal }) {
  const [teamMembers, setTeamMembers] = useState(OUR_TEAM_MEMBERS);

  useEffect(() => {
    let isMounted = true;
    apiService.getTeam().then(data => {
      if (isMounted && data && data.length > 0) {
        const formatted = data.map(item => ({
          id: item.id,
          name: item.name,
          role: item.role || 'Senior Tech Instructor',
          tag: '#CODEGURUTEAM',
          photo: item.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          bio: item.specialization || 'Full Stack & Software Engineering Expert with rich industry experience.',
          questionPrompt: 'Want to Learn From Experts?',
          phone: '9876543210',
          website: 'www.codeguru.com'
        }));
        setTeamMembers(formatted);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Duplicate list to create a 100% seamless infinite marquee loop
  const doubleMembers = [...teamMembers, ...teamMembers];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 xxs:px-3 sm:px-6 my-1.5 select-none">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2 xxs:p-2.5 border border-slate-200/90 shadow-2xs relative overflow-hidden flex flex-col gap-2">
        
        {/* HEADER SECTION: OUR TEAM */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
          <h3 className="text-xs xxs:text-sm sm:text-base font-black text-slate-900 font-heading tracking-tight truncate">
            Our Team & Mentors
          </h3>
          <span className="text-[9px] xxs:text-[10px] font-black text-slate-500 uppercase tracking-wider">
            #TEAMDIGICODERS
          </span>
        </div>

        {/* INFINITE SMOOTH MARQUEE CONTAINER */}
        <div className="relative w-full overflow-hidden">
          {/* Edge gradient fade overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* 100% Smooth Continuous Marquee Track (Right to Left) */}
          <div className="animate-infinite-scroll flex items-center gap-1.5 xxs:gap-2 py-0.5">
            {doubleMembers.map((member, index) => (
              <div
                key={`${member.id}-${index}`}
                onClick={onOpenContactModal}
                className="w-[185px] xxs:w-[205px] sm:w-[240px] h-[175px] xxs:h-[195px] sm:h-[225px] shrink-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-lg xxs:rounded-xl border border-slate-700/80 hover:border-cyan-400/90 shadow-md hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer relative overflow-hidden group flex select-none"
              >
                {/* RIGHT SIDE: FULL HEIGHT MEMBER PHOTO OVERLAY */}
                <div className="absolute right-0 top-0 bottom-0 w-[45%] h-full z-0 overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-105"
                  />
                  {/* Smooth dark navy gradient overlay on image left edge */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
                </div>

                {/* LEFT SIDE: POSTER TEXT & CONTENT COLUMN */}
                <div className="relative z-10 w-[62%] h-full p-1.5 xxs:p-2 flex flex-col justify-between">
                  {/* Top Header & Name Section */}
                  <div>
                    {/* Hashtag */}
                    <div className="text-[7px] xxs:text-[8px] font-black text-cyan-400 tracking-wider uppercase font-sans">
                      {member.tag}
                    </div>

                    {/* Member Name & Designation */}
                    <h4 className="text-[10px] xxs:text-xs font-black text-white group-hover:text-cyan-300 transition-colors font-heading mt-0.5 leading-tight truncate">
                      {member.name}
                    </h4>
                    <p className="text-[8px] xxs:text-[9px] text-cyan-300 font-extrabold mt-0.5 leading-tight truncate">
                      {member.role}
                    </p>

                    {/* Horizontal Divider Line */}
                    <div className="w-full border-t border-slate-700/80 my-0.5" />

                    {/* Bio Description Paragraph */}
                    <p className="text-[7px] xxs:text-[7.5px] text-slate-200 leading-tight font-normal line-clamp-3">
                      {member.bio}
                    </p>
                  </div>

                  {/* Bottom Action & Footer Details */}
                  <div className="mt-0.5">
                    {/* Question Prompt */}
                    <div className="text-[7px] xxs:text-[7.5px] text-amber-300 font-black mb-0.5 leading-tight truncate">
                      {member.questionPrompt}
                    </div>

                    {/* Divider & Connect Button */}
                    <div className="flex items-center gap-1 mb-0.5 border-t border-slate-700/60 pt-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenContactModal();
                        }}
                        className="bg-white hover:bg-cyan-400 text-slate-950 hover:text-slate-950 font-black px-1.5 py-0.2 rounded-xs text-[7px] xxs:text-[8px] shadow-2xs tracking-tight active:scale-95 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Connect With Us :
                      </button>
                    </div>

                    {/* Footer Contact Info: Phone & Website */}
                    <div className="flex items-center justify-between text-[7px] xxs:text-[8px] text-slate-300 font-bold tracking-tight border-t border-slate-700/80 pt-0.5 gap-1">
                      <span className="truncate">{member.phone}</span>
                      <span className="truncate">{member.website}</span>
                    </div>
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
