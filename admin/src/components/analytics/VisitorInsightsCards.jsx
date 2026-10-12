import React from 'react';
import { 
  Smartphone, Monitor, Tablet, UserPlus, Repeat, 
  Compass, Calendar, Info, ShieldCheck 
} from 'lucide-react';

export default function VisitorInsightsCards({ insightsData, loading }) {
  const d = insightsData?.devices || { desktop: 0, mobile: 0, tablet: 0 };
  const v = insightsData?.visitors || { newVisitors: 0, returningVisitors: 0, total: 0 };
  const referrers = insightsData?.referrers || [];
  const dayOfWeek = insightsData?.dayOfWeek || [];

  const totalDevices = (d.desktop + d.mobile + d.tablet) || 1;
  const desktopPct = Math.round((d.desktop / totalDevices) * 100);
  const mobilePct = Math.round((d.mobile / totalDevices) * 100);
  const tabletPct = Math.round((d.tablet / totalDevices) * 100);

  const totalVisitors = (v.newVisitors + v.returningVisitors) || 1;
  const newPct = Math.round((v.newVisitors / totalVisitors) * 100);
  const returningPct = Math.round((v.returningVisitors / totalVisitors) * 100);

  const maxDayViews = Math.max(...dayOfWeek.map(day => day.views || 0), 1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. DEVICE BREAKDOWN */}
        <div className="bg-white p-4.5 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3.5 min-w-0 overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate">
              Device Platforms
            </h3>
            <span className="text-[10px] font-extrabold text-slate-400 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 shrink-0">
              30 Days
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Desktop */}
            <div>
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 truncate">
                  <Monitor className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  Desktop
                </span>
                <span className="text-slate-900 font-extrabold shrink-0">{d.desktop} ({desktopPct}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(desktopPct, 4)}%` }}></div>
              </div>
            </div>

            {/* Mobile */}
            <div>
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 truncate">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  Mobile
                </span>
                <span className="text-slate-900 font-extrabold shrink-0">{d.mobile} ({mobilePct}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(mobilePct, 4)}%` }}></div>
              </div>
            </div>

            {/* Tablet */}
            <div>
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 truncate">
                  <Tablet className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  Tablet
                </span>
                <span className="text-slate-900 font-extrabold shrink-0">{d.tablet} ({tabletPct}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(tabletPct, 2)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. NEW VS RETURNING BROWSERS */}
        <div className="bg-white p-4.5 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3.5 min-w-0 overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate">
              Audience Loyalty
            </h3>
            <span className="text-[10px] font-extrabold text-slate-400 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 shrink-0">
              Audience
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-100/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                  <UserPlus className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 truncate">New Visitors</div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">First session</div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-black text-blue-700">{v.newVisitors}</div>
                <div className="text-[10px] font-extrabold text-blue-600">{newPct}%</div>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                  <Repeat className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 truncate">Returning</div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">Repeat visits</div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-black text-emerald-700">{v.returningVisitors}</div>
                <div className="text-[10px] font-extrabold text-emerald-600">{returningPct}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. DAY OF WEEK TRAFFIC */}
        <div className="bg-white p-4.5 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3.5 min-w-0 overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate">
              Day-of-Week Trend
            </h3>
            <span className="text-[10px] font-extrabold text-slate-400 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 shrink-0">
              Weekly
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 pt-1 items-end h-[95px]">
            {dayOfWeek.map((day, idx) => {
              const hPct = Math.round(((day.views || 0) / maxDayViews) * 100);
              return (
                <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end group min-w-0">
                  <span className="text-[8.5px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.views}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-md overflow-hidden h-[55px] flex items-end">
                    <div 
                      className="w-full bg-blue-600 rounded-t-md group-hover:bg-blue-700 transition-all"
                      style={{ height: `${Math.max(hPct, 8)}%` }}
                    ></div>
                  </div>
                  <span className="text-[9.5px] font-extrabold text-slate-600 mt-0.5">
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. REFERRAL CHANNELS */}
        <div className="bg-white p-4.5 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3.5 min-w-0 overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate">
              Acquisition Sources
            </h3>
            <span className="text-[10px] font-extrabold text-slate-400 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 shrink-0">
              Channels
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {referrers.length > 0 ? (
              referrers.slice(0, 3).map((r, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-extrabold text-slate-800 truncate">{r.channel}</span>
                  </div>
                  <span className="font-black text-slate-900 font-mono bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-[10.5px] shrink-0">
                    {r.count} visits
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 text-center font-bold text-xs">
                Direct / Organic Traffic
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRIVACY & MEASUREMENT METHODOLOGY DISCLOSURE */}
      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80 flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <span className="font-bold text-slate-900">Privacy-First First-Party Analytics: </span>
          <span>
            CodeGuru tracks visitors using an anonymous first-party device identifier (<code className="bg-white px-1 py-0.5 rounded border border-blue-200 text-blue-700 font-mono text-[11px]">cg_vid</code>). No personally identifiable information or raw IP addresses are permanently retained. Note that if a visitor clears their browser cookies/storage, visits in private/incognito mode, or switches between phone and laptop, they will be counted as a new unique visitor.
          </span>
        </div>
      </div>
    </div>
  );
}
