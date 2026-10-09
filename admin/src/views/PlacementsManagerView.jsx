import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloseIcon from '@mui/icons-material/Close';
import { usePlacementsController } from '../controllers/usePlacementsController';

export default function PlacementsManagerView() {
  const {
    placements,
    showAddModal,
    setShowAddModal,
    editingPlacementId,
    handleOpenAddModal,
    handleEditPlacement: handleEdit,
    uploadingStudent,
    uploadingCompany,
    formData,
    setFormData,
    handleStudentPhotoUpload,
    handleCompanyLogoUpload,
    handleCreatePlacement: handleSubmit,
    handleDeletePlacement: handleDelete
  } = usePlacementsController();




  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const triggerDeleteWithConfirm = (itemId, name) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Placement Poster "${name || 'Student'}"?`,
      message: `Are you sure you want to delete placement poster for "${name || ''}"? This action will remove it from website hall of fame and cannot be undone.`,
      onConfirm: async () => {
        await handleDelete(itemId);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
            Top Placement Posters Manager
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Upload student star achiever placement posters, company logos, and packages.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <AddIcon className="!w-4 !h-4" />
          <span>Upload Placement Poster</span>
        </button>
      </div>

      {/* PLACEMENT POSTERS GRID - MATCHES FRONTEND STYLING EXACTLY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {placements.map((item, idx) => {
          const itemId = item._id || item.id || idx;
          const photoUrl = item.photo || item.avatarUrl || item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
          const companyLogo = item.companyLogo || item.logo || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg';

          return (
            <div
              key={itemId}
              className="bg-white border border-slate-200/90 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col relative overflow-hidden group hover:shadow-md hover:border-blue-400 transition-all duration-300 select-none"
            >
              {/* TOP PORTRAIT PHOTO AREA - EDGE TO EDGE FULL COVER FIT */}
              <div className="w-full h-[220px] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                <img
                  src={photoUrl}
                  alt={item.name}
                  className="w-full h-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-105"
                />

                {/* GREEN DIAGONAL CORNER RIBBON: PLACED */}
                <div className="absolute top-0 right-0 w-[72px] h-[72px] overflow-hidden pointer-events-none z-20">
                  <div className="absolute top-[12px] -right-[22px] w-[95px] transform rotate-45 bg-emerald-600 text-white font-black text-[9px] uppercase tracking-widest text-center py-0.5 shadow-sm">
                    PLACED
                  </div>
                </div>
                
                {/* SLEEK PACKAGE BADGE ON BOTTOM LEFT */}
                <div className="absolute bottom-2.5 left-2.5 z-20 bg-slate-900/90 text-white font-black text-[10px] px-2.5 py-0.5 rounded-lg shadow-sm border border-slate-700/80">
                  {item.package ? (item.package.includes('LPA') || item.package.includes('₹') ? item.package : `₹ ${item.package}`) : '6.5 LPA'}
                </div>
              </div>

              {/* CARD CONTENT */}
              <div className="p-3.5 bg-white flex flex-col flex-1 justify-between gap-3">
                <div>
                  {/* STUDENT NAME & ROLE */}
                  <div className="flex items-center gap-1.5 min-w-0 w-full truncate mb-0.5">
                    <h3 className="font-black text-slate-900 text-[14px] tracking-tight truncate flex-shrink-0 max-w-[60%]">
                      {item.name}
                    </h3>
                    <span className="text-slate-400 font-medium text-[10px] flex-shrink-0">•</span>
                    <span className="text-slate-500 font-semibold text-[11px] truncate flex-1">
                      {item.role || 'Software Engineer'}
                    </span>
                  </div>

                  {/* COMPANY BRANDING & TRAINING TYPE ROW */}
                  <div className="flex items-center justify-between gap-1.5 mt-2 pt-2 border-t border-slate-100 w-full">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <img
                        src={companyLogo}
                        alt={item.company}
                        className="w-4 h-4 object-contain flex-shrink-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span className="font-bold text-slate-800 text-[12px] truncate">
                        {item.company}
                      </span>
                    </div>

                    <div className="bg-slate-100 text-slate-600 font-extrabold text-[9px] px-2 py-0.5 rounded-full border border-slate-200/80 flex-shrink-0 tracking-tight">
                      {item.trainingType || 'Internship Training'}
                    </div>
                  </div>
                </div>

                {/* FOOTER ROW: VERIFIED BADGE + EDIT/DELETE ACTION BUTTONS */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 w-full">
                  <span className="text-[10px] font-extrabold text-emerald-700 flex items-center gap-1">
                    <VerifiedIcon className="!w-3.5 !h-3.5 text-emerald-600" /> Placed & Verified
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit Poster"
                    >
                      <EditOutlinedIcon className="!w-4 !h-4" />
                    </button>
                    <button
                      onClick={() => triggerDeleteWithConfirm(itemId, item.name)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Poster"
                    >
                      <DeleteOutlineIcon className="!w-4 !h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD PLACEMENT POSTER MODAL */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-hidden animate-fade-in">
            
            {/* MODAL HEADER */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-base font-black text-slate-900 font-heading">
                {editingPlacementId ? 'Edit Student Placement Poster' : 'Upload Student Placement Poster'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close"
              >
                <CloseIcon className="!w-5 !h-5" />
              </button>
            </div>

            <form id="placementForm" onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              
              {/* PINNED TOP SECTION: UPLOAD STUDENT PHOTO & COMPANY LOGO */}
              <div className="p-4 bg-slate-50/90 border-b border-slate-200/80 shrink-0 flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">1. Upload Media Files</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-white rounded-xl p-2.5 flex flex-col items-center justify-center text-center gap-1 cursor-pointer relative transition-all">
                      <input type="file" accept="image/*" onChange={handleStudentPhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <CloudUploadIcon className="!w-5 !h-5 text-blue-600" />
                      <span className="text-xs font-bold text-slate-700">
                        {uploadingStudent ? 'Uploading...' : (formData.photo ? 'Photo Loaded ✓' : 'Student Photo')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-white rounded-xl p-2.5 flex flex-col items-center justify-center text-center gap-1 cursor-pointer relative transition-all">
                      <input type="file" accept="image/*" onChange={handleCompanyLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <CloudUploadIcon className="!w-5 !h-5 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-700">
                        {uploadingCompany ? 'Uploading...' : (formData.companyLogo ? 'Logo Loaded ✓' : 'Company Logo')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SCROLLABLE FORM BODY */}
              <div className="p-5 overflow-y-auto flex-1 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Student Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. VIVEK CHAURASIYA"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Hiring Company Name</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. TCS / GOOGLE"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Job Role / Designation</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="MERN STACK DEVELOPER"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Salary Package</label>
                    <input
                      type="text"
                      value={formData.package}
                      onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                      placeholder="14.5 LPA"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">College / Institute Name</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="e.g. IET LUCKNOW"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* FIXED FOOTER */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="placementForm"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
                >
                  {editingPlacementId ? 'Update Placement Poster' : 'Publish Placement Poster'}
                </button>
              </div>

            </form>

          </div>
        </div>,
        document.body
      )}

      {/* CONFIRMATION POPUP MODAL */}
      {confirmModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[999999] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md border border-slate-200 shadow-2xl p-6 space-y-5 animate-scale-up">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0 text-xl font-bold shadow-2xs">
                🗑️
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 font-heading">
                  {confirmModal.title || 'Delete Confirmation'}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Warning: Permanent Action
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs font-bold text-rose-900 leading-relaxed">
              {confirmModal.message}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-black transition-all cursor-pointer active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                }}
                className="px-5 py-2.5 rounded-xl text-white text-xs font-black bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-md shadow-rose-600/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <span>Yes, Delete Poster</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
