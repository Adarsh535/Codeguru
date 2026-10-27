/**
 * ============================================================================
 * SEO LANDING VIEWS: TOPIC, CITY AND TOPIC × CITY PAGES (ENGLISH + HINDI)
 * ============================================================================
 * Static words come from seo/topics.js + seo/locations.js; every course card,
 * fee and duration comes live from the API through seo/catalog.js.
 * A page with no live course for its topic is served but marked noindex, so
 * thin pages never reach Google; it becomes indexable as soon as the admin
 * panel adds a matching course.
 */

import { notFound } from 'next/navigation';
import { TOPICS, getTopic, AUDIENCE } from '../../seo/topics';
import { LOCATIONS, getLocation, nearbyLocations } from '../../seo/locations';
import { getCatalog, getCoursesForTopic } from '../../seo/catalog';
import { courseMatchesTopic } from '../../seo/topics';
import {
  SITE, paths, topicName, placeName, audienceList, attendText, topicCityMeta, topicCityFaqs, durationsOf
} from '../../seo/copy';
import { breadcrumbSchema, faqSchema, courseListSchema } from '../../seo/schema';
import { JsonLd, PageHero, Section, CourseGrid, FaqList, LinkGrid, Pills } from './SeoParts';

const T = {
  en: {
    home: 'Home', learn: 'Courses by city', courses: 'Live batches', careers: 'Career options', who: 'Who can join',
    attend: 'How to attend', faq: 'Frequently asked questions', nearby: 'Same course in nearby places',
    otherTopics: 'Other courses for', allCities: 'Choose your city', switchLang: 'यह पेज हिंदी में पढ़ें',
    empty: (name) => `The next ${name} batch is being scheduled. Book free counselling or call us to reserve a seat.`,
    upHeading: 'Uttar Pradesh', biharHeading: 'Bihar', areaHeading: 'Ayodhya district'
  },
  hi: {
    home: 'होम', learn: 'शहर के अनुसार कोर्स', courses: 'चल रहे बैच', careers: 'करियर विकल्प', who: 'कौन जॉइन कर सकता है',
    attend: 'क्लास कैसे करें', faq: 'अक्सर पूछे जाने वाले सवाल', nearby: 'आस-पास के शहरों में यही कोर्स',
    otherTopics: 'के लिए अन्य कोर्स', allCities: 'अपना शहर चुनें', switchLang: 'Read this page in English',
    empty: (name) => `${name} का अगला बैच तय हो रहा है। सीट बुक करने के लिए फ्री काउंसलिंग बुक करें या कॉल करें।`,
    upHeading: 'उत्तर प्रदेश', biharHeading: 'बिहार', areaHeading: 'अयोध्या ज़िला'
  }
};

const otherLang = (lang) => (lang === 'hi' ? 'en' : 'hi');

const alternates = (enPath, hiPath, lang) => ({
  canonical: `${SITE}${lang === 'hi' ? hiPath : enPath}`,
  languages: { 'en-IN': `${SITE}${enPath}`, 'hi-IN': `${SITE}${hiPath}`, 'x-default': `${SITE}${enPath}` }
});

const robotsFor = (hasCourses) => (hasCourses ? { index: true, follow: true } : { index: false, follow: true });

function locationGroups(lang, hrefFor) {
  const t = T[lang];
  const label = (loc) => placeName(loc, lang);
  return [
    { heading: t.areaHeading, items: LOCATIONS.filter((l) => l.type === 'campus' || l.type === 'area') },
    { heading: t.upHeading, items: LOCATIONS.filter((l) => l.state === 'Uttar Pradesh' && l.type === 'district' ) },
    { heading: t.biharHeading, items: LOCATIONS.filter((l) => l.state === 'Bihar') }
  ].map((group) => ({ heading: group.heading, links: group.items.map((loc) => ({ href: hrefFor(loc), label: label(loc) })) }));
}

/* ------------------------------------------------------------------ */
/* TOPIC × CITY                                                        */
/* ------------------------------------------------------------------ */

