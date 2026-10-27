'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ============================================================================
 * SCROLL REVEAL: SECTIONS FADE UP AS THEY ENTER THE SCREEN
 * ============================================================================
 * Any element with a data-reveal attribute is revealed once. Children of an
 * element with data-reveal-stagger get a small cascading delay.
 * Hidden state only applies after JS runs (html.reveal-ready), and anything
 * already on screen is shown in the same frame, so nothing flashes.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reveal = (el) => el.classList.add('is-revealed');

    document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', '');
        child.style.setProperty('--reveal-delay', `${Math.min(i, 8) * 70}ms`);
      });
    });

    const targets = Array.from(document.querySelectorAll('[data-reveal]:not(.is-revealed)'));
    const viewportBottom = window.innerHeight;
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < viewportBottom) reveal(el);
    });
    root.classList.add('reveal-ready');

    if (!('IntersectionObserver' in window)) {
      targets.forEach(reveal);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    targets.filter((el) => !el.classList.contains('is-revealed')).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
