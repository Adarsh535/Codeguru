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
  const [editingTeamId, setEditingTeamId] = useState(null);
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
    window.addEventListener('codeguru_refresh_team', handleRefresh);
    window.addEventListener('focus', handleRefresh);

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        loadTeam();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('codeguru_refresh_all', handleRefresh);
      window.removeEventListener('codeguru_refresh_team', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
    };
  }, [loadTeam]);

  const handleOpenAddModal = () => {
    setEditingTeamId(null);
    setFormData({
      name: '',
      role: 'Senior Instructor',
      bio: '',
      photoUrl: '',
      experience: '8+ Years Exp'
    });
    setShowAddModal(true);
  };

  const handleEditTeamMember = (member) => {
    setEditingTeamId(member._id || member.id);
    setFormData({
      name: member.name || '',
      role: member.role || 'Senior Instructor',
      bio: member.bio || '',
      photoUrl: member.photoUrl || member.photo || '',
      experience: member.experience || '8+ Years Exp'
    });
    setShowAddModal(true);
  };

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

    const payload = {
      ...formData,
      photo: formData.photoUrl
    };

    let result = null;
    if (editingTeamId) {
      result = await adminCmsModel.updateTeamMember(editingTeamId, payload);
    } else {
      result = await adminCmsModel.addTeamMember(payload);
    }

    if (result) {
      await loadTeam();
      setShowAddModal(false);
      setEditingTeamId(null);
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
    editingTeamId,
    handleOpenAddModal,
    handleEditTeamMember,
    uploading,
    formData,
    setFormData,
    loadTeam,
    handlePhotoUpload,
    handleCreateTeamMember,
    handleDeleteTeamMember
  };
}
