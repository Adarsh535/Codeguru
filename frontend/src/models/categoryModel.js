/**
 * CATEGORY MODEL & STORE
 * Manages placement categories and category metadata.
 */

export const PLACEMENT_CATEGORIES = [
  { id: 'all', label: 'Placement Drives', icon: 'Briefcase', badge: 'Popular' },
  { id: 'tech', label: 'Software & IT', icon: 'Code', badge: 'High Package' },
  { id: 'internship', label: 'Summer Internships', icon: 'GraduationCap', badge: 'Stipend ₹45k+' },
  { id: 'campus', label: 'On-Campus Drive', icon: 'Building2', badge: 'Direct Interview' },
  { id: 'offcampus', label: 'Off-Campus Hiring', icon: 'Zap', badge: 'Active Now' },
  { id: 'core', label: 'Core & Non-Tech', icon: 'Cpu', badge: 'Multi-domain' }
];

export const getCategoryById = (id) => PLACEMENT_CATEGORIES.find(cat => cat.id === id);
