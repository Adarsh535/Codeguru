import Link from 'next/link';
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
import { BUSINESS_CONFIG } from '../config/business';

export const metadata = {
  // `absolute` because the root layout's '%s | CodeGurru' template does not apply to the root page
  title: {
    absolute: 'CodeGurru (Code Gurru) Ayodhya – Coding, Arena Animation, Robotics & Repair Training Institute',
  },
  description:
    'CodeGurru (Code Gurru), Ayodhya: coding, web & app development, AI/ML, Arena Animation, robotics, digital marketing, server admin, and mobile, laptop & home appliance repairing courses for students from Class 6 to MCA across UP and Bihar.',
  keywords: [
    'CodeGurru',
    'Code Gurru',
    'CodeGuru',
    'CodeGuru Web',
    'UK VK Pvt. Ltd.',
    'Kishan Pandey CodeGurru',
    'IT Training Institute Lucknow',
    'Best IT Training Institute Ayodhya',
    'Best Full Stack Course Ayodhya',
    'Software Training Uttar Pradesh',
    'Laptop Repair Lucknow',
    'Laptop Repair Ayodhya',
    'CodeGurru Placements',
    'MERN Stack Coaching Ayodhya',
    'Python AI Course UP',
  ],
  alternates: {
    canonical: 'https://codegurru.in',
  },
  openGraph: {
    title: 'CodeGurru | Best IT Training, Software Development & Laptop Repair',
    description:
      'Explore 100% placement IT bootcamps, enterprise software engineering and same-day laptop repair at CodeGurru (UK VK Pvt. Ltd.) founded by Kishan Pandey.',
    url: 'https://codegurru.in',
    siteName: 'CodeGurru (UK VK Pvt. Ltd.)',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'CodeGurru Tech Ecosystem',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeGurru | Best IT Training, Software Development & Laptop Repair',
    description: 'Premier IT training institute & tech hub founded by Kishan Pandey in Uttar Pradesh.',
    images: ['/logo.png'],
  },
};

export default function HomePage({ onOpenContactModal, onOpenEnrollModal }) {
  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://codegurru.in/#webpage',
    url: 'https://codegurru.in',
    name: 'CodeGurru - Premier IT Training, Software Development & Laptop Repair',
    description:
      'CodeGurru (UK VK Pvt. Ltd.) provides practical IT training with 100% placement assistance, bespoke software engineering, and fast computer repair in Uttar Pradesh.',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://codegurru.in/#website',
    },
    about: {
      '@type': 'EducationalOrganization',
      name: BUSINESS_CONFIG.brandName,
      legalName: BUSINESS_CONFIG.legalName,
      founder: {
        '@type': 'Person',
        name: BUSINESS_CONFIG.founder.name,
      },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://codegurru.in',
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      {/* SEMANTIC H1 FOR GOOGLE CRAWLER INDEXING */}
      <div className="max-w-6xl mx-auto px-4 pt-3 pb-3 sm:pt-4 sm:pb-4">
        <h1 className="text-[15px] leading-snug sm:text-xl font-semibold text-slate-900">
          CodeGurru (Code Gurru) – Computer, Coding, Animation &amp; Repair Training Institute in Ayodhya
        </h1>
        <p className="hidden sm:block text-sm text-slate-600 mt-1">
          Courses for students from Class 6 to Polytechnic, BA, BCA &amp; MCA across Uttar Pradesh and Bihar.{' '}
          <Link href="/learn" className="font-bold text-orange-600 hover:text-orange-700">Find courses in your city →</Link>
        </p>
      </div>

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
    </>
  );
}
