import React from 'react';

export default function Logo({ className = "h-8" }) {
  return (
    <div className="flex items-center gap-2 group cursor-pointer shrink-0">
      <div className="p-1 xxs:p-1.5 rounded-xl xxs:rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs group-hover:shadow-xs group-hover:border-cyan-300 transition-all duration-300 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="CodeGuru Logo"
          className={`${className} object-contain rounded-lg filter drop-shadow-xs`}
        />
      </div>
    </div>
  );
}
