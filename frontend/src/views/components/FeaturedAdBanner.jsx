'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';

/**
 * FeaturedAdBanner
 * - Shows ONLY when admin has at least one active ad in the CRM
 * - If no active ad exists (or all are hidden) → renders nothing
 * - No hardcoded fallback banner
 */
export default function FeaturedAdBanner({ onOpenContactModal }) {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAd = async () => {
      try {
        const ads = await apiService.getActiveAds('all');
        if (isMounted) {
          // Only set ad if admin has an active one, otherwise null (hidden)
          setAd(ads && ads.length > 0 ? ads[0] : null);
        }
      } catch (err) {
        // On error, keep hidden — don't show any fallback
        if (isMounted) setAd(null);
        console.warn('[FeaturedAdBanner] Could not load ads:', err);
      }
    };

    fetchAd();

    // Poll every 5s so admin changes reflect in real-time
    const interval = setInterval(fetchAd, 5000);
    const handleFocus = () => fetchAd();
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // No active ad from admin → render nothing
  if (!ad) return null;

  const handleClick = () => {
    if (ad._id || ad.id) {
      apiService.trackAdClick(ad._id || ad.id);
    }
  };

  const BannerContent = (
    <div className="w-full rounded-[16px] sm:rounded-[22px] bg-white border border-slate-200/90 p-1.5 sm:p-2.5 shadow-xs flex items-center justify-center overflow-hidden hover:shadow-md transition-all duration-300 group cursor-pointer">
      <img
        src={ad.imageUrl}
        alt={ad.title || 'Advertisement'}
        className="w-full h-[100px] sm:h-[160px] md:h-[200px] object-cover sm:object-fill rounded-xl mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
        onError={(e) => {
          // If image fails to load, hide the entire section
          e.currentTarget.closest('section')?.style && (e.currentTarget.closest('section').style.display = 'none');
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
