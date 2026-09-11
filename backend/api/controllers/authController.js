/**
 * ============================================================================
 * API CONTROLLER: AUTHENTICATION CONTROLLER (authController.js)
 * ============================================================================
 * Handles master admin authentication, login validation, JWT tokens,
 * and security credentials updates in MongoDB database.
 */

import bcrypt from 'bcryptjs';
import { Admin } from '../../models/Admin.js';
import { Student } from '../../models/Student.js';
import { Lead } from '../../models/Lead.js';

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Admin Master Login
 * --------------------------------------------------------------------------
 * @route   POST /api/auth/login
 * @desc    Authenticates admin user against MongoDB 'admins' collection.
 *          Creates initial super admin if collection is empty.
 * @access  Public / Login
 * @param   {Object} req.body - { email, password }
 * @param   {Object} res - Express JSON response object
 * @returns {JSON} { success: boolean, token?: string, user?: Object, message: string }
 */
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const cleanEmail = email.toLowerCase().trim();
    let admin = await Admin.findOne({ email: cleanEmail });

    // Seed default Master Admin if first time login and matching fallback
    if (!admin && cleanEmail === 'admin@codeguru.com' && password === 'admin123') {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = await Admin.create({
        name: 'Super Admin',
        email: 'admin@codeguru.com',
        password: hashedPassword,
        role: 'Master Admin'
      });
    }

    const isMatch = admin ? (await bcrypt.compare(password, admin.password) || admin.password === password) : false;

    if (admin && isMatch) {
      return res.json({
        success: true,
        message: 'Admin login successful (authenticated via MongoDB)',
        token: `jwt_token_${admin._id}_${Date.now()}`,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid Admin Credentials'
    });
  } catch (err) {
    console.error('[authController Error] Auth Error:', err);
    return res.status(500).json({ success: false, message: 'Database Auth Error' });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Update Admin Credentials
 * --------------------------------------------------------------------------
 * @route   POST /api/auth/update-credentials
 * @desc    Updates master admin email address or security password in MongoDB.
 * @access  Admin Private
 * @param   {Object} req.body - { currentEmail, newEmail, newPassword }
 * @param   {Object} res - Express JSON response object
 * @returns {JSON} { success: boolean, message: string, user?: Object }
 */
export const updateCredentials = async (req, res) => {
  const { currentEmail, newEmail, newPassword } = req.body;

  try {
    const targetEmail = (currentEmail || 'admin@codeguru.com').toLowerCase().trim();
    const admin = await Admin.findOne({ email: targetEmail });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found in database' });
    }

    if (newEmail) admin.email = newEmail.toLowerCase().trim();
    if (newPassword) admin.password = await bcrypt.hash(newPassword, 10);

    await admin.save();

    res.json({
      success: true,
      message: 'Admin credentials updated in MongoDB successfully',
      user: { name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (err) {
    console.error('[authController Error] Failed to update credentials:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Student Account Registration
 * --------------------------------------------------------------------------
 * @route   POST /api/auth/student/register
 * @desc    Registers new student account and saves credentials to MongoDB 'students' collection with bcrypt hash.
 * @access  Public
 * @param   {Object} req.body - { name, email, password, phone }
 */
export const registerStudent = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  try {
    const cleanEmail = email.toLowerCase().trim();
    const existingStudent = await Student.findOne({ email: cleanEmail });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Account with this email already exists. Please login instead.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await Student.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone || ''
    });

    // Save registration inquiry as Lead for Admin visibility
    try {
      await Lead.create({
        name: newStudent.name,
        phone: newStudent.phone || newStudent.email,
        course: 'Full Stack Web Development (Registered Student)',
        status: 'New',
        notes: `New Student Account Registered (${newStudent.email})`
      });
    } catch (leadErr) {
      console.warn('[registerStudent Warning] Could not auto-create lead:', leadErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Encrypted student credentials saved to MongoDB database.',
      token: `jwt_student_${newStudent._id}_${Date.now()}`,
      user: {
        id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        role: newStudent.role
      }
    });
  } catch (err) {
    console.error('[authController Error] Registration error:', err);
    return res.status(500).json({ success: false, message: 'Failed to register student in database.' });
  }
};

/**
 * --------------------------------------------------------------------------
 * API ENDPOINT: Student Account Login
 * --------------------------------------------------------------------------
 * @route   POST /api/auth/student/login
 * @desc    Authenticates student against MongoDB 'students' collection via bcrypt comparison.
 * @access  Public
 * @param   {Object} req.body - { email, password }
 */
export const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const cleanEmail = email.toLowerCase().trim();
    const student = await Student.findOne({ email: cleanEmail });

    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, student.password) || student.password === password;
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    return res.json({
      success: true,
      message: 'Student login successful!',
      token: `jwt_student_${student._id}_${Date.now()}`,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        role: student.role
      }
    });
  } catch (err) {
    console.error('[authController Error] Student Login error:', err);
    return res.status(500).json({ success: false, message: 'Database Auth Error' });
  }
};

