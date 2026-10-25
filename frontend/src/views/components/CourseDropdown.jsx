'use client';

import React, { useState, useRef, useEffect } from 'react';

export const DEFAULT_COURSES = [
  'Full Stack Web Development',
  'Java Full Stack & DSA',
  'Python Data Science & AI',
  'C++ & Competitive Programming',
  'DevOps & Cloud Engineering',
  'Cyber Security & Ethical Hacking'
];

export default function CourseDropdown({
  label = 'Choose your course',
  value = 'Full Stack Web Development',
  onChange,
  name = 'course',
  options = DEFAULT_COURSES,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (course) => {
    if (onChange) {
      // Support both direct value and standard event signature
      onChange({ target: { name, value: course } });
    }
    setIsOpen(false);
  };

  const selectedValue = value || options[0] || 'Full Stack Web Development';

  return (
    <div ref={dropdownRef} suppressHydrationWarning className={`relative flex flex-col gap-1.5 w-full select-none ${isOpen ? 'z-[100]' : 'z-10'} ${className}`}>
      {label && (
        <label suppressHydrationWarning className="text-xs font-bold text-slate-800 tracking-tight flex items-center justify-between">
          <span>{label}</span>
        </label>
      )}

      {/* Hidden input for standard HTML form serialize */}
      <input suppressHydrationWarning type="hidden" name={name} value={selectedValue} />

      {/* TRIGGER BUTTON (MATCHES IMAGE 1) */}
      <button
        suppressHydrationWarning
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full px-4 py-3 bg-white border rounded-2xl flex items-center justify-between text-left transition-all outline-none cursor-pointer shadow-xs ${
          isOpen
            ? 'border-blue-500 ring-3 ring-blue-500/10'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-slate-900 truncate">
          {selectedValue}
        </span>
        <svg
          className={`w-4 h-4 text-slate-600 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* CUSTOM FLOATING DROPDOWN MENU (MATCHES IMAGE 1) */}
      {isOpen && (
        <div
          suppressHydrationWarning
          className="absolute left-0 right-0 top-full mt-2 z-[99999] bg-white border border-slate-200/90 rounded-2xl shadow-[0_14px_36px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.04)] p-1.5 flex flex-col gap-0.5 animate-fadeIn"
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option === selectedValue;
            return (
              <button
                suppressHydrationWarning
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 text-blue-600 font-semibold'
                    : 'text-slate-800 hover:bg-slate-50 font-medium'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <span className="truncate">{option}</span>
                {isSelected && (
                  <svg
                    className="w-4 h-4 text-blue-600 shrink-0 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
