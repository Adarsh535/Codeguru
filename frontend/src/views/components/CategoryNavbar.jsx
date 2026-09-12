import React, { useState, useEffect } from 'react';
import { Heart, Clock, ArrowRight, Code, Cpu, Server, Wrench, Zap, Globe } from 'lucide-react';
import { apiService } from '../../services/apiService';

export default function CategoryNavbar({ onOpenContactModal, onOpenEnrollModal }) {
  const [activeCategory, setActiveCategory] = useState('coding');
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
    return () => { isMounted = false; };
  }, []);

  const toggleHeart = (e, courseId) => {
    e.stopPropagation();
    setLikedCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const categories = [
    {
      id: 'coding',
      name: 'Coding & Software Development',
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
      name: 'Networking & Server Administration',
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
      name: 'Electrical, Electronics & Home Appliance Repair',
      icon: Zap,
      img: '/images/categories/electrical.png',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 'marketing',
      name: 'Digital Marketing & Online Business',
      icon: Globe,
      img: '/images/categories/marketing.png',
      bgColor: 'bg-rose-50'
    }
  ];

  const trainingFilters = [
    'All',
    '45 Days Summer Training',
    '45 Days Winter Training',
    '6 Month Course',
    '3 Months Internship',
    'One Year Course'
  ];

  const allCourses = [
    {
      id: 'python-beginners',
      categoryId: 'coding',
      title: 'Python Programming for Beginners',
      duration: '3 Months',
      level: 'Beginner',
      mode: 'Live + Record',
      price: '₹4,999',
      originalPrice: '₹7,999',
      discount: '37% OFF',
      tag: 'BESTSELLER',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      iconBg: 'bg-blue-50'
    },
    {
      id: 'mern-stack',
      categoryId: 'coding',
      title: 'Full-Stack Web Development (MERN)',
      duration: '6 Months',
      level: 'Intermediate',
      mode: 'Live Classes',
      price: '₹8,999',
      originalPrice: '₹14,000',
      discount: '35% OFF',
      tag: null,
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      iconBg: 'bg-cyan-50'
    },
    {
      id: 'react-nextjs',
      categoryId: 'coding',
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
      id: 'swift-ios',
      categoryId: 'coding',
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
      id: 'java-springboot',
      categoryId: 'coding',
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
      id: 'robotics-ai',
      categoryId: 'robotics',
      title: 'Robotics & Hardware Automation',
      duration: '4 Months',
      level: 'Intermediate',
      mode: 'Live + Lab',
      price: '₹7,999',
      originalPrice: '₹12,000',
      discount: '33% OFF',
      tag: 'BESTSELLER',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      iconBg: 'bg-indigo-50'
    },
    {
      id: 'ccna-net',
      categoryId: 'networking',
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
    }
  ];

  const currentCategoryObj = categories.find(c => c.id === activeCategory) || categories[0];

  const displayedCourses = allCourses.filter(c => c.categoryId === activeCategory);

  return (
    <section className="w-full px-3 sm:px-4 py-8 bg-slate-50/50 select-none">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* SECTION TITLE HEADER */}
        <div className="flex items-center gap-2 mb-4 px-2 md:px-0 w-full">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <h2 className="text-left text-sm md:text-base font-bold text-slate-600 tracking-widest uppercase">
            Our Courses
          </h2>
        </div>

        {/* CATEGORY SELECTOR CARDS GRID */}
        <div className="grid grid-cols-3 gap-2 md:flex md:gap-6 md:overflow-x-visible pb-4 md:pb-0 pt-2 px-1 md:mx-0 md:px-0">
          {categories.map((cat) => {
            const isCatActive = activeCategory === cat.id;
            const IconComp = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="group flex flex-col items-center justify-start w-full md:w-auto md:flex-1 shrink-0 gap-2 sm:gap-3 cursor-pointer"
              >
                <div
                  className={`relative flex items-center justify-center p-2 rounded-[16px] xl:rounded-[28px] transition-all duration-300 w-full aspect-square ${
                    isCatActive
                      ? 'border-2 border-blue-500 shadow-blue-100 ring-4 ring-blue-50/50 bg-white'
                      : 'border-2 border-transparent hover:-translate-y-1 bg-white/60'
                  }`}
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span
                  className={`text-[11px] sm:text-xs md:text-sm font-extrabold text-center leading-tight px-1 transition-colors ${
                    isCatActive ? 'text-blue-600' : 'text-slate-700 group-hover:text-blue-500'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE CATEGORY HEADING */}
        <div className="flex items-center justify-start py-5 mt-2 sm:px-2 border-t border-slate-100">
          <h2 className="text-xl md:text-[26px] font-light text-black tracking-wide truncate">
            {currentCategoryObj.name} Programs
          </h2>
        </div>

        {/* TRAINING DURATION FILTER PILLS BAR */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 custom-scrollbar px-2 sm:px-0">
          <span className="font-bold text-slate-700 text-sm whitespace-nowrap pl-1 pr-2">Training:</span>
          {trainingFilters.slice(1).map((filter) => {
            const isFilterActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(isFilterActive ? 'All' : filter)}
                className={`flex flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full font-extrabold text-[13px] transition-all duration-300 cursor-pointer ${
                  isFilterActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* COURSE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pb-10">
          {displayedCourses.map((course) => {
            const isLiked = !!likedCourses[course.id];

            return (
              <div
                key={course.id}
                className="group relative flex flex-col p-4 sm:p-5 bg-white border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] rounded-[20px] hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.12)] hover:border-blue-100 transition-all duration-300 w-full"
              >
                {/* HEART BOOKMARK BUTTON */}
                <button
                  onClick={(e) => toggleHeart(e, course.id)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Save course"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* TOP HEADER DETAILS */}
                <div className="flex gap-3 sm:gap-4 mb-4 pr-6">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] flex items-center justify-center flex-shrink-0 ${course.iconBg}`}>
                    <img
                      src={course.icon}
                      alt={course.title}
                      className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
                    />
                  </div>
                  <div className="flex flex-col pt-0.5 min-w-0">
                    {course.tag ? (
                      <div className="mb-1.5 w-max px-2 py-0.5 bg-[#e5fcf1] text-[#00a86b] text-[10px] font-bold rounded leading-none uppercase tracking-wide">
                        {course.tag}
                      </div>
                    ) : (
                      <div className="mb-1.5 w-max px-2 py-0.5 text-[10px] opacity-0 leading-none">-</div>
                    )}
                    <h3 className="font-extrabold text-slate-900 text-[15px] sm:text-[17px] leading-snug mb-1.5 truncate">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] md:text-[12px] text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span>{course.duration}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                      <span>{course.level}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                      <span>{course.mode}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-100 my-3" />

                {/* PRICE & ENROLL ACTION ROW */}
                <div className="flex flex-row items-center justify-between pt-1 mt-auto">
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-xl sm:text-[22px] font-black text-slate-900 tracking-tight">
                      {course.price}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-400 line-through">
                      {course.originalPrice}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-emerald-500">
                      {course.discount}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenEnrollModal ? onOpenEnrollModal(course) : onOpenContactModal()}
                    className="bg-[#2463eb] hover:bg-blue-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[13px] sm:text-sm font-bold flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    Enroll Now <ArrowRight className="w-4 h-4 -mr-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* VIEW MORE BUTTON */}
        <div className="flex justify-center mt-2 pb-8">
          <button
            onClick={onOpenContactModal}
            className="bg-slate-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            View More <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}


