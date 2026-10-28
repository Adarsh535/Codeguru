'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Zap } from 'lucide-react';
import { apiService } from '../../services/apiService';

// Banner titles come from the admin panel; emoji are stripped so headlines stay clean
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu;
// ALL-CAPS titles typed in the admin panel are shown in Title Case; known acronyms stay upper case
const ACRONYMS = new Set(['AI', 'ML', 'IT', 'IOT', 'MNC', 'MNCS', 'LPA', 'UP', 'MERN', 'HTML', 'CSS', 'JS', 'PHP', 'SQL', 'DSA', 'AWS', 'CCNA', 'BCA', 'MCA', 'ITI', 'VFX', 'UI', 'UX', 'SEO', 'CEO', 'HR', 'PC', 'AC', 'GST', 'CCC', 'DCA', 'ADCA']);
const softenCaps = (text) => {
  const letters = text.replace(/[^A-Za-z]/g, '');
  if (letters.length < 8 || letters !== letters.toUpperCase()) return text;
  return text.replace(/[A-Za-z][A-Za-z0-9.+#]*/g, (word) =>
    ACRONYMS.has(word.toUpperCase().replace(/[^A-Z]/g, '')) ? word.toUpperCase() : word.charAt(0) + word.slice(1).toLowerCase()
  );
};
const cleanText = (text) => (typeof text === 'string' ? softenCaps(text.replace(EMOJI, '').replace(/\s{2,}/g, ' ').trim()) : text);
const cleanSlide = (slide) => ({
  ...slide,
  title: cleanText(slide.title) || '',
  subtitle: cleanText(slide.subtitle) || '',
  badge: cleanText(slide.badge) || '',
  ctaText: cleanText(slide.ctaText) || ''
});

// Ask Cloudinary for a compressed, right-sized image (WebP/AVIF where supported)
const optimizeImage = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('/upload/f_auto')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_1600/');
  }
  return url;
};

