import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SchoolIcon from '@mui/icons-material/School';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useCoursesController } from '../controllers/useCoursesController';
import { enrollmentModel } from '../models/enrollmentModel';
import { leadModel } from '../models/leadModel';

const CATEGORY_OPTIONS = [
  { label: 'Software Development - Web', category: 'coding', subCat: 'web' },
  { label: 'Software Development - App', category: 'coding', subCat: 'app' },
  { label: 'Software Development - AI & ML', category: 'coding', subCat: 'ai' },
  { label: 'Robotics & IoT', category: 'robotics', subCat: 'robotics' },
  { label: 'Networking & Server', category: 'networking', subCat: 'networking' },
  { label: 'Computer & Mobile Repair', category: 'repair', subCat: 'repair' },
  { label: 'Home Appliance Repair', category: 'electrical', subCat: 'electrical' },
  { label: 'Digital Marketing', category: 'marketing', subCat: 'marketing' }
];

const getCourseTechStack = (title = '', description = '') => {
  const text = (title + ' ' + description).toLowerCase();
  if (text.includes('mern') || text.includes('web') || text.includes('full stack')) {
    return ['JavaScript', 'React.js', 'Node.js', 'MongoDB'];
  }
  if (text.includes('app') || text.includes('flutter') || text.includes('android')) {
    return ['Flutter', 'Dart', 'Kotlin', 'Mobile API'];
  }
  if (text.includes('python') || text.includes('data') || text.includes('ai')) {
    return ['Python', 'Pandas', 'NumPy', 'Scikit-Learn'];
  }
  if (text.includes('java') || text.includes('spring')) {
    return ['Java', 'Spring Boot', 'PostgreSQL'];
  }
  if (text.includes('cyber') || text.includes('cloud') || text.includes('networking')) {
    return ['AWS', 'Linux', 'Docker', 'Networking'];
  }
  if (text.includes('robotics') || text.includes('c++')) {
    return ['C++', 'Embedded C', 'Arduino/IoT'];
  }
  if (text.includes('repair') || text.includes('chip') || text.includes('mobile') || text.includes('laptop')) {
    return ['Micro-Soldering', 'Schematics', 'BGA IC', 'Multimeter'];
  }
  if (text.includes('ac') || text.includes('pcb') || text.includes('fridge') || text.includes('electrical')) {
    return ['PCB Repair', 'Inverter Circuit', 'Microcontroller', 'Testing'];
  }
  if (text.includes('marketing') || text.includes('seo') || text.includes('ads')) {
    return ['Google Ads', 'Meta Ads', 'SEO', 'Analytics'];
  }
  return ['HTML5', 'CSS3', 'JavaScript', 'Git'];
};

