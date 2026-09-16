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
  const [editingPlacementId, setEditingPlacementId] = useState(null);
  const [uploadingStudent, setUploadingStudent] = useState(false);
  const [uploadingCompany, setUploadingCompany] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    package: '',
    role: 'Software Engineer',
    photo: '',
    companyLogo: '',
    college: ''
  });

  const loadPlacements = useCallback(async () => {
    const data = await adminCmsModel.getPlacements();
    setPlacements(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    loadPlacements();
    const handleRefresh = () => loadPlacements();
    window.addEventListener('codeguru_refresh_all', handleRefresh);
    return () => window.removeEventListener('codeguru_refresh_all', handleRefresh);
  }, [loadPlacements]);

  const handleOpenAddModal = () => {
    setEditingPlacementId(null);
    setFormData({
      name: '',
      company: '',
      package: '',
      role: 'Software Engineer',
      photo: '',
      companyLogo: '',
      college: ''
    });
    setShowAddModal(true);
  };

  const handleEditPlacement = (item) => {
    setEditingPlacementId(item._id || item.id);
    setFormData({
      name: item.name || item.studentName || '',
      company: item.company || '',
      package: item.package || '',
      role: item.role || 'Software Engineer',
      photo: item.photo || item.avatarUrl || '',
      companyLogo: item.companyLogo || '',
      college: item.college || ''
    });
    setShowAddModal(true);
  };

  const handleStudentPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingStudent(true);
    const url = await adminCmsModel.uploadFile(file);
    if (url) {
      setFormData(prev => ({ ...prev, photo: url }));
    } else {
      alert('Failed to upload student photo to Cloudinary.');
    }
    setUploadingStudent(false);
  };

  const handleCompanyLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCompany(true);
    const url = await adminCmsModel.uploadFile(file);
    if (url) {
      setFormData(prev => ({ ...prev, companyLogo: url }));
    } else {
      alert('Failed to upload company logo to Cloudinary.');
    }
    setUploadingCompany(false);
  };

  const handleCreatePlacement = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.package) {
      alert('Please fill student name, company, and package details!');
      return;
    }

    const payload = {
      name: formData.name,
      studentName: formData.name,
      company: formData.company,
      companyLogo: formData.companyLogo || '',
      role: formData.role || 'Software Engineer',
      package: formData.package,
      photo: formData.photo || '',
      college: formData.college || 'CodeGuru Academy'
    };

    let result = null;
    if (editingPlacementId) {
      result = await adminCmsModel.updatePlacement(editingPlacementId, payload);
    } else {
      result = await adminCmsModel.addPlacement(payload);
    }

    if (result) {
      await loadPlacements();
      setShowAddModal(false);
      setEditingPlacementId(null);
      setFormData({
        name: '',
        company: '',
        package: '',
        role: 'Software Engineer',
        photo: '',
        companyLogo: '',
        college: ''
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
    editingPlacementId,
    handleOpenAddModal,
    handleEditPlacement,
    uploadingStudent,
    uploadingCompany,
    formData,
    setFormData,
    loadPlacements,
    handleStudentPhotoUpload,
    handleCompanyLogoUpload,
    handleCreatePlacement,
    handleDeletePlacement
  };
}
