/**
 * ============================================================================
 * API CONTROLLER: PLACEMENT CONTROLLER (placementController.js)
 * ============================================================================
 * Handles student placement drive records, packages (CTC), company logos,
 * and star achievers poster CRUD operations via MongoDB Atlas.
 */

import { Placement } from '../../models/Placement.js';

/**
 * @route   GET /api/placements
 * @desc    Retrieves all student placement drive records sorted newest first.
 * @access  Public
 */
export const getPlacements = async (req, res) => {
  try {
    const placements = await Placement.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: placements });
  } catch (err) {
    console.error('[placementController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message, data: [] });
  }
};

/**
 * @route   POST /api/placements
 * @desc    Adds a new placed student achiever record in MongoDB Atlas.
 * @access  Admin Private
 */
export const addPlacement = async (req, res) => {
  try {
    const placement = await Placement.create({
      name: req.body.name || req.body.studentName || 'Star Student Achiever',
      studentName: req.body.studentName || req.body.name || 'Star Student Achiever',
      company: req.body.company || 'Top Tech Company',
      companyLogo: req.body.companyLogo || '',
      role: req.body.role || 'Software Engineer',
      package: req.body.package || '12.0 LPA',
      photo: req.body.photo || req.body.avatarUrl || '',
      batch: req.body.batch || 'PLACEMENT BATCH 2026'
    });

    return res.status(201).json({ success: true, message: 'Placement recorded in MongoDB Atlas', data: placement });
  } catch (err) {
    console.error('[placementController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   DELETE /api/placements/:id
 * @desc    Deletes a placement record from MongoDB Atlas by ID.
 * @access  Admin Private
 */
export const deletePlacement = async (req, res) => {
  try {
    await Placement.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Placement record deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
