import React, { useState, useEffect } from 'react';
import { 
  DollarSign, FileText, Receipt, RefreshCw, Search, Plus, Filter, 
  Printer, Download, Eye, CheckCircle2, Clock, XCircle, ChevronRight, X
} from 'lucide-react';
import { enrollmentService } from '../services/enrollmentService';

// ==========================================
// 1. FEES & PAYMENTS VIEW WITH INSTALLMENTS
// ==========================================

export function FeesPaymentsView() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await enrollmentService.getEnrollments();
      if (data && data.length > 0) {
        const formatted = data.map(item => ({
          id: item.transactionId || item.enrollmentId || item.id || `TXN-${Math.floor(Math.random()*10000)}`,
          studentName: item.studentName || 'Student User',
          admId: item.studentId || 'CG-STU-101',
          course: item.courseName || 'Full Stack Web Development',
          totalFee: item.fee || '₹24,999',
          paidAmount: item.paidAmount || item.fee || '₹24,999',
          pendingAmount: item.pendingAmount || '₹0',
          mode: item.paymentMethod || 'UPI QR',
          status: item.feeStatus || 'Paid',
          date: item.enrollmentDate || new Date().toLocaleDateString('en-IN')
        }));
        setPayments(formatted);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error('Error loading finance enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
    window.addEventListener('storage', fetchEnrollments);
    window.addEventListener('codeguru_lead_added', fetchEnrollments);
    return () => {
      window.removeEventListener('storage', fetchEnrollments);
      window.removeEventListener('codeguru_lead_added', fetchEnrollments);
    };
  }, []);

  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Compute live financial totals
  let totalCollectedNum = 0;
  let totalPendingNum = 0;

  payments.forEach(p => {
    const paidVal = parseInt(String(p.paidAmount).replace(/[^0-9]/g, '')) || 0;
    const pendVal = parseInt(String(p.pendingAmount).replace(/[^0-9]/g, '')) || 0;
    totalCollectedNum += paidVal;
    totalPendingNum += pendVal;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Fees Collection & Payment Manager</h1>
          <p className="text-xs font-semibold text-slate-500">Track real-time student course fee collections, payment transactions & pending installments</p>
        </div>
        <button
          onClick={fetchEnrollments}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Realtime Fees
        </button>
      </div>

      {/* REVENUE KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Collected</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">₹{totalCollectedNum.toLocaleString('en-IN')}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Enrollments</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{payments.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Pending Fees</span>
          <div className="text-2xl font-black text-amber-600 mt-1">₹{totalPendingNum.toLocaleString('en-IN')}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">Live Connected</div>
        </div>
      </div>

      {/* PAYMENTS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-100">
              <th className="p-4">Txn ID / Ref</th>
              <th className="p-4">Student Name</th>
              <th className="p-4">Total Fee</th>
              <th className="p-4">Paid / Pending</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {payments.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-mono font-bold text-blue-600">{p.id}</td>
                <td className="p-4">
                  <div className="font-bold text-slate-900">{p.studentName}</div>
                  <div className="text-[11px] text-slate-400">{p.course}</div>
                </td>
                <td className="p-4 font-extrabold text-slate-900">{p.totalFee}</td>
                <td className="p-4">
                  <div className="text-emerald-600 font-bold">Paid: {p.paidAmount}</div>
                  {p.pendingAmount !== '₹0' && <div className="text-amber-600 text-[11px] font-bold">Pending: {p.pendingAmount}</div>}
                </td>
                <td className="p-4 text-slate-600 font-semibold">{p.mode}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedReceipt(p)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 font-extrabold hover:bg-blue-600 hover:text-white transition-all text-xs cursor-pointer"
                  >
                    Print Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* OFFICIAL FEE RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-6">
            {/* BRAND HEADER */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
                <div>
                  <h3 className="font-black text-slate-900 text-sm">CODEGURU ACADEMY</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Official Fee Payment Receipt</p>
                </div>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            {/* RECEIPT DETAILS */}
            <div className="space-y-3 text-xs font-medium text-slate-700">
              <div className="flex justify-between"><span>Receipt No:</span> <strong className="font-mono text-blue-600">{selectedReceipt.id}</strong></div>
              <div className="flex justify-between"><span>Date:</span> <strong>{selectedReceipt.date}</strong></div>
              <div className="flex justify-between"><span>Student Name:</span> <strong>{selectedReceipt.studentName}</strong></div>
              <div className="flex justify-between"><span>Course Enrolled:</span> <strong>{selectedReceipt.course}</strong></div>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex justify-between"><span>Total Fee:</span> <span>{selectedReceipt.totalFee}</span></div>
                <div className="flex justify-between text-emerald-600 font-bold"><span>Amount Paid:</span> <span>{selectedReceipt.paidAmount}</span></div>
                <div className="flex justify-between text-rose-600 font-bold"><span>Balance Due:</span> <span>{selectedReceipt.pendingAmount}</span></div>
                <div className="flex justify-between pt-1 border-t border-slate-200"><span>Payment Method:</span> <span>{selectedReceipt.mode}</span></div>
              </div>
            </div>

            {/* SIGNATURE & PRINT BUTTON */}
            <div className="pt-4 border-t flex justify-between items-end">
              <div className="text-[10px] text-slate-400">Authorized Signature<br/><strong className="text-slate-700">CodeGuru Accounts Dept</strong></div>
              <button
                onClick={() => alert('Printing Official Fee Receipt PDF...')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. INVOICES VIEW
// ==========================================
export function InvoicesView() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    enrollmentService.getEnrollments().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setInvoices(data.map(i => ({
          id: `INV-${i.enrollmentId || i.id || '101'}`,
          student: i.studentName || 'Student',
          course: i.courseName || 'Course',
          amount: i.fee || '₹24,999',
          date: i.enrollmentDate || new Date().toLocaleDateString('en-IN'),
          status: 'Paid',
          tax: '₹0 GST'
        })));
      } else {
        setInvoices([]);
      }
    }).catch(() => setInvoices([]));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Tax Invoices & Billing Register</h1>
        <p className="text-xs font-semibold text-slate-500">Generate, download & print official GST tax invoices for student admissions</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-100">
              <th className="p-4">Invoice No</th>
              <th className="p-4">Student Name</th>
              <th className="p-4">Course</th>
              <th className="p-4">Total Bill</th>
              <th className="p-4">Tax (GST)</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {invoices.length > 0 ? (
              invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-mono font-bold text-blue-600">{inv.id}</td>
                  <td className="p-4 font-extrabold text-slate-900">{inv.student}</td>
                  <td className="p-4 font-semibold text-slate-700">{inv.course}</td>
                  <td className="p-4 font-black text-slate-900">{inv.amount}</td>
                  <td className="p-4 text-slate-500 font-mono">{inv.tax}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => alert(`Downloading Invoice ${inv.id}...`)} className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white font-extrabold text-xs transition-all cursor-pointer">
                      Download Tax PDF
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-500 font-bold">
                  No tax invoices generated. Add enrollments in MongoDB database to populate tax invoices.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 3. RECEIPTS VIEW
// ==========================================
export function ReceiptsView() {
  return <FeesPaymentsView />;
}

// ==========================================
// 4. REFUNDS VIEW
// ==========================================
export function RefundsView() {
  const [refunds] = useState([]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Student Fee Refund Requests</h1>
        <p className="text-xs font-semibold text-slate-500">Manage course withdrawal requests, refund approvals & bank reversal logs</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-100">
              <th className="p-4">Refund ID</th>
              <th className="p-4">Student Name</th>
              <th className="p-4">Refund Amount</th>
              <th className="p-4">Reason / Notes</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {refunds.length > 0 ? (
              refunds.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-mono font-bold text-rose-600">{r.id}</td>
                  <td className="p-4 font-extrabold text-slate-900">{r.student}</td>
                  <td className="p-4 font-black text-rose-600">{r.amount}</td>
                  <td className="p-4 text-slate-600">{r.reason}</td>
                  <td className="p-4 text-slate-400 font-mono">{r.date}</td>
                  <td className="p-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500 font-bold">
                  No refund requests recorded in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

