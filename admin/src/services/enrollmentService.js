/**
 * ============================================================================
 * ADMIN SERVICE: ENROLLMENT SERVICE (enrollmentService.js)
 * ============================================================================
 * Bridge connecting Admin views to backend enrollment REST APIs.
 */

import { enrollmentModel } from '../models/enrollmentModel';

export const enrollmentService = {
  getEnrollments: () => enrollmentModel.getEnrollments(),
  updateEnrollmentStatus: (id, statusData) => enrollmentModel.updateEnrollmentStatus(id, statusData),
  deleteEnrollment: (id) => enrollmentModel.deleteEnrollment(id)
};
