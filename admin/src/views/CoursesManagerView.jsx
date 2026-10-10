import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SchoolIcon from '@mui/icons-material/School';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import CategoryIcon from '@mui/icons-material/Category';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import CheckIcon from '@mui/icons-material/Check';
import {
  ArrowLeft as LucideArrowLeft,
  Share2 as LucideShare2,
  Play as LucidePlay,
  Clock as LucideClock,
  Video as LucideVideo,
  Award as LucideAward,
  Briefcase as LucideBriefcase,
  GraduationCap as LucideGraduationCap,
  Calendar as LucideCalendar,
  MapPin as LucideMapPin,
  ShieldCheck as LucideShieldCheck,
  Star as LucideStar,
  ChevronRight as LucideChevronRight,
  Sparkles as LucideSparkles,
  Headphones as LucideHeadphones,
  X as LucideX
} from 'lucide-react';
import { useCoursesController } from '../controllers/useCoursesController';
import { enrollmentModel } from '../models/enrollmentModel';
import { leadModel } from '../models/leadModel';

const MAIN_CATEGORIES_CONFIG = [
  {
    id: 'coding',
    label: 'Software Development',
    icon: '/images/categories/coding.png',
    subCategories: [
      { id: 'web', label: 'Web Dev' },
      { id: 'app', label: 'App Dev' },
      { id: 'ai', label: 'AI & ML' }
    ]
  },
  {
    id: 'robotics',
    label: 'Robotics & IoT',
    icon: '/images/categories/robotics.png',
    subCategories: [
      { id: 'hardware', label: 'Robotics' },
      { id: 'iot', label: 'IoT' },
      { id: 'embedded', label: 'Embedded' }
    ]
  },
  {
    id: 'networking',
    label: 'Networking & Server',
    icon: '/images/categories/networking.png',
    subCategories: [
      { id: 'server', label: 'Server & CCNA' },
      { id: 'cloud', label: 'Cloud & AWS' },
      { id: 'cyber', label: 'Cyber Security' }
    ]
  },
  {
    id: 'repair',
    label: 'Computer & Mobile Repair',
    icon: '/images/categories/repair.png',
    subCategories: [
      { id: 'mobile', label: 'Mobile Repair' },
      { id: 'laptop', label: 'Laptop & PC' },
      { id: 'bga', label: 'BGA IC' }
    ]
  },
  {
    id: 'electrical',
    label: 'Home Appliance Repair',
    icon: '/images/categories/electrical.png',
    subCategories: [
      { id: 'ac', label: 'AC & Fridge' },
      { id: 'pcb', label: 'PCB Repair' }
    ]
  },
  {
    id: 'marketing',
    label: 'Digital Marketing',
    icon: '/images/categories/marketing.png',
    subCategories: [
      { id: 'ads', label: 'Performance Ads' },
      { id: 'seo', label: 'SEO & Media' }
    ]
  }
];

const getCourseTechStack = (title = '', description = '') => {
  const text = (title + ' ' + description).toLowerCase();
  if (text.includes('mern') || text.includes('web') || text.includes('full stack')) {
    return ['JavaScript', 'React.js', 'Node.js', 'MongoDB'];
  }
  if (text.includes('app') || text.includes('flutter') || text.includes('android')) {
    return ['Flutter', 'Dart', 'Kotlin', 'Mobile API'];
  }
  if (text.includes('python') || text.includes('data') || text.includes('ai')) {
    return ['Python', 'Pandas', 'NumPy', 'Scikit-Learn'];
  }
  if (text.includes('java') || text.includes('spring')) {
    return ['Java', 'Spring Boot', 'PostgreSQL'];
  }
  if (text.includes('cyber') || text.includes('cloud') || text.includes('networking')) {
    return ['AWS', 'Linux', 'Docker', 'Networking'];
  }
  if (text.includes('robotics') || text.includes('c++')) {
    return ['C++', 'Embedded C', 'Arduino/IoT'];
  }
  if (text.includes('repair') || text.includes('chip') || text.includes('mobile') || text.includes('laptop')) {
    return ['Micro-Soldering', 'Schematics', 'BGA IC', 'Multimeter'];
  }
  if (text.includes('ac') || text.includes('pcb') || text.includes('fridge') || text.includes('electrical')) {
    return ['PCB Repair', 'Inverter Circuit', 'Microcontroller', 'Testing'];
  }
  if (text.includes('marketing') || text.includes('seo') || text.includes('ads')) {
    return ['Google Ads', 'Meta Ads', 'SEO', 'Analytics'];
  }
  return ['HTML5', 'CSS3', 'JavaScript', 'Git'];
};

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

const getCourseHighlights = (course, formDataHighlightsText = null) => {
  if (formDataHighlightsText !== null && formDataHighlightsText !== undefined && String(formDataHighlightsText).trim()) {
    const parsed = String(formDataHighlightsText).split('\n').map(s => s.trim()).filter(Boolean);
    if (parsed.length > 0) return parsed;
  }
  if (Array.isArray(course?.highlights) && course.highlights.length > 0) {
    return course.highlights;
  }
  const titleLower = (course?.title || '').toLowerCase();
  if (titleLower.includes('mern') || course?.id === 'mern-stack') {
    return ['MongoDB, Express, React, Node.js', 'Frontend and Backend: React + Express', 'Database: MongoDB'];
  }
  if (titleLower.includes('java')) {
    return ['Core Java, Spring Boot, Microservices', 'Enterprise Architecture & REST APIs', 'Database: MySQL & PostgreSQL'];
  }
  if (titleLower.includes('python') || titleLower.includes('data') || titleLower.includes('ai')) {
    return ['Python, Data Science & AI/ML', 'Data Pipelines & Neural Networks', 'Database & Cloud: SQL + AWS'];
  }
  if (titleLower.includes('repair') || titleLower.includes('chip') || titleLower.includes('mobile') || titleLower.includes('laptop') || titleLower.includes('bga')) {
    return ['Practical Hardware & Schematics Diagnosis', 'Motherboard Micro-Soldering & IC Work', '100% Practical Lab Training'];
  }
  if (titleLower.includes('ac') || titleLower.includes('pcb') || titleLower.includes('appliance') || titleLower.includes('fridge')) {
    return ['Inverter AC & PCB Circuit Repair', 'Component Level Troubleshooting', 'Job Ready Practical Field Training'];
  }
  if (titleLower.includes('marketing') || titleLower.includes('seo') || titleLower.includes('ads')) {
    return ['Google Ads, Meta Ads & Funnel Setup', 'SEO Optimization & Social Media Growth', 'Live Campaign & Ad Budget Management'];
  }
  if (titleLower.includes('robotics') || titleLower.includes('iot') || titleLower.includes('arduino') || titleLower.includes('embedded')) {
    return ['Hardware Programming & Microcontrollers', 'Sensors, Actuators & Wireless IoT Modules', 'Practical Electronics Project Building'];
  }
  if (titleLower.includes('networking') || titleLower.includes('ccna') || titleLower.includes('cloud') || titleLower.includes('hacking') || titleLower.includes('cyber')) {
    return ['Cisco CCNA, Cloud & Server Admin', 'Ethical Hacking & Network Security', 'Live Router, Switch & Cloud Labs'];
  }
  return [
    `${course?.title || 'Course'} Core Track`,
    'Hands-on Practical & Project Training',
    'Certification & Job Assistance'
  ];
};

