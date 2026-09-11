import { API_BASE } from './apiClient';

/**
 * ============================================================================
 * MODEL LAYER: USER & AUTHENTICATION MODEL (userModel.js)
 * ============================================================================
 * Handles student registration and authentication requests against Express backend API.
 */

export const userModel = {
  /**
   * API: Register Student Account
   * @route   POST http://localhost:5000/api/auth/student/register
   * @param   {Object} studentData - { name, email, password, phone }
   * @returns {Promise<Object>} API JSON response
   */
  registerStudent: async (studentData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/student/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      return await res.json();
    } catch (err) {
      console.warn('[userModel API Warning] Registration network error:', err);
      return { success: false, message: 'Unable to connect to server. Please check connection.' };
    }
  },

  /**
   * API: Student Login Authentication
   * @route   POST http://localhost:5000/api/auth/student/login
   * @param   {Object} credentials - { email, password }
   * @returns {Promise<Object>} API JSON response
   */
  loginStudent: async (credentials) => {
    try {
      const res = await fetch(`${API_BASE}/auth/student/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await res.json();
    } catch (err) {
      console.warn('[userModel API Warning] Login network error:', err);
      return { success: false, message: 'Unable to connect to server. Please check connection.' };
    }
  }
};
