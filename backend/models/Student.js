import mongoose from 'mongoose';

/**
 * ============================================================================
 * MONGOOSE SCHEMA: STUDENT USER MODEL (Student.js)
 * ============================================================================
 * Stores registered student account credentials and profile info in MongoDB.
 */

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'Student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
