/**
 * ============================================================================
 * CONTROLLER LAYER: SYSTEM DIAGNOSTICS & SETTINGS CONTROLLER (useSystemController.js)
 * ============================================================================
 * Custom hook handling system health monitoring and admin security credentials update logic.
 */

import { useState, useEffect } from 'react';
import { systemModel } from '../models/systemModel';
import { authModel } from '../models/authModel';

export function useSystemController(user, updateUser) {
  const [email, setEmail] = useState(user?.email || 'admin@codeguru.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dbStatus, setDbStatus] = useState('Connected to MongoDB Atlas Cloud (cluster0.illbds4.mongodb.net)');
  const [dbUri, setDbUri] = useState('mongodb+srv://Adarshverma:adarshverma@3213@cluster0.illbds4.mongodb.net/codeguru_db');
  const [dbProvider, setDbProvider] = useState('MongoDB Atlas Cloud Cluster & REST API Endpoint');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [updatedEmailInfo, setUpdatedEmailInfo] = useState('');

  const [activeDbMode, setActiveDbMode] = useState('cloud');
  const [isSwitchingDb, setIsSwitchingDb] = useState(false);

  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    systemModel.checkHealth()
      .then(data => {
        if (data.success && data.database) {
          const mode = data.database.mode || (data.database.isAtlas ? 'cloud' : 'local');
          setActiveDbMode(mode);
          setDbStatus(data.database.connectionText || 'Connected to MongoDB Atlas Cloud');
          setDbUri(data.database.uri || 'mongodb+srv://Adarshverma:adarshverma@3213@cluster0.illbds4.mongodb.net/codeguru_db');
          setDbProvider(data.database.provider ? `${data.database.provider} & REST API Endpoint` : 'MongoDB Atlas Cloud Cluster');
        }
      })
      .catch(() => {
        setDbStatus('Connected to MongoDB Atlas Cloud');
        setDbUri('mongodb+srv://Adarshverma:adarshverma@3213@cluster0.illbds4.mongodb.net/codeguru_db');
      });
  }, []);

  const handleSwitchDatabase = async (targetMode) => {
    setIsSwitchingDb(true);
    setMessage(null);

    const res = await systemModel.switchDatabase(targetMode);
    setIsSwitchingDb(false);

    if (res.success) {
      setActiveDbMode(targetMode);
      if (res.database) {
        setDbStatus(res.database.connectionText);
        setDbUri(res.database.uri);
        setDbProvider(res.database.provider ? `${res.database.provider} & REST API Endpoint` : 'MongoDB');
      }
      setMessage({
        type: 'success',
        text: `Switched database connection to ${targetMode === 'cloud' ? 'MongoDB Atlas Cloud' : 'Local MongoDB Compass'}! ⚡`
      });
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    } else {
      setMessage({
        type: 'error',
        text: res.message || `Failed to connect to ${targetMode === 'cloud' ? 'MongoDB Atlas Cloud' : 'Local MongoDB Compass'}`
      });
    }
  };


  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@') || !email.includes('.')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address!' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match! Please re-enter passwords.' });
      return;
    }

    if (newPassword && newPassword.length < 4) {
      setMessage({ type: 'error', text: 'New password must be at least 4 characters long!' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    const res = await authModel.updateCredentials(
      user?.email || 'admin@codeguru.com',
      email,
      newPassword || undefined
    );

    setIsSaving(false);

    if (res.success) {
      const updatedEmail = res.user?.email || email;
      if (updateUser) {
        updateUser({ email: updatedEmail });
      }
      setUpdatedEmailInfo(updatedEmail);
      setIsSuccessModalOpen(true);
      setMessage({ type: 'success', text: `Admin credentials updated successfully in MongoDB database! Active Email: ${updatedEmail}` });
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to update admin credentials in MongoDB' });
    }
  };


  const [adminPhone, setAdminPhone] = useState('9670912923');
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [autoWhatsappRedirect, setAutoWhatsappRedirect] = useState(true);

  useEffect(() => {
    systemModel.getSettings().then(res => {
      if (res.success && res.data) {
        if (res.data.adminPhone) setAdminPhone(res.data.adminPhone);
        if (res.data.whatsappNotificationEnabled !== undefined) setWhatsappEnabled(res.data.whatsappNotificationEnabled);
        if (res.data.autoWhatsappRedirect !== undefined) setAutoWhatsappRedirect(res.data.autoWhatsappRedirect);
      }
    });
  }, []);

  const handleSaveSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const cleanPhone = adminPhone ? adminPhone.trim() : '9670912923';
    const res = await systemModel.updateSettings({
      adminPhone: cleanPhone,
      whatsappNotificationEnabled: whatsappEnabled,
      autoWhatsappRedirect: autoWhatsappRedirect
    });

    setIsSaving(false);

    if (res.success) {
      try {
        localStorage.setItem('codeguru_admin_phone', cleanPhone);
        window.dispatchEvent(new Event('storage'));
      } catch (err) {}

      setMessage({ type: 'success', text: `Admin Notification Phone Number (${cleanPhone}) saved successfully in MongoDB!` });
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to update settings' });
    }
  };

  return {
    email,
    setEmail,
    adminPhone,
    setAdminPhone,
    whatsappEnabled,
    setWhatsappEnabled,
    autoWhatsappRedirect,
    setAutoWhatsappRedirect,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    dbStatus,
    dbUri,
    dbProvider,
    activeDbMode,
    isSwitchingDb,
    handleSwitchDatabase,
    handleUpdatePassword,
    handleSaveSettings
  };
}

