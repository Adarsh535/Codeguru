/**
 * ============================================================================
 * CONTROLLER: SYSTEM SETTINGS (settingsController.js)
 * ============================================================================
 * Handles fetching and updating dynamic system configuration in MongoDB.
 */

import { Settings } from '../../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        adminPhone: '9670912923',
        adminEmail: 'admin@codeguru.com',
        siteTitle: 'CodeGuru Student Placement & Learning Platform',
        whatsappNotificationEnabled: true,
        autoWhatsappRedirect: true
      });
    }
    return res.status(200).json({ success: true, data: settings });
  } catch (err) {
    console.error('Error fetching settings:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch settings',
      data: { adminPhone: '9670912923', whatsappNotificationEnabled: true } 
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { adminPhone, adminEmail, siteTitle, whatsappNotificationEnabled, autoWhatsappRedirect } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    if (adminPhone !== undefined) settings.adminPhone = adminPhone.trim();
    if (adminEmail !== undefined) settings.adminEmail = adminEmail.trim();
    if (siteTitle !== undefined) settings.siteTitle = siteTitle.trim();
    if (whatsappNotificationEnabled !== undefined) settings.whatsappNotificationEnabled = whatsappNotificationEnabled;
    if (autoWhatsappRedirect !== undefined) settings.autoWhatsappRedirect = autoWhatsappRedirect;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'System settings updated successfully in MongoDB Atlas',
      data: settings
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};
