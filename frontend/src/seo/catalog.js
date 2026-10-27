/**
 * ============================================================================
 * SEO CATALOG: SERVER-SIDE LIVE COURSE DATA FOR LANDING PAGES
 * ============================================================================
 * Fetches GET /api/courses and /api/categories on the server so that course
 * names, prices and syllabus are in the HTML Google reads. Results are cached
 * by Next.js and refreshed every REVALIDATE_SECONDS, so admin panel changes
 * show up on every SEO page without a redeploy.
 */

import { courseMatchesTopic } from './topics';

export const REVALIDATE_SECONDS = 600;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://369.codegurru.in/api';

async function getJson(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return [];
    const body = await res.json();
    return body.success && Array.isArray(body.data) ? body.data : [];
  } catch (err) {
    console.warn(`[seo/catalog] ${API_BASE}${path} fetch failed:`, err.cause?.code || err.message);
    return [];
  }
}

export const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const formatPrice = (price) => {
  if (!price) return '';
  const clean = String(price).replace(/\s+/g, ' ').trim();
  return clean.startsWith('₹') ? clean.replace('₹ ', '₹') : `₹${clean}`;
};

const priceNumber = (price) => Number(String(price || '').replace(/[^0-9]/g, '')) || null;

/**
 * Live, active courses with stable SEO slugs.
 * Courses whose category is not a real admin category (test entries) are skipped,
 * and exact duplicates (same title + duration) are shown once.
 */
export async function getCatalog() {
  const [courses, categories] = await Promise.all([getJson('/courses'), getJson('/categories')]);
  const categoryIds = new Set(categories.filter((c) => c.isActive !== false).map((c) => c.category || c.id));
  const categoryLabels = new Map(categories.map((c) => [c.category || c.id, c.label]));

  const seen = new Set();
  const list = [];
  for (const course of courses) {
    if (course.isActive === false || !course.title) continue;
    if (categoryIds.size > 0 && !categoryIds.has(course.category)) continue;
    const title = course.title.replace(/\s+/g, ' ').trim();
    const slug = slugify(`${title} ${course.duration || ''}`);
    if (seen.has(slug)) continue;
    seen.add(slug);
    list.push({
      id: course._id,
      slug,
      title,
      category: course.category,
      categoryLabel: categoryLabels.get(course.category) || '',
      subCat: course.subCat,
      subCategories: course.subCategories || [],
      duration: course.duration || '',
      level: course.level || '',
      mode: course.batchMode || 'Online / Offline',
      timings: course.batchTimings || '',
      classes: course.batchClasses || '',
      price: course.showPrice !== false ? formatPrice(course.price) : '',
      priceValue: course.showPrice !== false ? priceNumber(course.price) : null,
      originalPrice: course.isDiscountActive && course.originalPrice ? formatPrice(course.originalPrice) : '',
      description: course.description || '',
      subtitle: (course.subtitle || '').trim(),
      technologies: course.technologies || [],
      learn: (course.whatYouWillLearn || []).filter(Boolean),
      highlights: (course.highlights || []).filter(Boolean),
      pills: (course.featurePills || []).filter(Boolean),
      syllabus: (course.syllabusModules || []).filter((m) => m && m.title),
      projects: (course.projectsList || []).filter((p) => p && p.name),
      certificate: course.certificateProvided || '',
      icon: course.logoUrl || course.icon || '',
      updatedAt: course.updatedAt || null
    });
  }
  return list;
}

export async function getCourseBySlug(slug) {
  const catalog = await getCatalog();
  return catalog.find((course) => course.slug === slug) || null;
}

export async function getCoursesForTopic(topic) {
  const catalog = await getCatalog();
  return catalog.filter((course) => courseMatchesTopic(course, topic));
}

/** Lowest visible fee among the given courses, for FAQ answers. */
export function lowestFee(courses) {
  const priced = courses.filter((c) => c.priceValue);
  if (priced.length === 0) return null;
  return priced.reduce((min, c) => (c.priceValue < min.priceValue ? c : min)).price;
}
