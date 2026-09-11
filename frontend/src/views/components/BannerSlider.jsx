import React, { useState, useEffect, useRef } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import SparklesIcon from '@mui/icons-material/FlashOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { apiService } from '../../services/apiService';

const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    type: 'video',
    title: 'CodeGuru Official Video 🎥',
    subtitle: 'Watch Exclusive Campus Placement & Tech Drive Highlights',
    videoUrl: '/codeguru%20video.mp4',
    poster: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    badge: '🎬 FEATURED VIDEO',
    badgeColor: 'bg-rose-500 text-white border-rose-300 shadow-md',
    ctaText: 'Apply Drive',
    ctaColor: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300'
  },
  {
    id: 'default-2',
    type: 'image',
    title: 'MERN Stack Developer Bootcamp 🚀',
    subtitle: 'MongoDB • Express • React • Node.js | Live Projects + 100% Placement Support',
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80',
    badge: '🔥 NEW BATCH STARTING 15TH SEPT',
    badgeColor: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 text-slate-950 font-black border-amber-300 shadow-md',
    originalPrice: '₹14,999',
    price: '₹4,999',
    discount: '66% OFF',
    batchDate: 'New Batch Starts 15th Sept',
    ctaText: 'Enroll Now @ ₹4,999',
    ctaColor: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 shadow-emerald-900/30'
  }
];

export default function BannerSlider({ onOpenContactModal }) {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);

  useEffect(() => {
    let isMounted = true;
    apiService.getBanners().then(dynamicBanners => {
      if (isMounted && dynamicBanners && dynamicBanners.length > 0) {
        setSlides(dynamicBanners);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const videoRefs = useRef({});

  // Auto slide timer logic: image slides use 5s timer, video slides wait for video completion (onEnded)
  useEffect(() => {
    const currentSlide = slides[currentIndex];
    if (currentSlide.type === 'image') {
      const timer = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [currentIndex]);

  // Handle video play/pause on slide change
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

  // Touch Swipe Handlers for Mobile (280px+)
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
    <div className="w-full max-w-7xl mx-auto px-1.5 xxs:px-3 sm:px-6 mt-3 xxs:mt-4 sm:mt-5 mb-1 select-none">
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full h-[195px] xxs:h-[230px] sm:h-[310px] md:h-[370px] lg:h-[420px] rounded-3xl xxs:rounded-[32px] sm:rounded-[36px] overflow-hidden border border-slate-200/90 shadow-lg shadow-cyan-900/10 group"
      >
        {/* SLIDES CONTAINER */}
        <div
          className="w-full h-full flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative w-full h-full shrink-0 overflow-hidden bg-slate-950">
              {/* MEDIA: VIDEO OR IMAGE */}
              {slide.type === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={slide.videoUrl}
                    poster={slide.poster}
                    muted={isMuted}
                    playsInline
                    onEnded={() => {
                      handleNext();
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                </div>
              )}

              {/* OVERLAY CONTENT */}
              <div className="absolute inset-0 p-2.5 xxs:p-3.5 sm:p-6 flex flex-col justify-between z-10">
                {/* Top Badge & Video Sound Toggle */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 text-[8.5px] xxs:text-[9.5px] sm:text-xs font-black uppercase tracking-wider rounded-full border shadow-xs flex items-center gap-1 ${slide.badgeColor}`}>
                    <SparklesIcon className="!w-3 !h-3" />
                    {slide.badge}
                  </span>

                  {/* Video Mute/Unmute & Play/Pause Controls */}
                  {slide.type === 'video' && index === currentIndex && (
                    <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-full border border-white/20">
                      <button
                        onClick={() => toggleVideoPlay(index)}
                        className="w-6 h-6 xxs:w-7 xxs:h-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title={isPlaying ? 'Pause Video' : 'Play Video'}
                      >
                        {isPlaying ? <PauseIcon className="!w-3.5 !h-3.5" /> : <PlayArrowIcon className="!w-3.5 !h-3.5" />}
                      </button>
                      <button
                        onClick={toggleAudio}
                        className="w-6 h-6 xxs:w-7 xxs:h-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                      >
                        {isMuted ? <VolumeOffIcon className="!w-3.5 !h-3.5" /> : <VolumeUpIcon className="!w-3.5 !h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Slide Info & Call To Action Button */}
                <div className="max-w-xl">
                  <h2 className="text-xs xxs:text-sm sm:text-xl md:text-2xl font-black text-white font-heading leading-tight drop-shadow-md truncate">
                    {slide.title}
                  </h2>
                  <p className="text-[9.5px] xxs:text-xs sm:text-sm text-slate-200 mt-1 line-clamp-2 drop-shadow-sm font-medium">
                    {slide.subtitle}
                  </p>

                  {/* Price & Batch Details Pill */}
                  {slide.price && (
                    <div className="mt-1 xxs:mt-1.5 flex flex-wrap items-center gap-1.5">
                      <div className="flex items-baseline gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20">
                        <span className="text-[9px] xxs:text-[10px] font-bold text-slate-400 line-through">
                          {slide.originalPrice}
                        </span>
                        <span className="text-xs xxs:text-sm sm:text-base font-black text-amber-400">
                          {slide.price}
                        </span>
                        <span className="px-1.5 py-0.2 text-[8px] xxs:text-[9px] font-black bg-emerald-500 text-white rounded">
                          {slide.discount}
                        </span>
                      </div>
                      {slide.batchDate && (
                        <span className="px-2 py-0.5 text-[8px] xxs:text-[9.5px] sm:text-xs font-extrabold bg-indigo-600/90 text-white backdrop-blur-md rounded-lg border border-indigo-400/50 shadow-xs">
                          📅 {slide.batchDate}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-1.5 xxs:mt-2.5 flex items-center gap-1.5">
                    <button
                      onClick={onOpenContactModal}
                      className={`px-3 xxs:px-4 py-1 xxs:py-1.5 text-[9.5px] xxs:text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl shadow-md border border-white/30 flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer ${slide.ctaColor}`}
                    >
                      {slide.ctaText}
                      <ArrowForwardIcon className="!w-3.5 !h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LEFT NAV ARROW */}
        <button
          onClick={handlePrev}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 xxs:w-7 xxs:h-7 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 active:scale-90 z-20"
          title="Previous Slide"
        >
          <ChevronLeftIcon className="!w-3.5 !h-3.5 xxs:!w-4 xxs:!h-4" />
        </button>

        {/* RIGHT NAV ARROW */}
        <button
          onClick={handleNext}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 xxs:w-7 xxs:h-7 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 active:scale-90 z-20"
          title="Next Slide"
        >
          <ChevronRightIcon className="!w-3.5 !h-3.5 xxs:!w-4 xxs:!h-4" />
        </button>

        {/* BOTTOM PAGINATION DOTS */}
        <div className="absolute bottom-1.5 xxs:bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 bg-slate-950/40 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-4 xxs:w-5 bg-gradient-to-r from-amber-400 to-yellow-300'
                  : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
