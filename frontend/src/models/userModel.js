import { API_BASE, getAuthToken, setAuthToken } from './apiClient';

/**
 * ============================================================================
 * MODEL LAYER: USER & AUTHENTICATION MODEL (userModel.js)
 * ============================================================================
 * Handles student registration and authentication requests against Express backend API.
 * Automatically saves JWT tokens and attaches Authorization Bearer headers.
 */

export const userModel = {
  /**
   * API: Register Student Account
   * @route   POST https://369.codegurru.in/api/auth/student/register
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
      const data = await res.json();
      if (data && data.success && data.token) {
        setAuthToken(data.token);
      }
      return data;
    } catch (err) {
      console.warn('[userModel API Warning] Registration network error:', err);
      return { success: false, message: 'Unable to connect to server. Please check connection.' };
    }
  },

  /**
   * API: Student Login Authentication
   * @route   POST https://369.codegurru.in/api/auth/student/login
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
      const data = await res.json();
      if (data && data.success && data.token) {
        setAuthToken(data.token);
      }
      return data;
    } catch (err) {
      console.warn('[userModel API Warning] Login network error:', err);
      return { success: false, message: 'Unable to connect to server. Please check connection.' };
    }
  },

  /**
   * API: Send Mobile OTP for Fast Student Login
   * @route   POST https://369.codegurru.in/api/auth/student/send-otp
   * @param   {string} phone - 10-digit mobile number
   * @returns {Promise<Object>} API JSON response
   */
  sendOtp: async (phone) => {
    try {
      const res = await fetch(`${API_BASE}/auth/student/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      return await res.json();
    } catch (err) {
      console.warn('[userModel API Warning] sendOtp network error:', err);
      return { success: false, message: 'Unable to reach server. Please try again.' };
    }
  },

  /**
   * API: Verify Mobile OTP & Auto Login
   * @route   POST https://369.codegurru.in/api/auth/student/verify-otp
   * @param   {Object} params - { phone, otp, name, location }
   * @returns {Promise<Object>} API JSON response
   */
  verifyOtp: async ({ phone, otp, name, location }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/student/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name, location })
      });
      const data = await res.json();
      if (data && data.success && data.token) {
        setAuthToken(data.token);
      }
      return data;
    } catch (err) {
      console.warn('[userModel API Warning] verifyOtp network error:', err);
      return { success: false, message: 'Unable to reach server. Please try again.' };
    }
  },

  /**
   * API: Update Student Profile (Name & Email after OTP Verification)
   * @route   POST https://369.codegurru.in/api/auth/student/update-profile
   * @param   {Object} params - { phone, name, email, location }
   * @returns {Promise<Object>} API JSON response
   */
  updateProfile: async ({ phone, name, email, location }) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/auth/student/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ phone, name, email, location })
      });
      return await res.json();
    } catch (err) {
      console.warn('[userModel API Warning] updateProfile network error:', err);
      return { success: false, message: 'Unable to reach server. Please try again.' };
    }
  }
};
