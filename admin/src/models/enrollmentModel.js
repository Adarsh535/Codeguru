/**
 * ============================================================================
 * ADMIN MODEL: ENROLLMENT & REVENUE DATA MODEL (enrollmentModel.js)
 * ============================================================================
 * Handles REST API calls to backend Express server for student enrollments & finance data.
 */

import { apiFetch, API_BASE } from './apiClient';

const API_URL = '/enrollments';

export const enrollmentModel = {
  /**
   * Fetch all student course enrollments from backend REST API using authenticated apiFetch
   */
  getEnrollments: async () => {
    try {
      const res = await apiFetch(API_URL);
      if (!res.ok) {
        throw new Error(`Failed to load enrollments (${res.status})`);
      }
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (err) {
      console.warn('[enrollmentModel Admin] Error loading enrollments:', err.message);
      throw err;
    }
  },

  /**
   * Update enrollment status or fee status. Throws on failure (A7).
   */
  updateEnrollmentStatus: async (id, statusData) => {
    const res = await apiFetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to update enrollment (${res.status})`);
    }
    return res.json();
  },

  /**
   * Delete enrollment record. Throws on failure (A7).
   */
  deleteEnrollment: async (id) => {
    const res = await apiFetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to delete enrollment (${res.status})`);
    }
    return res.json();
  }
};
