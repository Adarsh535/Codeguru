import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MovieIcon from '@mui/icons-material/Movie';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import { apiAdminService } from '../services/apiAdminService';

import { useBannersController } from '../controllers/useBannersController';

export default function BannersManagerView() {
  const {
    banners,
    showAddModal,
    setShowAddModal,
    uploading,
    formData,
    setFormData,
    handleFileUpload,
    handleCreateBanner: handleSubmit,
    handleDeleteBanner: handleDelete
  } = useBannersController();

  const isVideo = (url, type) => {
    if (type === 'video') return true;
    if (!url) return false;
    return /\.(mp4|webm|mov|m4v|avi)$/i.test(url) || url.includes('video');
  };


  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight flex items-center gap-2">
            <span>Hero Banners & Video Manager</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Upload and manage homepage image slider banners and MP4 promo video banners dynamically.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <AddIcon className="!w-4 !h-4" />
          <span>Upload Image / Video Banner</span>
        </button>
      </div>

      {/* BANNERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner, idx) => {
          const bannerId = banner._id || banner.id || idx;
          const hasVideo = isVideo(banner.mediaUrl, banner.type);

          return (
            <div key={bannerId} className="bg-white rounded-2xl border border-slate-200/80 shadow-metoxi overflow-hidden flex flex-col">
              <div className="h-48 w-full bg-slate-950 relative overflow-hidden group">
                {hasVideo ? (
                  <video
                    src={banner.mediaUrl}
                    controls
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={banner.mediaUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                
                <span className={`absolute top-3 left-3 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 ${
                  hasVideo ? 'bg-rose-600' : 'bg-blue-600'
                }`}>
                  {hasVideo ? <MovieIcon className="!w-3 !h-3" /> : <ImageIcon className="!w-3 !h-3" />}
                  {banner.badge || (hasVideo ? 'VIDEO BANNER' : 'IMAGE BANNER')}
                </span>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 font-heading">{banner.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">{banner.subtitle}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400">CTA: {banner.ctaText}</span>
                  <button
                    onClick={() => handleDelete(bannerId)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Banner"
                  >
                    <DeleteOutlineIcon className="!w-4 !h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* UPLOAD MODAL */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl border border-slate-200 shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-hidden animate-fade-in">
            
            {/* MODAL HEADER */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-5 bg-blue-600 rounded-full" />
                <h3 className="text-sm sm:text-base font-black text-slate-900 font-heading">
                  Upload Homepage Image or Video Banner
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close"
              >
                <CloseIcon className="!w-5 !h-5" />
              </button>
            </div>

            <form id="bannerForm" onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              
              {/* PINNED TOP SECTION: UPLOAD BOX & MEDIA TYPE (FIXED ABOVE SCROLL AREA) */}
              <div className="p-4 bg-slate-50/90 border-b border-slate-200/80 shrink-0 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  {/* MEDIA TYPE TOGGLE */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">1. Banner Media Type</label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'image' })}
                        className={`py-1.5 px-2 rounded-lg text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          formData.type === 'image'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <ImageIcon className="!w-3.5 !h-3.5" />
                        <span>Image</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'video' })}
                        className={`py-1.5 px-2 rounded-lg text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          formData.type === 'video'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <MovieIcon className="!w-3.5 !h-3.5" />
                        <span>Video</span>
                      </button>
                    </div>
                  </div>

                  {/* FILE UPLOAD BOX */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">2. Select File</label>
                    <div className={`border-2 border-dashed rounded-xl p-2 flex items-center justify-center gap-2 cursor-pointer relative transition-all h-[42px] ${
                      uploading ? 'border-amber-400 bg-amber-50/50 animate-pulse' : (formData.mediaUrl ? 'border-emerald-400 bg-emerald-50/40' : 'border-blue-300 hover:border-blue-500 bg-blue-50/30')
                    }`}>
                      <input
                        type="file"
                        disabled={uploading}
                        accept={formData.type === 'video' ? 'video/*' : 'image/*,video/*'}
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      {uploading ? (
                        <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin shrink-0" />
                      ) : formData.type === 'video' ? (
                        <MovieIcon className="!w-4 !h-4 text-rose-600 shrink-0" />
                      ) : (
                        <CloudUploadIcon className="!w-4 !h-4 text-blue-600 shrink-0" />
                      )}
                      <span className="text-[11px] font-bold text-slate-800 truncate">
                        {uploading ? '⏳ Uploading to Cloudinary...' : (formData.mediaUrl ? '✓ Media Uploaded / Loaded' : `Click to Upload ${formData.type === 'video' ? 'Video' : 'Image'}`)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* DIRECT MEDIA URL INPUT */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Direct Media URL (Optional)</span>
                  <input
                    type="text"
                    value={formData.mediaUrl}
                    onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                    placeholder={formData.type === 'video' ? 'e.g. /video.mp4 or https://.../video.mp4' : 'e.g. https://images.unsplash.com/...'}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* SCROLLABLE FORM BODY FOR OTHER DETAILS */}
              <div className="p-5 overflow-y-auto flex-1 space-y-3.5">
                {/* MEDIA PREVIEW IF SELECTED */}
                {formData.mediaUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 max-h-24 bg-slate-900 flex justify-center">
                    {isVideo(formData.mediaUrl, formData.type) ? (
                      <video src={formData.mediaUrl} controls className="max-h-24 object-contain" />
                    ) : (
                      <img src={formData.mediaUrl} alt="Preview" className="max-h-24 object-contain" />
                    )}
                  </div>
                )}

                {/* TITLE & SUBTITLE IN GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Banner Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. TOP PLACEMENT DRIVES 2026"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Subtitle / Description</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="e.g. Alumni placed at Top MNCs"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* BADGE & BUTTON CTA IN GRID */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Badge Label</label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="TOP PLACEMENTS 2026"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Button CTA Text</label>
                    <input
                      type="text"
                      value={formData.ctaText}
                      onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                      placeholder="Explore Drives"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* FIXED FOOTER */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CloudUploadIcon className="!w-4 !h-4" />
                  <span>{uploading ? 'Uploading...' : 'Save & Publish Banner'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
