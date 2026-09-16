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
  const [editingBannerId, setEditingBannerId] = useState(null);
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

  const handleOpenAddModal = () => {
    setEditingBannerId(null);
    setFormData({
      title: '',
      subtitle: '',
      type: 'image',
      badge: 'TOP PLACEMENT DRIVES 2026',
      ctaText: 'Explore Courses',
      mediaUrl: ''
    });
    setShowAddModal(true);
  };

  const handleEditBanner = (banner) => {
    setEditingBannerId(banner._id || banner.id);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      type: banner.type || 'image',
      badge: banner.badge || 'TOP PLACEMENT DRIVES 2026',
      ctaText: banner.ctaText || 'Explore Courses',
      mediaUrl: banner.mediaUrl || banner.imageUrl || banner.videoUrl || ''
    });
    setShowAddModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideoFile = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(file.name);

    setUploading(true);
    const url = await adminCmsModel.uploadFile(file);
    if (url) {
      setFormData(prev => ({
        ...prev,
        mediaUrl: url,
        type: isVideoFile ? 'video' : 'image'
      }));
    } else {
      alert('File upload to Cloudinary failed. Please check backend or file size.');
    }
    setUploading(false);
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.mediaUrl) {
      alert('Please fill title and upload media!');
      return;
    }

    const isVideo = formData.type === 'video' || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(formData.mediaUrl);
    const payload = {
      ...formData,
      type: isVideo ? 'video' : 'image',
      videoUrl: isVideo ? formData.mediaUrl : '',
      imageUrl: !isVideo ? formData.mediaUrl : ''
    };

    let result = null;
    if (editingBannerId) {
      result = await adminCmsModel.updateBanner(editingBannerId, payload);
    } else {
      result = await adminCmsModel.addBanner(payload);
    }

    if (result) {
      await loadBanners();
      setShowAddModal(false);
      setEditingBannerId(null);
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
    editingBannerId,
    handleOpenAddModal,
    handleEditBanner,
    uploading,
    formData,
    setFormData,
    loadBanners,
    handleFileUpload,
    handleCreateBanner,
    handleDeleteBanner
  };
}
