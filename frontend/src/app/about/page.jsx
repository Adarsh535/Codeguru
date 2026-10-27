import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Users, CheckCircle2, Building, PhoneCall, Sparkles } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/business';

export const metadata = {
  title: 'About Us | Premier IT Academy in UP',
  description:
    'CodeGurru (UK VK Pvt. Ltd.) is an IT training, software development and computer repair company based in Ayodhya, Uttar Pradesh, founded by Kishan Pandey.',
  keywords: [
    'About CodeGurru',
    'CodeGurru UK VK Pvt. Ltd.',
    'Kishan Pandey Founder CodeGurru',
    'IT Training Institute Uttar Pradesh',
    'Best Computer Academy Lucknow',
    'Software Company Ayodhya',
  ],
  alternates: {
    canonical: 'https://codegurru.in/about',
  },
  openGraph: {
    title: 'About CodeGurru | Premier IT Academy & Tech Hub in Uttar Pradesh',
    description:
      'CodeGurru (UK VK Pvt. Ltd.) is an IT training, software development and computer repair company based in Uttar Pradesh, founded by Kishan Pandey.',
    siteName: 'CodeGurru (UK VK Pvt. Ltd.)',
    images: [{ url: '/logo.png', width: 800, height: 600, alt: 'About CodeGurru' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About CodeGurru | Premier IT Academy in Uttar Pradesh',
    description: 'Founded by Kishan Pandey under UK VK Pvt. Ltd., empowering youth with practical IT training.',
    images: ['/logo.png'],
  },
};

export default function AboutPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://codegurru.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About CodeGurru',
        item: 'https://codegurru.in/about',
      },
    ],
  };

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About CodeGurru (UK VK Pvt. Ltd.)',
    description:
      'CodeGurru is an IT training, software development and computer repair company based in Ayodhya, Uttar Pradesh, founded by Kishan Pandey.',
    mainEntity: {
      '@type': 'Person',
      name: 'Kishan Pandey',
      jobTitle: 'Founder & CEO',
      worksFor: {
        '@type': 'Organization',
        name: 'CodeGurru (UK VK Pvt. Ltd.)',
        url: 'https://codegurru.in',
      },
      description: 'Founder & CEO of CodeGurru (UK VK Pvt. Ltd.), driving technology education and software development across Uttar Pradesh.',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <div className="w-full bg-slate-50 min-h-screen pb-16">
        
        {/* HEADER HERO */}
        <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white px-4 pt-12 pb-16 sm:pb-20 relative overflow-hidden select-none">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs sm:text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>UK VK PVT. LTD. ENTERPRISE</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-bold font-heading tracking-tight mb-4">
              About CodeGurru
            </h1>
            
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Empowering youth, engineers, and local businesses across Uttar Pradesh with practical software skills and reliable technology services.
            </p>
          </div>
        </section>

        {/* CORE DEFINING PARAGRAPH (CITED DIRECTLY BY GOOGLE SEARCH & AI OVERVIEW) */}
        <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <h2 className="text-sm font-bold text-amber-600 mb-2">
              Official Corporate Identity
            </h2>
            <p className="text-base sm:text-xl font-bold text-slate-900 leading-relaxed mb-4">
              CodeGurru (UK VK Pvt. Ltd.) is an IT training, software development and computer repair company based in Ayodhya, Uttar Pradesh, founded by Kishan Pandey.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Established with a clear mission to bridge the gap between traditional university syllabus and high-demand corporate engineering requirements, CodeGurru provides hands-on coding bootcamps (MERN Stack, Python AI, Java, C++ &amp; DSA), bespoke enterprise web/mobile software engineering, and fast doorstep computer and laptop diagnostics.
            </p>
          </div>
        </div>

        {/* 3 PILLARS SECTION */}
        <div className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Practical IT Bootcamps</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              100% project-driven training with live deployments, daily 1-on-1 code debugging, and guaranteed placement drives.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold mb-3">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Software Development</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Custom business portals, billing ERPs, and mobile applications developed for regional businesses by UK VK Pvt. Ltd.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Computer &amp; Laptop Repair</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Same-day chip-level diagnostics, screen replacement, and speed upgrades with doorstep pickup in Lucknow &amp; Ayodhya.
            </p>
          </div>
        </div>

        {/* LEADERSHIP / FOUNDER SECTION */}
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <img
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=500&fit=crop&crop=faces"
              alt="Kishan Pandey - Founder & CEO CodeGurru (UK VK Pvt. Ltd.)"
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-amber-400 shrink-0 shadow-lg"
            />
            <div>
              <span className="text-xs font-bold text-amber-400 block mb-1">
                EXECUTIVE LEADERSHIP
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading">
                Kishan Pandey
              </h3>
              <p className="text-xs text-slate-400 font-bold mb-3">
                Founder &amp; CEO, CodeGurru (UK VK Pvt. Ltd.)
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                "Our vision at CodeGurru is to democratize high-end software engineering and IT careers for every student in Uttar Pradesh. Students no longer need to migrate to distant metros when world-class mentors, modern infrastructure, and top-tier MNC placements are right here."
              </p>
              <div className="flex items-center gap-3 text-xs">
                <Link href="/contact" className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all">
                  Contact Office
                </Link>
                <Link href="/courses" className="text-slate-300 hover:text-white font-bold underline text-xs">
                  Explore Courses
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
