'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  Globe,
  BookOpen
} from 'lucide-react';

export default function Footer({ selectedLocation, onOpenLocationModal, onOpenContactModal }) {
  const cityName = selectedLocation?.name || 'Ayodhya, UP';
  const encodedCity = encodeURIComponent(cityName);

  const certifications = [
    { title: 'MCA Registered Company', icon: '🏢' },
    { title: 'Government e-Marketplace (GeM)', icon: '🏛️' },
    { title: 'ISO 9001:2015 Certified Organization', icon: '📜' },
    { title: 'Recognized by Startup India', icon: '🚀' },
    { title: 'Registered under MSME (Udyam)', icon: '🏬' },
    { title: 'Digital India Initiative', icon: '🇮🇳' }
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/courses' },
    { name: 'Our Team', href: '/#team-section' },
    { name: 'Register', href: '/#contact-section' },
    { name: 'Our Placements', href: '/placements' },
    { name: 'Contact Us', href: '/#contact-section' }
  ];

  const policyLinks = [
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Refund & Cancellation Policy', href: '#' },
    { name: 'Payment Policy', href: '#' },
    { name: 'FAQs', href: '#' },
    { name: 'Legal Documents', href: '#' }
  ];

  const popularPrograms = [
    'Best Summer Training for CS Students in Ayodhya',
    'Best Summer Training for EC Students in Ayodhya',
    'Best Summer Training for Electrical Students in Ayodhya',
    'Best Summer Training for Mechanical Engineering Students in Ayodhya',
    'Corporate Training Programs in Ayodhya',
    'Best Apprenticeship Program in Ayodhya',
    'Syllabus-Based Training in Ayodhya',
    'On-Campus Training & Placement Drives in Ayodhya',
    'Top Company for Data Analytics Course in Ayodhya',
    'Software Testing & QA Automation Training in Ayodhya',
    'Best Company for MEAN Stack Training in Ayodhya',
    'Best Company For MERN Stack Training in Ayodhya',
    'Top Company for Summer Training on MERN Full Stack',
    'Best Fullstack NodeJS Training in Ayodhya'
  ];

  const moreTrainingLinks = [
    'Winter Training in Ayodhya',
    'Industrial & Vocational Training in Ayodhya',
    'Personality Development & Soft Skills Training in Ayodhya',
    'JavaScript & TypeScript Masterclass in Ayodhya',
    'HTML5 & Modern CSS3 Web Design in Ayodhya',
    'MERN Apprenticeship & Internship Program in Ayodhya',
    'Dot Net Core Enterprise Training in Ayodhya',
    '100% Job Assistance & Hiring Program in Ayodhya',
    'Civil Engineering Software Training in Ayodhya',
    'IoT & Hardware Robotics Automation in Ayodhya',
    'Digital Marketing & Business Growth Course in Ayodhya',
    'Data Science & Big Data Engineering in Ayodhya'
  ];

  const advancedCourses = [
    'Best Summer Training on MERN Stack in Ayodhya',
    'Best Summer Training on Python & AI in Ayodhya',
    'Best Summer Training on PHP Laravel in Ayodhya',
    'Best Summer Training on Java & SpringBoot in Ayodhya',
    'Best Summer Training on .NET & MSSQL in Ayodhya',
    'MSSQL Server Administration & Database in Ayodhya',
    'React JS & Next.js Modern Frontend Dev in Ayodhya',
    'Best Summer Training on Flutter App Dev in Ayodhya',
    'Best Summer Training on Android (Kotlin) in Ayodhya',
    'AI & Neural Networks Training in Ayodhya',
    'Machine Learning & Deep Learning in Ayodhya',
    'UI/UX & Graphics Designing in Ayodhya',
    'Web Designing & Frontend Architecture in Ayodhya',
    'Node.js & Express REST API Engineering in Ayodhya',
    'Ethical Hacking & Cyber Security Course in Ayodhya'
  ];

  const topCoursesInAyodhya = [
    'Top Data Analytics Course in Ayodhya',
    'Top Software Testing Course in Ayodhya',
    'Top MEAN Stack Course in Ayodhya',
    'Top Ethical Hacking Course in Ayodhya',
    'Top MERN Stack Course in Ayodhya',
    'Top Node JS Course in Ayodhya',
    'Top JavaScript Course in Ayodhya',
    'Top HTML & CSS Course in Ayodhya',
    'Top Digital Marketing Course in Ayodhya',
    'Top AI & Machine Learning Course in Ayodhya',
    'Top Data Science Course in Ayodhya',
    'Top Flutter App Development Course in Ayodhya'
  ];

  return (
    <footer className="w-full bg-slate-950 text-slate-300 pt-10 sm:pt-14 pb-8 border-t border-slate-800 relative z-20 select-none overflow-hidden">
      
      {/* AMBIENT BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* CERTIFICATIONS & RECOGNITION BADGES ROW */}
        <div className="w-full mb-10 pb-8 border-b border-slate-800/80">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 text-center md:text-left mb-4 flex items-center gap-2 justify-center md:justify-start">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Government Accreditations & Certifications</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {certifications.map((cert, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:border-slate-700 transition-all shadow-xs"
              >
                <span className="text-lg flex-shrink-0">{cert.icon}</span>
                <span className="text-[10.5px] font-bold leading-snug truncate">
                  {cert.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN 4-COLUMN FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-10 border-b border-slate-800">
          
          {/* COLUMN 1: BRAND & CONTACT INFO (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenContactModal}>
              <img
                src="/logo.png"
                alt="CodeGuru Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                onError={(e) => { e.target.src = '/logo-icon.png'; }}
              />
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-wider font-heading">
                  CODE<span className="text-orange-500">GURRU</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
                  CodeGuru Placement Academy
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Providing top-quality IT training, full stack web development bootcamps, and guaranteed job assistance services to engineering students and software professionals since 2020.
            </p>

            {/* FULL CONTACT ADDRESS DETAILS */}
            <div className="flex flex-col gap-2.5 pt-1 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-white text-xs">HQ Campus Address:</span>
                  <span className="text-slate-400 leading-snug">
                    CodeGuru Tower, Near Naya Ghat Bypass Road, Ayodhya, UP - 224123
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <a href="tel:9670912923" className="hover:text-white transition-colors">+91-96709-12923</a>
                  <span>/</span>
                  <a href="tel:6392361443" className="hover:text-white transition-colors">+91-6392-361-443</a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <a href="mailto:contact@codeguru.com" className="hover:text-white transition-colors font-semibold truncate">
                  contact@codeguru.com / support@codeguru.com
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-300 font-semibold">
                  Working Hours: Mon - Saturday: 9:00 AM - 7:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS & POLICIES (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <div>
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider border-b border-slate-800 pb-2 mb-3">
                Quick Links
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-medium">
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="hover:text-orange-400 transition-colors flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                      <span className="truncate">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider border-b border-slate-800 pb-2 mb-3">
                Policies & Feedback
              </h4>
              <ul className="flex flex-col gap-1.5 text-xs text-slate-400 font-medium">
                {policyLinks.map((policy, i) => (
                  <li key={i}>
                    <a href={policy.href} onClick={(e) => { e.preventDefault(); if (onOpenContactModal) onOpenContactModal(); }} className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      <span>{policy.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 3: POPULAR PROGRAMS (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              Popular Programs
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/courses?category=coding" className="hover:text-blue-400 transition-colors">
                  Full Stack MERN Development
                </Link>
              </li>
              <li>
                <Link href="/courses?category=coding" className="hover:text-blue-400 transition-colors">
                  Python Programming & AI/ML
                </Link>
              </li>
              <li>
                <Link href="/courses?category=coding" className="hover:text-blue-400 transition-colors">
                  C++ Data Structures & DSA
                </Link>
              </li>
              <li>
                <Link href="/courses?category=networking" className="hover:text-blue-400 transition-colors">
                  Networking & Server Admin
                </Link>
              </li>
              <li>
                <Link href="/courses?category=electrical" className="hover:text-blue-400 transition-colors">
                  Home Appliance Repair
                </Link>
              </li>
              <li>
                <Link href="/courses?category=marketing" className="hover:text-blue-400 transition-colors">
                  Digital Marketing Training
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: INTERACTIVE LOCATION MAP (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Current Location Map</span>
              </h4>
              <button
                suppressHydrationWarning
                onClick={onOpenLocationModal}
                className="text-[10px] font-bold text-orange-400 hover:text-orange-300 underline cursor-pointer"
                title="Change detected location"
              >
                Change
              </button>
            </div>

            {/* DETECTED LOCATION DISPLAY PILL */}
            <div
              onClick={onOpenLocationModal}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-orange-500/60 transition-all"
              title="Click to select location"
            >
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span className="text-xs font-bold text-white truncate">
                  {cityName}
                </span>
              </div>
              <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0">
                Live GPS
              </span>
            </div>

            {/* EMBEDDED INTERACTIVE GOOGLE MAP IFRAME FOR AYODHYA */}
            <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative shadow-inner group">
              <iframe
                title="CodeGuru Current Location Map"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.05)' }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodedCity}+Ayodhya&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              />
              <div
                onClick={onOpenLocationModal}
                className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors cursor-pointer"
                title="Click to expand location map"
              />
            </div>
            
            <p className="text-[10px] text-slate-500 font-medium leading-tight">
              Showing CodeGuru campus & partner center map for <span className="text-slate-300 font-bold">{cityName}</span>.
            </p>
          </div>

        </div>

        {/* ACCORDION CATEGORY LINKS ACCELERATOR (SEO KEYWORDS SECTION FOR AYODHYA) */}
        <div className="py-8 border-b border-slate-800/80 flex flex-col gap-6 text-xs">
          
          {/* SECTION 1: OUR POPULAR TRAINING PROGRAMS IN AYODHYA */}
          <div>
            <h5 className="font-extrabold text-slate-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-orange-400" />
              <span>Our Popular Training Programs in Ayodhya</span>
            </h5>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-slate-400 text-[11px] leading-relaxed">
              {popularPrograms.map((prog, idx) => (
                <span key={idx} className="hover:text-white transition-colors cursor-pointer" onClick={onOpenContactModal}>
                  {prog} {idx < popularPrograms.length - 1 ? <span className="text-slate-700 ml-2">•</span> : ''}
                </span>
              ))}
            </div>
          </div>

          {/* SECTION 2: MORE TRAINING LINKS IN AYODHYA */}
          <div>
            <h5 className="font-extrabold text-slate-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>More Training & Skill Links in Ayodhya</span>
            </h5>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-slate-400 text-[11px] leading-relaxed">
              {moreTrainingLinks.map((link, idx) => (
                <span key={idx} className="hover:text-white transition-colors cursor-pointer" onClick={onOpenContactModal}>
                  {link} {idx < moreTrainingLinks.length - 1 ? <span className="text-slate-700 ml-2">•</span> : ''}
                </span>
              ))}
            </div>
          </div>

          {/* SECTION 3: ADVANCED TRAINING PROGRAMS IN AYODHYA */}
          <div>
            <h5 className="font-extrabold text-slate-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Advanced Training Programs in Ayodhya</span>
            </h5>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-slate-400 text-[11px] leading-relaxed">
              {advancedCourses.map((adv, idx) => (
                <span key={idx} className="hover:text-white transition-colors cursor-pointer" onClick={onOpenContactModal}>
                  {adv} {idx < advancedCourses.length - 1 ? <span className="text-slate-700 ml-2">•</span> : ''}
                </span>
              ))}
            </div>
          </div>

          {/* SECTION 4: TOP COURSES IN AYODHYA */}
          <div>
            <h5 className="font-extrabold text-slate-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>Top Courses in Ayodhya</span>
            </h5>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-slate-400 text-[11px] leading-relaxed">
              {topCoursesInAyodhya.map((top, idx) => (
                <span key={idx} className="hover:text-white transition-colors cursor-pointer" onClick={onOpenContactModal}>
                  {top} {idx < topCoursesInAyodhya.length - 1 ? <span className="text-slate-700 ml-2">•</span> : ''}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* CORPORATE LEGAL REGISTRATION & INCORPORATION BLOCK */}
        <div className="py-6 border-b border-slate-800/80 bg-slate-900/50 p-4 sm:p-5 rounded-2xl my-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <div className="font-black text-white text-xs sm:text-sm">
              CodeGuru Technologies Private Limited
            </div>
            <div className="text-[11px] text-slate-400 leading-normal">
              <span className="font-bold text-slate-300">Company Type:</span> Private Limited <span className="mx-1">•</span> 
              <span className="font-bold text-slate-300">CIN:</span> U85499UP2025PTC233762 <span className="mx-1">•</span> 
              <span className="font-bold text-slate-300">Date of Incorporation:</span> 15-Oct-2025
            </div>
            <div className="text-[10.5px] text-slate-500">
              Registered Office Address: CodeGuru Tower, Near Naya Ghat Bypass Road, Ayodhya, UP - 224123
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-amber-400 font-extrabold text-[11px]">
              MSME & Startup India
            </span>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span>© {new Date().getFullYear()} CodeGuru Technologies Private Limited. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-semibold text-xs">
            <span className="hover:text-white cursor-pointer" onClick={onOpenContactModal}>Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer" onClick={onOpenContactModal}>Terms & Conditions</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer" onClick={onOpenContactModal}>Contact Us</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
