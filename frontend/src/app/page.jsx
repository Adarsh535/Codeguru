import HeroSection from '../views/components/HeroSection';
import BannerSlider from '../views/components/BannerSlider';
import TechLanguageSlider from '../views/components/TechLanguageSlider';
import CompanyLogoSlider from '../views/components/CompanyLogoSlider';
import CategoryNavbar from '../views/components/CategoryNavbar';
import TopPlacementSlider from '../views/components/TopPlacementSlider';
import OurTeamSlider from '../views/components/OurTeamSlider';
import OurBranchesSection from '../views/components/OurBranchesSection';
import ContactUsSection from '../views/components/ContactUsSection';

export const metadata = {
  title: 'CodeGuru | Home - Premier IT Software Training & Placement Institute',
  description:
    'Welcome to CodeGuru! Learn Full Stack MERN Development, Java, Python, and get placed in top IT MNCs with our 100% placement support.',
  keywords: [
    'CodeGuru Home',
    'IT Training Institute',
    'Best Full Stack Course Ayodhya',
    'Software Training Ayodhya',
    'Code Guru Placements',
  ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
};

export default function HomePage({ onOpenContactModal, onOpenEnrollModal }) {
  return (
    <div className="flex flex-col w-full pb-12 bg-slate-50">
      <BannerSlider onOpenContactModal={onOpenContactModal} />
      <TechLanguageSlider onOpenContactModal={onOpenContactModal} />
      <CompanyLogoSlider onOpenContactModal={onOpenContactModal} />
      <CategoryNavbar onOpenContactModal={onOpenContactModal} onOpenEnrollModal={onOpenEnrollModal} isHomePage={true} />
      
      {/* FEATURED 25 YEARS ARENA ANIMATION BANNER */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-2 sm:pt-3 w-full">
        <div className="w-full rounded-[16px] sm:rounded-[22px] bg-white border border-slate-200/90 p-1.5 sm:p-2.5 shadow-xs flex items-center justify-center overflow-hidden hover:shadow-sm transition-shadow">
          <img
            src="/images/arena-25-years.jpg"
            alt="Celebrating 25 Years - Arena Animation"
            className="w-full h-[100px] sm:h-[160px] md:h-[200px] object-cover sm:object-fill rounded-xl mx-auto"
          />
        </div>
      </div>

      <HeroSection onOpenContactModal={onOpenContactModal} />
      <TopPlacementSlider onOpenContactModal={onOpenContactModal} />
      <OurTeamSlider onOpenContactModal={onOpenContactModal} />
      <OurBranchesSection onOpenContactModal={onOpenContactModal} />
      <ContactUsSection />
    </div>
  );
}
