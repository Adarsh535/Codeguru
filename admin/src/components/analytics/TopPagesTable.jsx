import React, { useState } from 'react';
import { FileText, Eye, Users, Percent, Filter, ExternalLink } from 'lucide-react';

export default function TopPagesTable({ topPagesData, loading, onRangeChange, currentRange }) {
  const pages = topPagesData?.pages || [];
  const totalViews = topPagesData?.totalViews || 0;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Most Visited Website Pages
            </h2>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Top Routes
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Traffic distribution across student portal and marketing pages
          </p>
        </div>

        {/* DATE RANGE FILTER */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 shrink-0">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: 'all', label: 'All Time' }
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => onRangeChange(r.id)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                currentRange === r.id
                  ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                  : 'hover:text-slate-900'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-100">
              <th className="py-3 px-4">Page / Route</th>
              <th className="py-3 px-4 text-center">Unique Visitors</th>
              <th className="py-3 px-4 text-center">Total Views</th>
              <th className="py-3 px-4 text-right">Traffic Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3.5 px-4"><div className="w-32 h-4 bg-slate-100 rounded"></div></td>
                  <td className="py-3.5 px-4 text-center"><div className="w-12 h-4 bg-slate-100 rounded mx-auto"></div></td>
                  <td className="py-3.5 px-4 text-center"><div className="w-12 h-4 bg-slate-100 rounded mx-auto"></div></td>
                  <td className="py-3.5 px-4 text-right"><div className="w-16 h-4 bg-slate-100 rounded ml-auto"></div></td>
                </tr>
              ))
            ) : pages.length > 0 ? (
              pages.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-slate-900 truncate flex items-center gap-1.5">
                          <span>{p.name}</span>
                          <span className="font-mono text-[10px] text-slate-400 font-normal">
                            {p.path}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                    {p.uniqueVisitors.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-center font-black text-slate-900">
                    {p.pageViews.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <span className="font-extrabold text-slate-800 text-[11px] w-12 text-right">
                        {p.percentage}%
                      </span>
                      <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden shrink-0">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(p.percentage, 4)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-400 font-semibold text-xs">
                  No page views recorded for the selected date range yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>Total Page Impressions in Period</span>
        <span className="font-black text-slate-900 text-sm">
          {totalViews.toLocaleString('en-IN')} views
        </span>
      </div>
    </div>
  );
}
