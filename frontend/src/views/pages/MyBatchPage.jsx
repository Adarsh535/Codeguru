import React, { useState, useEffect } from 'react';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VerifiedIcon from '@mui/icons-material/Verified';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

export default function MyBatchPage({ onOpenContactModal, onOpenEnrollModal }) {
  const [user, setUser] = useState(null);
  const [enrolledBatches, setEnrolledBatches] = useState([]);
  const [activeTab, setActiveTab] = useState('curriculum'); // curriculum, attendance, fees, resources

  useEffect(() => {
    // Load logged-in user
    try {
      const userRaw = localStorage.getItem('codeguru_user');
      if (userRaw) {
        setUser(JSON.parse(userRaw));
      }
    } catch (err) {
      console.error('Error parsing codeguru_user:', err);
    }

    // Load enrolled batches
    try {
      const batchesRaw = localStorage.getItem('codeguru_my_batches');
      if (batchesRaw) {
        setEnrolledBatches(JSON.parse(batchesRaw));
      } else {
        // Fallback default sample enrollment if empty
        const defaultEnrollment = [
          {
            id: 'ENR-88210',
            studentId: 'CG-STU-8821',
            courseName: 'Full Stack Web Development (MERN)',
            batchCode: 'FS-2026-42',
            timing: '09:00 AM - 11:00 AM (Mon-Fri)',
            mentor: 'Vikrant Shinde',
            startDate: '15 Sept 2026',
            fee: '₹24,999',
            paidAmount: '₹24,999',
            pendingAmount: '₹0',
            feeStatus: 'Paid',
            enrollmentDate: '01 Sept 2026',
            attendance: '94%',
            overallProgress: '45%',
            zoomLink: 'https://zoom.us/j/codeguru-batch-42',
            modules: [
              { name: 'Module 1: HTML5, CSS3 & Responsive Design', status: 'Completed', progress: 100, lessons: 8 },
              { name: 'Module 2: JavaScript ES6+ & DOM Programming', status: 'In Progress', progress: 75, lessons: 12 },
              { name: 'Module 3: React.js Component Architecture & Redux', status: 'Upcoming', progress: 0, lessons: 15 },
              { name: 'Module 4: Node.js, Express REST API & MongoDB', status: 'Upcoming', progress: 0, lessons: 14 }
            ]
          }
        ];
        setEnrolledBatches(defaultEnrollment);
      }
    } catch (err) {
      console.error('Error loading my batches:', err);
    }
  }, []);

  const currentBatch = enrolledBatches[0];

  const [certs, setCerts] = useState(() => {
    try {
      const saved = localStorage.getItem('codeguru_certificates');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'CG-CERT-2026-00047', studentId: 'CG-STU-8821', studentName: 'Priya Singh', course: 'Full Stack Web Development (MERN)', duration: '6 Months', monthsCompleted: 6, totalMonths: 6, status: 'Pending Approval', issueDate: null },
      { id: 'CG-CERT-2026-00045', studentId: 'CG-STU-0001', studentName: 'Aarav Patel', course: 'Full Stack Web Development (MERN)', duration: '6 Months', monthsCompleted: 6, totalMonths: 6, status: 'Approved', issueDate: '05 Sep 2026' },
      { id: 'CG-CERT-2026-00046', studentId: 'CG-STU-0002', studentName: 'Diya Sharma', course: 'Data Science & AI Masterclass', duration: '6 Months', monthsCompleted: 2, totalMonths: 6, status: 'Ongoing', issueDate: null }
    ];
  });

  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const syncCerts = () => {
      try {
        const saved = localStorage.getItem('codeguru_certificates');
        if (saved) setCerts(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('storage', syncCerts);
    window.addEventListener('codeguru_certificate_updated', syncCerts);
    return () => {
      window.removeEventListener('storage', syncCerts);
      window.removeEventListener('codeguru_certificate_updated', syncCerts);
    };
  }, []);

  const studentCert = certs.find(c => 
    (user?.name && c.studentName.toLowerCase().includes(user.name.toLowerCase())) || 
    c.studentId === currentBatch?.studentId
  ) || certs[0];

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
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6 select-none animate-fadeIn">
      
      {/* TOP STUDENT PORTAL BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black text-xl sm:text-2xl flex items-center justify-center border-2 border-white/20 shadow-md uppercase">
              {user?.name?.[0] || 'S'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 flex items-center gap-1">
                  <VerifiedIcon className="!w-3 !h-3" /> Enrolled Student Portal
                </span>
                <span className="font-mono text-[10px] text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                  {currentBatch?.studentId || 'CG-STU-8821'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">
                {user?.name || 'CodeGuru Student'}
              </h1>
              <p className="text-xs text-slate-300 font-medium">
                {user?.email || 'student@codeguru.com'} • Active Student Account
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenContactModal}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
            >
              <ContactSupportIcon className="!w-4 !h-4 text-amber-400" />
              <span>Ask Mentor Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* ENROLLED BATCHES GRID */}
      {enrolledBatches.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center flex flex-col items-center gap-3">
          <SchoolIcon className="!w-12 !h-12 text-slate-300" />
          <h3 className="text-lg font-black text-slate-800 font-heading">No Active Batch Enrollments</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            You haven't enrolled in any batch yet. Explore available course batches and enroll to start learning!
          </p>
          <button
            onClick={onOpenEnrollModal}
            className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs shadow-md cursor-pointer"
          >
            Browse & Enroll in Batch →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* ACTIVE BATCH CARD */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    Batch #{currentBatch.batchCode}
                  </span>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Active Batch
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-2 font-heading">
                  {currentBatch.courseName}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={currentBatch.zoomLink || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <VideoLibraryIcon className="!w-4 !h-4" />
                  <span>Join Live Class Room</span>
                </a>
              </div>
            </div>

            {/* BATCH TIMINGS & MENTOR DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Class Timing</span>
                <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                  <AccessTimeIcon className="!w-3.5 !h-3.5 text-amber-500" />
                  <span>{currentBatch.timing}</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Assigned Mentor</span>
                <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                  <PersonIcon className="!w-3.5 !h-3.5 text-indigo-500" />
                  <span>{currentBatch.mentor}</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
                <div className="text-xs font-black text-emerald-600 flex items-center gap-1">
                  <EventAvailableIcon className="!w-3.5 !h-3.5" />
                  <span>{currentBatch.attendance} Attendance</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Course Fee Status</span>
                <div className="text-xs font-black text-blue-600 flex items-center gap-1">
                  <VerifiedIcon className="!w-3.5 !h-3.5" />
                  <span>{currentBatch.feeStatus} ({currentBatch.paidAmount})</span>
                </div>
              </div>
            </div>

            {/* SYLLABUS PROGRESS BAR */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-extrabold">
                <span className="text-slate-800">Overall Course Progress</span>
                <span className="text-blue-600">{currentBatch.overallProgress} Completed</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${currentBatch.overallProgress}` }}></div>
              </div>
            </div>

          </div>

          {/* TAB CONTENT: CURRICULUM, CERTIFICATE, RESOURCES & FEES */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
              {[
                { id: 'curriculum', label: 'Batch Curriculum & Modules' },
                { id: 'certificate', label: 'Course Certificate & Graduation' },
                { id: 'resources', label: 'Video Lectures & PDFs' },
                { id: 'fees', label: 'Fee Receipt & Installments' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === t.id ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB 1: CURRICULUM */}
            {activeTab === 'curriculum' && (
              <div className="space-y-3">
                {currentBatch.modules.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-slate-900 text-sm">{m.name}</div>
                      <div className="text-slate-500 font-medium">{m.lessons} Video Lessons & Project Work</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                      m.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      m.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {m.status} ({m.progress}%)
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: CERTIFICATE STATUS & DOWNLOAD */}
            {activeTab === 'certificate' && (
              <div className="space-y-5">
                <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                        Official CodeGuru Graduation Certificate
                      </span>
                      <h3 className="text-lg font-black text-white mt-2 font-heading">
                        {studentCert.course}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Student: <strong className="text-slate-200">{studentCert.studentName}</strong> • ID: <span className="font-mono text-amber-300">{studentCert.id}</span>
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-black border ${
                        studentCert.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        studentCert.status === 'Pending Approval' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {studentCert.status === 'Approved' ? '● Verified & Approved by Admin' :
                         studentCert.status === 'Pending Approval' ? '⏳ Process Status: Pending Admin Approval' : '● Course Ongoing (6 Months Required)'}
                      </span>
                    </div>
                  </div>

                  {/* 6-MONTH DURATION STATUS ALERT & PROGRESS */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">6-Month Course Duration Status:</span>
                      <span className={studentCert.monthsCompleted >= 6 ? 'text-emerald-400' : 'text-amber-400'}>
                        {studentCert.monthsCompleted}/{studentCert.totalMonths} Months Completed ({studentCert.monthsCompleted >= 6 ? '100% Eligible' : 'In Progress'})
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${studentCert.monthsCompleted >= 6 ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ width: `${(studentCert.monthsCompleted / studentCert.totalMonths) * 100}%` }}></div>
                    </div>
                  </div>

                  {/* STATUS EXPLANATION BOX */}
                  {studentCert.status === 'Ongoing' && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-medium leading-relaxed">
                      ⚠️ <strong>Course Duration In Progress:</strong> Your course is currently in progress ({studentCert.monthsCompleted} of {studentCert.totalMonths} months). Official Graduation Certificate will be generated after completing the full 6 months course duration.
                    </div>
                  )}

                  {studentCert.status === 'Pending Approval' && (
                    <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs font-medium leading-relaxed">
                      ⏳ <strong>Status: Processing / Waiting for Admin Approval:</strong> Your 6-month course duration is 100% complete! Your certificate has been submitted for CodeGuru Admin approval. Once Admin approves, your download button will become active immediately.
                    </div>
                  )}

                  {studentCert.status === 'Approved' && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs font-medium leading-relaxed">
                      🎉 <strong>Approved & Issued:</strong> Congratulations! Your official CodeGuru Certificate of Achievement has been approved by Admin and is ready for download/printing.
                    </div>
                  )}

                  {/* ACTION BUTTON */}
                  <div className="pt-2">
                    {studentCert.status === 'Approved' ? (
                      <button
                        onClick={() => setSelectedCert(studentCert)}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>🎓 Preview & Download Official Black/Gold Certificate</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-6 py-3 rounded-2xl bg-slate-800 text-slate-500 font-bold text-xs uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2 border border-slate-700"
                      >
                        {studentCert.status === 'Pending Approval' ? '⏳ Certificate In Process (Waiting for Admin Approval)' : '🔒 Certificate Locked (Unlocks After 6 Months)'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: RESOURCES */}
            {activeTab === 'resources' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-extrabold text-slate-900">
                    <PlayCircleOutlineOutlinedIcon className="text-blue-600" />
                    <span>Live Class Recorded Lectures</span>
                  </div>
                  <p className="text-slate-500">Access HD recorded video lectures for all completed classes.</p>
                  <button onClick={() => alert('Opening Recorded Lectures Playlist...')} className="px-3.5 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-xs">
                    Watch Lectures →
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-extrabold text-slate-900">
                    <PictureAsPdfIcon className="text-rose-500" />
                    <span>Downloadable Study Notes & Cheatsheets</span>
                  </div>
                  <p className="text-slate-500">Download official CodeGuru chapter PDF notes & code snippets.</p>
                  <button onClick={() => alert('Downloading Batch Notes PDF...')} className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs">
                    Download Notes PDF
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: FEES */}
            {activeTab === 'fees' && (
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs font-medium">
                <h4 className="font-black text-slate-900 text-sm">Fee Payment Details</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div><span className="text-slate-400 font-bold block">Total Course Fee:</span> <strong className="text-slate-900">{currentBatch.fee}</strong></div>
                  <div><span className="text-slate-400 font-bold block">Amount Paid:</span> <strong className="text-emerald-600">{currentBatch.paidAmount}</strong></div>
                  <div><span className="text-slate-400 font-bold block">Pending Balance:</span> <strong className="text-rose-600">{currentBatch.pendingAmount}</strong></div>
                  <div><span className="text-slate-400 font-bold block">Payment Plan:</span> <strong className="text-slate-900">{currentBatch.paymentPlan || 'Full Payment'}</strong></div>
                </div>
                <button
                  onClick={() => alert(`Printing Fee Receipt for Enrollment #${currentBatch.id}...`)}
                  className="px-4 py-2 bg-blue-600 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <DownloadIcon className="!w-4 !h-4" /> Download Official Receipt PDF
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* STUDENT BLACK & GOLD CERTIFICATE PREVIEW MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#09090b] rounded-3xl p-6 sm:p-10 max-w-4xl w-full border-4 border-[#18181b] shadow-2xl relative space-y-6 text-center text-white my-auto animate-fade-in">
            
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* BLACK & GOLD FLORAL FRAME */}
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
                <DownloadIcon className="!w-4 !h-4" /> Download / Print PDF Certificate
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
