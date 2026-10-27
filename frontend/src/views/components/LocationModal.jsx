'use client';

import { MapPin as LocationOnIcon, Search as SearchIcon, LocateFixed as MyLocationIcon, X as CloseIcon, Check as CheckIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { sanitizeLocation, DEFAULT_AYODHYA_LOCATION } from '../../utils/locationSanitizer';
import { detectStudentRealLocation } from '../../utils/geoLocator';

export default function LocationModal({ isOpen, onClose, selectedLocation, onSelectLocation }) {
  const [isLocating, setIsLocating] = useState(false);
  const [renderModal, setRenderModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  const handleGPSDetect = async () => {
    setIsLocating(true);

    try {
      const loc = await detectStudentRealLocation(true);
      if (loc) {
        const sanitized = sanitizeLocation(loc);
        try {
          localStorage.setItem('codeguru_selected_location', JSON.stringify(sanitized));
        } catch (e) {}
        onSelectLocation(sanitized);
        setIsLocating(false);
        handleClose();
        return;
      }
    } catch (err) {}

    const fallback = sanitizeLocation(DEFAULT_AYODHYA_LOCATION);
    try {
      localStorage.setItem('codeguru_selected_location', JSON.stringify(fallback));
    } catch (e) {}
    onSelectLocation(fallback);
    setIsLocating(false);
    handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      setRenderModal(true);
      setIsClosing(false);
      handleGPSDetect();
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

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm select-none transition-all duration-300 ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col p-5 transition-all duration-300 transform overflow-hidden ${
          isClosing ? 'animate-modal-slide-down' : 'animate-modal-slide-up'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-100 rounded-xl text-cyan-700 flex items-center justify-center">
              <LocationOnIcon className="!w-5 !h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">Auto Location Detection</h3>
              <p className="text-xs text-slate-500">Detecting your current live city</p>
            </div>
          </div>
          <button
            suppressHydrationWarning
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-cyan-100 flex items-center justify-center text-slate-500 hover:text-cyan-900 transition-colors shrink-0"
          >
            <CloseIcon className="!w-4 !h-4" />
          </button>
        </div>

        <div className="py-6 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-cyan-50 border-2 border-cyan-300 flex items-center justify-center text-cyan-600 animate-pulse shadow-md">
            <MyLocationIcon className="!w-7 !h-7" />
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold text-slate-800">
              {isLocating ? 'Requesting GPS Location...' : (selectedLocation ? `Current City: ${selectedLocation.name}` : 'Auto-Detecting Location')}
            </h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Allow browser location permission to automatically sync jobs & campus placement drives for your current city.
            </p>
          </div>

          <button
            suppressHydrationWarning
            onClick={handleGPSDetect}
            disabled={isLocating}
            className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <MyLocationIcon className="!w-4 !h-4" />
            <span>{isLocating ? 'Detecting Live GPS...' : 'Allow & Re-Detect Current Location'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

