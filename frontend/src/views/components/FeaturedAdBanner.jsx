'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { FALLBACK_AD } from '../../models/adModel';

export default function FeaturedAdBanner({ onOpenContactModal }) {
  const [ad, setAd] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAd = async () => {
      try {
        const ads = await apiService.getActiveAds('all');
        if (isMounted) {
          if (ads && ads.length > 0) {
            // Pick first active ad from any position
            const activeAd = ads[0];
            setAd(activeAd);
            setIsVisible(true);
          } else {
            // No active ads — hide section entirely
            setAd(FALLBACK_AD);
            setIsVisible(true);
          }
        }
      } catch (err) {
        console.warn('[FeaturedAdBanner] Error loading ad, keeping fallback:', err);
      }
    };

    fetchAd();

    // Re-check periodically or on focus for real-time CRM updates
    const handleFocus = () => fetchAd();
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(fetchAd, 5000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible || !ad) {
    return null;
  }

  const handleClick = () => {
    if (ad._id || ad.id) {
      apiService.trackAdClick(ad._id || ad.id);
    }
    if (!ad.linkUrl && onOpenContactModal) {
      // If no external link provided, opens inquiry modal on click as fallback
      // or simply does nothing if not needed
    }
  };

  const BannerContent = (
    <div className="w-full rounded-[16px] sm:rounded-[22px] bg-white border border-slate-200/90 p-1.5 sm:p-2.5 shadow-xs flex items-center justify-center overflow-hidden hover:shadow-md transition-all duration-300 group cursor-pointer">
      <img
        src={ad.imageUrl || '/images/arena-25-years.jpg'}
        alt={ad.title || 'Celebrating 25 Years - Arena Animation'}
        className="w-full h-[100px] sm:h-[160px] md:h-[200px] object-cover sm:object-fill rounded-xl mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
        onError={(e) => {
          e.currentTarget.src = '/images/arena-25-years.jpg';
        }}
      />
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 pt-2 sm:pt-3 w-full" aria-label="Featured Advertisement">
      {ad.linkUrl ? (
        <a
          href={ad.linkUrl}
          target={ad.openInNewTab !== false ? '_blank' : '_self'}
          rel={ad.openInNewTab !== false ? 'noopener noreferrer' : undefined}
          onClick={handleClick}
          className="block w-full"
          title={ad.title}
        >
          {BannerContent}
        </a>
      ) : (
        <div onClick={handleClick} className="w-full" title={ad.title}>
          {BannerContent}
        </div>
      )}
    </section>
  );
}
