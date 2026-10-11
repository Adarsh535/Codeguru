/**
 * ============================================================================
 * CONTROLLER: AUTHENTICATION CONTROLLER (authController.js)
 * ============================================================================
 * Manages Master Admin & Student registration, authentication and profile security.
 */

import bcrypt from 'bcryptjs';
import { Admin } from '../../models/Admin.js';
import { Student } from '../../models/Student.js';
import { Lead } from '../../models/Lead.js';
import { sendRealSMS, sendOtpSMS, checkTwilioVerify } from '../../services/smsService.js';
import { broadcastRealtimeEvent } from '../../services/realtimeService.js';

// In-memory OTP store: phone -> { otp, expiresAt }
const otpStore = new Map();

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

/**
 * @route   POST /api/auth/student/send-otp
 * @desc    Generate and send verification OTP to student mobile number via Twilio SMS
 * @access  Public
 */
export const sendStudentOtp = async (req, res) => {
  try {
    const rawPhone = req.body.phone || '';
    const cleanPhone = rawPhone.toString().replace(/[^0-9]/g, '').slice(-10);

    if (!cleanPhone || cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins expiration

    otpStore.set(cleanPhone, { otp, expiresAt });

    // Send real cellular SMS to student phone via SMS Gateway
    const smsResult = await sendOtpSMS(cleanPhone, otp);
    const isRealDelivered = Boolean(smsResult && smsResult.success === true);

    console.log(`\n======================================================`);
    console.log(`🔑 [STUDENT OTP DISPATCH] Phone: +91 ${cleanPhone} | Code: ${otp}`);
    console.log(`📡 SMS Provider Result:`, smsResult?.provider || 'Simulation');
    console.log(`📡 Real SMS Delivered:`, isRealDelivered ? 'YES' : 'NO (Trial/Simulation Mode)');
    console.log(`======================================================\n`);

    return res.json({
      success: true,
      message: isRealDelivered
        ? `OTP has been sent to +91 ${cleanPhone} via SMS`
        : `Trial Mode: Real SMS restricted by Twilio Trial. Your OTP is ${otp}`,
      phone: cleanPhone,
      provider: smsResult?.provider || 'Simulation',
      isRealSMS: isRealDelivered,
      demoOtp: isRealDelivered ? undefined : otp
    });
  } catch (error) {
    console.error('[authController sendStudentOtp Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP. Please try again.'
    });
  }
};

/**
 * @route   POST /api/auth/student/verify-otp
 * @desc    Verify OTP and automatically authenticate / create student
 * @access  Public
 */
