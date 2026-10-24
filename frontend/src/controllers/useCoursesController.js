'use client';

/**
 * ============================================================================
 * FRONTEND MVC: COURSES CONTROLLER (useCoursesController.js)
 * ============================================================================
 * Encapsulates course catalog state, category filtering, search, and live SSE sync.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { courseModel } from '../models/courseModel';
import { categoryModel } from '../models/categoryModel';

export function useCoursesController() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('coding');
  const [activeSubCategory, setActiveSubCategory] = useState('web');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedCourses, setLikedCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoursesAndCategories = useCallback(async () => {
    try {
      setLoading(true);
      const [coursesData, catsData] = await Promise.all([
        courseModel.getCourses().catch(() => []),
        categoryModel.getCategories().catch(() => [])
      ]);
      if (Array.isArray(coursesData) && coursesData.length > 0) {
        setCourses(coursesData);
      }
      if (Array.isArray(catsData) && catsData.length > 0) {
        setCategories(catsData);
      }
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoursesAndCategories();

    // Listen for live SSE course updates
    if (typeof window !== 'undefined') {
      window.addEventListener('codeguru_refresh_courses', fetchCoursesAndCategories);
      return () => {
        window.removeEventListener('codeguru_refresh_courses', fetchCoursesAndCategories);
      };
    }
  }, [fetchCoursesAndCategories]);

  // Toggle favorite / like on a course
  const toggleLike = useCallback((courseId) => {
    setLikedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  }, []);

  // Filtered courses based on activeCategory, activeSubCategory, activeFilter & search query
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Category match
      const catMatch = !activeCategory || course.category?.toLowerCase() === activeCategory.toLowerCase();
      
      // Sub-category match
      const subCatMatch = !activeSubCategory || 
        course.subCat?.toLowerCase() === activeSubCategory.toLowerCase() ||
        (Array.isArray(course.subCategories) && course.subCategories.some(sc => sc.toLowerCase() === activeSubCategory.toLowerCase()));
      
      // Filter (e.g. 'Job Guarantee Batch', 'Short Term')
      const badgeMatch = activeFilter === 'All' || 
        course.badge?.toLowerCase().includes(activeFilter.toLowerCase()) ||
        course.level?.toLowerCase().includes(activeFilter.toLowerCase());

      // Search match
      const searchMatch = !searchQuery || 
        course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(course.technologies) && course.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return catMatch && subCatMatch && badgeMatch && searchMatch;
    });
  }, [courses, activeCategory, activeSubCategory, activeFilter, searchQuery]);

  return {
    courses,
    categories,
    filteredCourses,
    activeCategory,
    setActiveCategory,
    activeSubCategory,
    setActiveSubCategory,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    likedCourses,
    toggleLike,
    loading,
    error,
    refreshCourses: fetchCoursesAndCategories
  };
}
