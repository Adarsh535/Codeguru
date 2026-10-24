/**
 * ============================================================================
 * SCRIPT: CREATE / UPDATE ADMIN USER (scripts/createAdmin.js)
 * ============================================================================
 * Usage:
 *   node scripts/createAdmin.js --email admin@example.com --password YourSecurePassword123
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      parsed.email = args[i + 1];
      i++;
    } else if (args[i] === '--password' && args[i + 1]) {
      parsed.password = args[i + 1];
      i++;
    } else if (args[i] === '--name' && args[i + 1]) {
      parsed.name = args[i + 1];
      i++;
    } else if (args[i] === '--role' && args[i + 1]) {
      parsed.role = args[i + 1];
      i++;
    }
  }
  return parsed;
}

async function run() {
  const { email, password, name = 'Master Admin', role = 'Master Admin' } = parseArgs();

  if (!email || !password) {
    console.error('Error: Both --email and --password are strictly required.');
    console.error('Usage: node scripts/createAdmin.js --email <email> --password <password> [--name <name>] [--role <role>]');
    process.exit(1);
  }

  const cleanEmail = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    console.error('Error: Invalid email format.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Error: Password must be at least 8 characters long.');
    process.exit(1);
  }

  const targetUri = process.env.MONGODB_URI;
  if (!targetUri) {
    console.error('Error: MONGODB_URI environment variable is required.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 8000 });

    const hashedPassword = await bcrypt.hash(password, 12);
    const existing = await Admin.findOne({ email: cleanEmail });

    if (existing) {
      existing.name = name;
      existing.password = hashedPassword;
      existing.role = role;
      existing.tokenVersion = (existing.tokenVersion || 0) + 1;
      existing.isActive = true;
      await existing.save();
      console.log(`✅ Admin account '${cleanEmail}' updated successfully.`);
    } else {
      await Admin.create({
        name,
        email: cleanEmail,
        password: hashedPassword,
        role,
        tokenVersion: 0,
        isActive: true
      });
      console.log(`✅ Admin account '${cleanEmail}' created successfully.`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    try { await mongoose.disconnect(); } catch (_) {}
    process.exit(1);
  }
}

run();
