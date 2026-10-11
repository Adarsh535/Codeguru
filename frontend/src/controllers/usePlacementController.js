'use client';

import { useState, useEffect } from 'react';
import { LOCATIONS, PLACEMENT_CATEGORIES, PLACEMENTS } from '../models/placementModel';
import { apiService } from '../services/apiService';
import { detectStudentRealLocation } from '../utils/geoLocator';
import { sanitizeLocation, sanitizeCityName, DEFAULT_AYODHYA_LOCATION } from '../utils/locationSanitizer';

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

    const applyDetectedLocation = (locObj) => {
      if (!isMounted || !locObj) return;
      const sanitized = sanitizeLocation(locObj);
      setSelectedLocation(sanitized);
      try {
        localStorage.setItem('codeguru_selected_location', JSON.stringify(sanitized));
      } catch (e) {}
      window.dispatchEvent(new Event('codeguru_location_updated'));
      apiService.pingTraffic('', sanitized.name);
    };

    const detectLocation = async () => {
      // 1. Initial cached check
      try {
        const saved = localStorage.getItem('codeguru_selected_location') || localStorage.getItem('codeguru_detected_location');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.name && isMounted) {
            const sanitized = sanitizeLocation(parsed);
            setSelectedLocation(sanitized);
          }
        }
      } catch (e) {}

      // 2. Real-time GPS & IP detection
      try {
        const loc = await detectStudentRealLocation();
        if (isMounted && loc?.name) {
          applyDetectedLocation(loc);
        }
      } catch (err) {
        if (isMounted && !selectedLocation) {
          applyDetectedLocation(DEFAULT_AYODHYA_LOCATION);
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
