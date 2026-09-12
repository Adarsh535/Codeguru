/**
 * ============================================================================
 * API CONTROLLER: COURSE CONTROLLER (courseController.js)
 * ============================================================================
 * Manages training courses catalog, course categories, pricing, and curriculum specs via MongoDB Atlas.
 */

import { Course } from '../../models/Course.js';

/**
 * @route   GET /api/courses
 * @desc    Retrieves all available courses catalog from MongoDB Atlas.
 * @access  Public
 */
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
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
    const course = await Course.create({
      title: req.body.title || 'New Tech Course',
      category: req.body.category || 'coding',
      subCat: req.body.subCat || 'web',
      duration: req.body.duration || '6 Months',
      price: req.body.price || '₹ 24,999',
      level: req.body.level || 'Beginner to Advanced',
      badge: req.body.badge || 'Job Guarantee Batch',
      description: req.body.description || '',
      technologies: Array.isArray(req.body.technologies) ? req.body.technologies : ['React', 'Node.js']
    });

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
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (course) return res.json({ success: true, message: 'Course updated in MongoDB Atlas', data: course });
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
    return res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
