import dns from 'dns';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { Banner } from '../models/Banner.js';
import { Lead } from '../models/Lead.js';
import { Course } from '../models/Course.js';
import { Placement } from '../models/Placement.js';
import { Team } from '../models/Team.js';
import { Branch } from '../models/Branch.js';
import { Traffic } from '../models/Traffic.js';
import { NavMenu } from '../models/NavMenu.js';
import { Student } from '../models/Student.js';
import { Enrollment } from '../models/Enrollment.js';

// Configure DNS fallback servers to ensure Windows Node.js resolves MongoDB Atlas _mongodb._tcp SRV records cleanly
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  // Ignore DNS set errors if restricted by network policy
}

export const getSanitizedUri = (rawUri) => {
  if (!rawUri) return 'mongodb://127.0.0.1:27017/codeguru_db';
  try {
    let formattedUri = rawUri.trim();
    if (formattedUri.startsWith('mongodb+srv://') || formattedUri.startsWith('mongodb://')) {
      const schemeSplit = formattedUri.split('://');
      const rest = schemeSplit[1];
      const lastAt = rest.lastIndexOf('@');
      if (lastAt !== -1) {
        const userPass = rest.substring(0, lastAt);
        let hostPath = rest.substring(lastAt + 1);
        
        // Ensure default database name exists in connection string
        if (hostPath.endsWith('/')) {
          hostPath += 'codeguru_db?retryWrites=true&w=majority';
        } else if (!hostPath.includes('/') || hostPath.split('/')[1] === '') {
          hostPath += '/codeguru_db?retryWrites=true&w=majority';
        }

        const colonIndex = userPass.indexOf(':');
        if (colonIndex !== -1) {
          const username = userPass.substring(0, colonIndex);
          const rawPassword = userPass.substring(colonIndex + 1);
          const encodedPassword = encodeURIComponent(decodeURIComponent(rawPassword));
          return `${schemeSplit[0]}://${username}:${encodedPassword}@${hostPath}`;
        }
      }
    }
  } catch (e) {
    // If parsing fails, return rawUri
  }
  return rawUri;
};

const rawTargetUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codeguru_db';
const MONGODB_URI = getSanitizedUri(rawTargetUri);
const LOCAL_MONGODB_URI = 'mongodb://127.0.0.1:27017/codeguru_db';


