import HeroSection from '../views/components/HeroSection';
import BannerSlider from '../views/components/BannerSlider';
import TechLanguageSlider from '../views/components/TechLanguageSlider';
import CompanyLogoSlider from '../views/components/CompanyLogoSlider';
import CategoryNavbar from '../views/components/CategoryNavbar';
import FeaturedAdBanner from '../views/components/FeaturedAdBanner';
import TopPlacementSlider from '../views/components/TopPlacementSlider';
import OurTeamSlider from '../views/components/OurTeamSlider';
import OurBranchesSection from '../views/components/OurBranchesSection';
import ContactUsSection from '../views/components/ContactUsSection';

export const metadata = {
  title: 'CodeGurru | Best IT Training, Software Development & Laptop Repair',
  description:
    'CodeGurru (UK VK Pvt. Ltd.) is Uttar Pradesh’s top IT ecosystem founded by Kishan Pandey. Offering 100% placement IT courses, custom software & laptop repair in Lucknow & Ayodhya.',
  keywords: [
    'CodeGurru',
    'Code Gurru',
    'UK VK Pvt. Ltd.',
    'Kishan Pandey CodeGurru',
    'IT Training Institute Lucknow',
    'Best Full Stack Course Ayodhya',
    'Software Training Uttar Pradesh',
    'Laptop Repair Lucknow',
    'CodeGurru Placements',
  ],
  alternates: {
    canonical: 'https://codegurru.in',
  },
};

export default function HomePage({ onOpenContactModal, onOpenEnrollModal }) {
  return (
    <div className="flex flex-col w-full pb-12 bg-slate-50">
      <BannerSlider onOpenContactModal={onOpenContactModal} />
      <TechLanguageSlider onOpenContactModal={onOpenContactModal} />
      <CompanyLogoSlider onOpenContactModal={onOpenContactModal} />
      <CategoryNavbar onOpenContactModal={onOpenContactModal} onOpenEnrollModal={onOpenEnrollModal} isHomePage={true} />
      
      {/* DYNAMIC FEATURED AD BANNER (MANAGED FROM ADMIN CRM) */}
      <FeaturedAdBanner onOpenContactModal={onOpenContactModal} />

      <HeroSection onOpenContactModal={onOpenContactModal} />
      <TopPlacementSlider onOpenContactModal={onOpenContactModal} />
      <OurTeamSlider onOpenContactModal={onOpenContactModal} />
      <OurBranchesSection onOpenContactModal={onOpenContactModal} />
      <ContactUsSection />
    </div>
  );
}
