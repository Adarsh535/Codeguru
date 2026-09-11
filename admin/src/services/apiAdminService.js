/**
 * ============================================================================
 * ADMIN API SERVICE (Backward Compatibility Bridge to adminCmsModel)
 * Connects Admin Panel Views to CodeGuru Express REST API Backend.
 * ============================================================================
 */

import { adminCmsModel } from '../models/adminCmsModel';

export const apiAdminService = {
  /**
   * API: Upload Image/Video File to Backend Express Server
   * @route POST http://localhost:5000/api/upload
   * @param {File} file - Image/Video file
   */
  uploadFile: (file) => adminCmsModel.uploadFile(file),

  /**
   * API: Fetch Website Hero Banner Sliders
   * @route GET http://localhost:5000/api/banners
   */
  getBanners: () => adminCmsModel.getBanners(),

  /**
   * API: Create New Hero Banner Slide
   * @route POST http://localhost:5000/api/banners
   * @param {Object} payload - Banner object data
   */
  addBanner: (payload) => adminCmsModel.addBanner(payload),

  /**
   * API: Delete Hero Banner Slide
   * @route DELETE http://localhost:5000/api/banners/:id
   * @param {string} id - Banner MongoDB _id
   */
  deleteBanner: (id) => adminCmsModel.deleteBanner(id),

  /**
   * API: Fetch Training Courses Catalog
   * @route GET http://localhost:5000/api/courses
   */
  getCourses: () => adminCmsModel.getCourses(),

  /**
   * API: Create New Course Catalog Item
   * @route POST http://localhost:5000/api/courses
   * @param {Object} payload - Course details
   */
  addCourse: (payload) => adminCmsModel.addCourse(payload),

  /**
   * API: Delete Course Item
   * @route DELETE http://localhost:5000/api/courses/:id
   * @param {string} id - Course MongoDB _id
   */
  deleteCourse: (id) => adminCmsModel.deleteCourse(id),

  /**
   * API: Fetch Student Placement Records
   * @route GET http://localhost:5000/api/placements
   */
  getPlacements: () => adminCmsModel.getPlacements(),

  /**
   * API: Create New Student Placement Record
   * @route POST http://localhost:5000/api/placements
   * @param {Object} payload - Student placement details
   */
  addPlacement: (payload) => adminCmsModel.addPlacement(payload),

  /**
   * API: Delete Student Placement Record
   * @route DELETE http://localhost:5000/api/placements/:id
   * @param {string} id - Placement MongoDB _id
   */
  deletePlacement: (id) => adminCmsModel.deletePlacement(id),

  /**
   * API: Fetch CodeGuru Team Members & Instructors
   * @route GET http://localhost:5000/api/team
   */
  getTeam: () => adminCmsModel.getTeam(),

  /**
   * API: Create New Staff Instructor / Team Member
   * @route POST http://localhost:5000/api/team
   * @param {Object} payload - Team member profile
   */
  addTeamMember: (payload) => adminCmsModel.addTeamMember(payload),

  /**
   * API: Delete Team Member
   * @route DELETE http://localhost:5000/api/team/:id
   * @param {string} id - Team member MongoDB _id
   */
  deleteTeamMember: (id) => adminCmsModel.deleteTeamMember(id),

  /**
   * API: Fetch Realtime Website Traffic & Visitor Stats
   * @route GET http://localhost:5000/api/traffic/stats
   */
  getTrafficStats: () => adminCmsModel.getTrafficStats()
};

