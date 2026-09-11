import React from 'react';
import { createPortal } from 'react-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { useTeamController } from '../controllers/useTeamController';

export default function TeamManagerView() {
  const {
    team,
    showAddModal,
    setShowAddModal,
    uploading,
    formData,
    setFormData,
    handlePhotoUpload,
    handleCreateTeamMember: handleSubmit,
    handleDeleteTeamMember: handleDelete
  } = useTeamController();

  return (
    <div className="flex flex-col gap-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">Team & Faculty Roster</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">Manage executive leadership and mentor team profiles</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm hover:shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <AddIcon className="!w-4 !h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* TEAM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col group hover:border-slate-300 transition-all">
            <div className="p-6 flex flex-col items-center text-center gap-3 relative flex-1">
              
              <button
                onClick={() => handleDelete(member.id)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Delete Member"
              >
                <DeleteOutlineIcon className="!w-4 !h-4" />
              </button>

              <div className="w-24 h-24 rounded-full border-4 border-slate-100 overflow-hidden shadow-md bg-slate-100 shrink-0">
                <img
                  src={member.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-[10px] font-black text-blue-600 tracking-wider uppercase bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  {member.tag || '#TEAMCODEGURU'}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-2 font-heading">{member.name}</h3>
                <p className="text-xs font-bold text-slate-600">{member.role}</p>
              </div>

              {member.bio && (
                <p className="text-xs font-medium text-slate-500 line-clamp-3 mt-1">
                  {member.bio}
                </p>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Verified Instructor</span>
              <span className="text-emerald-600 font-bold">● Active Status</span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD TEAM MEMBER MODAL */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-hidden animate-fade-in">
            
            {/* MODAL HEADER */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-base font-black text-slate-900 font-heading">Upload Team Member / Mentor</h3>
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
              
              {/* PINNED TOP SECTION: MENTOR PORTRAIT PHOTO UPLOAD */}
              <div className="p-4 bg-slate-50/90 border-b border-slate-200/80 shrink-0 flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">1. Mentor Portrait Photo</label>
                <div className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-white rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1 cursor-pointer relative transition-all">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <CloudUploadIcon className="!w-5 !h-5 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700">
                    {uploading ? 'Uploading Photo...' : (formData.photo ? 'Photo Loaded ✓' : 'Click to Upload Portrait Photo')}
                  </span>
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
                  <label className="text-xs font-bold text-slate-700">Bio Description</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Short bio description of mentor..."
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
                  form="teamForm"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
                >
                  Save & Publish Card
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
