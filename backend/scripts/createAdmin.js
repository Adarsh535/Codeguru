/**
 * ============================================================================
 * SCRIPT: CREATE / SEED ADMIN USER (scripts/createAdmin.js)
 * ============================================================================
 * Command-line script to create or update master admin credentials in MongoDB.
 *
 * Usage:
 *   node scripts/createAdmin.js [email] [password] [name]
 *   npm run seed:admin
 */

import 'dotenv/config';
import dns from 'dns';
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (_) {}
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { getSanitizedUri } from '../config/db.js';

async function createOrUpdateAdmin() {
  const args = process.argv.slice(2);
  const email = (args[0] || process.env.ADMIN_EMAIL || 'admin@codeguru.com').toLowerCase().trim();
  const rawPassword = args[1] || process.env.ADMIN_PASSWORD || 'admin123';
  const name = args[2] || 'Super Admin';

  console.log('--------------------------------------------------');
  console.log('🔐 CODEGURU ADMIN CREATION SCRIPT');
  console.log('--------------------------------------------------');

  const rawUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codeguru_db';
  const targetUri = getSanitizedUri(rawUri);

  try {
    console.log(`⏳ Connecting to MongoDB database (${targetUri.includes('127.0.0.1') ? 'Local' : 'Atlas Cloud'})...`);
    await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected successfully.');

    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      existingAdmin.name = name;
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'Master Admin';
      await existingAdmin.save();
      console.log(`🎉 Admin account UPDATED successfully!`);
    } else {
      await Admin.create({
        name,
        email,
        password: hashedPassword,
        role: 'Master Admin'
      });
      console.log(`🎉 Admin account CREATED successfully!`);
    }

    console.log(`--------------------------------------------------`);
    console.log(`📧 Email:    ${email}`);
    console.log(`🔑 Password: ${rawPassword}`);
    console.log(`👤 Name:     ${name}`);
    console.log(`--------------------------------------------------`);

  } catch (err) {
    console.error('❌ Error creating admin user:', err.message);
    if (err.message.includes('EBADNAME') || err.message.includes('connect ECONNREFUSED')) {
      console.log('\n💡 HOW TO FIX THIS ERROR:');
      console.log('1. Open file: backend/.env');
      console.log('2. Find line: MONGODB_URI=mongodb+srv://av969998_db_user:xdtkojOhIUJwdp87@<CLUSTER_HOST>/codeguru_db');
      console.log('3. Replace <CLUSTER_HOST> with your actual MongoDB Atlas cluster host (e.g. cluster0.abcde.mongodb.net)');
      console.log('   (You can find your cluster address in MongoDB Atlas dashboard -> Database -> Connect -> Connect your application)');
    }
  } finally {
    try { await mongoose.disconnect(); } catch (_) {}
    console.log('👋 Database connection closed.');
    process.exit(0);
  }
}

createOrUpdateAdmin();
