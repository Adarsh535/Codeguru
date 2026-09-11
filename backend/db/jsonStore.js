import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
const dbFile = path.join(dataDir, 'db.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const INITIAL_DATA = {
  banners: [
    {
      id: 'b-1',
      title: 'STAR ACHIEVERS & PLACEMENT DRIVES 2026',
      subtitle: 'CodeGuru Alumni placed at Top MNCs & Unicorn Startups with packages up to 18.5 LPA',
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80',
      badge: 'TOP PLACEMENTS 2026',
      ctaText: 'Explore Placement Drives',
      active: true
    },
    {
      id: 'b-2',
      title: 'MERN FULL STACK & DATA SCIENCE CERTIFICATION',
      subtitle: 'Join Industry-Led Training Batches with 1:1 Expert Mentorship & Live Capstone Projects',
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80',
      badge: 'LIVE ADMISSIONS OPEN',
      ctaText: 'View Course Catalog',
      active: true
    }
  ],

  courses: [
    {
      id: 'c-101',
      title: 'Full Stack Web Development (MERN)',
      category: 'Coding & Development',
      duration: '6 Months',
      price: '₹ 24,999',
      level: 'Beginner to Advanced',
      badge: 'Bestseller',
      description: 'Master React 18, Node.js, Express, MongoDB, TailwindCSS, and System Design with 5 real-world projects.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'TailwindCSS'],
      active: true
    },
    {
      id: 'c-102',
      title: 'Java Full Stack & DSA Masterclass',
      category: 'Software Engineering',
      duration: '6 Months',
      price: '₹ 26,999',
      level: 'Intermediate',
      badge: 'Job Guaranteed Batch',
      description: 'Complete Java 21, Spring Boot, Microservices, Data Structures & Algorithms with 450+ solved LeetCode problems.',
      technologies: ['Java', 'Spring Boot', 'Microservices', 'DSA', 'SQL'],
      active: true
    },
    {
      id: 'c-103',
      title: 'Python Data Science & AI / ML',
      category: 'AI & Data Science',
      duration: '5 Months',
      price: '₹ 28,999',
      level: 'All Levels',
      badge: 'Trending',
      description: 'Hands-on Machine Learning, Deep Learning, PyTorch, Pandas, Neural Networks, and Generative AI.',
      technologies: ['Python', 'Pandas', 'PyTorch', 'TensorFlow', 'Scikit-Learn'],
      active: true
    },
    {
      id: 'c-104',
      title: 'DevOps & Cloud Engineering (AWS & Docker)',
      category: 'Cloud & Infrastructure',
      duration: '4 Months',
      price: '₹ 22,999',
      level: 'Intermediate',
      badge: 'High Salary Role',
      description: 'Master CI/CD pipelines, Docker containerization, Kubernetes orchestration, Terraform, and AWS Cloud.',
      technologies: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins'],
      active: true
    }
  ],

  placements: [
    {
      id: 'tp-1',
      name: 'VIVEK CHAURASIYA',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      college: 'CSJM GOVT. POLYTECHNIC AMBEDKAR NAGAR',
      batch: 'INTERNSHIP BATCH 2025',
      company: 'QUANTUMHOOK, NOIDA',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      role: 'MERN STACK DEVELOPER',
      package: '14.5 LPA',
      verified: true
    },
    {
      id: 'tp-2',
      name: 'PRIYA VERMA',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      college: 'KNIT SULTANPUR',
      batch: 'PLACEMENT BATCH 2025',
      company: 'TCS DIGITAL, BENGALURU',
      companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
      role: 'SYSTEM ENGINEER',
      package: '12.0 LPA',
      verified: true
    },
    {
      id: 'tp-3',
      name: 'AMIT PATEL',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      college: 'IET LUCKNOW',
      batch: 'JOB PLACEMENT 2025',
      company: 'WIPRO TECHNOLOGIES, HYDERABAD',
      companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg',
      role: 'CLOUD & DEVOPS ENGINEER',
      package: '11.5 LPA',
      verified: true
    },
    {
      id: 'tp-4',
      name: 'NEHA GUPTA',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      college: 'LPU (LOVELY PROF UNIV)',
      batch: 'JOB PLACEMENT 2025',
      company: 'ADOBE, NOIDA',
      companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_2012.svg',
      role: 'FRONTEND UI DEVELOPER',
      package: '18.5 LPA',
      verified: true
    }
  ],

  team: [
    {
      id: 'team-1',
      name: 'Roshani Yadav',
      role: 'Social Media Manager',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      tag: '#TEAMDIGICODERS',
      bio: 'Roshani Yadav is the Social Media Manager at Digicoders, overseeing content strategy, engagement, and brand presence across platforms.',
      questionPrompt: 'Do you have any project in mind?',
      phone: '9198483820',
      website: 'thedigicoders.com'
    },
    {
      id: 'team-2',
      name: 'Aman Kumar Verma',
      role: 'Lead Full Stack Developer',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      tag: '#TEAMDIGICODERS',
      bio: 'Aman Kumar Verma is the Lead Full Stack Developer at Digicoders, guiding core MERN architecture and enterprise web solutions.',
      questionPrompt: 'Do you have any project in mind?',
      phone: '9198483820',
      website: 'thedigicoders.com'
    },
    {
      id: 'team-3',
      name: 'Sneha Rastogi',
      role: 'Placement Manager',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      tag: '#TEAMDIGICODERS',
      bio: 'Sneha Rastogi is the Placement Manager at Digicoders, driving corporate partnerships and campus recruitment.',
      questionPrompt: 'Do you have any project in mind?',
      phone: '9198483820',
      website: 'thedigicoders.com'
    }
  ],

  branches: [
    {
      id: 'branch-1',
      category: 'REGIONAL TECH HUB & CAMPUS',
      title: 'Ayodhya Branch Office',
      address: 'NEAR BENIGANJ CHAURAHA, MAIN HIGHWAY ROAD, AYODHYA, UTTAR PRADESH 224001',
      phone: '+91 91984 83820',
      timings: 'Mon - Sat | 10:00 AM - 07:00 PM'
    }
  ],

  leads: [
    {
      id: 'LEAD-1001',
      name: 'Saurabh Kumar',
      phone: '9876543210',
      location: 'Lucknow, UP',
      course: 'Full Stack Web Development',
      status: 'New',
      createdAt: new Date().toISOString(),
      notes: 'Interested in MERN stack job guarantee batch'
    },
    {
      id: 'LEAD-1002',
      name: 'Ananya Mishra',
      phone: '9123456789',
      location: 'Ayodhya, UP',
      course: 'Java Full Stack & DSA',
      status: 'Contacted',
      createdAt: new Date().toISOString(),
      notes: 'Requested callback after 5 PM'
    }
  ]
};

export const getDB = () => {
  try {
    if (!fs.existsSync(dbFile)) {
      fs.writeFileSync(dbFile, JSON.stringify(INITIAL_DATA, null, 2));
      return INITIAL_DATA;
    }
    const content = fs.readFileSync(dbFile, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading JSON DB:', err);
    return INITIAL_DATA;
  }
};

export const saveDB = (data) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing JSON DB:', err);
    return false;
  }
};
