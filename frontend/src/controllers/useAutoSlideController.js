/**
 * CONTROLLER: Auto Slide Controller Hook
 * Reusable logic for JS timer-based step-by-step horizontal scrolling sliders.
 */
import { useRef, useState, useEffect } from 'react';

export function useAutoSlideController(stepWidth = 235, delayMs = 1500) {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: stepWidth, behavior: 'smooth' });
        }
      }
    }, delayMs);

    return () => clearInterval(interval);
  }, [isHovered, stepWidth, delayMs]);

  return {
    scrollRef,
    isHovered,
    handleMouseEnter: () => setIsHovered(true),
    handleMouseLeave: () => setIsHovered(false)
  };
}
