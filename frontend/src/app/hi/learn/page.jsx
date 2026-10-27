import { LearnIndexPage, learnIndexMetadata } from '../../../views/seo/LandingViews';

export const revalidate = 600;

export const metadata = learnIndexMetadata('hi');

export default function Page() {
  return <LearnIndexPage lang="hi" />;
}
