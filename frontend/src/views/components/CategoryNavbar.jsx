'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Clock, ArrowRight, Code, Cpu, Server, Wrench, Zap, Globe, ExternalLink, CheckCircle2, Layers } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { apiService } from '../../services/apiService';
import CourseDetailsModal from './CourseDetailsModal';

export default function CategoryNavbar({ onOpenContactModal, onOpenEnrollModal, isHomePage }) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = isHomePage !== undefined ? isHomePage : pathname === '/';

  const [activeCategory, setActiveCategory] = useState('coding');
  const [activeSubCategory, setActiveSubCategory] = useState('web');
  const [activeFilter, setActiveFilter] = useState('All');
  const [likedCourses, setLikedCourses] = useState({});
  const [customCourses, setCustomCourses] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState(null);

  const scrollToCatalogSection = (delay = 40) => {
    setTimeout(() => {
      if (typeof window === 'undefined') return;
      const catalogElem = document.getElementById('course-catalog-section');
      if (catalogElem) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.getBoundingClientRect().height : (window.innerWidth < 640 ? 70 : 84);
        const rect = catalogElem.getBoundingClientRect();
        const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        const targetY = Math.max(0, Math.round(currentScroll + rect.top - headerHeight + 1));
        
        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });
      }
    }, delay);
  };

  useEffect(() => {
    let isMounted = true;

    try {
      const cachedCourses = sessionStorage.getItem('cg_cached_courses');
      if (cachedCourses) {
        const parsed = JSON.parse(cachedCourses);
        if (Array.isArray(parsed) && parsed.length > 0) setCustomCourses(parsed);
      }
      const cachedCats = sessionStorage.getItem('cg_cached_categories');
      if (cachedCats) {
        const parsed = JSON.parse(cachedCats);
        const hasOrder = parsed.some(c => typeof c.order === 'number' && c.order > 0);
        if (hasOrder && Array.isArray(parsed) && parsed.length > 0) setApiCategories(parsed);
      }
    } catch (e) {}

    const fetchCoursesAndCategories = () => {
      Promise.all([
        apiService.getCourses().catch(() => []),
        apiService.getCategories().catch(() => [])
      ]).then(([coursesData, catData]) => {
        if (isMounted) {
          if (Array.isArray(coursesData)) {
            setCustomCourses(coursesData);
            try { sessionStorage.setItem('cg_cached_courses', JSON.stringify(coursesData)); } catch (e) {}
          }
          if (Array.isArray(catData)) {
            setApiCategories(catData);
            try { sessionStorage.setItem('cg_cached_categories', JSON.stringify(catData)); } catch (e) {}
          }
          setHasLoadedOnce(true);
        }
      });
    };

    fetchCoursesAndCategories();

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlCat = params.get('category');
      if (urlCat) {
        setActiveCategory(urlCat);
        scrollToCatalogSection(150);
        scrollToCatalogSection(400);
      }
    }

    // 1. Live SSE and cross-tab update events
    window.addEventListener('codeguru_refresh_courses', fetchCoursesAndCategories);
    window.addEventListener('codeguru_refresh_categories', fetchCoursesAndCategories);
    window.addEventListener('codeguru_refresh_all', fetchCoursesAndCategories);
    window.addEventListener('focus', fetchCoursesAndCategories);

    return () => {
      isMounted = false;
      window.removeEventListener('codeguru_refresh_courses', fetchCoursesAndCategories);
      window.removeEventListener('codeguru_refresh_categories', fetchCoursesAndCategories);
      window.removeEventListener('codeguru_refresh_all', fetchCoursesAndCategories);
      window.removeEventListener('focus', fetchCoursesAndCategories);
    };
  }, []);

  useEffect(() => {
    if (apiCategories.length > 0) {
      const activeExists = apiCategories.some(ac => (ac.category || ac.id) === activeCategory);
      if (!activeExists && activeCategory === 'coding') {
        const found = apiCategories.find(ac => {
          const cid = (ac.category || ac.id || '').toLowerCase();
          const clbl = (ac.label || '').toLowerCase();
          return cid.includes('coding') || cid.includes('softw') || clbl.includes('software') || clbl.includes('coding');
        });
        if (found) {
          const newCatId = found.category || found.id;
          setActiveCategory(newCatId);
          if (Array.isArray(found.subCategories) && found.subCategories.length > 0) {
            const firstSub = found.subCategories[0];
            const subId = typeof firstSub === 'object' ? (firstSub.id || firstSub.label) : String(firstSub);
            const normId = (subId || '').toLowerCase().replace(/[^a-z0-9]/g, '') || 'sub';
            setActiveSubCategory(normId);
          }
        }
      }
    }
  }, [apiCategories, activeCategory]);

  const DEFAULT_SUB_CATEGORIES = {
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
      setActiveFilter('All');
      scrollToCatalogSection(30);
      scrollToCatalogSection(120);
      scrollToCatalogSection(280);
    }
  };

  const handleSubCategoryClick = (subId) => {
    setActiveSubCategory(subId);
    setActiveFilter('All');
  };

  const handleFilterClick = (filterVal) => {
    setActiveFilter(prev => prev === filterVal ? 'All' : filterVal);
  };

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

  const defaultCategories = [
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

  const resolveCategoryLogo = (catId = '', label = '', customIcon = '') => {
    if (customIcon && (customIcon.startsWith('http') || customIcon.startsWith('data:image') || customIcon.includes('/uploads/'))) {
      return customIcon;
    }
    const slug = (catId || '').toLowerCase().trim();
    const name = (label || '').toLowerCase().trim();

    // 1. Exact Slug Match
    if (slug === 'coding' || slug.includes('coding') || slug.includes('software')) return '/images/categories/coding.png';
    if (slug === 'robotics' || slug.includes('robot') || slug.includes('iot')) return '/images/categories/robotics.png';
    if (slug === 'networking' || slug.includes('network') || slug.includes('server')) return '/images/categories/networking.png';
    if (slug === 'electrical' || slug.includes('electric') || slug.includes('appliance')) return '/images/categories/electrical.png';
    if (slug === 'repair' || slug === 'mobile' || slug.includes('repair')) return '/images/categories/repair.png';
    if (slug === 'marketing' || slug.includes('market') || slug.includes('seo')) return '/images/categories/marketing.png';

    // 2. Name Keyword Match
    if (name.includes('appliance') || name.includes('electric') || name.includes('ac') || name.includes('fridge')) return '/images/categories/electrical.png';
    if (name.includes('robot') || name.includes('iot') || name.includes('hardware')) return '/images/categories/robotics.png';
    if (name.includes('network') || name.includes('server') || name.includes('ccna')) return '/images/categories/networking.png';
    if (name.includes('market') || name.includes('seo') || name.includes('ads')) return '/images/categories/marketing.png';
    if (name.includes('mobile') || name.includes('laptop') || name.includes('bga') || name.includes('chip')) return '/images/categories/repair.png';

    return '/images/categories/coding.png';
  };

  const categories = (apiCategories.length > 0
    ? [...apiCategories]
        .filter(ac => ac.isActive !== false)
        .sort((a, b) => {
          const ordA = Number(a.order) || 999;
          const ordB = Number(b.order) || 999;
          if (ordA !== ordB) return ordA - ordB;
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        })
        .map(ac => {
          const catId = ac.category || ac.id;
          const foundDefault = defaultCategories.find(dc => dc.id === catId || dc.id === ac.id);
          return {
            id: catId,
            name: ac.label,
            order: typeof ac.order !== 'undefined' ? Number(ac.order) : 0,
            icon: foundDefault ? foundDefault.icon : Layers,
            img: resolveCategoryLogo(catId, ac.label, ac.icon),
            bgColor: ac.bgColor || foundDefault?.bgColor || 'bg-blue-50',
            isActive: ac.isActive !== false
          };
        })
    : defaultCategories).filter(c => c.isActive !== false);

  const SUB_CATEGORIES = {};
  categories.forEach(cat => {
    const foundApi = apiCategories.find(ac => ac.category === cat.id);
    let rawList = [];
    if (foundApi && Array.isArray(foundApi.subCategories) && foundApi.subCategories.length > 0) {
      rawList = foundApi.subCategories;
    } else if (DEFAULT_SUB_CATEGORIES[cat.id]) {
      rawList = DEFAULT_SUB_CATEGORIES[cat.id];
    } else {
      rawList = [{ id: 'all', label: 'All Courses' }];
    }

    const uniqueSubs = [];
    const seen = new Set();
    rawList.forEach(item => {
      const subId = typeof item === 'object' ? (item.id || item.label) : String(item);
      const subLabel = typeof item === 'object' ? (item.label || item.id) : String(item);
      const normId = (subId || '').toLowerCase().replace(/[^a-z0-9]/g, '') || 'sub';
      if (normId && !seen.has(normId)) {
        seen.add(normId);
        uniqueSubs.push({ id: normId, label: subLabel });
      }
    });

    SUB_CATEGORIES[cat.id] = uniqueSubs.length > 0 ? uniqueSubs : [{ id: 'all', label: 'All Courses' }];
  });

  const ALL_TRAINING_FILTERS = [
    { label: '3 Months', value: '3 Months', matchKeys: ['3 Months', '3 months', '3 Month', '3 month', '3M', '3m', 'Internship'] },
    { label: '45 Days', value: '45 Days', matchKeys: ['45 Days', '45 days', '45D', '45d', '45 Day', 'Summer', 'Winter'] },
    { label: '4 Months', value: '4 Months', matchKeys: ['4 Months', '4 months', '4 Month', '4 month', '4M', '4m'] },
    { label: '5 Months', value: '5 Months', matchKeys: ['5 Months', '5 months', '5 Month', '5 month', '5M', '5m'] },
    { label: '6 Months', value: '6 Months', matchKeys: ['6 Month', '6 Months', '6month', '6months', '6M', '6m', 'Industrial'] },
    { label: 'One Year', value: 'One Year', matchKeys: ['One Year', 'one year', '1 Year', '1 year', '1Year', '12 Months', '12 months', 'Year'] }
  ];

  const allCourses = customCourses;

  const currentCategoryObj = categories.find(c => c.id === activeCategory) || categories[0] || { name: 'Featured', id: 'all' };

  let headingTitle = `${currentCategoryObj?.name || 'Featured'} Programs`;
  if (headingTitle.endsWith('Programs Programs')) {
    headingTitle = headingTitle.replace('Programs Programs', 'Programs');
  }
  const currentSubList = SUB_CATEGORIES[activeCategory] || (categories[0]?.id ? SUB_CATEGORIES[categories[0].id] : []);
  const currentSubObj = currentSubList.find(s => s.id === activeSubCategory);
  if (currentSubObj && currentSubObj.id !== 'all') {
    headingTitle = `${currentSubObj.label} Programs`;
  }

  const courseMatchesFilter = (c, filterObj) => {
    if (!filterObj || filterObj.value === 'All') return true;
    const keys = filterObj.matchKeys || [filterObj.value, filterObj.label];
    const dur = (c.duration || '').toLowerCase();
    const title = (c.title || '').toLowerCase();
    return keys.some(k => {
      const kLow = k.toLowerCase().trim();
      return dur.includes(kLow) || title.includes(kLow);
    });
  };

  const isCourseInCategoryAndSub = (c, catId, subId) => {
    const activeCatSlug = (catId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const courseCatSlug = (c.categoryId || c.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const courseCatRaw = (c.categoryId || c.category || '').toLowerCase();
    const activeCatRaw = (catId || '').toLowerCase();

    const isCodingMatch = (activeCatSlug.includes('coding') || activeCatSlug.includes('softw')) &&
                          (courseCatSlug.includes('coding') || courseCatSlug.includes('softw'));
    const isRepairMatch = (activeCatSlug.includes('repair') || activeCatSlug.includes('mobil') || activeCatSlug.includes('comp')) &&
                          (courseCatSlug.includes('repair') || courseCatSlug.includes('mobil') || courseCatSlug.includes('comp'));
    const isNetworkMatch = (activeCatSlug === 'n' || activeCatSlug.includes('network') || activeCatSlug.includes('server')) &&
                           (courseCatSlug === 'n' || courseCatSlug.includes('network') || courseCatSlug.includes('server'));
    const isRoboticsMatch = (activeCatSlug.includes('robot') || activeCatSlug.includes('iot')) &&
                            (courseCatSlug.includes('robot') || courseCatSlug.includes('iot'));
    const isElecMatch = (activeCatSlug.includes('elect') || activeCatSlug.includes('appliance')) &&
                        (courseCatSlug.includes('elect') || courseCatSlug.includes('appliance'));
    const isMarketMatch = (activeCatSlug.includes('market') || activeCatSlug.includes('seo')) &&
                          (courseCatSlug.includes('market') || courseCatSlug.includes('seo'));

    const matchesCat = !catId || 
                       courseCatSlug === activeCatSlug || 
                       courseCatRaw === activeCatRaw || 
                       (courseCatSlug && activeCatSlug && (courseCatSlug.includes(activeCatSlug) || activeCatSlug.includes(courseCatSlug))) ||
                       isCodingMatch || isRepairMatch || isNetworkMatch || isRoboticsMatch || isElecMatch || isMarketMatch;
    
    let matchesSubCat = true;
    if (subId && subId !== 'all') {
      const subLower = subId.toLowerCase().replace(/[^a-z0-9]/g, '');
      const courseSub = (c.subCategory || c.subCat || '').toLowerCase();
      const courseSubs = (Array.isArray(c.subCategories) && c.subCategories.length > 0 ? c.subCategories : courseSub.split(','))
        .map(s => String(s).toLowerCase().replace(/[^a-z0-9]/g, ''))
        .filter(Boolean);
      
      const courseTitle = (c.title || '').toLowerCase();
      matchesSubCat = courseSubs.length === 0 || 
                      courseSubs.some(s => s === subLower || s.includes(subLower) || subLower.includes(s)) || 
                      courseTitle.includes(subLower);
    }

    return matchesCat && matchesSubCat;
  };

  // Courses in current category & subcategory before applying duration filter
  const scopedCourses = allCourses.filter(c => isCourseInCategoryAndSub(c, activeCategory, activeSubCategory));

  // Determine which durations ACTUALLY have courses in current selection
  const availableTrainingFilters = ALL_TRAINING_FILTERS.filter(filter => {
    return scopedCourses.some(course => courseMatchesFilter(course, filter));
  });

  // Dynamically include any custom duration present in scopedCourses
  scopedCourses.forEach(course => {
    const rawDur = (course.duration || '').trim();
    if (!rawDur) return;
    const isCovered = ALL_TRAINING_FILTERS.some(filter => courseMatchesFilter(course, filter));
    if (!isCovered && !availableTrainingFilters.some(f => f.value.toLowerCase() === rawDur.toLowerCase())) {
      availableTrainingFilters.push({
        label: rawDur,
        value: rawDur,
        matchKeys: [rawDur]
      });
    }
  });

  // Automatically reset activeFilter to 'All' if the selected filter no longer has any courses
  useEffect(() => {
    if (activeFilter !== 'All') {
      const isAvailable = availableTrainingFilters.some(
        f => f.value === activeFilter || f.label === activeFilter
      );
      if (!isAvailable) {
        setActiveFilter('All');
      }
    }
  }, [activeCategory, activeSubCategory, availableTrainingFilters, activeFilter]);

  // Displayed courses based on activeFilter and custom order
  const displayedCourses = scopedCourses
    .filter(c => {
      if (activeFilter === 'All') return true;
      const selectedFilterObj = [
        ...ALL_TRAINING_FILTERS,
        ...availableTrainingFilters
      ].find(f => f.value === activeFilter || f.label === activeFilter);
      return courseMatchesFilter(c, selectedFilterObj || { value: activeFilter, label: activeFilter, matchKeys: [activeFilter] });
    })
    .sort((a, b) => {
      const ordA = typeof a.order === 'number' && !isNaN(a.order) && a.order > 0 ? a.order : 999999;
      const ordB = typeof b.order === 'number' && !isNaN(b.order) && b.order > 0 ? b.order : 999999;
      if (ordA !== ordB) return ordA - ordB;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <section className="w-full px-3 sm:px-4 pt-[5px] pb-1 bg-slate-50/50 select-none">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* CATEGORY SELECTOR CARDS GRID */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3.5 sm:gap-5 md:gap-6 justify-items-center w-full pb-4 md:pb-3 pt-1 px-1 md:mx-0 md:px-0">
          {categories.map((cat) => {
            const isCatActive = activeCategory === cat.id;

            return (
              <button
                suppressHydrationWarning
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group flex flex-col items-center justify-start w-full gap-2.5 sm:gap-3 cursor-pointer"
                title={`Open ${cat.name} Courses`}
              >
                {/* SMOOTH ROUNDED CARD CONTAINER */}
                <div
                  className={`relative flex items-center justify-center p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-2xl md:rounded-2xl transition-all duration-300 w-full max-w-[120px] sm:max-w-[155px] md:max-w-[180px] aspect-square ${
                    isCatActive && !isHome
                      ? 'border-2 border-blue-600 shadow-xl ring-4 ring-blue-100/70 bg-white scale-[1.03]'
                      : 'border border-blue-100/90 shadow-lg hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 bg-white'
                  }`}
                >
                  <img
                    src={cat.img || '/images/categories/coding.png'}
                    alt={cat.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/categories/coding.png';
                    }}
                    className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105 p-0.5"
                  />
                </div>

                {/* CATEGORY NAME TEXT BELOW CARD */}
                <span
                  className={`text-[12.5px] sm:text-[14.5px] md:text-[16px] font-bold text-center leading-tight tracking-tight px-0.5 max-w-[160px] transition-colors ${
                    isCatActive && !isHome ? 'text-blue-600' : 'text-[#0f172a] group-hover:text-blue-600'
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
          <div id="course-catalog-section" className="scroll-mt-[70px] sm:scroll-mt-[84px] pt-1 pb-1">
            {/* FROZEN FILTER HEADER: SUB-CATEGORIES + TRAINING DURATION FROZEN UNDER NAVBAR */}
            <div className="sticky top-[70px] sm:top-[84px] z-30 bg-slate-50/98 backdrop-blur-sm pt-2 sm:pt-2.5 pb-2 border-b border-slate-200/80 shadow-xs mb-3 -mx-3 sm:mx-0 px-3 sm:px-0 flex flex-col gap-1.5">
              {/* DOMAIN SUB-CATEGORY TABS FOR ALL CATEGORIES */}
              {SUB_CATEGORIES[activeCategory] && SUB_CATEGORIES[activeCategory].length > 0 && (
                <div className="w-full max-w-xl mx-auto bg-slate-200/80 p-1 rounded-xl sm:rounded-2xl flex items-center justify-between gap-1 shadow-inner border border-slate-300/50 overflow-x-auto scrollbar-none [ms-overflow-style:none] [scrollbar-width:none]">
                  {SUB_CATEGORIES[activeCategory].map((sub, sIdx) => {
                    const isSubActive = activeSubCategory === sub.id;
                    return (
                      <button
                        suppressHydrationWarning
                        key={`${sub.id}-${sIdx}`}
                        onClick={() => handleSubCategoryClick(sub.id)}
                        className={`flex-1 min-w-max text-center whitespace-nowrap px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-xs min-[360px]:text-xs sm:text-[13.5px] transition-all duration-200 cursor-pointer ${
                          isSubActive
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-[1.02]'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-white/70 font-semibold'
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TRAINING DURATION FILTER CONTAINER */}
              <div className="w-full max-w-7xl mx-auto px-1 sm:px-4">
                <div className="bg-slate-100/90 p-1.5 sm:p-2 rounded-2xl border border-slate-200/90 shadow-inner flex flex-col gap-1.5">
                  <div className="flex items-center justify-between px-1 pt-0.5">
                    <h4 className="text-xs sm:text-xs font-bold text-slate-800">
                      Training Duration
                    </h4>
                    <button
                      suppressHydrationWarning
                      onClick={() => handleFilterClick('All')}
                      className={`px-3 py-0.5 sm:py-1 rounded-xl text-[10.5px] sm:text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                        activeFilter === 'All'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-[1.02]'
                          : 'bg-white text-slate-700 border border-slate-200/90 shadow-2xs hover:bg-slate-50 hover:border-blue-300'
                      }`}
                    >
                      All
                    </button>
                  </div>
                  {availableTrainingFilters.length > 0 ? (
                    <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 overflow-x-auto scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] pb-0.5">
                      {availableTrainingFilters.map((filter) => {
                        const isFilterActive = activeFilter === filter.value;
                        return (
                          <button
                            suppressHydrationWarning
                            key={filter.value}
                            onClick={() => handleFilterClick(filter.value)}
                            className={`flex-1 min-w-[70px] sm:min-w-0 text-center whitespace-nowrap px-1.5 sm:px-4 py-1 sm:py-2 rounded-xl font-semibold text-[10.5px] min-[360px]:text-[11.5px] sm:text-[13.5px] tracking-tight transition-all duration-200 cursor-pointer ${
                              isFilterActive
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-[1.02]'
                                : 'bg-white text-slate-700 border border-slate-200/90 shadow-2xs hover:bg-slate-50 hover:border-blue-300'
                            }`}
                          >
                            {filter.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-1 text-xs sm:text-xs font-bold text-slate-500">
                      All courses for this category are shown
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COURSE CARDS GRID - NATURAL SCROLLING FIT WITHOUT BLANK VOID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pb-2 sm:pb-4 pt-2 sm:pt-4">
              {displayedCourses.length === 0 && !hasLoadedOnce && customCourses.length === 0 && (
                [1, 2, 3, 4].map(n => (
                  <div key={n} className="rounded-2xl border border-slate-200/90 bg-white p-5 animate-pulse space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-40 bg-slate-100 rounded" />
                        <div className="h-3 w-24 bg-slate-100 rounded" />
                      </div>
                    </div>
                    <div className="h-12 w-full bg-slate-100 rounded-xl" />
                  </div>
                ))
              )}
              {displayedCourses.length === 0 && (hasLoadedOnce || customCourses.length > 0) && (
                <div className="col-span-1 lg:col-span-2 text-center py-12 px-4 bg-white/80 rounded-2xl border border-dashed border-slate-200 shadow-2xs">
                  <p className="text-slate-600 font-bold text-sm">No courses found matching this selection.</p>
                </div>
              )}
              {displayedCourses.map((course) => {
                const isLiked = !!likedCourses[course.id];
                const titleLower = (course.title || '').toLowerCase();
                const isMern = course.id === 'mern-stack' || titleLower.includes('mern');

                const parseStatPill = (valStr, defaultVal = '', defaultLabel = '') => {
                  if (!valStr) return { val: defaultVal, label: defaultLabel };
                  const trimmed = String(valStr).trim();
                  const match = trimmed.match(/^([\d\+\-]+)\s*(.*)$/);
                  if (match) {
                    const numPart = match[1];
                    const restPart = match[2];
                    if (restPart) {
                      return { val: numPart, label: restPart };
                    }
                    return { val: numPart, label: defaultLabel };
                  }
                  return { val: trimmed, label: '' };
                };

                // Dynamic 2x2 Pills Grid Data (From Admin Backend or Fallback)
                const gridPills = [
                  parseStatPill(course.duration, '6', 'Months'),
                  parseStatPill(course.internships, '5', 'Internships'),
                  parseStatPill(course.mockTests, '5', 'Mock Tests'),
                  parseStatPill(course.projects, '5', 'Projects')
                ];

                // Dynamic Checkmark Features List Data (From Admin Backend or Smart Category Fallback)
                const checkmarkFeatures = (Array.isArray(course.highlights) && course.highlights.length > 0) ? course.highlights : (isMern ? [
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
                ]);

                return (
                  <div
                    key={course.id}
                    className="group relative flex flex-col bg-white border border-slate-200/90 shadow-lg rounded-[20px] sm:rounded-2xl p-3.5 min-[400px]:p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-200 justify-between gap-3 sm:gap-4"
                  >
                    {/* ATTACHED BESTSELLER / TOP BADGE */}
                    {course.tag && (
                      <div className="absolute top-0 -translate-y-1/2 left-4 sm:left-6 z-10 pointer-events-none">
                        <div className="px-2.5 sm:px-3 py-0.5 bg-[#fde047] border border-[#facc15] text-[#713f12] font-bold text-[9.5px] sm:text-[10.5px] rounded-lg shadow-2xs">
                          {course.tag}
                        </div>
                      </div>
                    )}

                    {/* TOP ROW: ICON + TITLE + 2x2 PILLS GRID */}
                    <div className="flex flex-row gap-2.5 min-[400px]:gap-3.5 sm:gap-5 items-start">
                      {/* TECH LOGO CONTAINER (Custom Uploaded Icon OR M E R N 4-box grid OR Fallback) */}
                      {(course.icon || course.logoUrl) ? (
                        <div className={`w-16 h-16 min-[400px]:w-20 min-[400px]:h-20 sm:w-26 sm:h-26 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-200/80 shadow-2xs mt-[8px] p-2 ${course.iconBg || 'bg-slate-50'}`}>
                          <img
                            src={course.icon || course.logoUrl}
                            alt={course.title}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = '/images/categories/coding.png'; }}
                          />
                        </div>
                      ) : isMern ? (
                        <div className="w-16 h-16 min-[400px]:w-20 min-[400px]:h-20 sm:w-26 sm:h-26 bg-slate-50/90 border border-slate-200/80 rounded-xl sm:rounded-2xl p-1.5 min-[400px]:p-2 sm:p-2.5 flex-shrink-0 shadow-2xs mt-[8px]">
                          <div className="grid grid-cols-2 gap-1 min-[400px]:gap-1.5 w-full h-full">
                            <div className="bg-[#10b981] text-white font-bold rounded flex items-center justify-center text-xs min-[400px]:text-xs sm:text-sm">M</div>
                            <div className="bg-[#1e293b] text-white font-bold rounded flex items-center justify-center text-xs min-[400px]:text-xs sm:text-sm">E</div>
                            <div className="bg-[#06b6d4] text-white font-bold rounded flex items-center justify-center text-xs min-[400px]:text-xs sm:text-sm">R</div>
                            <div className="bg-[#84cc16] text-white font-bold rounded flex items-center justify-center text-xs min-[400px]:text-xs sm:text-sm">N</div>
                          </div>
                        </div>
                      ) : (
                        <div className={`w-16 h-16 min-[400px]:w-20 min-[400px]:h-20 sm:w-26 sm:h-26 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-200/80 shadow-2xs mt-[8px] ${course.iconBg || 'bg-slate-50'}`}>
                          <img
                            src={course.icon || '/images/categories/coding.png'}
                            alt={course.title}
                            className="w-8 h-8 min-[400px]:w-10 min-[400px]:h-10 sm:w-12 sm:h-12 object-contain"
                            onError={(e) => { e.target.src = '/images/categories/coding.png'; }}
                          />
                        </div>
                      )}

                      {/* TITLE & 2x2 PILLS GRID */}
                      <div className="flex flex-col min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900 text-[14px] min-[400px]:text-[16px] sm:text-[19px] leading-tight mb-2 sm:mb-3 line-clamp-2">
                          {course.title}
                        </h3>

                        {/* 2x2 PILLS GRID */}
                        <div className="grid grid-cols-2 gap-1 sm:gap-2 w-full">
                          {gridPills.map((pill, idx) => (
                            <div
                              key={idx}
                              className="bg-[#f0f6ff] border border-[#dbeafe] text-slate-600 px-1.5 min-[400px]:px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[9.5px] min-[400px]:text-[10.5px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 whitespace-nowrap truncate"
                            >
                              <span className="font-bold text-slate-900">{pill.val}</span>
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
                          <div key={idx} className="flex items-center gap-1.5 sm:gap-2 text-xs min-[400px]:text-xs sm:text-[13px] font-semibold text-slate-700">
                            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-blue-50 border border-blue-200/80 text-blue-600 font-semibold text-xs sm:text-xs flex items-center justify-center flex-shrink-0">
                              ✓
                            </span>
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* VIEW DETAILS BUTTON (COMPACT & RIGHT ALIGNED) */}
                      <button
                        suppressHydrationWarning
                        onClick={() => setSelectedCourseForDetails(course)}
                        className="w-auto bg-[#2463eb] hover:bg-blue-700 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[11.5px] sm:text-xs md:text-sm font-semibold flex items-center justify-center gap-1 sm:gap-1.5 shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0 self-end"
                      >
                        View Details <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                      </button>
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

      {/* COURSE DETAILS MODAL */}
      <CourseDetailsModal
        isOpen={!!selectedCourseForDetails}
        onClose={() => setSelectedCourseForDetails(null)}
        course={selectedCourseForDetails}
        onEnroll={(crs) => {
          setSelectedCourseForDetails(null);
          if (onOpenEnrollModal) {
            onOpenEnrollModal(crs);
          } else if (onOpenContactModal) {
            onOpenContactModal();
          }
        }}
      />
    </section>
  );
}
