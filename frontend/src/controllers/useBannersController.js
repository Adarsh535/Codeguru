'use client';

/**
 * ============================================================================
 * FRONTEND MVC: BANNERS CONTROLLER (useBannersController.js)
 * ============================================================================
 * Manages promotional banners fetching, slide transitions, and auto-rotation.
 */

import { useState, useEffect, useCallback } from 'react';
import { bannerModel } from '../models/bannerModel';

export function useBannersController(autoplayIntervalMs = 5000) {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bannerModel.getBanners();
      if (Array.isArray(data) && data.length > 0) {
        setBanners(data);
      }
    } catch (err) {
      console.warn('[useBannersController] Error loading banners:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();

    if (typeof window !== 'undefined') {
      window.addEventListener('codeguru_refresh_banners', fetchBanners);
      return () => {
        window.removeEventListener('codeguru_refresh_banners', fetchBanners);
      };
    }
  }, [fetchBanners]);

  // Autoplay rotation
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length);
    }, autoplayIntervalMs);

    return () => clearInterval(timer);
  }, [banners.length, autoplayIntervalMs]);

  const nextSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < banners.length) {
      setCurrentIndex(index);
    }
  }, [banners.length]);

  return {
    banners,
    currentIndex,
    loading,
    nextSlide,
    prevSlide,
    goToSlide,
    refreshBanners: fetchBanners
  };
}
