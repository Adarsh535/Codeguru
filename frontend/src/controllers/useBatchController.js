'use client';

/**
 * ============================================================================
 * FRONTEND MVC: BATCH & ENROLLMENT CONTROLLER (useBatchController.js)
 * ============================================================================
 * Manages course enrollments, batch details, and fee payment submissions.
 */

import { useState, useCallback } from 'react';
import { enrollmentModel } from '../models/enrollmentModel';

export function useBatchController() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const submitEnrollment = useCallback(async (enrollmentData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const result = await enrollmentModel.createEnrollment(enrollmentData);
      setSuccess(true);
      return { success: true, data: result };
    } catch (err) {
      const msg = err.message || 'Failed to submit enrollment';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    success,
    error,
    submitEnrollment,
    resetState: () => {
      setLoading(false);
      setSuccess(false);
      setError(null);
    }
  };
}
