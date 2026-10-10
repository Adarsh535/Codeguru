import ServicesPage from '../../views/pages/ServicesPage';

export const metadata = {
  title: 'Services | Coming Soon - CodeGuru Placement Academy',
  description:
    'Discover CodeGuru’s upcoming IT Training & Consultancy Services: Corporate Training, Custom Software Development, and Campus Recruitment.',
  keywords: [
    'CodeGuru Services',
    'Coming Soon',
    'Corporate IT Training',
    'Campus Placement Drive',
    'Software Consultancy',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/services`,
  },
  openGraph: {
    title: 'CodeGuru IT Services | Coming Soon',
    description: 'Empowering students & corporations with top-tier IT training and software talent recruitment.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/services`,
  },
};

export default function ServicesRoute({ onOpenContactModal }) {
  return <ServicesPage onOpenContactModal={onOpenContactModal} />;
}
