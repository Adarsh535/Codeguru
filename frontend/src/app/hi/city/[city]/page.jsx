import { CityPage, cityMetadata } from '../../../../views/seo/LandingViews';

export const revalidate = 600;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { city } = await params;
  return cityMetadata(city, 'hi');
}

export default async function Page({ params }) {
  const { city } = await params;
  return <CityPage citySlug={city} lang="hi" />;
}
