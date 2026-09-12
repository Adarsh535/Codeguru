import React from 'react';

export default function TechLanguageSlider({ onOpenContactModal }) {
  const techStack = [
    {
      id: 'nodejs',
      name: 'Node.js',
      tag: 'Backend Runtime',
      tagBg: 'bg-teal-100 text-teal-700',
      borderBg: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
    },
    {
      id: 'html-css',
      name: 'HTML5 & CSS3',
      tag: 'Web Design',
      tagBg: 'bg-cyan-100 text-cyan-700',
      borderBg: 'border-rose-200 bg-rose-50 text-rose-800',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg'
    },
    {
      id: 'cpp',
      name: 'C++ & DSA',
      tag: 'Logic',
      tagBg: 'bg-indigo-100 text-indigo-700',
      borderBg: 'border-blue-200 bg-blue-50 text-blue-900',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg'
    },
    {
      id: 'python',
      name: 'Python',
      tag: 'AI & ML',
      tagBg: 'bg-amber-100 text-amber-700',
      borderBg: 'border-yellow-200 bg-yellow-50 text-yellow-900',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
    },
    {
      id: 'java',
      name: 'Java',
      tag: 'Enterprise',
      tagBg: 'bg-blue-100 text-blue-700',
      borderBg: 'border-orange-200 bg-orange-50 text-orange-900',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'
    },
    {
      id: 'react',
      name: 'React.js',
      tag: 'Frontend',
      tagBg: 'bg-sky-100 text-sky-700',
      borderBg: 'border-cyan-200 bg-cyan-50 text-cyan-900',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
    }
  ];

  const doubleTech = [...techStack, ...techStack, ...techStack];

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-4 py-3 sm:py-4 overflow-hidden bg-white mt-1 border-b border-t border-slate-100 shadow-sm relative z-10 select-none">
      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_24px,_black_calc(100%-24px),transparent_100%)]">
        <ul className="flex items-center justify-start [&_li]:mx-2 animate-[marquee-reverse_25s_linear_infinite] w-max hover:[animation-play-state:paused]">
          {doubleTech.map((tech, index) => (
            <li
              key={`${tech.id}-${index}`}
              onClick={onOpenContactModal}
              className={`flex flex-shrink-0 items-center justify-between gap-3 px-3 py-1.5 min-[320px]:px-4 min-[320px]:py-2 rounded-full border ${tech.borderBg} shadow-sm bg-white cursor-pointer hover:scale-105 transition-transform`}
            >
              <img
                src={tech.logo}
                alt={tech.name}
                className="w-4 h-4 min-[320px]:w-5 min-[320px]:h-5 object-contain"
              />
              <span className="font-extrabold text-[10px] min-[320px]:text-xs whitespace-nowrap tracking-tight">
                {tech.name}
              </span>
              <span className={`text-[9px] min-[320px]:text-[10px] font-bold px-2 py-0.5 rounded-full ${tech.tagBg}`}>
                {tech.tag}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