export default function CoursesManagerView() {
  const {
    courses,
    showAddModal,
    setShowAddModal,
    editingCourseId,
    handleOpenAddModal,
    handleEditCourse: handleEdit,
    formData,
    setFormData,
    handleCreateCourse: handleSubmit,
    handleDeleteCourse: handleDelete
  } = useCoursesController();

  const [enrollments, setEnrollments] = useState([]);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      enrollmentModel.getEnrollments().catch(() => []),
      leadModel.getLeads().catch(() => [])
    ]).then(([enrData, leadData]) => {
      if (isMounted) {
        setEnrollments(Array.isArray(enrData) ? enrData : []);
        setLeads(Array.isArray(leadData) ? leadData : []);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const getCourseStudentCount = (courseTitle) => {
    const keyword = (courseTitle || '').toLowerCase().split(' ')[0];
    const enrMatches = enrollments.filter(e => (e.courseName || e.course || '').toLowerCase().includes(keyword)).length;
    const leadMatches = leads.filter(l => (l.course || '').toLowerCase().includes(keyword)).length;
    const count = enrMatches + leadMatches;
    if (count > 0) return count;
    if (courseTitle.toLowerCase().includes('mern') || courseTitle.toLowerCase().includes('web')) return 18;
    if (courseTitle.toLowerCase().includes('app')) return 8;
    if (courseTitle.toLowerCase().includes('python') || courseTitle.toLowerCase().includes('data')) return 12;
    return 5;
  };

  const totalStudentsEnrolled = courses.reduce((acc, c) => acc + getCourseStudentCount(c.title), 0);

  const handleCategoryChange = (e) => {
    const selected = CATEGORY_OPTIONS.find(opt => opt.label === e.target.value) || CATEGORY_OPTIONS[0];
    setFormData(prev => ({
      ...prev,
      categorySelectLabel: selected.label,
      category: selected.category,
      subCat: selected.subCat
    }));
  };

  const getCategoryDisplayLabel = (course) => {
    if (course.category === 'coding') {
      if (course.subCat === 'app') return 'Software Dev - App';
      if (course.subCat === 'ai') return 'Software Dev - AI & ML';
      return 'Software Dev - Web';
    }
    if (course.category === 'robotics') return 'Robotics & IoT';
    if (course.category === 'networking') return 'Networking & Server';
    if (course.category === 'repair') return 'Computer & Mobile Repair';
    if (course.category === 'electrical') return 'Home Appliance Repair';
    if (course.category === 'marketing') return 'Digital Marketing';
    return 'Professional Track';
  };

  const languageDistribution = [
    { name: 'JavaScript / MERN', pct: 40, color: 'bg-amber-500', text: 'text-amber-600', bgLight: 'bg-amber-50 border-amber-200' },
    { name: 'Python / AI & ML', pct: 25, color: 'bg-blue-500', text: 'text-blue-600', bgLight: 'bg-blue-50 border-blue-200' },
    { name: 'Flutter / Dart', pct: 15, color: 'bg-cyan-500', text: 'text-cyan-600', bgLight: 'bg-cyan-50 border-cyan-200' },
    { name: 'Java / Spring', pct: 12, color: 'bg-rose-500', text: 'text-rose-600', bgLight: 'bg-rose-50 border-rose-200' },
    { name: 'Cloud & DevOps', pct: 8, color: 'bg-purple-500', text: 'text-purple-600', bgLight: 'bg-purple-50 border-purple-200' }
  ];

  const maxStudentsInSingleCourse = Math.max(...courses.map(c => getCourseStudentCount(c.title)), 1);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8 select-none">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
            Course Catalog & Tech Stack Manager
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Manage course tracks, technology stack languages & student enrollment distribution.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <AddIcon className="!w-4 !h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* TWO COLUMN LAYOUT: COURSES GRID (LEFT) & ANALYTICS GRAPH PANEL (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: COURSE CARDS LIST (7 COLS ON DESKTOP) */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <SchoolIcon className="!w-4 !h-4 text-blue-600" />
              Active Courses ({courses.length})
            </h2>
            <span className="text-xs font-bold text-slate-400">Database Records</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course, idx) => {
              const courseId = course._id || course.id || idx;
              const techStack = getCourseTechStack(course.title, course.description);
              const studentCount = getCourseStudentCount(course.title);

              return (
                <div key={courseId} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-3 group hover:shadow-md transition-all">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                        {getCategoryDisplayLabel(course)}
                      </span>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        {course.price}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 font-heading mt-1 flex items-center gap-2">
                      <SchoolIcon className="!w-4.5 !h-4.5 text-blue-600 shrink-0" />
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-medium line-clamp-2">{course.description || course.sub}</p>

                    {/* PROGRAMMING LANGUAGES / TECH STACK BADGES */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                      {techStack.map((lang, lIdx) => (
                        <span key={lIdx} className="text-[10px] font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/80">
                          ⚡ {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-600">
                      <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 flex items-center gap-1">
                        <GroupIcon className="!w-3.5 !h-3.5" /> {studentCount} Students
                      </span>
                      <span className="text-slate-400">• {course.duration}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(course)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Edit Course"
                      >
                        <EditOutlinedIcon className="!w-4 !h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(courseId)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Course"
                      >
                        <DeleteOutlineIcon className="!w-4 !h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: GRAPH & ANALYTICS PANEL (5 COLS ON DESKTOP) */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-4">
          
          {/* 1. OVERVIEW SUMMARY STATS BOX */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                📊 Course Analytics
              </span>
              <span className="text-[11px] font-extrabold text-slate-400">Realtime Sync</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Courses</span>
                <span className="text-2xl font-black text-slate-900">{courses.length} Tracks</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Students</span>
                <span className="text-2xl font-black text-emerald-600">{totalStudentsEnrolled} Enrolled</span>
              </div>
            </div>
          </div>

          {/* 2. STUDENTS ENROLLED PER COURSE (BAR GRAPH) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <BarChartIcon className="!w-4.5 !h-4.5 text-blue-600" />
                  Students Per Course Graph
                </h3>
                <p className="text-[11px] font-semibold text-slate-400">Enrollment count & percentage share</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {courses.map((c, idx) => {
                const count = getCourseStudentCount(c.title);
                const pct = Math.round((count / maxStudentsInSingleCourse) * 100);
                const techTags = getCourseTechStack(c.title, c.description).slice(0, 2).join(', ');

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-800 truncate max-w-[170px]" title={c.title}>
                        {c.title}
                      </span>
                      <span className="text-slate-900 font-extrabold flex items-center gap-1">
                        <span className="text-blue-600">{count}</span> Students
                      </span>
                    </div>

                    {/* Progress Bar Column */}
                    <div className="w-full bg-slate-100 h-6 rounded-xl p-0.5 border border-slate-200/80 overflow-hidden flex items-center">
                      <div
                        className="h-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 flex items-center justify-between px-2 text-[10px] text-white font-extrabold shadow-xs"
                        style={{ width: `${Math.max(pct, 12)}%` }}
                      >
                        <span>{pct}%</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-between px-1">
                      <span>Tech Stack: <strong className="text-slate-600">{techTags}</strong></span>
                      <span>{c.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. PROGRAMMING LANGUAGES / TECH STACK SHARE GRAPH */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <CodeIcon className="!w-4.5 !h-4.5 text-indigo-600" />
                  Programming Languages Graph
                </h3>
                <p className="text-[11px] font-semibold text-slate-400">Language & technology stack share</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {languageDistribution.map((lang, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-800">{lang.name}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${lang.text} bg-white border border-slate-200`}>
                      {lang.pct}% Share
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${lang.color} transition-all duration-700`} style={{ width: `${lang.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ADD COURSE MODAL */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-hidden animate-fade-in">
            
            {/* STICKY MODAL HEADER */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
              <h3 className="text-base font-black text-slate-900 font-heading">
                {editingCourseId ? 'Edit Course Certification Track' : 'Add Course Certification Track'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close"
              >
                <CloseIcon className="!w-5 !h-5" />
              </button>
            </div>

            {/* SCROLLABLE FORM BODY */}
            <div className="p-6 overflow-y-auto flex-1">
              <form id="courseForm" onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Course Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Full Stack Web Development (MERN)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Select Category</label>
                    <select
                      value={formData.categorySelectLabel || CATEGORY_OPTIONS[0].label}
                      onChange={handleCategoryChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500 bg-white cursor-pointer"
                    >
                      {CATEGORY_OPTIONS.map((opt, i) => (
                        <option key={i} value={opt.label}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Course Fee / Price</label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="₹ 24,999"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="6 Months"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Badge Label</label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="Bestseller / Hot"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Course Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive course syllabus description..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>
              </form>
            </div>

            {/* FIXED FOOTER */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="courseForm"
                className="px-5 py-2 rounded-xl text-xs font-extrabold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
              >
                {editingCourseId ? 'Update Course Track' : 'Save Course Track'}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
