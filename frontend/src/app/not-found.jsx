import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-amber-500 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-slate-600 mb-6 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover: transition-all"
      >
        Return to Homepage
      </Link>
    </div>
  );
}
