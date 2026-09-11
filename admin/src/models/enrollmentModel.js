/**
 * ============================================================================
 * ADMIN MODEL: ENROLLMENT & REVENUE DATA MODEL (enrollmentModel.js)
 * ============================================================================
 * Handles REST API calls to backend Express server for student enrollments & finance data.
 */

import { API_BASE } from './apiClient';

const API_URL = `${API_BASE}/enrollments`;
const STORAGE_KEY = 'codeguru_my_batches';

export const enrollmentModel = {
  /**
   * Fetch all student course enrollments from backend REST API
   */
  getEnrollments: async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        return data.data;
      }
    } catch (err) {
      console.warn('[enrollmentModel Admin] Backend API offline, fetching from local cache:', err.message);
    }

    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) return JSON.parse(local);
    } catch (err) {
      console.error('Local cache read error:', err);
    }

    return [];
  },

  /**
   * Update enrollment status or fee status
   */
  updateEnrollmentStatus: async (id, statusData) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusData)
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error updating enrollment on backend:', err);
    }
  },

  /**
   * Delete enrollment record
   */
  deleteEnrollment: async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting enrollment on backend:', err);
    }
  }
};
