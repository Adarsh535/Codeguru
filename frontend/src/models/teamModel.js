/**
 * ============================================================================
 * MODEL LAYER: TEAM MODEL & API SERVICE (teamModel.js)
 * ============================================================================
 * Manages Team Members and Mentors data for Our Team section.
 * Connected to canonical BUSINESS_CONFIG.
 */

import { BUSINESS_CONFIG } from '../config/business';
import { apiFetch } from './apiClient';

export const OUR_TEAM_MEMBERS = BUSINESS_CONFIG.team;

export const teamModel = {
  getTeam: async () => {
    try {
      const res = await apiFetch('/team');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map((item, idx) => ({
          id: item._id || item.id || idx,
          name: item.name,
          role: item.role || 'Senior Software Instructor',
          experience: item.experience || '6+ Yrs Exp',
          photo: item.photo || item.photoUrl || item.mediaUrl || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=500&fit=crop&crop=faces',
          bio: item.bio || '',
          specialization: item.specialization || item.bio || 'Full Stack & System Design'
        }));
      }
    } catch (err) {
      console.warn('[teamModel API Warning] Live team fetch error:', err);
    }
    return OUR_TEAM_MEMBERS;
  }
};
