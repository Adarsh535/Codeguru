import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Megaphone, Plus, Trash2, Edit3, Image as ImageIcon, ExternalLink, 
  CheckCircle, XCircle, MousePointerClick, Eye, Sparkles, UploadCloud, 
  Layers, Link as LinkIcon, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useAdsController } from '../controllers/useAdsController';

export default function AdsManagerView() {
  const {
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
  } = useAdsController();

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    adId: null,
    title: ''
  });

  const activeCount = ads.filter(a => a.active).length;
  const totalClicks = ads.reduce((acc, curr) => acc + (curr.clicks || 0), 0);

  const triggerDelete = (ad) => {
    setConfirmModal({
      isOpen: true,
      adId: ad._id || ad.id,
      title: ad.title || 'Advertisement Banner'
    });
  };

  const confirmDelete = async () => {
    if (confirmModal.adId) {
      await handleDeleteAd(confirmModal.adId);
      setConfirmModal({ isOpen: false, adId: null, title: '' });
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12 select-none">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
                Advertisement & Promo Banners
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live Dynamic
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Manage website featured promotional ad banners (e.g. Arena Animation 25 Years Banner, Partner Ads) in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadAds()}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh Ads List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Ad Banner</span>
          </button>
        </div>
      </div>

      {/* METRICS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Ad Banners</span>
          <div className="text-2xl font-black text-slate-900 mt-1 font-heading">{ads.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Active On Website
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-heading">{activeCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Inactive / Hidden
          </span>
          <div className="text-2xl font-black text-slate-500 mt-1 font-heading">{ads.length - activeCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
            <MousePointerClick className="w-3.5 h-3.5" /> Total Ad Clicks
          </span>
          <div className="text-2xl font-black text-indigo-600 mt-1 font-heading">{totalClicks}</div>
        </div>
      </div>

      {/* LIVE ADS LIST */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Configured Ad Banners ({ads.length})</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Active banners appear directly on the website home page
          </span>
        </div>

        {ads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <ImageIcon className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No advertisement banners yet</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Click &quot;Upload New Ad Banner&quot; above to add your first promotional banner for Arena Animation or sponsors.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-700"
            >
              Add First Banner
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ads.map((ad, idx) => {
              const adId = ad._id || ad.id || idx;
              return (
                <div
                  key={adId}
                  className={`bg-white rounded-2xl border transition-all duration-200 shadow-2xs overflow-hidden flex flex-col justify-between ${
                    ad.active ? 'border-slate-200 hover:border-blue-300 hover:shadow-md' : 'border-slate-200/60 opacity-75'
                  }`}
                >
                  <div>
                    {/* BANNER PREVIEW CONTAINER */}
                    <div className="relative w-full bg-slate-100 border-b border-slate-100 overflow-hidden group">
                      <div className="p-3">
                        <div className="w-full rounded-xl bg-white border border-slate-200/90 p-1.5 shadow-2xs flex items-center justify-center overflow-hidden">
                          <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            className="w-full h-32 sm:h-36 object-contain rounded-lg mx-auto transition-transform duration-300 group-hover:scale-102"
                            onError={(e) => {
                              e.currentTarget.src = '/images/arena-25-years.jpg';
                            }}
                          />
                        </div>
                      </div>

                      {/* BADGES ON IMAGE */}
                      <div className="absolute top-5 left-5 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs shadow-xs">
                          {ad.badge || 'PROMOTION'}
                        </span>
                      </div>

                      <div className="absolute top-5 right-5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs ${
                          ad.active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                        }`}>
                          {ad.active ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    {/* CONTENT DETAILS */}
                    <div className="p-4 sm:p-5 flex flex-col gap-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900 font-heading leading-tight">
                            {ad.title}
                          </h3>
                          {ad.subtitle && (
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              {ad.subtitle}
                            </p>
                          )}
                        </div>

                        {/* ACTIVE TOGGLE SWITCH */}
                        <div className="flex flex-col items-end shrink-0">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(ad.active)}
                              onChange={() => handleToggleStatus(ad)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                          <span className="text-[9px] font-bold text-slate-400 mt-1">
                            {ad.active ? 'Live' : 'Hidden'}
                          </span>
                        </div>
                      </div>

                      {/* TARGET LINK */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                          <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {ad.linkUrl ? (
                            <a
                              href={ad.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline truncate font-semibold flex items-center gap-1"
                            >
                              <span>{ad.linkUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">No click link configured</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                          <MousePointerClick className="w-3 h-3 text-indigo-500" />
                          <span>{ad.clicks || 0} clicks</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BAR */}
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Placement: <span className="text-slate-700">{ad.position || 'home_featured'}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditAd(ad)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-blue-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => triggerDelete(ad)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL PORTAL (SIDE-BY-SIDE WITH REAL-TIME PREVIEW) */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-fade-in select-none overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl flex flex-col overflow-hidden my-auto max-h-[92vh]">
            
            {/* MODAL HEADER */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading leading-tight">
                    {editingAdId ? 'Edit Advertisement Banner' : 'Upload New Ad Banner'}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Fill in details on the left, see live real-time website preview on the right
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 flex items-center justify-center transition-colors cursor-pointer"
                title="Close Modal"
              >
                ✕
              </button>
            </div>

            {/* MODAL BODY: 2-COLUMN SPLIT (FORM + LIVE PREVIEW) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden flex-1 min-h-0">
              
              {/* LEFT COLUMN: FORM CONTROLS (7 COLS) */}
              <form onSubmit={handleSubmitAd} className="lg:col-span-7 p-5 sm:p-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(92vh-130px)] scrollbar-thin border-b lg:border-b-0 lg:border-r border-slate-200">
                
                {/* 1. IMAGE UPLOAD & PRESET */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
                    <span>Banner Image (Required) *</span>
                    {uploading && <span className="text-blue-600 text-[11px] font-bold animate-pulse">Uploading to server...</span>}
                  </label>

                  {/* UPLOAD & PRESETS ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-3.5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all text-center group">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-slate-200 group-hover:border-blue-300 flex items-center justify-center text-blue-600 transition-colors">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-extrabold text-slate-800 group-hover:text-blue-600">Choose File from PC</span>
                      <span className="text-[10px] text-slate-400 font-medium">PNG, JPG, WebP supported</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Quick Image Presets:</span>
                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, imageUrl: '/images/arena-25-years.jpg' }))}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold text-left transition-all cursor-pointer flex items-center justify-between ${
                            formData.imageUrl === '/images/arena-25-years.jpg'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>Arena 25 Years (Default)</span>
                          <span className="text-[9px] opacity-75">100×200</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, imageUrl: '/images/arena-animation-banner.png' }))}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold text-left transition-all cursor-pointer flex items-center justify-between ${
                            formData.imageUrl === '/images/arena-animation-banner.png'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>Arena Logo Banner</span>
                          <span className="text-[9px] opacity-75">Wide</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* DIRECT URL INPUT */}
                  <div className="flex flex-col gap-1 mt-0.5">
                    <span className="text-[11px] font-bold text-slate-500">Image Path / URL:</span>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="/images/arena-25-years.jpg or https://..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 2. TITLE */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
                    <span>Banner Title *</span>
                    <span className="text-[10px] text-slate-400 font-normal">Shown in alt text and banner details</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Celebrating 25 Years - Arena Animation"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* 3. SUBTITLE */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Subtitle / Tagline (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="e.g. Premier Animation, VFX & Gaming Training Partner"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* 4. DESTINATION LINK */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Target Destination Link (URL when clicked)</span>
                    <span className="text-[10px] text-blue-600 font-semibold">Redirect on user click</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                      placeholder="e.g. https://www.arena-multimedia.com or /courses"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 5. BADGE & PLACEMENT ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Badge Label
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                      placeholder="FEATURED AD, 25 YEARS, PARTNER"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Placement Position
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      <option value="home_featured">Homepage Featured (Below Categories)</option>
                      <option value="header_top">Header Top Banner</option>
                      <option value="footer_above">Above Footer</option>
                    </select>
                  </div>
                </div>

                {/* 6. STATUS & NEW TAB TOGGLES */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.active)}
                      onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-extrabold text-slate-800">Active Status</span>
                      <p className="text-[10px] text-slate-500">Live on website immediately</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.openInNewTab)}
                      onChange={(e) => setFormData(prev => ({ ...prev, openInNewTab: e.target.checked }))}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-extrabold text-slate-800">Open in New Tab</span>
                      <p className="text-[10px] text-slate-500">Opens external page smoothly</p>
                    </div>
                  </label>
                </div>

                {/* SUBMIT BUTTON ROW */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 mt-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{editingAdId ? 'Update Ad Banner' : 'Publish Ad Banner'}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

              {/* RIGHT COLUMN: LIVE REAL-TIME WEBSITE PREVIEW (5 COLS) */}
              <div className="lg:col-span-5 bg-slate-50/70 p-5 sm:p-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(92vh-130px)] scrollbar-thin">
                
                {/* PREVIEW HEADER */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 font-heading">
                      Live Website Preview
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    Real-time Sync
                  </span>
                </div>

                {/* BROWSER / WEBSITE FRAME MOCKUP */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  
                  {/* BROWSER TOP BAR */}
                  <div className="px-3.5 py-2 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="px-3 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-500 text-center max-w-[180px] truncate">
                      codeguru.com/home
                    </div>
                    <div className="w-8"></div>
                  </div>

                  {/* SIMULATED HOMEPAGE CONTEXT */}
                  <div className="p-3.5 bg-slate-50 flex flex-col gap-3">
                    
                    {/* FAKE SECTION TITLE / CATEGORY STRIP */}
                    <div className="flex items-center justify-between px-1">
                      <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
                      <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
                    </div>

                    {/* THE EXACT HOMEPAGE BANNER CONTAINER */}
                    <div className="relative group">
                      <div className="w-full rounded-[14px] sm:rounded-[18px] bg-white border border-slate-200/90 p-1.5 sm:p-2 shadow-xs flex items-center justify-center overflow-hidden transition-all duration-300">
                        {formData.imageUrl ? (
                          <img
                            src={formData.imageUrl}
                            alt={formData.title || 'Advertisement Banner Preview'}
                            className="w-full h-[90px] sm:h-[130px] object-cover sm:object-fill rounded-xl mx-auto transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = '/images/arena-25-years.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-[90px] sm:h-[130px] rounded-xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center gap-1.5 text-slate-400">
                            <ImageIcon className="w-6 h-6" />
                            <span className="text-[11px] font-bold">Image will appear here</span>
                          </div>
                        )}
                      </div>

                      {/* BADGE ON TOP */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-900/80 text-white shadow-xs backdrop-blur-xs">
                          {formData.badge || 'PROMOTION'}
                        </span>
                      </div>

                      {/* ACTIVE INDICATOR */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-xs ${
                          formData.active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                        }`}>
                          {formData.active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    {/* FAKE LOWER SECTION STRIP */}
                    <div className="flex items-center justify-between px-1 pt-1">
                      <div className="h-2 w-28 bg-slate-200 rounded-full"></div>
                      <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
                    </div>

                  </div>

                </div>

                {/* BANNER DETAILS SUMMARY CARD */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 font-heading">
                        {formData.title || 'Untitled Banner'}
                      </h4>
                      {formData.subtitle && (
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {formData.subtitle}
                        </p>
                      )}
                    </div>

                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                      {formData.position || 'home_featured'}
                    </span>
                  </div>

                  {/* CLICK DESTINATION PREVIEW */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Click Action:</span>
                    {formData.linkUrl ? (
                      <a
                        href={formData.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 font-bold hover:underline flex items-center gap-1 max-w-[200px] truncate"
                        title={formData.linkUrl}
                      >
                        <span className="truncate">{formData.linkUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">No click link</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                    <span>New Tab Target:</span>
                    <span className="font-bold text-slate-700">
                      {formData.openInNewTab ? 'Yes (_blank)' : 'No (Same tab)'}
                    </span>
                  </div>
                </div>

                {/* HELPFUL HINT */}
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2 text-blue-800">
                  <Eye className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed font-medium">
                    As you type the title, tagline, or choose/upload any banner image on the left, this preview updates instantaneously so you know exactly how visitors will see it on the website!
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>,
        document.body
      )}

      {/* CONFIRM DELETE MODAL PORTAL */}
      {confirmModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs select-none animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl flex flex-col gap-4 animate-modal-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 font-heading">
                  Delete Ad Banner?
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  {confirmModal.title}
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              Are you sure you want to delete this advertisement banner? It will immediately disappear from the live website.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                onClick={() => setConfirmModal({ isOpen: false, adId: null, title: '' })}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Now</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
