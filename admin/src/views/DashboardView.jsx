import React, { useState } from 'react';
import { 
  Users, DollarSign, GraduationCap, UserCheck, TrendingUp, PhoneCall, 
  BookOpen, Calendar, AlertTriangle, ArrowUpRight, ArrowDownRight, 
  CheckCircle2, Clock, MapPin, Eye, FileText, Award, Layers, Search, Filter
} from 'lucide-react';

export default function DashboardView({ leads, stats, searchQuery, onUpdateStatus, onDeleteLead, onNavigateToLeads }) {
  // Enhanced Executive Metrics
  const revenueStats = {
    todayRevenue: '₹45,000',
    monthlyRevenue: '₹4,85,000',
    pendingFees: '₹1,20,000',
    todayAdmissions: 5,
    activeStudents: 128,
    attendanceRate: '92.4%',
    conversionRate: '28.5%',
    callsMadeToday: 68
  };

  return (
    <div className="space-y-8">
      {/* HEADER BANNER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-extrabold border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Live Executive ERP Dashboard • CodeGuru v2.0
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading text-slate-900">
              Welcome back, <span className="text-blue-600">Super Admin</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl font-medium leading-relaxed">
              Here is your real-time institute overview: track revenue, admissions, active student attendance, and counselor performance.
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/80 text-right">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Today's Revenue</div>
              <div className="text-xl font-black text-emerald-600">{revenueStats.todayRevenue}</div>
            </div>
            <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/80 text-right">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">New Admissions</div>
              <div className="text-xl font-black text-blue-600">+{revenueStats.todayAdmissions} Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* TOP ROW EXECUTIVE METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Monthly Collection', value: revenueStats.monthlyRevenue, sub: 'Target: ₹5.5L (88%)', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', trend: '+14.2%' },
          { label: 'Pending Fees', value: revenueStats.pendingFees, sub: '12 Students Overdue', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-100', trend: 'Action Needed' },
          { label: 'Active Students', value: revenueStats.activeStudents, sub: 'Across 6 Active Batches', icon: GraduationCap, color: 'text-blue-600 bg-blue-50 border-blue-100', trend: '100% Enrolled' },
          { label: 'Today Attendance', value: revenueStats.attendanceRate, sub: '118/128 Present', icon: UserCheck, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', trend: 'High' },
          { label: 'Conversion Rate', value: revenueStats.conversionRate, sub: '38/133 Converted', icon: TrendingUp, color: 'text-purple-600 bg-purple-50 border-purple-100', trend: '+3.5%' }
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {m.trend}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{m.label}</span>
                <div className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">{m.value}</div>
                <p className="text-[11px] font-medium text-slate-500 mt-1">{m.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECOND ROW: QUICK ERP NAVIGATION SHORTCUTS & LIVE SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REVENUE & COLLECTION BREAKDOWN */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Course Revenue Breakdown</h2>
            <span className="text-xs font-bold text-blue-600">This Month</span>
          </div>

          <div className="space-y-3 text-xs font-medium">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-800">Full Stack Web Dev (MERN)</span>
                <span className="text-slate-900">₹2,45,000 (50%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[50%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-800">Data Science & AI Masterclass</span>
                <span className="text-slate-900">₹1,40,000 (29%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full w-[29%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-800">Python Data Analytics</span>
                <span className="text-slate-900">₹1,00,000 (21%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-[21%]"></div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">Total Month Collection</span>
            <span className="text-emerald-600 text-sm font-black">₹4,85,000</span>
          </div>
        </div>

        {/* COUNSELOR SALES LEADERBOARD */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Counselor Performance</h2>
            <span className="text-xs font-bold text-slate-400">September</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Priya Sharma', converted: '18 Admissions', rate: '32%', color: 'bg-emerald-500' },
              { name: 'Rajesh Patil', converted: '12 Admissions', rate: '27%', color: 'bg-blue-500' },
              { name: 'Neha Deshmukh', converted: '8 Admissions', rate: '22%', color: 'bg-indigo-500' }
            ].map((c, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900">{c.name}</div>
                    <div className="text-[10px] font-semibold text-slate-500">{c.converted}</div>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {c.rate} Conv.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BATCH ATTENDANCE ALERT WIDGET */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Low Attendance Alerts</h2>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">&lt; 75% Warning</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Karan Mehra', batch: 'Python Analytics DA-09', attendance: '68%', phone: '9765409876' },
              { name: 'Suresh Raina', batch: 'Full Stack MERN FS-42', attendance: '71%', phone: '9876512340' }
            ].map((s, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">{s.name}</span>
                  <span className="text-xs font-black text-rose-600">{s.attendance} Attendance</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>{s.batch}</span>
                  <span className="font-mono text-slate-700">+91 {s.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT LEADS & INQUIRIES QUICK TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900">Recent Lead Inquiries</h2>
            <p className="text-xs font-semibold text-slate-500">Real-time prospective student leads submitted via website & campaigns</p>
          </div>
          <button
            onClick={onNavigateToLeads}
            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-extrabold text-xs transition-all cursor-pointer shrink-0"
          >
            View All {stats.totalLeads} Leads →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-100">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {leads.slice(0, 5).map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">{l.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">+91 {l.phone}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{l.course}</td>
                  <td className="py-3.5 px-4 text-slate-500">{l.city || 'Pune'}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      l.status === 'Enrolled' ? 'bg-emerald-100 text-emerald-700' :
                      l.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      l.status === 'Contacted' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {l.status || 'New'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={l.status || 'New'}
                      onChange={(e) => onUpdateStatus(l.id, e.target.value)}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold focus:outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Enrolled">Enrolled</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
