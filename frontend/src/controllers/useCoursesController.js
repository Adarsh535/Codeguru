/**
 * ============================================================================
 * CONTROLLER LAYER: COURSES CONTROLLER (useCoursesController.js)
 * ============================================================================
 * Custom hook handling course catalog fetching, category filters, and search query.
 */

import { useState, useEffect, useCallback } from 'react';
import { courseModel } from '../models/courseModel';

export function useCoursesController() {
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    const data = await courseModel.getCourses();
    setCourses(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
    const matchesSearch = !searchQuery || course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return {
    courses: filteredCourses,
    allCourses: courses,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    loading,
    refreshCourses: loadCourses
  };
}
