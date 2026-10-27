import '../index.css';
import '../models/apiClient';
import ClientShell from './ClientShell';
import { BUSINESS_CONFIG } from '../config/business';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://codegurru.in'),
  title: {
    default: 'CodeGurru | IT Training, Software Development & Laptop Repair',
    template: '%s | CodeGurru',
  },
  description:
    'CodeGurru (UK VK Pvt. Ltd.) is Uttar Pradesh’s premier IT ecosystem founded by Kishan Pandey. Offering 100% placement IT bootcamps (MERN, Python AI, Java, C++ DSA), custom software engineering & same-day laptop repair in Ayodhya & Lucknow.',
  applicationName: 'CodeGurru',
  category: 'Education & Technology',
  classification: 'IT Training Institute, Software Development, Laptop Repair',
  keywords: [
    'CodeGurru',
    'Code Gurru',
    'CodeGuru',
    'CodeGuru Web',
    'CodeGurru Ayodhya',
    'CodeGurru Lucknow',
    'CodeGuru Ayodhya',
    'CodeGuru Lucknow',
    'UK VK Pvt. Ltd.',
    'Kishan Pandey CodeGurru',
    'Kishan Pandey',
    'Best IT Training Institute Lucknow',
    'Best IT Training Institute Ayodhya',
    'Coding Classes in Ayodhya',
    'Computer Institute Ayodhya',
    'Full Stack Web Development Course Ayodhya',
    'MERN Stack Coaching Lucknow',
    'Python AI Machine Learning Course Uttar Pradesh',
    'Java Spring Boot Training UP',
    'C++ DSA Coding Ayodhya',
    'Laptop Repair in Lucknow',
    'Laptop Repair in Ayodhya',
    'Computer Repair Near Me Ayodhya',
    'Motherboard Repair Ayodhya',
    'Software Development Company in Lucknow',
    'Software Development Company in Ayodhya',
    'IT Job Placement Guarantee UP',
    'CodeGurru Placement Academy',
  ],
  authors: [{ name: 'CodeGurru (UK VK Pvt. Ltd.)', url: 'https://codegurru.in' }],
  creator: 'Kishan Pandey, Founder & CEO CodeGurru',
  publisher: 'UK VK Pvt. Ltd.',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo-icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/logo-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'CodeGurru | Best IT Training, Software Development & Laptop Repair',
    description:
      'CodeGurru (UK VK Pvt. Ltd.) delivers job-oriented IT bootcamps (MERN, Python AI, Java), bespoke software development, and rapid computer/laptop repair across Uttar Pradesh.',
    url: 'https://codegurru.in',
    siteName: 'CodeGurru (UK VK Pvt. Ltd.)',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'CodeGurru - IT Training, Software Development & Computer Repair',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeGurru | IT Training, Software Development & Laptop Repair',
    description:
      'Learn Coding, Full Stack MERN, Java, and Python with Guaranteed Placement Support at CodeGurru (UK VK Pvt. Ltd.).',
    images: ['/logo.png'],
    creator: '@CodeGurru',
  },
  alternates: {
    canonical: 'https://codegurru.in',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION || undefined,
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://codegurru.in/#organization',
        name: BUSINESS_CONFIG.brandName,
        legalName: BUSINESS_CONFIG.legalName,
        alternateName: [...BUSINESS_CONFIG.alternateNames, 'कोड गुरु', 'कोडगुरु'],
        url: BUSINESS_CONFIG.urls.siteUrl,
        logo: BUSINESS_CONFIG.urls.logo,
        founder: {
          '@type': 'Person',
          name: BUSINESS_CONFIG.founder.name,
          jobTitle: BUSINESS_CONFIG.founder.role,
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: BUSINESS_CONFIG.contact.primaryPhone,
            contactType: 'customer support',
            areaServed: 'IN',
            availableLanguage: ['en', 'hi'],
          },
        ],
        sameAs: [
          BUSINESS_CONFIG.socialLinks.facebook,
          BUSINESS_CONFIG.socialLinks.instagram,
          BUSINESS_CONFIG.socialLinks.linkedin,
          BUSINESS_CONFIG.socialLinks.youtube,
        ],
      },
      {
        '@type': 'EducationalOrganization',
        '@id': 'https://codegurru.in/#ayodhya-campus',
        name: `${BUSINESS_CONFIG.brandName} - Ayodhya Campus`,
        parentOrganization: { '@id': 'https://codegurru.in/#organization' },
        url: BUSINESS_CONFIG.urls.siteUrl,
        telephone: BUSINESS_CONFIG.contact.primaryPhone,
        priceRange: '₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: BUSINESS_CONFIG.branches[0].streetAddress,
          addressLocality: BUSINESS_CONFIG.branches[0].city,
          addressRegion: BUSINESS_CONFIG.branches[0].state,
          postalCode: BUSINESS_CONFIG.branches[0].postalCode || '224123',
          addressCountry: BUSINESS_CONFIG.branches[0].country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: BUSINESS_CONFIG.branches[0].geo.latitude,
          longitude: BUSINESS_CONFIG.branches[0].geo.longitude,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '10:00',
            closes: '19:00',
          },
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://codegurru.in/#localbusiness',
        name: `${BUSINESS_CONFIG.brandName} - IT Training, Development & Computer Repair`,
        parentOrganization: { '@id': 'https://codegurru.in/#organization' },
        url: BUSINESS_CONFIG.urls.siteUrl,
        telephone: BUSINESS_CONFIG.contact.primaryPhone,
        priceRange: '₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: BUSINESS_CONFIG.branches[0].streetAddress,
          addressLocality: BUSINESS_CONFIG.branches[0].city,
          addressRegion: BUSINESS_CONFIG.branches[0].state,
          postalCode: BUSINESS_CONFIG.branches[0].postalCode || '224123',
          addressCountry: BUSINESS_CONFIG.branches[0].country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: BUSINESS_CONFIG.branches[0].geo.latitude,
          longitude: BUSINESS_CONFIG.branches[0].geo.longitude,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '10:00',
            closes: '19:00',
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://codegurru.in/#website',
        url: BUSINESS_CONFIG.urls.siteUrl,
        name: BUSINESS_CONFIG.brandName,
        alternateName: ['Code Gurru', 'कोड गुरु'],
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BUSINESS_CONFIG.urls.siteUrl}/courses?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'ItemList',
        '@id': 'https://codegurru.in/#sitelinks',
        name: 'CodeGurru Key Services & Navigation',
        itemListElement: [
          {
            '@type': 'SiteNavigationElement',
            position: 1,
            name: 'Home',
            description: 'CodeGurru Home - Best IT Training, Software Development & Laptop Repair',
            url: 'https://codegurru.in',
          },
          {
            '@type': 'SiteNavigationElement',
            position: 2,
            name: 'Courses',
            description: 'Job-oriented IT bootcamps: MERN Stack, Python AI, Java, C++ & DSA',
            url: 'https://codegurru.in/courses',
          },
          {
            '@type': 'SiteNavigationElement',
            position: 3,
            name: 'Services',
            description: 'Custom Web & App Development, Billing ERP & Doorstep Laptop Repair',
            url: 'https://codegurru.in/services',
          },
          {
            '@type': 'SiteNavigationElement',
            position: 4,
            name: 'Placements',
            description: '100% Placement Support, Hiring Partners & Student Salary Packages',
            url: 'https://codegurru.in/placements',
          },
          {
            '@type': 'SiteNavigationElement',
            position: 5,
            name: 'About CodeGurru',
            description: 'Founded by Kishan Pandey under UK VK Pvt. Ltd. in Uttar Pradesh',
            url: 'https://codegurru.in/about',
          },
          {
            '@type': 'SiteNavigationElement',
            position: 6,
            name: 'Contact & Helplines',
            description: 'Campus address Near Saket College Petrol Pump, Ayodhya & Call Desks',
            url: 'https://codegurru.in/contact',
          },
          {
            '@type': 'SiteNavigationElement',
            position: 7,
            name: 'FAQs',
            description: 'Frequently asked questions regarding courses, fees, admissions and repair',
            url: 'https://codegurru.in/faq',
          },
        ],
      },
    ],
  };

  return (
    <html lang="en-IN" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline';"
        />
        {/* Geo Meta Tags for Google Local Search & Maps */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Ayodhya, Uttar Pradesh" />
        <meta name="geo.position" content="26.7922;82.1998" />
        <meta name="ICBM" content="26.7922, 82.1998" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-slate-50 text-slate-900 antialiased selection:bg-orange-500 selection:text-white" suppressHydrationWarning>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
