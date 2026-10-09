import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { getSanitizedUri } from '../config/db.js';

async function cleanAdmins() {
  const uri = getSanitizedUri(process.env.MONGODB_URI);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

  const targetId = '6aa5836da0119fb1f301279d';

  // Delete all admins except the target one from the screenshot
  const deleteResult = await Admin.deleteMany({ _id: { $ne: targetId } });
  console.log('Deleted extra admin count:', deleteResult.deletedCount);

  let primaryAdmin = await Admin.findById(targetId);
  if (!primaryAdmin) {
    primaryAdmin = await Admin.findOne();
  }

  if (primaryAdmin) {
    primaryAdmin.email = primaryAdmin.email || 'codeguru123@gmail.com';
    // Ensure password is bcrypt hashed with admin123 if not already set
    if (!primaryAdmin.password || !primaryAdmin.password.startsWith('$2')) {
      primaryAdmin.password = await bcrypt.hash('admin123', 10);
    }
    await primaryAdmin.save();
    console.log('✅ Single Master Admin in DB:', {
      id: primaryAdmin._id,
      email: primaryAdmin.email,
      name: primaryAdmin.name,
      role: primaryAdmin.role
    });
  }

  await mongoose.disconnect();
}

cleanAdmins().catch(console.error);
