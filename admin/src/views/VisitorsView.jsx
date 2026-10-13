import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Users, Eye, Calendar, Globe, RefreshCw, Radio, 
  TrendingUp, BarChart2, ShieldCheck, Wifi, WifiOff 
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
  const [streamConnected, setStreamConnected] = useState(false);

  // Filter States
  const [chartRange, setChartRange] = useState('7d');
  const [chartGrouping, setChartGrouping] = useState('daily');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [topPagesRange, setTopPagesRange] = useState('7d');

  const streamConnectedRef = useRef(false);
  streamConnectedRef.current = streamConnected;

  // Comprehensive data fetcher for charts, reports, and summary
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

  // Initial load
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // 1. Real-time Server-Sent Events (SSE) Stream
  useEffect(() => {
    const unsubscribe = analyticsModel.subscribeStream(
      (streamData) => {
        setStreamConnected(true);
        if (streamData) {
          setSummary((prev) => ({
            ...prev,
            ...streamData
          }));
        }
      },
      (isConnected) => {
        setStreamConnected(isConnected);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // 2. High-availability Polling Fallback (5 seconds) when SSE is disconnected
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      if (!streamConnectedRef.current) {
        try {
          const sum = await analyticsModel.getSummary();
          if (sum) setSummary(sum);
        } catch (e) {}
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  // 3. Periodic background refresh for charts, top pages, and insights (every 25 seconds)
  useEffect(() => {
    const reportInterval = setInterval(() => {
      loadData(true);
    }, 25000);

    return () => clearInterval(reportInterval);
  }, [loadData]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* TOP HEADER BANNER */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border transition-all ${
              streamConnected 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${streamConnected ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`}></span>
              {streamConnected 
                ? 'Live Real-Time Stream Connected • MongoDB Atlas' 
                : 'Reconnecting Live Stream (Fallback Polling Active)...'}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight font-heading text-slate-900">
              Website <span className="text-blue-600">Visitor Analytics</span>
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl font-medium leading-normal">
              Track live active visitors, daily traffic trends, unique impressions, top visited pages, and device distributions across the CodeGuru platform.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* MANUAL REFRESH BUTTON */}
            <button
              onClick={() => loadData(false)}
              disabled={loading}
              title="Refresh Analytics Data"
              className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              <span>Refresh</span>
            </button>

            {/* LIVE ACTIVE VISITORS BADGE */}
            <div className={`${streamConnected ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-200'} px-3.5 py-2 rounded-2xl border text-right transition-all`}>
              <div className={`text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 justify-end ${streamConnected ? 'text-rose-500' : 'text-slate-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${streamConnected ? 'bg-rose-600 animate-ping' : 'bg-slate-400'}`}></span>
                {streamConnected ? 'Live Now' : 'Standby'}
              </div>
              <div className={`text-lg font-black ${streamConnected ? 'text-rose-600' : 'text-slate-700'}`}>
                {summary?.liveVisitors ?? 0} Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. TOP STATS CARDS WITH LIVE NUMBER CHANGE HIGHLIGHT */}
      <AnalyticsCards 
        summary={summary} 
        loading={loading} 
        streamConnected={streamConnected}
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
