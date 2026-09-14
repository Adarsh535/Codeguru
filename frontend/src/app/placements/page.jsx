import TopPlacementSlider from '../../views/components/TopPlacementSlider';
import CompanyLogoSlider from '../../views/components/CompanyLogoSlider';
import ContactUsSection from '../../views/components/ContactUsSection';

export const metadata = {
  title: 'Student Placements & Hiring Partners | CodeGuru Success Stories',
  description:
    'See our placed students working at MNCs like TCS, Wipro, Infosys, Paytm, and Amazon with high salary packages. CodeGuru guarantees 100% placement support.',
  keywords: [
    'CodeGuru Placements',
    'CodeGuru Student Salary',
    'IT Job Placement Guarantee',
    'CodeGuru Hiring Partners',
    'Top Placed Students IT Lucknow',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/placements`,
  },
  openGraph: {
    title: 'CodeGuru Placements | 100% IT Job Placement Success Stories',
    description: 'Explore verified student placement stories and corporate hiring networks at CodeGuru.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/placements`,
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
