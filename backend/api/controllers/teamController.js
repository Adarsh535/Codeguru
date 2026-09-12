/**
 * ============================================================================
 * API CONTROLLER: TEAM CONTROLLER (teamController.js)
 * ============================================================================
 * Handles CodeGuru instructors, mentors, and staff profiles CRUD operations via MongoDB Atlas.
 */

import { Team } from '../../models/Team.js';

/**
 * @route   GET /api/team
 * @desc    Retrieves CodeGuru team members and tech instructors profiles from MongoDB Atlas.
 * @access  Public
 */
export const getTeam = async (req, res) => {
  try {
    const team = await Team.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: team });
  } catch (err) {
    console.error('[teamController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message, data: [] });
  }
};

/**
 * @route   POST /api/team
 * @desc    Creates a new team instructor profile in MongoDB Atlas.
 * @access  Admin Private
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

    return res.status(201).json({ success: true, message: 'Team member added to MongoDB Atlas', data: member });
  } catch (err) {
    console.error('[teamController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   DELETE /api/team/:id
 * @desc    Deletes an instructor profile from MongoDB Atlas by ID.
 * @access  Admin Private
 */
export const deleteTeamMember = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Team member profile deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
