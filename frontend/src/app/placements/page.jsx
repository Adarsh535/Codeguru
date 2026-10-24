import TopPlacementSlider from '../../views/components/TopPlacementSlider';
import CompanyLogoSlider from '../../views/components/CompanyLogoSlider';
import ContactUsSection from '../../views/components/ContactUsSection';
import { BUSINESS_CONFIG } from '../../config/business';
import { Award, Sparkles, TrendingUp, Users } from 'lucide-react';

export const metadata = {
  title: 'Student Placements & Hiring Partners',
  description:
    'Explore verified student placements at MNCs & startups from CodeGurru (UK VK Pvt. Ltd.) in Lucknow & Ayodhya with high salary packages up to 18.5 LPA.',
  keywords: [
    'CodeGurru Placements',
    'CodeGurru Student Salary',
    'IT Job Placement Guarantee Lucknow',
    'CodeGurru Hiring Partners',
    'Top Placed Students IT Ayodhya',
    'UK VK Pvt. Ltd. Placement Drives',
    'Highest Package CodeGurru',
  ],
  alternates: {
    canonical: 'https://codegurru.in/placements',
  },
  openGraph: {
    title: 'CodeGurru Placements | 100% IT Job Placement Success Stories',
    description: 'Explore verified student placement stories and corporate hiring networks at CodeGurru (UK VK Pvt. Ltd.).',
    url: 'https://codegurru.in/placements',
    siteName: 'CodeGurru (UK VK Pvt. Ltd.)',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'CodeGurru Placements',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeGurru Placements | 100% IT Placement Support',
    description: 'Explore verified salary packages and hiring partners at CodeGurru.',
    images: ['/logo.png'],
  },
};

export default function PlacementsPage({ onOpenContactModal }) {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://codegurru.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Placements',
        item: 'https://codegurru.in/placements',
      },
    ],
  };

  const placementJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'CodeGurru Student Placements and Corporate Drives',
    description:
      'Verified corporate placements and hiring partners of CodeGurru (UK VK Pvt. Ltd.) across top product and service MNCs.',
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'CodeGurru (UK VK Pvt. Ltd.)',
      sameAs: 'https://codegurru.in',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placementJsonLd) }}
      />

      {/* SEO HERO BANNER FOR PLACEMENTS PAGE */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white px-4 pt-10 pb-12 sm:pt-12 sm:pb-14 text-center select-none">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>PROVEN TRACK RECORD &amp; CAREER SUCCESS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight mb-3">
            Student Placements &amp; Hiring Network
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-6">
            Connecting talented software engineers from Uttar Pradesh to premier technology enterprises, unicorns, and high-growth startups with packages up to 18.5 LPA.
          </p>

          {/* QUICK STATS */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg sm:text-2xl font-black text-amber-400">18.5 LPA</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-semibold">Highest CTC</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg sm:text-2xl font-black text-emerald-400">200+</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-semibold">Students Placed</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg sm:text-2xl font-black text-cyan-400">50+</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-semibold">Hiring Partners</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pb-12 bg-slate-50">
        <TopPlacementSlider onOpenContactModal={onOpenContactModal} />
        <CompanyLogoSlider onOpenContactModal={onOpenContactModal} />
        <ContactUsSection />
      </div>
    </>
  );
}
