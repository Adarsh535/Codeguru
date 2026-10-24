/**
 * ============================================================================
 * CONTROLLER: SYSTEM SETTINGS (settingsController.js)
 * ============================================================================
 * Handles fetching and updating dynamic system configuration in MongoDB.
 */

import { Settings } from '../../models/Settings.js';
import { recordAuditLog } from '../../services/auditService.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        adminPhone: '9670912923',
        adminEmail: 'info@codegurru.in',
        siteTitle: 'CodeGurru Student Placement & Learning Platform',
        whatsappNotificationEnabled: true,
        autoWhatsappRedirect: true,
        showMyBatchNav: true
      });
    }
    // Public callers must not receive admin contact PII; only authenticated
    // admins (req.admin set by requireAdmin on /admin/settings) get the full doc.
    if (!req.admin) {
      const obj = settings.toObject ? settings.toObject() : { ...settings };
      delete obj.adminPhone;
      delete obj.adminEmail;
      return res.status(200).json({ success: true, data: obj });
    }
    return res.status(200).json({ success: true, data: settings });
  } catch (err) {
    console.error('Error fetching settings:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      data: { whatsappNotificationEnabled: true, showMyBatchNav: true }
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { adminPhone, adminEmail, siteTitle, whatsappNotificationEnabled, autoWhatsappRedirect, showMyBatchNav } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    if (adminPhone !== undefined) settings.adminPhone = adminPhone.trim();
    if (adminEmail !== undefined) settings.adminEmail = adminEmail.trim();
    if (siteTitle !== undefined) settings.siteTitle = siteTitle.trim();
    if (whatsappNotificationEnabled !== undefined) settings.whatsappNotificationEnabled = whatsappNotificationEnabled;
    if (autoWhatsappRedirect !== undefined) settings.autoWhatsappRedirect = autoWhatsappRedirect;
    if (showMyBatchNav !== undefined) settings.showMyBatchNav = Boolean(showMyBatchNav);

    await settings.save();

    // Record immutable audit log: Who (kisne), What (kya), When (kab)
    await recordAuditLog({
      action: 'SETTINGS_UPDATE',
      admin: req.admin,
      targetType: 'Settings',
      targetId: settings._id,
      details: {
        updatedFields: Object.keys(req.body)
      },
      req
    });

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
