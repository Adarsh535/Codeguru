'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Clock, ArrowRight, Code, Cpu, Server, Wrench, Zap, Globe, ExternalLink, CheckCircle2, Layers } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { apiService } from '../../services/apiService';

export default function CategoryNavbar({ onOpenContactModal, onOpenEnrollModal, isHomePage }) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = isHomePage !== undefined ? isHomePage : pathname === '/';

  const [activeCategory, setActiveCategory] = useState('coding');
  const [activeSubCategory, setActiveSubCategory] = useState('web');
  const [activeFilter, setActiveFilter] = useState('All');
  const [likedCourses, setLikedCourses] = useState({});
  const [customCourses, setCustomCourses] = useState([]);

  useEffect(() => {
    let isMounted = true;
    apiService.getCourses().then(dynamicData => {
      if (isMounted && dynamicData && dynamicData.length > 0) {
        setCustomCourses(dynamicData);
      }
    });

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category');
      if (catParam) {
        setActiveCategory(catParam);
      }
    }

    return () => { isMounted = false; };
  }, []);

  const SUB_CATEGORIES = {
    coding: [
      { id: 'web', label: 'Web Dev' },
      { id: 'app', label: 'App Dev' },
      { id: 'ai', label: 'AI & ML' }
    ],
    robotics: [
      { id: 'hardware', label: 'Robotics' },
      { id: 'iot', label: 'IoT' },
      { id: 'embedded', label: 'Embedded' }
    ],
    networking: [
      { id: 'server', label: 'Server & CCNA' },
      { id: 'cloud', label: 'Cloud & AWS' },
      { id: 'cyber', label: 'Cyber Security' }
    ],
    repair: [
      { id: 'mobile', label: 'Mobile Repair' },
      { id: 'laptop', label: 'Laptop & PC' },
      { id: 'bga', label: 'BGA IC' }
    ],
    electrical: [
      { id: 'ac', label: 'AC & Fridge' },
      { id: 'pcb', label: 'PCB Repair' }
    ],  
    marketing: [
      { id: 'ads', label: 'Performance Ads' },
      { id: 'seo', label: 'SEO & Media' }
    ]
  };

  const handleCategoryClick = (catId) => {
    if (isHome) {
      router.push(`/courses?category=${catId}`);
    } else {
      setActiveCategory(catId);
      const subList = SUB_CATEGORIES[catId];
      if (subList && subList.length > 0) {
        setActiveSubCategory(subList[0].id);
      }
    }
  };

  const handleSubCategoryClick = (subId) => {
    setActiveSubCategory(subId);
    const elem = document.getElementById(`subcat-${activeCategory}-${subId}`);
    if (elem) {
      const yOffset = -150;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || isHome) return;

    const handleScroll = () => {
      const subList = SUB_CATEGORIES[activeCategory] || [];
      const scrollPosition = window.scrollY + 220;

      for (let i = subList.length - 1; i >= 0; i--) {
        const sub = subList[i];
        const elem = document.getElementById(`subcat-${activeCategory}-${sub.id}`);
        if (elem) {
          const top = elem.offsetTop;
          if (scrollPosition >= top) {
            setActiveSubCategory(sub.id);
            const subBtn = document.getElementById(`subtab-btn-${sub.id}`);
            if (subBtn) {
              subBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategory, isHome]);

  const handleEnrollClick = (e) => {
    if (e) e.preventDefault();
    if (onOpenContactModal) {
      onOpenContactModal();
    }
    const contactElem = document.getElementById('contact-section');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleHeart = (e, courseId) => {
    e.stopPropagation();
    setLikedCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const categories = [
    {
      id: 'coding',
      name: 'Software Development',
      icon: Code,
      img: '/images/categories/coding.png',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'robotics',
      name: 'Robotics & IoT',
      icon: Cpu,
      img: '/images/categories/robotics.png',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'networking',
      name: 'Networking & Server',
      icon: Server,
      img: '/images/categories/networking.png',
      bgColor: 'bg-cyan-50'
    },
    {
      id: 'repair',
      name: 'Computer & Mobile Repair',
      icon: Wrench,
      img: '/images/categories/repair.png',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'electrical',
      name: 'Home Appliance Repair',
      icon: Zap,
      img: '/images/categories/electrical.png',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 'marketing',
      name: 'Digital Marketing',
      icon: Globe,
      img: '/images/categories/marketing.png',
      bgColor: 'bg-rose-50'
    }
  ];

  const trainingFilters = [
    { label: 'All', value: 'All', matchKeys: ['All'] },
    { label: '3 Months', value: '3 Months', matchKeys: ['3 Months', '3 Month', 'Internship'] },
    { label: '45 Days', value: '45 Days', matchKeys: ['45 Days', '45D', 'Summer', 'Winter'] },
    { label: '6 Months', value: '6 Months', matchKeys: ['6 Month', '6 Months'] },
    { label: 'One Year', value: 'One Year', matchKeys: ['One Year', '1 Year', 'Year'] }
  ];

  const INITIAL_COURSES = [
    // 1. SOFTWARE DEVELOPMENT (coding)
    {
      id: 'mern-stack',
      categoryId: 'coding',
      subCategory: 'web',
      title: 'Full-Stack Web Development (MERN)',
      duration: '6 Months',
      level: 'Intermediate',
      mode: 'Live Classes',
      price: '₹8,999',
      originalPrice: '₹14,000',
      discount: '35% OFF',
      tag: 'BESTSELLER',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      iconBg: 'bg-cyan-50'
    },
    {
      id: 'react-nextjs',
      categoryId: 'coding',
      subCategory: 'web',
      title: 'Frontend Masterclass (React & Next.js)',
      duration: '4 Months',
      level: 'Advanced',
      mode: 'Self-Paced',
      price: '₹3,999',
      originalPrice: '₹6,999',
      discount: '42% OFF',
      tag: 'BESTSELLER',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      iconBg: 'bg-slate-100'
    },
    {
      id: 'backend-node',
      categoryId: 'coding',
      subCategory: 'web',
      title: 'Backend Engineering & REST APIs',
      duration: '4 Months',
      level: 'Intermediate',
      mode: 'Live + Record',
      price: '₹5,499',
      originalPrice: '₹8,500',
      discount: '35% OFF',
      tag: null,
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      iconBg: 'bg-green-50'
    },
    {
      id: 'java-springboot',
      categoryId: 'coding',
      subCategory: 'web',
      title: 'Java & Spring Boot Enterprise Dev',
      duration: '6 Months',
      level: 'Advanced',
      mode: 'Live + Record',
      price: '₹7,499',
      originalPrice: '₹12,999',
      discount: '42% OFF',
      tag: null,
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      iconBg: 'bg-red-50'
    },
    {
      id: 'swift-ios',
      categoryId: 'coding',
      subCategory: 'app',
      title: 'iOS App Development with Swift',
      duration: '5 Months',
      level: 'Beginner',
      mode: 'Live Classes',
      price: '₹6,999',
      originalPrice: '₹11,000',
      discount: '36% OFF',
      tag: 'BESTSELLER',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
      iconBg: 'bg-orange-50'
    },
    {
      id: 'flutter-app',
      categoryId: 'coding',
      subCategory: 'app',
      title: 'Flutter Cross-Platform App Development',
      duration: '4 Months',
      level: 'Intermediate',
      mode: 'Live Classes',
      price: '₹5,999',
      originalPrice: '₹9,999',
      discount: '40% OFF',
      tag: 'POPULAR',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
      iconBg: 'bg-sky-50'
    },
    {
      id: 'android-kotlin',
      categoryId: 'coding',
      subCategory: 'app',
      title: 'Android App Development (Kotlin)',
      duration: '5 Months',
      level: 'Beginner',
      mode: 'Live + Record',
      price: '₹6,499',
      originalPrice: '₹10,500',
      discount: '38% OFF',
      tag: null,
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
      iconBg: 'bg-purple-50'
    },
    {
      id: 'python-aiml',
      categoryId: 'coding',
      subCategory: 'ai',
      title: 'Python Programming & AI/ML Masterclass',
      duration: '4 Months',
      level: 'Beginner to Advanced',
      mode: 'Live + Record',
      price: '₹6,999',
      originalPrice: '₹11,999',
      discount: '41% OFF',
      tag: 'BESTSELLER',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      iconBg: 'bg-blue-50'
    },
    {
      id: 'machine-learning',
      categoryId: 'coding',
      subCategory: 'ai',
      title: 'Machine Learning & Neural Networks',
      duration: '6 Months',
      level: 'Advanced',
      mode: 'Live Classes',
      price: '₹8,499',
      originalPrice: '₹14,999',
      discount: '43% OFF',
      tag: 'HOT',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
      iconBg: 'bg-amber-50'
    },
    {
      id: 'data-science',
      categoryId: 'coding',
      subCategory: 'ai',
      title: 'Data Science & Big Data Engineering',
      duration: '6 Months',
      level: 'Advanced',
      mode: 'Live + Project',
      price: '₹8,999',
      originalPrice: '₹15,000',
      discount: '40% OFF',
      tag: 'FEATURED',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      iconBg: 'bg-emerald-50'
    },

    // 2. ROBOTICS & IOT (robotics)
    {
      id: 'robotics-automation',
      categoryId: 'robotics',
      subCategory: 'robotics',
      title: 'Robotics & Hardware Automation',
      duration: '4 Months',
      level: 'Intermediate',
      mode: 'Live + Lab',
      price: '₹7,999',
      originalPrice: '₹12,000',
      discount: '33% OFF',
      tag: 'BESTSELLER',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
      iconBg: 'bg-indigo-50'
    },
    {
      id: 'arduino-iot',
      categoryId: 'robotics',
      subCategory: 'robotics',
      title: 'Arduino & Raspberry Pi Industrial IoT',
      duration: '3 Months',
      level: 'Beginner',
      mode: 'Hands-on Workshop',
      price: '₹5,499',
      originalPrice: '₹8,999',
      discount: '38% OFF',
      tag: 'POPULAR',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg',
      iconBg: 'bg-teal-50'
    },
    {
      id: 'embedded-systems',
      categoryId: 'robotics',
      subCategory: 'robotics',
      title: 'Embedded Systems & Microcontroller Dev',
      duration: '6 Months',
      level: 'Advanced',
      mode: 'Live + Lab Kit',
      price: '₹9,999',
      originalPrice: '₹16,000',
      discount: '37% OFF',
      tag: 'FEATURED',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
      iconBg: 'bg-blue-50'
    },

    // 3. NETWORKING & SERVER (networking)
    {
      id: 'ccna-net',
      categoryId: 'networking',
      subCategory: 'networking',
      title: 'Networking & Server Admin (CCNA)',
      duration: '3 Months',
      level: 'Beginner',
      mode: 'Live Classes',
      price: '₹4,499',
      originalPrice: '₹7,500',
      discount: '40% OFF',
      tag: 'POPULAR',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
      iconBg: 'bg-cyan-50'
    },
    {
      id: 'cloud-aws-devops',
      categoryId: 'networking',
      subCategory: 'networking',
      title: 'Cloud Engineering & AWS DevOps',
      duration: '6 Months',
      level: 'Advanced',
      mode: 'Live + Cloud Lab',
      price: '₹8,999',
      originalPrice: '₹14,999',
      discount: '40% OFF',
      tag: 'BESTSELLER',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
      iconBg: 'bg-amber-50'
    },
    {
      id: 'ethical-hacking-cyber',
      categoryId: 'networking',
      subCategory: 'networking',
      title: 'Cyber Security & Ethical Hacking',
      duration: '4 Months',
      level: 'Intermediate',
      mode: 'Live + Lab',
      price: '₹6,999',
      originalPrice: '₹11,500',
      discount: '39% OFF',
      tag: 'HOT',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
      iconBg: 'bg-slate-100'
    },

    // 4. COMPUTER & MOBILE REPAIR (repair)
    {
      id: 'mobile-chip-repair',
      categoryId: 'repair',
      subCategory: 'repair',
      title: 'Chip-Level Mobile Hardware Repairing',
      duration: '3 Months',
      level: 'Beginner to Pro',
      mode: 'Practical Workshop',
      price: '₹4,999',
      originalPrice: '₹8,999',
      discount: '44% OFF',
      tag: 'BESTSELLER',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
      iconBg: 'bg-emerald-50'
    },
    {
      id: 'laptop-chip-repair',
      categoryId: 'repair',
      subCategory: 'repair',
      title: 'Laptop & Desktop Motherboard Chip-Level Repair',
      duration: '4 Months',
      level: 'Intermediate',
      mode: 'Practical Lab',
      price: '₹6,499',
      originalPrice: '₹11,000',
      discount: '41% OFF',
      tag: 'POPULAR',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg',
      iconBg: 'bg-blue-50'
    },
    {
      id: 'smartphone-bga-ic',
      categoryId: 'repair',
      subCategory: 'repair',
      title: 'Advanced Smartphone BGA IC & CPU Reballing',
      duration: '6 Months',
      level: 'Master Class',
      mode: 'Practical Lab',
      price: '₹8,499',
      originalPrice: '₹14,500',
      discount: '41% OFF',
      tag: 'FEATURED',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg',
      iconBg: 'bg-slate-100'
    },

    // 5. HOME APPLIANCE REPAIR (electrical)
    {
      id: 'ac-fridge-repair',
      categoryId: 'electrical',
      subCategory: 'electrical',
      title: 'AC, Refrigerator & Washing Machine Master Course',
      duration: '3 Months',
      level: 'Beginner',
      mode: 'Field Practical',
      price: '₹5,299',
      originalPrice: '₹9,000',
      discount: '41% OFF',
      tag: 'BESTSELLER',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg',
      iconBg: 'bg-rose-50'
    },
    {
      id: 'inverter-pcb-repair',
      categoryId: 'electrical',
      subCategory: 'electrical',
      title: 'Inverter AC & PCB Micro-Circuit Repairing',
      duration: '4 Months',
      level: 'Intermediate',
      mode: 'Lab Practical',
      price: '₹6,999',
      originalPrice: '₹12,000',
      discount: '41% OFF',
      tag: 'HOT',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg',
      iconBg: 'bg-amber-50'
    },

    // 6. DIGITAL MARKETING (marketing)
    {
      id: 'digital-marketing-ads',
      categoryId: 'marketing',
      subCategory: 'marketing',
      title: 'Master Digital Marketing & Performance Ads',
      duration: '3 Months',
      level: 'Beginner',
      mode: 'Live Projects',
      price: '₹4,999',
      originalPrice: '₹8,500',
      discount: '41% OFF',
      tag: 'BESTSELLER',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
      iconBg: 'bg-blue-50'
    },
    {
      id: 'seo-social-media',
      categoryId: 'marketing',
      subCategory: 'marketing',
      title: 'SEO, Social Media & Content Growth Hacking',
      duration: '4 Months',
      level: 'Intermediate',
      mode: 'Live + Case Study',
      price: '₹5,999',
      originalPrice: '₹9,999',
      discount: '40% OFF',
      tag: 'POPULAR',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg',
      iconBg: 'bg-indigo-50'
    }
  ];

  const allCourses = [
    ...customCourses,
    ...INITIAL_COURSES.filter(ic => !customCourses.some(cc => (cc.id === ic.id || (cc.title && cc.title.toLowerCase() === ic.title.toLowerCase()))))
  ];

  const currentCategoryObj = categories.find(c => c.id === activeCategory) || categories[0];

  let headingTitle = `${currentCategoryObj.name} Programs`;
  const currentSubList = SUB_CATEGORIES[activeCategory] || [];
  const currentSubObj = currentSubList.find(s => s.id === activeSubCategory);
  if (currentSubObj && currentSubObj.id !== 'all') {
    headingTitle = `${currentSubObj.label} Programs`;
  }

  const displayedCourses = allCourses.filter(c => {
    const matchesCat = c.categoryId === activeCategory;
    
    let matchesSubCat = true;
    if (activeSubCategory && activeSubCategory !== 'all') {
      const subLower = activeSubCategory.toLowerCase();
      const courseSub = (c.subCategory || c.subCat || '').toLowerCase();
      const courseTitle = (c.title || '').toLowerCase();
      matchesSubCat = courseSub === subLower || 
                      courseSub.includes(subLower) || 
                      courseTitle.includes(subLower);
    }
    
    let matchesFilter = activeFilter === 'All';
    if (!matchesFilter) {
      const selectedFilterObj = trainingFilters.find(f => f.value === activeFilter || f.label === activeFilter);
      if (selectedFilterObj) {
        const keys = selectedFilterObj.matchKeys || [selectedFilterObj.value, selectedFilterObj.label];
        matchesFilter = keys.some(k => 
          c.duration?.toLowerCase().includes(k.toLowerCase()) || 
          c.title?.toLowerCase().includes(k.toLowerCase())
        );
      } else {
        matchesFilter = c.duration?.includes(activeFilter) || c.title?.includes(activeFilter);
      }
    }
    return matchesCat && matchesSubCat && matchesFilter;
  });

  return (
    <section className="w-full px-3 sm:px-4 pt-[5px] pb-1 bg-slate-50/50 select-none">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* CATEGORY SELECTOR CARDS GRID */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 md:gap-5 justify-items-center w-full pb-3 md:pb-2 pt-0 px-1 md:mx-0 md:px-0">
          {categories.map((cat) => {
            const isCatActive = activeCategory === cat.id;

            return (
              <button
                suppressHydrationWarning
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group flex flex-col items-center justify-start w-full gap-2 sm:gap-2.5 cursor-pointer"
                title={`Open ${cat.name} Courses`}
              >
                <div
                  className={`relative flex items-center justify-center p-1.5 sm:p-2.5 md:p-3 rounded-[16px] sm:rounded-[20px] md:rounded-[26px] transition-all duration-300 w-full max-w-[105px] sm:max-w-[145px] md:max-w-[170px] aspect-square ${
                    isCatActive && !isHome
                      ? 'border-2 border-blue-500 shadow-md shadow-blue-500/10 ring-4 ring-blue-50/60 bg-white scale-[1.02]'
                      : 'border border-slate-200/80 hover:border-blue-300 hover:shadow-md hover:-translate-y-1 bg-white'
                  }`}
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 p-0.5"
                  />
                </div>
                <span
                  className={`text-[11.5px] sm:text-[13px] md:text-[14.5px] font-extrabold text-center leading-snug px-0.5 max-w-[155px] tracking-tight transition-colors ${
                    isCatActive && !isHome ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-600'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* ON COURSES PAGE ONLY: SHOW FULL CATALOG BELOW CATEGORY CARDS */}
        {!isHome && (
          <div className="pt-2">
            {/* DOMAIN SUB-CATEGORY TABS FOR ALL CATEGORIES - STICKY SEGMENTED CONTROL */}
            {SUB_CATEGORIES[activeCategory] && SUB_CATEGORIES[activeCategory].length > 0 && (
              <div className="sticky top-[52px] sm:top-[72px] z-30 bg-slate-50/95 backdrop-blur-md py-2 sm:py-2.5 border-t border-b border-slate-200/80 shadow-xs my-2 sm:my-3 -mx-3 sm:mx-0 px-3 sm:px-0">
                <div className="w-full max-w-xl mx-auto bg-slate-200/80 p-1 rounded-xl sm:rounded-2xl flex items-center justify-between gap-1 shadow-inner border border-slate-300/50 overflow-x-auto scrollbar-none [ms-overflow-style:none] [scrollbar-width:none]">
                  {SUB_CATEGORIES[activeCategory].map((sub) => {
                    const isSubActive = activeSubCategory === sub.id;
                    return (
                      <button
                        suppressHydrationWarning
                        id={`subtab-btn-${sub.id}`}
                        key={sub.id}
                        onClick={() => handleSubCategoryClick(sub.id)}
                        className={`flex-1 min-w-max text-center whitespace-nowrap px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-extrabold text-[11px] min-[360px]:text-[12px] sm:text-[13.5px] transition-all duration-200 cursor-pointer ${
                          isSubActive
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-white/70 font-extrabold'
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TRAINING DURATION FILTER CONTAINER */}
            <div className="sticky top-[102px] sm:top-[128px] z-20 bg-slate-50/95 backdrop-blur-md py-2 border-b border-slate-200/80 shadow-2xs mb-4">
              <div className="w-full max-w-7xl mx-auto px-3 sm:px-4">
                <div className="bg-slate-100/90 p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 shadow-inner flex flex-col gap-2">
                  <div className="flex items-center justify-between px-1 pt-0.5">
                    <h4 className="text-[11px] sm:text-xs font-black text-slate-800 uppercase tracking-wider">
                      Training Duration
                    </h4>
                    <button
                      suppressHydrationWarning
                      onClick={() => setActiveFilter('All')}
                      className={`px-3 py-1 rounded-xl text-[10.5px] sm:text-[12px] font-extrabold tracking-tight transition-all duration-200 cursor-pointer ${
                        activeFilter === 'All'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                          : 'bg-white text-slate-700 border border-slate-200/90 shadow-2xs hover:bg-slate-50 hover:border-blue-300'
                      }`}
                    >
                      All
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2.5">
                    {trainingFilters.slice(1).map((filter) => {
                      const isFilterActive = activeFilter === filter.value;
                      return (
                        <button
                          suppressHydrationWarning
                          key={filter.value}
                          onClick={() => setActiveFilter(isFilterActive ? 'All' : filter.value)}
                          className={`flex-1 min-w-0 text-center whitespace-nowrap px-1.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl font-extrabold text-[10.5px] min-[360px]:text-[11.5px] sm:text-[13.5px] tracking-tight transition-all duration-200 cursor-pointer ${
                            isFilterActive
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                              : 'bg-white text-slate-700 border border-slate-200/90 shadow-2xs hover:bg-slate-50 hover:border-blue-300'
                          }`}
                        >
                          {filter.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* CONTINUOUS SUB-CATEGORY COURSE SECTIONS WITH AUTO SCROLLSPY */}
            <div className="space-y-10 pb-10">
              {(SUB_CATEGORIES[activeCategory] || []).map((sub) => {
                const subCourses = allCourses.filter(c => {
                  const matchesCat = c.categoryId === activeCategory;
                  const courseSub = (c.subCategory || c.subCat || '').toLowerCase();
                  const courseTitle = (c.title || '').toLowerCase();
                  const matchesSubCat = courseSub === sub.id.toLowerCase() || 
                                        courseSub.includes(sub.id.toLowerCase()) || 
                                        courseTitle.includes(sub.id.toLowerCase());

                  let matchesFilter = activeFilter === 'All';
                  if (!matchesFilter) {
                    const selectedFilterObj = trainingFilters.find(f => f.value === activeFilter || f.label === activeFilter);
                    if (selectedFilterObj) {
                      const keys = selectedFilterObj.matchKeys || [selectedFilterObj.value, selectedFilterObj.label];
                      matchesFilter = keys.some(k => 
                        c.duration?.toLowerCase().includes(k.toLowerCase()) || 
                        c.title?.toLowerCase().includes(k.toLowerCase())
                      );
                    } else {
                      matchesFilter = c.duration?.includes(activeFilter) || c.title?.includes(activeFilter);
                    }
                  }
                  return matchesCat && matchesSubCat && matchesFilter;
                });

                if (subCourses.length === 0 && activeFilter !== 'All') return null;

                return (
                  <div key={sub.id} id={`subcat-${activeCategory}-${sub.id}`} className="scroll-mt-36">
                    {/* SUB-CATEGORY SECTION HEADER */}
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200/80">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                      <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading tracking-tight">
                        {sub.label} Programs
                      </h3>
                      <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 ml-auto">
                        {subCourses.length} {subCourses.length === 1 ? 'Course' : 'Courses'}
                      </span>
                    </div>

                    {/* COURSE CARDS GRID FOR THIS SUB-CATEGORY */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {subCourses.map((course) => {
                        const isLiked = !!likedCourses[course.id];
                        const titleLower = (course.title || '').toLowerCase();
                        const isMern = course.id === 'mern-stack' || titleLower.includes('mern');

                        // 2x2 Pills Grid Data
                        const gridPills = [
                          { val: course.duration || '6 Months', label: '' },
                          { val: '5', label: 'Internships' },
                          { val: '5', label: 'Mock Tests' },
                          { val: '5', label: 'Projects' }
                        ];

                        // Checkmark Features List Data
                        const checkmarkFeatures = isMern ? [
                          'MongoDB, Express, React, Node.js',
                          'Frontend and Backend: React + Express',
                          'Database: MongoDB'
                        ] : titleLower.includes('java') ? [
                          'Core Java, Spring Boot, Microservices',
                          'Enterprise Architecture & REST APIs',
                          'Database: MySQL & PostgreSQL'
                        ] : titleLower.includes('python') || titleLower.includes('data') || titleLower.includes('learning') ? [
                          'Python, Data Science & AI/ML',
                          'Data Pipelines & Neural Networks',
                          'Database & Cloud: SQL + AWS'
                        ] : titleLower.includes('repair') || titleLower.includes('chip') || titleLower.includes('mobile') || titleLower.includes('laptop') || titleLower.includes('bga') ? [
                          'Practical Hardware & Schematics Diagnosis',
                          'Motherboard Micro-Soldering & IC Work',
                          '100% Practical Lab Training'
                        ] : titleLower.includes('ac') || titleLower.includes('pcb') || titleLower.includes('appliance') || titleLower.includes('fridge') ? [
                          'Inverter AC & PCB Circuit Repair',
                          'Component Level Troubleshooting',
                          'Job Ready Practical Field Training'
                        ] : titleLower.includes('marketing') || titleLower.includes('seo') || titleLower.includes('ads') ? [
                          'Google Ads, Meta Ads & Funnel Setup',
                          'SEO Optimization & Social Media Growth',
                          'Live Campaign & Ad Budget Management'
                        ] : titleLower.includes('robotics') || titleLower.includes('iot') || titleLower.includes('arduino') || titleLower.includes('embedded') ? [
                          'Hardware Programming & Microcontrollers',
                          'Sensors, Actuators & Wireless IoT Modules',
                          'Practical Electronics Project Building'
                        ] : titleLower.includes('networking') || titleLower.includes('ccna') || titleLower.includes('cloud') || titleLower.includes('hacking') || titleLower.includes('cyber') ? [
                          'Cisco CCNA, Cloud & Server Admin',
                          'Ethical Hacking & Network Security',
                          'Live Router, Switch & Cloud Labs'
                        ] : [
                          `${course.title} Core Track`,
                          'Hands-on Practical & Project Training',
                          'Certification & Job Assistance'
                        ];

                        return (
                          <div
                            key={course.id}
                            className="group relative flex flex-col bg-white border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] rounded-[20px] sm:rounded-[24px] p-3.5 min-[400px]:p-4 sm:p-6 transition-all duration-300 hover:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.12)] hover:border-blue-200 justify-between gap-3 sm:gap-4"
                          >
                            {/* ATTACHED BESTSELLER / TOP BADGE */}
                            {course.tag && (
                              <div className="absolute -top-3 left-4 sm:left-6 px-2.5 sm:px-3 py-0.5 bg-[#fde047] border border-[#facc15] text-[#713f12] font-black text-[9.5px] sm:text-[10.5px] rounded-lg shadow-2xs tracking-wider uppercase z-10">
                                {course.tag}
                              </div>
                            )}

                            {/* TOP ROW: ICON + TITLE + 2x2 PILLS GRID */}
                            <div className="flex flex-row gap-2.5 min-[400px]:gap-3.5 sm:gap-5 items-start">
                              {/* TECH LOGO CONTAINER (M E R N 4-box grid OR Course Icon) */}
                              {isMern ? (
                                <div className="w-16 h-16 min-[400px]:w-20 min-[400px]:h-20 sm:w-26 sm:h-26 bg-slate-50/90 border border-slate-200/80 rounded-xl sm:rounded-2xl p-1.5 min-[400px]:p-2 sm:p-2.5 flex-shrink-0 shadow-2xs mt-[8px]">
                                  <div className="grid grid-cols-2 gap-1 min-[400px]:gap-1.5 w-full h-full">
                                    <div className="bg-[#10b981] text-white font-black rounded flex items-center justify-center text-[10px] min-[400px]:text-xs sm:text-sm">M</div>
                                    <div className="bg-[#1e293b] text-white font-black rounded flex items-center justify-center text-[10px] min-[400px]:text-xs sm:text-sm">E</div>
                                    <div className="bg-[#06b6d4] text-white font-black rounded flex items-center justify-center text-[10px] min-[400px]:text-xs sm:text-sm">R</div>
                                    <div className="bg-[#84cc16] text-white font-black rounded flex items-center justify-center text-[10px] min-[400px]:text-xs sm:text-sm">N</div>
                                  </div>
                                </div>
                              ) : (
                                <div className={`w-16 h-16 min-[400px]:w-20 min-[400px]:h-20 sm:w-26 sm:h-26 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-200/80 shadow-2xs mt-[8px] ${course.iconBg || 'bg-slate-50'}`}>
                                  <img
                                    src={course.icon}
                                    alt={course.title}
                                    className="w-8 h-8 min-[400px]:w-10 min-[400px]:h-10 sm:w-12 sm:h-12 object-contain"
                                  />
                                </div>
                              )}

                              {/* TITLE & 2x2 PILLS GRID */}
                              <div className="flex flex-col min-w-0 flex-1">
                                <h3 className="font-extrabold text-slate-900 text-[14px] min-[400px]:text-[16px] sm:text-[19px] leading-tight mb-2 sm:mb-3 line-clamp-2">
                                  {course.title}
                                </h3>

                                {/* 2x2 PILLS GRID */}
                                <div className="grid grid-cols-2 gap-1 sm:gap-2 w-full">
                                  {gridPills.map((pill, idx) => (
                                    <div
                                      key={idx}
                                      className="bg-[#f0f6ff] border border-[#dbeafe] text-slate-600 px-1.5 min-[400px]:px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[9.5px] min-[400px]:text-[10.5px] sm:text-[12px] font-semibold flex items-center gap-1 sm:gap-1.5 whitespace-nowrap truncate"
                                    >
                                      <span className="font-black text-slate-900">{pill.val}</span>
                                      {pill.label && <span className="truncate">{pill.label}</span>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* DIVIDER LINE */}
                            <div className="w-full h-px bg-slate-100 my-0.5" />

                            {/* BOTTOM ROW: CHECKMARK FEATURES & CTA BUTTON */}
                            <div className="flex flex-row items-end justify-between gap-2 sm:gap-4 pt-0.5 mt-auto">
                              {/* CHECKMARK BULLETS */}
                              <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0 flex-1">
                                {checkmarkFeatures.map((feat, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 sm:gap-2 text-[11px] min-[400px]:text-[12px] sm:text-[13px] font-semibold text-slate-700">
                                    <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-blue-50 border border-blue-200/80 text-blue-600 font-extrabold text-[9px] sm:text-[10px] flex items-center justify-center flex-shrink-0">
                                      ✓
                                    </span>
                                    <span className="truncate">{feat}</span>
                                  </div>
                                ))}
                              </div>

                              {/* VIEW DETAILS BUTTON (COMPACT & RIGHT ALIGNED) */}
                              <button
                                suppressHydrationWarning
                                onClick={handleEnrollClick}
                                className="w-auto bg-[#2463eb] hover:bg-blue-700 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[11.5px] sm:text-xs md:text-sm font-extrabold flex items-center justify-center gap-1 sm:gap-1.5 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0 self-end"
                              >
                                View Details <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VIEW MORE BUTTON */}
            {isHome && (
              <div className="flex justify-center mt-2 pb-8">
                <button
                  suppressHydrationWarning
                  onClick={onOpenContactModal}
                  className="bg-slate-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  View More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
