import TopPlacementSlider from '../../views/components/TopPlacementSlider';
import CompanyLogoSlider from '../../views/components/CompanyLogoSlider';
import ContactUsSection from '../../views/components/ContactUsSection';
import { BUSINESS_CONFIG } from '../../config/business';

export const metadata = {
  title: 'Student Placements & Hiring Partners | CodeGurru Success Stories',
  description:
    'Explore verified student placements at MNCs & startups from CodeGurru (UK VK Pvt. Ltd.) in Lucknow & Ayodhya with high salary packages up to 18.5 LPA.',
  keywords: [
    'CodeGurru Placements',
    'CodeGurru Student Salary',
    'IT Job Placement Guarantee Lucknow',
    'CodeGurru Hiring Partners',
    'Top Placed Students IT Ayodhya',
    'UK VK Pvt. Ltd. Placement Drives',
  ],
  alternates: {
    canonical: 'https://codegurru.in/placements',
  },
  openGraph: {
    title: 'CodeGurru Placements | 100% IT Job Placement Success Stories',
    description: 'Explore verified student placement stories and corporate hiring networks at CodeGurru (UK VK Pvt. Ltd.).',
    url: 'https://codegurru.in/placements',
  },
};

export default function PlacementsPage({ onOpenContactModal }) {
  return (
    <div className="flex flex-col gap-2 pb-12 bg-slate-50">
      <TopPlacementSlider onOpenContactModal={onOpenContactModal} />
      <CompanyLogoSlider onOpenContactModal={onOpenContactModal} />
      <ContactUsSection />
    </div>
  );
}
