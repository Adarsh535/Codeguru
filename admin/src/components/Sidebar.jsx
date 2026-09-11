import React from 'react';
import { 
  LayoutDashboard, Bell, Users, PhoneCall, UserCheck, GraduationCap, 
  MessageSquare, BookOpen, Layers, Calendar, UserCheck2, CheckSquare, 
  Award, FileText, DollarSign, Receipt, RefreshCw, Image, ImagePlus, 
  Users2, Globe, Search, BarChart3, TrendingUp, Shield, 
  Key, ShieldAlert, Database, Settings, LogOut, X, ChevronRight, FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, todayLeadsCount, totalLeadsCount }) {
  const { user, logout } = useAuth();

  const navSections = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: '5 New', badgeColor: 'bg-rose-500' }
      ]
    },
    {
      title: 'CRM',
      items: [
        { id: 'leads', label: 'Lead Inquiries', icon: Users, badge: todayLeadsCount ? `${todayLeadsCount} Today` : null, badgeColor: 'bg-emerald-500' },
        { id: 'crm-followups', label: 'Follow-ups', icon: PhoneCall },
        { id: 'crm-admissions', label: 'Admissions', icon: UserCheck },
        { id: 'crm-students', label: 'Students', icon: GraduationCap },
        { id: 'crm-communication', label: 'Communication', icon: MessageSquare }
      ]
    },
    {
      title: 'ACADEMIC',
      items: [
        { id: 'academic-courses', label: 'Courses', icon: BookOpen },
        { id: 'academic-modules', label: 'Modules & Lessons', icon: Layers },
        { id: 'academic-batches', label: 'Batches', icon: Calendar },
        { id: 'academic-trainers', label: 'Trainers / Mentors', icon: Users2 },
        { id: 'academic-attendance', label: 'Attendance', icon: CheckSquare },
        { id: 'academic-assessments', label: 'Tests & Assessments', icon: FileText },
        { id: 'academic-progress', label: 'Student Progress', icon: BarChart3 },
        { id: 'academic-certificates', label: 'Certificates', icon: Award }
      ]
    },
    {
      title: 'FINANCE',
      items: [
        { id: 'finance-payments', label: 'Fees & Payments', icon: DollarSign },
        { id: 'finance-invoices', label: 'Invoices', icon: FileSpreadsheet },
        { id: 'finance-receipts', label: 'Receipts', icon: Receipt },
        { id: 'finance-refunds', label: 'Refunds', icon: RefreshCw }
      ]
    },
    {
      title: 'WEBSITE CMS',
      items: [
        { id: 'cms-banners', label: 'Hero Banners', icon: Image },
        { id: 'cms-placements', label: 'Placement Posters', icon: ImagePlus },
        { id: 'cms-team', label: 'Team & Mentors', icon: Users2 },
        { id: 'cms-courses', label: 'Course Catalog', icon: BookOpen },
        { id: 'cms-settings', label: 'Website Settings', icon: Globe },
        { id: 'cms-seo', label: 'SEO', icon: Search }
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        { id: 'analytics-reports', label: 'Reports', icon: FileSpreadsheet },
        { id: 'analytics-revenue', label: 'Revenue Analytics', icon: TrendingUp },
        { id: 'analytics-admissions', label: 'Admission Analytics', icon: BarChart3 },
        { id: 'analytics-students', label: 'Student Analytics', icon: GraduationCap },
        { id: 'analytics-counselor', label: 'Counselor Performance', icon: UserCheck2 }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'system-users', label: 'Admin Users', icon: Users },
        { id: 'system-roles', label: 'Roles & Permissions', icon: Key },
        { id: 'system-audit', label: 'Audit Logs', icon: FileText },
        { id: 'system-security', label: 'Security Center', icon: ShieldAlert },
        { id: 'system-backup', label: 'Database & Backup', icon: Database },
        { id: 'system-settings', label: 'System Settings', icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-sm lg:shadow-none`}
      >
        {/* TOP BRAND LOGO HEADER */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-white border border-slate-200/80 p-0.5 shadow-2xs flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="CodeGuru Icon" className="w-full h-full object-contain rounded-full" />
              </div>
              <div className="flex flex-col min-w-0">
                <img src="/brand-text-logo.png" alt="CODE GURRU" className="h-4.5 w-auto object-contain object-left" />
                <span className="text-[9px] font-black tracking-widest text-indigo-600 uppercase mt-0.5">
                  Admin Panel
                </span>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* NAVIGATION LINKS LIST */}
          <nav className="p-3.5 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
            {navSections.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <span className="px-3 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                  {section.title}
                </span>

                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                        isActive
                          ? 'bg-blue-50/90 text-blue-600 font-extrabold shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`} />
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {item.badge && (
                          <span className={`text-[9px] font-extrabold text-white px-2 py-0.2 rounded-full ${item.badgeColor || 'bg-blue-600'}`}>
                            {item.badge}
                          </span>
                        )}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* BOTTOM USER PROFILE CARD & LOGOUT */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || 'Super Admin'}
                </span>
                <span className="text-[10px] font-medium text-slate-500 truncate">
                  {user?.email || 'admin@codeguru.com'}
                </span>
              </div>
            </div>

            {/* Logout Icon Button */}
            <button
              onClick={logout}
              title="Logout from Admin"
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
