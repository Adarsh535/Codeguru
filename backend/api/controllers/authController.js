/**
 * ============================================================================
 * CONTROLLER: AUTHENTICATION CONTROLLER (authController.js)
 * ============================================================================
 * Manages Master Admin & Student registration, authentication and profile security.
 */

import bcrypt from 'bcryptjs';
import { Admin } from '../../models/Admin.js';
import { Student } from '../../models/Student.js';

/**
 * @route   POST /api/auth/login
 * @desc    Master Admin Login authentication (Strict Database Lookup)
 * @access  Public
 * @param   {string} email
 * @param   {string} password
 * @returns {Object} { success, token, user, message }
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Query MongoDB Atlas Database for Admin account matching cleanEmail
    let admin = await Admin.findOne({ email: cleanEmail });

    // Fallback: If DB has no admin records at all, auto-create initial Master Admin
    if (!admin) {
      const totalAdmins = await Admin.countDocuments();
      if (totalAdmins === 0) {
        const hashedPassword = await bcrypt.hash(password, 10);
        admin = new Admin({
          name: 'Super Admin',
          email: cleanEmail,
          password: hashedPassword,
          role: 'Master Admin'
        });
        await admin.save();
      }
    }

    // 2. If no admin account exists in MongoDB Atlas for this email
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 3. Verify password directly against the stored hash/password in MongoDB Atlas
    let isMatch = false;
    if (admin.password) {
      if (admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, admin.password);
      } else {
        isMatch = (admin.password === password);
        if (isMatch) {
          admin.password = await bcrypt.hash(password, 10);
          await admin.save();
        }
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    return res.json({
      success: true,
      token: `cg-admin-jwt-${Date.now()}`,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      message: 'Master Admin login successful'
    });
  } catch (error) {
    console.error('[authController loginAdmin Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server authentication error'
    });
  }
};

/**
 * @route   POST /api/auth/update-credentials
 * @desc    Update Master Admin Email & Password credentials directly in Database
 * @access  Admin Private
 * @param   {string} currentEmail
 * @param   {string} newEmail
 * @param   {string} newPassword
 * @returns {Object} { success, message }
 */
export const updateCredentials = async (req, res) => {
  try {
    const { currentEmail, newEmail, newPassword } = req.body;

    const queryEmail = (currentEmail || '').toLowerCase().trim();
    let admin = await Admin.findOne({ email: queryEmail });

    // Fallback: If not found by currentEmail, find the single master admin in database
    if (!admin) {
      admin = await Admin.findOne();
    }

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account record not found in MongoDB database'
      });
    }

    if (newEmail) {
      admin.email = newEmail.toLowerCase().trim();
    }

    if (newPassword) {
      admin.password = await bcrypt.hash(newPassword, 10);
    }

    await admin.save();

    console.log(`✅ Admin credentials updated in MongoDB Atlas: Email = ${admin.email}`);

    return res.json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      message: 'Admin credentials updated successfully in MongoDB Atlas'
    });
  } catch (error) {
    console.error('[authController updateCredentials Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating credentials'
    });
  }
};

/**
 * @route   POST /api/auth/student/register
 * @desc    Register a new student account
 * @access  Public
 * @param   {string} name
 * @param   {string} email
 * @param   {string} password
 * @param   {string} phone
 * @returns {Object} { success, token, student, message }
 */
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingStudent = await Student.findOne({ email: cleanEmail });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Account with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone || '',
      role: 'Student'
    });

    await newStudent.save();

    return res.status(201).json({
      success: true,
      token: `cg-student-jwt-${Date.now()}`,
      student: {
        id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        role: newStudent.role
      },
      message: 'Student account registered successfully'
    });
  } catch (error) {
    console.error('[authController registerStudent Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error registering student account'
    });
  }
};

/**
 * @route   POST /api/auth/student/login
 * @desc    Authenticate student account login
 * @access  Public
 * @param   {string} email
 * @param   {string} password
 * @returns {Object} { success, token, student, message }
 */
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const student = await Student.findOne({ email: cleanEmail });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    let isMatch = false;
    if (student.password) {
      if (student.password.startsWith('$2a$') || student.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, student.password);
      } else {
        isMatch = (student.password === password);
        if (isMatch) {
          student.password = await bcrypt.hash(password, 10);
          await student.save();
        }
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    return res.json({
      success: true,
      token: `cg-student-jwt-${Date.now()}`,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        role: student.role
      },
      message: 'Student login successful'
    });
  } catch (error) {
    console.error('[authController loginStudent Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during student login'
    });
  }
};

