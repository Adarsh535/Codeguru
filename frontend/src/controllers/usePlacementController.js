'use client';

import { useState, useEffect } from 'react';
import { LOCATIONS, PLACEMENT_CATEGORIES, PLACEMENTS } from '../models/placementModel';
import { apiService } from '../services/apiService';
import { sanitizeLocation, sanitizeCityName, DEFAULT_LUCKNOW_LOCATION } from '../utils/locationSanitizer';

export function usePlacementController() {
  const [locations] = useState(LOCATIONS);
  const [categories] = useState(PLACEMENT_CATEGORIES);
  const [placements] = useState(PLACEMENTS);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(PLACEMENT_CATEGORIES[0]);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Auto-detect visitor location on website load
  useEffect(() => {
    let isMounted = true;

    const getStateCode = (stateName) => {
      if (!stateName) return 'UP';
      const s = stateName.toLowerCase();
      if (s.includes('maharashtra')) return 'MH';
      if (s.includes('uttar pradesh')) return 'UP';
      if (s.includes('delhi')) return 'DL';
      if (s.includes('karnataka')) return 'KA';
      if (s.includes('telangana')) return 'TS';
      if (s.includes('tamil nadu')) return 'TN';
      if (s.includes('gujarat')) return 'GJ';
      if (s.includes('rajasthan')) return 'RJ';
      if (s.includes('madhya pradesh')) return 'MP';
      if (s.includes('west bengal')) return 'WB';
      if (s.includes('bihar')) return 'BR';
      if (s.includes('punjab')) return 'PB';
      if (s.includes('haryana')) return 'HR';
      return 'UP';
    };

    const applyDetectedLocation = (locObj) => {
      if (!isMounted) return;
      const sanitized = sanitizeLocation(locObj);
      setSelectedLocation(sanitized);
      try {
        localStorage.setItem('codeguru_selected_location', JSON.stringify(sanitized));
      } catch (e) {}
      window.dispatchEvent(new Event('codeguru_location_updated'));
      apiService.pingTraffic('', sanitized.name);
    };

    const detectLocation = async () => {
      // 1. Initial cached fallback check
      try {
        const saved = localStorage.getItem('codeguru_selected_location');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.name && isMounted) {
            const sanitized = sanitizeLocation(parsed);
            setSelectedLocation(sanitized);
          }
        }
      } catch (e) {}

      // 2. Trigger browser location permission prompt IMMEDIATELY on website open
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const { latitude, longitude } = pos.coords;
              
              // Reverse geocode via BigDataCloud API for fast Indian city detection
              const apiRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
              const data = await apiRes.json();

              let rawCity = data.city || data.locality || data.principalSubdivision || 'Lucknow';
              let state = data.principalSubdivision || 'Uttar Pradesh';
              let city = sanitizeCityName(rawCity, state);
              let stateCode = getStateCode(state);
              
              const locObj = {
                id: `auto-gps-${Date.now()}`,
                name: `${city}, ${stateCode}`,
                city,
                state,
                icon: '📍',
                autoDetected: true
              };

              applyDetectedLocation(locObj);
              return;
            } catch (err) {
              console.warn('GPS reverse geocode fallback to Nominatim:', err);
            }

            // Secondary reverse geocode via Nominatim
            try {
              const { latitude, longitude } = pos.coords;
              const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const geoData = await geoRes.json();
              if (geoData && geoData.address) {
                let rawCity = geoData.address.city || geoData.address.town || geoData.address.city_district || geoData.address.county || 'Lucknow';
                let state = geoData.address.state || 'Uttar Pradesh';
                let city = sanitizeCityName(rawCity, state);
                let stateCode = getStateCode(state);

                const locObj = {
                  id: `auto-geo-${Date.now()}`,
                  name: `${city}, ${stateCode}`,
                  city,
                  state,
                  icon: '📍',
                  autoDetected: true
                };

                applyDetectedLocation(locObj);
                return;
              }
            } catch (nomErr) {
              console.warn('Nominatim fallback error:', nomErr);
            }
          },
          async (geoError) => {
            console.info('Geolocation prompt notice:', geoError.message);
            // If GPS permission denied or pending, fallback to IP location lookup
            try {
              const res = await fetch('https://ipapi.co/json/');
              const data = await res.json();
              if (isMounted && data && data.city) {
                let city = sanitizeCityName(data.city, data.region);
                const cityStr = `${city}, ${data.region_code || 'UP'}`;
                const locObj = {
                  id: 'auto-ip',
                  name: cityStr,
                  city,
                  state: data.region || 'Uttar Pradesh',
                  icon: '📍',
                  autoDetected: true
                };
                applyDetectedLocation(locObj);
              }
            } catch (ipErr) {
              if (isMounted && !selectedLocation) {
                applyDetectedLocation(DEFAULT_LUCKNOW_LOCATION);
              }
            }
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        // Fallback for browsers without geolocation API
        try {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          if (isMounted && data && data.city) {
            let city = sanitizeCityName(data.city, data.region);
            const cityStr = `${city}, ${data.region_code || 'UP'}`;
            const locObj = {
              id: 'auto-ip',
              name: cityStr,
              city,
              state: data.region || 'Uttar Pradesh',
              icon: '📍',
              autoDetected: true
            };
            applyDetectedLocation(locObj);
          }
        } catch (e) {
          if (isMounted && !selectedLocation) {
            applyDetectedLocation(DEFAULT_LUCKNOW_LOCATION);
          }
        }
      }
    };

    detectLocation();

    return () => { isMounted = false; };
  }, []);

  // Filter placements by location & category (with fallback to show all drives if town has no specific filter)
  const filteredPlacements = placements.filter(item => {
    if (selectedLocation && selectedLocation.id !== 'all' && !selectedLocation.autoDetected) {
      const locName = selectedLocation.name.toLowerCase();
      const itemLoc = item.location.toLowerCase();
      if (selectedLocation.name.includes('Remote') || selectedLocation.id === 'loc-6') {
        if (!itemLoc.includes('remote') && !itemLoc.includes('work from home')) return false;
      } else if (!itemLoc.includes(locName.split(',')[0])) {
        return false;
      }
    }

    if (selectedCategory && selectedCategory.id !== 'all') {
      if (item.type !== selectedCategory.id) return false;
    }

    return true;
  });

  const finalPlacements = filteredPlacements.length > 0 ? filteredPlacements : placements;

  const handleResetFilters = () => {
    setSelectedLocation(null);
    setSelectedCategory(categories[0]);
  };

  return {
    locations,
    categories,
    placements: finalPlacements,
    selectedLocation,
    setSelectedLocation,
    selectedCategory,
    setSelectedCategory,
    isLocationModalOpen,
    setIsLocationModalOpen,
    isPlacementModalOpen,
    setIsPlacementModalOpen,
    isContactModalOpen,
    setIsContactModalOpen,
    handleResetFilters
  };
}
