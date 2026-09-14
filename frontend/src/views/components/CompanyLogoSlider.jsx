'use client';

import React from 'react';
import { Building2 } from 'lucide-react';

export default function CompanyLogoSlider({ onOpenContactModal }) {
  const companies = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      borderBg: 'border border-sky-200 text-sky-900',
      logo: 'https://cdn.simpleicons.org/razorpay/0C2340'
    },
    {
      id: 'tcs',
      name: 'TCS Digital',
      borderBg: 'border border-purple-200 text-slate-800',
      logo: 'https://cdn.simpleicons.org/tata/00529C'
    },
    {
      id: 'infosys',
      name: 'Infosys PowerCoder',
      borderBg: 'border border-blue-200 text-blue-800',
      logo: 'https://cdn.simpleicons.org/infosys/007CC3'
    },
    {
      id: 'accenture',
      name: 'Accenture',
      borderBg: 'border border-slate-300 text-slate-800',
      logo: 'https://cdn.simpleicons.org/accenture/A100FF'
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      borderBg: 'border border-blue-200 text-slate-800',
      logo: 'https://cdn.simpleicons.org/microsoft/00A4EF'
    },
    {
      id: 'google',
      name: 'Google',
      borderBg: 'border border-green-200 text-slate-800',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg'
    },
    {
      id: 'amazon',
      name: 'Amazon',
      borderBg: 'border border-yellow-200 text-slate-800',
      logo: 'https://cdn.simpleicons.org/amazon/FF9900'
    }
  ];

  const doubleCompanies = [...companies, ...companies, ...companies];

  return (
    <div className="w-full flex flex-col gap-2 py-1.5 sm:py-2 overflow-hidden bg-white border-b border-slate-100 shadow-xs relative z-10 select-none">
      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_24px,_black_calc(100%-24px),transparent_100%)]">
        <ul className="flex items-center justify-start [&_li]:mx-1.5 animate-[marquee_20s_linear_infinite] w-max hover:[animation-play-state:paused]">
          <li className="flex flex-shrink-0 items-center justify-start gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full border-yellow-400 bg-yellow-50 text-yellow-900 shadow-xs mx-1.5">
            <Building2 className="w-3.5 h-3.5 text-yellow-600" />
            <span className="font-black text-[9.5px] sm:text-xs whitespace-nowrap tracking-wide">TOP PARTNERS:</span>
          </li>
          {doubleCompanies.map((comp, index) => (
            <li
              key={`${comp.id}-${index}`}
              onClick={onOpenContactModal}
              className={`flex flex-shrink-0 items-center justify-start gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full ${comp.borderBg} shadow-xs bg-white cursor-pointer hover:scale-105 transition-transform`}
            >
              <img
                src={comp.logo}
                alt={comp.name}
                onError={(e) => { e.target.style.display = 'none'; }}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain opacity-90"
              />
              <span className="font-extrabold text-[10px] sm:text-xs whitespace-nowrap tracking-tight">
                {comp.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

