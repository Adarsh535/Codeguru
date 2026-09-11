/**
 * ============================================================================
 * MODEL LAYER: TEAM MODEL & API SERVICE (teamModel.js)
 * ============================================================================
 * Manages Team Members and Mentors data for Our Team section.
 */

import { API_BASE } from './apiClient';

export const OUR_TEAM_MEMBERS = [
  {
    id: 'team-1',
    name: 'Roshani Yadav',
    role: 'Social Media Manager',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    tag: '#TEAMCODEGURU',
    bio: 'Roshani Yadav is the Social Media Manager at CodeGuru, overseeing content strategy, engagement, and brand presence across platforms.',
    phone: '9198483820',
    website: 'codeguru.com'
  },
  {
    id: 'team-2',
    name: 'Aman Kumar Verma',
    role: 'Lead Full Stack Developer',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    tag: '#TEAMCODEGURU',
    bio: 'Aman Kumar Verma is the Lead Full Stack Developer at CodeGuru, guiding core MERN architecture, enterprise web solutions, and software project engineering.',
    phone: '9198483820',
    website: 'codeguru.com'
  },
  {
    id: 'team-3',
    name: 'Sneha Rastogi',
    role: 'Placement Manager',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    tag: '#TEAMCODEGURU',
    bio: 'Sneha Rastogi is the Placement Manager at CodeGuru, driving corporate partnerships, campus recruitment, and student career placement drives.',
    phone: '9198483820',
    website: 'codeguru.com'
  }
];

export const teamModel = {
  /**
   * --------------------------------------------------------------------------
   * API: Get CodeGuru Team & Tech Instructors
   * --------------------------------------------------------------------------
   * @route   GET http://localhost:5000/api/team
   * @desc    Website homepage slider ke liye team instructors & staff profiles fetch karta hai.
   * @access  Public
   * @returns {Promise<Array>} List of team members
   */
  getTeam: async () => {
    try {
      const res = await fetch(`${API_BASE}/team`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map((item, idx) => ({
          id: item._id || item.id || idx,
          name: item.name,
          role: item.role || 'Senior Software Instructor',
          experience: item.experience || '6+ Yrs Exp',
          photo: item.photo || item.mediaUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          exCompany: item.exCompany || 'Ex-MNC Tech Lead',
          specialization: item.specialization || 'Full Stack & System Architecture'
        }));
      }
    } catch (err) {
      console.warn('[teamModel API Warning] Live team fetch error:', err);
    }
    return OUR_TEAM_MEMBERS;
  }
};
