/**
 * ============================================================================
 * API CONTROLLER: BRANCH CONTROLLER (branchController.js)
 * ============================================================================
 * Handles regional campuses & branch office directories CRUD operations.
 */

import { Branch } from '../../models/Branch.js';
import { getDB, saveDB } from '../../db/jsonStore.js';

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Get All Branch Locations
 * --------------------------------------------------------------------------
 * @route   GET /api/branches
 * @desc    Retrieves CodeGuru regional training branches and campuses.
 * @access  Public
 * @returns {JSON} { success: boolean, data: Array<Object> }
 */
export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    if (branches && branches.length > 0) {
      return res.json({ success: true, data: branches });
    }
  } catch (e) {
    console.warn('[branchController Warning] MongoDB query error:', e.message);
  }
  const db = getDB();
  res.json({ success: true, data: db.branches || [] });
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Add New Branch
 * --------------------------------------------------------------------------
 * @route   POST /api/branches
 * @desc    Registers a new training campus/branch location.
 * @access  Admin Private
 * @param   {Object} req.body - { title, address, category, phone, email }
 * @returns {JSON} { success: boolean, message: string, data: Object }
 */
export const addBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    const db = getDB();
    db.branches = [branch, ...(db.branches || [])];
    saveDB(db);
    return res.status(201).json({ success: true, message: 'Branch added to MongoDB', data: branch });
  } catch (err) {
    const db = getDB();
    const newBranch = { id: `br-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
    db.branches = [newBranch, ...(db.branches || [])];
    saveDB(db);
    return res.status(201).json({ success: true, message: 'Branch added to JSON Store', data: newBranch });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Delete Branch Location
 * --------------------------------------------------------------------------
 * @route   DELETE /api/branches/:id
 * @desc    Deletes a branch location by ID.
 * @access  Admin Private
 * @param   {string} req.params.id - Branch MongoDB _id
 * @returns {JSON} { success: boolean, message: string }
 */
export const deleteBranch = async (req, res) => {
  try {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      await Branch.findByIdAndDelete(req.params.id);
    }
  } catch (e) {
    console.warn('[branchController Warning] MongoDB delete error:', e.message);
  }
  const db = getDB();
  db.branches = (db.branches || []).filter(b => b.id !== req.params.id && b._id?.toString() !== req.params.id);
  saveDB(db);
  res.json({ success: true, message: 'Branch deleted successfully' });
};
