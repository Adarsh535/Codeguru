import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTeamController } from '../controllers/useTeamController';

export default function TeamManagerView() {
  const {
    team,
    showAddModal,
    setShowAddModal,
    editingTeamId,
    handleOpenAddModal,
    handleEditTeamMember: handleEdit,
    uploading,
    formData,
    setFormData,
    handlePhotoUpload,
    handleCreateTeamMember: handleSubmit,
    handleDeleteTeamMember: handleDelete,
    handleToggleVisibility
  } = useTeamController();

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const triggerDeleteWithConfirm = (memberId, name) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Team Member "${name || 'Member'}"?`,
      message: `Are you sure you want to delete team profile for "${name || ''}"? This action will remove it from website faculty roster and cannot be undone.`,
      onConfirm: async () => {
        await handleDelete(memberId);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">Team & Faculty Roster</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">Manage executive leadership and mentor team profiles</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm hover:shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <AddIcon className="!w-4 !h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* TEAM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => {
          const memberId = member._id || member.id;
          const isMemberActive = member.isActive !== false && !member.isHidden;
          return (
            <div key={memberId} className={`bg-white rounded-2xl border shadow-xs overflow-hidden flex flex-col group transition-all relative ${
              isMemberActive ? 'border-slate-200 hover:border-slate-300' : 'border-rose-300 bg-rose-50/20'
            }`}>
              {/* HIDDEN BADGE IF INACTIVE */}
              {!isMemberActive && (
                <div className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <VisibilityOffIcon className="!w-3 !h-3" />
                  <span>Hidden from Website</span>
                </div>
              )}

              <div className="p-6 flex flex-col items-center text-center gap-3 relative flex-1">
                
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggleVisibility(member)}
                    className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                      isMemberActive 
                        ? 'bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600' 
                        : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                    }`}
                    title={isMemberActive ? 'Hide from Frontend (Click to Hide)' : 'Show on Frontend (Click to Show)'}
                  >
                    {isMemberActive ? <VisibilityIcon className="!w-4 !h-4" /> : <VisibilityOffIcon className="!w-4 !h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Edit Member"
                  >
                    <EditOutlinedIcon className="!w-4 !h-4" />
                  </button>
                  <button
                    onClick={() => triggerDeleteWithConfirm(memberId, member.name)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Member"
                  >
                    <DeleteOutlineIcon className="!w-4 !h-4" />
                  </button>
                </div>

                <div className="w-24 h-24 rounded-full border-4 border-slate-100 overflow-hidden shadow-md bg-slate-100 shrink-0">
                  <img
                    src={member.photoUrl || member.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-black text-blue-600 tracking-wider uppercase bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {member.tag || '#TEAMCODEGURU'}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-2 font-heading">{member.name}</h3>
                  <p className="text-xs font-bold text-blue-600">{member.specialization || 'Full Stack & System Design'}</p>
                  <p className="text-[11px] font-semibold text-slate-500">{member.role}</p>
                </div>

                {member.bio && (
                  <p className="text-xs font-medium text-slate-500 line-clamp-3 mt-1">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* CARD FOOTER WITH INTERACTIVE HIDE / SHOW BUTTON */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 gap-2">
                <span>Verified Instructor</span>

                <button
                  type="button"
                  onClick={() => handleToggleVisibility(member)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 border ${
                    isMemberActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-2xs'
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 shadow-2xs'
                  }`}
                  title={isMemberActive ? 'Visible on Website (Click to Hide from Frontend)' : 'Hidden from Website (Click to Show on Frontend)'}
                >
                  {isMemberActive ? (
                    <>
                      <VisibilityIcon className="!w-3.5 !h-3.5 text-emerald-600" />
                      <span>Live on Frontend</span>
                    </>
                  ) : (
                    <>
                      <VisibilityOffIcon className="!w-3.5 !h-3.5 text-rose-600" />
                      <span>Hidden from Frontend</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD TEAM MEMBER MODAL */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-hidden animate-fade-in">
            
            {/* MODAL HEADER */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-base font-black text-slate-900 font-heading">
                {editingTeamId ? 'Edit Team Member / Mentor' : 'Upload Team Member / Mentor'}
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

            <form id="teamForm" onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              
              {/* PINNED TOP SECTION: MENTOR PORTRAIT PHOTO UPLOAD & LIVE PREVIEW */}
              <div className="p-4 bg-slate-50/90 border-b border-slate-200/80 shrink-0 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">1. Mentor Portrait Photo</label>
                  {(formData.photoUrl || formData.photo) && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Photo Loaded
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  {/* SIDE PREVIEW THUMBNAIL (COMPACT & PROPORTIONAL) */}
                  {(formData.photoUrl || formData.photo) ? (
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-blue-200 bg-white shadow-sm overflow-hidden flex items-center justify-center p-0.5">
                        <img 
                          src={formData.photoUrl || formData.photo} 
                          alt="Mentor Preview" 
                          className="w-full h-full object-cover object-top rounded-xl"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, photoUrl: '', photo: '' }))}
                        className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-md cursor-pointer transition-transform hover:scale-110"
                        title="Remove photo"
                      >
                        <CloseIcon className="!w-3 !h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100/70 flex flex-col items-center justify-center shrink-0 text-slate-400 gap-1">
                      <CloudUploadIcon className="!w-5 !h-5 text-slate-400" />
                      <span className="text-[10px] font-semibold text-slate-400">No Photo</span>
                    </div>
                  )}

                  {/* UPLOAD / CHANGE DROPZONE */}
                  <div className="flex-1 min-w-0 border-2 border-dashed border-blue-300 hover:border-blue-500 bg-white hover:bg-blue-50/30 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-1 cursor-pointer relative transition-all group">
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <CloudUploadIcon className="!w-5 !h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-slate-800">
                      {uploading ? 'Uploading Photo...' : ((formData.photoUrl || formData.photo) ? 'Click to Change Photo' : 'Upload Mentor Portrait Photo')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">PNG, JPG, WEBP • Max 5MB</span>
                  </div>
                </div>
              </div>

              {/* SCROLLABLE FORM BODY */}
              <div className="p-5 overflow-y-auto flex-1 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Roshani Yadav"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Designation / Role</label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Lead Developer"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Specialization / Subject Line (Shows below Name)</label>
                  <input
                    type="text"
                    value={formData.specialization || ''}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g. Full Stack & System Design"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 font-medium">This text is displayed right below the Mentor Name on website slider card.</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Bio Description / Note</label>
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Short bio or mentor description..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                {/* VISIBILITY TOGGLE SWITCH */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/80">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Show on Website Frontend</span>
                    <span className="text-[10px] text-slate-500 font-medium">Toggle whether this mentor card appears on website faculty roster</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive !== false}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
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
                  form="teamForm"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
                >
                  {editingTeamId ? 'Update Team Member' : 'Save & Publish Card'}
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
                <span>Yes, Delete Profile</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
