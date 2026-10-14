import ServicesPage from '../../views/pages/ServicesPage';
import { BUSINESS_CONFIG } from '../../config/business';

export const metadata = {
  title: 'IT Services, Software Development & Laptop Repair | CodeGurru',
  description:
    'CodeGurru (UK VK Pvt. Ltd.) provides custom website development, mobile apps, billing software ERP, and same-day doorstep computer/laptop repair across Uttar Pradesh.',
  keywords: [
    'CodeGurru Services',
    'Software Development Company Lucknow',
    'Website Designing Company Ayodhya',
    'Mobile App Development UP',
    'Laptop Repair in Lucknow',
    'Computer Repair Ayodhya',
    'Custom ERP Billing Software',
    'UK VK Pvt. Ltd. Services',
  ],
  alternates: {
    canonical: 'https://codegurru.in/services',
  },
  openGraph: {
    title: 'CodeGurru IT Services | Custom Software, Web Dev & Laptop Repair',
    description: 'Empowering businesses & individuals with enterprise software solutions and hardware maintenance by UK VK Pvt. Ltd.',
    url: 'https://codegurru.in/services',
  },
};

export default function ServicesRoute({ onOpenContactModal }) {
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'IT Services, Custom Software Development & Laptop Repair',
    provider: {
      '@type': 'LocalBusiness',
      name: 'CodeGurru (UK VK Pvt. Ltd.)',
      url: 'https://codegurru.in',
      telephone: BUSINESS_CONFIG.contact.primaryPhone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lucknow',
        addressRegion: 'Uttar Pradesh',
        addressCountry: 'IN',
      },
    },
    areaServed: {
      '@type': 'State',
      name: 'Uttar Pradesh',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'CodeGurru Professional Services Catalog',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Web & Software Development',
            description: 'Full-stack bespoke web and enterprise cloud applications engineered by UK VK Pvt. Ltd.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mobile App Development (Android & iOS)',
            description: 'High-performance native and cross-platform mobile apps for business automation.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Computer & Laptop Repair Service',
            description: 'Same-day chip-level motherboard diagnostics, screen replacement, SSD upgrades, and virus removal in Lucknow & Ayodhya.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Job-Oriented IT Training & Corporate Upskilling',
            description: 'MERN Stack, Python AI/ML, Java, C++ & DSA, and Robotics bootcamps with 100% placement drives.',
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <ServicesPage onOpenContactModal={onOpenContactModal} />
    </>
  );
}
