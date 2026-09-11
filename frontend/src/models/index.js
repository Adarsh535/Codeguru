/**
 * ============================================================================
 * FRONTEND MODELS BARREL EXPORT (models/index.js)
 * ============================================================================
 * Exports all data models and API services for Frontend MVC architecture.
 */

export { API_BASE, apiFetch } from './apiClient';
export { bannerModel } from './bannerModel';
export { courseModel } from './courseModel';
export { placementModel, PLACEMENTS, TOP_PLACEMENTS_STUDENTS } from './placementModel';
export { teamModel, OUR_TEAM_MEMBERS } from './teamModel';
export { leadModel } from './leadModel';
export { OUR_BRANCHES_DATA } from './branchModel';
export { PLACEMENT_CATEGORIES, getCategoryById } from './categoryModel';
export { LOCATIONS, getLocationById, getPopularLocations } from './locationModel';
