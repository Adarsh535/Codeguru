import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Video, FileText, CheckCircle2, Clock, UserCheck, Award, 
  Search, Plus, Calendar, BarChart2, CheckSquare, XSquare, Printer, 
  Download, Eye, QrCode, AlertTriangle, Layers, Users, X
} from 'lucide-react';
import { enrollmentModel } from '../models/enrollmentModel';

// ==========================================
// 1. MODULES & LESSONS VIEW
// ==========================================
export function ModulesLessonsView() {
  const [selectedCourse, setSelectedCourse] = useState('Full Stack Web Dev (MERN)');
  const [modules] = useState([
    {
      id: 'm1',
      title: 'Module 1: HTML5, CSS3 & Modern Responsive Design',
      duration: '2 Weeks',
      status: 'Published',
      lessons: [
        { id: 'l1', title: 'Lesson 1.1: HTML5 Semantic Tags & Page Layout', duration: '45 mins', type: 'Video', status: 'Published' },
        { id: 'l2', title: 'Lesson 1.2: Flexbox & Grid Masterclass', duration: '60 mins', type: 'Video', status: 'Published' },
        { id: 'l3', title: 'Assignment 1: Responsive Portfolio Website Project', duration: 'Assignment', type: 'Project', status: 'Published' }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: JavaScript ES6+, DOM & Async Programming',
      duration: '3 Weeks',
      status: 'Published',
      lessons: [
        { id: 'l4', title: 'Lesson 2.1: Closures, Promises & Async/Await', duration: '50 mins', type: 'Video', status: 'Published' },
        { id: 'l5', title: 'Lesson 2.2: DOM Manipulation & Event Loop', duration: '55 mins', type: 'Video', status: 'Published' }
      ]
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Syllabus Modules & Lessons Hierarchy</h1>
          <p className="text-xs font-semibold text-slate-500">Manage course chapters, video lectures & assignment projects</p>
        </div>
        <select
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
          className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none"
        >
          <option>Full Stack Web Dev (MERN)</option>
          <option>Data Science & AI Masterclass</option>
          <option>Python Data Analytics</option>
        </select>
      </div>

      <div className="space-y-4">
        {modules.map(mod => (
          <div key={mod.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 font-black flex items-center justify-center text-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{mod.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">Duration: {mod.duration} • {mod.lessons.length} Lessons</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">{mod.status}</span>
            </div>

            <div className="space-y-2 pl-4">
              {mod.lessons.map(les => (
                <div key={les.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <Video className="w-4 h-4 text-blue-600" />
                    <span>{les.title}</span>
                  </div>
                  <span className="text-slate-500 font-medium">{les.duration}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. BATCHES VIEW WITH STUDENT ASSIGNMENT
// ==========================================
export function BatchesView() {
  const [batches] = useState([
    { id: 'FS-42', course: 'Full Stack MERN', startDate: '15 Aug 2026', endDate: '15 Dec 2026', timing: '09:00 AM - 11:00 AM', mentor: 'Vikrant Shinde', seatsFilled: 22, maxSeats: 25, status: 'Ongoing' },
    { id: 'DS-18', course: 'Data Science & AI', startDate: '01 Sep 2026', endDate: '01 Jan 2027', timing: '11:30 AM - 01:30 PM (Weekend)', mentor: 'Anjali Saxena', seatsFilled: 18, maxSeats: 20, status: 'Ongoing' }
  ]);
  const [assignModalBatch, setAssignModalBatch] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Academic Batches & Allocation</h1>
          <p className="text-xs font-semibold text-slate-500">Batch schedules, start/end dates & enrolled student assignment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {batches.map(b => (
          <div key={b.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">#{b.id}</span>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{b.status}</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{b.course}</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">{b.timing} • Dates: {b.startDate} to {b.endDate}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Occupancy: {b.seatsFilled}/{b.maxSeats} Students</span>
                <span className="text-blue-600">{Math.round((b.seatsFilled/b.maxSeats)*100)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(b.seatsFilled/b.maxSeats)*100}%` }}></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Mentor: <strong>{b.mentor}</strong></span>
              <button
                onClick={() => setAssignModalBatch(b)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 font-extrabold text-xs hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              >
                Assign Students
              </button>
            </div>
          </div>
        ))}
      </div>

      {assignModalBatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-slate-900">Assign Students to Batch #{assignModalBatch.id}</h3>
              <button onClick={() => setAssignModalBatch(null)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-xs font-medium">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span>Aarav Patel (CG-STU-0001)</span>
                <button onClick={() => alert('Assigned!')} className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]">Assign</button>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setAssignModalBatch(null)} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. ATTENDANCE VIEW WITH LOW ATTENDANCE ALERT (<75%)
// ==========================================
export function AttendanceView() {
  const [attendanceList, setAttendanceList] = useState([]);

  useEffect(() => {
    enrollmentModel.getEnrollments().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setAttendanceList(data.map((item, idx) => ({
          id: item.enrollmentId || item.id || `STU-${idx+1}`,
          name: item.studentName || 'Enrolled Student',
          roll: `STU-0${idx+1}`,
          attendanceRate: '100%',
          present: true,
          alert: false
        })));
      } else {
        setAttendanceList([]);
      }
    }).catch(() => setAttendanceList([]));
  }, []);

  const toggleAttendance = (id) => {
    setAttendanceList(attendanceList.map(s => s.id === id ? { ...s, present: !s.present } : s));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Daily Batch Attendance Marker</h1>
          <p className="text-xs font-semibold text-slate-500">Mark daily attendance & track automated &lt; 75% low attendance alerts</p>
        </div>
        <button onClick={() => alert('Attendance Saved Successfully!')} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md">
          Save Register
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        {attendanceList.length > 0 ? (
          attendanceList.map(s => (
            <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">{s.name}</span>
                  {s.alert && (
                    <span className="text-[10px] font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Low Attendance ({s.attendanceRate})
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-mono">Roll: {s.roll} • Total Rate: {s.attendanceRate}</div>
              </div>

              <button
                onClick={() => toggleAttendance(s.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  s.present ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {s.present ? 'PRESENT' : 'ABSENT'}
              </button>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500 font-bold text-xs">
            No active enrolled students in database yet. Add student enrollments to mark daily attendance.
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 4. ASSESSMENTS VIEW
// ==========================================
export function AssessmentsView() {
  const [assessments, setAssessments] = useState([]);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    enrollmentModel.getEnrollments().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setScores(data.map((item, idx) => ({
          studentName: item.studentName || 'Student',
          roll: `CG-STU-000${idx+1}`,
          score: 'Pending',
          percentage: '0%',
          grade: 'N/A',
          status: 'Enrolled'
        })));
      } else {
        setScores([]);
      }
    }).catch(() => setScores([]));
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTest, setNewTest] = useState({ title: '', course: 'Full Stack MERN', date: '' });

  const handleAddAssessment = (e) => {
    e.preventDefault();
    if (!newTest.title) return;
    setAssessments([
      { id: `TEST-${Math.floor(100 + Math.random() * 900)}`, title: newTest.title, course: newTest.course, date: newTest.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), totalStudents: 20, avgScore: 'Pending', status: 'Scheduled' },
      ...assessments
    ]);
    setShowAddModal(false);
    setNewTest({ title: '', course: 'Full Stack MERN', date: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Tests & Assessment Results</h1>
          <p className="text-xs font-semibold text-slate-500">Weekly coding evaluations, MCQ quizzes & student performance scorecards</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Test Assessment
        </button>
      </div>

      {/* RECENT ASSESSMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assessments.map(a => (
          <div key={a.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3 hover:border-blue-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">{a.id}</span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${a.status === 'Graded' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {a.status}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{a.title}</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">{a.course} • {a.date}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">Students Evaluated: <strong>{a.totalStudents}</strong></span>
              <span className="text-emerald-600 font-black">Avg: {a.avgScore}</span>
            </div>
          </div>
        ))}
      </div>

      {/* STUDENT SCORECARD TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900">Student Scorecards & Marks</h2>
          <span className="text-xs font-semibold text-slate-400">Latest Assessment Marks</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-100">
                <th className="p-4">Student Name & Roll</th>
                <th className="p-4">Marks Obtained</th>
                <th className="p-4">Percentage</th>
                <th className="p-4">Grade</th>
                <th className="p-4 text-right">Result Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {scores.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <div className="font-extrabold text-slate-900">{s.studentName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{s.roll}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-900">{s.score}</td>
                  <td className="p-4 font-black text-blue-600">{s.percentage}</td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded font-black text-xs bg-slate-100 text-slate-800">{s.grade}</span></td>
                  <td className="p-4 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      s.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TEST MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-slate-900">Schedule New Assessment Test</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddAssessment} className="space-y-3.5 text-xs font-bold">
              <div>
                <label className="text-slate-700 block mb-1">Assessment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Node.js & Express REST API Practical Test"
                  value={newTest.title}
                  onChange={e => setNewTest({ ...newTest, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-700 block mb-1">Course Target</label>
                <select
                  value={newTest.course}
                  onChange={e => setNewTest({ ...newTest, course: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500 bg-white"
                >
                  <option>Full Stack Web Dev (MERN)</option>
                  <option>Data Science & AI Masterclass</option>
                  <option>Python Data Analytics</option>
                </select>
              </div>
              <div>
                <label className="text-slate-700 block mb-1">Scheduled Date</label>
                <input
                  type="text"
                  placeholder="e.g. 15 Sep 2026"
                  value={newTest.date}
                  onChange={e => setNewTest({ ...newTest, date: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-extrabold shadow-sm">Save & Schedule Test</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. STUDENT PROGRESS VIEW
// ==========================================
export function StudentProgressView() {
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  useEffect(() => {
    enrollmentModel.getEnrollments().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((item, idx) => ({
          id: item.studentId || item.enrollmentId || `CG-STU-000${idx+1}`,
          name: item.studentName || 'Student',
          course: item.courseName || 'Full Stack Web Dev (MERN)',
          batch: 'Active Batch',
          overallProgress: 100,
          attendance: '100%',
          completedModules: 5,
          totalModules: 5,
          trainer: 'Faculty Team',
          modules: [
            { name: 'Core Foundations & Setup', progress: 100, status: 'Completed', score: 'Pass' },
            { name: 'Full Stack Development', progress: 100, status: 'Completed', score: 'Pass' }
          ],
          projects: [
            { title: 'Course Capstone Project', status: 'Graded (A)', link: 'github.com/student/project' }
          ]
        }));
        setStudentsList(formatted);
        setSelectedStudentId(formatted[0].id);
      } else {
        setStudentsList([]);
      }
    }).catch(() => setStudentsList([]));
  }, []);

  const currentStudent = studentsList.find(s => s.id === selectedStudentId) || studentsList[0];

  if (studentsList.length === 0 || !currentStudent) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Student Syllabus Progress Index</h1>
          <p className="text-xs font-semibold text-slate-500">Visual progress tracking for modules & coursework completion</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 text-center text-slate-500 font-bold text-xs">
          No active enrolled students in database yet. Add student enrollments to track student progress.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER WITH STUDENT SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Student Syllabus Progress Index</h1>
          <p className="text-xs font-semibold text-slate-500">Visual progress tracking for modules & coursework completion</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="text-xs font-extrabold text-slate-500">Select Student:</label>
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-extrabold bg-slate-50 focus:outline-none focus:border-blue-500"
          >
            {studentsList.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
            ))}
          </select>
        </div>
      </div>

      {/* STUDENT HIGHLIGHT BANNER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center border border-blue-400 uppercase shadow-xs">
              {currentStudent.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">{currentStudent.name}</h2>
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">{currentStudent.id}</span>
              </div>
              <p className="text-xs font-semibold text-slate-500">{currentStudent.course} • Batch: {currentStudent.batch}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-right">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Overall Syllabus</span>
              <span className="text-lg font-black text-blue-600">{currentStudent.overallProgress}% Complete</span>
            </div>
            <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-right">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Attendance Rate</span>
              <span className={`text-lg font-black ${parseInt(currentStudent.attendance) >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {currentStudent.attendance}
              </span>
            </div>
          </div>
        </div>

        {/* OVERALL PROGRESS BAR */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Module Completion ({currentStudent.completedModules}/{currentStudent.totalModules} Finished)</span>
            <span className="text-blue-600 font-extrabold">{currentStudent.overallProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentStudent.overallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* MODULE PROGRESS BREAKDOWN */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="text-base font-black text-slate-900">Module-wise Progression & Grades</h3>
        <div className="space-y-3">
          {currentStudent.modules.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900">{m.name}</span>
                <span className="font-bold text-slate-600">{m.score}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${m.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ASSIGNMENTS & PROJECT TIMELINE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="text-base font-black text-slate-900">Capstone Projects & Code Repositories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {currentStudent.projects.map((p, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 block">{p.link}</span>
              <div className="font-extrabold text-xs text-slate-900">{p.title}</div>
              <span className="inline-block text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ==========================================
// 6. CERTIFICATES VIEW WITH QR CODE & PRINT
// ==========================================
// ==========================================
// 6. CERTIFICATES VIEW WITH 6-MONTH COMPLETION & ADMIN APPROVAL
// ==========================================
export function CertificatesView() {
  const [certs, setCerts] = useState(() => {
    try {
      const saved = localStorage.getItem('codeguru_certificates');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'ongoing'
  const [selectedCert, setSelectedCert] = useState(null);

  const saveCertificates = (updated) => {
    setCerts(updated);
    try {
      localStorage.setItem('codeguru_certificates', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('codeguru_certificate_updated'));
    } catch (e) {}
  };

  const handleApprove = (certId) => {
    const updated = certs.map(c => {
      if (c.id === certId) {
        return {
          ...c,
          status: 'Approved',
          issueDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return c;
    });
    saveCertificates(updated);
  };

  const filteredCerts = certs.filter(c => {
    if (activeFilter === 'pending') return c.status === 'Pending Approval';
    if (activeFilter === 'approved') return c.status === 'Approved';
    if (activeFilter === 'ongoing') return c.status === 'Ongoing';
    return true;
  });

  const printBlackGoldCertificate = (cert) => {
    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('Please allow popups to download/print certificate!');
      return;
    }
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate of Achievement - ${cert.studentName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Great+Vibes&family=Montserrat:wght@400;600;800&display=swap');
            body { margin: 0; padding: 0; background: #070709; font-family: 'Cinzel', serif; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            .cert-box { width: 920px; height: 640px; background: #0c0c0e; border: 12px solid #141419; position: relative; box-sizing: border-box; padding: 40px; text-align: center; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); }
            .border-inner { position: absolute; inset: 15px; border: 2px solid #d4af37; pointer-events: none; }
            .floral-corner { position: absolute; width: 110px; height: 110px; pointer-events: none; }
            .top-left { top: 20px; left: 20px; }
            .top-right { top: 20px; right: 20px; transform: scaleX(-1); }
            .bottom-left { bottom: 20px; left: 20px; transform: scaleY(-1); }
            .bottom-right { bottom: 20px; right: 20px; transform: scale(-1); }
            
            .watermark { position: absolute; inset: 0; margin: auto; width: 320px; height: 320px; opacity: 0.06; background: radial-gradient(circle, #d4af37 0%, transparent 70%); pointer-events: none; border-radius: 50%; }
            
            .title { font-size: 40px; font-weight: 900; letter-spacing: 8px; color: #ffffff; margin-top: 25px; text-transform: uppercase; text-shadow: 0 0 10px rgba(255,255,255,0.2); }
            .subtitle { font-size: 13px; letter-spacing: 5px; color: #d4af37; margin-top: 6px; font-family: 'Montserrat', sans-serif; text-transform: uppercase; font-weight: 600; }
            .presented { font-size: 11px; letter-spacing: 3px; color: #a1a1aa; margin-top: 32px; text-transform: uppercase; font-family: 'Montserrat', sans-serif; font-weight: 600; }
            .name-box { margin: 16px auto; display: inline-block; padding: 8px 45px; border-top: 1px solid rgba(212,175,55,0.4); border-bottom: 1px solid rgba(212,175,55,0.4); }
            .name { font-size: 44px; font-family: 'Cinzel', serif; font-weight: 900; color: #fef08a; letter-spacing: 2px; text-shadow: 0 0 15px rgba(212,175,55,0.3); }
            .reason { font-size: 12px; font-family: 'Montserrat', sans-serif; letter-spacing: 1.5px; color: #e5e7eb; max-width: 640px; margin: 0 auto; line-height: 1.6; text-transform: uppercase; font-weight: 500; }
            .course { font-size: 16px; color: #facc15; font-weight: 800; margin-top: 10px; letter-spacing: 2.5px; font-family: 'Montserrat', sans-serif; }
            .code-tag { font-size: 10px; font-family: monospace; color: #9ca3af; margin-top: 18px; letter-spacing: 1px; }
            
            .footer { position: absolute; bottom: 35px; left: 70px; right: 70px; display: flex; justify-content: space-between; align-items: flex-end; }
            .sig-block { text-align: center; }
            .sig-line { width: 210px; border-bottom: 1px solid #d4af37; margin-top: 2px; }
            .sig-name { font-family: 'Great Vibes', cursive; font-size: 32px; color: #fef08a; line-height: 1; }
            .sig-title { font-size: 10px; font-family: 'Montserrat', sans-serif; letter-spacing: 2px; color: #9ca3af; text-transform: uppercase; margin-top: 6px; font-weight: 600; }
            
            @media print {
              body { background: #000; -webkit-print-color-adjust: exact; }
              .cert-box { width: 100%; height: 100vh; border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="cert-box">
            <div class="watermark"></div>
            <div class="border-inner"></div>
            
            <!-- Floral Corner Elements -->
            <svg class="floral-corner top-left" viewBox="0 0 100 100"><path d="M10,10 Q50,10 50,50 Q10,50 10,10 Z M25,25 Q65,25 65,65 M5,5 L95,5 L5,95 Z" fill="none" stroke="#d4af37" stroke-width="2"/></svg>
            <svg class="floral-corner top-right" viewBox="0 0 100 100"><path d="M10,10 Q50,10 50,50 Q10,50 10,10 Z M25,25 Q65,25 65,65 M5,5 L95,5 L5,95 Z" fill="none" stroke="#d4af37" stroke-width="2"/></svg>
            <svg class="floral-corner bottom-left" viewBox="0 0 100 100"><path d="M10,10 Q50,10 50,50 Q10,50 10,10 Z M25,25 Q65,25 65,65 M5,5 L95,5 L5,95 Z" fill="none" stroke="#d4af37" stroke-width="2"/></svg>
            <svg class="floral-corner bottom-right" viewBox="0 0 100 100"><path d="M10,10 Q50,10 50,50 Q10,50 10,10 Z M25,25 Q65,25 65,65 M5,5 L95,5 L5,95 Z" fill="none" stroke="#d4af37" stroke-width="2"/></svg>

            <div class="title">CERTIFICATE</div>
            <div class="subtitle">OF ACHIEVEMENT</div>
            <div class="presented">PRESENTED TO :</div>
            <div class="name-box">
              <div class="name">${cert.studentName}</div>
            </div>
            <div class="reason">FOR THE ACHIEVEMENT OF GRADUATION WHILE STUDYING AT CODEGURU ACADEMY</div>
            <div class="course">${cert.course.toUpperCase()}</div>
            <div class="code-tag">VERIFICATION CODE: ${cert.id} • ISSUED: ${cert.issueDate || '05 SEP 2026'}</div>

            <div class="footer">
              <div class="sig-block">
                <div class="sig-name">Bailey Dupont</div>
                <div class="sig-line"></div>
                <div class="sig-title">BAILEY DUPONT<br/><span style="font-size:8px; color:#6b7280;">CHIEF EXECUTIVE</span></div>
              </div>
              <div class="sig-block">
                <div class="sig-name">Avery Davis</div>
                <div class="sig-line"></div>
                <div class="sig-title">AVERY DAVIS<br/><span style="font-size:8px; color:#6b7280;">HEADMASTER</span></div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 400);
            }
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Course Completion Certificates Manager</h1>
          <p className="text-xs font-semibold text-slate-500">6-month course completion verification, admin approvals & official black/gold certificate issuance</p>
        </div>

        {/* FILTER TABS */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shrink-0 overflow-x-auto">
          {[
            { id: 'all', label: `All (${certs.length})` },
            { id: 'pending', label: `Pending Approval (${certs.filter(c => c.status === 'Pending Approval').length})` },
            { id: 'approved', label: `Approved & Issued (${certs.filter(c => c.status === 'Approved').length})` },
            { id: 'ongoing', label: `Ongoing (${certs.filter(c => c.status === 'Ongoing').length})` }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveFilter(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === t.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CERTIFICATES CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCerts.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">{c.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                  c.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                  c.status === 'Pending Approval' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {c.status === 'Approved' ? '● Approved & Issued' : c.status === 'Pending Approval' ? '⏳ Pending Admin Approval (6 Months Done)' : '● Course Ongoing'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">{c.studentName}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{c.course}</p>
              </div>

              {/* DURATION PROGRESS BAR */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between font-extrabold">
                  <span className="text-slate-600">Course Duration Status:</span>
                  <span className={c.monthsCompleted >= 6 ? 'text-emerald-600' : 'text-amber-600'}>
                    {c.monthsCompleted}/{c.totalMonths} Months ({c.monthsCompleted >= 6 ? '100% Completed' : 'In Progress'})
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.monthsCompleted >= 6 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${(c.monthsCompleted / c.totalMonths) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedCert(c)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4" /> Preview Black/Gold Cert
              </button>

              {c.status === 'Pending Approval' && (
                <button
                  onClick={() => handleApprove(c.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Issue
                </button>
              )}

              {c.status === 'Approved' && (
                <button
                  onClick={() => printBlackGoldCertificate(c)}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <Printer className="w-4 h-4" /> Print / Download
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* BLACK & GOLD FLORAL CERTIFICATE PREVIEW MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#09090b] rounded-3xl p-6 sm:p-10 max-w-4xl w-full border-4 border-[#18181b] shadow-2xl relative space-y-6 text-center text-white my-auto animate-fade-in">
            
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* BLACK & GOLD LUXURY FLORAL FRAME */}
            <div className="border-2 border-[#d4af37] p-8 sm:p-12 rounded-2xl relative bg-[#0d0d11] space-y-5 overflow-hidden">
              
              {/* WATERMARK */}
              <div className="absolute inset-0 margin-auto w-64 h-64 opacity-5 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-full blur-3xl pointer-events-none"></div>

              {/* HEADER */}
              <div>
                <h2 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-[0.2em] uppercase text-shadow-sm">
                  CERTIFICATE
                </h2>
                <p className="text-xs sm:text-sm font-semibold tracking-[0.4em] text-[#d4af37] uppercase mt-1">
                  OF ACHIEVEMENT
                </p>
              </div>

              <p className="text-[11px] sm:text-xs font-bold tracking-[0.3em] text-slate-400 uppercase pt-2">
                PRESENTED TO :
              </p>

              {/* STUDENT NAME IN GOLD BORDER BOX */}
              <div className="inline-block border-y border-[#d4af37]/40 py-2.5 px-8 my-2 max-w-full">
                <h3 className="text-2xl sm:text-4xl font-extrabold font-serif text-[#fef08a] tracking-wider capitalize drop-shadow-md">
                  {selectedCert.studentName}
                </h3>
              </div>

              <p className="text-xs sm:text-sm font-medium tracking-widest text-slate-300 max-w-xl mx-auto uppercase leading-relaxed">
                FOR THE ACHIEVEMENT OF GRADUATION WHILE STUDYING AT CODEGURU ACADEMY
              </p>

              <div className="text-sm sm:text-base font-extrabold text-[#facc15] tracking-widest font-sans uppercase">
                {selectedCert.course}
              </div>

              <div className="font-mono text-[10px] sm:text-xs text-slate-400 tracking-wider pt-2">
                VERIFICATION CODE: {selectedCert.id} • ISSUED: {selectedCert.issueDate || '05 SEP 2026'}
              </div>

              {/* SIGNATURES */}
              <div className="pt-8 flex justify-between items-end px-4 sm:px-12">
                <div className="text-center">
                  <div className="font-serif italic text-xl sm:text-2xl text-[#fef08a]">Bailey Dupont</div>
                  <div className="w-36 sm:w-48 border-b border-[#d4af37] my-1"></div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                    BAILEY DUPONT<br/><span className="text-slate-500 font-normal">CHIEF EXECUTIVE</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="font-serif italic text-xl sm:text-2xl text-[#fef08a]">Avery Davis</div>
                  <div className="w-36 sm:w-48 border-b border-[#d4af37] my-1"></div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                    AVERY DAVIS<br/><span className="text-slate-500 font-normal">HEADMASTER</span>
                  </div>
                </div>
              </div>

            </div>

            {/* MODAL BOTTOM BAR */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
              >
                Close Preview
              </button>

              <button
                onClick={() => printBlackGoldCertificate(selectedCert)}
                className="px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a028] text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Download / Print PDF Certificate
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