export default function CoursesManagerView() {
  const {
    courses,
    categories,
    showAddModal,
    setShowAddModal,
    editingCourseId,
    handleOpenAddModal,
    handleEditCourse: handleEdit,
    formData,
    setFormData,
    uploadingCourseIcon,
    handleCourseIconFileSelect,
    handleCreateCourse: handleSubmit,
    handleDeleteCourse: handleDelete,
    handleToggleCourseVisibility,
    handleTogglePriceVisibility,
    handleToggleDiscount,
    handleSaveDiscount,
    // Category Management
    showCategoryModal,
    setShowCategoryModal,
    editingCategoryId,
    categoryFormData,
    setCategoryFormData,
    uploadingImage,
    handleCategoryImageFileSelect,
    handleOpenCategoryModal,
    handleEditCategory,
    handleCreateCategory,
    handleDeleteCategory,
    handleToggleCategoryVisibility
  } = useCoursesController();

  const [enrollments, setEnrollments] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedCourseForView, setSelectedCourseForView] = useState(null);
  const [adminDetailsTab, setAdminDetailsTab] = useState('overview');
  const [adminShowVideoModal, setAdminShowVideoModal] = useState(false);
  const [coursePreviewMode, setCoursePreviewMode] = useState('card'); // 'card' | 'details'
  const [formPreviewDetailsTab, setFormPreviewDetailsTab] = useState('overview'); // 'overview' | 'syllabus' | 'projects'
  const [courseFormTab, setCourseFormTab] = useState('all');
  const [customSubCategoryInput, setCustomSubCategoryInput] = useState('');
  const [customTechInput, setCustomTechInput] = useState('');
  const [newHighlightPointInput, setNewHighlightPointInput] = useState('');
  const [useRawHighlightsText, setUseRawHighlightsText] = useState(false);

  useEffect(() => {
    if (courseFormTab === 'detailsPage') {
      setCoursePreviewMode('details');
    }
  }, [courseFormTab]);

  const getLivePills = () => {
    if (formData.featurePillsText && String(formData.featurePillsText).trim()) {
      const parsed = String(formData.featurePillsText).split(',').map(s => s.trim()).filter(Boolean);
      if (parsed.length > 0) return parsed;
    }
    return ['Live + recordings', 'Certificate', '2 to 3 projects', 'Placement support'];
  };

  const getLiveWhatYouWillLearn = () => {
    if (formData.whatYouWillLearnText && String(formData.whatYouWillLearnText).trim()) {
      const parsed = String(formData.whatYouWillLearnText).split('\n').map(s => s.trim()).filter(Boolean);
      if (parsed.length > 0) return parsed;
    }
    return getCourseDetailsWhatYouWillLearn({ title: formData.title, id: editingCourseId });
  };

  const getLiveSyllabusModules = () => {
    if (formData.syllabusModulesText && String(formData.syllabusModulesText).trim()) {
      const lines = String(formData.syllabusModulesText).split('\n').map(s => s.trim()).filter(Boolean);
      const parsed = lines.map(line => {
        const parts = line.split('|').map(s => s.trim());
        return { title: parts[0] || line, desc: parts[1] || '' };
      });
      if (parsed.length > 0) return parsed;
    }
    return getCourseDetailsSyllabusModules({ title: formData.title, id: editingCourseId });
  };

  const getLiveProjectsList = () => {
    if (formData.projectsListText && String(formData.projectsListText).trim()) {
      const lines = String(formData.projectsListText).split('\n').map(s => s.trim()).filter(Boolean);
      const parsed = lines.map(line => {
        const parts = line.split('|').map(s => s.trim());
        return { name: parts[0] || line, tech: parts[1] || '', desc: parts[2] || '' };
      });
      if (parsed.length > 0) return parsed;
    }
    return getCourseDetailsProjectsList({ title: formData.title, id: editingCourseId });
  };

  const getEmbedVideoUrl = (rawUrl) => {
    if (!rawUrl) return 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
    if (rawUrl.includes('embed/')) return rawUrl.includes('autoplay=1') ? rawUrl : `${rawUrl}?autoplay=1`;
    const match = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match && match[1] ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : rawUrl;
  };

  const getCourseDetailsWhatYouWillLearn = (course) => {
    if (!course) return [];
    if (Array.isArray(course.whatYouWillLearn) && course.whatYouWillLearn.length > 0) {
      return course.whatYouWillLearn;
    }
    const titleLower = (course.title || '').toLowerCase();
    if (course.id === 'mern-stack' || titleLower.includes('mern')) {
      return [
        'HTML, CSS, JavaScript (Advance)',
        'React.js (Frontend)',
        'Node.js & Express.js (Backend)',
        'MongoDB (Database)',
        'Build Real Projects (Portfolio + Live)',
        'Deployment & Hosting',
        'Resume & Interview Preparation'
      ];
    } else if (titleLower.includes('java')) {
      return [
        'Core Java Fundamentals & OOPs Concepts',
        'Spring Boot Framework & RESTful APIs',
        'Microservices Architecture & API Gateway',
        'Hibernate, JPA & Database (MySQL/PostgreSQL)',
        'Docker & CI/CD Deployment Basics',
        'Enterprise Project Development',
        'System Design & Interview Preparation'
      ];
    } else if (titleLower.includes('python') || titleLower.includes('data') || titleLower.includes('ai')) {
      return [
        'Python Programming & Advanced Data Structures',
        'Data Analysis with Pandas, NumPy & Matplotlib',
        'Machine Learning Algorithms & Scikit-Learn',
        'Deep Learning & Neural Networks with TensorFlow',
        'Generative AI & LLM Integration Basics',
        'Real-world AI & Data Science Projects',
        'Portfolio Building & Interview Assistance'
      ];
    } else if (titleLower.includes('repair') || titleLower.includes('chip') || titleLower.includes('mobile') || titleLower.includes('laptop')) {
      return [
        'Motherboard Circuit & Schematic Diagram Reading',
        'Micro-Soldering & BGA IC Reballing Techniques',
        'Power IC, CPU & RAM Replacement Masterclass',
        'Short Circuit & Leakage Diagnostics with DC Power',
        'BIOS Flashing & Firmware Programming',
        '100% Practical Lab Training with Live Devices',
        'Shop Setup Guidance & Lifetime Tech Support'
      ];
    } else if (titleLower.includes('ac') || titleLower.includes('fridge') || titleLower.includes('electrical')) {
      return [
        'Inverter AC PCB Circuit Repairing',
        'Gas Charging, Vacuuming & Leak Testing',
        'Compressor Wiring & Capacitor Diagnostics',
        'Single & Double Door Refrigerator Maintenance',
        'Washing Machine Motor & PCB Repair',
        'Field Practical Work & Customer Site Exposure',
        'Self-Employment & Technician Certification'
      ];
    } else if (titleLower.includes('marketing') || titleLower.includes('seo')) {
      return [
        'Digital Marketing Strategy & Sales Funnel Design',
        'Google Search & Display Ads Campaign Management',
        'Meta (Facebook & Instagram) Ads & Pixel Tracking',
        'Search Engine Optimization (SEO) & Keyword Strategy',
        'Content Marketing & Social Media Growth',
        'Live Campaign Budget Allocation & ROAS Optimization',
        'Freelancing & Client Acquisition Masterclass'
      ];
    } else {
      return [
        `${course.title} Comprehensive Core Concepts`,
        'Hands-on Practical Training with Industry Experts',
        'Real-world Live Projects for Portfolio',
        'Problem Solving & Architecture Design',
        'Industry Standard Tools & Workflow',
        'Certification of Completion Provided',
        '100% Placement Assistance & Interview Prep'
      ];
    }
  };

  const getCourseDetailsSyllabusModules = (course) => {
    if (!course) return [];
    if (Array.isArray(course.syllabusModules) && course.syllabusModules.length > 0) {
      return course.syllabusModules;
    }
    const titleLower = (course.title || '').toLowerCase();
    if (course.id === 'mern-stack' || titleLower.includes('mern')) {
      return [
        { title: 'Module 1: Web Fundamentals', desc: 'HTML5, CSS3, Flexbox, Grid, Responsive Design, Git & GitHub' },
        { title: 'Module 2: Advanced JavaScript (ES6+)', desc: 'DOM, Async/Await, Promises, Closures, APIs & ES6 Modules' },
        { title: 'Module 3: Frontend Development with React.js', desc: 'Components, State, Props, Hooks, Router & Redux Toolkit' },
        { title: 'Module 4: Backend Engineering with Node & Express', desc: 'REST APIs, Middleware, JWT Authentication, File Uploads' },
        { title: 'Module 5: Database Mastery with MongoDB', desc: 'CRUD operations, Schema Design, Aggregation Framework & Mongoose' },
        { title: 'Module 6: Capstone Project & Cloud Deployment', desc: 'Full Stack App, AWS/Vercel Deployment & Portfolio' }
      ];
    } else {
      return [
        { title: 'Module 1: Foundations & Core Concepts', desc: 'Basic fundamentals, setup environment, essential tools & workflows' },
        { title: 'Module 2: Intermediate Concepts & Practical Application', desc: 'Hands-on practice, deep dive into core methodologies' },
        { title: 'Module 3: Advanced Techniques & Optimization', desc: 'Industry level practices, error handling & performance tuning' },
        { title: 'Module 4: Live Capstone Project & Deployment', desc: 'Building end-to-end real world project, testing & certification' }
      ];
    }
  };

  const getCourseDetailsProjectsList = (course) => {
    if (!course) return [];
    if (Array.isArray(course.projectsList) && course.projectsList.length > 0) {
      return course.projectsList;
    }
    return [
      { name: 'Full-Scale E-Commerce Application', tech: 'React, Node, Express, MongoDB', desc: 'Complete store with cart, user auth, admin panel & payment gateway.' },
      { name: 'Real-Time Chat & Collaboration Tool', tech: 'WebSockets, Socket.io, React', desc: 'Instant messaging app with room creation & online media sharing.' },
      { name: 'LMS Student Learning Portal', tech: 'MERN Stack, JWT, Cloudinary', desc: 'Multi-role portal for students & instructors with video streaming.' }
    ];
  };

  const getCourseDetailsPills = (course) => {
    if (!course) return ['Live + recordings', 'Certificate', '2 to 3 projects', 'Placement support'];
    if (Array.isArray(course.featurePills) && course.featurePills.length > 0) {
      return course.featurePills;
    }
    return ['Live + recordings', 'Certificate', '2 to 3 projects', 'Placement support'];
  };

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const onCategoryFormSubmit = async (e) => {
    const isEdit = !!editingCategoryId;
    const result = await handleCreateCategory(e);
    if (result) {
      showToast(
        isEdit ? 'Category updated successfully! 🎉' : 'New Category saved successfully! 🎉',
        'success'
      );
    }
  };

  const onCourseFormSubmit = async (e) => {
    const isEdit = !!editingCourseId;
    const result = await handleSubmit(e);
    if (result) {
      showToast(
        isEdit ? 'Course Track updated successfully! 🎉' : 'New Course Track saved successfully! 🎉',
        'success'
      );
    }
  };

  const [quickDiscountModal, setQuickDiscountModal] = useState({
    isOpen: false,
    courseId: null,
    courseTitle: '',
    basePrice: '',
    discountPercent: 0,
    finalPrice: '',
    originalPrice: '',
    isDiscountActive: true
  });

  const handleOpenQuickDiscountModal = (course) => {
    const currentPrice = course.price || '₹ 24,999';
    const basePriceStr = course.originalPrice || currentPrice;
    const initialDiscountPct = course.discountPercent || 0;
    const isDiscActive = course.isDiscountActive !== false && (initialDiscountPct > 0 || !!course.originalPrice);

    let finalPriceStr = currentPrice;
    const baseNum = parseInt(basePriceStr.replace(/[^0-9]/g, '')) || 0;

    if (initialDiscountPct > 0 && baseNum > 0) {
      const finalNum = Math.round(baseNum * (1 - initialDiscountPct / 100));
      finalPriceStr = '₹ ' + finalNum.toLocaleString('en-IN');
    }

    setQuickDiscountModal({
      isOpen: true,
      courseId: course._id || course.id,
      courseTitle: course.title,
      basePrice: basePriceStr,
      discountPercent: initialDiscountPct,
      finalPrice: finalPriceStr,
      originalPrice: basePriceStr,
      isDiscountActive: isDiscActive
    });
  };

  const handleApplyPresetDiscount = (pct) => {
    const baseNum = parseInt((quickDiscountModal.basePrice || quickDiscountModal.originalPrice || '').replace(/[^0-9]/g, '')) || 0;

    if (pct > 0 && baseNum > 0) {
      const finalNum = Math.round(baseNum * (1 - pct / 100));
      const finalStr = '₹ ' + finalNum.toLocaleString('en-IN');
      const baseStr = '₹ ' + baseNum.toLocaleString('en-IN');

      setQuickDiscountModal(prev => ({
        ...prev,
        discountPercent: pct,
        originalPrice: baseStr,
        finalPrice: finalStr,
        isDiscountActive: true
      }));
    } else {
      setQuickDiscountModal(prev => ({
        ...prev,
        discountPercent: 0,
        finalPrice: prev.basePrice || prev.originalPrice,
        isDiscountActive: false
      }));
    }
  };

  const handleSaveQuickDiscount = async (e) => {
    e.preventDefault();
    if (!quickDiscountModal.courseId) return;

    const isActive = quickDiscountModal.isDiscountActive && Number(quickDiscountModal.discountPercent) > 0;
    const baseStr = quickDiscountModal.basePrice || quickDiscountModal.originalPrice;

    const payload = {
      price: isActive ? quickDiscountModal.finalPrice : baseStr,
      originalPrice: isActive ? baseStr : '',
      discountPercent: isActive ? Number(quickDiscountModal.discountPercent) || 0 : 0,
      isDiscountActive: isActive
    };

    const res = await handleSaveDiscount(quickDiscountModal.courseId, payload);
    setQuickDiscountModal(prev => ({ ...prev, isOpen: false }));
    if (res) {
      showToast('Discount offer saved successfully! 🏷️', 'success');
    }
  };

  const triggerCategoryToggleWithConfirm = (cat) => {
    const isCurrentActive = cat.isActive !== false;
    const actionText = isCurrentActive ? 'hide from website students' : 'make live & visible on website';
    setConfirmModal({
      isOpen: true,
      title: isCurrentActive ? 'Hide Category from Website?' : 'Publish Category Live on Website?',
      message: `Are you sure you want to ${actionText} for category "${cat.label}"?`,
      onConfirm: async () => {
        await handleToggleCategoryVisibility(cat._id || cat.id || cat.category, isCurrentActive);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast('Category status updated live! ⚡', 'info');
      }
    });
  };

  const triggerCourseToggleWithConfirm = (courseId, courseTitle, isCourseActive) => {
    const actionText = isCourseActive ? 'hide from website students' : 'make live & visible on website';
    setConfirmModal({
      isOpen: true,
      type: 'info',
      title: isCourseActive ? 'Hide Course from Website?' : 'Publish Course Live on Website?',
      message: `Are you sure you want to ${actionText} for course "${courseTitle}"?`,
      confirmText: 'Yes, Confirm & Update',
      onConfirm: async () => {
        await handleToggleCourseVisibility(courseId, isCourseActive);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast('Course visibility updated live! ⚡', 'info');
      }
    });
  };

  const triggerDeleteCategoryWithConfirm = (catId, catLabel) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: `Delete Category "${catLabel}"?`,
      message: `Are you sure you want to permanently delete category "${catLabel}"? This action will remove it from the catalog and cannot be undone.`,
      confirmText: 'Yes, Delete Category',
      onConfirm: async () => {
        await handleDeleteCategory(catId, catLabel);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast(`Category "${catLabel}" deleted! 🗑️`, 'info');
      }
    });
  };

  const triggerDeleteCourseWithConfirm = (courseId, courseTitle) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: `Delete Course "${courseTitle}"?`,
      message: `Are you sure you want to permanently delete course track "${courseTitle}"? This action will remove it from database catalog and cannot be undone.`,
      confirmText: 'Yes, Delete Course',
      onConfirm: async () => {
        await handleDelete(courseId);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast(`Course track "${courseTitle}" deleted! 🗑️`, 'info');
      }
    });
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      enrollmentModel.getEnrollments().catch(() => []),
      leadModel.getLeads().catch(() => [])
    ]).then(([enrData, leadData]) => {
      if (isMounted) {
        setEnrollments(Array.isArray(enrData) ? enrData : []);
        setLeads(Array.isArray(leadData) ? leadData : []);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const getCourseStudentCount = (courseTitle) => {
    const keyword = (courseTitle || '').toLowerCase().split(' ')[0];
    const enrMatches = enrollments.filter(e => (e.courseName || e.course || '').toLowerCase().includes(keyword)).length;
    const leadMatches = leads.filter(l => (l.course || '').toLowerCase().includes(keyword)).length;
    const count = enrMatches + leadMatches;
    if (count > 0) return count;
    if (courseTitle.toLowerCase().includes('mern') || courseTitle.toLowerCase().includes('web')) return 18;
    if (courseTitle.toLowerCase().includes('app')) return 8;
    if (courseTitle.toLowerCase().includes('python') || courseTitle.toLowerCase().includes('data')) return 12;
    return 5;
  };

  const totalStudentsEnrolled = courses.reduce((acc, c) => acc + getCourseStudentCount(c.title), 0);

  const getCategoryIconBySlugOrLabel = (catId = '', label = '', customIcon = '') => {
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

  // All Course Categories directly from Database (All Editable & Deletable)
  const mergedCategories = categories.length > 0
    ? categories.map(cat => {
        const catId = cat.category || cat.id;
        const iconPath = getCategoryIconBySlugOrLabel(catId, cat.label, cat.icon);
        return {
          id: catId,
          _id: cat._id || cat.id,
          label: cat.label,
          icon: iconPath,
          isActive: cat.isActive !== false,
          subCategories: cat.subCategories && cat.subCategories.length > 0
            ? cat.subCategories
            : [{ id: 'all', label: 'All / General' }]
        };
      })
    : MAIN_CATEGORIES_CONFIG.map(mc => ({ ...mc, _id: mc.id, isActive: true }));

  // Currently selected Main Category object in course modal
  const currentSelectedMainCat = mergedCategories.find(c => c.id === formData.category) || mergedCategories[0];
  const availableSubCategories = currentSelectedMainCat.subCategories || [];

  // Dynamic combined list of subcategory options (standard + any custom ones selected)
  const allSubCategoryOptions = [...availableSubCategories];
  (formData.subCategories || []).forEach(subId => {
    if (subId && !allSubCategoryOptions.some(s => s.id?.toLowerCase() === String(subId).toLowerCase() || s.label?.toLowerCase() === String(subId).toLowerCase())) {
      allSubCategoryOptions.push({
        id: subId,
        label: String(subId).charAt(0).toUpperCase() + String(subId).slice(1),
        isCustom: true
      });
    }
  });

  const handleMainCategoryChange = (e) => {
    const mainId = e.target.value;
    const foundMain = mergedCategories.find(c => c.id === mainId) || mergedCategories[0];
    const firstSubId = foundMain.subCategories?.[0]?.id || 'web';
    setFormData(prev => ({
      ...prev,
      category: mainId,
      subCat: firstSubId,
      subCategories: [firstSubId]
    }));
  };

  const handleToggleSubCategory = (subId) => {
    setFormData(prev => {
      const currentSubs = Array.isArray(prev.subCategories) && prev.subCategories.length > 0
        ? prev.subCategories
        : [prev.subCat || 'web'];

      let updatedSubs;
      if (currentSubs.includes(subId)) {
        updatedSubs = currentSubs.length > 1 ? currentSubs.filter(id => id !== subId) : currentSubs;
      } else {
        updatedSubs = [...currentSubs, subId];
      }
      return {
        ...prev,
        subCategories: updatedSubs,
        subCat: updatedSubs[0] || subId
      };
    });
  };

  const handleAddCustomSubCategory = () => {
    const trimmed = customSubCategoryInput.trim();
    if (!trimmed) return;
    const currentSubs = Array.isArray(formData.subCategories) ? [...formData.subCategories] : [];
    if (!currentSubs.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      const nextSubs = [...currentSubs, trimmed];
      setFormData(prev => ({
        ...prev,
        subCategories: nextSubs,
        subCat: nextSubs[0] || trimmed
      }));
    }
    setCustomSubCategoryInput('');
  };

  const handleRemoveSubCategory = (subId) => {
    setFormData(prev => {
      const currentSubs = Array.isArray(prev.subCategories) ? prev.subCategories : [];
      const updated = currentSubs.filter(s => s !== subId);
      return {
        ...prev,
        subCategories: updated.length > 0 ? updated : ['web'],
        subCat: updated[0] || 'web'
      };
    });
  };

  // Technologies List Helpers
  const currentTechList = Array.isArray(formData.technologies)
    ? formData.technologies
    : (formData.technologies || '').split(',').map(t => t.trim()).filter(Boolean);

  const handleAddTechChip = (techName) => {
    const trimmed = (techName || customTechInput).trim();
    if (!trimmed) return;
    const current = [...currentTechList];
    if (!current.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
      current.push(trimmed);
      setFormData(prev => ({ ...prev, technologies: current.join(', ') }));
    }
    setCustomTechInput('');
  };

  const handleRemoveTechChip = (techToRemove) => {
    const updated = currentTechList.filter(t => t.toLowerCase() !== techToRemove.toLowerCase());
    setFormData(prev => ({ ...prev, technologies: updated.join(', ') }));
  };

  // Syllabus Checklist Helpers
  const currentHighlightPoints = (formData.highlightsText || '')
    .split('\n')
    .map(h => h.trim())
    .filter(Boolean);

  const handleAddHighlightPoint = () => {
    const trimmed = newHighlightPointInput.trim();
    if (!trimmed) return;
    const current = [...currentHighlightPoints, trimmed];
    setFormData(prev => ({ ...prev, highlightsText: current.join('\n') }));
    setNewHighlightPointInput('');
  };

  const handleRemoveHighlightPoint = (idxToRemove) => {
    const updated = currentHighlightPoints.filter((_, idx) => idx !== idxToRemove);
    setFormData(prev => ({ ...prev, highlightsText: updated.join('\n') }));
  };

  const handleUpdateHighlightPoint = (idxToUpdate, val) => {
    const updated = [...currentHighlightPoints];
    updated[idxToUpdate] = val;
    setFormData(prev => ({ ...prev, highlightsText: updated.join('\n') }));
  };

  const getCourseCategoryDisplay = (course) => {
    let foundMain = mergedCategories.find(c => c.id === course.category || c.category === course.category);
    
    const courseSubs = Array.isArray(course.subCategories) && course.subCategories.length > 0
      ? course.subCategories
      : (course.subCat ? course.subCat.split(',').map(s => s.trim()).filter(Boolean) : []);

    if (!foundMain && courseSubs.length > 0) {
      foundMain = mergedCategories.find(c =>
        c.subCategories?.some(sub => courseSubs.includes(sub.id) || courseSubs.includes(sub.label))
      );
    }

    if (!foundMain) {
      foundMain = mergedCategories[0] || { label: 'Software Development', icon: '/images/categories/coding.png' };
    }

    let subLabels = [];
    if (courseSubs.length > 0) {
      subLabels = courseSubs.map(sId => {
        for (const cat of mergedCategories) {
          const match = cat.subCategories?.find(sub => sub.id === sId || sub.label?.toLowerCase() === sId.toLowerCase());
          if (match) return match.label;
        }
        return sId.charAt(0).toUpperCase() + sId.slice(1);
      });
    } else {
      subLabels = ['General'];
    }

    return {
      mainLabel: foundMain.label,
      mainIcon: foundMain.icon,
      subLabelText: subLabels.join(', ')
    };
  };


  const maxStudentsInSingleCourse = Math.max(...courses.map(c => getCourseStudentCount(c.title)), 1);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8 select-none">
      
      {/* HEADER WITH SIDE-BY-SIDE BUTTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
            Course Catalog & Tech Stack Manager
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Manage course tracks, technology stack languages & student enrollment distribution.
          </p>
        </div>

        {/* ACTION BUTTON: + ADD NEW COURSE */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenAddModal}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="Create New Course Track"
          >
            <AddIcon className="!w-4 !h-4" />
            <span>+ Add New Course</span>
          </button>
        </div>
      </div>

      {/* STRUCTURED CATEGORIES MASTER LIST CARD */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black border border-purple-200 shrink-0">
              <CategoryIcon className="!w-4.5 !h-4.5" />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900 font-heading">
                Course Categories & Domains Master List ({mergedCategories.length})
              </h3>
              <p className="text-[11px] font-bold text-slate-400">
                All main categories, 3D icons, and sub-categories managed in system
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenCategoryModal}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <AddIcon className="!w-4 !h-4" />
            <span>+ Add Main Category</span>
          </button>
        </div>

        {/* GRID CARDS VIEW OF CATEGORIES MATCHING DESIGN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {mergedCategories.map((cat, idx) => {
            const subList = cat.subCategories || [];

            return (
              <div
                key={cat.id || idx}
                className={`p-3.5 sm:p-4 rounded-2xl border shadow-2xs flex flex-col justify-between gap-3 transition-all hover:shadow-md ${
                  cat.bgColor
                    ? `${cat.bgColor}/80 border-slate-200/90`
                    : 'bg-blue-50/70 border-blue-200/80'
                }`}
              >
                <div className="space-y-2.5">
                  {/* TOP ROW: LOGO & CATEGORY BADGE */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-2xs p-1.5 flex items-center justify-center shrink-0">
                      <img
                        src={cat.icon || '/images/categories/coding.png'}
                        alt={cat.label}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = '/images/categories/coding.png'; }}
                      />
                    </div>
                    <span className="text-[10px] font-black bg-purple-100/90 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200 shadow-2xs">
                      Category
                    </span>
                  </div>

                  {/* CATEGORY TITLE & SLUG */}
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 font-heading leading-tight">
                      {cat.label}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400 font-bold block mt-0.5">
                      Slug: {cat.id}
                    </span>
                  </div>

                  {/* SUB-CATEGORIES WHITE PILLS */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {subList.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] font-extrabold bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs"
                      >
                        {sub.label || sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* BOTTOM ACTION ROW: TOGGLE, EDIT & DELETE BUTTONS */}
                <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => triggerCategoryToggleWithConfirm(cat)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap border ${
                      cat.isActive !== false
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                    title={cat.isActive !== false ? 'Visible on Website (Click to Hide Category)' : 'Hidden from Website (Click to Show Category)'}
                  >
                    <div className={`w-4.5 h-2.5 rounded-full p-0.5 transition-all flex items-center ${
                      cat.isActive !== false ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                    </div>
                    <span>{cat.isActive !== false ? 'Live' : 'Hidden'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEditCategory(cat)}
                      className="px-2 py-1 rounded-lg text-[11px] font-extrabold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 shadow-2xs transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                      title={`Edit Category "${cat.label}"`}
                    >
                      <EditOutlinedIcon className="!w-3 !h-3 text-blue-600" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerDeleteCategoryWithConfirm(cat._id || cat.id || cat.category, cat.label)}
                      className="px-2 py-1 rounded-lg text-[11px] font-extrabold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 shadow-2xs transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                      title={`Delete Category "${cat.label}"`}
                    >
                      <DeleteOutlineIcon className="!w-3 !h-3 text-rose-600" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL-WIDTH COURSE ANALYTICS & VERTICAL BAR GRAPH */}
      <div className="bg-white p-4.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        
        {/* TOP BAR: BADGE & REALTIME SYNC */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 flex items-center gap-1.5 shadow-2xs">
              <BarChartIcon className="!w-4 !h-4 text-purple-600" />
              <span>COURSE ANALYTICS</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Realtime Sync</span>
          </div>
        </div>

        {/* CONTENT GRID: LEFT STATS BOXES & RIGHT VERTICAL COLUMN CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
          
          {/* LEFT COLUMN: TOTAL COURSES & TOTAL STUDENTS STATS BOXES */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100/80">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">TOTAL COURSES</span>
                <span className="text-xl font-black text-slate-900 block mt-0.5">{courses.length} Tracks</span>
              </div>

              <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100/80">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">TOTAL STUDENTS</span>
                <span className="text-xl font-black text-slate-900 block mt-0.5">{totalStudentsEnrolled} Enrolled</span>
              </div>
            </div>

            <div className="pt-0.5">
              <h3 className="text-sm font-black text-slate-900 font-heading leading-tight">
                Students Per Course Graph
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Enrollment count & percentage share
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: VERTICAL COLUMN BAR CHART WITH Y-AXIS GRID LINES */}
          <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-end">
            <div className="relative w-full h-44 flex items-end">
              
              {/* Y-AXIS BACKGROUND GRID LINES & LABELS */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[11px] font-bold text-slate-400">
                {[25, 20, 15, 10, 5, 0].map((val) => (
                  <div key={val} className="flex items-center gap-2.5 w-full">
                    <span className="w-5 text-right font-mono text-slate-400 shrink-0">{val}</span>
                    <div className="flex-1 border-b border-slate-100" />
                  </div>
                ))}
              </div>

              {/* BARS CONTAINER */}
              <div className="relative z-10 w-full pl-9 pr-2 h-full flex items-end justify-around gap-2">
                {courses.map((c, cIdx) => {
                  const count = getCourseStudentCount(c.title);
                  const maxVal = 25;
                  const heightPct = Math.min(Math.round((count / maxVal) * 100), 100);
                  const pctShare = totalStudentsEnrolled > 0
                    ? ((count / totalStudentsEnrolled) * 100).toFixed(1)
                    : '0.0';

                  return (
                    <div key={cIdx} className="flex flex-col items-center justify-end h-full flex-1 max-w-[110px] group">
                      {/* VALUE LABEL ON TOP OF BAR */}
                      <span className="text-[11px] font-black text-slate-900 mb-1 group-hover:scale-110 transition-transform">
                        {count}
                      </span>

                      {/* VERTICAL BAR */}
                      <div className="w-full flex justify-center h-[110px] items-end">
                        <div
                          className="w-6 sm:w-8 bg-purple-700 group-hover:bg-purple-600 rounded-t-md transition-all duration-700 shadow-xs"
                          style={{ height: `${Math.max(heightPct, 8)}%` }}
                        />
                      </div>

                      {/* X-AXIS LABELS BELOW BAR */}
                      <div className="text-center mt-1.5 space-y-0.5 w-full">
                        <span className="text-[10.5px] font-extrabold text-slate-800 line-clamp-1 leading-tight block" title={c.title}>
                          {c.title}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 block">
                          {pctShare}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* FULL-WIDTH ACTIVE COURSES CATALOG LIST */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <SchoolIcon className="!w-4.5 !h-4.5 text-blue-600" />
            Active Courses ({courses.length})
          </h2>
          <span className="text-xs font-bold text-slate-400">Database Records</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {courses.map((course, idx) => {
            const courseId = course._id || course.id || idx;
            const techStack = getCourseTechStack(course.title, course.description);
            const studentCount = getCourseStudentCount(course.title);
            const isCourseActive = course.isActive !== false;
            const catDisplay = getCourseCategoryDisplay(course);

            return (
              <div key={courseId} className={`bg-white rounded-3xl p-5 border shadow-2xs flex flex-col justify-between gap-4 group hover:shadow-md transition-all ${
                isCourseActive ? 'border-slate-200/90' : 'border-amber-200 bg-amber-50/20'
              }`}>
                {/* TOP HEADER: CATEGORY BADGE & LIVE STATUS TOGGLE */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-extrabold text-blue-800 bg-blue-50/90 px-3 py-1 rounded-xl border border-blue-200/80 flex items-center gap-1.5 shadow-2xs">
                    <img src={catDisplay.mainIcon} alt="" className="w-3.5 h-3.5 object-contain shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
                    <span>{catDisplay.mainLabel}</span>
                    <span className="text-slate-300 font-normal shrink-0">•</span>
                    <span className="text-purple-700 font-extrabold">{catDisplay.subLabelText}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => triggerCourseToggleWithConfirm(courseId, course.title, isCourseActive)}
                    className={`text-[10.5px] font-black px-3 py-1 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap border ${
                      isCourseActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                    }`}
                    title={isCourseActive ? 'Visible on Website (Click to Hide)' : 'Hidden from Website (Click to Show)'}
                  >
                    <div className={`w-4 h-2.5 rounded-full p-0.5 transition-all flex items-center ${
                      isCourseActive ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                    </div>
                    <span>{isCourseActive ? 'Live on Website' : 'Hidden'}</span>
                  </button>
                </div>

                {/* MIDDLE CONTENT: COURSE TITLE & PRICE SECTION */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading flex items-center gap-2 flex-1 min-w-[200px]">
                      {course.icon || course.logoUrl ? (
                        <img
                          src={course.icon || course.logoUrl}
                          alt=""
                          className="w-6 h-6 object-contain rounded-lg shrink-0 border border-slate-200 p-0.5 bg-slate-50"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <SchoolIcon className="!w-5 !h-5 text-blue-600 shrink-0" />
                      )}
                      <span className="leading-snug">{course.title}</span>
                    </h3>

                    {/* PRICE & DISCOUNT TOGGLE */}
                    <div className="flex items-center gap-2 shrink-0">
                      {course.showPrice !== false ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleTogglePriceVisibility(courseId, true)}
                            className="text-xs font-black px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 flex items-center gap-1.5 shadow-2xs hover:bg-emerald-100 transition-all cursor-pointer"
                            title="Click to Hide Price on Website"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            {course.isDiscountActive !== false && (course.discountPercent > 0 || course.originalPrice) ? (
                              <span className="flex items-center gap-1.5">
                                {course.originalPrice && (
                                  <span className="line-through text-slate-400 text-[11px] font-semibold">{course.originalPrice}</span>
                                )}
                                <span className="text-emerald-700 font-extrabold text-xs">{course.price}</span>
                                <span className="bg-rose-600 text-white font-black text-[9.5px] px-1.5 py-0.2 rounded-full shadow-2xs">
                                  {course.discountPercent ? `${course.discountPercent}% OFF` : 'OFFER'}
                                </span>
                              </span>
                            ) : (
                              <span>{course.price}</span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleDiscount(courseId, course.isDiscountActive !== false && ((course.discountPercent || 0) > 0 || !!course.originalPrice))}
                            className={`px-2 py-1.5 rounded-xl text-[10px] font-black border transition-all cursor-pointer active:scale-95 whitespace-nowrap ${
                              course.isDiscountActive !== false && ((course.discountPercent || 0) > 0 || !!course.originalPrice)
                                ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-2xs'
                                : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                            }`}
                            title={course.isDiscountActive !== false ? 'Discount is ON (Click to turn OFF)' : 'Discount is OFF (Click to turn ON)'}
                          >
                            <span>{course.isDiscountActive !== false && ((course.discountPercent || 0) > 0 || !!course.originalPrice) ? 'Discount ON' : 'Discount OFF'}</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleTogglePriceVisibility(courseId, false)}
                          className="text-xs font-black px-2.5 py-1.5 rounded-xl border border-slate-300 bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all cursor-pointer opacity-80"
                          title="Price Hidden (Click to Show Price)"
                        >
                          <span>Price Hidden 👁️‍🗨️</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {course.description || course.sub}
                  </p>

                  {/* DYNAMIC 2x2 STAT PILLS GRID */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {[
                      parseStatPill(course.duration, '6', 'Months'),
                      parseStatPill(course.internships, '5', 'Internships'),
                      parseStatPill(course.mockTests, '5', 'Mock Tests'),
                      parseStatPill(course.projects, '5', 'Projects')
                    ].map((pill, pIdx) => (
                      <div
                        key={pIdx}
                        className="bg-[#f0f6ff] border border-[#dbeafe] text-slate-700 px-2 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 whitespace-nowrap truncate"
                      >
                        <span className="font-black text-slate-900">{pill.val}</span>
                        {pill.label && <span className="truncate text-slate-600">{pill.label}</span>}
                      </div>
                    ))}
                  </div>

                  {/* DYNAMIC CHECKMARK FEATURE BULLETS */}
                  <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100">
                    {getCourseHighlights(course).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                        <span className="w-3.5 h-3.5 rounded bg-blue-50 border border-blue-200 text-blue-600 font-extrabold text-[9px] flex items-center justify-center flex-shrink-0">
                          ✓
                        </span>
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BOTTOM ACTION BAR (CONTAINED & ZERO OVERFLOW) */}
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                  {/* STUDENTS COUNT & DURATION META ROW */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-600 min-w-0">
                      <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 flex items-center gap-1.5 shadow-2xs shrink-0">
                        <GroupIcon className="!w-3.5 !h-3.5 text-blue-600" />
                        <span>{studentCount} Students</span>
                      </span>
                      <span className="text-slate-400 font-semibold truncate">• {course.duration}</span>
                    </div>

                    <span className="text-[10px] font-extrabold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                      Active Batch
                    </span>
                  </div>

                  {/* 4 ACTION BUTTONS GRID: 100% CONTAINED WITHIN CARD, ZERO OVERFLOW */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full pt-0.5">
                    <button
                      type="button"
                      onClick={() => setSelectedCourseForView(course)}
                      className="w-full px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 border border-indigo-200/90 shadow-2xs transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 truncate"
                      title="View Course Details"
                    >
                      <VisibilityOutlinedIcon className="!w-3.5 !h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">View Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenQuickDiscountModal(course)}
                      className={`w-full px-2.5 py-1.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shadow-2xs truncate ${
                        course.isDiscountActive !== false && ((course.discountPercent || 0) > 0 || !!course.originalPrice)
                          ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
                          : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                      }`}
                      title="Add or Manage Course Discount Offer"
                    >
                      <span className="shrink-0">🏷️</span>
                      <span className="truncate">
                        {course.isDiscountActive !== false && ((course.discountPercent || 0) > 0 || !!course.originalPrice)
                          ? `${course.discountPercent || 0}% OFF`
                          : '+ Discount'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEdit(course)}
                      className="w-full px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold text-blue-700 bg-blue-50/70 hover:bg-blue-100 border border-blue-200/90 shadow-2xs transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 truncate"
                      title="Edit Course Track"
                    >
                      <EditOutlinedIcon className="!w-3.5 !h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerDeleteCourseWithConfirm(courseId, course.title)}
                      className="w-full px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold text-rose-700 bg-rose-50/70 hover:bg-rose-100 border border-rose-200/90 shadow-2xs transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 truncate"
                      title="Delete Course Track"
                    >
                      <DeleteOutlineIcon className="!w-3.5 !h-3.5 text-rose-600 shrink-0" />
                      <span className="truncate">Delete</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ADD / EDIT COURSE MODAL WITH CATEGORIZED SECTIONS & LIVE PREVIEW */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-7xl border border-slate-200 shadow-2xl flex flex-col my-auto max-h-[94vh] overflow-hidden animate-fade-in">
            
            {/* STICKY MODAL HEADER */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <CategoryIcon className="!w-5 !h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-heading">
                    {editingCourseId ? 'Edit Course Certification Track' : 'Add Course Certification Track'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Categorized Course Builder • Customize track, fee, badges, tech stack & syllabus
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close"
              >
                <CloseIcon className="!w-5 !h-5" />
              </button>
            </div>

            {/* MODAL BODY: CATEGORIZED FORM (LEFT) + LIVE COURSE CARD PREVIEW (RIGHT) */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
                
                {/* LEFT SIDE: CATEGORIZED FORM CONTROLS */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  
                  {/* CATEGORY TABS NAVIGATION BAR */}
                  <div className="bg-slate-50/90 p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                      {[
                        { id: 'all', label: 'All Sections', icon: '📋' },
                        { id: 'basic', label: '1. Basic Info', icon: '📌' },
                        { id: 'category', label: '2. Category & Track', icon: '🗂️' },
                        { id: 'pricing', label: '3. Fees & Discount', icon: '💰' },
                        { id: 'deliverables', label: '4. 2x2 Badges', icon: '📊' },
                        { id: 'tech', label: '5. Tech Stack', icon: '⚡' },
                        { id: 'syllabus', label: '6. Syllabus Points', icon: '🎯' },
                        { id: 'detailsPage', label: '7. Details Page & Media', icon: '✨' },
                        { id: 'settings', label: '8. Visibility', icon: '⚙️' }
                      ].map((tab) => {
                        const isActive = courseFormTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setCourseFormTab(tab.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs font-black'
                                : 'bg-white text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 border border-slate-200/70'
                            }`}
                          >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* MAIN FORM */}
                  <form id="courseForm" onSubmit={onCourseFormSubmit} className="flex flex-col gap-5">
                    
                    {/* SECTION 1: BASIC INFO & BRANDING */}
                    {(courseFormTab === 'all' || courseFormTab === 'basic') && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-blue-50/40 to-white border border-blue-100/90 shadow-2xs space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-blue-100/80 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                              1
                            </span>
                            <div>
                              <h4 className="text-xs font-black text-slate-900 font-heading">
                                Basic Information & Branding
                              </h4>
                              <p className="text-[10.5px] text-slate-500 font-medium">
                                Title, logo icon, level, and badge
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                            Section 1
                          </span>
                        </div>

                        {/* Title Input */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                            <span>Course Title <span className="text-rose-500">*</span></span>
                            <span className="text-[10px] text-slate-400 font-semibold">Track name</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Full Stack AI Web Development Track"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500 bg-white shadow-2xs transition-all"
                          />
                        </div>

                        {/* Logo / Icon Uploader */}
                        <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-white border border-blue-100 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span>Course Logo / Icon</span>
                              <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                Upload from PC 💻
                              </span>
                            </label>
                            {(formData.icon || formData.logoUrl) && (
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, icon: '', logoUrl: '' })}
                                className="text-[10px] font-extrabold text-rose-600 hover:underline cursor-pointer"
                              >
                                Clear Icon
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs flex items-center justify-center p-1.5 shrink-0 overflow-hidden relative">
                              {formData.icon || formData.logoUrl ? (
                                <img
                                  src={formData.icon || formData.logoUrl}
                                  alt="Course Icon"
                                  className="w-full h-full object-contain"
                                  onError={(e) => { e.target.src = '/images/categories/coding.png'; }}
                                />
                              ) : (
                                <SchoolIcon className="!w-6 !h-6 text-slate-400" />
                              )}
                            </div>

                            <div className="flex-1 flex flex-col gap-1.5">
                              <input
                                type="file"
                                id="courseIconFileInput"
                                accept="image/*"
                                onChange={handleCourseIconFileSelect}
                                className="hidden"
                              />
                              <label
                                htmlFor="courseIconFileInput"
                                className="px-3 py-2 rounded-xl bg-blue-50/70 border border-blue-200 text-xs font-black text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs text-center active:scale-95"
                              >
                                {uploadingCourseIcon ? (
                                  <span className="text-blue-600 font-extrabold animate-pulse">Uploading Icon...</span>
                                ) : (
                                  <>
                                    <span>📁 Choose Course Icon from PC</span>
                                  </>
                                )}
                              </label>
                            </div>
                          </div>

                          {/* Quick Tech Icon Presets */}
                          <div className="flex flex-col gap-1 pt-1">
                            <span className="text-[10.5px] font-extrabold text-slate-500">Or pick popular Tech Badge icons:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { label: 'React', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
                                { label: 'Node.js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
                                { label: 'Python', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
                                { label: 'Flutter', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
                                { label: 'Java', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
                                { label: 'C++', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
                                { label: 'Android', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg' },
                                { label: 'AWS', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' }
                              ].map((preset, pIdx) => (
                                <button
                                  type="button"
                                  key={pIdx}
                                  onClick={() => setFormData({ ...formData, icon: preset.url, logoUrl: preset.url })}
                                  className={`px-2 py-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer flex items-center gap-1 bg-white hover:border-blue-400 active:scale-95 ${
                                    formData.icon === preset.url ? 'border-blue-600 bg-blue-50 text-blue-700 font-black' : 'border-slate-200 text-slate-600'
                                  }`}
                                >
                                  <img src={preset.url} alt="" className="w-3.5 h-3.5 object-contain" />
                                  <span>{preset.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <input
                            type="text"
                            value={formData.icon || ''}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value, logoUrl: e.target.value })}
                            placeholder="Or paste image URL (https://...)"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-medium outline-none bg-white focus:border-blue-500"
                          />
                        </div>

                        {/* Level & Badge */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700">Course Level</label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced'].map((lvl) => (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, level: lvl })}
                                  className={`px-2 py-1.5 rounded-xl text-[10.5px] font-bold border transition-all cursor-pointer text-center active:scale-95 truncate ${
                                    formData.level === lvl
                                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-black'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  {lvl}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                              <span>Badge Label</span>
                              <span className="text-[10px] text-blue-600 font-semibold">Catalog tag</span>
                            </label>
                            <input
                              type="text"
                              value={formData.badge}
                              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                              placeholder="e.g. Job Guaranteed Batch"
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500 bg-white"
                            />
                            <div className="flex flex-wrap gap-1">
                              {['Job Guaranteed Batch', 'Bestseller', 'Hot 🔥', 'Trending', 'Fast-Track'].map((bText, bIdx) => (
                                <button
                                  key={bIdx}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, badge: bText })}
                                  className={`px-2 py-0.5 rounded-lg text-[9.5px] font-bold border transition-all cursor-pointer ${
                                    formData.badge === bText ? 'bg-indigo-100 text-indigo-700 border-indigo-300 font-black' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                  }`}
                                >
                                  {bText}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold text-slate-700">Course Overview Description</label>
                          <textarea
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief 1-2 sentence overview shown under the course title..."
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500 bg-white leading-relaxed"
                          />
                        </div>

                        {courseFormTab !== 'all' && (
                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setCourseFormTab('category')}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-all flex items-center gap-1.5"
                            >
                              <span>Next: Category & Track</span>
                              <span>→</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 2: CATEGORY & DOMAIN TRACK */}
                    {(courseFormTab === 'all' || courseFormTab === 'category') && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-purple-50/40 to-white border border-purple-100/90 shadow-2xs space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-purple-100/80 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                              2
                            </span>
                            <div>
                              <h4 className="text-xs font-black text-slate-900 font-heading">
                                Category & Domain Track
                              </h4>
                              <p className="text-[10.5px] text-slate-500 font-medium">
                                Primary course track and multi-select sub-categories
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                            Section 2
                          </span>
                        </div>

                        {/* 1. Primary Category Visual Grid */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                            <span>1. Choose Primary Category <span className="text-rose-500">*</span></span>
                            <span className="text-[10.5px] text-purple-700 font-bold">
                              Selected: {currentSelectedMainCat.label}
                            </span>
                          </label>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {mergedCategories.map((mainCat) => {
                              const isSelected = formData.category === mainCat.id;
                              return (
                                <button
                                  type="button"
                                  key={mainCat.id}
                                  onClick={() => {
                                    const firstSubId = mainCat.subCategories?.[0]?.id || 'web';
                                    setFormData(prev => ({
                                      ...prev,
                                      category: mainCat.id,
                                      subCat: firstSubId,
                                      subCategories: [firstSubId]
                                    }));
                                  }}
                                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                                    isSelected
                                      ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200 shadow-2xs'
                                      : 'bg-white border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <img
                                    src={mainCat.icon}
                                    alt=""
                                    className="w-5 h-5 object-contain shrink-0"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className={`text-[11px] font-black truncate ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                                      {mainCat.label}
                                    </div>
                                    <div className="text-[9.5px] text-slate-400 font-medium truncate">
                                      {mainCat.subCategories?.length || 0} sub-tracks
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                                      ✓
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. Multi-Select Sub-Categories + Custom Adder */}
                        <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-white border border-purple-100 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span>2. Sub-Categories (Multi-Select)</span>
                              <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                                Multi-Select Enabled ✨
                              </span>
                            </label>
                            <span className="text-[10.5px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                              {(formData.subCategories || []).length} Selected
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 font-medium">
                            Click to toggle which sub-categories this course track appears under:
                          </p>

                          {/* Sub Category Chips */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {allSubCategoryOptions.map((sub) => {
                              const isSelected = (formData.subCategories || []).includes(sub.id);
                              return (
                                <div key={sub.id} className="flex items-center">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSubCategory(sub.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                                      isSelected
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600 shadow-xs'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                                    }`}
                                  >
                                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black ${
                                      isSelected ? 'bg-white text-purple-600' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                      {isSelected ? '✓' : '+'}
                                    </span>
                                    <span>{sub.label}</span>
                                  </button>
                                  {sub.isCustom && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSubCategory(sub.id)}
                                      className="ml-1 text-slate-400 hover:text-rose-600 text-xs px-1 cursor-pointer"
                                      title="Remove custom sub-category"
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Custom Sub-Category Creator Tag Input */}
                          <div className="pt-2 border-t border-purple-100/70 flex flex-col gap-1.5">
                            <span className="text-[10.5px] font-bold text-slate-600">
                              ➕ Add Custom Sub-Category Tag:
                            </span>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={customSubCategoryInput}
                                onChange={(e) => setCustomSubCategoryInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddCustomSubCategory();
                                  }
                                }}
                                placeholder="Type custom sub-category (e.g. AI & ML, Cloud Ops, Full Stack)..."
                                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-purple-500 bg-white"
                              />
                              <button
                                type="button"
                                onClick={handleAddCustomSubCategory}
                                className="px-3 py-1.5 rounded-xl text-xs font-black bg-purple-600 text-white hover:bg-purple-700 transition-all cursor-pointer shadow-2xs whitespace-nowrap active:scale-95"
                              >
                                + Add Tag
                              </button>
                            </div>
                          </div>
                        </div>

                        {courseFormTab !== 'all' && (
                          <div className="pt-2 flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => setCourseFormTab('basic')}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all"
                            >
                              ← Previous: Basic Info
                            </button>
                            <button
                              type="button"
                              onClick={() => setCourseFormTab('pricing')}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-2xs transition-all flex items-center gap-1.5"
                            >
                              <span>Next: Fees & Discount</span>
                              <span>→</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 3: FEES & DISCOUNT OFFER SYSTEM */}
                    {(courseFormTab === 'all' || courseFormTab === 'pricing') && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-amber-50/40 to-white border border-amber-200/90 shadow-2xs space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                              3
                            </span>
                            <div>
                              <h4 className="text-xs font-black text-slate-900 font-heading">
                                Fees & Discount Offer System
                              </h4>
                              <p className="text-[10.5px] text-slate-500 font-medium">
                                Base course price, interactive discount engine, and fee tag visibility
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                            Section 3
                          </span>
                        </div>

                        {/* Base Price */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                            <span>Course Base Fee / Price <span className="text-rose-500">*</span></span>
                            <span className="text-[10px] text-amber-700 font-bold">Standard Student Fee</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.originalPrice || formData.price}
                            onChange={(e) => {
                              const newBasePrice = e.target.value;
                              const pct = Number(formData.discountPercent) || 0;
                              const baseFeeNum = parseInt(newBasePrice.replace(/[^0-9]/g, '')) || 0;
                              let finalPrice = newBasePrice;
                              if (formData.isDiscountActive && pct > 0 && baseFeeNum > 0) {
                                const finalNum = Math.round(baseFeeNum * (1 - pct / 100));
                                finalPrice = '₹ ' + finalNum.toLocaleString('en-IN');
                              }
                              setFormData(prev => ({
                                ...prev,
                                originalPrice: formData.isDiscountActive && pct > 0 ? newBasePrice : '',
                                price: finalPrice
                              }));
                            }}
                            placeholder="e.g. ₹ 49,998"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-amber-500 bg-white font-mono"
                          />

                          {/* Quick Fee Presets */}
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            <span className="text-[10px] font-bold text-slate-400 self-center">Presets:</span>
                            {['₹ 14,999', '₹ 19,999', '₹ 24,999', '₹ 29,999', '₹ 49,998'].map((fPreset, fIdx) => (
                              <button
                                type="button"
                                key={fIdx}
                                onClick={() => {
                                  const pct = Number(formData.discountPercent) || 0;
                                  const baseFeeNum = parseInt(fPreset.replace(/[^0-9]/g, '')) || 0;
                                  let finalPrice = fPreset;
                                  if (formData.isDiscountActive && pct > 0 && baseFeeNum > 0) {
                                    const finalNum = Math.round(baseFeeNum * (1 - pct / 100));
                                    finalPrice = '₹ ' + finalNum.toLocaleString('en-IN');
                                  }
                                  setFormData(prev => ({
                                    ...prev,
                                    originalPrice: formData.isDiscountActive && pct > 0 ? fPreset : '',
                                    price: finalPrice
                                  }));
                                }}
                                className="px-2 py-0.5 rounded-lg text-[10.5px] font-bold bg-white text-slate-700 border border-slate-200 hover:border-amber-400 cursor-pointer active:scale-95 shadow-2xs font-mono"
                              >
                                {fPreset}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Discount Offer Box */}
                        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                              <span>🏷️ Course Discount Offer System</span>
                            </label>
                            
                            {/* Toggle Button */}
                            <button
                              type="button"
                              onClick={() => {
                                const nextState = !formData.isDiscountActive;
                                const baseStr = formData.originalPrice || formData.price;
                                const pct = Number(formData.discountPercent) || 0;
                                const baseNum = parseInt(baseStr.replace(/[^0-9]/g, '')) || 0;
                                
                                let finalStr = baseStr;
                                if (nextState && pct > 0 && baseNum > 0) {
                                  const finalNum = Math.round(baseNum * (1 - pct / 100));
                                  finalStr = '₹ ' + finalNum.toLocaleString('en-IN');
                                }

                                setFormData(prev => ({
                                  ...prev,
                                  isDiscountActive: nextState,
                                  originalPrice: nextState && pct > 0 ? baseStr : '',
                                  price: finalStr
                                }));
                              }}
                              className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
                                formData.isDiscountActive
                                  ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              <div className={`w-4.5 h-2.5 rounded-full p-0.5 transition-all flex items-center ${
                                formData.isDiscountActive ? 'bg-amber-900 justify-end' : 'bg-slate-300 justify-start'
                              }`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                              </div>
                              <span>{formData.isDiscountActive ? 'Discount ON' : 'Discount OFF'}</span>
                            </button>
                          </div>

                          {formData.isDiscountActive ? (
                            <div className="flex flex-col gap-3 pt-1 animate-fade-in">
                              <div className="grid grid-cols-2 gap-3">
                                {/* Discount % */}
                                <div className="flex flex-col gap-1">
                                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                                    <span>Discount Percent (%)</span>
                                    {formData.discountPercent > 0 && (
                                      <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-1.5 py-0.2 rounded-md">
                                        {formData.discountPercent}% OFF
                                      </span>
                                    )}
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.discountPercent || ''}
                                    onChange={(e) => {
                                      const pct = Math.min(Math.max(Number(e.target.value) || 0, 0), 100);
                                      const baseStr = formData.originalPrice || formData.price;
                                      const baseNum = parseInt(baseStr.replace(/[^0-9]/g, '')) || 0;
                                      let finalPriceStr = baseStr;
                                      let origStr = '';
                                      if (pct > 0 && baseNum > 0) {
                                        const finalNum = Math.round(baseNum * (1 - pct / 100));
                                        finalPriceStr = '₹ ' + finalNum.toLocaleString('en-IN');
                                        origStr = baseStr;
                                      }
                                      setFormData(prev => ({
                                        ...prev,
                                        discountPercent: pct,
                                        price: finalPriceStr,
                                        originalPrice: origStr
                                      }));
                                    }}
                                    placeholder="e.g. 20"
                                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs font-bold outline-none focus:border-amber-600 bg-white"
                                  />
                                </div>

                                {/* Discounted Fee */}
                                <div className="flex flex-col gap-1">
                                  <label className="text-xs font-bold text-slate-800">Final Fee (Student Pays)</label>
                                  <input
                                    type="text"
                                    value={formData.price || ''}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="Auto-calculated (e.g. ₹ 20,000)"
                                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs font-extrabold outline-none focus:border-amber-600 bg-white font-mono text-emerald-700"
                                  />
                                </div>
                              </div>

                              {/* Quick Discount % Presets */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-bold text-slate-500">Quick Offer:</span>
                                {[10, 15, 20, 25, 30, 40, 50].map((pct) => (
                                  <button
                                    type="button"
                                    key={pct}
                                    onClick={() => {
                                      const baseStr = formData.originalPrice || formData.price;
                                      const baseNum = parseInt(baseStr.replace(/[^0-9]/g, '')) || 0;
                                      let finalPriceStr = baseStr;
                                      if (baseNum > 0) {
                                        const finalNum = Math.round(baseNum * (1 - pct / 100));
                                        finalPriceStr = '₹ ' + finalNum.toLocaleString('en-IN');
                                      }
                                      setFormData(prev => ({
                                        ...prev,
                                        discountPercent: pct,
                                        price: finalPriceStr,
                                        originalPrice: baseStr
                                      }));
                                    }}
                                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                      Number(formData.discountPercent) === pct
                                        ? 'bg-rose-600 text-white border-rose-600 font-black'
                                        : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                                    }`}
                                  >
                                    {pct}% OFF
                                  </button>
                                ))}
                              </div>

                              {formData.discountPercent > 0 && formData.originalPrice && (
                                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                                  <span className="flex items-center gap-2">
                                    <span>Live Price Tag:</span>
                                    <span className="line-through text-slate-400 font-mono text-xs">{formData.originalPrice}</span>
                                    <span className="text-emerald-700 font-black text-sm">{formData.price}</span>
                                  </span>
                                  <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-2xs">
                                    🏷️ {formData.discountPercent}% OFF
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-[11px] text-amber-800 font-medium">
                              Turn ON to set an attractive discount offer. Regular price will be shown without strikethrough.
                            </p>
                          )}
                        </div>

                        {/* Price Visibility Switch */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                          <div>
                            <div className="text-xs font-bold text-slate-900">Show Price Tag on Website</div>
                            <div className="text-[10.5px] text-slate-500">Uncheck to hide price and show "Inquire Now" only</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.showPrice !== false}
                            onChange={(e) => setFormData({ ...formData, showPrice: e.target.checked })}
                            className="w-4 h-4 accent-emerald-600 cursor-pointer"
                          />
                        </div>

                        {courseFormTab !== 'all' && (
                          <div className="pt-2 flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => setCourseFormTab('category')}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all"
                            >
                              ← Previous: Category
                            </button>
                            <button
                              type="button"
                              onClick={() => setCourseFormTab('deliverables')}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-2xs transition-all flex items-center gap-1.5"
                            >
                              <span>Next: 2x2 Badges</span>
                              <span>→</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 4: 2x2 DELIVERABLE BADGES */}
                    {(courseFormTab === 'all' || courseFormTab === 'deliverables') && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-emerald-50/40 to-white border border-emerald-100/90 shadow-2xs space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                              4
                            </span>
                            <div>
                              <h4 className="text-xs font-black text-slate-900 font-heading">
                                2x2 Deliverable Badges (Card Stats Grid)
                              </h4>
                              <p className="text-[10.5px] text-slate-500 font-medium">
                                The 4 prominent metric pills displayed on the course card
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                            Section 4
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* Pill 1: Duration */}
                          <div className="p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                              <span>Pill 1: Duration <span className="text-rose-500">*</span></span>
                              <span className="text-[10px] font-extrabold text-emerald-700">⏱️ Training Time</span>
                            </label>
                            <input
                              type="text"
                              value={formData.duration || ''}
                              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                              placeholder="e.g. 6 Months"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500 bg-white"
                            />
                            <div className="flex flex-wrap gap-1">
                              {['45 Days', '3 Months', '6 Months', '1 Year'].map((durOpt, dIdx) => (
                                <button
                                  type="button"
                                  key={dIdx}
                                  onClick={() => setFormData({ ...formData, duration: durOpt })}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                    formData.duration === durOpt
                                      ? 'bg-emerald-600 text-white border-emerald-600 font-black'
                                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                  }`}
                                >
                                  {durOpt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Pill 2: Internships */}
                          <div className="p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                              <span>Pill 2: Internships</span>
                              <span className="text-[10px] font-extrabold text-emerald-700">💼 Work Exp</span>
                            </label>
                            <input
                              type="text"
                              value={formData.internships || ''}
                              onChange={(e) => setFormData({ ...formData, internships: e.target.value })}
                              placeholder="e.g. 5 Internships"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500 bg-white"
                            />
                            <div className="flex flex-wrap gap-1">
                              {['1 Internship', '2 Internships', '3 Internships', '5 Internships'].map((intOpt, iIdx) => (
                                <button
                                  type="button"
                                  key={iIdx}
                                  onClick={() => setFormData({ ...formData, internships: intOpt })}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                    formData.internships === intOpt
                                      ? 'bg-emerald-600 text-white border-emerald-600 font-black'
                                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                  }`}
                                >
                                  {intOpt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Pill 3: Mock Tests */}
                          <div className="p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                              <span>Pill 3: Mock Tests</span>
                              <span className="text-[10px] font-extrabold text-emerald-700">📝 Exam Prep</span>
                            </label>
                            <input
                              type="text"
                              value={formData.mockTests || ''}
                              onChange={(e) => setFormData({ ...formData, mockTests: e.target.value })}
                              placeholder="e.g. 5 Mock Tests"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500 bg-white"
                            />
                            <div className="flex flex-wrap gap-1">
                              {['3 Mock Tests', '5 Mock Tests', '10 Mock Tests', '15 Mock Tests'].map((mOpt, mIdx) => (
                                <button
                                  type="button"
                                  key={mIdx}
                                  onClick={() => setFormData({ ...formData, mockTests: mOpt })}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                    formData.mockTests === mOpt
                                      ? 'bg-emerald-600 text-white border-emerald-600 font-black'
                                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                  }`}
                                >
                                  {mOpt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Pill 4: Projects */}
                          <div className="p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                              <span>Pill 4: Projects</span>
                              <span className="text-[10px] font-extrabold text-emerald-700">🚀 Live Builds</span>
                            </label>
                            <input
                              type="text"
                              value={formData.projects || ''}
                              onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                              placeholder="e.g. 5 Projects"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500 bg-white"
                            />
                            <div className="flex flex-wrap gap-1">
                              {['3 Projects', '5 Projects', '8 Projects', '10 Projects'].map((pOpt, pIdx) => (
                                <button
                                  type="button"
                                  key={pIdx}
                                  onClick={() => setFormData({ ...formData, projects: pOpt })}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                    formData.projects === pOpt
                                      ? 'bg-emerald-600 text-white border-emerald-600 font-black'
                                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                  }`}
                                >
                                  {pOpt}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {courseFormTab !== 'all' && (
                          <div className="pt-2 flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => setCourseFormTab('pricing')}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all"
                            >
                              ← Previous: Fees & Discount
                            </button>
                            <button
                              type="button"
                              onClick={() => setCourseFormTab('tech')}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition-all flex items-center gap-1.5"
                            >
                              <span>Next: Tech Stack</span>
                              <span>→</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 5: TECH STACK & TECHNOLOGIES */}
                    {(courseFormTab === 'all' || courseFormTab === 'tech') && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-cyan-50/40 to-white border border-cyan-100/90 shadow-2xs space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-cyan-100/80 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-xl bg-cyan-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                              5
                            </span>
                            <div>
                              <h4 className="text-xs font-black text-slate-900 font-heading">
                                Technologies Taught & Tech Stack
                              </h4>
                              <p className="text-[10.5px] text-slate-500 font-medium">
                                Interactive tech chips displayed on course cards and syllabus details
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full border border-cyan-200">
                            Section 5
                          </span>
                        </div>

                        {/* Current Tech Chips Display */}
                        <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-white border border-cyan-100 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-800">
                              Selected Technologies ({currentTechList.length}):
                            </label>
                            {currentTechList.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, technologies: '' })}
                                className="text-[10px] font-extrabold text-rose-600 hover:underline cursor-pointer"
                              >
                                Clear All
                              </button>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                            {currentTechList.length > 0 ? (
                              currentTechList.map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-900 border border-cyan-300 flex items-center gap-1.5 shadow-2xs animate-fade-in"
                                >
                                  <span>{tech}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTechChip(tech)}
                                    className="text-cyan-600 hover:text-rose-600 font-black cursor-pointer text-xs"
                                    title={`Remove ${tech}`}
                                  >
                                    ×
                                  </button>
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 italic">No technologies added yet. Pick presets below or type one!</span>
                            )}
                          </div>
                        </div>

                        {/* Add Custom Tech Input */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={customTechInput}
                            onChange={(e) => setCustomTechInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTechChip();
                              }
                            }}
                            placeholder="Type a technology (e.g. Next.js, Docker, AWS, Flutter)..."
                            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-cyan-500 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTechChip()}
                            className="px-3.5 py-2 rounded-xl text-xs font-black bg-cyan-600 text-white hover:bg-cyan-700 transition-all cursor-pointer shadow-2xs whitespace-nowrap active:scale-95"
                          >
                            + Add Tech
                          </button>
                        </div>

                        {/* Popular Presets */}
                        <div className="flex flex-col gap-1.5 pt-1">
                          <span className="text-[10.5px] font-bold text-slate-500">Popular Tech Presets (Click to add):</span>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              'React.js', 'Node.js', 'Python', 'Java', 'Flutter', 'Next.js',
                              'AWS', 'Docker', 'MongoDB', 'PostgreSQL', 'C++', 'Micro-Soldering',
                              'CCNA', 'Cyber Security', 'SEO', 'Kubernetes', 'Kotlin', 'Express'
                            ].map((techName, tIdx) => {
                              const isAdded = currentTechList.some(t => t.toLowerCase() === techName.toLowerCase());
                              return (
                                <button
                                  type="button"
                                  key={tIdx}
                                  onClick={() => {
                                    if (isAdded) {
                                      handleRemoveTechChip(techName);
                                    } else {
                                      handleAddTechChip(techName);
                                    }
                                  }}
                                  className={`px-2 py-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                                    isAdded
                                      ? 'bg-cyan-600 text-white border-cyan-600 font-black shadow-2xs'
                                      : 'bg-white text-slate-700 border-slate-200 hover:border-cyan-400'
                                  }`}
                                >
                                  <span>{isAdded ? '✓' : '+'}</span>
                                  <span>{techName}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {courseFormTab !== 'all' && (
                          <div className="pt-2 flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => setCourseFormTab('deliverables')}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all"
                            >
                              ← Previous: 2x2 Badges
                            </button>
                            <button
                              type="button"
                              onClick={() => setCourseFormTab('syllabus')}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-700 shadow-2xs transition-all flex items-center gap-1.5"
                            >
                              <span>Next: Syllabus Points</span>
                              <span>→</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 6: SYLLABUS HIGHLIGHTS & CHECKLIST (✓) */}
                    {(courseFormTab === 'all' || courseFormTab === 'syllabus') && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-indigo-50/40 to-white border border-indigo-100/90 shadow-2xs space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-indigo-100/80 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                              6
                            </span>
                            <div>
                              <h4 className="text-xs font-black text-slate-900 font-heading">
                                Syllabus Highlights & Checklist (✓)
                              </h4>
                              <p className="text-[10.5px] text-slate-500 font-medium">
                                The bullet points with checkmarks (✓) displayed on the website course card
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setUseRawHighlightsText(!useRawHighlightsText)}
                            className="text-[10.5px] font-bold text-indigo-700 bg-white hover:bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200 transition-colors cursor-pointer shadow-2xs"
                          >
                            {useRawHighlightsText ? '✨ Itemized Mode' : '📝 Raw Textarea'}
                          </button>
                        </div>

                        {useRawHighlightsText ? (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700">Enter each point on a new line:</label>
                            <textarea
                              rows={4}
                              value={formData.highlightsText || ''}
                              onChange={(e) => setFormData({ ...formData, highlightsText: e.target.value })}
                              placeholder="Cisco CCNA, Cloud & Server Admin&#10;Ethical Hacking & Network Security&#10;Live Router, Switch & Cloud Labs"
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500 bg-white font-mono leading-relaxed"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2.5">
                            {/* Interactive Checklist Point Rows */}
                            <div className="flex flex-col gap-2">
                              {currentHighlightPoints.map((point, pIdx) => (
                                <div key={pIdx} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-indigo-100 shadow-2xs group">
                                  <span className="w-5 h-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-xs font-black shrink-0">
                                    ✓
                                  </span>
                                  <input
                                    type="text"
                                    value={point}
                                    onChange={(e) => handleUpdateHighlightPoint(pIdx, e.target.value)}
                                    className="flex-1 text-xs font-bold text-slate-800 outline-none bg-transparent"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveHighlightPoint(pIdx)}
                                    className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer shrink-0"
                                    title="Delete point"
                                  >
                                    <DeleteOutlineIcon className="!w-4 !h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* Add New Point Input */}
                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="text"
                                value={newHighlightPointInput}
                                onChange={(e) => setNewHighlightPointInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddHighlightPoint();
                                  }
                                }}
                                placeholder="Type a new syllabus feature point..."
                                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500 bg-white"
                              />
                              <button
                                type="button"
                                onClick={handleAddHighlightPoint}
                                className="px-3.5 py-2 rounded-xl text-xs font-black bg-indigo-600 text-white hover:bg-indigo-700 transition-all cursor-pointer shadow-2xs whitespace-nowrap active:scale-95"
                              >
                                + Add Point
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Quick Presets by Track */}
                        <div className="flex flex-col gap-1.5 pt-1">
                          <span className="text-[10.5px] font-bold text-slate-500">1-Click Syllabus Presets:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              {
                                label: 'Networking',
                                text: 'Cisco CCNA, Cloud & Server Admin\nEthical Hacking & Network Security\nLive Router, Switch & Cloud Labs'
                              },
                              {
                                label: 'MERN Web',
                                text: 'MongoDB, Express, React, Node.js\nFrontend and Backend: React + Express\nDatabase: MongoDB'
                              },
                              {
                                label: 'Java Spring',
                                text: 'Core Java, Spring Boot, Microservices\nEnterprise Architecture & REST APIs\nDatabase: MySQL & PostgreSQL'
                              },
                              {
                                label: 'Python AI',
                                text: 'Python, Data Science & AI/ML\nData Pipelines & Neural Networks\nDatabase & Cloud: SQL + AWS'
                              },
                              {
                                label: 'Mobile Repair',
                                text: 'Practical Hardware & Schematics Diagnosis\nMotherboard Micro-Soldering & IC Work\n100% Practical Lab Training'
                              },
                              {
                                label: 'Appliance & PCB',
                                text: 'Inverter AC & PCB Circuit Repair\nComponent Level Troubleshooting\nJob Ready Practical Field Training'
                              },
                              {
                                label: 'Digital Marketing',
                                text: 'Google Ads, Meta Ads & Funnel Setup\nSEO Optimization & Social Media Growth\nLive Campaign & Ad Budget Management'
                              }
                            ].map((preset, pIdx) => (
                              <button
                                type="button"
                                key={pIdx}
                                onClick={() => setFormData({ ...formData, highlightsText: preset.text })}
                                className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 transition-all cursor-pointer active:scale-95 shadow-2xs"
                              >
                                + {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {courseFormTab !== 'all' && (
                          <div className="pt-2 flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => setCourseFormTab('tech')}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all"
                            >
                              ← Previous: Tech Stack
                            </button>
                            <button
                              type="button"
                              onClick={() => setCourseFormTab('detailsPage')}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs transition-all flex items-center gap-1.5"
                            >
                              <span>Next: Details Page</span>
                              <span>→</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 7: COURSE DETAILS PAGE & MEDIA (VIEW DETAILS CONFIG) */}
                    {(courseFormTab === 'all' || courseFormTab === 'detailsPage') && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-amber-50/30 to-white border border-amber-200/90 shadow-2xs space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                              7
                            </span>
                            <div>
                              <h4 className="text-xs font-black text-slate-900 font-heading">
                                Course Details Page & Media (View Details)
                              </h4>
                              <p className="text-[10.5px] text-slate-500 font-medium">
                                Configure the high-impact modal students see when clicking "View Details"
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                            Section 7
                          </span>
                        </div>

                        {/* SUBTITLE / TAGLINE */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <span>Subtitle / Hero Tagline</span>
                            <span className="text-slate-400 font-normal">(displayed below course title)</span>
                          </label>
                          <input
                            type="text"
                            value={formData.subtitle || ''}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            placeholder="Learn to build real-world web applications from scratch"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-amber-500 bg-white"
                          />
                        </div>

                        {/* INTRO VIDEO URL */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <span>Intro Video URL (YouTube)</span>
                            <span className="text-slate-400 font-normal">(Watch Intro Video button)</span>
                          </label>
                          <input
                            type="text"
                            value={formData.videoUrl || ''}
                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-amber-500 bg-white"
                          />
                          <p className="text-[10px] text-slate-400">
                            Supports standard YouTube links (youtube.com/watch?v=...), youtu.be, or embed links.
                          </p>
                        </div>

                        {/* 4 FEATURE PILLS / ROUNDED BADGES */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <span>Feature Badges (4 Rounded Pills)</span>
                            <span className="text-slate-400 font-normal">(comma-separated)</span>
                          </label>
                          <input
                            type="text"
                            value={formData.featurePillsText || ''}
                            onChange={(e) => setFormData({ ...formData, featurePillsText: e.target.value })}
                            placeholder="Live + recordings, Certificate, 2 to 3 projects, Placement support"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-amber-500 bg-white"
                          />
                        </div>

                        {/* WHAT YOU WILL LEARN CHECKLIST */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700">
                              What You Will Learn (Checklist ✓)
                            </label>
                            <span className="text-[10px] text-slate-400 font-medium">1 point per line</span>
                          </div>
                          <textarea
                            rows={5}
                            value={formData.whatYouWillLearnText || ''}
                            onChange={(e) => setFormData({ ...formData, whatYouWillLearnText: e.target.value })}
                            placeholder="Digital Marketing Strategy & Sales Funnel Design&#10;Google Search & Display Ads Campaign Management&#10;Meta (Facebook & Instagram) Ads & Pixel Tracking&#10;Search Engine Optimization (SEO) & Keyword Strategy&#10;Content Marketing & Social Media Growth&#10;Live Campaign Budget Allocation & ROAS Optimization&#10;Freelancing & Client Acquisition Masterclass"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-amber-500 bg-white font-mono leading-relaxed"
                          />
                        </div>


                        {/* BATCH DETAILS SPECIFICATIONS (2x2 GRID) */}
                        <div className="space-y-2 pt-1 border-t border-amber-100">
                          <label className="text-xs font-bold text-slate-800 block">
                            Batch Details Specifications:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-slate-600">Classes Mode</label>
                              <input
                                type="text"
                                value={formData.batchClasses || ''}
                                onChange={(e) => setFormData({ ...formData, batchClasses: e.target.value })}
                                placeholder="Live + Recorded"
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-amber-500 bg-white"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-slate-600">Batch Timing</label>
                              <input
                                type="text"
                                value={formData.batchTimings || ''}
                                onChange={(e) => setFormData({ ...formData, batchTimings: e.target.value })}
                                placeholder="Morning/Evening"
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-amber-500 bg-white"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-slate-600">Attendance Mode</label>
                              <input
                                type="text"
                                value={formData.batchMode || ''}
                                onChange={(e) => setFormData({ ...formData, batchMode: e.target.value })}
                                placeholder="Online / Offline"
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-amber-500 bg-white"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-slate-600">Certificate</label>
                              <input
                                type="text"
                                value={formData.certificateProvided || ''}
                                onChange={(e) => setFormData({ ...formData, certificateProvided: e.target.value })}
                                placeholder="Provided"
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-amber-500 bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        {courseFormTab !== 'all' && (
                          <div className="pt-2 flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => setCourseFormTab('syllabus')}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all"
                            >
                              ← Previous: Syllabus Points
                            </button>
                            <button
                              type="button"
                              onClick={() => setCourseFormTab('settings')}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-2xs transition-all flex items-center gap-1.5"
                            >
                              <span>Next: Visibility</span>
                              <span>→</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 8: VISIBILITY & PUBLISHING SETTINGS */}
                    {(courseFormTab === 'all' || courseFormTab === 'settings') && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 shadow-2xs space-y-3.5 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-xl bg-slate-700 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                              8
                            </span>
                            <div>
                              <h4 className="text-xs font-black text-slate-900 font-heading">
                                Visibility & Publishing Status
                              </h4>
                              <p className="text-[10.5px] text-slate-500 font-medium">
                                Control live visibility across website and catalog
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            Section 8
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <div>
                            <div className="text-xs font-bold text-slate-900">Show on Website Frontend</div>
                            <div className="text-[11px] text-slate-500">Enable to make this course track visible to prospective students</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.isActive !== false}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <div>
                            <div className="text-xs font-bold text-slate-900">Show Price Tag on Website</div>
                            <div className="text-[11px] text-slate-500">Enable to display the fee tag directly on the course card</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.showPrice !== false}
                            onChange={(e) => setFormData({ ...formData, showPrice: e.target.checked })}
                            className="w-4 h-4 accent-emerald-600 cursor-pointer"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-[11px] text-blue-900 font-semibold flex items-center gap-2">
                          <span className="text-base">⚡</span>
                          <span>Live updates sync instantly across student screens without page refresh.</span>
                        </div>

                        {courseFormTab !== 'all' && (
                          <div className="pt-2 flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => setCourseFormTab('detailsPage')}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all"
                            >
                              ← Previous: Details Page
                            </button>
                            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                              ✓ All Sections Configured
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                  </form>
                </div>

                {/* RIGHT SIDE: REAL-TIME COURSE PREVIEW (CARD & DETAILS PAGE SWITCHER) */}
                <div className="lg:col-span-5 flex flex-col gap-3 sticky top-0">
                  {/* PREVIEW MODE TOGGLE HEADER */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 gap-2 flex-wrap">
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setCoursePreviewMode('card')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          coursePreviewMode === 'card'
                            ? 'bg-white text-blue-700 shadow-2xs border border-blue-100'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>🎴</span>
                        <span>Card Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoursePreviewMode('details')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          coursePreviewMode === 'details'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>📱</span>
                        <span>Details Page Preview</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Live Sync
                      </span>
                    </div>
                  </div>

                  {/* PREVIEW MODE 1: CATALOG CARD PREVIEW */}
                  {coursePreviewMode === 'card' && (
                    <div className="space-y-3 animate-fade-in">
                      <p className="text-[11px] text-slate-500 font-medium">
                        This is how the course card appears in the category grid on the website:
                      </p>

                      <div className={`bg-white rounded-3xl p-5 border shadow-md flex flex-col justify-between gap-4 transition-all ${
                        formData.isActive !== false ? 'border-slate-200/90' : 'border-amber-200 bg-amber-50/20'
                      }`}>
                        {/* TOP HEADER: CATEGORY BADGE & LIVE STATUS */}
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <span className="text-[11px] font-extrabold text-blue-800 bg-blue-50/90 px-3 py-1 rounded-xl border border-blue-200/80 flex items-center gap-1.5 shadow-2xs truncate">
                            <img
                              src={currentSelectedMainCat.icon}
                              alt=""
                              className="w-3.5 h-3.5 object-contain shrink-0"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <span className="shrink-0">{currentSelectedMainCat.label}</span>
                            <span className="text-slate-300 font-normal shrink-0">•</span>
                            <span className="text-purple-700 font-extrabold truncate">
                              {(formData.subCategories || []).map(sId => {
                                const foundSub = allSubCategoryOptions.find(sub => sub.id === sId);
                                return foundSub ? foundSub.label : sId;
                              }).join(', ') || 'Web Dev'}
                            </span>
                          </span>

                          <div className={`text-[10.5px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1.5 whitespace-nowrap border shrink-0 ${
                            formData.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${formData.isActive !== false ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                            <span>{formData.isActive !== false ? 'Live on Website' : 'Hidden'}</span>
                          </div>
                        </div>

                        {/* MIDDLE CONTENT: TITLE & PRICE */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <h3 className="text-base font-black text-slate-900 font-heading flex items-center gap-2 flex-1 min-w-[180px]">
                              {formData.icon || formData.logoUrl ? (
                                <img
                                  src={formData.icon || formData.logoUrl}
                                  alt=""
                                  className="w-6 h-6 object-contain rounded-lg shrink-0 border border-slate-200 p-0.5 bg-slate-50"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <SchoolIcon className="!w-5 !h-5 text-blue-600 shrink-0" />
                              )}
                              <span className="leading-snug">{formData.title || 'Course Title Preview'}</span>
                            </h3>

                            {/* PRICE TAG PREVIEW */}
                            {formData.showPrice !== false ? (
                              <div className="text-xs font-black px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 flex items-center gap-1.5 shadow-2xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                {formData.isDiscountActive && (Number(formData.discountPercent) > 0 || formData.originalPrice) ? (
                                  <span className="flex items-center gap-1.5">
                                    {formData.originalPrice && (
                                      <span className="line-through text-slate-400 text-[11px] font-semibold">{formData.originalPrice}</span>
                                    )}
                                    <span className="text-emerald-700 font-extrabold text-xs">{formData.price || '₹ 19,999'}</span>
                                    <span className="bg-rose-600 text-white font-black text-[9.5px] px-1.5 py-0.2 rounded-full shadow-2xs">
                                      {formData.discountPercent}% OFF
                                    </span>
                                  </span>
                                ) : (
                                  <span>{formData.price || '₹ 24,999'}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs font-black px-2.5 py-1 rounded-xl border border-slate-300 bg-slate-100 text-slate-400">
                                Price Hidden 👁️‍🗨️
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                            {formData.description || 'Comprehensive course syllabus description preview will be displayed here...'}
                          </p>

                          {/* DYNAMIC 2x2 PILLS GRID PREVIEW */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            {[
                              parseStatPill(formData.duration, '6', 'Months'),
                              parseStatPill(formData.internships, '5', 'Internships'),
                              parseStatPill(formData.mockTests, '5', 'Mock Tests'),
                              parseStatPill(formData.projects, '5', 'Projects')
                            ].map((pill, pIdx) => (
                              <div
                                key={pIdx}
                                className="bg-[#f0f6ff] border border-[#dbeafe] text-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap truncate shadow-2xs"
                              >
                                <span className="font-black text-slate-900">{pill.val}</span>
                                {pill.label && <span className="truncate text-slate-600">{pill.label}</span>}
                              </div>
                            ))}
                          </div>

                          {/* DYNAMIC CHECKMARK FEATURE BULLETS PREVIEW */}
                          <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100">
                            {getCourseHighlights(null, formData.highlightsText).map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                                <span className="w-3.5 h-3.5 rounded bg-blue-50 border border-blue-200 text-blue-600 font-extrabold text-[9px] flex items-center justify-center flex-shrink-0">
                                  ✓
                                </span>
                                <span className="truncate">{feat}</span>
                              </div>
                            ))}
                          </div>

                          {/* TECHNOLOGIES TAGS PREVIEW */}
                          {currentTechList.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-100">
                              {currentTechList.slice(0, 6).map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                                >
                                  {tech}
                                </span>
                              ))}
                              {currentTechList.length > 6 && (
                                <span className="px-1.5 py-0.5 rounded-md text-[9.5px] font-bold text-slate-400 bg-slate-50">
                                  +{currentTechList.length - 6} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* BOTTOM ACTION BAR PREVIEW */}
                        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5 text-xs">
                          <div className="flex items-center justify-between gap-2 font-bold text-slate-600">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 flex items-center gap-1.5">
                                <GroupIcon className="!w-3.5 !h-3.5 text-blue-600" />
                                <span>18 Students</span>
                              </span>
                              <span className="text-slate-400 font-semibold">• {formData.duration || '6 Months'}</span>
                            </div>
                            <span className="text-[10px] font-extrabold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                              Live Card
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                            <button
                              type="button"
                              onClick={() => setCoursePreviewMode('details')}
                              className="px-2 py-1.5 rounded-xl text-[10.5px] font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-center truncate cursor-pointer transition-all active:scale-95 shadow-2xs flex items-center justify-center gap-1"
                              title="Click to view Details Page Preview"
                            >
                              <span>Details</span>
                              <span className="text-[9px]">↗</span>
                            </button>
                            <span className="px-2 py-1.5 rounded-xl text-[10.5px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 text-center truncate opacity-80">
                              Discount
                            </span>
                            <span className="px-2 py-1.5 rounded-xl text-[10.5px] font-extrabold text-blue-700 bg-blue-50/70 border border-blue-200 text-center truncate opacity-80">
                              Edit
                            </span>
                            <span className="px-2 py-1.5 rounded-xl text-[10.5px] font-extrabold text-rose-700 bg-rose-50/70 border border-rose-200 text-center truncate opacity-80">
                              Delete
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-[11px] font-semibold text-blue-900 leading-relaxed flex items-center justify-between gap-2">
                        <span>✨ Click "Details ↗" or the top tab to preview the full Details Page!</span>
                        <button
                          type="button"
                          onClick={() => setCoursePreviewMode('details')}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-extrabold text-[10.5px] shrink-0 cursor-pointer shadow-2xs"
                        >
                          View Details Page 📱
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PREVIEW MODE 2: EXACT SAME COURSE DETAILS PAGE PREVIEW (SCREENSHOT 2) */}
                  {coursePreviewMode === 'details' && (
                    <div className="space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Exact student view when clicking "View Details":</span>
                        <button
                          type="button"
                          onClick={() => setCoursePreviewMode('card')}
                          className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          ← Back to Card Preview
                        </button>
                      </div>

                      {/* DETAILS PAGE PHONE CONTAINER */}
                      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[720px]">
                        {/* TOP NAVBAR (SCREENSHOT 2) */}
                        <div className="bg-white/95 border-b border-slate-100 px-3.5 py-2.5 flex items-center justify-between shrink-0">
                          <button
                            type="button"
                            onClick={() => setCoursePreviewMode('card')}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                            title="Back to Card Preview"
                          >
                            <LucideArrowLeft className="w-4 h-4" />
                          </button>

                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full border border-slate-200 bg-white p-0.5 shadow-2xs overflow-hidden flex items-center justify-center">
                              <img
                                src="/logo-icon.png"
                                alt="CodeGuru"
                                className="w-full h-full object-contain rounded-full"
                                onError={(e) => { e.target.src = '/images/categories/coding.png'; }}
                              />
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="font-extrabold text-slate-900 text-xs tracking-tight leading-none flex items-center gap-1">
                                CODE <span className="text-orange-500">GURRU</span>
                              </span>
                              <span className="text-[8.5px] font-semibold text-slate-500 leading-none mt-0.5">
                                Skills Today, Better Tomorrow
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setCoursePreviewMode('card')}
                            className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 cursor-pointer"
                          >
                            Card 🎴
                          </button>
                        </div>

                        {/* SCROLLABLE DETAILS PAGE CONTENT */}
                        <div className="overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
                          {/* DARK HERO BANNER (#14161d) */}
                          <div className="relative w-full bg-[#14161d] border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                            {/* TECH LOGO */}
                            {(() => {
                              const titleLower = (formData.title || '').toLowerCase();
                              const isMern = titleLower.includes('mern');
                              if (isMern) {
                                return (
                                  <div className="relative z-10 flex items-center justify-center gap-1.5 mb-1">
                                    <div className="w-9 h-9 rounded-xl bg-[#222530] border border-slate-700/80 flex items-center justify-center text-[#10b981] font-black text-xs">M</div>
                                    <LucideChevronRight className="w-3 h-3 text-slate-600" />
                                    <div className="w-9 h-9 rounded-xl bg-[#222530] border border-slate-700/80 flex items-center justify-center text-white font-black text-xs">E</div>
                                    <LucideChevronRight className="w-3 h-3 text-slate-600" />
                                    <div className="w-9 h-9 rounded-xl bg-[#222530] border border-slate-700/80 flex items-center justify-center text-[#f59e0b] font-black text-xs">R</div>
                                    <LucideChevronRight className="w-3 h-3 text-slate-600" />
                                    <div className="w-9 h-9 rounded-xl bg-[#222530] border border-slate-700/80 flex items-center justify-center text-[#84cc16] font-black text-xs">N</div>
                                  </div>
                                );
                              }
                              return (
                                <div className="relative z-10 w-11 h-11 rounded-xl bg-[#222530] border border-slate-700/80 p-2 flex items-center justify-center shadow-xs mb-1">
                                  {formData.icon || formData.logoUrl ? (
                                    <img
                                      src={formData.icon || formData.logoUrl}
                                      alt=""
                                      className="w-full h-full object-contain"
                                      onError={(e) => { e.target.src = '/images/categories/coding.png'; }}
                                    />
                                  ) : (
                                    <SchoolIcon className="!w-5 !h-5 text-amber-400" />
                                  )}
                                </div>
                              );
                            })()}

                            {/* TITLE & SUBTITLE */}
                            <div className="relative z-10 text-center space-y-1 max-w-sm mx-auto mt-1">
                              <h1 className="text-sm sm:text-base font-black text-white tracking-tight leading-tight">
                                {formData.title || 'Course Title Preview'}
                              </h1>
                              <p className="text-[10.5px] text-slate-400 font-medium leading-relaxed">
                                {formData.subtitle || formData.description || 'Learn to build real-world web applications from scratch'}
                              </p>
                            </div>

                            {/* WATCH INTRO VIDEO BUTTON */}
                            <button
                              type="button"
                              onClick={() => setAdminShowVideoModal(true)}
                              className="relative z-10 w-full bg-[#f59e0b] hover:bg-[#e08e00] text-slate-950 font-black text-xs py-2 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer mt-2.5"
                            >
                              <LucidePlay className="w-3.5 h-3.5 fill-slate-950 text-slate-950 translate-x-0.5" />
                              <span>Watch Intro Video</span>
                            </button>
                          </div>

                          {/* DURATION RING & 4 FEATURE PILLS */}
                          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 space-y-2 shadow-2xs">
                            <div className="bg-[#f8fafc] border border-slate-100 rounded-lg p-2 flex items-center gap-2.5">
                              <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                  <path className="text-slate-200" strokeWidth="3.8" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  <path className="text-[#047857]" strokeDasharray="68, 100" strokeWidth="3.8" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <span className="absolute font-black text-slate-900 text-[11px] leading-none">
                                  {(String(formData.duration || '3').match(/\d+/) || ['3'])[0]}
                                </span>
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-extrabold text-slate-900 text-xs leading-tight truncate">
                                  {formData.duration || '3 Months'}
                                </span>
                                <span className="text-[9.5px] font-medium text-slate-400 leading-tight">
                                  Duration
                                </span>
                              </div>
                            </div>

                            {/* 2x2 GRID ROUNDED PILLS */}
                            <div className="grid grid-cols-2 gap-1.5">
                              {(() => {
                                const pills = getLivePills();
                                const icons = [LucideVideo, LucideAward, LucideBriefcase, LucideHeadphones, LucideGraduationCap];
                                return pills.slice(0, 4).map((pill, idx) => {
                                  const IconComponent = icons[idx % icons.length] || LucideVideo;
                                  return (
                                    <div key={idx} className="bg-white border border-slate-200/90 rounded-full px-2 py-1 flex items-center gap-1.5 text-[10px] font-bold text-slate-700 shadow-2xs">
                                      <IconComponent className="w-3 h-3 text-slate-600 shrink-0" />
                                      <span className="truncate">{typeof pill === 'string' ? pill : pill.text}</span>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </div>

                          {/* WHAT YOU WILL LEARN */}
                          <div className="bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-2xs">
                            <h3 className="font-extrabold text-slate-900 text-xs mb-1.5">
                              What You Will Learn
                            </h3>
                            <div className="space-y-1">
                              {getLiveWhatYouWillLearn().map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700">
                                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8.5px] font-black shrink-0">
                                    ✓
                                  </span>
                                  <span className="truncate">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* BATCH DETAILS */}
                          <div className="bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-2xs">
                            <h3 className="font-extrabold text-slate-900 text-xs mb-2">
                              Batch Details
                            </h3>
                            <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
                              <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#f2f6fd] border border-blue-100/70">
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                                  <LucideCalendar className="w-3 h-3 text-white" />
                                </div>
                                <span className="truncate"><strong>Duration:</strong> {formData.duration || '3 Months'}</span>
                              </div>

                              <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#f2f6fd] border border-blue-100/70">
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                                  <LucideVideo className="w-3 h-3 text-white" />
                                </div>
                                <span className="truncate"><strong>Classes:</strong> {formData.batchClasses || 'Live + Recorded'}</span>
                              </div>

                              <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#f2f6fd] border border-blue-100/70">
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                                  <LucideClock className="w-3 h-3 text-white" />
                                </div>
                                <span className="truncate"><strong>Batch:</strong> {formData.batchTimings || 'Morning/Evening'}</span>
                              </div>

                              <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#f2f6fd] border border-blue-100/70">
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                                  <LucideMapPin className="w-3 h-3 text-white" />
                                </div>
                                <span className="truncate"><strong>Mode:</strong> {formData.batchMode || 'Online / Offline'}</span>
                              </div>

                              <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#f2f6fd] border border-blue-100/70 col-span-2">
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                                  <LucideShieldCheck className="w-3 h-3 text-white" />
                                </div>
                                <span className="truncate"><strong>Certificate:</strong> {formData.certificateProvided || 'Provided'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* STICKY BOTTOM BUTTON (SCREENSHOT 2) */}
                        <div className="bg-white border-t border-slate-100 px-3 py-2 flex items-center justify-center shrink-0">
                          <div className="w-full bg-blue-600 text-white py-2 rounded-full text-xs font-extrabold flex items-center justify-center gap-1 shadow-md shadow-blue-500/25">
                            <span>Enroll Now</span>
                            <LucideChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>

            {/* FIXED FOOTER */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status:</span>
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                  formData.isActive !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-300'
                }`}>
                  {formData.isActive !== false ? '🟢 Ready to Publish Live' : '⚪ Hidden on Website'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="courseForm"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-2"
                >
                  <span>{editingCourseId ? '💾 Update Course Track' : '✨ Save Course Track'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ADD NEW CATEGORY MODAL WITH LIVE PREVIEW */}
      {showCategoryModal && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-5xl border border-slate-200 shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-hidden animate-fade-in">
            
            {/* MODAL HEADER */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <CategoryIcon className="!w-5 !h-5 text-purple-400" />
                <h3 className="text-base font-black font-heading">
                  {editingCategoryId ? 'Edit Course Category' : 'Add New Course Category'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <CloseIcon className="!w-5 !h-5" />
              </button>
            </div>

            {/* MODAL BODY: FORM (LEFT) + LIVE PREVIEW (RIGHT) */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT SIDE: CATEGORY FORM CONTROLS */}
                <div className="lg:col-span-6">
                  <form id="categoryForm" onSubmit={onCategoryFormSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-700">Category Name / Title <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={categoryFormData.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          const autoSlug = val.toLowerCase().replace(/[^a-z0-9]/g, '');
                          setCategoryFormData(prev => ({
                            ...prev,
                            label: val,
                            category: prev.category ? prev.category : autoSlug
                          }));
                        }}
                        placeholder="e.g. Data Science & Artificial Intelligence"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-700">Category ID / Slug</label>
                        <input
                          type="text"
                          value={categoryFormData.category}
                          onChange={(e) => setCategoryFormData({ ...categoryFormData, category: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                          placeholder="e.g. datascience"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-purple-600 font-mono bg-slate-50"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-700">Badge Tag (Optional)</label>
                        <input
                          type="text"
                          value={categoryFormData.badge}
                          onChange={(e) => setCategoryFormData({ ...categoryFormData, badge: e.target.value })}
                          placeholder="e.g. New Track / Hot"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-purple-600"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-700">Sub-Categories / Tech Domains (Comma Separated)</label>
                      <input
                        type="text"
                        value={categoryFormData.subCategoriesText}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, subCategoriesText: e.target.value })}
                        placeholder="e.g. Web Dev, App Dev, AI & ML"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-purple-600"
                      />
                      <span className="text-[10.5px] text-slate-400 font-medium">Enter sub-domain topics separated by commas.</span>

                      {categoryFormData.subCategoriesText && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {categoryFormData.subCategoriesText.split(',').map((sc, scIdx) => {
                            const trimmed = sc.trim();
                            if (!trimmed) return null;
                            return (
                              <span key={scIdx} className="text-[10px] font-black bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                                ✨ {trimmed}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700">Category 3D Illustration Image</label>
                      
                      {/* UPLOAD FROM PC FILE PICKER BOX */}
                      <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {categoryFormData.icon ? (
                            <div className="w-12 h-12 bg-white rounded-xl border border-purple-200 p-1 flex items-center justify-center shrink-0 shadow-xs">
                              <img src={categoryFormData.icon} alt="Preview" className="w-full h-full object-contain" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl border border-purple-200 flex items-center justify-center font-black text-xs shrink-0">
                              3D
                            </div>
                          )}

                          <div>
                            <span className="text-xs font-black text-slate-800 block">Select Image File from PC</span>
                            <span className="text-[10.5px] text-slate-500 font-semibold block">Upload PNG, JPG, WEBP or SVG file</span>
                          </div>
                        </div>

                        <label className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-all shrink-0 flex items-center gap-1">
                          <span>{uploadingImage ? 'Uploading...' : '📁 Choose File from PC'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCategoryImageFileSelect}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* PRESET 3D ILLUSTRATION SELECTOR BADGES */}
                      <div className="flex flex-wrap gap-1.5 pt-1 pb-1">
                        {[
                          { name: 'Software Dev', path: '/images/categories/coding.png' },
                          { name: 'Robotics & IoT', path: '/images/categories/robotics.png' },
                          { name: 'Networking & Server', path: '/images/categories/networking.png' },
                          { name: 'Mobile Repair', path: '/images/categories/repair.png' },
                          { name: 'Appliance Repair', path: '/images/categories/electrical.png' },
                          { name: 'Digital Marketing', path: '/images/categories/marketing.png' }
                        ].map((imgOpt, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => setCategoryFormData({ ...categoryFormData, icon: imgOpt.path })}
                            className={`text-[10.5px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                              categoryFormData.icon === imgOpt.path
                                ? 'bg-purple-600 text-white border-purple-600 shadow-xs scale-[1.02]'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <img src={imgOpt.path} className="w-4 h-4 object-contain" alt="" />
                            <span>{imgOpt.name}</span>
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        value={categoryFormData.icon}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
                        placeholder="/images/categories/coding.png or uploaded image URL"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-purple-600 font-mono text-slate-600 bg-slate-50"
                      />
                    </div>
                  </form>
                </div>

                {/* RIGHT SIDE: REAL-TIME CATEGORY CARD LIVE PREVIEW */}
                <div className="lg:col-span-6 flex flex-col gap-3 sticky top-0">
                  <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5 font-heading">
                      <span>👁️ Real-Time Card Preview</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </span>
                    <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      Live Catalog Card
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium">
                    This is exactly how this category will look in your Admin master catalog & Website student view:
                  </p>

                  {/* PREVIEW CARD MATCHING EXACT DESIGN SYSTEM */}
                  <div className="p-4 rounded-2xl border border-purple-200/80 shadow-md bg-gradient-to-b from-blue-50/90 to-purple-50/50 flex flex-col justify-between gap-3 animate-fade-in">
                    <div className="space-y-3">
                      {/* TOP ROW: LOGO & BADGE */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/90 shadow-sm p-1.5 flex items-center justify-center shrink-0">
                          <img
                            src={categoryFormData.icon || '/images/categories/coding.png'}
                            alt={categoryFormData.label || 'Category Preview'}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = '/images/categories/coding.png'; }}
                          />
                        </div>
                        <span className="text-[10px] font-black bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200 shadow-2xs">
                          {categoryFormData.badge || 'Category'}
                        </span>
                      </div>

                      {/* TITLE & SLUG */}
                      <div>
                        <h3 className="text-base font-black text-slate-900 font-heading leading-tight">
                          {categoryFormData.label || 'Category Name Preview'}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400 font-bold block mt-0.5">
                          Slug: {categoryFormData.category || 'datascience'}
                        </span>
                      </div>

                      {/* SUB CATEGORIES PILLS */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {categoryFormData.subCategoriesText ? (
                          categoryFormData.subCategoriesText.split(',').map((sub, sIdx) => {
                            const trimmed = sub.trim();
                            if (!trimmed) return null;
                            return (
                              <span
                                key={sIdx}
                                className="text-[11px] font-extrabold bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs"
                              >
                                {trimmed}
                              </span>
                            );
                          })
                        ) : (
                          <>
                            <span className="text-[11px] font-extrabold bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs">
                              Web Dev
                            </span>
                            <span className="text-[11px] font-extrabold bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs">
                              App Dev
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* CARD FOOTER MOCKUP */}
                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                      <div className="px-2.5 py-1 rounded-lg text-[10.5px] font-black bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-xs" />
                        <span>Live on Website</span>
                      </div>

                      <div className="flex items-center gap-1.5 opacity-80">
                        <span className="px-2 py-1 rounded-lg text-[10.5px] font-extrabold text-blue-700 bg-white border border-blue-200">
                          Edit
                        </span>
                        <span className="px-2 py-1 rounded-lg text-[10.5px] font-extrabold text-rose-700 bg-white border border-rose-200">
                          Delete
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/80 rounded-xl border border-purple-200 text-[11px] font-semibold text-purple-900 leading-relaxed">
                    ✨ Changes reflect live as you type titles, sub-domain tags or select 3D illustrations.
                  </div>
                </div>

              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="categoryForm"
                className="px-5 py-2 rounded-xl text-xs font-black bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-600/20 transition-all cursor-pointer flex items-center gap-1"
              >
                {editingCategoryId ? (
                  <EditOutlinedIcon className="!w-4 !h-4" />
                ) : (
                  <AddIcon className="!w-4 !h-4" />
                )}
                <span>{editingCategoryId ? 'Update Category' : 'Save Category'}</span>
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* CONFIRMATION POPUP MODAL */}
      {confirmModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[999999] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md border border-slate-200 shadow-2xl p-6 space-y-5 animate-scale-up">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold shadow-2xs ${
                confirmModal.type === 'danger'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}>
                {confirmModal.type === 'danger' ? '🗑️' : '⚠️'}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 font-heading">
                  {confirmModal.title || 'Confirmation Needed'}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {confirmModal.type === 'danger' ? 'Warning: Permanent action' : 'Please confirm your action'}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed ${
              confirmModal.type === 'danger'
                ? 'bg-rose-50/50 border-rose-100 text-rose-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-700'
            }`}>
              {confirmModal.message}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-black transition-all cursor-pointer active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                }}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                  confirmModal.type === 'danger'
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-rose-600/20'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/20'
                }`}
              >
                <span>{confirmModal.confirmText || 'Yes, Confirm'}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* QUICK DISCOUNT MODAL */}
      {quickDiscountModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md border border-slate-200 shadow-2xl flex flex-col my-auto overflow-hidden animate-scale-up">
            
            {/* MODAL HEADER */}
            <div className="px-6 py-4 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-500 text-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏷️</span>
                <div>
                  <h3 className="text-base font-black font-heading leading-tight">
                    Manage Course Discount Offer
                  </h3>
                  <p className="text-[11px] font-semibold text-amber-100 line-clamp-1">
                    {quickDiscountModal.courseTitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickDiscountModal(prev => ({ ...prev, isOpen: false }))}
                className="p-1.5 rounded-xl text-amber-100 hover:text-white hover:bg-amber-600 transition-colors cursor-pointer"
                title="Close"
              >
                <CloseIcon className="!w-5 !h-5" />
              </button>
            </div>

            {/* MODAL FORM BODY */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              
              {/* CURRENT BASE PRICE INFO BOX */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between">
                <div>
                  <span className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider block">BASE COURSE FEE</span>
                  <span className="text-base font-black text-slate-900 font-mono">{quickDiscountModal.basePrice || quickDiscountModal.originalPrice}</span>
                </div>
                
                {/* ON / OFF TOGGLE SWITCH */}
                <button
                  type="button"
                  onClick={() => setQuickDiscountModal(prev => ({ ...prev, isDiscountActive: !prev.isDiscountActive }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
                    quickDiscountModal.isDiscountActive
                      ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-4.5 h-2.5 rounded-full p-0.5 transition-all flex items-center ${
                    quickDiscountModal.isDiscountActive ? 'bg-amber-900 justify-end' : 'bg-slate-300 justify-start'
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                  </div>
                  <span>{quickDiscountModal.isDiscountActive ? 'Discount ON' : 'Discount OFF'}</span>
                </button>
              </div>

              {quickDiscountModal.isDiscountActive ? (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* QUICK DISCOUNT PRESET PERCENTAGE BUTTONS */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Select Discount Offer (%):</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[10, 15, 20, 25, 30, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handleApplyPresetDiscount(pct)}
                          className={`py-2 px-2 rounded-xl text-xs font-black border transition-all cursor-pointer text-center active:scale-95 ${
                            quickDiscountModal.discountPercent === pct
                              ? 'bg-amber-500 text-white border-amber-600 shadow-2xs scale-[1.02]'
                              : 'bg-amber-50/60 text-amber-900 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          ⚡ {pct}% OFF
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* INPUTS: DISCOUNT PERCENT & FINAL DISCOUNTED FEE */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-700">Discount Percent (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={quickDiscountModal.discountPercent || ''}
                        onChange={(e) => {
                          const pct = Math.min(Math.max(Number(e.target.value) || 0, 0), 100);
                          handleApplyPresetDiscount(pct);
                        }}
                        placeholder="e.g. 20"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-amber-600 bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-700">Discounted Fee (Student Pays)</label>
                      <input
                        type="text"
                        value={quickDiscountModal.finalPrice || ''}
                        onChange={(e) => setQuickDiscountModal(prev => ({ ...prev, finalPrice: e.target.value }))}
                        placeholder="e.g. ₹ 19,999"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-amber-600 bg-white font-mono text-emerald-700 font-extrabold"
                      />
                    </div>
                  </div>

                  {/* REALTIME PREVIEW CARD */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs font-bold text-slate-800 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10.5px] font-black text-slate-500 uppercase block">WEBSITE SHOW:</span>
                      <span className="line-through text-slate-400 font-mono text-xs">{quickDiscountModal.basePrice || quickDiscountModal.originalPrice}</span>
                      <span className="text-emerald-700 font-black text-sm">{quickDiscountModal.finalPrice}</span>
                    </div>

                    {quickDiscountModal.discountPercent > 0 && (
                      <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-2xs">
                        🏷️ {quickDiscountModal.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium leading-relaxed">
                  Discount is currently turned <strong className="text-slate-900">OFF</strong>. Students will see full regular fee <strong className="text-emerald-700 font-mono">{quickDiscountModal.basePrice || quickDiscountModal.originalPrice}</strong> without any strikethrough price or discount badge tag.
                </div>
              )}

            </div>

            {/* MODAL FOOTER */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setQuickDiscountModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickDiscount}
                className="px-5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🏷️ Save Discount Offer</span>
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* VIEW COURSE DETAILS MODAL (MATCHES EXACT USER SCREENSHOT & FRONTEND MODAL) */}
      {selectedCourseForView && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto select-none animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col h-[94vh] max-h-[860px] overflow-hidden my-auto animate-modal-slide-up">
            
            {/* TOP NAVBAR (MATCHING SCREENSHOT 2) */}
            <div className="bg-white/95 border-b border-slate-100 px-3.5 py-2.5 flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCourseForView(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Back"
                title="Back to courses list"
              >
                <LucideArrowLeft className="w-4 h-4" />
              </button>

              {/* CODE GURRU LOGO HEADER */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-slate-200 bg-white p-0.5 shadow-2xs overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img
                    src="/logo-icon.png"
                    alt="CodeGuru Logo"
                    className="w-full h-full object-contain rounded-full"
                    onError={(e) => { e.target.src = '/images/categories/coding.png'; }}
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight leading-none flex items-center gap-1">
                    CODE <span className="text-orange-500">GURRU</span>
                  </span>
                  <span className="text-[9px] font-semibold text-slate-500 leading-none mt-0.5">
                    Skills Today, Better Tomorrow
                  </span>
                </div>
              </div>

              {/* CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => setSelectedCourseForView(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Close View"
              >
                <CloseIcon className="!w-4 !h-4" />
              </button>
            </div>

            {/* INNER CONTAINER WITH SCROLLING CONTENT */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2.5 space-y-2.5 scrollbar-thin">
              
              {/* DARK HERO CARD (EXACT REPLICA OF SCREENSHOT 2) */}
              <div className="relative w-full bg-[#14161d] border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg overflow-hidden">
                {/* BACKGROUND GLOW BLOBS */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* TECH STACK / ICON BADGE */}
                {(() => {
                  const titleLower = (selectedCourseForView.title || '').toLowerCase();
                  const isMern = selectedCourseForView.id === 'mern-stack' || titleLower.includes('mern');
                  if (isMern) {
                    return (
                      <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2.5 mb-1">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-xl bg-[#222530] border border-slate-700/80 flex items-center justify-center text-[#10b981] font-black text-sm shadow-xs flex-shrink-0">
                            M
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 mt-1">MongoDB</span>
                        </div>
                        <LucideChevronRight className="w-3.5 h-3.5 text-slate-600 mb-3 flex-shrink-0" />
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-xl bg-[#222530] border border-slate-700/80 flex items-center justify-center text-white font-black text-sm shadow-xs flex-shrink-0">
                            E
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 mt-1">Express</span>
                        </div>
                        <LucideChevronRight className="w-3.5 h-3.5 text-slate-600 mb-3 flex-shrink-0" />
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-xl bg-[#222530] border border-slate-700/80 flex items-center justify-center text-[#f59e0b] font-black text-sm shadow-xs flex-shrink-0">
                            R
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 mt-1">React</span>
                        </div>
                        <LucideChevronRight className="w-3.5 h-3.5 text-slate-600 mb-3 flex-shrink-0" />
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-xl bg-[#222530] border border-slate-700/80 flex items-center justify-center text-[#84cc16] font-black text-sm shadow-xs flex-shrink-0">
                            N
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 mt-1">Node.js</span>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="relative z-10 w-12 h-12 rounded-xl bg-[#222530] border border-slate-700/80 p-2.5 flex items-center justify-center shadow-xs mb-1.5 flex-shrink-0">
                      {selectedCourseForView.icon || selectedCourseForView.logoUrl ? (
                        <img
                          src={selectedCourseForView.icon || selectedCourseForView.logoUrl}
                          alt={selectedCourseForView.title}
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = '/images/categories/coding.png'; }}
                        />
                      ) : (
                        <SchoolIcon className="!w-6 !h-6 text-amber-400" />
                      )}
                    </div>
                  );
                })()}

                {/* TITLE & SUBTITLE */}
                <div className="relative z-10 text-center space-y-1 max-w-sm mx-auto mt-2">
                  <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                    {selectedCourseForView.title}
                  </h1>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed">
                    {selectedCourseForView.subtitle || selectedCourseForView.description || 'Learn to build real-world web applications from scratch'}
                  </p>
                </div>

                {/* WATCH INTRO VIDEO BUTTON */}
                <button
                  type="button"
                  onClick={() => setAdminShowVideoModal(true)}
                  className="relative z-10 w-full bg-[#f59e0b] hover:bg-[#e08e00] text-slate-950 font-black text-xs sm:text-sm py-2.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer mt-3"
                >
                  <LucidePlay className="w-3.5 h-3.5 fill-slate-950 text-slate-950 translate-x-0.5" />
                  <span>Watch Intro Video</span>
                </button>
              </div>

              {/* HIGHLIGHTS CARD: DURATION RING & 4 PILLS */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 space-y-2 shadow-2xs">
                {/* DURATION ROW */}
                <div className="bg-[#f8fafc] border border-slate-100 rounded-lg p-2 flex items-center gap-2.5">
                  <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200"
                        strokeWidth="3.8"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#047857]"
                        strokeDasharray="68, 100"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-black text-slate-900 text-xs leading-none">
                      {(String(selectedCourseForView.duration || '3').match(/\d+/) || ['3'])[0]}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight truncate">
                      {selectedCourseForView.duration || '3 Months'}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 leading-tight">
                      Duration
                    </span>
                  </div>
                </div>

                {/* 2x2 GRID ROUNDED PILLS */}
                <div className="grid grid-cols-2 gap-1.5">
                  {(() => {
                    const pillsList = getCourseDetailsPills(selectedCourseForView);
                    const icons = [LucideVideo, LucideAward, LucideBriefcase, LucideHeadphones, LucideGraduationCap, LucideSparkles, LucideClock];
                    return pillsList.slice(0, 4).map((pill, idx) => {
                      const IconComponent = icons[idx % icons.length] || LucideVideo;
                      return (
                        <div key={idx} className="bg-white border border-slate-200/90 rounded-full px-2.5 py-1 flex items-center gap-1.5 text-[10.5px] font-bold text-slate-700 shadow-2xs">
                          <IconComponent className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                          <span className="truncate">{typeof pill === 'string' ? pill : pill.text}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* WHAT YOU WILL LEARN */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-2xs">
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-1.5">
                  What You Will Learn
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {getCourseDetailsWhatYouWillLearn(selectedCourseForView).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-700">
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8.5px] font-black flex-shrink-0 shadow-2xs">
                        ✓
                      </span>
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BATCH DETAILS */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-2.5 sm:p-3 shadow-2xs">
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-2">
                  Batch Details
                </h3>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                  {/* DURATION */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#f2f6fd] border border-blue-100/70">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden">
                      <LucideCalendar className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                    </div>
                    <span className="text-[10.5px] sm:text-[11px] leading-snug">
                      <strong className="font-extrabold text-slate-900">Duration:</strong>{' '}
                      <span className="text-slate-600 font-normal">{selectedCourseForView.duration || '3 Months'}</span>
                    </span>
                  </div>

                  {/* CLASSES */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#f2f6fd] border border-blue-100/70">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden">
                      <LucideVideo className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                    </div>
                    <span className="text-[10.5px] sm:text-[11px] leading-snug">
                      <strong className="font-extrabold text-slate-900">Classes:</strong>{' '}
                      <span className="text-slate-600 font-normal">{selectedCourseForView.batchClasses || 'Live + Recorded'}</span>
                    </span>
                  </div>

                  {/* BATCH */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#f2f6fd] border border-blue-100/70">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden">
                      <LucideClock className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                    </div>
                    <span className="text-[10.5px] sm:text-[11px] leading-snug">
                      <strong className="font-extrabold text-slate-900">Batch:</strong>{' '}
                      <span className="text-slate-600 font-normal">{selectedCourseForView.batchTimings || 'Morning/Evening'}</span>
                    </span>
                  </div>

                  {/* MODE */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#f2f6fd] border border-blue-100/70">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden">
                      <LucideMapPin className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                    </div>
                    <span className="text-[10.5px] sm:text-[11px] leading-snug">
                      <strong className="font-extrabold text-slate-900">Mode:</strong>{' '}
                      <span className="text-slate-600 font-normal">{selectedCourseForView.batchMode || selectedCourseForView.mode || 'Online / Offline'}</span>
                    </span>
                  </div>

                  {/* CERTIFICATE */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#f2f6fd] border border-blue-100/70">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden">
                      <LucideShieldCheck className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                    </div>
                    <span className="text-[10.5px] sm:text-[11px] leading-snug">
                      <strong className="font-extrabold text-slate-900">Certificate:</strong>{' '}
                      <span className="text-slate-600 font-normal">{selectedCourseForView.certificateProvided || 'Provided'}</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* STICKY BOTTOM ACTIONS: EDIT COURSE & CLOSE */}
            <div className="bg-white border-t border-slate-100 px-4 py-2.5 flex items-center justify-between gap-3 shadow-md flex-shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCourseForView(null)}
                className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
              >
                Close Preview
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = selectedCourseForView;
                  setSelectedCourseForView(null);
                  handleEdit(target);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-full text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                <EditOutlinedIcon className="!w-4 !h-4" />
                <span>✏️ Edit This Course in Admin</span>
                <LucideChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* INTRO VIDEO MODAL FOR ADMIN PREVIEW */}
      {adminShowVideoModal && createPortal(
        <div className="fixed inset-0 z-[100000] bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <button
              type="button"
              onClick={() => setAdminShowVideoModal(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer"
            >
              <LucideX className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src={getEmbedVideoUrl(selectedCourseForView?.videoUrl || formData.videoUrl)}
                title="Course Intro Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* FLOATING SUCCESS TOAST NOTIFICATION */}
      {toast.show && createPortal(
        <div className="fixed top-5 right-5 z-[9999999] flex items-center gap-3.5 px-5 py-3.5 bg-slate-900/95 text-white backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl animate-slide-in-right transition-all max-w-sm">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-base shrink-0 shadow-xs ${
            toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}>
            {toast.type === 'success' ? '✓' : 'ℹ️'}
          </div>
          <div className="flex-1">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-heading">
              {toast.type === 'success' ? 'Action Successful' : 'Catalog Updated'}
            </h4>
            <p className="text-xs font-bold text-slate-100 mt-0.5 leading-snug">
              {toast.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Dismiss"
          >
            <CloseIcon className="!w-4 !h-4" />
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
