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
import { useAuth } from '../context/AuthContext';
import { useSystemController } from '../controllers/useSystemController';

export default function SettingsView() {
  const { user, updateUser } = useAuth();
  const {
    email,
    setEmail,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    dbStatus,
    dbUri,
    dbProvider,
    isSaving,
    message,
    handleUpdatePassword
  } = useSystemController(user, updateUser);


  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8 select-none max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight flex items-center gap-2">
          <SettingsIcon className="!w-7 !h-7 text-blue-600" />
          <span>Admin System Settings</span>
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Manage master admin login credentials, security keys, and check MongoDB database status.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 border ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <CheckCircleIcon className="!w-4 !h-4" />
          <span>{message.text}</span>
        </div>
      )}

      {/* DATABASE STATUS CARD */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-metoxi flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <StorageIcon className="!w-5 !h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Database & System Health</h3>
              <p className="text-xs text-slate-500">{dbProvider || 'MongoDB Atlas Cloud Cluster & REST API Endpoint'}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1 overflow-hidden">
            <span className="text-[11px] text-slate-400 font-extrabold uppercase">Database URI</span>
            <span className="text-slate-800 font-mono font-bold break-all">{dbUri || 'mongodb+srv://Adarshverma:adarshverma@3213@cluster0.illbds4.mongodb.net/codeguru_db'}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
            <span className="text-[11px] text-slate-400 font-extrabold uppercase">Connection Status</span>
            <span className="text-emerald-700 font-bold">{dbStatus}</span>
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

          {message && (
            <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 border mt-1 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}>
              <CheckCircleIcon className="!w-4 !h-4" />
              <span>{message.text}</span>
            </div>
          )}

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

    </div>
  );
}
