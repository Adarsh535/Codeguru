import CompanyLogoSlider from '../../views/components/CompanyLogoSlider';
import OurBranchesSection from '../../views/components/OurBranchesSection';
import OurTeamSlider from '../../views/components/OurTeamSlider';
import ContactUsSection from '../../views/components/ContactUsSection';

export const metadata = {
  title: 'IT Services & Corporate Training | CodeGuru Placement Academy',
  description:
    'Discover CodeGuru’s IT Training & Consultancy Services: Custom Corporate Training, Software Development Consultancy, Campus Recruitment, and Branch Centers across India.',
  keywords: [
    'CodeGuru Services',
    'Corporate IT Training',
    'Campus Placement Drive',
    'IT Software Consultancy',
    'CodeGuru Branches',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/services`,
  },
  openGraph: {
    title: 'CodeGuru IT Services & Corporate Training',
    description: 'Empowering students & corporations with top-tier IT training and software talent recruitment.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/services`,
  },
};

export default function ServicesPage({ onOpenContactModal }) {
  return (
    <div className="flex flex-col gap-2 pb-12 bg-slate-50">
      <CompanyLogoSlider onOpenContactModal={onOpenContactModal} />
      <OurBranchesSection onOpenContactModal={onOpenContactModal} />
      <OurTeamSlider onOpenContactModal={onOpenContactModal} />
      <ContactUsSection />
    </div>
  );
}
