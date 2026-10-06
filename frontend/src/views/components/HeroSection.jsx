'use client';

import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Award } from 'lucide-react';
import TechOrbit from './TechOrbit';

/**
 * HeroSection Component
 * 
 * Responsive 2-column layout:
 * - Left side: Heading, Subtext, Trust Badges, and CTA buttons.
 * - Right side: <TechOrbit /> component (stacks below on mobile <= 480px).
 */
export default function HeroSection({ onOpenContactModal }) {
  return (
    <section className="w-full bg-gradient-to-b from-amber-50/50 via-orange-50/25 to-slate-50 py-1 sm:py-2 px-2 sm:px-4 flex justify-center items-center overflow-hidden select-none">
      <div className="w-full max-w-[740px] flex justify-center items-center p-0">
        <TechOrbit
          centerImageSrc="/images/codeguru-guru-logo.png"
          onOpenContactModal={onOpenContactModal}
        />
      </div>
    </section>
  );
}
