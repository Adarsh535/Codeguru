'use client';

import React, { useState, useEffect } from 'react';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import MemoryIcon from '@mui/icons-material/Memory';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const ICON_MAP = {
  Briefcase: WorkIcon,
  Code: CodeIcon,
  GraduationCap: SchoolIcon,
  Building2: BusinessIcon,
  Zap: FlashOnIcon,
  Cpu: MemoryIcon
};

export default function PlacementSelectorModal({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory
}) {
  const [renderModal, setRenderModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRenderModal(true);
      setIsClosing(false);
    } else if (renderModal) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setRenderModal(false);
        setIsClosing(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!renderModal) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md select-none transition-all duration-300 ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-full sm:max-w-md min-w-[280px] max-h-[90vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl border border-indigo-200 shadow-2xl flex flex-col transition-all duration-300 transform overflow-hidden ${
          isClosing ? 'animate-modal-slide-down' : 'animate-modal-slide-up'
        }`}
      >
        {/* Sticky Header Container */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-3 xxs:p-4 pb-2.5 border-b border-slate-200 shrink-0">
          {/* Top Pull Handle Indicator */}
          <div className="pb-1.5 flex justify-center cursor-pointer" onClick={handleClose}>
            <div className="w-10 xxs:w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full transition-colors" />
          </div>
          
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 xxs:p-2 bg-indigo-100 rounded-xl text-indigo-700 flex items-center justify-center shrink-0">
                <WorkIcon className="!w-4 !h-4 xxs:!w-5 xxs:!h-5" />
              </div>
              <div>
                <h3 className="text-xs xxs:text-sm sm:text-base font-bold text-slate-900 font-heading">Placement Options</h3>
                <p className="text-[10px] xxs:text-xs text-slate-500">Choose drive type & industry track</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-indigo-100 flex items-center justify-center text-slate-500 hover:text-indigo-900 transition-colors shrink-0 active:scale-95"
              title="Close modal"
            >
              <CloseIcon className="!w-4 !h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Category List */}
        <div className="p-2.5 xxs:p-4 flex-1 overflow-y-auto space-y-2 xxs:space-y-2.5 no-scrollbar">
          {categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || WorkIcon;
            const isSelected = selectedCategory?.id === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat);
                  handleClose();
                }}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all duration-200 active:scale-[0.98] ${
                  isSelected
                    ? 'bg-indigo-50 border border-indigo-400 shadow-xs'
                    : 'bg-slate-50 border border-slate-200 hover:bg-white hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-indigo-600'
                  }`}>
                    <IconComponent className="!w-5 !h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      {cat.label}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[9px] font-semibold bg-indigo-100 text-indigo-700 rounded-md border border-indigo-200">
                        {cat.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <CheckIcon className="!w-3.5 !h-3.5" />
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">Filter</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

