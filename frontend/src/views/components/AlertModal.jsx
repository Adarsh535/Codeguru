'use client';

import React from 'react';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

/**
 * AlertModal component replicating SweetAlert style popups
 * Features:
 * - Floating top circular badge overlapping the modal card
 * - Customizable themes (success, error/warning)
 * - Smooth backdrop blur & scale-in pop animation
 */
export default function AlertModal({ 
  isOpen, 
  type = 'success', // 'success' | 'error'
  title, 
  message, 
  buttonText = 'Done',
  onClose 
}) {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none animate-backdrop-in"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 animate-pop-scale-in mt-6"
      >
        {/* TOP FLOATING OVERLAPPING CIRCULAR ICON BADGE */}
        <div 
          className={`absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white dark:ring-slate-900 transition-transform duration-300 ${
            isSuccess 
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' 
              : 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
          }`}
        >
          {isSuccess ? (
            <CheckRoundedIcon className="!w-12 !h-12 text-white stroke-[2.5]" />
          ) : (
            <PriorityHighRoundedIcon className="!w-11 !h-11 text-white" />
          )}
        </div>

        {/* TITLE */}
        <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white font-heading tracking-tight mt-6 mb-2">
          {title || (isSuccess ? 'Thank You!' : 'Ooops')}
        </h3>

        {/* MESSAGE */}
        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed mb-6 px-2">
          {message}
        </p>

        {/* DONE / ACTION BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className={`w-full font-bold text-sm uppercase tracking-wider py-3.5 px-6 rounded-2xl text-white shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] ${
            isSuccess 
              ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-emerald-500/20' 
              : 'bg-[#e53935] hover:bg-[#d32f2f] active:bg-[#c62828] shadow-red-500/20'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
