import CategoryNavbar from '../../views/components/CategoryNavbar';
import { BUSINESS_CONFIG } from '../../config/business';

export const metadata = {
  title: 'Job-Oriented IT Courses in Lucknow & Ayodhya | CodeGurru',
  description:
    'Explore CodeGurru’s (UK VK Pvt. Ltd.) job-ready IT courses: MERN Stack, Python AI/ML, Java, C++ & DSA, React.js, and Robotics with 100% placement support.',
  keywords: [
    'CodeGurru Courses',
    'Full Stack Web Development Course Lucknow',
    'MERN Stack Course Ayodhya',
    'Python AI Machine Learning Course Uttar Pradesh',
    'C++ DSA Coding Classes Lucknow',
    'Java SpringBoot Coaching UP',
    'Software Engineer Bootcamp',
  ],
  alternates: {
    canonical: 'https://codegurru.in/courses',
  },
  openGraph: {
    title: 'CodeGurru Courses | Master Software Engineering & Full Stack Web Dev',
    description: 'Explore live hands-on IT courses designed by industry experts with guaranteed placement drives by UK VK Pvt. Ltd.',
    url: 'https://codegurru.in/courses',
  },
};

export default function CoursesPage({ onOpenContactModal, onOpenEnrollModal }) {
  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: BUSINESS_CONFIG.courses.map((courseName, idx) => ({
      '@type': 'Course',
      position: idx + 1,
      name: courseName,
      description: `Job-oriented practical certification in ${courseName} offered by CodeGurru (UK VK Pvt. Ltd.) with live projects and 100% placement support.`,
      provider: {
        '@type': 'EducationalOrganization',
        name: 'CodeGurru Academy (UK VK Pvt. Ltd.)',
        sameAs: 'https://codegurru.in',
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: ['Onsite', 'Blended'],
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <div className="flex flex-col gap-0 pb-6 bg-slate-50">
        <CategoryNavbar onOpenContactModal={onOpenContactModal} onOpenEnrollModal={onOpenEnrollModal} isHomePage={false} />
      </div>
    </>
  );
}
