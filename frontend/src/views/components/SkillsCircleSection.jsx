'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const SKILLS = [
  {
    id: 'angular',
    name: 'Angular',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
    bg: 'bg-red-50 text-red-700 border-red-200'
  },
  {
    id: 'python',
    name: 'Python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    bg: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  },
  {
    id: 'java',
    name: 'Java',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    bg: 'bg-orange-50 text-orange-800 border-orange-200'
  },
  {
    id: 'react',
    name: 'React.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    bg: 'bg-cyan-50 text-cyan-800 border-cyan-200'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    id: 'php',
    name: 'PHP',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    bg: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  },
  {
    id: 'android',
    name: 'Android',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
    bg: 'bg-green-50 text-green-800 border-green-200'
  },
  {
    id: 'flutter',
    name: 'Flutter',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
    bg: 'bg-sky-50 text-sky-800 border-sky-200'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    bg: 'bg-slate-100 text-slate-900 border-slate-300'
  },
  {
    id: 'laravel',
    name: 'Laravel',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
    bg: 'bg-rose-50 text-rose-800 border-rose-200'
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    bg: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  {
    id: 'c',
    name: 'C / C++',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
    bg: 'bg-purple-50 text-purple-800 border-purple-200'
  }
];

export default function SkillsCircleSection({ onOpenContactModal }) {
  const totalSkills = SKILLS.length;

  return (
    <section className="w-full px-3 sm:px-4 py-6 sm:py-8 bg-gradient-to-b from-slate-50 via-amber-50/20 to-slate-50 overflow-hidden select-none relative">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* SECTION HEADER */}
        <div className="text-center mb-6 sm:mb-8 max-w-2xl px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Master In-Demand Tech Skills</span>
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Learn Tech & Get Placed in Top MNCs
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Hands-on practical training with 100% placement support in full-stack, mobile & AI development.
          </p>
        </div>

        {/* CIRCULAR SKILLS HERO CONTAINER */}
        <div className="relative w-full max-w-[340px] xxs:max-w-[380px] sm:max-w-[540px] md:max-w-[620px] aspect-square flex items-center justify-center mx-auto my-2 sm:my-4">
          
          {/* RADIAL GLOW BACKGROUND */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-300/20 via-orange-400/20 to-yellow-300/20 rounded-full blur-3xl transform scale-75 animate-pulse" />

          {/* DASHED CIRCULAR ORBIT RING */}
          <div className="absolute w-[82%] h-[82%] rounded-full border-2 border-dashed border-amber-400/60 sm:border-amber-400/70 animate-[spin_40s_linear_infinite] pointer-events-none" />

          {/* ROTATING SKILLS ORBIT CONTAINER */}
          <div className="absolute inset-0 w-full h-full rounded-full animate-orbit-spin group">
            {SKILLS.map((skill, index) => {
              const angleRad = (index * 2 * Math.PI) / totalSkills - Math.PI / 2;
              const xFactor = Math.cos(angleRad);
              const yFactor = Math.sin(angleRad);
              
              return (
                <div
                  key={skill.id}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 xxs:w-11 xxs:h-11 sm:w-14 sm:h-14 flex-shrink-0"
                  style={{
                    transform: `translate(calc(-50% + var(--orbit-radius) * ${xFactor}), calc(-50% + var(--orbit-radius) * ${yFactor}))`
                  }}
                >
                  <div className="w-full h-full animate-orbit-counter-spin flex-shrink-0">
                    <button
                      onClick={onOpenContactModal}
                      title={skill.name}
                      className={`relative w-full h-full rounded-full bg-white border ${skill.bg} shadow-md sm:shadow-lg flex items-center justify-center p-1.5 sm:p-2.5 transition-all duration-300 hover:scale-125 hover:z-30 hover:shadow-amber-500/30 cursor-pointer group/icon aspect-square flex-shrink-0`}
                    >
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-full h-full object-contain filter drop-shadow-xs pointer-events-none"
                      />
                      
                      {/* TOOLTIP ON HOVER */}
                      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 pointer-events-none bg-slate-900 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md z-40">
                        {skill.name}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CENTER IMAGE: CODEGURU GURU AVATAR (REPLACED GIRL PHOTO) */}
          <div
            onClick={onOpenContactModal}
            className="relative w-[58%] h-[58%] rounded-full overflow-hidden flex items-center justify-center shadow-2xl border-4 border-amber-400/90 bg-slate-950 z-10 cursor-pointer group hover:scale-105 hover:border-amber-300 hover:shadow-[0_0_45px_rgba(245,158,11,0.4)] transition-all duration-300"
            title="Click to Inquire with CodeGuru"
          >
            <img
              src="/images/codeguru-guru-logo.png"
              alt="CodeGuru Master Guru"
              className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-108 transition-transform duration-500"
            />
          </div>

        </div>

        {/* CTA BUTTON BELOW */}
        <div className="mt-4 sm:mt-6 text-center">
          <button
            onClick={onOpenContactModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95"
          >
            <span>Explore All Tech Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* RADIUS CSS VARIABLE STYLES FOR RESPONSIVE ORBIT */}
      <style jsx>{`
        :root {
          --orbit-radius: 138px;
        }
        @media (min-width: 380px) {
          :root {
            --orbit-radius: 155px;
          }
        }
        @media (min-width: 540px) {
          :root {
            --orbit-radius: 220px;
          }
        }
        @media (min-width: 640px) {
          :root {
            --orbit-radius: 254px;
          }
        }
      `}</style>
    </section>
  );
}
