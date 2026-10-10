/**
 * ============================================================================
 * API CONTROLLER: COURSE CONTROLLER (courseController.js)
 * ============================================================================
 * Manages training courses catalog, course categories, pricing, and curriculum specs via MongoDB Atlas.
 */

import { Course } from '../../models/Course.js';
import { broadcastRealtimeEvent } from '../../services/realtimeService.js';

/**
 * @route   GET /api/courses
 * @desc    Retrieves all available courses catalog from MongoDB Atlas.
 * @access  Public
 */
export const getCourses = async (req, res) => {
  try {
    const isAll = req.query.all === 'true' || req.query.admin === 'true';
    const filter = isAll ? {} : { isActive: { $ne: false } };
    const courses = await Course.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, data: courses });
  } catch (err) {
    console.error('[courseController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message, data: [] });
  }
};

/**
 * @route   POST /api/courses
 * @desc    Creates a new training course entry in MongoDB Atlas.
 * @access  Admin Private
 */
export const addCourse = async (req, res) => {
  try {
    const selectedSubCats = Array.isArray(req.body.subCategories) && req.body.subCategories.length > 0
      ? req.body.subCategories
      : [req.body.subCat || 'web'];

    const course = await Course.create({
      title: req.body.title || 'New Tech Course',
      category: req.body.category || 'coding',
      subCat: selectedSubCats[0] || req.body.subCat || 'web',
      subCategories: selectedSubCats,
      duration: req.body.duration || '6 Months',
      price: req.body.price || '₹ 24,999',
      level: req.body.level || 'Beginner to Advanced',
      badge: req.body.badge || 'Job Guarantee Batch',
      description: req.body.description || '',
      technologies: Array.isArray(req.body.technologies) ? req.body.technologies : ['React', 'Node.js'],
      icon: req.body.icon || req.body.logoUrl || '',
      logoUrl: req.body.logoUrl || req.body.icon || '',
      isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
      showPrice: req.body.showPrice !== undefined ? Boolean(req.body.showPrice) : true,
      discountPercent: Number(req.body.discountPercent || 0),
      originalPrice: req.body.originalPrice || '',
      isDiscountActive: req.body.isDiscountActive !== undefined ? Boolean(req.body.isDiscountActive) : false,
      internships: req.body.internships || '5 Internships',
      mockTests: req.body.mockTests || '5 Mock Tests',
      projects: req.body.projects || '5 Projects',
      highlights: Array.isArray(req.body.highlights) ? req.body.highlights : [],
      subtitle: req.body.subtitle || '',
      videoUrl: req.body.videoUrl || '',
      featurePills: Array.isArray(req.body.featurePills) ? req.body.featurePills : [],
      whatYouWillLearn: Array.isArray(req.body.whatYouWillLearn) ? req.body.whatYouWillLearn : [],
      syllabusModules: Array.isArray(req.body.syllabusModules) ? req.body.syllabusModules : [],
      projectsList: Array.isArray(req.body.projectsList) ? req.body.projectsList : [],
      batchClasses: req.body.batchClasses || 'Live + Recorded',
      batchTimings: req.body.batchTimings || 'Morning/Evening',
      batchMode: req.body.batchMode || 'Online / Offline',
      certificateProvided: req.body.certificateProvided || 'Provided'
    });

    broadcastRealtimeEvent('courses', course);

    return res.status(201).json({ success: true, message: 'Course added to MongoDB Atlas', data: course });
  } catch (err) {
    console.error('[courseController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   PUT /api/courses/:id
 * @desc    Updates course details by ID.
 * @access  Admin Private
 */
export const updateCourse = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (Array.isArray(req.body.subCategories) && req.body.subCategories.length > 0) {
      payload.subCat = req.body.subCategories[0];
    }
    const course = await Course.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (course) {
      broadcastRealtimeEvent('courses', course);
      return res.json({ success: true, message: 'Course updated in MongoDB Atlas', data: course });
    }
    return res.status(404).json({ success: false, message: 'Course not found' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   DELETE /api/courses/:id
 * @desc    Deletes a course entry by ID.
 * @access  Admin Private
 */
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    broadcastRealtimeEvent('courses', { id: req.params.id, deleted: true });
    return res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
