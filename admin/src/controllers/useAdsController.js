/**
 * ============================================================================
 * CONTROLLER LAYER: ADS MANAGER CONTROLLER (useAdsController.js)
 * ============================================================================
 * Custom hook handling business logic for Advertisement Banners CMS Management.
 */

import { useState, useEffect, useCallback } from 'react';
import { adminCmsModel } from '../models/adminCmsModel';

const INITIAL_FORM_DATA = {
  title: 'Celebrating 25 Years - Arena Animation',
  subtitle: 'Premier Animation, VFX & Gaming Training Partner',
  imageUrl: '/images/arena-25-years.jpg',
  linkUrl: '',
  badge: 'FEATURED AD',
  position: 'home_featured',
  openInNewTab: true,
  active: true,
  displayOrder: 1
};

export function useAdsController() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAdId, setEditingAdId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const loadAds = useCallback(async () => {
    try {
      const data = await adminCmsModel.getAds();
      setAds(data);
    } catch (err) {
      console.error('[useAdsController] Failed to load ads:', err);
    }
  }, []);

  useEffect(() => {
    loadAds();
    const handleRefresh = () => loadAds();

    window.addEventListener('codeguru_refresh_all', handleRefresh);
    window.addEventListener('codeguru_refresh_ads', handleRefresh);
    window.addEventListener('focus', handleRefresh);

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        loadAds();
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('codeguru_refresh_all', handleRefresh);
      window.removeEventListener('codeguru_refresh_ads', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
    };
  }, [loadAds]);

  const handleOpenAddModal = () => {
    setEditingAdId(null);
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      linkUrl: '',
      badge: 'FEATURED AD',
      position: 'home_featured',
      openInNewTab: true,
      active: true,
      displayOrder: ads.length + 1
    });
    setShowAddModal(true);
  };

  const handleEditAd = (ad) => {
    setEditingAdId(ad._id || ad.id);
    setFormData({
      title: ad.title || '',
      subtitle: ad.subtitle || '',
      imageUrl: ad.imageUrl || '',
      linkUrl: ad.linkUrl || '',
      badge: ad.badge || 'FEATURED AD',
      position: ad.position || 'home_featured',
      openInNewTab: ad.openInNewTab !== undefined ? ad.openInNewTab : true,
      active: ad.active !== undefined ? ad.active : true,
      displayOrder: ad.displayOrder || 1
    });
    setShowAddModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await adminCmsModel.uploadFile(file);
      if (url) {
        setFormData(prev => ({
          ...prev,
          imageUrl: url
        }));
      } else {
        alert('File upload failed. Please ensure the backend is running or provide a direct image URL.');
      }
    } catch (err) {
      console.error('[useAdsController] File upload error:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitAd = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.title || !formData.imageUrl) {
      alert('Please provide at least a Title and an Image (upload or URL).');
      return;
    }

    setLoading(true);
    try {
      if (editingAdId) {
        const updated = await adminCmsModel.updateAd(editingAdId, formData);
        if (updated) {
          await loadAds();
          setShowAddModal(false);
          setEditingAdId(null);
        } else {
          alert('Failed to update ad banner.');
        }
      } else {
        const created = await adminCmsModel.createAd(formData);
        if (created) {
          await loadAds();
          setShowAddModal(false);
          setEditingAdId(null);
        } else {
          alert('Failed to create ad banner.');
        }
      }
    } catch (err) {
      console.error('[useAdsController] Submit error:', err);
      alert('Error saving ad: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (adId) => {
    try {
      await adminCmsModel.deleteAd(adId);
      await loadAds();
    } catch (err) {
      console.error('[useAdsController] Delete error:', err);
      alert('Failed to delete ad: ' + err.message);
    }
  };

  const handleToggleStatus = async (ad) => {
    const adId = ad._id || ad.id;
    try {
      await adminCmsModel.updateAd(adId, { active: !ad.active });
      await loadAds();
    } catch (err) {
      console.error('[useAdsController] Toggle status error:', err);
    }
  };

  return {
    ads,
    loading,
    uploading,
    showAddModal,
    setShowAddModal,
    editingAdId,
    formData,
    setFormData,
    handleOpenAddModal,
    handleEditAd,
    handleFileUpload,
    handleSubmitAd,
    handleDeleteAd,
    handleToggleStatus,
    loadAds
  };
}
