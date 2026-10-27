/**
 * ============================================================================
 * SEO COPY: ENGLISH + HINDI TEXT FOR TOPIC / CITY LANDING PAGES
 * ============================================================================
 * Builds titles, intros and FAQs from the static topic + location data and the
 * live course list. Every number shown (fee, duration, batch count) is read
 * from the API courses passed in, never typed here.
 */

import { BUSINESS_CONFIG } from '../config/business';
import { AUDIENCE } from './topics';
import { attendMode } from './locations';
import { lowestFee } from './catalog';

export const SITE = BUSINESS_CONFIG.urls.siteUrl;
export const PHONE = BUSINESS_CONFIG.contact.primaryPhone;
export const CAMPUS_ADDRESS = BUSINESS_CONFIG.headOffice.fullAddress;

// Topics taught on lab equipment, where an online batch is not offered as the main route
const HANDS_ON = new Set(['mobile-repairing', 'laptop-computer-repairing', 'home-appliance-repairing', 'robotics', 'iot-embedded-systems']);

export const paths = {
  topic: (topic, lang) => `${lang === 'hi' ? '/hi' : ''}/learn/${topic.slug}`,
  topicCity: (topic, loc, lang) => `${lang === 'hi' ? '/hi' : ''}/learn/${topic.slug}/${loc.slug}`,
  city: (loc, lang) => `${lang === 'hi' ? '/hi' : ''}/city/${loc.slug}`,
  course: (course) => `/courses/${course.slug}`
};

const uniq = (items) => [...new Set(items.filter(Boolean))];

export const durationsOf = (courses) => uniq(courses.map((c) => c.duration));

export const topicName = (topic, lang) => (lang === 'hi' ? topic.shortHi : topic.short);
export const placeName = (loc, lang) => (lang === 'hi' ? loc.nameHi : loc.name);
export const audienceList = (topic, lang) => topic.audience.map((key) => AUDIENCE[key][lang === 'hi' ? 'hi' : 'en']);

/** One paragraph on how a student from this place attends. */
export function attendText(topic, loc, lang) {
  const place = placeName(loc, lang);
  const handsOn = HANDS_ON.has(topic.slug);
  const mode = attendMode(loc);

  if (lang === 'hi') {
    if (loc.type === 'campus') return `हमारा कैंपस अयोध्या में ही है: ${CAMPUS_ADDRESS}। सुबह और शाम दोनों समय के बैच चलते हैं।`;
    if (mode === 'walkin') {
      return `${place} से CodeGurru अयोध्या कैंपस लगभग ${loc.km} किमी दूर है। ${place} के छात्र रोज़ आकर ऑफलाइन क्लास करते हैं। पता: ${CAMPUS_ADDRESS}।`;
    }
    if (handsOn) {
      return `${place} से अयोध्या कैंपस लगभग ${loc.km} किमी है। यह ट्रेनिंग लैब में असली उपकरणों पर होती है, इसलिए कोर्स के दौरान अयोध्या में रहकर क्लास करनी होती है। बैच और रहने के बारे में पूछने के लिए ${PHONE} पर कॉल करें।`;
    }
    return mode === 'hostel'
      ? `${place} से अयोध्या कैंपस लगभग ${loc.km} किमी है। आप घर से लाइव ऑनलाइन बैच जॉइन कर सकते हैं, या अयोध्या में रहकर ऑफलाइन बैच कर सकते हैं।`
      : `${place} से अयोध्या लगभग ${loc.km} किमी है, इसलिए ${place} के ज़्यादातर छात्र घर से लाइव ऑनलाइन बैच जॉइन करते हैं। चाहें तो अयोध्या कैंपस पर ऑफलाइन बैच भी कर सकते हैं।`;
  }

  if (loc.type === 'campus') return `Our campus is in Ayodhya itself: ${CAMPUS_ADDRESS}. Morning and evening batches run on campus.`;
  if (mode === 'walkin') {
    return `CodeGurru’s Ayodhya campus is about ${loc.km} km from ${place}. Students from ${place} travel in for regular offline classes. Address: ${CAMPUS_ADDRESS}.`;
  }
  if (handsOn) {
    return `${place} is about ${loc.km} km from the Ayodhya campus. This training happens in the lab on real equipment, so students stay in Ayodhya for the course. Call ${PHONE} to ask about batch dates and staying nearby.`;
  }
  return mode === 'hostel'
    ? `${place} is about ${loc.km} km from the Ayodhya campus. You can join the live online batch from home, or stay in Ayodhya and take the offline batch.`
    : `${place} is about ${loc.km} km from Ayodhya, so most students from ${place} join the live online batch from home. The offline batch at the Ayodhya campus is also open to them.`;
}

