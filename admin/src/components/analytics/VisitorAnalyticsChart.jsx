import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, BarChart2, Calendar, Filter, Eye, Users, 
  ChevronDown, RotateCcw, ArrowRight 
} from 'lucide-react';

export default function VisitorAnalyticsChart({ 
  dailyData, 
  loading, 
  selectedRange, 
  setSelectedRange, 
  grouping, 
  setGrouping, 
  customStart, 
  setCustomStart, 
  customEnd, 
  setCustomEnd, 
  onApplyCustom 
}) {
  const [chartType, setChartType] = useState('line'); // 'line' | 'bar'
  const [activeSeries, setActiveSeries] = useState('both'); // 'both' | 'visitors' | 'views'
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const points = dailyData?.points || [];
  const totals = dailyData?.totals || { pageViews: 0, uniqueVisitors: 0 };

  // Calculate SVG dimensions and coordinate scales
  const chartHeight = 260;
  const chartWidth = 760;
  const padding = { top: 25, right: 30, bottom: 40, left: 45 };

  const usableWidth = chartWidth - padding.left - padding.right;
  const usableHeight = chartHeight - padding.top - padding.bottom;

  // Find max value for Y-axis scale
  const maxValue = useMemo(() => {
    if (!points.length) return 10;
    const maxVal = Math.max(
      ...points.map(p => Math.max(p.pageViews || 0, p.uniqueVisitors || 0))
    );
    if (maxVal === 0) return 10;
    // Round up to nice number
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxVal)));
    return Math.ceil((maxVal * 1.15) / magnitude) * magnitude || 10;
  }, [points]);

  // Compute coordinates for each point
  const coords = useMemo(() => {
    if (!points.length) return [];
    return points.map((p, idx) => {
      const x = padding.left + (points.length === 1 ? usableWidth / 2 : (idx / (points.length - 1)) * usableWidth);
      const yViews = padding.top + usableHeight - ((p.pageViews || 0) / maxValue) * usableHeight;
      const yVisitors = padding.top + usableHeight - ((p.uniqueVisitors || 0) / maxValue) * usableHeight;
      return { ...p, x, yViews, yVisitors, index: idx };
    });
  }, [points, maxValue, usableWidth, usableHeight]);

  // SVG Paths for Line Chart (Smooth Bezier Curve)
  const linePathViews = useMemo(() => {
    if (coords.length === 0) return '';
    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].yViews}`;
    let d = `M ${coords[0].x} ${coords[0].yViews}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 2.5;
      const cpY1 = curr.yViews;
      const cpX2 = curr.x + (next.x - curr.x) / 1.5;
      const cpY2 = next.yViews;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.yViews}`;
    }
    return d;
  }, [coords]);

  const areaPathViews = useMemo(() => {
    if (coords.length < 2) return '';
    const lastX = coords[coords.length - 1].x;
    const firstX = coords[0].x;
    const bottomY = padding.top + usableHeight;
    return `${linePathViews} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [linePathViews, coords, usableHeight]);

  const linePathVisitors = useMemo(() => {
    if (coords.length === 0) return '';
    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].yVisitors}`;
    let d = `M ${coords[0].x} ${coords[0].yVisitors}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 2.5;
      const cpY1 = curr.yVisitors;
      const cpX2 = curr.x + (next.x - curr.x) / 1.5;
      const cpY2 = next.yVisitors;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.yVisitors}`;
    }
    return d;
  }, [coords]);

  const areaPathVisitors = useMemo(() => {
    if (coords.length < 2) return '';
    const lastX = coords[coords.length - 1].x;
    const firstX = coords[0].x;
    const bottomY = padding.top + usableHeight;
    return `${linePathVisitors} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [linePathVisitors, coords, usableHeight]);

  // Y-Axis tick values
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(pct => Math.round(pct * maxValue));

  const hoveredPoint = hoveredIndex !== null && coords[hoveredIndex] ? coords[hoveredIndex] : null;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Website Traffic Analytics
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100">
              Interactive
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Compare unique visitors and page views with selectable date ranges and granularities
          </p>
        </div>

        {/* CONTROLS BAR */}
        <div className="flex flex-wrap items-center gap-2">
          {/* RANGE SELECTOR */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => { setSelectedRange('7d'); setShowCustomPicker(false); }}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                selectedRange === '7d' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => { setSelectedRange('30d'); setShowCustomPicker(false); }}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                selectedRange === '30d' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => { setSelectedRange('thisMonth'); setShowCustomPicker(false); }}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                selectedRange === 'thisMonth' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => { setShowCustomPicker(!showCustomPicker); }}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                selectedRange === 'custom' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Custom
            </button>
          </div>

          {/* GROUPING SELECTOR (Daily, Weekly, Monthly) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setGrouping('daily')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                grouping === 'daily' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setGrouping('weekly')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                grouping === 'weekly' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setGrouping('monthly')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                grouping === 'monthly' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
          </div>

          {/* CHART TYPE TOGGLE (Line vs Bar) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setChartType('line')}
              title="Line Chart View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                chartType === 'line' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              title="Bar Chart View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                chartType === 'bar' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* CUSTOM DATE RANGE MODAL / COLLAPSIBLE POPOVER */}
      {showCustomPicker && (
        <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-wrap items-center gap-3 animate-fade-in text-xs font-semibold">
          <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            Select Custom Range:
          </span>
          <div className="flex items-center gap-2">
            <label className="text-slate-500 font-bold">From:</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-slate-500 font-bold">To:</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => {
              if (customStart && customEnd) {
                setSelectedRange('custom');
                onApplyCustom();
                setShowCustomPicker(false);
              }
            }}
            className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
          >
            Apply Range <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* SERIES TOGGLES & PERIOD SUMMARY */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveSeries(activeSeries === 'visitors' ? 'both' : 'visitors')}
            className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              activeSeries === 'both' || activeSeries === 'visitors'
                ? 'bg-blue-50/80 border-blue-200 text-blue-700 font-extrabold'
                : 'bg-white border-slate-200 text-slate-400 font-medium'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Unique Visitors</span>
            <span className="font-mono text-slate-900 bg-white px-1.5 py-0.2 rounded-md border border-blue-100">
              {totals.uniqueVisitors.toLocaleString('en-IN')}
            </span>
          </button>

          <button
            onClick={() => setActiveSeries(activeSeries === 'views' ? 'both' : 'views')}
            className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              activeSeries === 'both' || activeSeries === 'views'
                ? 'bg-indigo-50/80 border-indigo-200 text-indigo-700 font-extrabold'
                : 'bg-white border-slate-200 text-slate-400 font-medium'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span>Page Views</span>
            <span className="font-mono text-slate-900 bg-white px-1.5 py-0.2 rounded-md border border-indigo-100">
              {totals.pageViews.toLocaleString('en-IN')}
            </span>
          </button>
        </div>

        <div className="text-[11px] font-semibold text-slate-400">
          Showing {points.length} data point{points.length !== 1 ? 's' : ''} ({selectedRange.toUpperCase()})
        </div>
      </div>

      {/* CHART CANVAS (RESPONSIVE SVG) */}
      <div className="relative w-full overflow-hidden select-none">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs flex items-center justify-center z-20">
            <div className="flex items-center gap-2 font-bold text-xs text-blue-600 bg-white px-4 py-2 rounded-2xl shadow-md border border-blue-100">
              <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              Updating Analytics Data...
            </div>
          </div>
        )}

        {points.length === 0 ? (
          <div className="h-[260px] flex flex-col items-center justify-center text-slate-400 space-y-2">
            <BarChart2 className="w-10 h-10 stroke-1" />
            <p className="text-xs font-semibold">No visitor traffic records found for this period</p>
          </div>
        ) : (
          <div className="relative">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-[260px] overflow-visible"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <defs>
                {/* Gradient for Page Views */}
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>

                {/* Gradient for Unique Visitors */}
                <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* HORIZONTAL GRID LINES & Y-AXIS LABELS */}
              {yTicks.map((val, idx) => {
                const y = padding.top + usableHeight - (val / maxValue) * usableHeight;
                return (
                  <g key={idx}>
                    <line 
                      x1={padding.left} 
                      y1={y} 
                      x2={chartWidth - padding.right} 
                      y2={y} 
                      stroke="#f1f5f9" 
                      strokeDasharray={val === 0 ? 'none' : '3,3'}
                      strokeWidth={val === 0 ? '1.5' : '1'}
                    />
                    <text 
                      x={padding.left - 8} 
                      y={y + 3} 
                      textAnchor="end" 
                      fontSize="9.5" 
                      fontWeight="700" 
                      fill="#94a3b8"
                    >
                      {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                    </text>
                  </g>
                );
              })}

              {/* BAR CHART RENDERING */}
              {chartType === 'bar' && coords.map((c, i) => {
                const barGroupWidth = Math.min(usableWidth / coords.length * 0.7, 36);
                const isHovered = hoveredIndex === i;
                const showBoth = activeSeries === 'both';
                const subBarWidth = showBoth ? (barGroupWidth - 4) / 2 : barGroupWidth;

                const viewsH = Math.max(((c.pageViews || 0) / maxValue) * usableHeight, 2);
                const visitorsH = Math.max(((c.uniqueVisitors || 0) / maxValue) * usableHeight, 2);

                const baseY = padding.top + usableHeight;

                return (
                  <g 
                    key={i} 
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                  >
                    {/* Hover column background */}
                    <rect
                      x={c.x - barGroupWidth / 2 - 4}
                      y={padding.top}
                      width={barGroupWidth + 8}
                      height={usableHeight}
                      fill={isHovered ? '#f8fafc' : 'transparent'}
                      rx="4"
                    />

                    {/* Visitors Bar */}
                    {(activeSeries === 'both' || activeSeries === 'visitors') && (
                      <rect
                        x={showBoth ? c.x - barGroupWidth / 2 : c.x - subBarWidth / 2}
                        y={baseY - visitorsH}
                        width={subBarWidth}
                        height={visitorsH}
                        fill={isHovered ? '#1d4ed8' : '#2563eb'}
                        rx="3"
                        className="transition-all duration-150"
                      />
                    )}

                    {/* Views Bar */}
                    {(activeSeries === 'both' || activeSeries === 'views') && (
                      <rect
                        x={showBoth ? c.x - barGroupWidth / 2 + subBarWidth + 4 : c.x - subBarWidth / 2}
                        y={baseY - viewsH}
                        width={subBarWidth}
                        height={viewsH}
                        fill={isHovered ? '#4f46e5' : '#6366f1'}
                        rx="3"
                        className="transition-all duration-150"
                      />
                    )}
                  </g>
                );
              })}

              {/* LINE CHART RENDERING */}
              {chartType === 'line' && (
                <>
                  {/* Page Views Area & Line */}
                  {(activeSeries === 'both' || activeSeries === 'views') && (
                    <>
                      {areaPathViews && <path d={areaPathViews} fill="url(#viewsGradient)" />}
                      <path 
                        d={linePathViews} 
                        fill="none" 
                        stroke="#6366f1" 
                        strokeWidth="2.8" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    </>
                  )}

                  {/* Unique Visitors Area & Line */}
                  {(activeSeries === 'both' || activeSeries === 'visitors') && (
                    <>
                      {areaPathVisitors && <path d={areaPathVisitors} fill="url(#visitorsGradient)" />}
                      <path 
                        d={linePathVisitors} 
                        fill="none" 
                        stroke="#2563eb" 
                        strokeWidth="3.2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    </>
                  )}

                  {/* Data Point Markers */}
                  {coords.map((c, i) => {
                    const isHovered = hoveredIndex === i;
                    return (
                      <g 
                        key={i} 
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(i)}
                      >
                        {/* Interactive invisible hit area */}
                        <circle cx={c.x} cy={c.yVisitors} r="14" fill="transparent" />

                        {(activeSeries === 'both' || activeSeries === 'visitors') && (
                          <circle
                            cx={c.x}
                            cy={c.yVisitors}
                            r={isHovered ? 6 : (coords.length > 20 ? 0 : 3.5)}
                            fill="#ffffff"
                            stroke="#2563eb"
                            strokeWidth={isHovered ? 3 : 2}
                            className="transition-all duration-150"
                          />
                        )}

                        {(activeSeries === 'both' || activeSeries === 'views') && (
                          <circle
                            cx={c.x}
                            cy={c.yViews}
                            r={isHovered ? 5.5 : (coords.length > 20 ? 0 : 3)}
                            fill="#ffffff"
                            stroke="#6366f1"
                            strokeWidth={isHovered ? 2.5 : 1.8}
                            className="transition-all duration-150"
                          />
                        )}
                      </g>
                    );
                  })}
                </>
              )}

              {/* VERTICAL GUIDELINE ON HOVER */}
              {hoveredPoint && (
                <line
                  x1={hoveredPoint.x}
                  y1={padding.top}
                  x2={hoveredPoint.x}
                  y2={padding.top + usableHeight}
                  stroke="#94a3b8"
                  strokeDasharray="3,3"
                  strokeWidth="1.2"
                />
              )}

              {/* X-AXIS LABELS */}
              {coords.map((c, i) => {
                // Skip labels if there are too many points to avoid crowding
                const skipInterval = coords.length > 20 ? 4 : coords.length > 10 ? 2 : 1;
                if (i % skipInterval !== 0 && i !== coords.length - 1) return null;

                return (
                  <text
                    key={i}
                    x={c.x}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight={hoveredIndex === i ? '800' : '600'}
                    fill={hoveredIndex === i ? '#1e293b' : '#94a3b8'}
                  >
                    {c.shortLabel || c.date}
                  </text>
                );
              })}
            </svg>

            {/* FLOATING HOVER TOOLTIP */}
            {hoveredPoint && (
              <div
                className="absolute pointer-events-none z-30 bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl backdrop-blur-md border border-slate-700/60 min-w-[170px] transform -translate-x-1/2 -translate-y-full transition-all duration-75 text-xs"
                style={{
                  left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                  top: `${Math.max((Math.min(hoveredPoint.yVisitors, hoveredPoint.yViews) / chartHeight) * 100 - 8, 10)}%`
                }}
              >
                <div className="font-extrabold text-[11px] text-slate-300 pb-1.5 mb-1.5 border-b border-slate-700 flex items-center justify-between">
                  <span>{hoveredPoint.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{hoveredPoint.date}</span>
                </div>

                <div className="space-y-1 font-semibold">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-blue-400">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Unique Visitors:
                    </span>
                    <span className="font-extrabold text-white">
                      {(hoveredPoint.uniqueVisitors || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-indigo-400">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      Page Views:
                    </span>
                    <span className="font-extrabold text-white">
                      {(hoveredPoint.pageViews || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                    <span>Views / Visitor:</span>
                    <span className="font-bold text-slate-200">
                      {hoveredPoint.uniqueVisitors > 0 
                        ? ((hoveredPoint.pageViews || 0) / hoveredPoint.uniqueVisitors).toFixed(1) 
                        : '0.0'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
