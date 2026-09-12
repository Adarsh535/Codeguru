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

  useEffect(() => {
    const currentSlide = slides[currentIndex];
    if (!currentSlide || currentSlide.type === 'image') {
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
    <div className="w-full px-3 sm:px-4 pt-4 select-none">
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-[4/3] sm:aspect-[21/9] rounded-[28px] overflow-hidden shadow-xl bg-slate-900 group"
      >
        {/* SLIDES TRACK */}
        <div
          className="w-full h-full flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id || index} className="relative w-full h-full shrink-0 overflow-hidden bg-slate-900">
              {slide.type === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={slide.videoUrl}
                    poster={slide.poster}
                    muted={isMuted}
                    playsInline
                    onEnded={handleNext}
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}

              {/* GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#022069]/90 via-slate-900/30 to-transparent pointer-events-none" />

              {/* TOP-LEFT BADGE */}
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold font-sans tracking-wide shadow-md ${slide.badgeColor || 'bg-[#10b981] text-white'}`}>
                  <Zap className="w-3.5 h-3.5 fill-white text-white" />
                  <span>{slide.badge || 'SUCCESS STORIES'}</span>
                </div>
              </div>

              {/* TOP-RIGHT CONTROLS (Play/Pause & Mute) */}
              <div className="absolute top-4 right-4 z-10 pointer-events-auto">
                <div className="bg-[#1e293b]/70 backdrop-blur-md rounded-full flex items-center p-1 shadow-lg gap-1">
                  {slide.type === 'video' && (
                    <>
                      <button
                        onClick={() => toggleVideoPlay(index)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      </button>
                      <button
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

              {/* SLIDE CONTENT INFO */}
              <div className="absolute bottom-10 left-4 right-4 z-10 flex flex-col justify-end max-w-2xl">
                <h2 className="text-base sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md">
                  {slide.title}
                </h2>
                <p className="text-xs sm:text-base text-slate-200 mt-1 sm:mt-2 line-clamp-2 drop-shadow-sm font-medium">
                  {slide.subtitle}
                </p>

                {slide.price && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm sm:text-xl font-black text-amber-400">{slide.price}</span>
                    <span className="text-xs sm:text-sm text-slate-400 line-through">{slide.originalPrice}</span>
                    <span className="text-xs font-bold text-emerald-400">{slide.discount}</span>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={onOpenContactModal}
                    className="bg-[#2463eb] hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md transition-transform active:scale-95 cursor-pointer"
                  >
                    {slide.ctaText || 'Inquire Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LEFT NAV CHEVRON */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#1e293b]/60 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors z-20 pointer-events-auto cursor-pointer"
          title="Previous"
        >
          <ChevronLeft className="w-4.5 h-4.5" />
        </button>

        {/* RIGHT NAV CHEVRON */}
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#1e293b]/60 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors z-20 pointer-events-auto cursor-pointer"
          title="Next"
        >
          <ChevronRight className="w-4.5 h-4.5" />
        </button>

        {/* BOTTOM PAGINATION DOTS */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col items-center pointer-events-none">
          <div className="flex items-center gap-1.5 bg-slate-900/50 backdrop-blur-sm px-3 py-2 rounded-full pointer-events-auto">
            {slides.map((_, idx) => (
              <button
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

