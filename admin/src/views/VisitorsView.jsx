import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, Eye, Calendar, Globe, RefreshCw, Radio, 
  TrendingUp, BarChart2, ShieldCheck 
} from 'lucide-react';
import { analyticsModel } from '../models/analyticsModel';
import AnalyticsCards from '../components/analytics/AnalyticsCards';
import VisitorAnalyticsChart from '../components/analytics/VisitorAnalyticsChart';
import TopPagesTable from '../components/analytics/TopPagesTable';
import VisitorInsightsCards from '../components/analytics/VisitorInsightsCards';

export default function VisitorsView() {
  const [summary, setSummary] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [topPagesData, setTopPagesData] = useState(null);
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [chartRange, setChartRange] = useState('7d');
  const [chartGrouping, setChartGrouping] = useState('daily');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [topPagesRange, setTopPagesRange] = useState('7d');

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [sum, daily, pages, insights] = await Promise.all([
        analyticsModel.getSummary(),
        analyticsModel.getDailyData({
          range: chartRange,
          startDate: customStart,
          endDate: customEnd,
          grouping: chartGrouping
        }),
        analyticsModel.getTopPages({ range: topPagesRange }),
        analyticsModel.getInsights(chartRange === '7d' ? '7d' : '30d')
      ]);

      if (sum) setSummary(sum);
      if (daily) setDailyData(daily);
      if (pages) setTopPagesData(pages);
      if (insights) setInsightsData(insights);
    } catch (err) {
      console.warn('[VisitorsView] Error fetching visitor analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [chartRange, chartGrouping, customStart, customEnd, topPagesRange]);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Real-time auto-refresh every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(true);
    }, 20000);
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* TOP HEADER BANNER */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Website Visitor Analytics • MongoDB Atlas Real-Time Tracking
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight font-heading text-slate-900">
              Website <span className="text-blue-600">Visitor Analytics</span>
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl font-medium leading-normal">
              Track live active visitors, daily traffic trends, unique impressions, top visited pages, and device distributions across the CodeGuru platform.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => loadData(false)}
              disabled={loading}
              title="Refresh Analytics Data"
              className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              <span>Refresh</span>
            </button>

            <div className="bg-rose-50 px-3.5 py-2 rounded-2xl border border-rose-100 text-right">
              <div className="text-[9px] font-extrabold text-rose-500 uppercase tracking-wider flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
                Live Now
              </div>
              <div className="text-lg font-black text-rose-600">
                {summary?.liveVisitors ?? 0} Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. TOP STATS CARDS */}
      <AnalyticsCards 
        summary={summary} 
        loading={loading} 
      />

      {/* 2. INTERACTIVE TRAFFIC CHART */}
      <VisitorAnalyticsChart
        dailyData={dailyData}
        loading={loading}
        selectedRange={chartRange}
        setSelectedRange={setChartRange}
        grouping={chartGrouping}
        setGrouping={setChartGrouping}
        customStart={customStart}
        setCustomStart={setCustomStart}
        customEnd={customEnd}
        setCustomEnd={setCustomEnd}
        onApplyCustom={() => loadData(false)}
      />

      {/* 3. VISITOR AUDIENCE INSIGHTS */}
      <VisitorInsightsCards
        insightsData={insightsData}
        loading={loading}
      />

      {/* 4. TOP PAGES REPORT */}
      <TopPagesTable
        topPagesData={topPagesData}
        loading={loading}
        currentRange={topPagesRange}
        onRangeChange={(newRange) => setTopPagesRange(newRange)}
      />
    </div>
  );
}
