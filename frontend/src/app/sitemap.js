import { TOPICS, courseMatchesTopic } from '../seo/topics';
import { LOCATIONS } from '../seo/locations';
import { getCatalog } from '../seo/catalog';

export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codegurru.in';
  const now = new Date();
  const page = (path, priority, changeFrequency = 'weekly', languages) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
    ...(languages ? { alternates: { languages } } : {})
  });
  const bilingual = (enPath, priority) => {
    const languages = { 'en-IN': `${baseUrl}${enPath}`, 'hi-IN': `${baseUrl}/hi${enPath}` };
    return [page(enPath, priority, 'weekly', languages), page(`/hi${enPath}`, priority, 'weekly', languages)];
  };

  const catalog = await getCatalog();
  // Only topics that have a live course are listed; the others are noindex until the admin adds one
  const liveTopics = TOPICS.filter((topic) => catalog.some((course) => courseMatchesTopic(course, topic)));

  return [
    page('/', 1.0, 'daily'),
    page('/courses', 0.95, 'daily'),
    page('/placements', 0.9, 'daily'),
    page('/services', 0.9),
    page('/about', 0.85),
    page('/contact', 0.85),
    page('/faq', 0.8),
    ...bilingual('/learn', 0.9),
    ...catalog.map((course) => page(`/courses/${course.slug}`, 0.9, 'weekly')),
    ...liveTopics.flatMap((topic) => bilingual(`/learn/${topic.slug}`, 0.85)),
    ...(catalog.length ? LOCATIONS.flatMap((loc) => bilingual(`/city/${loc.slug}`, loc.type === 'district' ? 0.6 : 0.75)) : []),
    ...liveTopics.flatMap((topic) =>
      LOCATIONS.flatMap((loc) => bilingual(`/learn/${topic.slug}/${loc.slug}`, loc.km <= 160 ? 0.7 : 0.5))
    )
  ];
}