export const connectDB = async () => {
  let activeUri = MONGODB_URI;
  let isAtlas = activeUri.includes('mongodb+srv://') || activeUri.includes('.mongodb.net');
  let conn;

  try {
    conn = await mongoose.connect(activeUri, {
      serverSelectionTimeoutMS: 5000
    });
  } catch (primaryErr) {
    console.warn(`================================================`);
    console.warn(`⚠️ Primary MongoDB Connection Failed (${primaryErr.message})`);
    
    if (isAtlas) {
      console.warn(`🔄 Attempting Fallback to Local MongoDB (127.0.0.1:27017)...`);
      try {
        activeUri = LOCAL_MONGODB_URI;
        isAtlas = false;
        conn = await mongoose.connect(activeUri, {
          serverSelectionTimeoutMS: 5000
        });
      } catch (fallbackErr) {
        console.warn(`================================================`);
        console.warn(`⚠️ Local MongoDB Connection Error (${fallbackErr.message})`);
        console.warn(`👉 For MongoDB Atlas:`);
        console.warn(`   1. Check your Atlas Connection String in backend/.env`);
        console.warn(`   2. Ensure IP Access List includes your IP or 0.0.0.0/0 in Atlas Network Access`);
        console.warn(`   3. Verify database username & password are correct`);
        console.warn(`👉 For Local MongoDB: Ensure MongoDB service is running at mongodb://127.0.0.1:27017`);
        console.warn(`================================================`);
        return false;
      }
    } else {
      console.warn(`👉 Ensure MongoDB service is running locally at mongodb://127.0.0.1:27017`);
      console.warn(`================================================`);
      return false;
    }
  }

  // Mask password for console security
  const sanitizedURI = activeUri.replace(/:([^@]+)@/, ':****@');
  
  console.log(`================================================`);
  console.log(`🍃 MongoDB Connected Successfully via Mongoose (${isAtlas ? 'MongoDB Atlas Cloud' : 'Local MongoDB Fallback'})`);
  console.log(`📍 Host: ${conn.connection.host}`);
  console.log(`🗄️ Database Name: ${conn.connection.name}`);
  console.log(`🧭 Connection String: ${sanitizedURI}`);
  console.log(`================================================`);

  try {
    // 1. Initialize 'admins' collection
    const existingAdmin = await Admin.findOne({ email: 'admin@codeguru.com' });
    if (!existingAdmin) {
      await Admin.create({
        name: 'Super Admin',
        email: 'admin@codeguru.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'Master Admin'
      });
      console.log(`🔑 Admin user created in MongoDB 'admins' collection`);
    }

    // 2. Initialize 'banners' collection
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
      console.log(`🖼️ Banners collection initialized in 'banners'`);
    }

    // 3. Ensure 'leads' collection exists without fake seed data


    // 4. Initialize 'courses' collection
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
      console.log(`📚 Courses collection initialized in 'courses'`);
    }

    // 5. Initialize 'placements' collection
    const placementCount = await Placement.countDocuments();
    if (placementCount === 0) {
      await Placement.create({
        name: 'Aman Sharma',
        company: 'Google / Amazon',
        role: 'Software Engineer',
        package: '18.5 LPA',
        batch: 'PLACEMENT BATCH 2026'
      });
      console.log(`🎓 Placements collection initialized in 'placements'`);
    }

    // 6. Initialize 'teams' collection
    const teamCount = await Team.countDocuments();
    if (teamCount === 0) {
      await Team.create({
        name: 'Vikas Sharma',
        role: 'Head Tech Mentor (DSA & Web)',
        experience: '8+ Yrs Exp',
        specialization: 'Full Stack & System Design'
      });
      console.log(`👨‍🏫 Team collection initialized in 'teams'`);
    }

    // 7. Initialize 'branches' collection
    const branchCount = await Branch.countDocuments();
    if (branchCount === 0) {
      await Branch.create({
        title: 'Lucknow HQ Campus',
        address: 'Hazratganj Tech Corridor, Lucknow, UP',
        category: 'REGIONAL BRANCH & CAMPUS'
      });
      console.log(`🏢 Branches collection initialized in 'branches'`);
    }

    // 8. Initialize 'navmenus' collection
    const navCount = await NavMenu.countDocuments();
    if (navCount === 0) {
      await NavMenu.create({
        menuId: 'NAV-101',
        name: 'Coding & Software Engineering',
        category: 'coding',
        icon: 'code'
      });
      console.log(`🧭 NavMenus collection initialized in 'navmenus'`);
    }

    // 9. Initialize 'traffics' collection
    const trafficCount = await Traffic.countDocuments();
    if (trafficCount === 0) {
      await Traffic.create({
        date: new Date().toISOString().split('T')[0],
        pageViews: 1248,
        uniqueVisitors: 860,
        cities: [
          { name: 'Lucknow, UP', count: 580 },
          { name: 'Ayodhya, UP', count: 275 }
        ]
      });
      console.log(`📈 Traffic collection initialized in 'traffics'`);
    }

    // 10. Initialize 'students' collection
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      await Student.create({
        name: 'Demo Student',
        email: 'student@codeguru.com',
        password: bcrypt.hashSync('student123', 10),
        phone: '9876543210',
        role: 'Student'
      });
      console.log(`🧑‍🎓 Students collection initialized in 'students'`);
    }

    // 11. Initialize 'enrollments' collection
    const enrollmentCount = await Enrollment.countDocuments();
    if (enrollmentCount === 0) {
      await Enrollment.create({
        enrollmentId: 'ENR-1001',
        studentName: 'Demo Student',
        studentEmail: 'student@codeguru.com',
        studentPhone: '9876543210',
        courseName: 'Full Stack Web Development (MERN)',
        batchCode: 'FS-2026-42',
        timing: '09:00 AM - 11:00 AM',
        mentor: 'Vikas Sharma',
        startDate: '15 Sept 2026',
        fee: '₹35,000',
        paymentPlan: 'Full Payment',
        paidAmount: '₹35,000',
        pendingAmount: '₹0',
        feeStatus: 'Paid',
        paymentMethod: 'UPI QR',
        status: 'Active'
      });
      console.log(`💳 Enrollments collection initialized in 'enrollments'`);
    }

    return true;
  } catch (initErr) {
    console.error(`Error initializing database collections:`, initErr.message);
    return true;
  }
};

