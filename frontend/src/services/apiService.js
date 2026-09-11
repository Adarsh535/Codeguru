/**
 * ============================================================================
 * FRONTEND API SERVICE (Backward-Compatibility Bridge to Models Layer)
 * ============================================================================
 * Connects Frontend UI Views & Controllers to Express REST API Backend.
 */

import { bannerModel } from '../models/bannerModel';
import { placementModel } from '../models/placementModel';
import { teamModel } from '../models/teamModel';
import { courseModel } from '../models/courseModel';
import { leadModel } from '../models/leadModel';
import { enrollmentModel } from '../models/enrollmentModel';
import { userModel } from '../models/userModel';

export const apiService = {
  /**
   * API: Fetch Homepage Hero Banners
   * @route GET http://localhost:5000/api/banners
   */
  getBanners: () => bannerModel.getBanners(),

  /**
   * API: Fetch Student Placement Posters
   * @route GET http://localhost:5000/api/placements
   */
  getPlacements: () => placementModel.getPlacements(),

  /**
   * API: Fetch CodeGuru Team Members & Mentors
   * @route GET http://localhost:5000/api/team
   */
  getTeam: () => teamModel.getTeam(),

  /**
   * API: Fetch Training Courses Catalog
   * @route GET http://localhost:5000/api/courses
   */
  getCourses: () => courseModel.getCourses(),

  /**
   * API: Submit Student Admission Lead Inquiry
   * @route POST http://localhost:5000/api/leads
   * @param {Object} leadData - { name, phone, course, location, notes }
   */
  submitLead: (leadData) => leadModel.submitLead(leadData),

  /**
   * API: Create New Student Course Enrollment & Payment
   * @route POST http://localhost:5000/api/enrollments
   */
  createEnrollment: (enrollmentData) => enrollmentModel.createEnrollment(enrollmentData),

  /**
   * API: Fetch All Student Enrollments
   * @route GET http://localhost:5000/api/enrollments
   */
  getEnrollments: () => enrollmentModel.getEnrollments(),

  /**
   * API: Ping Visitor Traffic Analytics
   * @route POST http://localhost:5000/api/traffic/ping
   * @param {string} searchQuery
   * @param {string} city
   */
  pingTraffic: (searchQuery, city) => leadModel.pingTraffic(searchQuery, city),

  /**
   * API: Register Student Account in MongoDB
   * @route POST http://localhost:5000/api/auth/student/register
   */
  registerStudent: (studentData) => userModel.registerStudent(studentData),

  /**
   * API: Student Login in MongoDB
   * @route POST http://localhost:5000/api/auth/student/login
   */
  loginStudent: (credentials) => userModel.loginStudent(credentials)
};


