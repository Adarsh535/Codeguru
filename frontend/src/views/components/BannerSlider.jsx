'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Zap } from 'lucide-react';
import { apiService } from '../../services/apiService';

const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    type: 'image',
    title: 'Success Stories & Campus Placement Highlights 🚀',
    subtitle: 'Watch Exclusive Campus Placement & Tech Drive Highlights with 100% Verified Placements',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
    badge: 'SUCCESS STORIES',
    badgeColor: 'bg-[#10b981] text-white',
    ctaText: 'Explore Placements'
  },
  {
    id: 'default-2',
    type: 'video',
    title: 'CodeGuru Official Video 🎥',
    subtitle: 'Watch Exclusive Campus Placement & Tech Drive Highlights',
    videoUrl: '/codeguru%20video.mp4',
    poster: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    badge: 'FEATURED VIDEO',
    badgeColor: 'bg-rose-500 text-white',
    ctaText: 'Apply Drive'
  },
  {
    id: 'default-3',
    type: 'image',
    title: 'MERN Stack Developer Bootcamp 🔥',
    subtitle: 'MongoDB • Express • React • Node.js | Live Projects + 100% Placement Support',
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80',
    badge: 'NEW BATCH 2026',
    badgeColor: 'bg-gradient-to-r from-orange-400 to-amber-500 text-white',
    originalPrice: '₹14,999',
    price: '₹4,999',
    discount: '66% OFF',
    ctaText: 'Enroll Now @ ₹4,999'
  }
];

export default function BannerSlider({ onOpenContactModal }) {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);

  useEffect(() => {
    let isMounted = true;

    const fetchBanners = () => {
      apiService.getBanners().then(dynamicBanners => {
        if (isMounted && dynamicBanners && dynamicBanners.length > 0) {
          const formatted = dynamicBanners.map(b => {
            const media = b.mediaUrl || b.videoUrl || b.imageUrl || '';
            const isVid = b.type === 'video' || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(media) || media.includes('/video/');
            return {
              ...b,
              id: b._id || b.id,
              type: isVid ? 'video' : 'image',
              mediaUrl: media,
              videoUrl: b.videoUrl || media,
              imageUrl: b.imageUrl || media
            };
          });
          setSlides(formatted);
        }
      }).catch(() => {});
    };

    fetchBanners();

    // 1. Live SSE update listeners
    window.addEventListener('codeguru_refresh_banners', fetchBanners);
    window.addEventListener('codeguru_refresh_all', fetchBanners);
    window.addEventListener('focus', fetchBanners);

    // 2. Continuous smart auto-refresh polling (every 4 seconds)
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchBanners();
      }
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('codeguru_refresh_banners', fetchBanners);
      window.removeEventListener('codeguru_refresh_all', fetchBanners);
      window.removeEventListener('focus', fetchBanners);
    };
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const videoRefs = useRef({});

  useEffect(() => {
    const currentSlide = slides[currentIndex];
    const isVid = currentSlide && (currentSlide.type === 'video' || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(currentSlide.mediaUrl || currentSlide.videoUrl || ''));
    if (!currentSlide || !isVid) {
      const timer = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(timer);
    }
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
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
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

  return (
    <div className="w-full px-0 pt-0 mb-4 sm:mb-6 select-none">
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-[16/9] sm:aspect-[24/8] lg:aspect-[28/8] max-h-[380px] rounded-b-[36px] sm:rounded-b-[48px] md:rounded-b-[56px] overflow-hidden bg-slate-900 group"
      >
        {/* SLIDES TRACK */}
        <div
          className="w-full h-full flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const videoSource = slide.videoUrl || slide.mediaUrl;
            const imageSource = slide.imageUrl || slide.mediaUrl;
            const isVideoSlide = slide.type === 'video' || (videoSource && (/\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(videoSource) || videoSource.includes('/video/')));

            return (
              <div key={slide.id || index} className="relative w-full h-full shrink-0 overflow-hidden bg-slate-900">
                {isVideoSlide ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={videoSource}
                      poster={slide.poster}
                      muted={isMuted}
                      playsInline
                      autoPlay
                      loop
                      onEnded={handleNext}
                      className="w-full h-full object-cover opacity-100"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={imageSource}
                      alt={slide.title}
                      className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}

              {/* TOP-RIGHT CONTROLS (Play/Pause & Mute) */}
              <div className="absolute top-4 right-4 z-10 pointer-events-auto">
                <div className="bg-[#1e293b]/70 backdrop-blur-md rounded-full flex items-center p-1 shadow-lg gap-1">
                  {(slide.type === 'video' || (slide.videoUrl && (/\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(slide.videoUrl) || slide.videoUrl.includes('/video/')))) && (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>



        {/* BOTTOM PAGINATION DOTS */}
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