export async function topicCityMetadata(topicSlug, citySlug, lang) {
  const topic = getTopic(topicSlug);
  const loc = getLocation(citySlug);
  if (!topic || !loc) return {};
  const courses = await getCoursesForTopic(topic);
  const meta = topicCityMeta(topic, loc, courses, lang);
  const url = `${SITE}${paths.topicCity(topic, loc, lang)}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: alternates(paths.topicCity(topic, loc, 'en'), paths.topicCity(topic, loc, 'hi'), lang),
    robots: robotsFor(courses.length > 0),
    openGraph: { title: meta.title, description: meta.description, url, siteName: 'CodeGurru', locale: lang === 'hi' ? 'hi_IN' : 'en_IN', type: 'website' }
  };
}

export async function TopicCityPage({ topicSlug, citySlug, lang }) {
  const topic = getTopic(topicSlug);
  const loc = getLocation(citySlug);
  if (!topic || !loc) notFound();

  const t = T[lang];
  const courses = await getCoursesForTopic(topic);
  const meta = topicCityMeta(topic, loc, courses, lang);
  const faqs = topicCityFaqs(topic, loc, courses, lang);
  const name = topicName(topic, lang);
  const place = placeName(loc, lang);
  const crumbs = [
    { name: t.home, path: '/' },
    { name, path: paths.topic(topic, lang) },
    { name: place, path: paths.topicCity(topic, loc, lang) }
  ];
  const nearby = nearbyLocations(loc).map((other) => ({ href: paths.topicCity(topic, other, lang), label: `${name} – ${placeName(other, lang)}` }));
  const otherTopics = TOPICS.filter((other) => other.slug !== topic.slug).map((other) => ({ href: paths.topicCity(other, loc, lang), label: topicName(other, lang) }));

  return (
    <div lang={lang === 'hi' ? 'hi' : 'en'} className="w-full bg-slate-50 min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={faqSchema(faqs)} />
      {courses.length > 0 && <JsonLd data={courseListSchema(courses, meta.h1)} />}

      <PageHero
        breadcrumbs={crumbs}
        eyebrow={`CodeGurru · ${lang === 'hi' ? loc.stateHi : loc.state}`}
        title={meta.h1}
        intro={lang === 'hi' ? topic.introHi : topic.introEn}
        lang={lang}
        topicName={name}
        altLink={{ href: paths.topicCity(topic, loc, otherLang(lang)), hrefLang: otherLang(lang), label: t.switchLang }}
      />

      <Section title={`${t.courses} (${courses.length})`}>
        <CourseGrid courses={courses} lang={lang} emptyText={t.empty(name)} />
      </Section>

      <Section title={t.attend}>
        <p className="bg-white rounded-2xl border border-slate-200 p-5 text-sm text-slate-700 leading-relaxed">{attendText(topic, loc, lang)}</p>
      </Section>

      <div className="max-w-5xl mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 mb-4">{t.who}</h2>
          <Pills items={audienceList(topic, lang)} />
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 mb-4">{t.careers}</h2>
          <Pills items={lang === 'hi' ? topic.careersHi : topic.careersEn} />
        </div>
      </div>

      <Section title={t.faq}>
        <FaqList faqs={faqs} />
      </Section>

      <Section title={t.nearby}>
        <LinkGrid links={nearby} columns="sm:grid-cols-3" />
      </Section>

      <Section title={lang === 'hi' ? `${place} ${t.otherTopics}` : `${t.otherTopics} ${place}`}>
        <LinkGrid links={otherTopics} />
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TOPIC HUB                                                           */
/* ------------------------------------------------------------------ */

export async function topicMetadata(topicSlug, lang) {
  const topic = getTopic(topicSlug);
  if (!topic) return {};
  const courses = await getCoursesForTopic(topic);
  const durations = durationsOf(courses).join(', ');
  const title = lang === 'hi'
    ? `${topic.hi} कोर्स अयोध्या – UP और बिहार के छात्रों के लिए`
    : `${topic.en} Course in Ayodhya – for UP & Bihar Students`;
  const description = lang === 'hi'
    ? `CodeGurru अयोध्या में ${topic.shortHi}: ${courses.length} बैच${durations ? `, अवधि ${durations}` : ''}। ${topic.introHi.slice(0, 90)}`
    : `${topic.short} at CodeGurru Ayodhya: ${courses.length} live batch${courses.length === 1 ? '' : 'es'}${durations ? `, ${durations}` : ''}. ${topic.introEn.slice(0, 100)}`;
  return {
    title,
    description,
    alternates: alternates(paths.topic(topic, 'en'), paths.topic(topic, 'hi'), lang),
    robots: robotsFor(courses.length > 0)
  };
}

export async function TopicPage({ topicSlug, lang }) {
  const topic = getTopic(topicSlug);
  if (!topic) notFound();
  const t = T[lang];
  const courses = await getCoursesForTopic(topic);
  const name = topicName(topic, lang);
  const crumbs = [
    { name: t.home, path: '/' },
    { name, path: paths.topic(topic, lang) }
  ];
  const groups = locationGroups(lang, (loc) => paths.topicCity(topic, loc, lang));

  return (
    <div lang={lang === 'hi' ? 'hi' : 'en'} className="w-full bg-slate-50 min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      {courses.length > 0 && <JsonLd data={courseListSchema(courses, lang === 'hi' ? topic.hi : topic.en)} />}
      <PageHero
        breadcrumbs={crumbs}
        eyebrow="CodeGurru · Ayodhya"
        title={lang === 'hi' ? `${topic.hi} कोर्स` : `${topic.en} Course`}
        intro={lang === 'hi' ? topic.introHi : topic.introEn}
        lang={lang}
        topicName={name}
        altLink={{ href: paths.topic(topic, otherLang(lang)), hrefLang: otherLang(lang), label: t.switchLang }}
      />
      <Section title={`${t.courses} (${courses.length})`}>
        <CourseGrid courses={courses} lang={lang} emptyText={t.empty(name)} />
      </Section>
      <div className="max-w-5xl mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 mb-4">{t.who}</h2>
          <Pills items={audienceList(topic, lang)} />
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 mb-4">{t.careers}</h2>
          <Pills items={lang === 'hi' ? topic.careersHi : topic.careersEn} />
        </div>
      </div>
      <Section title={t.allCities}>
        {groups.map((group) => (
          <div key={group.heading} className="mb-6">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-2">{group.heading}</h3>
            <LinkGrid links={group.links} columns="sm:grid-cols-4 lg:grid-cols-6" />
          </div>
        ))}
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CITY HUB                                                            */
/* ------------------------------------------------------------------ */

export async function cityMetadata(citySlug, lang) {
  const loc = getLocation(citySlug);
  if (!loc) return {};
  const catalog = await getCatalog();
  const place = placeName(loc, lang);
  const title = lang === 'hi'
    ? `${place} के छात्रों के लिए कंप्यूटर, कोडिंग, एनीमेशन और रिपेयरिंग कोर्स`
    : `Computer, Coding, Animation & Repair Courses for ${place} Students`;
  const description = lang === 'hi'
    ? `${place} (${loc.stateHi}) के छात्रों के लिए CodeGurru अयोध्या के ${catalog.length} चल रहे बैच: कोडिंग, एरिना एनीमेशन, रोबोटिक्स, डिजिटल मार्केटिंग, मोबाइल और अप्लायंस रिपेयरिंग।`
    : `${catalog.length} live CodeGurru Ayodhya batches for students from ${place}, ${loc.state}: coding, Arena Animation, robotics, digital marketing, mobile and appliance repairing.`;
  return {
    title,
    description,
    alternates: alternates(paths.city(loc, 'en'), paths.city(loc, 'hi'), lang),
    robots: robotsFor(catalog.length > 0)
  };
}

export async function CityPage({ citySlug, lang }) {
  const loc = getLocation(citySlug);
  if (!loc) notFound();
  const t = T[lang];
  const catalog = await getCatalog();
  const place = placeName(loc, lang);
  const crumbs = [
    { name: t.home, path: '/' },
    { name: place, path: paths.city(loc, lang) }
  ];
  const topicLinks = TOPICS.map((topic) => {
    const count = catalog.filter((course) => courseMatchesTopic(course, topic)).length;
    return { href: paths.topicCity(topic, loc, lang), label: `${topicName(topic, lang)}${count ? ` (${count})` : ''}` };
  });
  const nearby = nearbyLocations(loc).map((other) => ({ href: paths.city(other, lang), label: placeName(other, lang) }));
  const title = lang === 'hi' ? `${place} के छात्रों के लिए CodeGurru कोर्स` : `CodeGurru Courses for Students in ${place}`;
  const intro = lang === 'hi'
    ? `कक्षा 6 के छात्रों से लेकर पॉलिटेक्निक, BA, BCA और MCA तक, ${place} के हर छात्र के लिए कोडिंग, एनीमेशन, रोबोटिक्स, मार्केटिंग और रिपेयरिंग ट्रेनिंग।`
    : `Coding, animation, robotics, marketing and repair training for every student in ${place}, from Class 6 to polytechnic, BA, BCA and MCA.`;

  return (
    <div lang={lang === 'hi' ? 'hi' : 'en'} className="w-full bg-slate-50 min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow={`CodeGurru · ${lang === 'hi' ? loc.stateHi : loc.state}`}
        title={title}
        intro={intro}
        lang={lang}
        topicName=""
        altLink={{ href: paths.city(loc, otherLang(lang)), hrefLang: otherLang(lang), label: t.switchLang }}
      />
      <Section title={t.attend}>
        <p className="bg-white rounded-2xl border border-slate-200 p-5 text-sm text-slate-700 leading-relaxed">{attendText(TOPICS[1], loc, lang)}</p>
      </Section>
      <Section title={lang === 'hi' ? 'कोर्स चुनें' : 'Choose a course'}>
        <LinkGrid links={topicLinks} columns="sm:grid-cols-2 lg:grid-cols-3" />
      </Section>
      <Section title={`${t.courses} (${catalog.length})`}>
        <CourseGrid courses={catalog} lang={lang} emptyText={t.empty('CodeGurru')} />
      </Section>
      <Section title={lang === 'hi' ? 'आस-पास के शहर' : 'Nearby places'}>
        <LinkGrid links={nearby} columns="sm:grid-cols-3" />
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* INDEX OF ALL TOPICS + PLACES                                        */
/* ------------------------------------------------------------------ */

export function learnIndexMetadata(lang) {
  return {
    title: lang === 'hi' ? 'अयोध्या के सभी कोर्स – UP और बिहार के हर शहर के लिए' : 'All Courses in Ayodhya – for Every City of UP & Bihar',
    description: lang === 'hi'
      ? 'CodeGurru अयोध्या के सभी कोर्स: कोडिंग, एरिना एनीमेशन, रोबोटिक्स, AI, डिजिटल मार्केटिंग, सर्वर, मोबाइल, लैपटॉप और होम अप्लायंस रिपेयरिंग। UP और बिहार के हर ज़िले के लिए।'
      : 'Every CodeGurru Ayodhya course: coding, Arena Animation, robotics, AI, digital marketing, server admin, mobile, laptop and home appliance repairing, for every district of UP and Bihar.',
    alternates: alternates('/learn', '/hi/learn', lang)
  };
}

export async function LearnIndexPage({ lang }) {
  const t = T[lang];
  const catalog = await getCatalog();
  const crumbs = [{ name: t.home, path: '/' }, { name: t.learn, path: lang === 'hi' ? '/hi/learn' : '/learn' }];
  const topicLinks = TOPICS.map((topic) => {
    const count = catalog.filter((course) => courseMatchesTopic(course, topic)).length;
    return { href: paths.topic(topic, lang), label: `${topicName(topic, lang)}${count ? ` (${count})` : ''}` };
  });
  const groups = locationGroups(lang, (loc) => paths.city(loc, lang));
  const audience = Object.values(AUDIENCE).map((a) => (lang === 'hi' ? a.hi : a.en));

  return (
    <div lang={lang === 'hi' ? 'hi' : 'en'} className="w-full bg-slate-50 min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow="CodeGurru · Ayodhya"
        title={lang === 'hi' ? 'सभी कोर्स, हर शहर के छात्रों के लिए' : 'All courses, for students from every city'}
        intro={lang === 'hi' ? 'अपना कोर्स या अपना शहर चुनें। फीस और बैच की जानकारी हमेशा लाइव अपडेट रहती है।' : 'Pick a course or your city. Fees and batches are always updated live.'}
        lang={lang}
        topicName=""
        altLink={{ href: lang === 'hi' ? '/learn' : '/hi/learn', hrefLang: otherLang(lang), label: t.switchLang }}
      />
      <Section title={lang === 'hi' ? 'कोर्स' : 'Courses'}>
        <LinkGrid links={topicLinks} columns="sm:grid-cols-2 lg:grid-cols-3" />
      </Section>
      <Section title={t.who}>
        <Pills items={audience} />
      </Section>
      <Section title={t.allCities}>
        {groups.map((group) => (
          <div key={group.heading} className="mb-6">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-2">{group.heading}</h3>
            <LinkGrid links={group.links} columns="sm:grid-cols-4 lg:grid-cols-6" />
          </div>
        ))}
      </Section>
    </div>
  );
}
