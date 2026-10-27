import { TopicPage, topicMetadata } from '../../../views/seo/LandingViews';
import { TOPICS } from '../../../seo/topics';

export const revalidate = 600;

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }) {
  const { topic } = await params;
  return topicMetadata(topic, 'en');
}

export default async function Page({ params }) {
  const { topic } = await params;
  return <TopicPage topicSlug={topic} lang="en" />;
}
