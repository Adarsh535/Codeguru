/**
 * ============================================================================
 * CONTROLLER LAYER: BANNERS CONTROLLER (useBannersController.js)
 * ============================================================================
 * Custom hook handling hero section banner slides state, API fetching, and slider controls.
 */

import { useState, useEffect, useCallback } from 'react';
import { bannerModel } from '../models/bannerModel';

export function useBannersController() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadBanners = useCallback(async () => {
    setLoading(true);
    const data = await bannerModel.getBanners();
    setBanners(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const handleNext = () => {
    if (banners.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    if (banners.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length);
  };

  const setSlide = (index) => {
    if (index >= 0 && index < banners.length) {
      setCurrentIndex(index);
    }
  };

  return {
    banners,
    currentIndex,
    currentBanner: banners[currentIndex] || null,
    loading,
    handleNext,
    handlePrev,
    setSlide
  };
}
