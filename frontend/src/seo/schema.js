/**
 * ============================================================================
 * SEO SCHEMA: JSON-LD BUILDERS FOR LANDING PAGES
 * ============================================================================
 * Course, FAQPage and BreadcrumbList structured data. Every Course points at
 * the one real campus (Ayodhya) as its location and at the Organization
 * declared in the root layout as its provider.
 */

import { SITE } from './copy';

const ORG_ID = `${SITE}/#organization`;
const CAMPUS_ID = `${SITE}/#ayodhya-campus`;

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE}${item.path}`
    }))
  };
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a }
    }))
  };
}

const plainText = (markdown) =>
  String(markdown || '')
    .replace(/[#*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export function courseSchema(course) {
  const description = plainText(course.description) || course.subtitle || course.learn.join(', ') || course.title;
  const modes = /online/i.test(course.mode) ? ['Online', 'Onsite'] : ['Onsite'];
  return {
    '@type': 'Course',
    '@id': `${SITE}/courses/${course.slug}#course`,
    name: course.title,
    url: `${SITE}/courses/${course.slug}`,
    description: description.slice(0, 500),
    provider: { '@type': 'Organization', '@id': ORG_ID, name: 'CodeGurru', sameAs: SITE },
    inLanguage: ['en', 'hi'],
    ...(course.technologies.length ? { teaches: course.technologies.join(', ') } : {}),
    ...(course.priceValue
      ? { offers: { '@type': 'Offer', category: 'Paid', price: course.priceValue, priceCurrency: 'INR', availability: 'https://schema.org/InStock' } }
      : {}),
    hasCourseInstance: modes.map((mode) => ({
      '@type': 'CourseInstance',
      courseMode: mode,
      ...(course.duration ? { courseWorkload: course.duration } : {}),
      ...(mode === 'Onsite' ? { location: { '@id': CAMPUS_ID } } : {})
    }))
  };
}

export function courseListSchema(courses, name) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: courses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: courseSchema(course)
    }))
  };
}
