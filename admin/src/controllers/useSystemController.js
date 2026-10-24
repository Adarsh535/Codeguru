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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dbStatus, setDbStatus] = useState('Checking database connection...');
  const [dbConnected, setDbConnected] = useState(true);
  const [dbUri, setDbUri] = useState('Database: connected (Cloud Atlas Managed Cluster)');
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
        if (data.connected) {
          setDbConnected(true);
          setDbStatus('Connected to MongoDB Atlas Cloud');
          setDbUri('Database: connected (Cloud Atlas Managed Cluster)');
        } else {
          setDbConnected(false);
          setDbStatus('Database: disconnected');
          setDbUri('Database: disconnected');
        }
      })
      .catch(() => {
        setDbConnected(false);
        setDbStatus('Database: disconnected');
        setDbUri('Database: disconnected');
      });
  }, []);

  const handleSwitchDatabase = async (targetMode) => {
    setMessage({
      type: 'info',
      text: 'Database configuration is managed securely via environment settings.'
    });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@') || !email.includes('.')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address!' });
      return;
    }

    if (!currentPassword) {
      setMessage({ type: 'error', text: 'Please enter your current password to authorize changes.' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match! Please re-enter.' });
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long!' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    const res = await authModel.updateCredentials(
      currentPassword,
      email,
      newPassword || undefined
    );

    setIsSaving(false);

    if (res.success) {
      const updatedEmail = res.user?.email || email;
      if (updateUser) {
        updateUser({ email: updatedEmail, ...(res.token ? { token: res.token } : {}) });
      }
      setUpdatedEmailInfo(updatedEmail);
      setIsSuccessModalOpen(true);
      setMessage({ type: 'success', text: `Admin credentials updated successfully! Active Email: ${updatedEmail}` });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to update admin credentials' });
    }
  };

  const [adminPhone, setAdminPhone] = useState('9670912923');
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [autoWhatsappRedirect, setAutoWhatsappRedirect] = useState(true);

  useEffect(() => {
    systemModel.getSettings().then(res => {
      if (res && res.success && res.data) {
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

    if (res && res.success) {
      setMessage({ type: 'success', text: `Admin Notification Settings saved successfully!` });
    } else {
      setMessage({ type: 'error', text: res?.message || 'Failed to update settings' });
    }
  };

  return {
    email,
    setEmail,
    currentPassword,
    setCurrentPassword,
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
    dbConnected,
    dbUri,
    dbProvider,
    activeDbMode,
    isSwitchingDb,
    handleSwitchDatabase,
    handleUpdatePassword,
    handleSaveSettings,
    isSaving,
    message,
    isSuccessModalOpen,
    closeSuccessModal,
    updatedEmailInfo
  };
}
