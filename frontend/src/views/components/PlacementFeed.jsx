'use client';

import React, { useState } from 'react';
import { Sparkles, Calendar, ArrowUpRight, CheckCircle2, Search, Filter } from 'lucide-react';

export default function PlacementFeed({
  placements,
  selectedLocation,
  selectedCategory,
  onResetFilters
}) {
  const [appliedIds, setAppliedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleApply = (id) => {
    if (appliedIds.includes(id)) return;
    setAppliedIds(prev => [...prev, id]);
  };

  const filteredPlacements = placements.filter(item => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = item.company.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.skills.some(s => s.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 px-4 py-4 space-y-4 pb-24">
      {/* Quick Search & Header Banner */}
      <div className="glass-panel p-4 rounded-2xl relative overflow-hidden bg-indigo-700 text-white border border-indigo-500 shadow-md">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-white/20 text-white rounded-full border border-white/30">
              CAMPUS & OFF-CAMPUS 2025-26
            </span>
          </div>
          <h2 className="text-lg font-bold font-heading text-white">
            Placement & Internship Opportunities
          </h2>
          <p className="text-xs text-indigo-100 mt-0.5">
            Verified top tier hiring drives for Phone & Tablet devices.
          </p>

          {/* Search Input Bar */}
          <div className="relative mt-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search companies, roles, skills (e.g. React)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      <div className="flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="font-bold text-slate-700 text-[11px] shrink-0">Filter:</span>
          {selectedLocation && (
            <span className="px-2.5 py-1 bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0">
              📍 {selectedLocation.name}
            </span>
          )}
          {selectedCategory && (
            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0">
              💼 {selectedCategory.label}
            </span>
          )}
        </div>

        {(selectedLocation || (selectedCategory && selectedCategory.id !== 'all')) && (
          <button
            onClick={onResetFilters}
            className="text-[10px] text-indigo-600 font-bold shrink-0"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cards Feed List */}
      <div className="space-y-3">
        {filteredPlacements.length === 0 ? (
          <div className="glass-panel bg-white rounded-2xl p-8 text-center text-slate-500 space-y-3 border border-slate-200 shadow-sm">
            <Filter className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold">No placement drives match your current filter.</p>
            <button
              onClick={onResetFilters}
              className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Show All Drives
            </button>
          </div>
        ) : (
          filteredPlacements.map((item) => {
            const isApplied = appliedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="glass-panel bg-white p-4 rounded-2xl border border-slate-200 relative overflow-hidden shadow-sm"
              >
                {/* Hot Drive Badge */}
                {item.isHot && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-amber-500 text-white font-extrabold text-[9px] px-3 py-0.5 rounded-bl-xl tracking-wider uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-white" /> HOT DRIVE
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <img
                    src={item.logo}
                    alt={item.company}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {item.role}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 truncate">{item.company}</p>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs rounded-lg">
                        {item.package}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                        📍 {item.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skill Chips */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                  {item.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-700 rounded-md border border-slate-200 font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                  <span className="ml-auto text-[10px] text-rose-600 font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.deadline}
                  </span>
                </div>

                {/* Footer Action Bar */}
                <div className="mt-3 flex items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] text-slate-500">
                    Batch: <strong className="text-slate-800">{item.eligibleBatches.join(', ')}</strong>
                  </span>

                  <button
                    onClick={() => handleApply(item.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                      isApplied
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                      </>
                    ) : (
                      <>
                        Apply Drive <ArrowUpRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
