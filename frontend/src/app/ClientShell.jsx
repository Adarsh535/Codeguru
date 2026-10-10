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
import AuthModal from '../views/components/AuthModal';
import BatchEnrollModal from '../views/components/BatchEnrollModal';
import BottomBarOtpSheet from '../views/components/BottomBarOtpSheet';
import { apiService } from '../services/apiService';
import { realtimeSync } from '../services/realtimeService';

export default function ClientShell({ children }) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('home');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
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
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('codeguru_user_updated', checkUser);
    };
  }, []);

  const userRef = useRef(user);
  userRef.current = user;

  const isOtpSheetOpenRef = useRef(isOtpSheetOpen);
  isOtpSheetOpenRef.current = isOtpSheetOpen;

  // Auto-open BottomBarOtpSheet every 10 seconds until student logs in:
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('codeguru_user') : null;
        if (stored || userRef.current) {
          clearInterval(interval);
          return;
        }
      } catch (e) {}

      // If student is not logged in and sheet is currently closed, pop it open!
      if (!isOtpSheetOpenRef.current && !userRef.current) {
        setIsOtpSheetOpen(true);
      }
    }, 10000); // 10 seconds recurring interval

    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    apiService.pingTraffic('', selectedLocation?.name || '');
    const interval = setInterval(() => {
      apiService.pingTraffic('', selectedLocation?.name || '');
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedLocation]);

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

  return (
    <DeviceGuard>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 justify-between overflow-x-hidden pt-14 sm:pt-20 pb-20 sm:pb-8" suppressHydrationWarning>
        
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

        <main className="flex-1 overflow-x-hidden">
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

        {/* AUTHENTICATION LOGIN & REGISTER MODAL */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          onAuthSuccess={() => checkUser()}
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
          onClose={() => setIsOtpSheetOpen(false)}
          user={user}
          onLoginSuccess={() => checkUser()}
          onOpenContactModal={() => setIsContactModalOpen(true)}
        />

      </div>
    </DeviceGuard>
  );
}
