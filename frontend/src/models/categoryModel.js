/**
 * CATEGORY MODEL & STORE
 * Manages placement categories, course categories and category metadata.
 */

const API_BASE = 'http://localhost:5000/api';

export const PLACEMENT_CATEGORIES = [
  { id: 'all', label: 'Placement Drives', icon: 'Briefcase', badge: 'Popular' },
  { id: 'tech', label: 'Software & IT', icon: 'Code', badge: 'High Package' },
  { id: 'internship', label: 'Summer Internships', icon: 'GraduationCap', badge: 'Stipend ₹45k+' },
  { id: 'campus', label: 'On-Campus Drive', icon: 'Building2', badge: 'Direct Interview' },
  { id: 'offcampus', label: 'Off-Campus Hiring', icon: 'Zap', badge: 'Active Now' },
  { id: 'core', label: 'Core & Non-Tech', icon: 'Cpu', badge: 'Multi-domain' }
];

export const getCategoryById = (id) => PLACEMENT_CATEGORIES.find(cat => cat.id === id);

export const categoryModel = {
  /**
   * Fetch Course Categories from MongoDB Express Backend
   * @route GET http://localhost:5000/api/categories
   */
  getCategories: async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (err) {
      console.warn('[categoryModel] Failed to fetch categories from API:', err);
      return [];
    }
  }
};
