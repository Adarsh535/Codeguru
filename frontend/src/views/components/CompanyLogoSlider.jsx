import React from 'react';
import BusinessIcon from '@mui/icons-material/Business';

export default function CompanyLogoSlider({ onOpenContactModal }) {
  const companies = [
    {
      id: 'google',
      name: 'Google',
      package: '24 - 45 LPA',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      color: 'border-blue-200 bg-blue-50/50'
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      package: '18 - 38 LPA',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
      color: 'border-cyan-200 bg-cyan-50/50'
    },
    {
      id: 'amazon',
      name: 'Amazon',
      package: '22 - 42 LPA',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      color: 'border-amber-200 bg-amber-50/50'
    },
    {
      id: 'meta',
      name: 'Meta',
      package: '28 - 50 LPA',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
      color: 'border-indigo-200 bg-indigo-50/50'
    },
    {
      id: 'swiggy',
      name: 'Swiggy',
      package: '14 - 28 LPA',
      logo: 'https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg',
      color: 'border-orange-200 bg-orange-50/50'
    },
    {
      id: 'zomato',
      name: 'Zomato',
      package: '12 - 25 LPA',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg',
      color: 'border-rose-200 bg-rose-50/50'
    },
    {
      id: 'flipkart',
      name: 'Flipkart',
      package: '16 - 32 LPA',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg',
      color: 'border-yellow-200 bg-yellow-50/50'
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      package: '15 - 30 LPA',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg',
      color: 'border-sky-200 bg-sky-50/50'
    },
    {
      id: 'tcs',
      name: 'TCS Digital',
      package: '7 - 12 LPA',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
      color: 'border-purple-200 bg-purple-50/50'
    },
    {
      id: 'infosys',
      name: 'Infosys PowerCoder',
      package: '8 - 15 LPA',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
      color: 'border-blue-200 bg-blue-50/50'
    },
    {
      id: 'accenture',
      name: 'Accenture FSE',
      package: '6 - 11 LPA',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture_logo.svg',
      color: 'border-violet-200 bg-violet-50/50'
    }
  ];

  // Duplicate list to create a seamless 100% infinite marquee loop
  const doubleCompanies = [...companies, ...companies];

  return (
    <div className="w-full max-w-7xl mx-auto px-1 xxs:px-2.5 sm:px-6 my-0.2 select-none">
      <div className="bg-white/90 backdrop-blur-md rounded-md xxs:rounded-lg p-0.5 border border-slate-200/90 shadow-2xs relative flex items-center gap-1 overflow-hidden">
        
        {/* Fixed Single-Line Left Label Badge */}
        <div className="flex items-center gap-0.5 px-1 py-[1px] rounded-md bg-gradient-to-r from-amber-500/15 via-yellow-400/20 to-amber-300/10 border border-amber-300/80 text-amber-950 shrink-0 z-20 shadow-2xs">
          <BusinessIcon className="!w-2 !h-2 xxs:!w-2.5 xxs:!h-2.5 text-amber-600 shrink-0" />
          <span className="text-[7.5px] xxs:text-[8.5px] sm:text-[10px] font-black uppercase tracking-tight whitespace-nowrap">
            Top Partners:
          </span>
        </div>

        {/* INFINITE SINGLE-LINE MARQUEE TICKER CONTAINER */}
        <div className="relative flex-1 overflow-hidden">
          {/* Gradient fade edge overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div className="animate-infinite-scroll flex items-center gap-1 py-0">
            {doubleCompanies.map((comp, index) => (
              <div
                key={`${comp.id}-${index}`}
                onClick={onOpenContactModal}
                className={`flex items-center gap-1 px-1 py-[1px] rounded-md border ${comp.color} hover:bg-white shadow-2xs hover:scale-105 transition-all duration-200 cursor-pointer shrink-0 group`}
              >
                <img
                  src={comp.logo}
                  alt={comp.name}
                  className="w-2.5 h-2.5 xxs:w-3 xxs:h-3 object-contain shrink-0 filter group-hover:brightness-110 transition-all"
                />
                <span className="text-[8px] xxs:text-[9px] font-black text-slate-900 group-hover:text-amber-700 transition-colors whitespace-nowrap">
                  {comp.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
