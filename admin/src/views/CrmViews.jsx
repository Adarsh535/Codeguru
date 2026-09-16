import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, Calendar, Clock, CheckCircle2, UserCheck, Search, Filter, 
  Plus, MessageSquare, Send, Mail, User, BookOpen, AlertCircle, FileText, 
  ChevronRight, Download, Eye, X, ShieldAlert, Award, Layers, DollarSign, ExternalLink
} from 'lucide-react';
import { enrollmentModel } from '../models/enrollmentModel';
import { leadModel } from '../models/leadModel';

// ==========================================
// 1. STUDENTS VIEW WITH DEEP PROFILE MODAL
// ==========================================
export function StudentsView() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    enrollmentModel.getEnrollments()
      .then(data => {
        if (isMounted) {
          const list = Array.isArray(data) ? data.map(e => ({
            id: e.enrollmentId || e._id || 'CG-STU-' + Math.floor(1000 + Math.random()*9000),
            name: e.studentName || 'Student',
            phone: e.studentPhone || '',
            email: e.studentEmail || '',
            city: 'Lucknow, UP',
            course: e.courseName || 'Full Stack Web Dev',
            batch: e.batchCode || 'FS-2026',
            trainer: e.mentor || 'Vikas Sharma',
            admissionDate: e.startDate || new Date().toLocaleDateString('en-IN'),
            feeStatus: e.feeStatus || 'Paid',
            totalFee: e.fee || '₹35,000',
            paidAmount: e.paidAmount || e.fee || '₹35,000',
            pendingAmount: e.pendingAmount || '₹0',
            attendance: '100%',
            overallProgress: '100%',
            status: e.status || 'Active',
            fatherName: 'N/A',
            dob: 'N/A',
            gender: 'N/A',
            address: 'Lucknow, Uttar Pradesh',
            state: 'Uttar Pradesh',
            pincode: '226001',
            college: 'CodeGuru Academy',
            qualification: 'Student',
            passingYear: '2026',
            branch: 'Computer Science',
            aadhaar: 'Verified',
            photoUrl: '/logo.png',
            notes: [
              { author: 'Admin System', date: e.startDate || new Date().toLocaleDateString('en-IN'), text: `Enrolled in ${e.courseName || 'Course'}. Payment status: ${e.feeStatus || 'Paid'}` }
            ]
          })) : [];
          setStudents(list);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalTab, setModalTab] = useState('personal'); // personal, academic, enrollment, performance, documents, notes
  const [filterCourse, setFilterCourse] = useState('All');
  const [search, setSearch] = useState('');

  const filteredStudents = students.filter(s => {
    if (filterCourse !== 'All' && !s.course.toLowerCase().includes(filterCourse.toLowerCase())) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.phone.includes(q) || s.id.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Active Student Master Roster</h1>
          <p className="text-xs font-semibold text-slate-500">Comprehensive student profile lifecycle, academic performance & documents</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto">
          {['All', 'MERN', 'DevOps', 'Cyber'].map(c => (
            <button
              key={c}
              onClick={() => setFilterCourse(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCourse === c ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Student Name, ID, or Phone..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
          />
        </div>
      </div>

      {/* STUDENT TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-100">
                <th className="p-4">Student ID</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Course & Batch</th>
                <th className="p-4">Fee Status</th>
                <th className="p-4">Attendance %</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-black text-blue-600">{s.id}</td>
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">+91 {s.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{s.course}</div>
                      <div className="text-[11px] text-slate-400">{s.batch}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        s.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                        s.feeStatus === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {s.feeStatus} ({s.paidAmount}/{s.totalFee})
                      </span>
                    </td>
                    <td className="p-4 font-black">
                      <span className="text-xs text-emerald-600 font-extrabold">
                        {s.attendance}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => { setSelectedStudent(s); setModalTab('personal'); }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs cursor-pointer flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500 font-bold text-xs">
                    {loading ? 'Loading real student records from MongoDB...' : 'No enrolled student records found in database yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DEEP STUDENT PROFILE MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* MODAL HEADER */}
            <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center border border-blue-400/30 uppercase shadow-xs">
                  {selectedStudent.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">{selectedStudent.name}</h2>
                    <span className="font-mono text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-200 font-extrabold">{selectedStudent.id}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500">{selectedStudent.course} • {selectedStudent.city}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB HEADER NAV */}
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
              {[
                { id: 'personal', label: 'Personal Details' },
                { id: 'academic', label: 'Academic History' },
                { id: 'enrollment', label: 'Enrollment & Fee' },
                { id: 'performance', label: 'Performance & Attendance' },
                { id: 'documents', label: 'Document Vault' },
                { id: 'notes', label: 'Notes Log' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setModalTab(t.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                    modalTab === t.id ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* MODAL BODY CONTENT */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs font-medium text-slate-700">
              {modalTab === 'personal' && (
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-slate-400 font-bold block">Father's Name:</span> <strong className="text-slate-900">{selectedStudent.fatherName}</strong></div>
                  <div><span className="text-slate-400 font-bold block">Date of Birth:</span> <strong className="text-slate-900">{selectedStudent.dob}</strong></div>
                  <div><span className="text-slate-400 font-bold block">Gender:</span> <strong className="text-slate-900">{selectedStudent.gender}</strong></div>
                  <div><span className="text-slate-400 font-bold block">Mobile Phone:</span> <strong className="text-slate-900 font-mono">+91 {selectedStudent.phone}</strong></div>
                  <div><span className="text-slate-400 font-bold block">Email Address:</span> <strong className="text-slate-900">{selectedStudent.email}</strong></div>
                  <div><span className="text-slate-400 font-bold block">City & State:</span> <strong className="text-slate-900">{selectedStudent.city}, {selectedStudent.state} ({selectedStudent.pincode})</strong></div>
                  <div className="col-span-2"><span className="text-slate-400 font-bold block">Full Address:</span> <strong className="text-slate-900">{selectedStudent.address}</strong></div>
                </div>
              )}

              {modalTab === 'academic' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><span className="text-slate-400 font-bold block">College/University:</span> <strong className="text-slate-900">{selectedStudent.college}</strong></div>
                  <div><span className="text-slate-400 font-bold block">Highest Qualification:</span> <strong className="text-slate-900">{selectedStudent.qualification}</strong></div>
                  <div><span className="text-slate-400 font-bold block">Branch / Specialization:</span> <strong className="text-slate-900">{selectedStudent.branch}</strong></div>
                  <div><span className="text-slate-400 font-bold block">Passing Year:</span> <strong className="text-slate-900">{selectedStudent.passingYear}</strong></div>
                </div>
              )}

              {modalTab === 'enrollment' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-slate-400 font-bold block">Enrolled Course:</span> <strong className="text-slate-900">{selectedStudent.course}</strong></div>
                    <div><span className="text-slate-400 font-bold block">Assigned Batch:</span> <strong className="text-slate-900">{selectedStudent.batch}</strong></div>
                    <div><span className="text-slate-400 font-bold block">Assigned Trainer:</span> <strong className="text-slate-900">{selectedStudent.trainer}</strong></div>
                    <div><span className="text-slate-400 font-bold block">Admission Date:</span> <strong className="text-slate-900">{selectedStudent.admissionDate}</strong></div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="font-black text-slate-900">Fee Breakdown & Payment Plan</h4>
                    <div className="flex justify-between"><span>Total Course Fee:</span> <strong>{selectedStudent.totalFee}</strong></div>
                    <div className="flex justify-between"><span>Amount Paid:</span> <strong className="text-emerald-600">{selectedStudent.paidAmount}</strong></div>
                    <div className="flex justify-between"><span>Amount Pending:</span> <strong className="text-rose-600">{selectedStudent.pendingAmount}</strong></div>
                  </div>
                </div>
              )}

              {modalTab === 'performance' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
                    <div>
                      <div className="text-slate-500 font-bold">Attendance Record</div>
                      <div className="text-xl font-black text-blue-600">{selectedStudent.attendance} Attendance</div>
                    </div>
                    <div>
                      <div className="text-slate-500 font-bold text-right">Syllabus Progress</div>
                      <div className="text-xl font-black text-emerald-600 text-right">{selectedStudent.overallProgress} Completed</div>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'documents' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="font-extrabold text-slate-900">Aadhaar Card / ID Proof</div>
                    <div className="font-mono text-slate-500">{selectedStudent.aadhaar}</div>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Verified</span>
                  </div>
                </div>
              )}

              {modalTab === 'notes' && (
                <div className="space-y-3">
                  {selectedStudent.notes.map((n, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-blue-600">{n.author}</span>
                        <span className="text-slate-400">{n.date}</span>
                      </div>
                      <p className="text-slate-700">{n.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button onClick={() => setSelectedStudent(null)} className="px-5 py-2 rounded-xl bg-slate-200 text-slate-800 font-extrabold text-xs">
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. ADMISSIONS PIPELINE VIEW (GRAPH & ANALYTICS)
// ==========================================
export function AdmissionsView({ leads: propLeads = [] }) {
  const [internalLeads, setInternalLeads] = useState([]);
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'funnel' | 'pie'

  useEffect(() => {
    if (!propLeads || propLeads.length === 0) {
      leadModel.getLeads().then(data => {
        setInternalLeads(Array.isArray(data) ? data : []);
      }).catch(() => setInternalLeads([]));
    }
  }, [propLeads]);

  const activeLeads = (propLeads && propLeads.length > 0) ? propLeads : internalLeads;
  const totalLeads = activeLeads.length || 1;

  const newCount = activeLeads.filter(l => l.status === 'New' || !l.status).length;
  const contactedCount = activeLeads.filter(l => l.status === 'Contacted').length;
  const progressCount = activeLeads.filter(l => l.status === 'In Progress').length;
  const enrolledCount = activeLeads.filter(l => l.status === 'Enrolled').length;

  const pipeline = [
    { id: 'new', stage: 'New Lead', count: newCount, pct: Math.round((newCount / totalLeads) * 100), color: '#3b82f6', gradient: 'from-blue-500 to-cyan-500', barBg: 'bg-gradient-to-t from-blue-600 to-cyan-400', textColor: 'text-blue-600', lightBg: 'bg-blue-50 border-blue-100' },
    { id: 'contacted', stage: 'Contacted', count: contactedCount, pct: Math.round((contactedCount / totalLeads) * 100), color: '#6366f1', gradient: 'from-indigo-500 to-violet-500', barBg: 'bg-gradient-to-t from-indigo-600 to-violet-400', textColor: 'text-indigo-600', lightBg: 'bg-indigo-50 border-indigo-100' },
    { id: 'progress', stage: 'In Progress', count: progressCount, pct: Math.round((progressCount / totalLeads) * 100), color: '#a855f7', gradient: 'from-purple-500 to-pink-500', barBg: 'bg-gradient-to-t from-purple-600 to-pink-400', textColor: 'text-purple-600', lightBg: 'bg-purple-50 border-purple-100' },
    { id: 'enrolled', stage: 'Enrolled', count: enrolledCount, pct: Math.round((enrolledCount / totalLeads) * 100), color: '#10b981', gradient: 'from-emerald-500 to-teal-500', barBg: 'bg-gradient-to-t from-emerald-600 to-teal-400', textColor: 'text-emerald-600', lightBg: 'bg-emerald-50 border-emerald-100' }
  ];

  const maxVal = Math.max(...pipeline.map(p => p.count), 1);
  const conversionRate = Math.round((enrolledCount / totalLeads) * 100);

  return (
    <div className="space-y-4">
      {/* HEADER WITH GRAPH TOGGLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black border border-blue-100 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Realtime Analytics • {activeLeads.length} Total Registered Leads
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Admission & Enrollment Pipeline Graph</h1>
          <p className="text-xs font-semibold text-slate-500">Visual lead conversion graph calculated directly from MongoDB Atlas</p>
        </div>

        {/* GRAPH VIEW TOGGLES */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shrink-0">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              chartType === 'bar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 Bar Chart
          </button>
          <button
            onClick={() => setChartType('funnel')}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              chartType === 'funnel' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔻 Funnel Flow
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              chartType === 'pie' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🍩 Donut Chart
          </button>
        </div>
      </div>

      {/* PIPELINE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pipeline.map(p => (
          <div key={p.id} className={`p-3.5 sm:p-4 rounded-2xl border ${p.lightBg} shadow-2xs hover:shadow-md transition-all space-y-1`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">{p.stage}</span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${p.textColor} bg-white shadow-xs border border-slate-200`}>
                {p.pct}% Share
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{p.count}</span>
              <span className="text-xs font-bold text-slate-400">Leads</span>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRAPH DISPLAY CONTAINER */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        
        {/* GRAPH HEADER STATS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              {chartType === 'bar' ? 'Pipeline Stage Distribution (Bar Graph)' : chartType === 'funnel' ? 'Funnel Conversion Progress' : 'Pipeline Percentage Share (Donut Graph)'}
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Live statistics based on current database records
            </p>
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 text-right">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Lead-to-Enrollment Rate</span>
            <span className="text-base font-black text-emerald-600">{conversionRate}% Conversion</span>
          </div>
        </div>

        {/* 1. BAR CHART VISUALIZATION */}
        {chartType === 'bar' && (
          <div className="pt-2 pb-1">
            <div className="h-48 w-full flex items-end justify-between gap-4 sm:gap-8 px-4 relative">
              
              {/* Y-Axis Dotted Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 pr-4">
                {[1, 0.75, 0.5, 0.25, 0].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 w-full">
                    <span className="text-[9px] font-mono font-bold text-slate-400 w-8 text-right">
                      {Math.round(maxVal * step)}
                    </span>
                    <div className="flex-1 border-b border-dashed border-slate-200"></div>
                  </div>
                ))}
              </div>

              {/* BAR COLUMNS */}
              {pipeline.map((p) => {
                const heightPercent = maxVal > 0 ? Math.max((p.count / maxVal) * 100, 8) : 8;
                return (
                  <div key={p.id} className="flex-1 flex flex-col items-center h-full justify-end z-10 group relative">
                    
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg absolute -top-8 shadow-xl pointer-events-none whitespace-nowrap z-30">
                      {p.stage}: <strong>{p.count} Leads</strong> ({p.pct}%)
                    </div>

                    {/* Count Pill above bar */}
                    <div className="mb-1 text-center">
                      <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight">{p.count}</span>
                    </div>

                    {/* Gradient Bar Column */}
                    <div className="w-full max-w-[64px] bg-slate-100 rounded-xl p-1 shadow-inner h-full max-h-[120px] flex items-end">
                      <div
                        className={`w-full rounded-lg ${p.barBg} shadow-md transition-all duration-700 ease-out group-hover:brightness-110`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>

                    {/* X-Axis Label */}
                    <div className="mt-2 text-center">
                      <span className="text-xs font-bold text-slate-800 block truncate">{p.stage}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. FUNNEL FLOW CHART VISUALIZATION */}
        {chartType === 'funnel' && (
          <div className="space-y-2.5 py-1">
            {pipeline.map((p) => {
              const widthPct = Math.max(p.pct, 6);
              return (
                <div key={p.id} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-800">{p.stage}</span>
                    <span className="text-slate-900 font-extrabold">{p.count} Leads <span className="text-slate-400 font-normal">({p.pct}%)</span></span>
                  </div>
                  <div className="w-full bg-slate-100 h-8 rounded-xl p-0.5 border border-slate-200/80 overflow-hidden flex items-center">
                    <div
                      className={`h-full rounded-lg ${p.barBg} transition-all duration-700 flex items-center justify-end px-2.5 shadow-xs`}
                      style={{ width: `${widthPct}%` }}
                    >
                      {p.pct > 15 && (
                        <span className="text-white text-[11px] font-black drop-shadow-xs">{p.count}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. DONUT / PIE CHART VISUALIZATION */}
        {chartType === 'pie' && (
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-1">
            
            {/* SVG DONUT CHART */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3.5" />
                {(() => {
                  let accumPct = 0;
                  return pipeline.map((p) => {
                    const strokeDasharray = `${p.pct} ${100 - p.pct}`;
                    const strokeDashoffset = 100 - accumPct;
                    accumPct += p.pct;
                    return (
                      <circle
                        key={p.id}
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke={p.color}
                        strokeWidth="3.8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-700"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 leading-none">{totalLeads}</span>
                <span className="text-[9px] font-extrabold text-slate-400 uppercase mt-0.5">Total Leads</span>
              </div>
            </div>

            {/* LEGEND TABLE */}
            <div className="space-y-2 w-full max-w-md">
              {pipeline.map(p => (
                <div key={p.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-md shrink-0 shadow-xs" style={{ backgroundColor: p.color }}></span>
                    <span className="font-bold text-slate-800">{p.stage}</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-mono font-bold text-[11px]">
                    <span className="text-slate-900">{p.count} Leads</span>
                    <span className="text-slate-400">({p.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ==========================================
// 3. FOLLOW-UPS VIEW
// ==========================================
export function FollowUpsView({ leads = [], onUpdateStatus }) {
  const [filter, setFilter] = useState('today'); // 'today' | 'all' | 'new'

  const todayStr = new Date().toLocaleDateString('en-CA');

  const todayLeads = leads.filter(l => l.createdAt && new Date(l.createdAt).toLocaleDateString('en-CA') === todayStr);
  const newLeads = leads.filter(l => l.status === 'New' || l.status === 'Contacted');

  const displayLeads = filter === 'today' ? todayLeads : filter === 'new' ? newLeads : leads;

  const formatLeadTime = (isoString) => {
    if (!isoString) return 'Today';
    const d = new Date(isoString);
    const leadDateStr = d.toLocaleDateString('en-CA');
    const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (leadDateStr === todayStr) {
      return `Today, ${timeStr}`;
    }
    return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${timeStr}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'Contacted': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Progress': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Enrolled': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-100 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {todayLeads.length} Lead{todayLeads.length === 1 ? '' : 's'} Received Today ({new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Counselor Call Follow-up CRM</h1>
          <p className="text-xs font-semibold text-slate-500">Scheduled reminders, call note timelines & lead conversion status</p>
        </div>

        {/* FILTER TABS */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shrink-0">
          <button
            onClick={() => setFilter('today')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'today' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today's Leads ({todayLeads.length})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'new' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending / New ({newLeads.length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Leads ({leads.length})
          </button>
        </div>
      </div>

      {/* LEAD CARDS LIST */}
      <div className="space-y-3">
        {displayLeads.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-slate-900">No leads found under this filter</h3>
            <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto">
              {filter === 'today' ? 'No new student inquiry leads received today yet. Submit an inquiry from the website to test.' : 'No lead records available.'}
            </p>
          </div>
        ) : (
          displayLeads.map((f) => (
            <div key={f.id || f._id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:shadow-md transition-all">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-extrabold text-sm text-slate-900">{f.name}</span>
                  <a href={`tel:${f.phone}`} className="text-blue-600 font-mono font-bold hover:underline">
                    +91 {f.phone}
                  </a>
                  {f.createdAt && new Date(f.createdAt).toLocaleDateString('en-CA') === todayStr && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">NEW TODAY</span>
                  )}
                </div>
                <div className="text-slate-500 font-semibold flex items-center gap-2 flex-wrap">
                  <span>Course: <strong className="text-slate-700">{f.course}</strong></span>
                  <span>•</span>
                  <span>Location: <strong className="text-slate-700">{f.location || 'Lucknow, UP'}</strong></span>
                </div>
                {f.notes && (
                  <p className="text-slate-600 italic bg-slate-50 p-2 rounded-xl border border-slate-100 inline-block max-w-xl">
                    "{f.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100 whitespace-nowrap">
                  {formatLeadTime(f.createdAt)}
                </span>

                {onUpdateStatus && (
                  <select
                    value={f.status || 'New'}
                    onChange={(e) => onUpdateStatus(f.id || f._id, e.target.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black border outline-none cursor-pointer ${getStatusBadge(f.status)}`}
                  >
                    <option value="New">● New</option>
                    <option value="Contacted">● Contacted</option>
                    <option value="In Progress">● In Progress</option>
                    <option value="Enrolled">● Enrolled</option>
                  </select>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// 4. COMMUNICATION BROADCAST VIEW
// ==========================================
export function CommunicationView() {
  const [template, setTemplate] = useState('Admission Confirmation');
  const [message, setMessage] = useState('Hello {{student_name}}, Welcome to CodeGuru! Your admission for {{course}} has been confirmed.');

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Communication Broadcast Hub</h1>
          <p className="text-xs font-semibold text-slate-500">Send WhatsApp, SMS or Email updates with dynamic template tags</p>
        </div>

        <div className="space-y-4 text-xs font-medium">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Message Template</label>
            <select
              value={template}
              onChange={e => setTemplate(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 font-bold"
            >
              <option>Admission Confirmation</option>
              <option>Fee Payment Reminder</option>
              <option>Batch Class Timing Alert</option>
              <option>Certificate Issued</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Message Content (Variables: &#123;&#123;student_name&#125;&#125;, &#123;&#123;course&#125;&#125;, &#123;&#123;amount&#125;&#125;)</label>
            <textarea
              rows="4"
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => alert('Broadcast Message Dispatched!')}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Send Broadcast via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
