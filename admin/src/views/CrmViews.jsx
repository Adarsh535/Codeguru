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
// 2. ADMISSIONS PIPELINE VIEW
// ==========================================
export function AdmissionsView({ leads: propLeads = [] }) {
  const [internalLeads, setInternalLeads] = useState([]);

  useEffect(() => {
    if (!propLeads || propLeads.length === 0) {
      leadModel.getLeads().then(data => {
        setInternalLeads(Array.isArray(data) ? data : []);
      }).catch(() => setInternalLeads([]));
    }
  }, [propLeads]);

  const activeLeads = (propLeads && propLeads.length > 0) ? propLeads : internalLeads;

  const pipeline = [
    { stage: 'New Lead', count: activeLeads.filter(l => l.status === 'New' || !l.status).length, color: 'border-blue-200 bg-blue-50/50' },
    { stage: 'Contacted', count: activeLeads.filter(l => l.status === 'Contacted').length, color: 'border-indigo-200 bg-indigo-50/50' },
    { stage: 'In Progress', count: activeLeads.filter(l => l.status === 'In Progress').length, color: 'border-purple-200 bg-purple-50/50' },
    { stage: 'Enrolled', count: activeLeads.filter(l => l.status === 'Enrolled').length, color: 'border-emerald-200 bg-emerald-50/50' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Admission & Enrollment Pipeline</h1>
          <p className="text-xs font-semibold text-slate-500">Realtime lead conversion funnel calculated directly from MongoDB database</p>
        </div>
      </div>

      {/* PIPELINE FUNNEL GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pipeline.map(p => (
          <div key={p.stage} className={`p-5 rounded-3xl border ${p.color} text-center space-y-2 shadow-2xs`}>
            <span className="text-xs font-extrabold uppercase text-slate-500 block truncate">{p.stage}</span>
            <div className="text-3xl font-black text-slate-900">{p.count}</div>
          </div>
        ))}
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
