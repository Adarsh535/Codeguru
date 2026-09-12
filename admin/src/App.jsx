import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import LeadsView from './views/LeadsView';
import NotificationsView from './views/NotificationsView';
import { leadService } from './services/leadService';
import ProtectedRoute from './components/ProtectedRoute';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

// Website CMS Views
import BannersManagerView from './views/BannersManagerView';
import PlacementsManagerView from './views/PlacementsManagerView';
import TeamManagerView from './views/TeamManagerView';
import CoursesManagerView from './views/CoursesManagerView';
import SettingsView from './views/SettingsView';

// CRM Views
import { FollowUpsView, AdmissionsView, StudentsView, CommunicationView } from './views/CrmViews';

// Academic Views
import { 
  ModulesLessonsView, BatchesView, AttendanceView, 
  AssessmentsView, StudentProgressView, CertificatesView 
} from './views/AcademicViews';

// Finance Views
import { FeesPaymentsView, InvoicesView, ReceiptsView, RefundsView } from './views/FinanceViews';

// CMS Extra Views
import { WebsiteSettingsView, SeoSettingsView } from './views/CmsExtraViews';

// Analytics Views
import { 
  ReportsView, RevenueAnalyticsView, AdmissionAnalyticsView, 
  StudentAnalyticsView, CounselorPerformanceView 
} from './views/AnalyticsViews';

// System Views
import { 
  AdminUsersView, RolesPermissionsView, AuditLogsView, 
  SecurityCenterView, DatabaseBackupView 
} from './views/SystemViews';

import { useLeadsController } from './controllers/useLeadsController';

function AdminMainApp() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    leads,
    stats,
    searchQuery,
    setSearchQuery,
    deleteModalLead,
    setDeleteModalLead,
    loadData,
    handleUpdateStatus,
    handleDeleteLead,
    confirmDeleteLead,
    handleAddLead
  } = useLeadsController(isAuthenticated);


  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f4f6fb] text-slate-800 flex">
        
        {/* SIDEBAR NAVIGATION (Full Enterprise Taxonomy) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          todayLeadsCount={stats.todayCount}
          totalLeadsCount={stats.totalLeads}
        />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
          
          {/* TOPBAR HEADER */}
          <Topbar
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            todayLeadsCount={stats.todayCount}
            onRefresh={loadData}
          />

          {/* DYNAMIC VIEW ROUTER */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* 1. MAIN */}
            {activeTab === 'dashboard' && (
              <DashboardView
                leads={leads}
                stats={stats}
                searchQuery={searchQuery}
                onUpdateStatus={handleUpdateStatus}
                onDeleteLead={handleDeleteLead}
                onNavigateToLeads={() => setActiveTab('leads')}
              />
            )}
            {activeTab === 'notifications' && <NotificationsView />}

            {/* 2. CRM */}
            {activeTab === 'leads' && (
              <LeadsView
                leads={leads}
                searchQuery={searchQuery}
                onUpdateStatus={handleUpdateStatus}
                onDeleteLead={handleDeleteLead}
                onAddLead={handleAddLead}
              />
            )}
            {activeTab === 'crm-followups' && (
              <FollowUpsView
                leads={leads}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
            {activeTab === 'crm-admissions' && <AdmissionsView leads={leads} />}
            {activeTab === 'crm-students' && <StudentsView />}
            {activeTab === 'crm-communication' && <CommunicationView />}

            {/* 3. ACADEMIC */}
            {activeTab === 'academic-courses' && <CoursesManagerView />}
            {activeTab === 'academic-modules' && <ModulesLessonsView />}
            {activeTab === 'academic-batches' && <BatchesView />}
            {activeTab === 'academic-trainers' && <TeamManagerView />}
            {activeTab === 'academic-attendance' && <AttendanceView />}
            {activeTab === 'academic-assessments' && <AssessmentsView />}
            {activeTab === 'academic-progress' && <StudentProgressView />}
            {activeTab === 'academic-certificates' && <CertificatesView />}

            {/* 4. FINANCE */}
            {activeTab === 'finance-payments' && <FeesPaymentsView />}
            {activeTab === 'finance-invoices' && <InvoicesView />}
            {activeTab === 'finance-receipts' && <ReceiptsView />}
            {activeTab === 'finance-refunds' && <RefundsView />}

            {/* 5. WEBSITE CMS */}
            {activeTab === 'cms-banners' && <BannersManagerView />}
            {activeTab === 'cms-placements' && <PlacementsManagerView />}
            {activeTab === 'cms-team' && <TeamManagerView />}
            {activeTab === 'cms-courses' && <CoursesManagerView />}
            {activeTab === 'cms-settings' && <WebsiteSettingsView />}
            {activeTab === 'cms-seo' && <SeoSettingsView />}

            {/* 6. ANALYTICS */}
            {activeTab === 'analytics-reports' && <ReportsView />}
            {activeTab === 'analytics-revenue' && <RevenueAnalyticsView />}
            {activeTab === 'analytics-admissions' && <AdmissionAnalyticsView />}
            {activeTab === 'analytics-students' && <StudentAnalyticsView />}
            {activeTab === 'analytics-counselor' && <CounselorPerformanceView />}

            {/* 7. SYSTEM */}
            {activeTab === 'system-users' && <AdminUsersView />}
            {activeTab === 'system-roles' && <RolesPermissionsView />}
            {activeTab === 'system-audit' && <AuditLogsView />}
            {activeTab === 'system-security' && <SecurityCenterView />}
            {activeTab === 'system-backup' && <DatabaseBackupView />}
            {activeTab === 'system-settings' && <SettingsView />}
          </main>

        </div>

        {/* DELETE MODAL */}
        {deleteModalLead && createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in select-none">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-100 shadow-2xl flex flex-col gap-5 animate-modal-slide-up">
              
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                  <DeleteOutlineIcon className="!w-6 !h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight font-heading">
                    Delete Lead Confirmation
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    Action cannot be undone
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col gap-2">
                <p className="text-xs font-semibold text-slate-600">
                  Are you sure you want to permanently delete this student inquiry record from the server database?
                </p>

                {deleteModalLead.name && (
                  <div className="pt-2.5 border-t border-slate-200 flex flex-col gap-1.5 text-xs font-bold text-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Student Name:</span>
                      <span className="text-blue-600 font-extrabold">{deleteModalLead.name}</span>
                    </div>
                    {deleteModalLead.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Phone Number:</span>
                        <span className="text-slate-900 font-mono">+91 {deleteModalLead.phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  onClick={() => setDeleteModalLead(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all cursor-pointer border border-slate-200"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDeleteLead}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <DeleteOutlineIcon className="!w-4 !h-4" />
                  <span>Yes, Delete Lead</span>
                </button>
              </div>

            </div>
          </div>,
          document.body
        )}

      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdminMainApp />
    </AuthProvider>
  );
}
