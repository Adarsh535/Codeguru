/**
 * COMPONENT: ProtectedRoute Security Wrapper
 * Guards Admin Dashboard views against unauthorized route access and data theft.
 */
import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoginView from '../views/LoginView';
import LockIcon from '@mui/icons-material/Lock';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, isSessionValid } = useAuth();

  // 1. Verify authentication state and session validity
  const valid = isAuthenticated && user && (typeof isSessionValid === 'function' ? isSessionValid() : true);

  if (!valid) {
    return (
      <div className="relative">
        <LoginView />

        {/* SECURITY ALERT BANNER ON UNAUTHORIZED ROUTE ACCESS */}
        <div className="fixed top-4 right-4 z-50 bg-rose-900/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl border border-rose-500/50 shadow-2xl animate-modal-slide-down flex items-center gap-3 max-w-sm">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
            <LockIcon className="!w-4.5 !h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-wide uppercase text-rose-200">
              Protected Admin Security
            </span>
            <span className="text-[11px] font-semibold text-rose-100/90">
              Access Restricted. Please sign in with valid Master Admin credentials.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Access Granted: Render protected admin components safely
  return <>{children}</>;
}
