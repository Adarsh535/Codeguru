import '../index.css';
import ClientShell from './ClientShell';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'CodeGuru | Full Stack Web Development & IT Placement Academy',
    template: '%s | CodeGuru Placement Academy',
  },
  description:
    'CodeGuru is India’s premier IT learning & placement academy offering industry-aligned Full Stack Web Development (MERN, Java, Python), Cloud Computing, Data Science, and guaranteed placement drives.',
  keywords: [
    'CodeGuru',
    'Code Guru Placement',
    'Full Stack Web Development Course',
    'MERN Stack Institute Lucknow',
    'Java Full Stack Training',
    'Python Coding Academy',
    'IT Job Placement Guarantee',
    'Software Engineer Coaching',
    'CodeGuru Learning Platform',
  ],
  authors: [{ name: 'CodeGuru Academy', url: 'https://codeguru.com' }],
  creator: 'CodeGuru Education',
  publisher: 'CodeGuru Placement Services',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
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
    title: 'CodeGuru | Full Stack Web Development & IT Placement Academy',
    description:
      'Master Full Stack Development with live real-world projects, expert 1-on-1 mentorship, and 100% placement assistance at CodeGuru.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'CodeGuru Platform',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'CodeGuru IT Training & Placement Academy Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeGuru | Full Stack Web Development & IT Placement Academy',
    description:
      'Learn Coding, Full Stack MERN, Java, and Python with Guaranteed Placement Support at CodeGuru.',
    images: ['/logo.png'],
    creator: '@CodeGuruIndia',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'CodeGuru Placement & Learning Platform',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`,
    sameAs: [
      'https://facebook.com/codeguru',
      'https://instagram.com/codeguru',
      'https://linkedin.com/company/codeguru',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lucknow',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    description:
      'CodeGuru provides industry-standard IT software development training, full stack web development bootcamps, and 100% placement drive assistance.',
    offers: {
      '@type': 'Offer',
      category: 'IT Software Training & Job Placement',
    },
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
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
      <body className="font-sans bg-slate-50 text-slate-900 antialiased selection:bg-orange-500 selection:text-white">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
