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
  const [editingCourseId, setEditingCourseId] = useState(null);
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

  const handleOpenAddModal = () => {
    setEditingCourseId(null);
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
    setShowAddModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourseId(course._id || course.id);
    const techs = Array.isArray(course.technologies)
      ? course.technologies.join(', ')
      : (course.technologies || '');

    setFormData({
      title: course.title || '',
      category: course.category || 'coding',
      subCat: course.subCat || 'web',
      duration: course.duration || '6 Months',
      price: course.price || '₹ 24,999',
      level: course.level || 'Beginner to Advanced',
      badge: course.badge || 'Job Guaranteed Batch',
      description: course.description || '',
      technologies: techs || 'React, Node.js, MongoDB'
    });
    setShowAddModal(true);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Please fill course title and fee!');
      return;
    }

    const payload = {
      ...formData,
      technologies: typeof formData.technologies === 'string'
        ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : formData.technologies
    };

    let result = null;
    if (editingCourseId) {
      result = await adminCmsModel.updateCourse(editingCourseId, payload);
    } else {
      result = await adminCmsModel.addCourse(payload);
    }

    if (result) {
      await loadCourses();
      setShowAddModal(false);
      setEditingCourseId(null);
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
    editingCourseId,
    handleOpenAddModal,
    handleEditCourse,
    formData,
    setFormData,
    loadCourses,
    handleCreateCourse,
    handleDeleteCourse
  };
}
