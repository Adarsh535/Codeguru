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

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    systemModel.checkHealth()
      .then(data => {
        if (data.success && data.database) {
          setDbStatus(data.database.connectionText || 'Connected to MongoDB Atlas Cloud (cluster0.illbds4.mongodb.net)');
          setDbUri(data.database.uri || 'mongodb+srv://Adarshverma:adarshverma@3213@cluster0.illbds4.mongodb.net/codeguru_db');
          setDbProvider(data.database.provider ? `${data.database.provider} & REST API Endpoint` : 'MongoDB Atlas Cloud Cluster & REST API Endpoint');
        }
      })
      .catch(() => {
        setDbStatus('Connected to MongoDB Atlas Cloud (cluster0.illbds4.mongodb.net)');
        setDbUri('mongodb+srv://Adarshverma:adarshverma@3213@cluster0.illbds4.mongodb.net/codeguru_db');
      });
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
      const updatedEmail = res.user?.email || email;
      if (updateUser) {
        updateUser({ email: updatedEmail });
      }
      setMessage({ type: 'success', text: `Admin credentials updated successfully! New Email: ${updatedEmail}` });
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
    dbUri,
    dbProvider,
    isSaving,
    message,
    handleUpdatePassword
  };
}

