/**
 * ============================================================================
 * API CONTROLLER: TEAM CONTROLLER (teamController.js)
 * ============================================================================
 * Handles CodeGuru instructors, mentors, and staff profiles CRUD operations.
 */

import { Team } from '../../models/Team.js';
import { getDB, saveDB } from '../../db/jsonStore.js';

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Get All Team Members & Instructors
 * --------------------------------------------------------------------------
 * @route   GET /api/team
 * @desc    Retrieves CodeGuru team members and tech instructors profiles.
 * @access  Public
 * @returns {JSON} { success: boolean, data: Array<Object> }
 */
export const getTeam = async (req, res) => {
  try {
    const team = await Team.find().sort({ createdAt: -1 });
    if (team && team.length > 0) {
      return res.json({ success: true, data: team });
    }
  } catch (e) {
    console.warn('[teamController Warning] MongoDB query error:', e.message);
  }
  const db = getDB();
  res.json({ success: true, data: db.team || [] });
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Add New Team Member
 * --------------------------------------------------------------------------
 * @route   POST /api/team
 * @desc    Creates a new team instructor profile.
 * @access  Admin Private
 * @param   {Object} req.body - { name, role, photo, photoUrl, experience, bio }
 * @returns {JSON} { success: boolean, message: string, data: Object }
 */
export const addTeamMember = async (req, res) => {
  try {
    const member = await Team.create({
      name: req.body.name || 'Senior Instructor',
      role: req.body.role || 'Tech Mentor',
      photo: req.body.photo || req.body.photoUrl || '',
      experience: req.body.experience || '8+ Yrs Exp',
      bio: req.body.bio || 'CodeGuru Master Educator'
    });

    const db = getDB();
    db.team = [member, ...(db.team || [])];
    saveDB(db);

    return res.status(201).json({ success: true, message: 'Team member added to MongoDB', data: member });
  } catch (err) {
    console.warn('[teamController Warning] Fallback adding team member to JSON Store:', err.message);
    const db = getDB();
    const newMember = {
      id: `t-${Date.now()}`,
      name: req.body.name || 'Senior Instructor',
      role: req.body.role || 'Tech Mentor',
      photo: req.body.photo || req.body.photoUrl || '',
      experience: req.body.experience || '8+ Yrs Exp',
      bio: req.body.bio || 'CodeGuru Master Educator',
      createdAt: new Date().toISOString()
    };
    db.team = [newMember, ...(db.team || [])];
    saveDB(db);
    return res.status(201).json({ success: true, message: 'Team member saved to JSON Store', data: newMember });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Delete Team Member
 * --------------------------------------------------------------------------
 * @route   DELETE /api/team/:id
 * @desc    Deletes an instructor profile by ID.
 * @access  Admin Private
 * @param   {string} req.params.id - Team MongoDB _id or local ID
 * @returns {JSON} { success: boolean, message: string }
 */
export const deleteTeamMember = async (req, res) => {
  try {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      await Team.findByIdAndDelete(req.params.id);
    } else {
      await Team.deleteMany({ id: req.params.id });
    }
  } catch (e) {
    console.warn('[teamController Warning] MongoDB delete error:', e.message);
  }

  const db = getDB();
  db.team = (db.team || []).filter(t => t.id !== req.params.id && t._id?.toString() !== req.params.id);
  saveDB(db);

  res.json({ success: true, message: 'Team member profile deleted successfully' });
};
