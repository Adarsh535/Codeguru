/**
 * ============================================================================
 * API CONTROLLER: COURSE CONTROLLER (courseController.js)
 * ============================================================================
 * Manages training courses catalog, course categories, pricing, and curriculum specs.
 */

import { Course } from '../../models/Course.js';
import { getDB, saveDB } from '../../db/jsonStore.js';

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Get All Training Courses
 * --------------------------------------------------------------------------
 * @route   GET /api/courses
 * @desc    Retrieves all available courses catalog from MongoDB or local store.
 * @access  Public
 * @returns {JSON} { success: boolean, data: Array<Object> }
 */
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    if (courses && courses.length > 0) {
      return res.json({ success: true, data: courses });
    }
  } catch (e) {
    console.warn('[courseController Warning] MongoDB error, using JSON store fallback:', e.message);
  }
  const db = getDB();
  res.json({ success: true, data: db.courses || [] });
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Add New Course Catalog Entry
 * --------------------------------------------------------------------------
 * @route   POST /api/courses
 * @desc    Creates a new training course entry.
 * @access  Admin Private
 * @param   {Object} req.body - { title, category, subCat, duration, price, level, badge, description, technologies }
 * @returns {JSON} { success: boolean, message: string, data: Object }
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

    const db = getDB();
    db.courses = [course, ...(db.courses || [])];
    saveDB(db);

    return res.status(201).json({ success: true, message: 'Course added to MongoDB', data: course });
  } catch (err) {
    console.warn('[courseController Warning] Fallback adding course to JSON Store:', err.message);
    const db = getDB();
    const newCourse = {
      id: `c-${Date.now()}`,
      title: req.body.title || 'New Tech Course',
      category: req.body.category || 'coding',
      subCat: req.body.subCat || 'web',
      duration: req.body.duration || '6 Months',
      price: req.body.price || '₹ 24,999',
      level: req.body.level || 'Beginner to Advanced',
      badge: req.body.badge || 'Job Guarantee Batch',
      description: req.body.description || '',
      technologies: Array.isArray(req.body.technologies) ? req.body.technologies : ['React', 'Node.js'],
      createdAt: new Date().toISOString()
    };
    db.courses = [newCourse, ...(db.courses || [])];
    saveDB(db);
    return res.status(201).json({ success: true, message: 'Course added to JSON Store', data: newCourse });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Update Course Details
 * --------------------------------------------------------------------------
 * @route   PUT /api/courses/:id
 * @desc    Updates course details by ID.
 * @access  Admin Private
 * @param   {string} req.params.id - Course MongoDB _id or local ID
 * @returns {JSON} { success: boolean, message: string, data?: Object }
 */
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (course) return res.json({ success: true, message: 'Course updated in MongoDB', data: course });
  } catch (e) {}

  const db = getDB();
  const index = (db.courses || []).findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    db.courses[index] = { ...db.courses[index], ...req.body };
    saveDB(db);
    return res.json({ success: true, message: 'Course updated in JSON Store', data: db.courses[index] });
  }

  res.status(404).json({ success: false, message: 'Course not found' });
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Delete Course
 * --------------------------------------------------------------------------
 * @route   DELETE /api/courses/:id
 * @desc    Deletes a course entry by ID.
 * @access  Admin Private
 * @param   {string} req.params.id - Course MongoDB _id or local ID
 * @returns {JSON} { success: boolean, message: string }
 */
export const deleteCourse = async (req, res) => {
  try {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      await Course.findByIdAndDelete(req.params.id);
    } else {
      await Course.deleteMany({ id: req.params.id });
    }
  } catch (e) {
    console.warn('[courseController Warning] MongoDB delete error:', e.message);
  }

  const db = getDB();
  db.courses = (db.courses || []).filter(c => c.id !== req.params.id && c._id?.toString() !== req.params.id);
  saveDB(db);

  res.json({ success: true, message: 'Course deleted successfully' });
};
