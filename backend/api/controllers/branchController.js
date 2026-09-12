/**
 * ============================================================================
 * API CONTROLLER: BRANCH CONTROLLER (branchController.js)
 * ============================================================================
 * Handles regional campuses & branch office directories CRUD operations via MongoDB Atlas.
 */

import { Branch } from '../../models/Branch.js';

/**
 * @route   GET /api/branches
 * @desc    Retrieves CodeGuru regional training branches and campuses.
 * @access  Public
 */
export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: branches });
  } catch (err) {
    console.error('[branchController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message, data: [] });
  }
};

/**
 * @route   POST /api/branches
 * @desc    Registers a new training campus/branch location.
 * @access  Admin Private
 */
export const addBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    return res.status(201).json({ success: true, message: 'Branch added to MongoDB Atlas', data: branch });
  } catch (err) {
    console.error('[branchController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   DELETE /api/branches/:id
 * @desc    Deletes a branch location by ID.
 * @access  Admin Private
 */
export const deleteBranch = async (req, res) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Branch deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
