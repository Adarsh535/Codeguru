/**
 * ============================================================================
 * API CONTROLLER: NAV MENU CONTROLLER (navMenuController.js)
 * ============================================================================
 * Handles header dynamic navigation menus and category links logic via MongoDB Atlas.
 */

import { NavMenu } from '../../models/NavMenu.js';

/**
 * @route   GET /api/navmenus
 * @desc    Retrieves dynamic header navigation menus catalog.
 * @access  Public
 */
export const getNavMenus = async (req, res) => {
  try {
    const menus = await NavMenu.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: menus });
  } catch (err) {
    console.error('[navMenuController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message, data: [] });
  }
};

/**
 * @route   POST /api/navmenus
 * @desc    Adds a new dynamic navbar navigation menu item.
 * @access  Admin Private
 */
export const addNavMenu = async (req, res) => {
  try {
    const menu = await NavMenu.create(req.body);
    return res.status(201).json({ success: true, message: 'NavMenu added to MongoDB Atlas', data: menu });
  } catch (err) {
    console.error('[navMenuController Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   DELETE /api/navmenus/:id
 * @desc    Deletes a navbar menu item by ID.
 * @access  Admin Private
 */
export const deleteNavMenu = async (req, res) => {
  try {
    await NavMenu.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'NavMenu deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