export default function BannerSlider({ onOpenContactModal }) {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const videoRefs = useRef({});

  useEffect(() => {
    let isMounted = true;

    // Immediately load from cache on client mount (safe from SSR hydration mismatch)
    try {
      const cached = sessionStorage.getItem('cg_cached_banners');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(p => p && (p.mediaUrl || p.imageUrl || p.videoUrl || p.poster));
          if (valid.length > 0) {
            setSlides(valid.map(cleanSlide));
          }
        }
      }
    } catch (e) {}

    const fetchBanners = () => {
      apiService.getBanners().then(dynamicBanners => {
        if (!isMounted) return;
        if (Array.isArray(dynamicBanners) && dynamicBanners.length > 0) {
          const formatted = dynamicBanners.map(b => {
            const media = b.mediaUrl || b.imageUrl || b.videoUrl || b.poster || '';
            const isVid = b.type === 'video' || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(media) || (typeof media === 'string' && media.includes('/video/'));
            const imageSource = b.imageUrl || (!isVid ? media : (b.poster || ''));
            const videoSource = b.videoUrl || (isVid ? media : '');
            return {
              ...cleanSlide(b),
              id: b._id || b.id,
              type: isVid ? 'video' : 'image',
              mediaUrl: media,
              videoUrl: videoSource,
              imageUrl: imageSource,
              poster: b.poster || (isVid ? imageSource : '')
            };
          });
          setSlides(formatted);
          try {
            sessionStorage.setItem('cg_cached_banners', JSON.stringify(formatted));
          } catch (e) {}
        } else if (Array.isArray(dynamicBanners) && dynamicBanners.length === 0) {
          setSlides([]);
          try {
            sessionStorage.removeItem('cg_cached_banners');
          } catch (e) {}
        }
      }).catch(() => {});
    };

    fetchBanners();

    // 1. Live SSE update listeners
    window.addEventListener('codeguru_refresh_banners', fetchBanners);
    window.addEventListener('codeguru_refresh_all', fetchBanners);
    window.addEventListener('focus', fetchBanners);

    return () => {
      isMounted = false;
      window.removeEventListener('codeguru_refresh_banners', fetchBanners);
      window.removeEventListener('codeguru_refresh_all', fetchBanners);
      window.removeEventListener('focus', fetchBanners);
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const currentSlide = slides[currentIndex];
    const isVid = currentSlide && (currentSlide.type === 'video' || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(currentSlide.mediaUrl || currentSlide.videoUrl || ''));
    const timer = setInterval(() => {
      handleNext();
    }, isVid ? 8000 : 5000);
    return () => clearInterval(timer);
  }, [currentIndex, slides]);

  useEffect(() => {
    Object.keys(videoRefs.current).forEach((key) => {
      const video = videoRefs.current[key];
      if (video) {
        if (parseInt(key) === currentIndex) {
          video.currentTime = 0;
          video.play().catch(() => {});
          setIsPlaying(true);
        } else {
          video.pause();
        }
      }
    });
  }, [currentIndex]);

  const handleNext = () => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleVideoPlay = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleAudio = () => {
    setIsMuted((prev) => !prev);
    Object.values(videoRefs.current).forEach((video) => {
      if (video) video.muted = !isMuted;
    });
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 40) {
      handleNext();
    } else if (distance < -40) {
      handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // While loading on first load (no cache yet), show an elegant dark skeleton
  if (slides.length === 0) {
    return (
      <div className="w-full px-0 pt-0 mb-4 sm:mb-6 select-none">
        <div className="relative w-full aspect-[16/9] sm:aspect-[24/8] lg:aspect-[28/8] max-h-[380px] rounded-b-2xl sm:rounded-b-[48px] md:rounded-b-[56px] overflow-hidden bg-slate-900 border border-slate-800 animate-pulse flex items-end p-6 sm:p-10">
          <div className="space-y-3 w-full max-w-md">
            <div className="h-4 w-28 bg-slate-800 rounded-md" />
            <div className="h-7 w-64 sm:w-80 bg-slate-800 rounded-lg" />
            <div className="h-4 w-40 sm:w-56 bg-slate-800 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-0 pt-0 mb-4 sm:mb-6 select-none">
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-[16/9] sm:aspect-[24/8] lg:aspect-[28/8] max-h-[380px] rounded-b-2xl sm:rounded-b-[48px] md:rounded-b-[56px] overflow-hidden bg-slate-900 group"
      >
        {/* SLIDES TRACK */}
        <div
          className="w-full h-full flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const videoSource = slide.videoUrl || slide.mediaUrl || '';
            const imageSource = slide.imageUrl || slide.mediaUrl || slide.poster || '';
            const isVideoSlide = slide.type === 'video' || (videoSource && (/\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(videoSource) || (typeof videoSource === 'string' && videoSource.includes('/video/'))));

            return (
              <div key={slide.id || index} className="relative w-full h-full shrink-0 overflow-hidden bg-slate-900">
                {isVideoSlide ? (
                  <div className="relative w-full h-full">
                    <video
                      suppressHydrationWarning
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={videoSource}
                      poster={slide.poster}
                      muted={isMuted}
                      playsInline
                      preload={index === 0 ? 'auto' : 'none'}
                      autoPlay={index === 0}
                      loop
                      onEnded={handleNext}
                      className="w-full h-full object-cover opacity-100"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={optimizeImage(imageSource) || imageSource}
                      alt={slide.title || 'CodeGurru Banner'}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      decoding="async"
                      onError={(e) => {
                        if (imageSource && e.currentTarget.src !== imageSource) {
                          e.currentTarget.src = imageSource;
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* HEADLINE / SUBTITLE / CTA OVERLAY (F12) */}
                {Boolean(slide.badge || slide.title || slide.subtitle || slide.ctaText) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-10 pointer-events-none">
                    <div className="max-w-2xl space-y-2 pointer-events-auto">
                      {Boolean(slide.badge) && (
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-white/15 text-amber-200 backdrop-blur-sm">
                          {slide.badge}
                        </span>
                      )}
                      {Boolean(slide.title) && (
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white font-heading leading-tight">
                          {slide.title}
                        </h2>
                      )}
                      {Boolean(slide.subtitle) && (
                        <p className="text-sm sm:text-base text-slate-200/90 line-clamp-2 max-w-xl">
                          {slide.subtitle}
                        </p>
                      )}
                      {Boolean(slide.ctaText) && (
                        <div className="pt-2">
                          <button
                            suppressHydrationWarning
                            type="button"
                            onClick={onOpenContactModal}
                            className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-colors cursor-pointer"
                          >
                            {slide.ctaText} →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* TOP-RIGHT CONTROLS (Play/Pause & Mute for Video Slides Only) */}
              {isVideoSlide && (
                <div className="absolute top-4 right-4 z-10 pointer-events-auto">
                  <div className="bg-[#1e293b]/70 backdrop-blur-sm rounded-full flex items-center p-1 shadow-lg gap-1">
                    <button
                      suppressHydrationWarning
                      onClick={() => toggleVideoPlay(index)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                    <button
                      suppressHydrationWarning
                      onClick={toggleAudio}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-white bg-white/10 cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>

        {/* BOTTOM PAGINATION DOTS */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col items-center pointer-events-none">
            <div className="flex items-center gap-1.5 bg-slate-900/50 backdrop-blur-sm px-3 py-2 rounded-full pointer-events-auto">
              {slides.map((_, idx) => (
                <button
                  suppressHydrationWarning
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-4 bg-[#facc15]' : 'w-1.5 bg-slate-400'
                  }`}
                  title={`Slide ${idx + 1}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
