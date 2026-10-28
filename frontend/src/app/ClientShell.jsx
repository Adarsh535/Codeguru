'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { usePlacementController } from '../controllers/usePlacementController';
import DeviceGuard from '../views/components/DeviceGuard';
import Navbar from '../views/components/Navbar';
import BottomNav from '../views/components/BottomNav';
import Footer from '../views/components/Footer';
import LocationModal from '../views/components/LocationModal';
import PlacementSelectorModal from '../views/components/PlacementSelectorModal';
import ContactModal from '../views/components/ContactModal';
import ProfilePage from '../views/components/ProfilePage';
import InquiryModal from '../views/components/InquiryModal';
import BatchEnrollModal from '../views/components/BatchEnrollModal';
import BottomBarOtpSheet from '../views/components/BottomBarOtpSheet';
import { ModalsProvider } from '../context/ModalsContext';
import { apiService } from '../services/apiService';
import { realtimeSync } from '../services/realtimeService';
import { trackPageView, sendHeartbeat, sendLeaveEvent } from '../utils/visitorTracker';

export default function ClientShell({ children }) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('home');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isOtpSheetOpen, setIsOtpSheetOpen] = useState(false);
  
  // Batch Enrollment Modal State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollBatchData, setEnrollBatchData] = useState(null);

  const [user, setUser] = useState(null);

  const checkUser = () => {
    try {
      if (typeof window !== 'undefined') {
        const u = localStorage.getItem('codeguru_user');
        setUser(u ? JSON.parse(u) : null);
      }
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('storage', checkUser);
    window.addEventListener('codeguru_user_updated', checkUser);

    // Ensure no service worker prompts install
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const reg of registrations) {
          reg.unregister();
        }
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('codeguru_user_updated', checkUser);
    };
  }, []);

  const userRef = useRef(user);
  userRef.current = user;

  const isOtpSheetOpenRef = useRef(isOtpSheetOpen);
  isOtpSheetOpenRef.current = isOtpSheetOpen;

  const handleCloseOtpSheet = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('codeguru_otp_sheet_dismissed');
      }
    } catch (e) {}
    setIsOtpSheetOpen(false);
  };

  // Har 18 second baad popup aana chahiye jab tak student login na ho
  useEffect(() => {
    // Agar student already logged in hai to popup bilkul na aaye
    const isStudentLoggedIn = Boolean(user && (user.isLoggedIn || user.phone || user.email || user.name));
    if (isStudentLoggedIn) {
      return;
    }

    // Agar popup abhi open hai ya koi interactive modal open hai to wait kare
    if (isOtpSheetOpen || isInquiryModalOpen || isEnrollModalOpen) {
      return;
    }

    // 18 second baad popup show kare
    const timer = setTimeout(() => {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('codeguru_user') : null;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.isLoggedIn || parsed.phone || parsed.email || parsed.name)) {
            return;
          }
        }
      } catch (e) {}

      setIsOtpSheetOpen(true);
    }, 18000);

    return () => clearTimeout(timer);
  }, [user, isOtpSheetOpen, isInquiryModalOpen, isEnrollModalOpen]);

  const handleOpenEnrollModal = (batch = null) => {
    if (!user) {
      setIsOtpSheetOpen(true);
      return;
    }
    setEnrollBatchData(batch || {
      courseName: 'Full Stack Web Development (MERN)',
      batchCode: 'FS-2026-42',
      timing: '09:00 AM - 11:00 AM (Mon-Fri)',
      mentor: 'Vikrant Shinde',
      fee: '₹24,999'
    });
    setIsEnrollModalOpen(true);
  };

  const handleEnrollSuccess = () => {
    setActiveTab('my-batch');
  };

  const {
    locations,
    categories,
    selectedLocation,
    setSelectedLocation,
    selectedCategory,
    setSelectedCategory,
    isLocationModalOpen,
    setIsLocationModalOpen,
    isPlacementModalOpen,
    setIsPlacementModalOpen,
    isContactModalOpen,
    setIsContactModalOpen
  } = usePlacementController();

  // Track visitor page views on route changes and maintain live presence
  useEffect(() => {
    trackPageView(pathname);

    let hbInterval = null;

    const startHeartbeat = () => {
      if (hbInterval) clearInterval(hbInterval);
      hbInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          sendHeartbeat(pathname);
        }
      }, 8000); // 8s high-frequency interval for live active presence
    };

    const stopHeartbeat = () => {
      if (hbInterval) {
        clearInterval(hbInterval);
        hbInterval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat(pathname);
        startHeartbeat();
      } else {
        stopHeartbeat();
      }
    };

    const handleLeave = () => {
      sendLeaveEvent(pathname);
    };

    // Trigger heartbeat immediately when tab is active and start interval
    if (document.visibilityState === 'visible') {
      sendHeartbeat(pathname);
      startHeartbeat();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleLeave);
    window.addEventListener('pagehide', handleLeave);

    return () => {
      stopHeartbeat();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleLeave);
      window.removeEventListener('pagehide', handleLeave);
    };
  }, [pathname]);

  // Clone children and pass callbacks if needed
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onOpenContactModal: () => setIsContactModalOpen(true),
        onOpenEnrollModal: handleOpenEnrollModal,
        onOpenInquiryModal: () => setIsInquiryModalOpen(true),
        onOpenOtpSheet: () => setIsOtpSheetOpen(true),
        user,
        selectedLocation,
        selectedCategory
      });
    }
    return child;
  });

  const modalsValue = {
    openEnrollModal: handleOpenEnrollModal,
    openContactModal: () => setIsContactModalOpen(true),
    openInquiryModal: () => setIsInquiryModalOpen(true),
    openOtpSheet: () => setIsOtpSheetOpen(true),
    openLocationModal: () => setIsLocationModalOpen(true),
    openPlacementModal: () => setIsPlacementModalOpen(true),
    user,
    selectedLocation,
    selectedCategory
  };

  return (
    <DeviceGuard>
      <ModalsProvider value={modalsValue}>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 justify-between overflow-x-clip pt-[70px] sm:pt-20 pb-20 sm:pb-8" suppressHydrationWarning>
          
          {/* RESPONSIVE TOPBAR HEADER */}
          <Navbar
            selectedLocation={selectedLocation}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            selectedCategory={selectedCategory}
            onOpenPlacementModal={() => setIsPlacementModalOpen(true)}
            onOpenContactModal={() => setIsContactModalOpen(true)}
            onOpenInquiryModal={() => setIsInquiryModalOpen(true)}
            onOpenLogin={() => setIsOtpSheetOpen(true)}
            onOpenRegister={() => setIsOtpSheetOpen(true)}
            setActiveTab={setActiveTab}
          />

          <main className="flex-1 relative z-30">
            {childrenWithProps}
          </main>

          {/* INTERACTIVE FOOTER WITH LIVE LOCATION MAP */}
          {pathname !== '/courses' && (
            <Footer
              selectedLocation={selectedLocation}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              onOpenContactModal={() => setIsContactModalOpen(true)}
            />
          )}

          {/* RESPONSIVE BOTTOM FOOTER NAVBAR */}
          <BottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
            onOpenOtpSheet={() => setIsOtpSheetOpen(true)}
            onOpenContactModal={() => setIsContactModalOpen(true)}
            onOpenPlacementModal={() => setIsPlacementModalOpen(true)}
          />

          {/* LOCATION SELECTOR MODAL */}
          <LocationModal
            isOpen={isLocationModalOpen}
            onClose={() => setIsLocationModalOpen(false)}
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
          />

          {/* PLACEMENT SELECTOR MODAL */}
          <PlacementSelectorModal
            isOpen={isPlacementModalOpen}
            onClose={() => setIsPlacementModalOpen(false)}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* SOCIAL & CONTACT CHANNELS POPUP MODAL */}
          <ContactModal
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
          />

          {/* INQUIRIES MODAL */}
          <InquiryModal
            isOpen={isInquiryModalOpen}
            onClose={() => setIsInquiryModalOpen(false)}
            onSubmitSuccess={() => checkUser()}
          />



          {/* BATCH ENROLLMENT MODAL */}
          <BatchEnrollModal
            isOpen={isEnrollModalOpen}
            onClose={() => setIsEnrollModalOpen(false)}
            batchData={enrollBatchData}
            user={user}
            onEnrollSuccess={handleEnrollSuccess}
          />

          {/* SMOOTH BOTTOM BAR OTP LOGIN SHEET */}
          <BottomBarOtpSheet
            isOpen={isOtpSheetOpen}
            onClose={handleCloseOtpSheet}
            user={user}
            onLoginSuccess={() => checkUser()}
            onOpenContactModal={() => setIsContactModalOpen(true)}
          />

        </div>
      </ModalsProvider>
    </DeviceGuard>
  );
}
