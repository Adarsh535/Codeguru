import React, { useState, useEffect } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { sanitizeLocation, sanitizeCityName, DEFAULT_LUCKNOW_LOCATION } from '../../utils/locationSanitizer';

export default function LocationModal({ isOpen, onClose, locations, selectedLocation, onSelectLocation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocating, setIsLocating] = useState(false);
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

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

    // 1. Try HTML5 Geolocation API FIRST for physical device GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const geoData = await geoRes.json();
            if (geoData && geoData.address) {
              const rawCity = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.city_district || 'Lucknow';
              const city = sanitizeCityName(rawCity, geoData.address.state);
              const cityStr = `${city}, UP`;
              applyLocation({
                id: 'auto-gps',
                name: cityStr,
                city,
                state: geoData.address.state || 'Uttar Pradesh',
                icon: '📍',
                autoDetected: true
              });
              return;
            }
          } catch (err) {}

          // Fallback to IP inside GPS success callback if reverse geocode fails
          tryIPLookup();
        },
        () => {
          // GPS Permission denied / timeout -> fallback to IP
          tryIPLookup();
        },
        { timeout: 4000, enableHighAccuracy: true }
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

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md select-none transition-all duration-300 ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-full sm:max-w-md min-w-[280px] max-h-[90vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl border border-cyan-200 shadow-2xl flex flex-col transition-all duration-300 transform overflow-hidden ${
          isClosing ? 'animate-modal-slide-down' : 'animate-modal-slide-up'
        }`}
      >
        {/* Sticky Header Container */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-3 xxs:p-4 pb-2.5 border-b border-slate-200 shrink-0">
          {/* Top Pull Handle Indicator */}
          <div className="pb-1.5 flex justify-center cursor-pointer" onClick={handleClose}>
            <div className="w-10 xxs:w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full transition-colors" />
          </div>
          
          {/* Modal Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 xxs:p-2 bg-cyan-100 rounded-xl text-cyan-700 flex items-center justify-center shrink-0">
                <LocationOnIcon className="!w-4 !h-4 xxs:!w-5 xxs:!h-5" />
              </div>
              <div>
                <h3 className="text-xs xxs:text-sm sm:text-base font-bold text-slate-900 font-heading">Select Location</h3>
                <p className="text-[10px] xxs:text-xs text-slate-500">Find job & placement drives near you</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-cyan-100 flex items-center justify-center text-slate-500 hover:text-cyan-900 transition-colors shrink-0 active:scale-95"
              title="Close modal"
            >
              <CloseIcon className="!w-4 !h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="p-2.5 xxs:p-4 flex flex-col flex-1 overflow-y-auto no-scrollbar">
          {/* GPS Auto-Detect Button */}
          <button
            onClick={handleGPSDetect}
            disabled={isLocating}
            className="w-full p-2.5 rounded-xl xxs:rounded-2xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 flex items-center justify-center gap-2 text-xs font-bold text-cyan-800 transition-all active:scale-[0.98] shrink-0"
          >
            <MyLocationIcon className="!w-4 !h-4 text-cyan-600 animate-pulse" />
            {isLocating ? 'Detecting your GPS location...' : 'Use Current Location (GPS Auto-Detect)'}
          </button>

          {/* Search Bar */}
          <div className="relative mt-2.5 shrink-0">
            <SearchIcon className="!w-4 !h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search city, state or WFH..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          {/* Location List */}
          <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-2 no-scrollbar">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-2 flex items-center justify-between">
              <span>Popular Tech Hubs</span>
              <span className="text-cyan-700 font-bold">{filteredLocations.length} Available</span>
            </div>

            {filteredLocations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    try {
                      localStorage.setItem('codeguru_selected_location', JSON.stringify(loc));
                    } catch (e) {}
                    onSelectLocation(loc);
                    handleClose();
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all duration-200 active:scale-[0.98] ${
                    isSelected
                      ? 'bg-cyan-50 border border-cyan-400 shadow-xs'
                      : 'bg-slate-50 border border-slate-200 hover:bg-white hover:border-cyan-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{loc.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        {loc.name}
                        {loc.popular && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 text-amber-800 rounded border border-amber-300">
                            HOT
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">{loc.state} • {loc.count} Active Drives</span>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">
                      <CheckIcon className="!w-3.5 !h-3.5" />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Select</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

