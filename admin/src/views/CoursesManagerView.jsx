import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import SchoolIcon from '@mui/icons-material/School';
import CloseIcon from '@mui/icons-material/Close';
import { useCoursesController } from '../controllers/useCoursesController';

const CATEGORY_OPTIONS = [
  { label: 'Coding - Web Development', category: 'coding', subCat: 'web' },
  { label: 'Coding - App Development', category: 'coding', subCat: 'app' },
  { label: 'Coding - Software Development', category: 'coding', subCat: 'software' },
  { label: 'Engineering & Core Tech', category: 'engineering', subCat: '' },
  { label: 'Networking, Cloud & Cyber Security', category: 'networking', subCat: '' },
  { label: 'Robotics & Industrial IoT', category: 'robotics', subCat: '' }
];

export default function CoursesManagerView() {
  const {
    courses,
    showAddModal,
    setShowAddModal,
    formData,
    setFormData,
    handleCreateCourse: handleSubmit,
    handleDeleteCourse: handleDelete
  } = useCoursesController();

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
      if (course.subCat === 'app') return 'Coding - App Dev';
      if (course.subCat === 'software') return 'Coding - Software';
      return 'Coding - Web Dev';
    }
    if (course.category === 'engineering') return 'Engineering';
    if (course.category === 'networking') return 'Networking & Cloud';
    if (course.category === 'robotics') return 'Robotics & IoT';
    return course.category || 'Coding';
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
            Course Catalog & Tracks Manager
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Add, edit, and delete certification tracks under Coding, Engineering, Networking, and Robotics categories.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <AddIcon className="!w-4 !h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* COURSES LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, idx) => {
          const courseId = course._id || course.id || idx;

          return (
            <div key={courseId} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-metoxi flex flex-col justify-between gap-3 group hover:shadow-metoxi-hover transition-all">
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
                  <SchoolIcon className="!w-5 !h-5 text-blue-600" />
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-2">{course.description || course.sub}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500">Duration: {course.duration}</span>
                <button
                  onClick={() => handleDelete(courseId)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Course"
                >
                  <DeleteOutlineIcon className="!w-4 !h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD COURSE MODAL */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-hidden animate-fade-in">
            
            {/* STICKY MODAL HEADER */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
              <h3 className="text-base font-black text-slate-900 font-heading">Add Course Certification Track</h3>
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
                Save Course Track
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
