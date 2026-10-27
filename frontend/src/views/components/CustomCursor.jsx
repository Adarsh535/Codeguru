'use client';

import { useEffect, useRef } from 'react';

/**
 * ============================================================================
 * CUSTOM CURSOR: ORANGE DOT + TRAILING RING (DESKTOP MOUSE ONLY)
 * ============================================================================
 * Off on touch devices and for visitors who prefer reduced motion.
 * The ring grows over links/buttons and shrinks while the mouse is pressed.
 */
const INTERACTIVE = 'a, button, [role="button"], summary, label, select, input[type="checkbox"], input[type="radio"]';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const root = document.documentElement;
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let frame = 0;

    const tick = () => {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      const target = e.target instanceof Element ? e.target : null;
      const overText = target && target.closest('input:not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable], iframe');
      dot.classList.toggle('cg-cursor-hidden', Boolean(overText));
      ring.classList.toggle('cg-cursor-hidden', Boolean(overText));
      ring.classList.toggle('is-hover', Boolean(target && target.closest(INTERACTIVE)));
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');
    const onLeave = () => {
      dot.classList.add('cg-cursor-hidden');
      ring.classList.add('cg-cursor-hidden');
    };
    const onEnter = () => {
      dot.classList.remove('cg-cursor-hidden');
      ring.classList.remove('cg-cursor-hidden');
    };

    root.classList.add('has-custom-cursor');
    frame = requestAnimationFrame(tick);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);

    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cg-cursor-ring cg-cursor-hidden hidden [@media(hover:hover)_and_(pointer:fine)]:block" aria-hidden="true" />
      <div ref={dotRef} className="cg-cursor-dot cg-cursor-hidden hidden [@media(hover:hover)_and_(pointer:fine)]:block" aria-hidden="true" />
    </>
  );
}
