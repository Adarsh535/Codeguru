/**
 * ============================================================================
 * LOGIN ROUTE PAGE: /login (frontend/src/app/login/page.jsx)
 * ============================================================================
 * Destination for unauthenticated protected route redirections.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <LockIcon className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Protected Account Login</h1>
          <p className="text-xs font-semibold text-slate-500">
            Sign in to access your dashboard, courses, and administrative controls.
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@codeguru.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            id="login-submit-btn"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2"
          >
            <ShieldIcon className="w-4 h-4" /> Secure Sign In
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-blue-600 font-bold">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
