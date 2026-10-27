/**
 * ============================================================================
 * SEO VIEW PARTS: SERVER-RENDERED BUILDING BLOCKS FOR LANDING PAGES
 * ============================================================================
 * Hero, breadcrumbs, live course cards, FAQ and link grids. All render on the
 * server so the text is in the HTML that search engines and AI crawlers read.
 */

import Link from 'next/link';
import { Clock, IndianRupee, MonitorPlay, MapPin } from 'lucide-react';
import EnquiryActions from './EnquiryActions';
import { paths } from '../../seo/copy';

export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-400 mb-4">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={item.path} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden="true">/</span>}
            {index < items.length - 1 ? (
              <Link href={item.path} className="hover:text-white">{item.name}</Link>
            ) : (
              <span className="text-slate-200">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({ breadcrumbs, eyebrow, title, intro, lang, topicName, altLink }) {
  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white px-4 pt-10 pb-12">
      <div className="max-w-5xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />
        {eyebrow && <p className="text-xs font-black uppercase tracking-wider text-amber-300 mb-2">{eyebrow}</p>}
        <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight mb-3">{title}</h1>
        {intro && <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed mb-6">{intro}</p>}
        <EnquiryActions lang={lang} topicName={topicName} />
        {altLink && (
          <p className="mt-4 text-xs">
            <Link href={altLink.href} hrefLang={altLink.hrefLang} className="text-amber-300 underline underline-offset-2">{altLink.label}</Link>
          </p>
        )}
      </div>
    </section>
  );
}

export function Section({ title, children, id }) {
  return (
    <section id={id} className="max-w-5xl mx-auto px-4 mt-10">
      {title && <h2 className="text-lg sm:text-2xl font-black text-slate-900 mb-4">{title}</h2>}
      {children}
    </section>
  );
}

export function CourseCard({ course, lang }) {
  const hi = lang === 'hi';
  const points = (course.learn.length ? course.learn : course.technologies).slice(0, 5);
  return (
    <article className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        {course.icon && <img src={course.icon} alt="" width={40} height={40} className="w-10 h-10 rounded-lg bg-slate-50 p-1" loading="lazy" />}
        <div>
          <h3 className="text-base font-black text-slate-900 leading-snug">
            <Link href={paths.course(course)} className="hover:text-orange-600">{course.title}</Link>
          </h3>
          {course.categoryLabel && <p className="text-xs text-slate-500">{course.categoryLabel}</p>}
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-xs text-slate-700 mb-3">
        {course.duration && (
          <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /><dt className="sr-only">{hi ? 'अवधि' : 'Duration'}</dt><dd>{course.duration}</dd></div>
        )}
        {course.price && (
          <div className="flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
            <dt className="sr-only">{hi ? 'फीस' : 'Fee'}</dt>
            <dd className="font-bold text-slate-900">
              {course.price}
              {course.originalPrice && <s className="ml-1 font-normal text-slate-400">{course.originalPrice}</s>}
            </dd>
          </div>
        )}
        {course.mode && (
          <div className="flex items-center gap-1.5"><MonitorPlay className="w-3.5 h-3.5 text-slate-400" /><dt className="sr-only">{hi ? 'मोड' : 'Mode'}</dt><dd>{course.mode}</dd></div>
        )}
        <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /><dt className="sr-only">{hi ? 'कैंपस' : 'Campus'}</dt><dd>{hi ? 'अयोध्या' : 'Ayodhya'}</dd></div>
      </dl>
      {points.length > 0 && (
        <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1 mb-4">
          {points.map((point) => <li key={point}>{point}</li>)}
        </ul>
      )}
      <Link href={paths.course(course)} className="mt-auto text-sm font-bold text-orange-600 hover:text-orange-700">
        {hi ? 'पूरा सिलेबस देखें →' : 'Full syllabus & details →'}
      </Link>
    </article>
  );
}

export function CourseGrid({ courses, lang, emptyText }) {
  if (courses.length === 0) {
    return <p className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">{emptyText}</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => <CourseCard key={course.slug} course={course} lang={lang} />)}
    </div>
  );
}

export function FaqList({ faqs }) {
  return (
    <div className="space-y-2">
      {faqs.map((faq) => (
        <details key={faq.q} className="bg-white rounded-xl border border-slate-200 p-4 group" open>
          <summary className="font-bold text-sm text-slate-900 cursor-pointer">{faq.q}</summary>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}

export function LinkGrid({ links, columns = 'sm:grid-cols-3 lg:grid-cols-4' }) {
  return (
    <ul className={`grid grid-cols-2 ${columns} gap-2`}>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="block bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 hover:border-orange-300 hover:text-orange-700">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Pills({ items }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs sm:text-sm text-slate-700">{item}</li>
      ))}
    </ul>
  );
}
