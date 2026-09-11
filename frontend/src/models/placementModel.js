/**
 * ============================================================================
 * MODEL LAYER: PLACEMENT MODEL & API SERVICE (placementModel.js)
 * ============================================================================
 * Manages placement drives, student star achievers, and aggregates domain models.
 */

import { API_BASE } from './apiClient';

// Re-export all domain models for central access and backward compatibility
export { LOCATIONS, getLocationById, getPopularLocations } from './locationModel';
export { PLACEMENT_CATEGORIES, getCategoryById } from './categoryModel';
export { OUR_TEAM_MEMBERS } from './teamModel';
export { OUR_BRANCHES_DATA } from './branchModel';

export const PLACEMENTS = [
  {
    id: 'p-101',
    company: 'TechCorp Innovations',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    role: 'Full Stack Software Engineer',
    package: '₹ 18.5 LPA',
    location: 'Bengaluru, KA',
    type: 'tech',
    driveType: 'On-Campus & Off-Campus',
    deadline: '2 days left',
    eligibleBatches: ['2025', '2026'],
    skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    rating: 4.8,
    isHot: true
  },
  {
    id: 'p-102',
    company: 'Nexus AI Labs',
    logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&auto=format&fit=crop&q=80',
    role: 'AI / Data Science Intern',
    package: 'Stipend: ₹ 50,000 / mo',
    location: 'Work From Home (Remote)',
    type: 'internship',
    driveType: 'Remote Internship',
    deadline: '5 days left',
    eligibleBatches: ['2026', '2027'],
    skills: ['Python', 'PyTorch', 'FastAPI', 'MLOps'],
    rating: 4.9,
    isHot: true
  },
  {
    id: 'p-103',
    company: 'Global Cloud Systems',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
    role: 'DevOps & Cloud Engineer',
    package: '₹ 14.0 LPA',
    location: 'Pune, MH',
    type: 'tech',
    driveType: 'Off-Campus Hiring',
    deadline: '1 week left',
    eligibleBatches: ['2024', '2025'],
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    rating: 4.6,
    isHot: false
  },
  {
    id: 'p-104',
    company: 'Fintech Spark',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80',
    role: 'Java Backend Architect',
    package: '₹ 16.0 LPA',
    location: 'Gurugram, HR',
    type: 'tech',
    driveType: 'Exclusive Hiring Drive',
    deadline: '3 days left',
    eligibleBatches: ['2025'],
    skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL'],
    rating: 4.7,
    isHot: true
  }
];

export const TOP_PLACEMENTS_STUDENTS = [
  {
    id: 's-201',
    name: 'Saurabh Kumar',
    college: 'B.Tech CSE, 2026 Batch',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    company: 'Google / Amazon',
    companyLogo: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=100&q=80',
    role: 'Full Stack Engineer',
    package: '18.5 LPA',
    batch: 'TOP PLACEMENT DRIVES 2026',
    verified: true
  },
  {
    id: 's-202',
    name: 'Ananya Mishra',
    college: 'B.Tech IT, 2026 Batch',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    company: 'Microsoft',
    companyLogo: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=100&q=80',
    role: 'Java Backend Developer',
    package: '16.0 LPA',
    batch: 'TOP PLACEMENT DRIVES 2026',
    verified: true
  },
  {
    id: 's-203',
    name: 'Vikas Sharma',
    college: 'BCA, 2025 Batch',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    company: 'Flipkart / PayTM',
    companyLogo: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=100&q=80',
    role: 'DevOps Engineer',
    package: '14.2 LPA',
    batch: 'STAR ACHIEVER 2026',
    verified: true
  }
];

export const placementModel = {
  /**
   * --------------------------------------------------------------------------
   * API: Get Placement Drives & Star Achievers
   * --------------------------------------------------------------------------
   * @route   GET http://localhost:5000/api/placements
   * @desc    Website homepage & placement section ke liye placed students & company drives list fetch karta hai.
   * @access  Public
   * @returns {Promise<Array>} List of placement posters
   */
  getPlacements: async () => {
    try {
      const res = await fetch(`${API_BASE}/placements`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map((item, idx) => ({
          id: item._id || item.id || idx,
          name: item.studentName || item.name || 'Student Achiever',
          college: item.collegeName || item.college || 'CodeGuru Alumni',
          photo: item.studentPhoto || item.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          company: item.companyName || item.company || 'Top Tech MNC',
          companyLogo: item.companyLogo || 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=100&q=80',
          role: item.jobRole || item.role || 'Full Stack Engineer',
          package: item.packageLpa ? `${item.packageLpa} LPA` : (item.package || '8.5 LPA'),
          batch: item.badgeLabel || item.batch || 'TOP PLACEMENT DRIVES 2026',
          verified: true
        }));
      }
    } catch (err) {
      console.warn('[placementModel API Warning] Live placement fetch error:', err);
    }
    return TOP_PLACEMENTS_STUDENTS;
  }
};
