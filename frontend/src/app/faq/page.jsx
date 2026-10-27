import React from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronRight, PhoneCall, Sparkles } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/business';

export const metadata = {
  title: 'Frequently Asked Questions (FAQs)',
  description:
    'Find answers to key questions about CodeGurru (UK VK Pvt. Ltd.): courses, admissions, campus location in Ayodhya, placement guarantee, laptop repair service, and batch timings.',
  keywords: [
    'CodeGurru FAQ',
    'What is CodeGurru',
    'Where is CodeGurru located',
    'Who is founder of CodeGurru',
    'CodeGurru Placement Support',
    'Does CodeGurru repair laptops',
    'CodeGurru Courses Fees',
  ],
  alternates: {
    canonical: 'https://codegurru.in/faq',
  },
  openGraph: {
    title: 'CodeGurru FAQs | Everything You Need to Know',
    description: 'All answers about CodeGurru IT Training, Software Development, and Computer Repair.',
    url: 'https://codegurru.in/faq',
    siteName: 'CodeGurru (UK VK Pvt. Ltd.)',
    images: [{ url: '/logo.png', width: 800, height: 600, alt: 'CodeGurru FAQs' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeGurru FAQs | Admissions, Courses & Laptop Repair',
    description: 'Get instant answers to all questions regarding CodeGurru programs and campus desks.',
    images: ['/logo.png'],
  },
};

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is CodeGurru?',
      answer:
        'CodeGurru (legal entity: UK VK Pvt. Ltd.) is an integrated technology ecosystem based in Uttar Pradesh, founded by Kishan Pandey. It operates three primary divisions: (1) 100% job-oriented practical IT training bootcamps for engineering students and freshers, (2) custom enterprise software and mobile app development for businesses, and (3) rapid same-day computer and laptop hardware repair services.'
    },
    {
      question: 'Where is CodeGurru located?',
      answer:
        'CodeGurru is located Near Saket College Petrol Pump, Ayodhya, Uttar Pradesh (PIN: 224123). The campus features high-tech air-conditioned coding labs, gigabit fiber network, and a dedicated computer hardware repair center.'
    },
    {
      question: 'Who is the founder of CodeGurru?',
      answer:
        'CodeGurru was founded by Kishan Pandey, who serves as Founder & CEO under UK VK Pvt. Ltd. The institute was established to empower youth, college graduates, and engineering students across Uttar Pradesh with industry-grade software engineering skills and high-paying careers.'
    },
    {
      question: 'Which courses does CodeGurru offer?',
      answer:
        'CodeGurru offers comprehensive practical certification bootcamps including: Full Stack Web Development (MERN Stack: MongoDB, Express, React, Node.js), Python with Artificial Intelligence & Machine Learning, Java Spring Boot Enterprise Engineering, C++ with Data Structures & Algorithms (DSA), React.js & Next.js Modern Frontend, Robotics & IoT Automation, Digital Marketing, and Basic Computer Skills with Advanced Excel and Tally Prime GST.'
    },
    {
      question: 'Does CodeGurru provide placement assistance?',
      answer:
        'Yes, CodeGurru guarantees 100% placement drive assistance to students who maintain at least 80% attendance and complete the mandatory production capstone projects. Our placement cell conducts mock technical interviews, DSA coding rounds, and connects students directly to partner MNCs and high-growth startups with packages ranging up to 18.5 LPA.'
    },
    {
      question: 'Are classes available online or offline?',
      answer:
        'Both options are available. CodeGurru offers classroom offline bootcamps at the Ayodhya campus with 1-on-1 mentor guidance, as well as live interactive online blended batches with cloud coding environments and daily live doubt-clearing sessions.'
    },
    {
      question: 'Does CodeGurru repair laptops and computers?',
      answer:
        'Yes, CodeGurru operates a dedicated hardware and diagnostics lab providing same-day computer and laptop repair across Lucknow and Ayodhya. Our certified technicians fix chip-level motherboard faults, replace broken screens/displays, upgrade slow laptops with high-speed SSDs and RAM, and offer doorstep pickup and delivery with a 90-day service warranty.'
    },
    {
      question: 'How do I apply or book a free counseling session?',
      answer:
        'You can register online on our website codegurru.in, call our admissions desk at +91 72388 29360, or visit our Ayodhya campus Near Saket College Petrol Pump. Our mentors provide free 1-on-1 career guidance and skill assessments.'
    }
  ];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://codegurru.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'FAQs',
        item: 'https://codegurru.in/faq',
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="w-full bg-slate-50 min-h-screen pb-16">
        
        {/* HERO BANNER */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white px-4 pt-12 pb-16 text-center select-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs sm:text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KNOWLEDGE BASE &amp; HELP DESK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-heading tracking-tight mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto font-normal">
            Everything you need to know about CodeGurru (UK VK Pvt. Ltd.), our programs, campus centers, and services.
          </p>
        </div>

        {/* FAQS ACCORDION CONTAINER */}
        <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20 space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:border-amber-400 transition-all"
            >
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading mb-2 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  Q{idx + 1}
                </span>
                <span>{faq.question}</span>
              </h2>
              <div className="pl-8 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {faq.answer}
              </div>
            </div>
          ))}

          {/* CONTACT ASSISTANCE CARD */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading">
                Have a different question?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Our support team is active Mon–Sat (10:00 AM – 7:00 PM) to help you directly.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`tel:${BUSINESS_CONFIG.contact.primaryPhone.replace(/\s+/g, '')}`}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
              >
                Call +91 72388 29360
              </a>
              <Link
                href="/contact"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all"
              >
                Contact Desk
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
