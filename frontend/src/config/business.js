/**
 * ============================================================================
 * SINGLE SOURCE OF TRUTH: BUSINESS CONFIGURATION (business.js)
 * ============================================================================
 * CodeGurru (legal entity: UK VK Pvt. Ltd.)
 * All pages, schemas, meta tags, headers, and footers must read from this config.
 */

export const BUSINESS_CONFIG = {
  brandName: 'CodeGurru',
  legalName: 'UK VK Pvt. Ltd.',
  alternateNames: ['Code Gurru', 'CodeGurru Academy', 'CodeGurru IT Company', 'CodeGurru Technologies'],
  tagline: 'Best IT Training, Software Development & Computer Repair in Uttar Pradesh',
  
  founder: {
    name: 'Kishan Pandey',
    role: 'Founder & CEO',
    bio: 'Visionary technologist and entrepreneur dedicated to building world-class tech talent and digital transformation in Uttar Pradesh.'
  },

  contact: {
    primaryPhone: '+91 72388 29360',
    secondaryPhone: '+91 72388 29132',
    whatsapp: '+91 72388 29360',
    email: 'info@codegurru.in',
    supportEmail: 'info@codegurru.in',
    workingHours: 'Mon–Sat 10:00 AM – 7:00 PM',
    sundayHours: 'Closed / Special Workshops'
  },

  urls: {
    siteUrl: 'https://codegurru.in',
    logo: 'https://codegurru.in/logo.png',
    apiBase: 'https://369.codegurru.in/api',
    upiId: 'codegurru@upi'
  },
  upiId: 'codegurru@upi',

  headOffice: {
    id: 'ayodhya-hq',
    title: 'CodeGurru Head Office & Campus',
    category: 'HEAD OFFICE & IT TRAINING CAMPUS',
    address: 'Near Saket College Petrol Pump, Ayodhya, Uttar Pradesh',
    streetAddress: 'Near Saket College Petrol Pump',
    city: 'Ayodhya',
    state: 'Uttar Pradesh',
    postalCode: '224123',
    country: 'IN',
    fullAddress: 'Near Saket College Petrol Pump, Ayodhya, Uttar Pradesh',
    phone: '+91 72388 29360, +91 72388 29132',
    phones: ['+91 72388 29360', '+91 72388 29132'],
    timings: 'Mon - Sat | 10:00 AM - 07:00 PM',
    geo: {
      latitude: 26.7922,
      longitude: 82.1998
    }
  },

  branches: [
    {
      id: 'branch-1',
      title: 'Ayodhya Branch & Campus',
      category: 'REGIONAL TECH HUB & CAMPUS',
      address: 'Near Saket College Petrol Pump, Ayodhya, Uttar Pradesh',
      streetAddress: 'Near Saket College Petrol Pump',
      city: 'Ayodhya',
      state: 'Uttar Pradesh',
      postalCode: '224123',
      country: 'IN',
      fullAddress: 'Near Saket College Petrol Pump, Ayodhya, Uttar Pradesh',
      phone: '+91 72388 29360, +91 72388 29132',
      phones: ['+91 72388 29360', '+91 72388 29132'],
      timings: 'Mon - Sat | 10:00 AM - 07:00 PM',
      geo: {
        latitude: 26.7922,
        longitude: 82.1998
      },
      photoCollage: [
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80'
      ]
    }
  ],

  services: [
    {
      id: 'training',
      title: 'IT Training & Job Placement',
      description: 'Hands-on practical coding bootcamps with 100% placement support. MERN Stack, Python AI/ML, Java SpringBoot, C++ DSA, React.js, Full Stack, Digital Marketing, Robotics & IoT.'
    },
    {
      id: 'development',
      title: 'Custom IT & Software Development',
      description: 'End-to-end web applications, custom enterprise billing ERPs, and native Android/iOS mobile solutions engineered by UK VK Pvt. Ltd.'
    },
    {
      id: 'repair',
      title: 'Computer & Laptop Repair Service',
      description: 'Same-day diagnostics, motherboard chip repair, broken screen replacement, and high-speed SSD upgrades with doorstep support in Uttar Pradesh.'
    }
  ],

  courses: [
    'MERN Stack Full Stack Development',
    'Python with Artificial Intelligence & Machine Learning',
    'Java & Spring Boot Enterprise Architecture',
    'C++ Programming with Data Structures & Algorithms (DSA)',
    'React.js & Next.js Modern Frontend Development',
    'Full Stack Web Development (MERN/Python)',
    'Digital Marketing & Business Growth Strategy',
    'Robotics & Internet of Things (IoT) Automation',
    'Basic Computer Skills, Advanced Excel & Tally Prime GST'
  ],

  team: [
    {
      id: 'kishan-pandey',
      name: 'Kishan Pandey',
      role: 'Founder & CEO',
      tag: '#FOUNDER',
      photo: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=500&fit=crop&crop=faces',
      bio: 'Founder & CEO at CodeGurru (UK VK Pvt. Ltd.), driving technical excellence and high-yield student placement initiatives in Uttar Pradesh.'
    },
    {
      id: 'aman-verma',
      name: 'Aman Kumar Verma',
      role: 'Lead Full Stack Developer',
      tag: '#TECHLEAD',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=faces',
      bio: 'Lead Full Stack Developer at CodeGurru, architecting scalable enterprise systems and mentoring live student capstone projects.'
    },
    {
      id: 'sneha-rastogi',
      name: 'Sneha Rastogi',
      role: 'Placement & Operations Manager',
      tag: '#PLACEMENTS',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=faces',
      bio: 'Placement Manager at CodeGurru, managing corporate hiring drives, mock interviews, and student career transitions.'
    },
    {
      id: 'roshani-yadav',
      name: 'Roshani Yadav',
      role: 'Digital & Community Lead',
      tag: '#COMMUNITY',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=faces',
      bio: 'Overseeing social engagement, campus community outreach, and student workshops at CodeGurru.'
    }
  ],

  socialLinks: {
    instagram: 'https://www.instagram.com/codegurru_official',
    facebook: 'https://www.facebook.com/codegurru',
    linkedin: 'https://www.linkedin.com/company/codegurru',
    youtube: 'https://www.youtube.com/@CodeGurru',
    googleBusiness: 'https://maps.google.com/?cid=codegurru'
  },

  grandOpening: {
    badge: 'GRAND OPENING 2026',
    announcement: 'UK VK Pvt. Ltd. proudly announces the Grand Opening of CodeGurru — offering 100% placement IT bootcamps, custom software development, and rapid laptop repair across Uttar Pradesh!'
  }
};
