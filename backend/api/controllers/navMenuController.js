/**
 * ============================================================================
 * API CONTROLLER: NAV MENU CONTROLLER (navMenuController.js)
 * ============================================================================
 * Handles header dynamic navigation menus and category links logic.
 */

import { NavMenu } from '../../models/NavMenu.js';
import { getDB, saveDB } from '../../db/jsonStore.js';

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Get All Navigation Menus
 * --------------------------------------------------------------------------
 * @route   GET /api/navmenus
 * @desc    Retrieves dynamic header navigation menus catalog.
 * @access  Public
 * @returns {JSON} { success: boolean, data: Array<Object> }
 */
export const getNavMenus = async (req, res) => {
  try {
    const menus = await NavMenu.find().sort({ createdAt: -1 });
    if (menus && menus.length > 0) {
      return res.json({ success: true, data: menus });
    }
  } catch (e) {
    console.warn('[navMenuController Warning] MongoDB query error:', e.message);
  }
  const db = getDB();
  res.json({ success: true, data: db.navmenus || [] });
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Add Navigation Menu Category
 * --------------------------------------------------------------------------
 * @route   POST /api/navmenus
 * @desc    Adds a new dynamic navbar navigation menu item.
 * @access  Admin Private
 * @param   {Object} req.body - { menuId, name, category, icon, items }
 * @returns {JSON} { success: boolean, message: string, data: Object }
 */
export const addNavMenu = async (req, res) => {
  try {
    const menu = await NavMenu.create(req.body);
    const db = getDB();
    db.navmenus = [menu, ...(db.navmenus || [])];
    saveDB(db);
    return res.status(201).json({ success: true, message: 'NavMenu added to MongoDB', data: menu });
  } catch (err) {
    const db = getDB();
    const newMenu = { id: `nav-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
    db.navmenus = [newMenu, ...(db.navmenus || [])];
    saveDB(db);
    return res.status(201).json({ success: true, message: 'NavMenu added to JSON Store', data: newMenu });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Delete Navigation Menu
 * --------------------------------------------------------------------------
 * @route   DELETE /api/navmenus/:id
 * @desc    Deletes a navbar menu item by ID.
 * @access  Admin Private
 * @param   {string} req.params.id - NavMenu MongoDB _id
 * @returns {JSON} { success: boolean, message: string }
 */
export const deleteNavMenu = async (req, res) => {
  try {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      await NavMenu.findByIdAndDelete(req.params.id);
    }
  } catch (e) {
    console.warn('[navMenuController Warning] MongoDB delete error:', e.message);
  }
  const db = getDB();
  db.navmenus = (db.navmenus || []).filter(n => n.id !== req.params.id && n._id?.toString() !== req.params.id);
  saveDB(db);
  res.json({ success: true, message: 'NavMenu deleted successfully' });
};
