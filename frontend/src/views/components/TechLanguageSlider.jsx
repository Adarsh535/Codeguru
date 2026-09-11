import React from 'react';
import CodeIcon from '@mui/icons-material/Code';

export default function TechLanguageSlider({ onOpenContactModal }) {
  const techStack = [
    {
      id: 'java',
      name: 'Java',
      tag: 'Core & Advanced',
      logo: 'https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg',
      color: 'border-orange-200 bg-orange-50/50'
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      tag: 'ES6+ Fullstack',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png',
      color: 'border-yellow-200 bg-yellow-50/50'
    },
    {
      id: 'python',
      name: 'Python',
      tag: 'AI & Data Science',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg',
      color: 'border-blue-200 bg-blue-50/50'
    },
    {
      id: 'react',
      name: 'React.js',
      tag: 'Frontend UI',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      color: 'border-cyan-200 bg-cyan-50/50'
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      tag: 'Backend Runtime',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg',
      color: 'border-emerald-200 bg-emerald-50/50'
    },
    {
      id: 'html-css',
      name: 'HTML5 & CSS3',
      tag: 'Web Design',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg',
      color: 'border-rose-200 bg-rose-50/50'
    },
    {
      id: 'cpp',
      name: 'C++ & DSA',
      tag: 'Problem Solving',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg',
      color: 'border-indigo-200 bg-indigo-50/50'
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      tag: 'NoSQL Database',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg',
      color: 'border-teal-200 bg-teal-50/50'
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      tag: 'Typed JS',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg',
      color: 'border-sky-200 bg-sky-50/50'
    }
  ];

  // Duplicate list to create a seamless 100% infinite marquee loop
  const doubleTech = [...techStack, ...techStack];

  return (
    <div className="w-full max-w-7xl mx-auto px-1 xxs:px-2.5 sm:px-6 my-0.2 select-none">
      <div className="bg-white/90 backdrop-blur-md rounded-md xxs:rounded-lg p-0.5 border border-slate-200/90 shadow-2xs relative flex items-center overflow-hidden">
        
        {/* INFINITE SINGLE-LINE MARQUEE TICKER CONTAINER */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient fade edge overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Marquee Track (Left to Right Movement) */}
          <div className="animate-infinite-scroll-reverse flex items-center gap-1 py-0">
            {doubleTech.map((tech, index) => (
              <div
                key={`${tech.id}-${index}`}
                onClick={onOpenContactModal}
                className={`flex items-center gap-1 px-1 py-[1px] rounded-md border ${tech.color} hover:bg-white shadow-2xs hover:scale-105 transition-all duration-200 cursor-pointer shrink-0 group`}
              >
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className="w-2.5 h-2.5 xxs:w-3 xxs:h-3 object-contain shrink-0 filter group-hover:brightness-110 transition-all"
                />
                <span className="text-[8px] xxs:text-[9px] font-black text-slate-900 group-hover:text-cyan-700 transition-colors whitespace-nowrap">
                  {tech.name}
                </span>
                <span className="text-[6.5px] xxs:text-[7.5px] font-bold text-cyan-800 bg-cyan-100/90 px-0.5 py-0 rounded border border-cyan-200 whitespace-nowrap">
                  {tech.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
