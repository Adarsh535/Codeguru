/**
 * ============================================================================
 * CONTROLLER LAYER: COURSES MANAGER CONTROLLER (useCoursesController.js)
 * ============================================================================
 * Custom hook handling business logic for Courses Catalog & Category Management.
 */

import { useState, useEffect, useCallback } from 'react';
import { adminCmsModel } from '../models/adminCmsModel';

export function useCoursesController() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Course Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [uploadingCourseIcon, setUploadingCourseIcon] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'coding',
    subCat: 'web',
    subCategories: ['web'],
    duration: '6 Months',
    price: '₹ 24,999',
    level: 'Beginner to Advanced',
    badge: 'Job Guaranteed Batch',
    description: '',
    technologies: 'React, Node.js, MongoDB',
    icon: '',
    logoUrl: '',
    isActive: true,
    showPrice: true,
    discountPercent: 0,
    originalPrice: '',
    isDiscountActive: false,
    internships: '5 Internships',
    mockTests: '5 Mock Tests',
    projects: '5 Projects',
    highlightsText: '',
    subtitle: '',
    videoUrl: '',
    featurePillsText: 'Live + recordings, Certificate, 2 to 3 projects, Placement support',
    whatYouWillLearnText: '',
    syllabusModulesText: '',
    projectsListText: '',
    batchClasses: 'Live + Recorded',
    batchTimings: 'Morning/Evening',
    batchMode: 'Online / Offline',
    certificateProvided: 'Provided'
  });

  // Category Modal States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    label: '',
    category: '',
    subCat: '',
    subCategoriesText: '',
    badge: '',
    icon: '',
    bgColor: 'bg-blue-50'
  });

  const loadData = useCallback(async () => {
    const [coursesData, categoriesData] = await Promise.all([
      adminCmsModel.getCourses(),
      adminCmsModel.getCategories()
    ]);
    setCourses(coursesData || []);
    setCategories(categoriesData || []);
  }, []);

  useEffect(() => {
    loadData();
    const handleRefresh = () => loadData();

    // 1. Instant SSE & Broadcast events
    window.addEventListener('codeguru_refresh_all', handleRefresh);
    window.addEventListener('codeguru_refresh_courses', handleRefresh);
    window.addEventListener('codeguru_refresh_categories', handleRefresh);
    window.addEventListener('focus', handleRefresh);

    // 2. Background polling fallback (every 3 seconds)
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        loadData();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('codeguru_refresh_all', handleRefresh);
      window.removeEventListener('codeguru_refresh_courses', handleRefresh);
      window.removeEventListener('codeguru_refresh_categories', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
    };
  }, [loadData]);

  // Course Handlers
  const handleOpenAddModal = () => {
    setEditingCourseId(null);
    setFormData({
      title: '',
      category: 'coding',
      subCat: 'web',
      subCategories: ['web'],
      duration: '6 Months',
      price: '₹ 24,999',
      level: 'Beginner to Advanced',
      badge: 'Job Guaranteed Batch',
      description: '',
      technologies: 'React, Node.js, MongoDB',
      icon: '',
      logoUrl: '',
      isActive: true,
      showPrice: true,
      discountPercent: 0,
      originalPrice: '',
      isDiscountActive: false,
      internships: '5 Internships',
      mockTests: '5 Mock Tests',
      projects: '5 Projects',
      highlightsText: '',
      subtitle: '',
      videoUrl: '',
      featurePillsText: 'Live + recordings, Certificate, 2 to 3 projects, Placement support',
      whatYouWillLearnText: '',
      syllabusModulesText: '',
      projectsListText: '',
      batchClasses: 'Live + Recorded',
      batchTimings: 'Morning/Evening',
      batchMode: 'Online / Offline',
      certificateProvided: 'Provided'
    });
    setShowAddModal(true);
  };

  const handleCourseIconFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCourseIcon(true);
    try {
      const uploadedUrl = await adminCmsModel.uploadFile(file);
      if (uploadedUrl) {
        setFormData(prev => ({ ...prev, icon: uploadedUrl, logoUrl: uploadedUrl }));
        setUploadingCourseIcon(false);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, icon: reader.result, logoUrl: reader.result }));
        setUploadingCourseIcon(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Course icon file selection error:', err);
      setUploadingCourseIcon(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourseId(course._id || course.id);
    const techs = Array.isArray(course.technologies)
      ? course.technologies.join(', ')
      : (course.technologies || '');

    const subs = Array.isArray(course.subCategories) && course.subCategories.length > 0
      ? course.subCategories
      : (course.subCat ? course.subCat.split(',').map(s => s.trim()).filter(Boolean) : ['web']);

    const titleLower = (course.title || '').toLowerCase();
    const defaultHl = (titleLower.includes('mern') || course.id === 'mern-stack') ? [
      'MongoDB, Express, React, Node.js',
      'Frontend and Backend: React + Express',
      'Database: MongoDB'
    ] : titleLower.includes('java') ? [
      'Core Java, Spring Boot, Microservices',
      'Enterprise Architecture & REST APIs',
      'Database: MySQL & PostgreSQL'
    ] : titleLower.includes('python') || titleLower.includes('data') || titleLower.includes('ai') ? [
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
      `${course.title || 'Course'} Core Track`,
      'Hands-on Practical & Project Training',
      'Certification & Job Assistance'
    ];

    const hlText = Array.isArray(course.highlights) && course.highlights.length > 0
      ? course.highlights.join('\n')
      : (typeof course.highlights === 'string' && course.highlights.trim() ? course.highlights : defaultHl.join('\n'));

    const pillsStr = Array.isArray(course.featurePills) && course.featurePills.length > 0
      ? course.featurePills.join(', ')
      : 'Live + recordings, Certificate, 2 to 3 projects, Placement support';

    const whatLearnStr = Array.isArray(course.whatYouWillLearn) && course.whatYouWillLearn.length > 0
      ? course.whatYouWillLearn.join('\n')
      : hlText;

    const modulesStr = Array.isArray(course.syllabusModules) && course.syllabusModules.length > 0
      ? course.syllabusModules.map(m => typeof m === 'string' ? m : `${m.title || ''} | ${m.desc || ''}`).join('\n')
      : '';

    const projectsStr = Array.isArray(course.projectsList) && course.projectsList.length > 0
      ? course.projectsList.map(p => typeof p === 'string' ? p : `${p.name || ''} | ${p.tech || ''} | ${p.desc || ''}`).join('\n')
      : '';

    setFormData({
      title: course.title || '',
      category: course.category || 'coding',
      subCat: course.subCat || subs[0] || 'web',
      subCategories: subs.length > 0 ? subs : ['web'],
      duration: course.duration || '6 Months',
      price: course.price || '₹ 24,999',
      level: course.level || 'Beginner to Advanced',
      badge: course.badge || 'Job Guaranteed Batch',
      description: course.description || '',
      technologies: techs || 'React, Node.js, MongoDB',
      icon: course.icon || course.logoUrl || '',
      logoUrl: course.logoUrl || course.icon || '',
      isActive: course.isActive !== false,
      showPrice: course.showPrice !== false,
      discountPercent: course.discountPercent || 0,
      originalPrice: course.originalPrice || '',
      isDiscountActive: course.isDiscountActive !== false && ((course.discountPercent || 0) > 0 || !!course.originalPrice),
      internships: course.internships || '5 Internships',
      mockTests: course.mockTests || '5 Mock Tests',
      projects: course.projects || '5 Projects',
      highlightsText: hlText,
      subtitle: course.subtitle || '',
      videoUrl: course.videoUrl || course.introVideoUrl || '',
      featurePillsText: pillsStr,
      whatYouWillLearnText: whatLearnStr,
      syllabusModulesText: modulesStr,
      projectsListText: projectsStr,
      batchClasses: course.batchClasses || 'Live + Recorded',
      batchTimings: course.batchTimings || 'Morning/Evening',
      batchMode: course.mode || course.batchMode || 'Online / Offline',
      certificateProvided: course.certificateProvided || 'Provided'
    });
    setShowAddModal(true);
  };

  const handleToggleCourseVisibility = async (courseId, currentIsActive) => {
    const newStatus = !currentIsActive;
    const result = await adminCmsModel.updateCourse(courseId, { isActive: newStatus });
    if (result) {
      await loadData();
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    }
  };

  const handleTogglePriceVisibility = async (courseId, currentShowPrice) => {
    const newStatus = !currentShowPrice;
    const result = await adminCmsModel.updateCourse(courseId, { showPrice: newStatus });
    if (result) {
      await loadData();
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    }
  };

  const handleToggleDiscount = async (courseId, currentIsDiscountActive) => {
    const targetCourse = courses.find(c => (c._id || c.id) === courseId);
    const turningOff = !!currentIsDiscountActive;
    
    let payload = {};
    if (turningOff && targetCourse) {
      const restoredPrice = targetCourse.originalPrice || targetCourse.price;
      payload = {
        price: restoredPrice,
        originalPrice: '',
        discountPercent: 0,
        isDiscountActive: false
      };
    } else {
      payload = { isDiscountActive: true };
    }

    const result = await adminCmsModel.updateCourse(courseId, payload);
    if (result) {
      await loadData();
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    }
  };

  const handleSaveDiscount = async (courseId, { price, originalPrice, discountPercent, isDiscountActive }) => {
    const payload = {
      isDiscountActive: !!isDiscountActive
    };
    if (price !== undefined) payload.price = price;
    if (originalPrice !== undefined) payload.originalPrice = originalPrice;
    if (discountPercent !== undefined) payload.discountPercent = discountPercent;

    const result = await adminCmsModel.updateCourse(courseId, payload);
    if (result) {
      await loadData();
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    }
    return result;
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Please fill course title and fee!');
      return;
    }

    const selectedSubCats = Array.isArray(formData.subCategories) && formData.subCategories.length > 0
      ? formData.subCategories
      : [formData.subCat || 'web'];

    const highlightsArr = typeof formData.highlightsText === 'string'
      ? formData.highlightsText.split('\n').map(h => h.trim()).filter(Boolean)
      : (Array.isArray(formData.highlights) ? formData.highlights : []);

    const whatYouWillLearnArr = typeof formData.whatYouWillLearnText === 'string' && formData.whatYouWillLearnText.trim()
      ? formData.whatYouWillLearnText.split('\n').map(s => s.trim()).filter(Boolean)
      : highlightsArr;

    const syllabusModulesArr = typeof formData.syllabusModulesText === 'string' && formData.syllabusModulesText.trim()
      ? formData.syllabusModulesText.split('\n').map(s => s.trim()).filter(Boolean).map(line => {
          const parts = line.split('|').map(p => p.trim());
          return { title: parts[0] || line, desc: parts[1] || '' };
        })
      : [];

    const projectsListArr = typeof formData.projectsListText === 'string' && formData.projectsListText.trim()
      ? formData.projectsListText.split('\n').map(s => s.trim()).filter(Boolean).map(line => {
          const parts = line.split('|').map(p => p.trim());
          return { name: parts[0] || line, tech: parts[1] || '', desc: parts[2] || '' };
        })
      : [];

    const featurePillsArr = typeof formData.featurePillsText === 'string' && formData.featurePillsText.trim()
      ? formData.featurePillsText.split(',').map(s => s.trim()).filter(Boolean)
      : ['Live + recordings', 'Certificate', '2 to 3 projects', 'Placement support'];

    const payload = {
      ...formData,
      subCategories: selectedSubCats,
      subCat: selectedSubCats[0] || formData.subCat || 'web',
      technologies: typeof formData.technologies === 'string'
        ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : formData.technologies,
      highlights: highlightsArr,
      subtitle: formData.subtitle || '',
      videoUrl: formData.videoUrl || '',
      whatYouWillLearn: whatYouWillLearnArr,
      syllabusModules: syllabusModulesArr,
      projectsList: projectsListArr,
      featurePills: featurePillsArr,
      batchClasses: formData.batchClasses || 'Live + Recorded',
      batchTimings: formData.batchTimings || 'Morning/Evening',
      batchMode: formData.batchMode || 'Online / Offline',
      certificateProvided: formData.certificateProvided || 'Provided'
    };

    let result = null;
    if (editingCourseId) {
      result = await adminCmsModel.updateCourse(editingCourseId, payload);
    } else {
      result = await adminCmsModel.addCourse(payload);
    }

    if (result) {
      await loadData();
      setShowAddModal(false);
      setEditingCourseId(null);
      setFormData({
        title: '',
        category: 'coding',
        subCat: 'web',
        subCategories: ['web'],
        duration: '6 Months',
        price: '₹ 24,999',
        level: 'Beginner to Advanced',
        badge: 'Job Guaranteed Batch',
        description: '',
        technologies: 'React, Node.js, MongoDB',
        icon: '',
        logoUrl: '',
        isActive: true,
        showPrice: true,
        discountPercent: 0,
        originalPrice: '',
        isDiscountActive: false,
        internships: '5 Internships',
        mockTests: '5 Mock Tests',
        projects: '5 Projects',
        highlightsText: '',
        subtitle: '',
        videoUrl: '',
        featurePillsText: 'Live + recordings, Certificate, 2 to 3 projects, Placement support',
        whatYouWillLearnText: '',
        syllabusModulesText: '',
        projectsListText: '',
        batchClasses: 'Live + Recorded',
        batchTimings: 'Morning/Evening',
        batchMode: 'Online / Offline',
        certificateProvided: 'Provided'
      });
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    }
    return result;
  };

  const handleDeleteCourse = async (id) => {
    await adminCmsModel.deleteCourse(id);
    await loadData();
    window.dispatchEvent(new Event('codeguru_refresh_all'));
  };

  // Category Handlers
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const handleOpenCategoryModal = () => {
    setEditingCategoryId(null);
    setCategoryFormData({
      label: '',
      category: '',
      subCat: '',
      subCategoriesText: '',
      badge: '',
      icon: '',
      bgColor: 'bg-blue-50'
    });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (cat) => {
    const catId = cat._id || cat.id || cat.category;
    setEditingCategoryId(catId);

    const subText = Array.isArray(cat.subCategories) && cat.subCategories.length > 0
      ? cat.subCategories.map(s => (typeof s === 'object' ? s.label || s.id : s)).join(', ')
      : (cat.subCat || '');

    setCategoryFormData({
      label: cat.label || '',
      category: cat.category || cat.id || '',
      subCat: cat.subCat || '',
      subCategoriesText: subText,
      badge: cat.badge || '',
      icon: cat.icon || '',
      bgColor: cat.bgColor || 'bg-blue-50'
    });
    setShowCategoryModal(true);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryFormData.label) {
      alert('Please enter Category Name!');
      return;
    }

    const slug = categoryFormData.category.trim() || categoryFormData.label.toLowerCase().replace(/[^a-z0-9]/g, '');
    const subCatDefault = categoryFormData.subCat.trim() || 'all';

    const subCategories = categoryFormData.subCategoriesText
      ? categoryFormData.subCategoriesText.split(',').map(item => {
          const trimmed = item.trim();
          return { id: trimmed.toLowerCase().replace(/[^a-z0-9]/g, ''), label: trimmed };
        }).filter(sc => sc.label)
      : [];

    const payload = {
      label: categoryFormData.label,
      category: slug,
      subCat: subCatDefault,
      subCategories,
      badge: categoryFormData.badge,
      icon: categoryFormData.icon,
      bgColor: categoryFormData.bgColor || 'bg-blue-50'
    };

    let result = null;
    if (editingCategoryId) {
      result = await adminCmsModel.updateCategory(editingCategoryId, payload);
    } else {
      result = await adminCmsModel.addCategory(payload);
    }

    if (result) {
      await loadData();
      setShowCategoryModal(false);
      setEditingCategoryId(null);
      setCategoryFormData({
        label: '',
        category: '',
        subCat: '',
        subCategoriesText: '',
        badge: '',
        icon: '',
        bgColor: 'bg-blue-50'
      });
      window.dispatchEvent(new Event('codeguru_refresh_all'));
      return result;
    } else {
      alert('Failed to save category.');
      return null;
    }
  };

  const handleDeleteCategory = async (id, categoryLabel) => {
    await adminCmsModel.deleteCategory(id);
    await loadData();
    window.dispatchEvent(new Event('codeguru_refresh_all'));
  };

  const handleToggleCategoryVisibility = async (categoryId, currentIsActive) => {
    const newStatus = !currentIsActive;
    // Optimistic instant UI update
    setCategories(prev => prev.map(cat => {
      const matchId = cat._id || cat.id || cat.category;
      if (matchId === categoryId || cat.category === categoryId || cat.id === categoryId) {
        return { ...cat, isActive: newStatus };
      }
      return cat;
    }));

    try {
      const targetId = categoryId || 'coding';
      await adminCmsModel.updateCategory(targetId, { isActive: newStatus });
      await loadData();
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    } catch (err) {
      console.error('[useCoursesController Error] Category toggle failed:', err);
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleCategoryImageFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // 1. Try server endpoint upload first
      const uploadedUrl = await adminCmsModel.uploadFile(file);
      if (uploadedUrl) {
        setCategoryFormData(prev => ({ ...prev, icon: uploadedUrl }));
        setUploadingImage(false);
        return;
      }

      // 2. Local Data URL reader fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryFormData(prev => ({ ...prev, icon: reader.result }));
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File selection error:', err);
      setUploadingImage(false);
    }
  };

  return {
    courses,
    categories,
    showAddModal,
    setShowAddModal,
    editingCourseId,
    handleOpenAddModal,
    handleEditCourse,
    formData,
    setFormData,
    uploadingCourseIcon,
    handleCourseIconFileSelect,
    loadCourses: loadData,
    handleCreateCourse,
    handleDeleteCourse,
    handleToggleCourseVisibility,
    handleTogglePriceVisibility,
    handleToggleDiscount,
    handleSaveDiscount,
    // Category returns
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
  };
}
