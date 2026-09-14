import React from 'react';

/**
 * Responsive Device Container: Fluidly scales for Mobile, Tablet, and Desktop screens.
 */
export default function DeviceGuard({ children }) {
  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 overflow-x-hidden" suppressHydrationWarning>
      {children}
    </div>
  );
}
