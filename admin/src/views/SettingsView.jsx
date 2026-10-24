import React, { useState, useEffect } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import KeyIcon from '@mui/icons-material/Key';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useAuth } from '../context/AuthContext';
import { useSystemController } from '../controllers/useSystemController';

export default function SettingsView() {
  const { user, updateUser } = useAuth();
  const {
    email,
    setEmail,
    adminPhone,
    setAdminPhone,
    whatsappEnabled,
    setWhatsappEnabled,
    autoWhatsappRedirect,
    setAutoWhatsappRedirect,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    dbStatus,
    dbConnected,
    dbUri,
    dbProvider,
    activeDbMode,
    isSwitchingDb,
    handleSwitchDatabase,
    isSaving,
    message,
    isSuccessModalOpen,
    updatedEmailInfo,
    closeSuccessModal,
    handleUpdatePassword,
    handleSaveSettings
  } = useSystemController(user, updateUser);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8 select-none max-w-4xl mx-auto relative">
      
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight flex items-center gap-2">
          <SettingsIcon className="!w-7 !h-7 text-blue-600" />
          <span>Admin System Settings</span>
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Manage master admin login credentials, inquiry notification phone numbers, and view MongoDB Atlas system health.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 border ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <CheckCircleIcon className="!w-4 !h-4 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* INQUIRY NOTIFICATION PHONE NUMBER CARD */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-metoxi flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <WhatsAppIcon className="!w-5 !h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Inquiry & WhatsApp Notification Phone Number</h3>
              <p className="text-xs text-slate-500">Student inquiry notifications will be sent to this number dynamically</p>
            </div>
          </div>
          <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-3 py-1 rounded-full">
            Live Dynamic
          </span>
        </div>

        <form onSubmit={handleSaveSettings} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <PhoneIphoneIcon className="!w-4 !h-4 text-emerald-600" />
              <span>Admin Mobile Number (for receiving Inquiry Alerts & Messages)</span>
            </label>
            <input
              type="tel"
              required
              value={adminPhone}
              onChange={(e) => setAdminPhone(e.target.value)}
              placeholder="e.g. 9670912923"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all bg-white shadow-xs"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Whenever a student submits the Get in Touch form on the website, inquiry details will be routed to this number (Current: <strong className="text-slate-900">{adminPhone}</strong>).
            </p>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <WhatsAppIcon className="!w-5 !h-5 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">Auto WhatsApp Message Trigger</div>
                <div className="text-[11px] text-slate-500">Open instant WhatsApp chat on student form submit</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoWhatsappRedirect}
              onChange={(e) => setAutoWhatsappRedirect(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <SaveIcon className="!w-4 !h-4" />
              <span>{isSaving ? 'Saving to MongoDB...' : 'Save Notification Phone Number'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* MONGODB CLUSTER CONTAINER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-metoxi flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <StorageIcon className="!w-5 !h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Database & System Health</h3>
              <p className="text-xs text-slate-500">Live production database connection details</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              ☁️ Cloud Atlas Database
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected Live
            </span>
          </div>
        </div>

        {/* SINGLE CLEAN CARD: MONGODB ATLAS CLOUD CLUSTER */}
        <div className="p-5 rounded-3xl border bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-white border-blue-200 shadow-2xs flex flex-col gap-4 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-black text-slate-900 font-heading flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  ☁️
                </span>
                <span>MongoDB Atlas Cloud Cluster</span>
              </span>
              
              <span className="text-[10.5px] font-black px-3 py-1 rounded-full border shadow-2xs flex items-center gap-1.5 shrink-0 bg-emerald-500 text-white border-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>CONNECTED LIVE</span>
              </span>
            </div>

            {/* DATABASE STATUS BOX */}
            <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 font-mono text-[11px] font-bold break-all leading-relaxed shadow-xs relative group">
              <div className="text-[9px] font-black uppercase text-blue-400 mb-1 tracking-wider block">DATABASE STATUS</div>
              <span className={dbConnected !== false ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {dbConnected !== false ? 'Database: connected (Cloud Atlas Managed Cluster)' : 'Database: disconnected'}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Remote Cloud Atlas MongoDB database cluster. Syncs live with website production catalog and student inquiries.
            </p>
          </div>
        </div>
      </div>


      {/* SECURITY & CREDENTIALS FORM */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-metoxi flex flex-col gap-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <SecurityIcon className="!w-5 !h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-heading">Update Admin Account Credentials</h3>
            <p className="text-xs text-slate-500">Change Admin email address or login password stored in MongoDB Atlas</p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <EmailIcon className="!w-3.5 !h-3.5 text-blue-600" />
                <span>Admin Email Address</span>
              </label>
              <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                <EditIcon className="!w-3 !h-3" />
                <span>Editable Field</span>
              </span>
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter new admin email address"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white shadow-xs"
            />
            <p className="text-[11px] text-slate-400 font-medium">Type any new email address here to update your admin login ID in MongoDB database.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <LockIcon className="!w-3.5 !h-3.5 text-amber-500" />
              <span>Current Admin Password (Required to make changes)</span>
            </label>
            <input
              type="password"
              required
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <LockIcon className="!w-3.5 !h-3.5 text-slate-400" />
                <span>New Password</span>
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <KeyIcon className="!w-3.5 !h-3.5 text-slate-400" />
                <span>Confirm New Password</span>
              </label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end mt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <SaveIcon className="!w-4 !h-4" />
              <span>{isSaving ? 'Saving to MongoDB...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SUCCESS CONFIRMATION POPUP MODAL FOR CREDENTIAL UPDATE */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 select-none animate-backdrop-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-2xl flex flex-col items-center text-center gap-4 animate-modal-slide-up relative overflow-hidden">
            
            {/* Ambient emerald radial glow */}
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
            
            {/* ANIMATED ICON BADGE */}
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg relative">
              <CheckCircleIcon className="!w-12 !h-12 text-emerald-500 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-25" />
            </div>

            {/* CONFIRMATION TEXTS */}
            <div className="flex flex-col gap-1.5 z-10">
              <h3 className="text-xl font-black text-slate-900 font-heading tracking-tight">
                Credentials Updated!
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-center">
                ● MongoDB Atlas Saved Successfully
              </span>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                Your Admin Email & Password have been changed successfully.
              </p>
              {updatedEmailInfo && (
                <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 break-all">
                  🔑 Active Email: {updatedEmailInfo}
                </div>
              )}
            </div>

            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={closeSuccessModal}
              className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
            >
              OK, Got it!
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
