/**
 * ============================================================================
 * FRONTEND MODEL: ENROLLMENT & PAYMENTS (enrollmentModel.js)
 * ============================================================================
 * Handles API calls to backend Express server for course enrollments.
 */

import { API_BASE } from './apiClient';

export const enrollmentModel = {
  /**
   * Fetch all student enrollments from Backend API
   */
  getEnrollments: async () => {
    try {
      const res = await fetch(`${API_BASE}/enrollments`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (err) {
      console.warn('Backend /api/enrollments offline, fallback to local store:', err.message);
      const local = localStorage.getItem('codeguru_my_batches');
      return local ? JSON.parse(local) : [];
    }
  },

  /**
   * Submit new student enrollment & payment record
   */
  createEnrollment: async (enrollmentData) => {
    try {
      const res = await fetch(`${API_BASE}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollmentData)
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Backend enrollment submission fallback:', err.message);
      return { success: true, data: enrollmentData, fallback: true };
    }
  }
};