/** Page <title>, description and H1 for a topic × place page. */
export function topicCityMeta(topic, loc, courses, lang) {
  const place = placeName(loc, lang);
  const name = topicName(topic, lang);
  const fee = lowestFee(courses);
  const durations = durationsOf(courses).join(', ');

  if (lang === 'hi') {
    return {
      title: `${place} में ${name} कोर्स – फीस, अवधि और बैच`,
      h1: `${place} में ${name} कोर्स`,
      description: courses.length
        ? `${place} के छात्रों के लिए CodeGurru का ${name} कोर्स: ${courses.length} बैच${fee ? `, फीस ${fee} से` : ''}${durations ? `, अवधि ${durations}` : ''}। अयोध्या कैंपस से ऑनलाइन/ऑफलाइन। कॉल ${PHONE}।`
        : `${place} के छात्रों के लिए CodeGurru अयोध्या में ${name} ट्रेनिंग। नए बैच की जानकारी के लिए कॉल करें ${PHONE}।`
    };
  }
  return {
    title: `${name} Course in ${place}, ${loc.state} – Fees & Batches`,
    h1: `${name} Course in ${place}`,
    description: courses.length
      ? `${name} course for students from ${place}: ${courses.length} live batch${courses.length > 1 ? 'es' : ''}${fee ? ` from ${fee}` : ''}${durations ? `, ${durations}` : ''}. Online/offline at CodeGurru Ayodhya. Call ${PHONE}.`
      : `${name} training at CodeGurru Ayodhya for students from ${place}. Call ${PHONE} for the next batch.`
  };
}

/** FAQ entries (question/answer) for a topic × place page. */
export function topicCityFaqs(topic, loc, courses, lang) {
  const place = placeName(loc, lang);
  const name = topicName(topic, lang);
  const fee = lowestFee(courses);
  const durations = durationsOf(courses).join(', ');
  const audience = audienceList(topic, lang).join(', ');
  const careers = (lang === 'hi' ? topic.careersHi : topic.careersEn).join(', ');
  const titles = courses.slice(0, 4).map((c) => c.title).join(', ');

  if (lang === 'hi') {
    return [
      {
        q: `क्या ${place} के छात्रों के लिए ${name} कोर्स उपलब्ध है?`,
        a: courses.length ? `हाँ। अभी ${courses.length} बैच खुले हैं: ${titles}। ${attendText(topic, loc, lang)}` : `हाँ, ${name} ट्रेनिंग CodeGurru अयोध्या में होती है। अगले बैच की तारीख के लिए ${PHONE} पर कॉल या व्हाट्सऐप करें।`
      },
      {
        q: `${name} कोर्स की फीस और अवधि क्या है?`,
        a: fee ? `फीस ${fee} से शुरू है${durations ? ` और अवधि ${durations} है` : ''}। हर बैच की फीस नीचे कोर्स कार्ड पर लिखी है।` : `मौजूदा फीस के लिए ${PHONE} पर कॉल करें।`
      },
      { q: `${name} कोर्स कौन कर सकता है?`, a: `${audience}। पहले से अनुभव ज़रूरी नहीं है।` },
      { q: `${name} सीखने के बाद कौन सी नौकरी मिलती है?`, a: careers },
      {
        q: `${place} से CodeGurru कितनी दूर है?`,
        a: loc.type === 'campus' ? `CodeGurru का कैंपस अयोध्या में है: ${CAMPUS_ADDRESS}।` : `लगभग ${loc.km} किमी। पता: ${CAMPUS_ADDRESS}।`
      }
    ];
  }
  return [
    {
      q: `Is there a ${name} course for students in ${place}?`,
      a: courses.length ? `Yes. ${courses.length} batch${courses.length > 1 ? 'es are' : ' is'} open now: ${titles}. ${attendText(topic, loc, lang)}` : `Yes, ${name} training runs at CodeGurru Ayodhya. Call or WhatsApp ${PHONE} for the next batch date.`
    },
    {
      q: `What is the fee and duration of the ${name} course?`,
      a: fee ? `Fees start at ${fee}${durations ? ` and batches run for ${durations}` : ''}. Each batch shows its fee on the course card below.` : `Call ${PHONE} for the current fee.`
    },
    { q: `Who can join the ${name} course?`, a: `${audience}. No prior experience is needed.` },
    { q: `What jobs can I get after learning ${name}?`, a: careers },
    {
      q: `How far is CodeGurru from ${place}?`,
      a: loc.type === 'campus' ? `CodeGurru’s campus is in Ayodhya: ${CAMPUS_ADDRESS}.` : `About ${loc.km} km. Address: ${CAMPUS_ADDRESS}.`
    }
  ];
}
