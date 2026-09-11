/**
 * ============================================================================
 * API CONTROLLER: PLACEMENT CONTROLLER (placementController.js)
 * ============================================================================
 * Handles student placement drive records, packages (CTC), company logos,
 * and star achievers poster CRUD operations.
 */

import { Placement } from '../../models/Placement.js';
import { getDB, saveDB } from '../../db/jsonStore.js';

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Get All Student Placements
 * --------------------------------------------------------------------------
 * @route   GET /api/placements
 * @desc    Retrieves all student placement drive records sorted newest first.
 * @access  Public
 * @returns {JSON} { success: boolean, data: Array<Object> }
 */
export const getPlacements = async (req, res) => {
  try {
    const placements = await Placement.find().sort({ createdAt: -1 });
    if (placements && placements.length > 0) {
      return res.json({ success: true, data: placements });
    }
  } catch (e) {
    console.warn('[placementController Warning] MongoDB query error:', e.message);
  }
  const db = getDB();
  res.json({ success: true, data: db.placements || [] });
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Add New Placement Record
 * --------------------------------------------------------------------------
 * @route   POST /api/placements
 * @desc    Adds a new placed student achiever record.
 * @access  Admin Private
 * @param   {Object} req.body - { name, studentName, company, companyLogo, role, package, photo, avatarUrl, batch }
 * @returns {JSON} { success: boolean, message: string, data: Object }
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

    const db = getDB();
    db.placements = [placement, ...(db.placements || [])];
    saveDB(db);

    return res.status(201).json({ success: true, message: 'Placement recorded in MongoDB', data: placement });
  } catch (err) {
    console.warn('[placementController Warning] Fallback adding placement to JSON Store:', err.message);
    const db = getDB();
    const newPlacement = {
      id: `p-${Date.now()}`,
      name: req.body.name || req.body.studentName || 'Star Student Achiever',
      studentName: req.body.studentName || req.body.name || 'Star Student Achiever',
      company: req.body.company || 'Top Tech Company',
      companyLogo: req.body.companyLogo || '',
      role: req.body.role || 'Software Engineer',
      package: req.body.package || '12.0 LPA',
      photo: req.body.photo || req.body.avatarUrl || '',
      batch: req.body.batch || 'PLACEMENT BATCH 2026',
      createdAt: new Date().toISOString()
    };
    db.placements = [newPlacement, ...(db.placements || [])];
    saveDB(db);
    return res.status(201).json({ success: true, message: 'Placement saved to JSON Store', data: newPlacement });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Delete Placement Record
 * --------------------------------------------------------------------------
 * @route   DELETE /api/placements/:id
 * @desc    Deletes a placement record by ID.
 * @access  Admin Private
 * @param   {string} req.params.id - Placement MongoDB _id or local ID
 * @returns {JSON} { success: boolean, message: string }
 */
export const deletePlacement = async (req, res) => {
  try {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      await Placement.findByIdAndDelete(req.params.id);
    } else {
      await Placement.deleteMany({ id: req.params.id });
    }
  } catch (e) {
    console.warn('[placementController Warning] MongoDB delete error:', e.message);
  }

  const db = getDB();
  db.placements = (db.placements || []).filter(p => p.id !== req.params.id && p._id?.toString() !== req.params.id);
  saveDB(db);

  res.json({ success: true, message: 'Placement record deleted successfully' });
};
