import { TopicCityPage, topicCityMetadata } from '../../../../../views/seo/LandingViews';

export const revalidate = 600;
export const dynamicParams = true;

// ~2,200 pages per language: rendered on first visit, then cached and refreshed every 10 minutes
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { topic, city } = await params;
  return topicCityMetadata(topic, city, 'hi');
}

export default async function Page({ params }) {
  const { topic, city } = await params;
  return <TopicCityPage topicSlug={topic} citySlug={city} lang="hi" />;
}
