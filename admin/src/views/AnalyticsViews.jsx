import React, { useState } from 'react';
import { 
  BarChart2, TrendingUp, Users, DollarSign, Award, Calendar, 
  Download, FileSpreadsheet, Filter, CheckCircle2, UserCheck 
} from 'lucide-react';

// ==========================================
// 1. DEDICATED REPORTS CENTER (11 CATEGORIES)
// ==========================================
export function ReportsView() {
  const reportsList = [
    { title: '1. Lead Inquiries Master Report', desc: 'Source-wise, city-wise & status breakdown of all leads.', category: 'CRM' },
    { title: '2. Student Admission Master Report', desc: 'Enrolled students, courses, discount & counselor allocation.', category: 'Admissions' },
    { title: '3. Total Revenue & Collection Report', desc: 'Itemized fee collections, payment modes (UPI/Cash/NEFT) & GST tax.', category: 'Finance' },
    { title: '4. Pending & Overdue Fee Report', desc: 'Student installment due dates, overdue amounts & pending balances.', category: 'Finance' },
    { title: '5. Student & Batch Attendance Report', desc: 'Daily/monthly batch attendance registers & < 75% warning logs.', category: 'Academic' },
    { title: '6. Course-wise Enrollment Report', desc: 'Student volume per course, total revenue per course & completion rate.', category: 'Courses' },
    { title: '7. Batch Occupancy & Schedule Report', desc: 'Batch start/end dates, max seat capacity & trainer allocations.', category: 'Batches' },
    { title: '8. Counselor Performance Leaderboard', desc: 'Call volume, leads assigned, follow-ups completed & conversion %.', category: 'Sales' },
    { title: '9. City-wise Lead & Admission Report', desc: 'Regional inquiry distribution across Pune, Sambhajinagar, etc.', category: 'Analytics' },
    { title: '10. Monthly Business Growth Report', desc: 'Month-over-month revenue growth, new student enrollments & targets.', category: 'Growth' },
    { title: '11. Lead Conversion Funnel Report', desc: 'Conversion percentages across all 7 pipeline stages.', category: 'Funnel' }
  ];

  const downloadReport = (title) => {
    alert(`Generating & Downloading ${title} in CSV / Excel format...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Dedicated Reports & Analytics Hub</h1>
          <p className="text-xs font-semibold text-slate-500">Generate & export 11 enterprise reports in CSV, Excel & PDF formats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsList.map((r, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase">{r.category}</span>
              <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">{r.title}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">{r.desc}</p>
            </div>
            <button
              onClick={() => downloadReport(r.title)}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV / Excel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. REVENUE ANALYTICS VIEW
// ==========================================
export function RevenueAnalyticsView() {
  const monthData = [
    { month: 'May 2026', total: '₹3,20,000', count: 14, growth: '+12%' },
    { month: 'Jun 2026', total: '₹3,80,000', count: 16, growth: '+18%' },
    { month: 'Jul 2026', total: '₹4,10,000', count: 18, growth: '+8%' },
    { month: 'Aug 2026', total: '₹4,50,000', count: 20, growth: '+10%' },
    { month: 'Sep 2026 (MTD)', total: '₹4,85,000', count: 22, growth: '+15%' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Revenue & Collection Analytics</h1>
          <p className="text-xs font-semibold text-slate-500">Track month-over-month collection growth, course contribution & pending fee trends</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-right shrink-0">
          <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">Total Month Revenue</span>
          <span className="text-xl font-black text-emerald-600">₹4,85,000</span>
        </div>
      </div>

      {/* MONTHLY REVENUE BARS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="text-base font-black text-slate-900">Month-over-Month Revenue Growth</h3>
        <div className="space-y-3">
          {monthData.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="font-extrabold text-slate-900 w-32">{m.month}</div>
              <div className="flex-1 max-w-md bg-slate-200 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(idx + 1) * 20}%` }}></div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <span className="font-black text-slate-900 text-sm">{m.total}</span>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">{m.growth}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. ADMISSION ANALYTICS VIEW
// ==========================================
export function AdmissionAnalyticsView() {
  const sources = [
    { name: 'Website Form Inquiry', leads: 64, converted: 18, rate: '28%' },
    { name: 'Google Ads & SEO', leads: 42, converted: 12, rate: '28%' },
    { name: 'Instagram & Meta Ads', leads: 35, converted: 8, rate: '22%' },
    { name: 'Campus & Walk-in Referral', leads: 15, converted: 7, rate: '46%' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Admission & Lead Conversion Funnel</h1>
        <p className="text-xs font-semibold text-slate-500">Track lead source efficacy, campaign ROI & conversion percentages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((s, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">{s.name}</h3>
              <span className="text-xs font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">{s.rate} Conv.</span>
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>Total Leads: <strong>{s.leads}</strong></span>
              <span>Enrolled Students: <strong className="text-emerald-600">{s.converted}</strong></span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: s.rate }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. STUDENT ANALYTICS VIEW
// ==========================================
export function StudentAnalyticsView() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Student Academic & Demographic Analytics</h1>
        <p className="text-xs font-semibold text-slate-500">Overview of active student population, retention, attendance & completion metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2 text-center">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Students</span>
          <div className="text-3xl font-black text-blue-600">128</div>
          <p className="text-xs text-slate-500 font-medium">Across 6 Batches</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2 text-center">
          <span className="text-xs font-bold text-slate-400 uppercase">Average Attendance</span>
          <div className="text-3xl font-black text-emerald-600">91.5%</div>
          <p className="text-xs text-slate-500 font-medium">Daily Active Presence</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2 text-center">
          <span className="text-xs font-bold text-slate-400 uppercase">Course Completion</span>
          <div className="text-3xl font-black text-indigo-600">96%</div>
          <p className="text-xs text-slate-500 font-medium">Certification Success</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. COUNSELOR PERFORMANCE VIEW
// ==========================================
export function CounselorPerformanceView() {
  const counselors = [
    { name: 'Priya Sharma', role: 'Senior Admission Counselor', calls: 420, leads: 120, conversions: 18, rate: '32%', rating: '4.9 ★' },
    { name: 'Rajesh Patil', role: 'Academic Counselor', calls: 350, leads: 95, conversions: 12, rate: '27%', rating: '4.7 ★' },
    { name: 'Neha Deshmukh', role: 'Inquiry Specialist', calls: 280, leads: 80, conversions: 8, rate: '22%', rating: '4.5 ★' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Counselor Performance & Sales Leaderboard</h1>
        <p className="text-xs font-semibold text-slate-500">Track counselor call volumes, lead response times & admission conversion efficiency</p>
      </div>

      <div className="space-y-3">
        {counselors.map((c, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center">
                #{idx + 1}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{c.name}</h3>
                <p className="text-slate-400 font-medium text-[11px]">{c.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-slate-600 font-semibold flex-wrap">
              <div>Calls Made: <strong className="text-slate-900">{c.calls}</strong></div>
              <div>Leads Handled: <strong className="text-slate-900">{c.leads}</strong></div>
              <div>Admissions: <strong className="text-emerald-600">{c.conversions}</strong></div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-black rounded-lg border border-emerald-100">{c.rate} Conv.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

