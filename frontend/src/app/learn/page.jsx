import { LearnIndexPage, learnIndexMetadata } from '../../views/seo/LandingViews';

export const revalidate = 600;

export const metadata = learnIndexMetadata('en');

export default function Page() {
  return <LearnIndexPage lang="en" />;
}
