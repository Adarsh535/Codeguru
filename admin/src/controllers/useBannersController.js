/**
 * ============================================================================
 * CONTROLLER LAYER: BANNERS MANAGER CONTROLLER (useBannersController.js)
 * ============================================================================
 * Custom hook handling business logic for Hero Banner CMS Management.
 */

import { useState, useEffect, useCallback } from 'react';
import { adminCmsModel } from '../models/adminCmsModel';

export function useBannersController() {
  const [banners, setBanners] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: 'image',
    badge: 'TOP PLACEMENT DRIVES 2026',
    ctaText: 'Explore Courses',
    mediaUrl: ''
  });

  const loadBanners = useCallback(async () => {
    const data = await adminCmsModel.getBanners();
    setBanners(data);
  }, []);

  useEffect(() => {
    loadBanners();
    const handleRefresh = () => loadBanners();
    window.addEventListener('codeguru_refresh_all', handleRefresh);
    return () => window.removeEventListener('codeguru_refresh_all', handleRefresh);
  }, [loadBanners]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideoFile = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|avi)$/i.test(file.name);

    setUploading(true);
    const url = await adminCmsModel.uploadFile(file);
    if (url) {
      setFormData(prev => ({
        ...prev,
        mediaUrl: url,
        type: isVideoFile ? 'video' : 'image'
      }));
    }
    setUploading(false);
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.mediaUrl) {
      alert('Please fill title and upload media!');
      return;
    }

    const created = await adminCmsModel.addBanner(formData);
    if (created) {
      await loadBanners();
      setShowAddModal(false);
      setFormData({
        title: '',
        subtitle: '',
        type: 'image',
        badge: 'TOP PLACEMENT DRIVES 2026',
        ctaText: 'Explore Courses',
        mediaUrl: ''
      });
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    }
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner slide?')) {
      await adminCmsModel.deleteBanner(id);
      await loadBanners();
      window.dispatchEvent(new Event('codeguru_refresh_all'));
    }
  };

  return {
    banners,
    showAddModal,
    setShowAddModal,
    uploading,
    formData,
    setFormData,
    loadBanners,
    handleFileUpload,
    handleCreateBanner,
    handleDeleteBanner
  };
}
