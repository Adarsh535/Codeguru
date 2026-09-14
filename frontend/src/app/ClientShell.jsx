'use client';

import React, { useState, useEffect } from 'react';
import { usePlacementController } from '../controllers/usePlacementController';
import DeviceGuard from '../views/components/DeviceGuard';
import Navbar from '../views/components/Navbar';
import BottomNav from '../views/components/BottomNav';
import LocationModal from '../views/components/LocationModal';
import PlacementSelectorModal from '../views/components/PlacementSelectorModal';
import ContactModal from '../views/components/ContactModal';
import ProfilePage from '../views/components/ProfilePage';
import InquiryModal from '../views/components/InquiryModal';
import AuthModal from '../views/components/AuthModal';
import BatchEnrollModal from '../views/components/BatchEnrollModal';
import { apiService } from '../services/apiService';

export default function ClientShell({ children }) {
  const [activeTab, setActiveTab] = useState('home');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  
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

  // Auto-open Inquiry ("Get in Touch") popup modal immediately on site load & every 40 seconds
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setIsInquiryModalOpen(true);
    }, 600);

    const recurringInterval = setInterval(() => {
      setIsInquiryModalOpen(true);
    }, 40000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(recurringInterval);
    };
  }, []);

  const handleOpenEnrollModal = (batch = null) => {
    if (!user) {
      setAuthModalMode('register');
      setIsAuthModalOpen(true);
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
        user,
        selectedLocation,
        selectedCategory
      });
    }
    return child;
  });

  return (
    <DeviceGuard>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 justify-between overflow-x-hidden pb-20 sm:pb-8" suppressHydrationWarning>
        
        {/* RESPONSIVE TOPBAR HEADER */}
        <Navbar
          selectedLocation={selectedLocation}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          selectedCategory={selectedCategory}
          onOpenPlacementModal={() => setIsPlacementModalOpen(true)}
          onOpenContactModal={() => setIsContactModalOpen(true)}
          onOpenInquiryModal={() => setIsInquiryModalOpen(true)}
          onOpenLogin={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
          onOpenRegister={() => { setAuthModalMode('register'); setIsAuthModalOpen(true); }}
          setActiveTab={setActiveTab}
        />

        <main className="flex-1 overflow-x-hidden">
          {childrenWithProps}
        </main>

        {/* RESPONSIVE BOTTOM FOOTER NAVBAR */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
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

      </div>
    </DeviceGuard>
  );
}
