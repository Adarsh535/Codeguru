import React, { useState, useEffect } from 'react';
import CodeIcon from '@mui/icons-material/Code';
import EngineeringIcon from '@mui/icons-material/Engineering';
import LanIcon from '@mui/icons-material/Lan';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { apiService } from '../../services/apiService';

export default function CategoryNavbar({ onOpenContactModal }) {
  const [activeTab, setActiveTab] = useState('coding');
  const [activeCodingSubTab, setActiveCodingSubTab] = useState('web');
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

  const codingSubCategories = [
    { id: 'web', label: 'Web Development' },
    { id: 'app', label: 'App Development' },
    { id: 'software', label: 'Software Development' }
  ];

  const categories = [
    {
      id: 'coding',
      label: 'Coding',
      icon: CodeIcon,
      gradient: 'from-cyan-500 to-blue-600',
      activeBg: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25',
      inactiveBg: 'bg-slate-50 text-slate-700 hover:bg-cyan-50 hover:text-cyan-900 border-slate-200',
      title: 'Coding & Full Stack Software Engineering',
      badge: '🔥 HIGH PLACEMENT TRACK',
      badgeStyle: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      courses: [
        /* Web Development Courses */
        {
          id: 'mern',
          subCat: 'web',
          title: 'Full-Stack Web Development (MERN)',
          sub: 'MongoDB, Express, React, Node.js + Live Projects',
          duration: '6 Months',
          price: '₹4,999',
          original: '₹14,999',
          tag: 'HOT',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
        },
        {
          id: 'react-next',
          subCat: 'web',
          title: 'Frontend Masterclass (React & Next.js)',
          sub: 'React 18, Next.js 14, TailwindCSS, TypeScript & UI/UX',
          duration: '4 Months',
          price: '₹3,999',
          original: '₹11,999',
          tag: 'POPULAR',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg'
        },
        {
          id: 'backend-api',
          subCat: 'web',
          title: 'Backend Engineering & REST APIs',
          sub: 'Node.js, Express, Python FastAPI, PostgreSQL & Microservices',
          duration: '4 Months',
          price: '₹3,499',
          original: '₹9,999',
          tag: 'IN DEMAND',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg'
        },

        /* App Development Courses */
        {
          id: 'flutter',
          subCat: 'app',
          title: 'Flutter & Dart Cross-Platform Mobile Apps',
          sub: 'Build Native Android & iOS Apps with Flutter & Firebase',
          duration: '5 Months',
          price: '₹4,999',
          original: '₹14,999',
          tag: 'TOP RATED',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Google-flutter-logo.png'
        },
        {
          id: 'android-kotlin',
          subCat: 'app',
          title: 'Android App Development (Kotlin)',
          sub: 'Android Studio, Kotlin, Jetpack Compose, MVVM Architecture',
          duration: '4 Months',
          price: '₹4,499',
          original: '₹12,999',
          tag: 'CAREER TRACK',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.svg'
        },
        {
          id: 'ios-swift',
          subCat: 'app',
          title: 'iOS App Development (Swift & SwiftUI)',
          sub: 'Swift 5, SwiftUI, Xcode, CoreData & App Store Publishing',
          duration: '5 Months',
          price: '₹5,499',
          original: '₹15,999',
          tag: 'PREMIUM',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Swift_logo_color.svg'
        },

        /* Software Development Courses */
        {
          id: 'dsa',
          subCat: 'software',
          title: 'Java Data Structures & Algorithms (DSA)',
          sub: '300+ Solved Problems, Trees, Graphs, LeetCode Mastery',
          duration: '4 Months',
          price: '₹3,499',
          original: '₹9,999',
          tag: 'TOP RATED',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg'
        },
        {
          id: 'cpp-system',
          subCat: 'software',
          title: 'C++ & System Design Bootcamp',
          sub: 'STL, OOPs, Low Level System Design for Top MNCs',
          duration: '3 Months',
          price: '₹2,999',
          original: '₹7,999',
          tag: 'POPULAR',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg'
        },
        {
          id: 'ai-python',
          subCat: 'software',
          title: 'Python AI & Data Science Masterclass',
          sub: 'Python, NumPy, Pandas, Scikit-learn, ML Models & AI',
          duration: '5 Months',
          price: '₹5,499',
          original: '₹15,999',
          tag: 'NEW',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg'
        },
        {
          id: 'qa-testing',
          subCat: 'software',
          title: 'Software QA & Automation Testing',
          sub: 'Selenium, Cypress, JUnit, Postman & API Automation',
          duration: '3 Months',
          price: '₹3,299',
          original: '₹8,999',
          tag: 'ESSENTIAL',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Selenium_Logo.png'
        }
      ]
    },
    {
      id: 'engineering',
      label: 'Engineering',
      icon: EngineeringIcon,
      gradient: 'from-cyan-500 to-blue-600',
      activeBg: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25',
      inactiveBg: 'bg-slate-50 text-slate-700 hover:bg-cyan-50 hover:text-cyan-900 border-slate-200',
      title: 'Core Engineering & Tech Training',
      badge: '⚙️ INDUSTRY READY TRACK',
      badgeStyle: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      courses: [
        {
          id: 'cad',
          title: 'Mechanical CAD/CAM & SolidWorks',
          sub: '3D Modeling, Simulation & Product Assemblies',
          duration: '4 Months',
          price: '₹4,499',
          original: '₹12,999',
          tag: 'CAREER TRACK',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Dassault_Syst%C3%A8mes_logo.svg'
        },
        {
          id: 'vlsi',
          title: 'Electrical & VLSI Chip Design',
          sub: 'Embedded Systems, Verilog & Circuit Design',
          duration: '5 Months',
          price: '₹5,999',
          original: '₹16,999',
          tag: 'HIGH DEMAND',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Microchip_Technology_logo.svg'
        },
        {
          id: 'civil',
          title: 'Civil AutoCAD & STAAD Pro',
          sub: 'Structural Analysis & Modern Building Plans',
          duration: '3 Months',
          price: '₹3,999',
          original: '₹10,999',
          tag: 'CORE TECH',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Autodesk_Logo_2021.svg'
        },
        {
          id: 'cs-core',
          title: 'CS/IT Core Fundamentals',
          sub: 'Operating Systems, DBMS, SQL, Linux & Networks',
          duration: '3 Months',
          price: '₹2,999',
          original: '₹7,999',
          tag: 'ESSENTIAL',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Linux_Tux_standalone.svg'
        }
      ]
    },
    {
      id: 'networking',
      label: 'Networking',
      icon: LanIcon,
      gradient: 'from-cyan-500 to-blue-600',
      activeBg: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25',
      inactiveBg: 'bg-slate-50 text-slate-700 hover:bg-cyan-50 hover:text-cyan-900 border-slate-200',
      title: 'Cloud Computing, DevOps & Cyber Security',
      badge: '🌐 CLOUD ARCHITECT TRACK',
      badgeStyle: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      courses: [
        {
          id: 'aws',
          title: 'AWS & Multi-Cloud Solutions Architect',
          sub: 'AWS, Azure, Cloud Infrastructure & Security',
          duration: '4 Months',
          price: '₹5,999',
          original: '₹17,999',
          tag: 'BESTSELLER',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg'
        },
        {
          id: 'devops',
          title: 'DevOps & Kubernetes Masterclass',
          sub: 'Docker, K8s, Jenkins, Terraform, CI/CD Pipelines',
          duration: '4 Months',
          price: '₹6,499',
          original: '₹18,999',
          tag: 'HIGH SALARY',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg'
        },
        {
          id: 'cyber',
          title: 'Ethical Hacking & Cyber Security',
          sub: 'Network Penetration Testing & Cyber Defense',
          duration: '5 Months',
          price: '₹6,999',
          original: '₹19,999',
          tag: 'POPULAR',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Kali-linux-logo.svg'
        },
        {
          id: 'ccna',
          title: 'CCNA & Network Administrator',
          sub: 'Cisco Routing, Switching & Protocols Mastery',
          duration: '3 Months',
          price: '₹3,499',
          original: '₹9,999',
          tag: 'CERTIFIED',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg'
        }
      ]
    },
    {
      id: 'robotics',
      label: 'Robotics',
      icon: SmartToyIcon,
      gradient: 'from-cyan-500 to-blue-600',
      activeBg: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25',
      inactiveBg: 'bg-slate-50 text-slate-700 hover:bg-cyan-50 hover:text-cyan-900 border-slate-200',
      title: 'Robotics, Industrial IoT & AI Hardware',
      badge: '🤖 FUTURE TECH TRACK',
      badgeStyle: 'bg-purple-100 text-purple-800 border-purple-300',
      courses: [
        {
          id: 'ai-robot',
          title: 'AI Robotics & Autonomous Systems',
          sub: 'ROS, Computer Vision, OpenCV, Raspberry Pi',
          duration: '6 Months',
          price: '₹7,999',
          original: '₹22,999',
          tag: 'ADVANCED',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/ROS_Logo.png'
        },
        {
          id: 'embedded',
          title: 'Embedded Systems & Microcontrollers',
          sub: 'Arduino, ARM Cortex, ESP32, Embedded C',
          duration: '4 Months',
          price: '₹4,999',
          original: '₹13,999',
          tag: 'HANDS ON',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Arduino_Logo.svg'
        },
        {
          id: 'iiot',
          title: 'Industrial IoT & Automation',
          sub: 'PLC Scada, Sensors, Wireless Protocols & Cloud',
          duration: '4 Months',
          price: '₹5,499',
          original: '₹15,999',
          tag: 'FUTURE READY',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg'
        },
        {
          id: 'drone',
          title: 'Drone Technology & Flight Avionics',
          sub: 'Drone Assembly, Flight Controllers & Hardware',
          duration: '3 Months',
          price: '₹6,499',
          original: '₹18,999',
          tag: 'NEW',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg'
        }
      ]
    }
  ];

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];
  const CurrentIcon = currentCategory.icon;

  const dynamicCategoryCourses = customCourses.filter(c => {
    const cat = (c.category || 'coding').toLowerCase();
    return cat === activeTab.toLowerCase();
  });

  const baseCourses = [
    ...dynamicCategoryCourses,
    ...currentCategory.courses
  ];

  const displayedCourses = activeTab === 'coding'
    ? baseCourses.filter((c) => (c.subCat || 'web').toLowerCase() === activeCodingSubTab.toLowerCase())
    : baseCourses;

  return (
    <div className="sticky top-[48px] xxs:top-[54px] sm:top-[64px] z-30 w-full max-w-7xl mx-auto px-1.5 xxs:px-3 sm:px-6 my-2 select-none">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl xxs:rounded-[32px] p-2 xxs:p-2.5 sm:p-4 border border-slate-200/90 shadow-md relative overflow-hidden flex flex-col gap-2">
        
        {/* Single-Line Row for All 4 Category Options - Optimized for 280px Mobile Screens */}
        <div className="grid grid-cols-4 gap-0.5 xxs:gap-1 sm:gap-1.5">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            const isActive = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`py-1.5 xxs:py-2 px-0.5 xxs:px-1.5 sm:px-3 rounded-full border transition-all duration-200 flex items-center justify-center text-center cursor-pointer active:scale-95 group relative overflow-hidden ${
                  isActive
                    ? `${cat.activeBg} border-transparent shadow-sm`
                    : `${cat.inactiveBg} border-slate-200/80`
                }`}
              >
                {/* Text Label: Full spelling visible without truncation even on 280px screens */}
                <span className={`text-[9px] xxs:text-[10px] sm:text-xs md:text-sm font-extrabold tracking-tight xxs:tracking-normal whitespace-nowrap ${
                  isActive ? 'text-white' : 'text-slate-900 font-heading'
                }`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* EXPANDED SECTION DRAWER RIGHT BELOW NAVBAR TABS */}
        <div className="pt-2 border-t border-slate-100 animate-card-pop">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-1.5 xxs:mb-2 gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className={`p-1 xxs:p-1.5 rounded-full bg-gradient-to-tr ${currentCategory.gradient} text-white flex items-center justify-center shadow-xs shrink-0`}>
                <CurrentIcon className="!w-3.5 !h-3.5 xxs:!w-4 xxs:!h-4 sm:!w-5 sm:!h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[10px] xxs:text-xs sm:text-base font-extrabold text-slate-900 font-heading leading-tight truncate">
                  {currentCategory.title}
                </h3>
              </div>
            </div>

            <button
              onClick={onOpenContactModal}
              className="px-2 xxs:px-3 py-1 text-[8px] xxs:text-[10px] sm:text-xs font-black uppercase tracking-tight bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-xs transition-all flex items-center gap-0.5 xxs:gap-1 cursor-pointer shrink-0 active:scale-95"
            >
              Inquire Now
              <ArrowForwardIcon className="!w-2.5 !h-2.5 xxs:!w-3 xxs:!h-3" />
            </button>
          </div>

          {/* Coding Sub-Categories Navigation Filter Pills */}
          {activeTab === 'coding' && (
            <div className="flex items-center gap-1.5 xxs:gap-2 mb-2 pb-1 border-b border-slate-100 overflow-x-auto no-scrollbar">
              {codingSubCategories.map((sub) => {
                const isSubActive = activeCodingSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveCodingSubTab(sub.id)}
                    className={`px-3 py-1 xxs:py-1.5 rounded-full text-[10px] xxs:text-xs font-black tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center justify-center active:scale-95 ${
                      isSubActive
                        ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white shadow-xs scale-105'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Category Courses Cards Grid with Custom Visible Scrollbar */}
          <div className="max-h-[300px] xxs:max-h-[360px] sm:max-h-[420px] overflow-y-auto pr-1.5 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xxs:gap-2.5">
              {displayedCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={onOpenContactModal}
                  className="p-2.5 xxs:p-3.5 sm:p-4 rounded-2xl xxs:rounded-3xl bg-white hover:bg-gradient-to-r hover:from-cyan-50/30 hover:to-amber-50/30 border border-slate-200/90 hover:border-cyan-400 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2 xxs:gap-2.5 group active:scale-[0.98]"
                >
                  {/* Header Row: Tech Logo + Title + Tag */}
                  <div className="flex items-start gap-2 xxs:gap-2.5 min-w-0">
                    <div className="w-7 h-7 xxs:w-9 xxs:h-9 sm:w-10 sm:h-10 rounded-full bg-slate-50 border border-slate-200/80 p-1 xxs:p-1.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <img
                        src={course.logoUrl}
                        alt={course.title}
                        className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="min-w-0">
                        <h4 className="text-[8.5px] xxs:text-[9.5px] sm:text-xs md:text-sm font-extrabold text-slate-900 group-hover:text-cyan-700 transition-colors leading-snug tracking-tight">
                          {course.title}
                        </h4>
                      </div>
                      <p className="text-[9px] xxs:text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                        {course.sub}
                      </p>
                    </div>
                  </div>

                  {/* Footer Row: Duration + Price + Enroll Button */}
                  <div className="flex items-center justify-between pt-1.5 xxs:pt-2 border-t border-slate-100/80 gap-1.5 xxs:gap-2 shrink-0">
                    <div className="flex items-center gap-1 xxs:gap-1.5 flex-wrap">
                      <span className="text-[8px] xxs:text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        ⏱️ {course.duration}
                      </span>
                      <div className="flex items-baseline gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="text-[10px] xxs:text-xs font-black text-emerald-700">
                          {course.price}
                        </span>
                        <span className="line-through text-slate-400 text-[8px] xxs:text-[9px] font-normal">
                          {course.original}
                        </span>
                      </div>
                    </div>

                    <button className="px-2.5 xxs:px-3.5 py-1 xxs:py-1.5 text-[8px] xxs:text-[10px] sm:text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white rounded-full shadow-xs hover:shadow-md transition-all flex items-center gap-0.5 xxs:gap-1 shrink-0 active:scale-95 cursor-pointer">
                      Enroll
                      <ArrowForwardIcon className="!w-2.5 !h-2.5 xxs:!w-3 xxs:!h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

