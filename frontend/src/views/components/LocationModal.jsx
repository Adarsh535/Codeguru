'use client';

import React, { useState, useEffect } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { sanitizeLocation, sanitizeCityName, DEFAULT_LUCKNOW_LOCATION } from '../../utils/locationSanitizer';

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

    const applyLocation = (locObj) => {
      const sanitized = sanitizeLocation(locObj);
      try {
        localStorage.setItem('codeguru_selected_location', JSON.stringify(sanitized));
      } catch (e) {}
      onSelectLocation(sanitized);
      setIsLocating(false);
      handleClose();
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const apiRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await apiRes.json();

            let rawCity = data.city || data.locality || data.principalSubdivision || 'Lucknow';
            let state = data.principalSubdivision || 'Uttar Pradesh';
            let city = sanitizeCityName(rawCity, state);

            const getStateCode = (st) => {
              if (!st) return 'UP';
              const s = st.toLowerCase();
              if (s.includes('maharashtra')) return 'MH';
              if (s.includes('uttar pradesh')) return 'UP';
              if (s.includes('delhi')) return 'DL';
              if (s.includes('karnataka')) return 'KA';
              if (s.includes('telangana')) return 'TS';
              if (s.includes('tamil nadu')) return 'TN';
              if (s.includes('gujarat')) return 'GJ';
              if (s.includes('rajasthan')) return 'RJ';
              return 'UP';
            };

            const cityStr = `${city}, ${getStateCode(state)}`;
            applyLocation({
              id: 'auto-gps',
              name: cityStr,
              city,
              state,
              icon: '📍',
              autoDetected: true
            });
            return;
          } catch (err) {}

          tryIPLookup();
        },
        () => {
          tryIPLookup();
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      tryIPLookup();
    }

    async function tryIPLookup() {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data && data.city) {
          const city = sanitizeCityName(data.city, data.region);
          const cityStr = `${city}, ${data.region_code || 'UP'}`;
          applyLocation({
            id: 'auto-ip',
            name: cityStr,
            city,
            state: data.region || 'Uttar Pradesh',
            icon: '📍',
            autoDetected: true
          });
          return;
        }
      } catch (e) {}
      applyLocation(DEFAULT_LUCKNOW_LOCATION);
    }
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md select-none transition-all duration-300 ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm bg-white rounded-3xl border border-cyan-200 shadow-2xl flex flex-col p-5 transition-all duration-300 transform overflow-hidden ${
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
              <p className="text-[11px] text-slate-500">Detecting your current live city</p>
            </div>
          </div>
          <button
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
            <h4 className="text-sm font-extrabold text-slate-800">
              {isLocating ? 'Requesting GPS Location...' : (selectedLocation ? `Current City: ${selectedLocation.name}` : 'Auto-Detecting Location')}
            </h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Allow browser location permission to automatically sync jobs & campus placement drives for your current city.
            </p>
          </div>

          <button
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

