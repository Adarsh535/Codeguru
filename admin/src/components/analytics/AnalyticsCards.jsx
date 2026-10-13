import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Eye, Calendar, Globe, Activity, TrendingUp, TrendingDown,
  Clock, ArrowUpRight, ArrowDownRight, Radio
} from 'lucide-react';

export default function AnalyticsCards({ summary, loading, streamConnected = true }) {
  const [highlightedKeys, setHighlightedKeys] = useState({});
  const prevValues = useRef({});

  useEffect(() => {
    if (!summary) return;

    const changes = {};
    const metricKeys = [
      'todayVisitors', 
      'todayPageViews', 
      'yesterdayVisitors', 
      'totalVisitors', 
      'thisMonthVisitors', 
      'liveVisitors'
    ];

    metricKeys.forEach((key) => {
      if (prevValues.current[key] !== undefined && prevValues.current[key] !== summary[key]) {
        changes[key] = true;
      }
      prevValues.current[key] = summary[key];
    });

    if (Object.keys(changes).length > 0) {
      setHighlightedKeys(changes);
      const timer = setTimeout(() => {
        setHighlightedKeys({});
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [summary]);

  if (loading && !summary) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-4.5 rounded-2xl border border-slate-200/80 animate-pulse space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-xl bg-slate-100"></div>
              <div className="w-12 h-4 rounded-full bg-slate-100"></div>
            </div>
            <div className="space-y-1.5">
              <div className="w-14 h-3 bg-slate-100 rounded-sm"></div>
              <div className="w-20 h-6 bg-slate-100 rounded-sm"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const s = summary || {};
  const todayVisitors = s.todayVisitors ?? 0;
  const todayPageViews = s.todayPageViews ?? 0;
  const yesterdayVisitors = s.yesterdayVisitors ?? 0;
  const totalVisitors = s.totalVisitors ?? 0;
  const thisMonthVisitors = s.thisMonthVisitors ?? 0;
  const liveVisitors = s.liveVisitors ?? 0;

  const visitorGrowth = s.visitorGrowthPct ?? 0;
  const viewsGrowth = s.viewsGrowthPct ?? 0;

  const cards = [
    {
      id: 'today-visitors',
      fieldKey: 'todayVisitors',
      title: "Today's Visitors",
      value: todayVisitors.toLocaleString('en-IN'),
      subtitle: visitorGrowth >= 0 ? `+${visitorGrowth}% vs yesterday` : `${visitorGrowth}% vs yesterday`,
      icon: Users,
      trendUp: visitorGrowth >= 0,
      badge: 'Today',
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      valueColor: 'text-slate-900'
    },
    {
      id: 'today-page-views',
      fieldKey: 'todayPageViews',
      title: "Today's Page Views",
      value: todayPageViews.toLocaleString('en-IN'),
      subtitle: viewsGrowth >= 0 ? `+${viewsGrowth}% vs yesterday` : `${viewsGrowth}% vs yesterday`,
      icon: Eye,
      trendUp: viewsGrowth >= 0,
      badge: 'Views',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      valueColor: 'text-slate-900'
    },
    {
      id: 'yesterday-visitors',
      fieldKey: 'yesterdayVisitors',
      title: "Yesterday's Visitors",
      value: yesterdayVisitors.toLocaleString('en-IN'),
      subtitle: `${s.yesterdayPageViews || 0} views yesterday`,
      icon: Clock,
      badge: 'Yesterday',
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      valueColor: 'text-slate-900'
    },
    {
      id: 'total-visitors',
      fieldKey: 'totalVisitors',
      title: "Total Visitors",
      value: totalVisitors.toLocaleString('en-IN'),
      subtitle: `${(s.totalPageViews || 0).toLocaleString('en-IN')} total views`,
      icon: Globe,
      badge: 'All Time',
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      valueColor: 'text-slate-900'
    },
    {
      id: 'month-visitors',
      fieldKey: 'thisMonthVisitors',
      title: "This Month's Visitors",
      value: thisMonthVisitors.toLocaleString('en-IN'),
      subtitle: 'This calendar month',
      icon: Calendar,
      badge: 'Month',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      valueColor: 'text-slate-900'
    },
    {
      id: 'live-visitors',
      fieldKey: 'liveVisitors',
      title: "Live Visitors",
      value: liveVisitors.toLocaleString('en-IN'),
      subtitle: liveVisitors > 0 ? 'Browsing right now' : 'Standby / listening',
      icon: Radio,
      badge: 'LIVE',
      isLive: true,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      valueColor: 'text-rose-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((c) => {
        const Icon = c.icon;
        const isHighlighted = highlightedKeys[c.fieldKey];

        return (
          <div 
            key={c.id} 
            className={`bg-white p-4 sm:p-4.5 rounded-2xl border transition-all duration-300 group flex flex-col justify-between min-w-0 ${
              isHighlighted 
                ? 'border-blue-500/80 ring-2 ring-blue-500/25 shadow-md scale-[1.015]' 
                : 'border-slate-200/80 shadow-2xs hover:shadow-md'
            }`}
          >
            {/* Top Icon & Badge Row */}
            <div className="flex items-center justify-between gap-1.5 mb-2.5">
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${c.color}`}>
                <Icon className={`w-4 h-4 ${c.isLive ? 'animate-pulse' : ''}`} />
              </div>
              {c.isLive ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200/60 shadow-2xs shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  LIVE
                </span>
              ) : (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 shrink-0">
                  {c.badge}
                </span>
              )}
            </div>

            {/* Title, Value, Subtitle */}
            <div className="min-w-0 space-y-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight block truncate" title={c.title}>
                {c.title}
              </span>
              <div className={`text-xl sm:text-2xl font-black tracking-tight leading-tight transition-transform duration-200 ${c.valueColor} ${
                isHighlighted ? 'scale-105 origin-left' : ''
              }`}>
                {c.value}
              </div>
              <p className="text-[10.5px] font-medium text-slate-500 truncate mt-0.5" title={c.subtitle}>
                {c.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
