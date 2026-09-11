/**
 * ============================================================================
 * CONTROLLER LAYER: SYSTEM DIAGNOSTICS & SETTINGS CONTROLLER (useSystemController.js)
 * ============================================================================
 * Custom hook handling system health monitoring and admin security credentials update logic.
 */

import { useState, useEffect } from 'react';
import { systemModel } from '../models/systemModel';
import { authModel } from '../models/authModel';

export function useSystemController(user) {
  const [email, setEmail] = useState(user?.email || 'admin@codeguru.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dbStatus, setDbStatus] = useState('Checking database connection...');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    systemModel.checkHealth()
      .then(data => {
        if (data.success) {
          setDbStatus('Connected to MongoDB Compass (codeguru_db)');
        } else {
          setDbStatus('Local JSON Fallback active');
        }
      })
      .catch(() => setDbStatus('Offline / Local Storage Mode'));
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
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
      setMessage({ type: 'success', text: 'Admin credentials saved successfully in MongoDB database!' });
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to update admin credentials' });
    }
  };

  return {
    email,
    setEmail,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    dbStatus,
    isSaving,
    message,
    handleUpdatePassword
  };
}
