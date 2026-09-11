/**
 * ============================================================================
 * CONTROLLER LAYER: PLACEMENTS MANAGER CONTROLLER (usePlacementsController.js)
 * ============================================================================
 * Custom hook handling business logic for Student Placement Records.
 */

import { useState, useEffect, useCallback } from 'react';
import { adminCmsModel } from '../models/adminCmsModel';

export function usePlacementsController() {
  const [placements, setPlacements] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    company: '',
    package: '',
    role: 'Software Engineer',
    avatarUrl: '',
    course: 'Full Stack Web Development'
  });

  const loadPlacements = useCallback(async () => {
    const data = await adminCmsModel.getPlacements();
    setPlacements(data);
  }, []);

  useEffect(() => {
    loadPlacements();
    const handleRefresh = () => loadPlacements();
    window.addEventListener('codeguru_refresh_all', handleRefresh);
    return () => window.removeEventListener('codeguru_refresh_all', handleRefresh);
  }, [loadPlacements]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const url = await adminCmsModel.uploadFile(file);
    if (url) {
      setFormData(prev => ({ ...prev, avatarUrl: url }));
    }
    setUploading(false);
  };

  const handleCreatePlacement = async (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.company || !formData.package) {
      alert('Please fill student name, company, and package details!');
      return;
    }

    const created = await adminCmsModel.addPlacement(formData);
    if (created) {
      await loadPlacements();
      setShowAddModal(false);
      setFormData({
        studentName: '',
        company: '',
        package: '',
        role: 'Software Engineer',
        avatarUrl: '',
        course: 'Full Stack Web Development'
      });
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    }
  };

  const handleDeletePlacement = async (id) => {
    if (window.confirm('Are you sure you want to delete this placement record?')) {
      await adminCmsModel.deletePlacement(id);
      await loadPlacements();
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    }
  };

  return {
    placements,
    showAddModal,
    setShowAddModal,
    uploading,
    formData,
    setFormData,
    loadPlacements,
    handleAvatarUpload,
    handleCreatePlacement,
    handleDeletePlacement
  };
}
