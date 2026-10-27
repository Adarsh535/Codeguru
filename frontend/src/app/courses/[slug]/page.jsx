import { CoursePage, courseMetadata } from '../../../views/seo/CourseView';
import { getCatalog } from '../../../seo/catalog';

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const catalog = await getCatalog();
  return catalog.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return courseMetadata(slug);
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <CoursePage slug={slug} />;
}
