'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Award,
  Globe,
  BookOpen
} from 'lucide-react';

export default function Footer({ selectedLocation, onOpenLocationModal, onOpenContactModal }) {

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
    <footer className="w-full bg-gradient-to-b from-[#090d16] via-[#050811] to-[#02040a] text-slate-200 pt-12 sm:pt-16 pb-8 border-t border-slate-800/80 relative z-20 select-none overflow-hidden font-sans">
      
      {/* AMBIENT BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* MAIN 3-COLUMN FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          
          {/* COLUMN 1: BRAND & CONTACT INFO (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={onOpenContactModal}>
              <div className="w-12 h-12 rounded-xl bg-[#090d16] border-1.5 border-amber-500/70 shadow-lg shadow-amber-500/10 p-1 flex items-center justify-center group-hover:border-amber-400 group-hover:scale-105 transition-all">
                <img
                  src="/logo.png"
                  alt="CodeGuru Logo"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => { e.target.src = '/logo-icon.png'; }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-wide font-heading text-white flex items-center gap-1 select-none">
                  CODE<span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">GURRU</span>
                </span>
                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest mt-0.5">
                  CODEGURU PLACEMENT ACADEMY
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed font-normal">
              Providing industry-leading IT training, full stack web development bootcamps, and guaranteed 100% placement assistance to engineering students & IT job seekers since 2020.
            </p>

          </div>

          {/* COLUMN 2: QUICK LINKS & POLICIES (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <div className="mb-3">
                <h4 className="text-white font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                  <span>Quick Links</span>
                </h4>
                <div className="h-0.5 w-10 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mt-1.5" />
              </div>
              <ul className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="group flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors">
                      <ArrowRight className="w-3 h-3 text-amber-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      <span className="truncate">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-3">
                <h4 className="text-white font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                  <span>Policies & Feedback</span>
                </h4>
                <div className="h-0.5 w-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mt-1.5" />
              </div>
              <ul className="flex flex-col gap-2 text-xs font-semibold">
                {policyLinks.map((policy, i) => (
                  <li key={i}>
                    <a
                      href={policy.href}
                      onClick={(e) => { e.preventDefault(); if (onOpenContactModal) onOpenContactModal(); }}
                      className="group flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform" />
                      <span>{policy.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 3: POPULAR PROGRAMS (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div>
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">
                Popular Programs
              </h4>
              <div className="h-0.5 w-10 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full mt-1.5 mb-3" />
            </div>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold text-slate-300">
              <li>
                <Link href="/courses?category=coding" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                  <span>Full Stack MERN</span>
                </Link>
              </li>
              <li>
                <Link href="/courses?category=coding" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                  <span>Python & AI/ML</span>
                </Link>
              </li>
              <li>
                <Link href="/courses?category=coding" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                  <span>C++ & DSA Masterclass</span>
                </Link>
              </li>
              <li>
                <Link href="/courses?category=networking" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                  <span>Networking & Server</span>
                </Link>
              </li>
              <li>
                <Link href="/courses?category=electrical" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                  <span>Home Appliance Repair</span>
                </Link>
              </li>
              <li>
                <Link href="/courses?category=marketing" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                  <span>Digital Marketing</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ACCORDION CATEGORY LINKS ACCELERATOR (SEO KEYWORDS SECTION FOR AYODHYA) */}
        <div className="py-8 border-b border-slate-800/80 flex flex-col gap-6 text-xs">
          
          {/* SECTION 1: OUR POPULAR TRAINING PROGRAMS IN AYODHYA */}
          <div>
            <h5 className="font-extrabold text-slate-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
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



        {/* BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span>© {new Date().getFullYear()} CodeGuru Technologies Private Limited. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 font-semibold text-xs">
            <span className="hover:text-amber-400 cursor-pointer transition-colors" onClick={onOpenContactModal}>Privacy Policy</span>
            <span className="text-slate-600">•</span>
            <span className="hover:text-amber-400 cursor-pointer transition-colors" onClick={onOpenContactModal}>Terms & Conditions</span>
            <span className="text-slate-600">•</span>
            <span className="hover:text-amber-400 cursor-pointer transition-colors" onClick={onOpenContactModal}>Contact Us</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

