import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import ContactsIcon from '@mui/icons-material/Contacts';
import PhoneIcon from '@mui/icons-material/Phone';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';

export default function LeadsView({ leads, searchQuery, onUpdateStatus, onDeleteLead, onAddLead }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLeadData, setNewLeadData] = useState({ name: '', phone: '', location: 'Lucknow, UP', course: 'Full Stack Web Development', notes: '' });

  const filteredLeads = leads.filter(lead => 
    !searchQuery ||
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.includes(searchQuery) ||
    (lead.location && lead.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
    lead.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newLeadData.name || !newLeadData.phone) return;

    onAddLead(newLeadData);
    setNewLeadData({ name: '', phone: '', location: 'Lucknow, UP', course: 'Full Stack Web Development', notes: '' });
    setShowAddModal(false);
  };

  const exportCSV = () => {
    const headers = ['ID,Name,Phone,Location,Course,Status,Date'];
    const rows = leads.map(l => `"${l.id}","${l.name}","${l.phone}","${l.location || 'Lucknow, UP'}","${l.course}","${l.status}","${l.createdAt}"`);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CodeGuru_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF report!');
      return;
    }
    const tableRows = filteredLeads.map((l, i) => `
      <tr>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${i + 1}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${l.name}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; color: #2563eb; font-weight: 600;">+91 ${l.phone}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0;">${l.location || 'Lucknow, UP'}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0;">${l.course}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0;"><span style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 800;">${l.status}</span></td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">${new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>CodeGuru Lead Inquiries Report</title>
          <style>
            body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; padding: 32px; color: #0f172a; margin: 0; }
            .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; }
            .brand { font-size: 22px; font-weight: 900; color: #1e293b; letter-spacing: -0.5px; }
            .brand span { color: #2563eb; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; font-weight: 500; }
            .meta { text-align: right; font-size: 11px; color: #64748b; font-weight: 600; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 12px; }
            th { background-color: #f8fafc; text-align: left; padding: 12px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; border-bottom: 2px solid #cbd5e1; font-weight: 800; }
            .footer { margin-top: 32px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; font-weight: 600; }
            @media print {
              body { padding: 0; }
              @page { size: auto; margin: 15mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="display: flex; align-items: center; gap: 14px;">
              <img src="${window.location.origin}/full-brand-logo.png" alt="CodeGuru Logo" style="height: 52px; width: 52px; object-fit: contain; border-radius: 50%; border: 2px solid #e2e8f0; padding: 2px; background: #ffffff;" />
              <div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="${window.location.origin}/brand-text-logo.png" alt="CODE GURRU" style="height: 32px; width: auto; object-fit: contain;" />
                  <span style="font-size: 12px; font-weight: 900; background: #1e293b; color: #ffffff; padding: 3px 10px; border-radius: 8px; letter-spacing: 0.5px; text-transform: uppercase;">ADMIN</span>
                </div>
                <div class="subtitle" style="font-size: 12px; color: #64748b; margin-top: 5px; font-weight: 600;">Student Lead Contact & Admission Inquiries Report</div>
              </div>
            </div>
            <div class="meta">
              <div>Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div>Total Inquiries: ${filteredLeads.length}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Phone Number</th>
                <th>Location</th>
                <th>Course Inquiry</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="footer">CodeGuru Learning Platform • Admin Reports & Records System</div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Contacted': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Progress': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Enrolled': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8 select-none">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
            Lead Inquiries Manager
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            View, search, update status, and manage all student contact inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <DownloadIcon className="!w-4 !h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportPDF}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PictureAsPdfIcon className="!w-4 !h-4 text-rose-500" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <AddIcon className="!w-4 !h-4" />
            <span>Add Manual Lead</span>
          </button>
        </div>
      </div>

      {/* LEADS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-metoxi overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 whitespace-nowrap">Lead ID & Student</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Phone Number</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Location</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Course Inquiry</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Notes / Remarks</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Date</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center shrink-0 uppercase">
                        {lead.name ? lead.name[0].toUpperCase() : 'L'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 whitespace-nowrap">{lead.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">{lead.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <a href={`tel:${lead.phone}`} className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1 whitespace-nowrap">
                      <PhoneIcon className="!w-3.5 !h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">+91 {lead.phone}</span>
                    </a>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-cyan-800 bg-cyan-50 border border-cyan-200/80 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                      <LocationOnIcon className="!w-3.5 !h-3.5 text-cyan-600 shrink-0" />
                      <span className="whitespace-nowrap">{lead.location || 'Lucknow, UP'}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md font-semibold whitespace-nowrap">
                      <SchoolIcon className="!w-3.5 !h-3.5 text-slate-500 shrink-0" />
                      <span className="whitespace-nowrap">{lead.course}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-xs font-black border outline-none cursor-pointer whitespace-nowrap ${getStatusBadge(lead.status)}`}
                    >
                      <option value="New">● New</option>
                      <option value="Contacted">● Contacted</option>
                      <option value="In Progress">● In Progress</option>
                      <option value="Enrolled">● Enrolled</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs text-slate-500 font-medium truncate whitespace-nowrap">
                    {lead.notes || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onDeleteLead(lead.id, lead)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Lead"
                    >
                      <DeleteOutlineIcon className="!w-4 !h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MANUAL LEAD MODAL */}
      {/* ADD LEAD MODAL */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-hidden animate-fade-in">
            
            {/* STICKY MODAL HEADER */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-base font-black text-slate-900 font-heading">Add Manual Contact Lead</h3>
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
              <form id="leadForm" onSubmit={handleCreateSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Student Name</label>
                  <input
                    type="text"
                    required
                    value={newLeadData.name}
                    onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                    placeholder="e.g. Aman Sharma"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={newLeadData.phone}
                    onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                    placeholder="10 digit mobile"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Student Location</label>
                  <input
                    type="text"
                    value={newLeadData.location}
                    onChange={(e) => setNewLeadData({ ...newLeadData, location: e.target.value })}
                    placeholder="e.g. Lucknow, UP / Ayodhya"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Course</label>
                  <select
                    value={newLeadData.course}
                    onChange={(e) => setNewLeadData({ ...newLeadData, course: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Full Stack Web Development">Full Stack Web Development</option>
                    <option value="Java Full Stack & DSA">Java Full Stack & DSA</option>
                    <option value="Python Data Science & AI">Python Data Science & AI</option>
                    <option value="C++ & Competitive Programming">C++ & Competitive Programming</option>
                    <option value="DevOps & Cloud Engineering">DevOps & Cloud Engineering</option>
                    <option value="Cyber Security & Ethical Hacking">Cyber Security & Ethical Hacking</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Notes / Remarks</label>
                  <input
                    type="text"
                    value={newLeadData.notes}
                    onChange={(e) => setNewLeadData({ ...newLeadData, notes: e.target.value })}
                    placeholder="e.g. Inquired offline at Lucknow branch"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>
              </form>
            </div>

            {/* FIXED FOOTER */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="leadForm"
                className="px-5 py-2 rounded-xl text-xs font-extrabold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
              >
                Save Lead Record
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
