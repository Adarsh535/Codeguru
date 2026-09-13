/**
 * ============================================================================
 * CONTROLLER LAYER: TEAM MANAGER CONTROLLER (useTeamController.js)
 * ============================================================================
 * Custom hook handling business logic for CodeGuru Team & Instructors.
 */

import { useState, useEffect, useCallback } from 'react';
import { adminCmsModel } from '../models/adminCmsModel';

export function useTeamController() {
  const [team, setTeam] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Senior Instructor',
    bio: '',
    photoUrl: '',
    experience: '8+ Years Exp'
  });

  const loadTeam = useCallback(async () => {
    const data = await adminCmsModel.getTeam();
    setTeam(data);
  }, []);

  useEffect(() => {
    loadTeam();
    const handleRefresh = () => loadTeam();
    window.addEventListener('codeguru_refresh_all', handleRefresh);
    return () => window.removeEventListener('codeguru_refresh_all', handleRefresh);
  }, [loadTeam]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const url = await adminCmsModel.uploadFile(file);
    if (url) {
      setFormData(prev => ({ ...prev, photoUrl: url }));
    } else {
      alert('Failed to upload instructor photo to Cloudinary.');
    }
    setUploading(false);
  };

  const handleCreateTeamMember = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      alert('Please enter instructor name and role!');
      return;
    }

    const created = await adminCmsModel.addTeamMember(formData);
    if (created) {
      await loadTeam();
      setShowAddModal(false);
      setFormData({
        name: '',
        role: 'Senior Instructor',
        bio: '',
        photoUrl: '',
        experience: '8+ Years Exp'
      });
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      await adminCmsModel.deleteTeamMember(id);
      await loadTeam();
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    }
  };

  return {
    team,
    showAddModal,
    setShowAddModal,
    uploading,
    formData,
    setFormData,
    loadTeam,
    handlePhotoUpload,
    handleCreateTeamMember,
    handleDeleteTeamMember
  };
}
