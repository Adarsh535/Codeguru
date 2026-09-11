import React, { useState } from 'react';
import { 
  Bell, CheckCircle2, AlertCircle, Info, Trash2, CheckCheck, 
  Filter, Search, Clock, ArrowRight, Settings, ShieldAlert, DollarSign, UserCheck, BookOpen 
} from 'lucide-react';

const initialNotifications = [
  {
    id: 'n1',
    title: 'New Student Admission Registered',
    message: 'Rahul Sharma completed payment of ₹25,000 for Full Stack Web Dev Batch #FS-42.',
    timestamp: '10 minutes ago',
    type: 'finance',
    unread: true,
    icon: DollarSign,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  {
    id: 'n2',
    title: 'High Priority Lead Inquiry',
    message: 'Ananya Verma requested an urgent call back for Data Science & AI course.',
    timestamp: '25 minutes ago',
    type: 'lead',
    unread: true,
    icon: Bell,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    id: 'n3',
    title: 'Batch Attendance Pending',
    message: 'Attendance for Python Data Analytics Batch #DA-09 has not been marked by Mentor Vikrant.',
    timestamp: '1 hour ago',
    type: 'academic',
    unread: true,
    icon: BookOpen,
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  {
    id: 'n4',
    title: 'System Security Alert',
    message: 'New login detected from IP 192.168.1.105 (Chrome on Windows).',
    timestamp: '3 hours ago',
    type: 'system',
    unread: false,
    icon: ShieldAlert,
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    id: 'n5',
    title: 'Certificate Issued',
    message: 'Certificate #CG-2026-889 issued for Priya Singh (UI/UX Masterclass).',
    timestamp: '5 hours ago',
    type: 'academic',
    unread: false,
    icon: UserCheck,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  }
];

export default function NotificationsView() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filterTab, setFilterTab] = useState('all');
  const [search, setSearch] = useState('');

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleToggleRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterTab === 'unread' && !n.unread) return false;
    if (filterTab !== 'all' && filterTab !== 'unread' && n.type !== filterTab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
    }
    return true;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">System Notifications Hub</h1>
              <p className="text-xs font-semibold text-slate-500">Live alerts for leads, enrollments, finance, and system activities</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All as Read ({unreadCount})</span>
            </button>
          )}
          <button
            onClick={() => setNotifications([])}
            className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200/80 overflow-x-auto shadow-2xs">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'lead', label: 'Leads' },
            { id: 'finance', label: 'Finance' },
            { id: 'academic', label: 'Academic' },
            { id: 'system', label: 'System' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notification title or message..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
          />
        </div>
      </div>

      {/* NOTIFICATIONS FEED LIST */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">No notifications found</p>
            <p className="text-xs text-slate-500">You are all caught up! Clear filters to view past alerts.</p>
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 shadow-2xs ${
                  n.unread ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${n.color}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900">{n.title}</h3>
                      {n.unread && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {n.timestamp}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                  <button
                    onClick={() => handleToggleRead(n.id)}
                    title={n.unread ? 'Mark as read' : 'Mark as unread'}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <CheckCheck className={`w-4 h-4 ${n.unread ? 'text-slate-400' : 'text-blue-600'}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    title="Delete notification"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
