import CategoryNavbar from '../../views/components/CategoryNavbar';
import TechLanguageSlider from '../../views/components/TechLanguageSlider';
import BannerSlider from '../../views/components/BannerSlider';
import ContactUsSection from '../../views/components/ContactUsSection';

export const metadata = {
  title: 'Courses Catalog | CodeGuru Full Stack, Java, Python & Cloud Courses',
  description:
    'Explore CodeGuru’s job-ready IT courses: MERN Full Stack, Java Enterprise, Python Data Science, React Native, and DevOps with guaranteed placement drives.',
  keywords: [
    'CodeGuru Courses',
    'Full Stack Web Development Course',
    'MERN Stack Course',
    'Java Full Stack Certification',
    'Python Coding Classes',
    'Software Engineer Bootcamp',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/courses`,
  },
  openGraph: {
    title: 'CodeGuru Courses | Master Software Engineering & Full Stack Web Dev',
    description: 'Explore live hands-on IT courses designed by industry experts with guaranteed placement drives.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/courses`,
  },
};

export default function CoursesPage({ onOpenContactModal, onOpenEnrollModal }) {
  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'Course',
        name: 'Full Stack Web Development (MERN)',
        description: 'Comprehensive Full Stack Web Development course covering React, Node.js, Express, MongoDB, and Next.js.',
        provider: {
          '@type': 'Organization',
          name: 'CodeGuru Academy',
        },
      },
      {
        '@type': 'Course',
        name: 'Java Full Stack Software Engineering',
        description: 'Master Core & Advanced Java, Spring Boot, Microservices, and SQL/NoSQL databases with live projects.',
        provider: {
          '@type': 'Organization',
          name: 'CodeGuru Academy',
        },
      },
      {
        '@type': 'Course',
        name: 'Python Data Science & AI',
        description: 'Learn Python programming, Data Analysis, Machine Learning, and AI fundamentals with 1-on-1 mentorship.',
        provider: {
          '@type': 'Organization',
          name: 'CodeGuru Academy',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <div className="flex flex-col gap-2 pb-12 bg-slate-50">
        <CategoryNavbar onOpenContactModal={onOpenContactModal} onOpenEnrollModal={onOpenEnrollModal} />
        <TechLanguageSlider onOpenContactModal={onOpenContactModal} />
        <BannerSlider onOpenContactModal={onOpenContactModal} />
        <ContactUsSection />
      </div>
    </>
  );
}
