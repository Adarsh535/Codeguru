/**
 * ============================================================================
 * SEO COURSE VIEW: ONE INDEXABLE PAGE PER LIVE API COURSE (/courses/[slug])
 * ============================================================================
 * Everything on this page comes from the course record in the admin panel.
 * The description field may contain simple markdown (#, ###, -, 1., **bold**),
 * which is rendered to real headings and lists here.
 */

import { notFound } from 'next/navigation';
import { getCatalog, getCourseBySlug } from '../../seo/catalog';
import { TOPICS, courseMatchesTopic } from '../../seo/topics';
import { SITE, paths, CAMPUS_ADDRESS } from '../../seo/copy';
import { breadcrumbSchema, courseSchema } from '../../seo/schema';
import { JsonLd, PageHero, Section, CourseGrid, LinkGrid, Pills } from './SeoParts';

function inline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

/** Minimal markdown → JSX for admin-written course descriptions. */
function Markdown({ text }) {
  const blocks = [];
  let list = null;
  const flush = () => {
    if (list) blocks.push(list);
    list = null;
  };
  String(text || '').split(/\r?\n/).forEach((raw) => {
    const line = raw.trim();
    if (!line) return flush();
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    const bullet = line.match(/^[-*]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (heading) {
      flush();
      // The page already has an H1, so description headings start at H2
      const level = Math.min(heading[1].length + 1, 4);
      blocks.push({ type: `h${level}`, text: heading[2] });
    } else if (bullet || numbered) {
      const type = bullet ? 'ul' : 'ol';
      if (!list || list.type !== type) {
        flush();
        list = { type, items: [] };
      }
      list.items.push((bullet || numbered)[1]);
    } else {
      flush();
      blocks.push({ type: 'p', text: line });
    }
  });
  flush();

  return (
    <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
      {blocks.map((block, i) => {
        if (block.type === 'ul' || block.type === 'ol') {
          const List = block.type;
          return (
            <List key={i} className={`${block.type === 'ul' ? 'list-disc' : 'list-decimal'} pl-5 space-y-1`}>
              {block.items.map((item, j) => <li key={j}>{inline(item)}</li>)}
            </List>
          );
        }
        if (block.type === 'p') return <p key={i}>{inline(block.text)}</p>;
        const Heading = block.type;
        return <Heading key={i} className="font-bold text-slate-900 text-base pt-2">{inline(block.text)}</Heading>;
      })}
    </div>
  );
}

const firstLine = (markdown) =>
  String(markdown || '')
    .split(/\r?\n/)
    .map((l) => l.replace(/[#*_>`-]/g, '').trim())
    .find((l) => l.length > 40) || '';

export async function courseMetadata(slug) {
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  const summary = firstLine(course.description) || course.subtitle || course.learn.join(', ');
  const fee = course.price ? `Fee ${course.price}. ` : '';
  const description = `${course.title} (${course.duration}) at CodeGurru Ayodhya. ${fee}${summary}`.slice(0, 300);
  return {
    title: `${course.title} Course${course.duration ? ` (${course.duration})` : ''} in Ayodhya – Fees & Syllabus`,
    description,
    alternates: { canonical: `${SITE}${paths.course(course)}` },
    openGraph: { title: course.title, description, url: `${SITE}${paths.course(course)}`, siteName: 'CodeGurru', type: 'website' }
  };
}

export async function CoursePage({ slug }) {
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const catalog = await getCatalog();
  const topics = TOPICS.filter((topic) => courseMatchesTopic(course, topic));
  const related = catalog.filter((other) => other.slug !== course.slug && topics.some((topic) => courseMatchesTopic(other, topic))).slice(0, 6);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: course.title, path: paths.course(course) }
  ];
  const facts = [
    course.duration && ['Duration', course.duration],
    course.price && ['Fee', course.originalPrice ? `${course.price} (was ${course.originalPrice})` : course.price],
    course.level && ['Level', course.level],
    course.mode && ['Mode', course.mode],
    course.timings && ['Batch timings', course.timings],
    course.classes && ['Classes', course.classes],
    course.certificate && ['Certificate', course.certificate],
    ['Campus', CAMPUS_ADDRESS]
  ].filter(Boolean);

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={{ '@context': 'https://schema.org', ...courseSchema(course) }} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow={course.categoryLabel ? `CodeGurru · ${course.categoryLabel}` : 'CodeGurru · Ayodhya'}
        title={`${course.title}${course.duration ? ` – ${course.duration}` : ''}`}
        intro={course.subtitle && course.subtitle !== course.title ? course.subtitle : ''}
        lang="en"
        topicName={course.title}
      />

      <Section title="Course details">
        <dl className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {facts.map(([label, value]) => (
            <div key={label} className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
              <dt className="text-slate-500">{label}</dt>
              <dd className="col-span-2 font-semibold text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {course.description && (
        <Section title="About this course">
          <div className="bg-white rounded-2xl border border-slate-200 p-5"><Markdown text={course.description} /></div>
        </Section>
      )}

      {course.learn.length > 0 && (
        <Section title="What you will learn"><Pills items={course.learn} /></Section>
      )}

      {course.technologies.length > 0 && (
        <Section title="Tools & technologies"><Pills items={course.technologies} /></Section>
      )}

      {course.syllabus.length > 0 && (
        <Section title="Syllabus">
          <ol className="space-y-2">
            {course.syllabus.map((module, i) => (
              <li key={i} className="bg-white rounded-xl border border-slate-200 p-4">
                <h3 className="font-bold text-sm text-slate-900">{i + 1}. {module.title}</h3>
                {module.desc && <p className="text-sm text-slate-600 mt-1">{module.desc}</p>}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {course.projects.length > 0 && (
        <Section title="Projects you will build">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {course.projects.map((project, i) => (
              <li key={i} className="bg-white rounded-xl border border-slate-200 p-4">
                <h3 className="font-bold text-sm text-slate-900">{project.name}</h3>
                {project.tech && <p className="text-xs text-slate-500">{project.tech}</p>}
                {project.desc && <p className="text-sm text-slate-600 mt-1">{project.desc}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {topics.length > 0 && (
        <Section title="Find this course in your city">
          <LinkGrid links={topics.flatMap((topic) => [
            { href: paths.topic(topic, 'en'), label: `${topic.short} – all cities` },
            { href: paths.topic(topic, 'hi'), label: `${topic.shortHi} – हिंदी` }
          ])} columns="sm:grid-cols-2 lg:grid-cols-4" />
        </Section>
      )}

      {related.length > 0 && (
        <Section title="Related courses"><CourseGrid courses={related} lang="en" emptyText="" /></Section>
      )}
    </div>
  );
}
