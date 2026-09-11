import React, { useState, useEffect } from 'react';
import { usePlacementController } from '../controllers/usePlacementController';
import DeviceGuard from './components/DeviceGuard';
import Navbar from './components/Navbar';
import BannerSlider from './components/BannerSlider';
import TechLanguageSlider from './components/TechLanguageSlider';
import CompanyLogoSlider from './components/CompanyLogoSlider';
import CategoryNavbar from './components/CategoryNavbar';
import TopPlacementSlider from './components/TopPlacementSlider';
import OurTeamSlider from './components/OurTeamSlider';
import OurBranchesSection from './components/OurBranchesSection';
import ContactUsSection from './components/ContactUsSection';
import BottomNav from './components/BottomNav';
import LocationModal from './components/LocationModal';
import PlacementSelectorModal from './components/PlacementSelectorModal';
import ContactModal from './components/ContactModal';
import ProfilePage from './components/ProfilePage';
import InquiryModal from './components/InquiryModal';
import AuthModal from './components/AuthModal';
import MyBatchPage from './pages/MyBatchPage';
import BatchEnrollModal from './components/BatchEnrollModal';
import { apiService } from '../services/apiService';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  
  // Batch Enrollment Modal State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollBatchData, setEnrollBatchData] = useState(null);

  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('codeguru_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  });

  const checkUser = () => {
    try {
      const u = localStorage.getItem('codeguru_user');
      setUser(u ? JSON.parse(u) : null);
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleOpenEnrollModal = (batch = null) => {
    // If not logged in, prompt AuthModal first
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

  return (
    <DeviceGuard>
      <div className="flex flex-col min-h-screen bg-white text-slate-900 justify-between pt-16 xxs:pt-20 sm:pt-24 pb-16 xxs:pb-20">
        
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

        {activeTab === 'my-batch' ? (
          /* MY BATCH STUDENT PORTAL VIEW */
          <MyBatchPage
            onOpenContactModal={() => setIsContactModalOpen(true)}
            onOpenEnrollModal={() => handleOpenEnrollModal()}
          />
        ) : activeTab === 'profile' ? (
          /* PROFILE PAGE VIEW */
          <ProfilePage onOpenContactModal={() => setIsContactModalOpen(true)} />
        ) : activeTab === 'courses' ? (
          /* COURSES TAB VIEW */
          <div className="flex flex-col gap-2">
            <CategoryNavbar onOpenContactModal={() => setIsContactModalOpen(true)} onOpenEnrollModal={handleOpenEnrollModal} />
            <TechLanguageSlider onOpenContactModal={() => setIsContactModalOpen(true)} />
            <BannerSlider onOpenContactModal={() => setIsContactModalOpen(true)} />
            <ContactUsSection />
          </div>
        ) : activeTab === 'services' ? (
          /* SERVICES TAB VIEW */
          <div className="flex flex-col gap-2">
            <CompanyLogoSlider onOpenContactModal={() => setIsContactModalOpen(true)} />
            <OurBranchesSection onOpenContactModal={() => setIsContactModalOpen(true)} />
            <OurTeamSlider onOpenContactModal={() => setIsContactModalOpen(true)} />
            <ContactUsSection />
          </div>
        ) : activeTab === 'placements' ? (
          /* PLACEMENTS TAB VIEW */
          <div className="flex flex-col gap-2">
            <TopPlacementSlider onOpenContactModal={() => setIsContactModalOpen(true)} />
            <CompanyLogoSlider onOpenContactModal={() => setIsContactModalOpen(true)} />
            <ContactUsSection />
          </div>
        ) : (
          /* DEFAULT HOME VIEW */
          <>
            <BannerSlider onOpenContactModal={() => setIsContactModalOpen(true)} />
            <TechLanguageSlider onOpenContactModal={() => setIsContactModalOpen(true)} />
            <CompanyLogoSlider onOpenContactModal={() => setIsContactModalOpen(true)} />
            <CategoryNavbar onOpenContactModal={() => setIsContactModalOpen(true)} onOpenEnrollModal={handleOpenEnrollModal} />
            <TopPlacementSlider onOpenContactModal={() => setIsContactModalOpen(true)} />
            <OurTeamSlider onOpenContactModal={() => setIsContactModalOpen(true)} />
            <OurBranchesSection onOpenContactModal={() => setIsContactModalOpen(true)} />
            <ContactUsSection />
          </>
        )}

        <div className="flex-1" />

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
