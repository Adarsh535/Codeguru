'use client';

import { X as CloseIcon, CheckCircle2 as CheckCircleIcon, GraduationCap as SchoolIcon, Clock as AccessTimeIcon, User as PersonIcon, CreditCard as PaymentIcon, QrCode as QrCode2Icon, ArrowRight as ArrowForwardIcon, Copy as ContentCopyIcon, Lock as LockIcon, Shield as ShieldIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { getQuickLocationSync } from '../../utils/geoLocator';
import { BUSINESS_CONFIG } from '../../config/business';

export default function BatchEnrollModal({ isOpen, onClose, batchData, user, onEnrollSuccess }) {
  const [step, setStep] = useState(1); // 1: Plan & Details, 2: UPI Payment, 3: Success
  const [paymentPlan, setPaymentPlan] = useState('Full Payment');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [upiRefInput, setUpiRefInput] = useState('');
  const [enrollError, setEnrollError] = useState('');

  // Prefill student details from logged in user
  useEffect(() => {
    if (user) {
      setStudentName(user.name || '');
      setStudentEmail(user.email || '');
      setStudentPhone(user.phone || '');
    }
    setStep(1);
    setEnrollError('');
  }, [user, isOpen]);

  if (!isOpen) return null;

  const defaultBatch = {
    courseName: batchData?.courseName || batchData?.title || 'Full Stack Web Development (MERN)',
    batchCode: batchData?.batchCode || 'FS-2026-42',
    timing: batchData?.timing || '09:00 AM - 11:00 AM (Mon-Fri)',
    mentor: batchData?.mentor || 'Vikrant Shinde',
    startDate: batchData?.startDate || '15 Sept 2026',
    fee: batchData?.fee || batchData?.price || '₹24,999'
  };

  const numericFee = parseInt(defaultBatch.fee.replace(/[^0-9]/g, '')) || 24999;
  const paidAmountVal = paymentPlan === 'Full Payment' ? defaultBatch.fee : `₹${Math.round(numericFee * 0.4).toLocaleString('en-IN')}`;
  const pendingAmountVal = paymentPlan === 'Full Payment' ? '₹0' : `₹${Math.round(numericFee * 0.6).toLocaleString('en-IN')}`;

  // Unified single UPI ID from single source of truth config (F4)
  const upiId = BUSINESS_CONFIG.upiId || 'codegurru@upi';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleGoToPayment = (e) => {
    e.preventDefault();
    if (!studentName || !studentPhone) {
      setEnrollError('Please fill in your name and phone number to proceed.');
      return;
    }
    setEnrollError('');
    setStep(2);
  };

  // TODO: Razorpay integration — verify payment signature and webhook server-side
  const handleCompletePayment = async () => {
    if (!upiRefInput.trim()) {
      setEnrollError('Please enter the 12-digit UPI UTR / Reference number from your payment app.');
      return;
    }

    setIsSubmitting(true);
    setEnrollError('');
    const txnId = upiRefInput.trim();
    setTransactionId(txnId);

    const enrollmentRecord = {
      courseName: defaultBatch.courseName,
      batchCode: defaultBatch.batchCode,
      timing: defaultBatch.timing,
      mentor: defaultBatch.mentor,
      startDate: defaultBatch.startDate,
      fee: defaultBatch.fee,
      paymentPlan: paymentPlan,
      paidAmount: paidAmountVal,
      pendingAmount: pendingAmountVal,
      feeStatus: 'Pending Verification',
      paymentMethod: 'UPI',
      transactionId: txnId,
      status: 'Pending Verification',
      enrollmentDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    try {
      // 1. Submit to Backend REST API
      const res = await apiService.createEnrollment(enrollmentRecord);

      // 2. Local storage record for student reference
      const existingRaw = localStorage.getItem('codeguru_my_batches');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem('codeguru_my_batches', JSON.stringify([enrollmentRecord, ...existing]));

      // 3. Lead sync
      const studentLiveLoc = getQuickLocationSync() || 'Online';
      apiService.submitLead({
        name: studentName,
        phone: studentPhone,
        email: studentEmail || '',
        location: studentLiveLoc,
        course: `${defaultBatch.courseName} (${defaultBatch.batchCode})`,
        status: 'Enrolled',
        notes: `Enrolled via Student Portal (UTR: ${txnId}, Plan: ${paymentPlan})`
      }).catch(() => {});

      setTimeout(() => {
        setIsSubmitting(false);
        setStep(3);
        setTimeout(() => {
          if (onEnrollSuccess) onEnrollSuccess(enrollmentRecord);
          onClose();
        }, 2200);
      }, 1000);
    } catch (err) {
      setIsSubmitting(false);
      setEnrollError('Failed to record enrollment. Please try again.');
    }
  };

  // Dynamic QR Code for single UPI ID
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=CodeGurru%20Academy&am=${numericFee}&cu=INR`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-backdrop-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] overflow-y-auto animate-modal-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Course Enrollment & UPI Payment
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <ShieldIcon className="!w-3 !h-3" /> Secure Enrollment
              </span>
            </div>
            <h2 className="text-lg font-bold font-heading tracking-tight mt-1 text-white">
              {step === 1 ? 'Confirm Batch & Contact Details' : step === 2 ? 'Complete Payment via UPI' : 'Enrollment Submitted!'}
            </h2>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <CloseIcon className="!w-5 !h-5" />
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="flex border-b border-slate-100 bg-slate-50/80">
          <div className={`flex-1 py-2 text-center text-xs font-bold transition-colors ${step >= 1 ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-400'}`}>
            1. Student Info
          </div>
          <div className={`flex-1 py-2 text-center text-xs font-bold transition-colors ${step >= 2 ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-400'}`}>
            2. UPI Payment
          </div>
          <div className={`flex-1 py-2 text-center text-xs font-bold transition-colors ${step === 3 ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white' : 'text-slate-400'}`}>
            3. Verification
          </div>
        </div>

        <div className="p-6">
          {enrollError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
              {enrollError}
            </div>
          )}

          {/* STEP 1: BATCH DETAILS & CONTACT FORM */}
          {step === 1 && (
            <form onSubmit={handleGoToPayment} className="space-y-4">
              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-indigo-600">Selected Program</span>
                    <h3 className="text-sm font-bold text-slate-900 font-heading">{defaultBatch.courseName}</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-white border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg font-mono">
                    {defaultBatch.batchCode}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-100 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5"><AccessTimeIcon className="!w-3.5 !h-3.5 text-indigo-500" /> {defaultBatch.timing}</div>
                  <div className="flex items-center gap-1.5"><PersonIcon className="!w-3.5 !h-3.5 text-indigo-500" /> Mentor: {defaultBatch.mentor}</div>
                </div>
              </div>

              {/* PAYMENT PLAN SELECTION */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Select Payment Plan</label>
                <div className="grid grid-cols-2 gap-3">
                  <label 
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-1 ${
                      paymentPlan === 'Full Payment' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="paymentPlan" 
                      value="Full Payment" 
                      checked={paymentPlan === 'Full Payment'} 
                      onChange={() => setPaymentPlan('Full Payment')} 
                      className="sr-only" 
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900">One-Time Fee</span>
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">BEST VALUE</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600 font-mono">{defaultBatch.fee}</span>
                    <span className="text-xs text-slate-500">100% Course Fee cleared</span>
                  </label>

                  <label 
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-1 ${
                      paymentPlan === 'Installment Plan' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="paymentPlan" 
                      value="Installment Plan" 
                      checked={paymentPlan === 'Installment Plan'} 
                      onChange={() => setPaymentPlan('Installment Plan')} 
                      className="sr-only" 
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900">Easy Installment</span>
                      <span className="text-xs font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">40% NOW</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600 font-mono">₹{Math.round(numericFee * 0.4).toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-500">Remaining 60% in Month 2</span>
                  </label>
                </div>
              </div>

              {/* STUDENT CONTACT FORM */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Mobile</label>
                    <input
                      type="tel"
                      required
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                Proceed to UPI Payment ({paidAmountVal}) <ArrowForwardIcon className="!w-4 !h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: UPI PAYMENT GATEWAY */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Payable Amount</span>
                  <span className="text-base font-bold text-amber-400 font-mono">{paidAmountVal}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-blue-400 hover:underline cursor-pointer"
                >
                  Change Plan
                </button>
              </div>

              {/* UPI QR CODE & DIRECT TRANSFER */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                <p className="text-xs font-bold text-slate-700">Scan QR Code using GPay, PhonePe, Paytm, or any UPI App</p>
                
                <div className="inline-block p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-md relative">
                  <img src={upiQrUrl} alt="UPI Payment QR Code" className="w-36 h-36 mx-auto rounded-lg" />
                  <span className="absolute -bottom-2 bg-amber-400 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-900">
                    CodeGurru Official UPI
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="font-mono text-xs text-slate-800 font-bold bg-white px-3 py-1 rounded-lg border border-slate-200">
                    {upiId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ContentCopyIcon className="!w-3 !h-3" /> {copiedUpi ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* UTR / TRANSACTION REFERENCE NUMBER INPUT */}
              <div className="space-y-1.5 p-3.5 bg-blue-50/60 border border-blue-200 rounded-2xl">
                <label className="text-xs font-bold text-slate-900 block">
                  Enter UPI UTR / Transaction Reference Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 429381029482 (12-digit UPI Ref)"
                  value={upiRefInput}
                  onChange={(e) => setUpiRefInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-slate-500">
                  After paying via UPI, enter the 12-digit transaction UTR number shown in your UPI app receipt to submit for verification.
                </p>
              </div>

              {/* FINAL CONFIRM & SUBMIT BUTTON */}
              <button
                type="button"
                onClick={handleCompletePayment}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    Submitting Enrollment for Verification...
                  </span>
                ) : (
                  <>
                    <LockIcon className="!w-4 !h-4" /> Submit Payment Verification ({paidAmountVal})
                  </>
                )}
              </button>

            </div>
          )}

          {/* STEP 3: SUBMITTED FOR VERIFICATION */}
          {step === 3 && (
            <div className="py-8 text-center flex flex-col items-center gap-3 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center animate-bounce">
                <CheckCircleIcon className="!w-12 !h-12 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Enrollment Submitted!</h3>
              
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-600 space-y-1 my-1">
                <div>UTR Reference: <span className="font-bold text-slate-900">{transactionId}</span></div>
                <div>Course: <span className="font-bold text-blue-600">{defaultBatch.courseName}</span></div>
                <div>Status: <span className="font-bold text-amber-600">Pending Admin Verification</span></div>
              </div>

              <p className="text-xs text-slate-500 max-w-xs">
                Your payment details have been submitted. Our admission team will verify your UTR and activate your batch access.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
