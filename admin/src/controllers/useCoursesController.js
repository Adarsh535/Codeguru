/**
 * ============================================================================
 * CONTROLLER LAYER: COURSES MANAGER CONTROLLER (useCoursesController.js)
 * ============================================================================
 * Custom hook handling business logic for Courses Catalog Management.
 */

import { useState, useEffect, useCallback } from 'react';
import { adminCmsModel } from '../models/adminCmsModel';

export function useCoursesController() {
  const [courses, setCourses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'coding',
    subCat: 'web',
    duration: '6 Months',
    price: '₹ 24,999',
    level: 'Beginner to Advanced',
    badge: 'Job Guaranteed Batch',
    description: '',
    technologies: 'React, Node.js, MongoDB'
  });

  const loadCourses = useCallback(async () => {
    const data = await adminCmsModel.getCourses();
    setCourses(data);
  }, []);

  useEffect(() => {
    loadCourses();
    const handleRefresh = () => loadCourses();
    window.addEventListener('codeguru_refresh_all', handleRefresh);
    return () => window.removeEventListener('codeguru_refresh_all', handleRefresh);
  }, [loadCourses]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Please fill course title and fee!');
      return;
    }

    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
    };

    const created = await adminCmsModel.addCourse(payload);
    if (created) {
      await loadCourses();
      setShowAddModal(false);
      setFormData({
        title: '',
        category: 'coding',
        subCat: 'web',
        duration: '6 Months',
        price: '₹ 24,999',
        level: 'Beginner to Advanced',
        badge: 'Job Guaranteed Batch',
        description: '',
        technologies: 'React, Node.js, MongoDB'
      });
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course from catalog?')) {
      await adminCmsModel.deleteCourse(id);
      await loadCourses();
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    }
  };

  return {
    courses,
    showAddModal,
    setShowAddModal,
    formData,
    setFormData,
    loadCourses,
    handleCreateCourse,
    handleDeleteCourse
  };
}
