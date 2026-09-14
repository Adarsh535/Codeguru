'use client';

import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import { apiService } from '../../services/apiService';

export default function BatchEnrollModal({ isOpen, onClose, batchData, user, onEnrollSuccess }) {
  const [step, setStep] = useState(1); // 1: Plan & Details, 2: Payment Gateway, 3: Success
  const [paymentPlan, setPaymentPlan] = useState('Full Payment');
  const [paymentMethod, setPaymentMethod] = useState('upi_qr'); // upi_qr, upi_app, card, netbanking
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Prefill student details from logged in user
  useEffect(() => {
    if (user) {
      setStudentName(user.name || '');
      setStudentEmail(user.email || '');
      setStudentPhone(user.phone || '');
    } else {
      setStudentName('Vikrant Shinde');
      setStudentEmail('vikrant@example.com');
      setStudentPhone('9876543210');
    }
    setStep(1);
  }, [user, isOpen]);

  if (!isOpen || !batchData) return null;

  const defaultBatch = {
    courseName: batchData.courseName || batchData.title || 'Full Stack Web Development (MERN)',
    batchCode: batchData.batchCode || 'FS-2026-42',
    timing: batchData.timing || '09:00 AM - 11:00 AM (Mon-Fri)',
    mentor: batchData.mentor || 'Vikrant Shinde',
    startDate: batchData.startDate || '15 Sept 2026',
    fee: batchData.fee || '₹24,999'
  };

  // Extract fee number
  const numericFee = parseInt(defaultBatch.fee.replace(/[^0-9]/g, '')) || 24999;
  const paidAmountVal = paymentPlan === 'Full Payment' ? defaultBatch.fee : `₹${Math.round(numericFee * 0.4).toLocaleString('en-IN')}`;
  const pendingAmountVal = paymentPlan === 'Full Payment' ? '₹0' : `₹${Math.round(numericFee * 0.6).toLocaleString('en-IN')}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('codeguru@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleGoToPayment = (e) => {
    e.preventDefault();
    if (!studentName || !studentPhone) {
      alert('Please fill in your name and phone number to proceed.');
      return;
    }
    setStep(2);
  };

  const handleCompletePayment = () => {
    setIsSubmitting(true);
    const txnId = `TXN-${Date.now().toString().slice(-8)}`;
    setTransactionId(txnId);

    const enrollmentRecord = {
      id: `ENR-${Date.now().toString().slice(-5)}`,
      enrollmentId: `ENR-${Date.now().toString().slice(-5)}`,
      studentId: `CG-STU-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: studentName || 'Student User',
      studentEmail: studentEmail || 'student@example.com',
      studentPhone: studentPhone || '9876543210',
      courseName: defaultBatch.courseName,
      batchCode: defaultBatch.batchCode,
      timing: defaultBatch.timing,
      mentor: defaultBatch.mentor,
      startDate: defaultBatch.startDate,
      fee: defaultBatch.fee,
      paymentPlan: paymentPlan,
      paidAmount: paidAmountVal,
      pendingAmount: pendingAmountVal,
      feeStatus: paymentPlan === 'Full Payment' ? 'Paid' : 'Installment Pending',
      paymentMethod: paymentMethod === 'upi_qr' ? 'UPI QR Code' : paymentMethod === 'upi_app' ? 'UPI App (GPay/PhonePe)' : paymentMethod === 'card' ? 'Debit/Credit Card' : `Netbanking (${selectedBank})`,
      transactionId: txnId,
      status: 'Active',
      enrollmentDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      attendance: '100%',
      overallProgress: '0%',
      modules: [
        { name: 'Module 1: HTML5 & CSS3 Fundamentals', status: 'Completed', progress: 100 },
        { name: 'Module 2: JavaScript ES6+ & DOM', status: 'In Progress', progress: 40 },
        { name: 'Module 3: React.js Component Architecture', status: 'Upcoming', progress: 0 },
        { name: 'Module 4: Node.js, Express & MongoDB', status: 'Upcoming', progress: 0 }
      ]
    };

    try {
      // 1. LocalStorage update for instant student portal access
      const existingRaw = localStorage.getItem('codeguru_my_batches');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem('codeguru_my_batches', JSON.stringify([enrollmentRecord, ...existing]));

      // 2. Submit to Backend REST API (/api/enrollments)
      apiService.createEnrollment(enrollmentRecord);

      // 3. Admin CRM lead sync
      const newAdminLead = {
        id: `LEAD-${Date.now().toString().slice(-4)}`,
        name: enrollmentRecord.studentName,
        phone: enrollmentRecord.studentPhone,
        location: 'Pune Campus',
        course: `${enrollmentRecord.courseName} (${enrollmentRecord.batchCode})`,
        status: 'Enrolled',
        createdAt: new Date().toISOString(),
        notes: `Enrolled via Student Portal (${enrollmentRecord.paymentPlan}, Paid: ${enrollmentRecord.paidAmount}, Txn: ${txnId})`
      };
      apiService.submitLead(newAdminLead);

      const adminLeadsRaw = localStorage.getItem('codeguru_leads');
      const adminLeads = adminLeadsRaw ? JSON.parse(adminLeadsRaw) : [];
      localStorage.setItem('codeguru_leads', JSON.stringify([newAdminLead, ...adminLeads]));
      
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('codeguru_lead_added', { detail: newAdminLead }));
    } catch (err) {
      console.error('Error during enrollment payment submission:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
      setTimeout(() => {
        if (onEnrollSuccess) onEnrollSuccess(enrollmentRecord);
        onClose();
      }, 2000);
    }, 1200);
  };

  // Generate UPI QR Code image URL dynamically
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=codeguru@upi%26pn=CodeGuru%20Academy%26am=${numericFee}%26cu=INR`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Course Enrollment & Payment
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <ShieldIcon className="!w-3 !h-3" /> Secure 256-Bit SSL
              </span>
            </div>
            <h2 className="text-lg font-black font-heading tracking-tight mt-1 text-white">
              {step === 1 ? 'Confirm Batch & Contact Details' : step === 2 ? 'Select Payment Method' : 'Enrollment Confirmed!'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <CloseIcon className="!w-4 !h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-5 text-xs font-medium text-slate-700">

          {/* STEP 1: PLAN & STUDENT DETAILS */}
          {step === 1 && (
            <form onSubmit={handleGoToPayment} className="space-y-4 animate-fadeIn">
              
              {/* BATCH SUMMARY CARD */}
              <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[11px] font-black text-blue-600 bg-blue-100/70 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Batch: #{defaultBatch.batchCode}
                  </span>
                  <span className="font-black text-base text-slate-900">{defaultBatch.fee}</span>
                </div>

                <h3 className="text-sm font-black text-slate-900 font-heading">{defaultBatch.courseName}</h3>
                
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <AccessTimeIcon className="!w-3.5 !h-3.5 text-amber-500" />
                    <span>{defaultBatch.timing}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PersonIcon className="!w-3.5 !h-3.5 text-indigo-500" />
                    <span>Mentor: {defaultBatch.mentor}</span>
                  </div>
                </div>
              </div>

              {/* PAYMENT PLAN SELECTION */}
              <div>
                <label className="font-extrabold text-slate-900 block mb-1.5 text-xs">Choose Fee Payment Plan</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentPlan('Full Payment')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentPlan === 'Full Payment'
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-black text-slate-900">Full Payment</div>
                    <div className="text-[11px] text-emerald-600 font-bold mt-0.5">{defaultBatch.fee}</div>
                    <span className="text-[9px] text-slate-400 font-normal block">Instant Access + Full Certificate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentPlan('2 Installments')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentPlan === '2 Installments'
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-black text-slate-900">2 Installments</div>
                    <div className="text-[11px] text-blue-600 font-bold mt-0.5">{paidAmountVal} Now</div>
                    <span className="text-[9px] text-slate-400 font-normal block">Remainder ({pendingAmountVal}) in 30 days</span>
                  </button>
                </div>
              </div>

              {/* STUDENT CONTACT DETAILS */}
              <div className="space-y-3 pt-1">
                <label className="font-extrabold text-slate-900 block text-xs">Student Registration Details</label>
                
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter full student name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* PROCEED TO PAYMENT BUTTON */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                Proceed to Payment Gateway ({paidAmountVal}) <ArrowForwardIcon className="!w-4 !h-4" />
              </button>

            </form>
          )}

          {/* STEP 2: PAYMENT GATEWAY SIMULATOR */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* PAYMENT SUMMARY HEADER */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900 text-white rounded-2xl">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Amount Payable</span>
                  <span className="text-base font-black text-amber-400 font-mono">{paidAmountVal}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] font-bold text-blue-400 hover:underline cursor-pointer"
                >
                  Change Plan
                </button>
              </div>

              {/* PAYMENT METHODS SELECTOR TAB */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_qr')}
                  className={`py-2 rounded-xl text-[10px] font-extrabold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'upi_qr' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode2Icon className="!w-4 !h-4" /> UPI QR Code
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_app')}
                  className={`py-2 rounded-xl text-[10px] font-extrabold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'upi_app' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <PaymentIcon className="!w-4 !h-4" /> UPI Apps
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 rounded-xl text-[10px] font-extrabold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'card' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCardIcon className="!w-4 !h-4" /> Card
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`py-2 rounded-xl text-[10px] font-extrabold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'netbanking' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <AccountBalanceIcon className="!w-4 !h-4" /> Netbanking
                </button>
              </div>

              {/* PAYMENT OPTION 1: UPI QR CODE */}
              {paymentMethod === 'upi_qr' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                  <p className="text-[11px] font-bold text-slate-700">Scan QR Code using GPay, PhonePe, Paytm, or BHIM UPI</p>
                  
                  <div className="inline-block p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-md relative">
                    <img src={upiQrUrl} alt="UPI Payment QR Code" className="w-36 h-36 mx-auto rounded-lg" />
                    <span className="absolute -bottom-2 bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full border border-slate-900">
                      CodeGuru Verified UPI
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <span className="font-mono text-xs text-slate-800 font-bold bg-white px-3 py-1 rounded-lg border border-slate-200">
                      codeguru@upi
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ContentCopyIcon className="!w-3 !h-3" /> {copiedUpi ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {/* PAYMENT OPTION 2: UPI APPS */}
              {paymentMethod === 'upi_app' && (
                <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <p className="text-[11px] font-bold text-slate-700 mb-2">Select your UPI Application</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm UPI', 'BHIM UPI'].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={handleCompletePayment}
                        className="p-3 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-blue-500"
                      >
                        <PaymentIcon className="!w-4 !h-4 text-blue-600" /> Pay via {app}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PAYMENT OPTION 3: CREDIT / DEBIT CARD */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-600 block mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8892"
                      defaultValue="4532 8920 1192 8892"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-600 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="08/28"
                        defaultValue="08/28"
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-600 block mb-1">CVV Code</label>
                      <input
                        type="password"
                        placeholder="•••"
                        defaultValue="882"
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT OPTION 4: NETBANKING */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <p className="text-[11px] font-bold text-slate-700">Select Bank for Netbanking</p>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {/* FINAL CONFIRM & PAY BUTTON */}
              <button
                type="button"
                onClick={handleCompletePayment}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    Processing Payment & Saving Enrollment...
                  </span>
                ) : (
                  <>
                    <LockIcon className="!w-4 !h-4" /> Confirm Payment & Complete Enrollment ({paidAmountVal})
                  </>
                )}
              </button>

            </div>
          )}

          {/* STEP 3: SUCCESS & REDIRECT */}
          {step === 3 && (
            <div className="py-8 text-center flex flex-col items-center gap-3 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircleIcon className="!w-12 !h-12" />
              </div>
              <h3 className="text-xl font-black text-slate-900 font-heading">Payment Successful!</h3>
              
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-600 space-y-1 my-1">
                <div>Transaction ID: <span className="font-bold text-slate-900">{transactionId}</span></div>
                <div>Course: <span className="font-bold text-blue-600">{defaultBatch.courseName}</span></div>
                <div>Amount Paid: <span className="font-bold text-emerald-600">{paidAmountVal}</span></div>
              </div>

              <p className="text-xs text-slate-500 max-w-xs">
                Congratulations! You have successfully enrolled. Opening your <strong>My Batch</strong> dashboard now...
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
