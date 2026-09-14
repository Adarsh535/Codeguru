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
    'Best Full Stack Course Lucknow',
    'Software Training Lucknow',
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
      <CategoryNavbar onOpenContactModal={onOpenContactModal} onOpenEnrollModal={onOpenEnrollModal} />
      <TopPlacementSlider onOpenContactModal={onOpenContactModal} />
      <OurTeamSlider onOpenContactModal={onOpenContactModal} />
      <OurBranchesSection onOpenContactModal={onOpenContactModal} />
      <ContactUsSection />
    </div>
  );
}
