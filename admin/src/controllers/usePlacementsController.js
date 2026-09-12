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

  const handleStudentPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingStudent(true);
    const url = await adminCmsModel.uploadFile(file);
    if (url) {
      setFormData(prev => ({ ...prev, photo: url }));
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

    const created = await adminCmsModel.addPlacement(payload);
    if (created) {
      await loadPlacements();
      setShowAddModal(false);
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
