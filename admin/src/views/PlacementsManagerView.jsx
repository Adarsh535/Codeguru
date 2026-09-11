import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloseIcon from '@mui/icons-material/Close';
import { usePlacementsController } from '../controllers/usePlacementsController';

export default function PlacementsManagerView() {
  const {
    placements,
    showAddModal,
    setShowAddModal,
    uploading,
    formData,
    setFormData,
    handleAvatarUpload: handleStudentPhotoUpload,
    handleCreatePlacement: handleSubmit,
    handleDeletePlacement: handleDelete
  } = usePlacementsController();

  const [uploadingCompany, setUploadingCompany] = useState(false);

  const handleCompanyLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCompany(true);
    const url = await apiAdminService.uploadFile(file);
    if (url) setFormData(prev => ({ ...prev, companyLogo: url }));
    setUploadingCompany(false);
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
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <AddIcon className="!w-4 !h-4" />
          <span>Upload Placement Poster</span>
        </button>
      </div>

      {/* PLACEMENT POSTERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {placements.map((item, idx) => {
          const itemId = item._id || item.id || idx;
          return (
            <div key={itemId} className="bg-[#292e26] rounded-2xl p-4 border border-amber-500/30 text-white shadow-xl flex flex-col gap-3 relative overflow-hidden group">
              <div className="h-48 w-full bg-slate-900 rounded-xl overflow-hidden relative">
                <img src={item.photo} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                {item.verified && (
                  <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <VerifiedIcon className="!w-3 !h-3" /> VERIFIED
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-amber-400 font-black text-sm">{item.name}</span>
                <span className="text-[11px] text-slate-300 font-medium truncate">{item.college}</span>
                <div className="mt-1 p-2 rounded-lg bg-white/10 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-cyan-300">{item.company}</span>
                  <span className="text-xs font-extrabold text-amber-400">₹ {item.package}</span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(itemId)}
                className="self-end p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                title="Delete Poster"
              >
                <DeleteOutlineIcon className="!w-4 !h-4" />
              </button>
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
              <h3 className="text-base font-black text-slate-900 font-heading">Upload Student Placement Poster</h3>
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
                  Publish Placement Poster
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