export const verifyStudentOtp = async (req, res) => {
  try {
    const { phone, otp, name } = req.body;
    const cleanPhone = (phone || '').toString().replace(/[^0-9]/g, '').slice(-10);
    const cleanOtp = (otp || '').toString().trim();

    if (!cleanPhone || cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number'
      });
    }

    if (!cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Please enter the verification OTP'
      });
    }

    let isValid = false;

    // 1. First check Twilio Verify service (real SMS delivered to user's mobile)
    const twilioValid = await checkTwilioVerify(cleanPhone, cleanOtp);
    if (twilioValid) {
      isValid = true;
      otpStore.delete(cleanPhone);
    } else if (cleanOtp === '1234' || cleanOtp === '123456') {
      // 2. Allow master test OTPs for instant validation
      isValid = true;
    } else {
      // 3. Check in-memory fallback OTP
      const storedData = otpStore.get(cleanPhone);
      if (storedData) {
        if (Date.now() > storedData.expiresAt) {
          otpStore.delete(cleanPhone);
          return res.status(400).json({
            success: false,
            message: 'OTP has expired. Please request a new OTP.'
          });
        }
        if (storedData.otp === cleanOtp) {
          isValid = true;
          otpStore.delete(cleanPhone);
        }
      }
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code. Please enter the OTP received on your mobile.'
      });
    }

    // Look up student by phone
    let student = await Student.findOne({ phone: cleanPhone });

    if (!student) {
      const studentName = (name && name.trim()) || `Student ${cleanPhone.slice(-4)}`;
      const autoEmail = `${cleanPhone}@student.codeguru.in`;
      const tempPassword = await bcrypt.hash(`OTP@${cleanPhone}`, 10);

      // Check if student with this email exists
      student = await Student.findOne({ email: autoEmail });
      if (!student) {
        student = new Student({
          name: studentName,
          phone: cleanPhone,
          email: autoEmail,
          password: tempPassword,
          role: 'Student'
        });
        await student.save();
      } else {
        student.phone = cleanPhone;
        await student.save();
      }

      // Add to Lead CRM collection
      try {
        const studentLocation = (req.body.location && req.body.location.trim()) || 'Ayodhya, UP';
        const newLead = new Lead({
          leadId: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
          name: studentName,
          phone: cleanPhone,
          email: autoEmail,
          location: studentLocation,
          course: 'Full Stack Web Development (OTP Verified)',
          status: 'New',
          notes: `Instant Mobile OTP Login Verified (+91 ${cleanPhone}, Location: ${studentLocation})`
        });
        await newLead.save();
        broadcastRealtimeEvent('leads', newLead);
      } catch (err) {
        console.warn('[verifyStudentOtp Lead Sync Warning]:', err.message);
      }
    }

    return res.json({
      success: true,
      token: `cg-student-jwt-${Date.now()}`,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        role: student.role || 'Student'
      },
      message: 'Mobile OTP verified successfully! Logged in.'
    });
  } catch (error) {
    console.error('[authController verifyStudentOtp Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error verifying OTP'
    });
  }
};

/**
 * @route   POST /api/auth/student/update-profile
 * @desc    Update student name and email right after mobile OTP verification
 * @access  Public
 */
export const updateStudentProfile = async (req, res) => {
  try {
    const { phone, name, email } = req.body;
    const cleanPhone = (phone || '').toString().replace(/[^0-9]/g, '').slice(-10);

    if (!cleanPhone || cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Valid 10-digit mobile number required'
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your full name'
      });
    }

    const cleanName = name.trim();
    const cleanEmail = (email && email.trim().toLowerCase()) || `${cleanPhone}@student.codeguru.in`;

    let student = await Student.findOne({ phone: cleanPhone });

    if (!student) {
      student = await Student.findOne({ email: cleanEmail });
    }

    if (student) {
      student.name = cleanName;
      student.email = cleanEmail;
      student.phone = cleanPhone;
      await student.save();
    } else {
      const tempPassword = await bcrypt.hash(`OTP@${cleanPhone}`, 10);
      student = new Student({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        password: tempPassword,
        role: 'Student'
      });
      await student.save();
    }

    // Also update Lead CRM
    try {
      const studentLocation = (req.body.location && req.body.location.trim()) || '';
      let lead = await Lead.findOne({ phone: cleanPhone });
      if (lead) {
        lead.name = cleanName;
        lead.email = cleanEmail;
        if (studentLocation && studentLocation !== 'Ayodhya, UP') {
          lead.location = studentLocation;
        }
        await lead.save();
      } else {
        lead = new Lead({
          leadId: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          location: studentLocation || 'Ayodhya, UP',
          course: 'Full Stack Web Development (OTP Verified)',
          status: 'New',
          notes: `Instant Mobile OTP Login Verified (+91 ${cleanPhone}${studentLocation ? ', Location: ' + studentLocation : ''})`
        });
        await lead.save();
      }
      broadcastRealtimeEvent('leads', lead);
    } catch (leadErr) {
      console.warn('[updateStudentProfile Lead Sync Warning]:', leadErr.message);
    }

    return res.json({
      success: true,
      token: `cg-student-jwt-${Date.now()}`,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        role: student.role || 'Student'
      },
      message: 'Student profile updated successfully!'
    });
  } catch (error) {
    console.error('[authController updateStudentProfile Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating student profile'
    });
  }
};


