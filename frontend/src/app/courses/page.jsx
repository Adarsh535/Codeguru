import CategoryNavbar from '../../views/components/CategoryNavbar';
import { BUSINESS_CONFIG } from '../../config/business';

export const metadata = {
  title: 'Job-Oriented IT Courses in Lucknow & Ayodhya',
  description:
    'Explore CodeGurru’s (UK VK Pvt. Ltd.) job-ready IT courses: MERN Stack, Python AI/ML, Java, C++ & DSA, React.js, and Robotics with 100% placement support in Ayodhya & Lucknow.',
  keywords: [
    'CodeGurru Courses',
    'CodeGuru Courses Ayodhya',
    'Full Stack Web Development Course Lucknow',
    'MERN Stack Course Ayodhya',
    'Python AI Machine Learning Course Uttar Pradesh',
    'C++ DSA Coding Classes Lucknow',
    'Java SpringBoot Coaching UP',
    'Software Engineer Bootcamp',
    'Coding Institute Near Me',
  ],
  alternates: {
    canonical: 'https://codegurru.in/courses',
  },
  openGraph: {
    title: 'CodeGurru Courses | Master Software Engineering & Full Stack Web Dev',
    description: 'Explore live hands-on IT courses designed by industry experts with guaranteed placement drives by UK VK Pvt. Ltd.',
    url: 'https://codegurru.in/courses',
    siteName: 'CodeGurru (UK VK Pvt. Ltd.)',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'CodeGurru Courses',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Job-Oriented IT Courses in Lucknow & Ayodhya | CodeGurru',
    description: 'Explore job-ready IT certification courses with 100% placement support at CodeGurru.',
    images: ['/logo.png'],
  },
};

export default function CoursesPage({ onOpenContactModal, onOpenEnrollModal }) {
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
        name: 'Courses',
        item: 'https://codegurru.in/courses',
      },
    ],
  };

  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'CodeGurru Job-Oriented IT Bootcamps & Courses',
    description: 'Industry-standard practical certification courses with 100% placement assistance in Uttar Pradesh.',
    itemListElement: BUSINESS_CONFIG.courses.map((courseName, idx) => ({
      '@type': 'Course',
      position: idx + 1,
      name: courseName,
      description: `Job-oriented practical certification in ${courseName} offered by CodeGurru (UK VK Pvt. Ltd.) with live capstone projects and 100% placement support.`,
      provider: {
        '@type': 'EducationalOrganization',
        name: 'CodeGurru (UK VK Pvt. Ltd.)',
        sameAs: 'https://codegurru.in',
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: ['Onsite', 'Blended'],
        location: {
          '@type': 'Place',
          name: 'CodeGurru Ayodhya Campus',
          address: {
            '@type': 'PostalAddress',
            streetAddress: BUSINESS_CONFIG.branches[0].streetAddress,
            addressLocality: 'Ayodhya',
            addressRegion: 'Uttar Pradesh',
            postalCode: '224123',
            addressCountry: 'IN',
          },
        },
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        category: 'Professional IT Certification',
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />

      {/* HIDDEN ACCESSIBLE H1 FOR SEO */}
      <h1 className="sr-only">
        CodeGurru Job-Oriented IT Courses &amp; Coding Bootcamps in Uttar Pradesh
      </h1>

      <div className="flex flex-col gap-0 pb-6 bg-slate-50 pt-2 sm:pt-4">
        <CategoryNavbar onOpenContactModal={onOpenContactModal} onOpenEnrollModal={onOpenEnrollModal} isHomePage={false} />
      </div>
    </>
  );
}
