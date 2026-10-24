import dns from 'dns';
import mongoose from 'mongoose';
import { Banner } from '../models/Banner.js';
import { Course } from '../models/Course.js';
import { Placement } from '../models/Placement.js';
import { Team } from '../models/Team.js';
import { Branch } from '../models/Branch.js';
import { NavMenu } from '../models/NavMenu.js';

// Windows DNS fix ONLY for local development
if (process.platform === 'win32' && process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (dnsErr) {
    // Ignore in restricted environments
  }
}

export const getSanitizedUri = (rawUri) => {
  if (!rawUri) return 'mongodb://127.0.0.1:27017/codeguru_db';
  try {
    const formattedUri = rawUri.trim();
    return formattedUri;
  } catch (e) {
    return rawUri;
  }
};

export const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const targetUri = process.env.MONGODB_URI || (isProduction ? null : 'mongodb://127.0.0.1:27017/codeguru_db');

  if (!targetUri) {
    console.error('FATAL: MONGODB_URI environment variable is missing.');
    if (isProduction) process.exit(1);
    return false;
  }

  try {
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 8000
    });

    console.log(`================================================`);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    console.log(`================================================`);

    // Initialize initial static catalogs ONLY if entirely empty (Never overwrite existing data)
    try {
      const bannerCount = await Banner.countDocuments();
      if (bannerCount === 0) {
        await Banner.create({
          title: 'Full-Stack Web Development Batch 2026',
          subtitle: '100% Placement Guarantee Program',
          type: 'image',
          mediaUrl: '/full-brand-logo.png',
          badge: 'NEW BATCH',
          ctaText: 'Apply Now'
        });
      }

      const courseCount = await Course.countDocuments();
      if (courseCount === 0) {
        await Course.create({
          title: 'Full Stack Web Development (MERN)',
          category: 'coding',
          subCat: 'web',
          duration: '6 Months',
          price: '₹35,000',
          badge: 'Top Rated',
          technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind']
        });
      }

      const placementCount = await Placement.countDocuments();
      if (placementCount === 0) {
        await Placement.create({
          name: 'Aman Sharma',
          company: 'Google / Amazon',
          role: 'Software Engineer',
          package: '18.5 LPA',
          batch: 'PLACEMENT BATCH 2026'
        });
      }

      const teamCount = await Team.countDocuments();
      if (teamCount === 0) {
        await Team.create({
          name: 'Vikas Sharma',
          role: 'Head Tech Mentor (DSA & Web)',
          experience: '8+ Yrs Exp',
          specialization: 'Full Stack & System Design'
        });
      }

      const branchCount = await Branch.countDocuments();
      if (branchCount === 0) {
        await Branch.create({
          title: 'Ayodhya Branch Office',
          address: 'Near Saket College Petrol Pump, Ayodhya, Uttar Pradesh',
          phone: '+91 72388 29360, +91 72388 29132',
          category: 'REGIONAL TECH HUB & CAMPUS'
        });
      }

      const navCount = await NavMenu.countDocuments();
      if (navCount === 0) {
        await NavMenu.create({
          menuId: 'NAV-101',
          name: 'Coding & Software Engineering',
          category: 'coding',
          icon: 'code'
        });
      }
    } catch (seedErr) {
      console.warn('Catalog check error (non-fatal):', seedErr.message);
    }

    return true;
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    if (isProduction) {
      console.error('FATAL: Database connection failed in production. Refusing to start.');
      process.exit(1);
    }
    return false;
  }
};
