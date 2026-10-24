/**
 * ============================================================================
 * CONTROLLER: ADMIN MANAGEMENT & AUDIT LOGS (adminController.js)
 * ============================================================================
 * Protected administration controller for:
 * - Admin overview & statistics
 * - Administrative user management (view, delete, role assignment)
 * - Immutable system audit logs stream (kisne, kya, kab)
 */

import { Admin } from '../../models/Admin.js';
import { Student } from '../../models/Student.js';
import { Lead } from '../../models/Lead.js';
import { Course } from '../../models/Course.js';
import { Enrollment } from '../../models/Enrollment.js';
import { AuditLog } from '../../models/AuditLog.js';
import { recordAuditLog } from '../../services/auditService.js';

/**
 * @route   GET /admin/dashboard or /api/admin/dashboard
 * @desc    Get dashboard metrics & telemetry overview
 * @access  Admin Private (requires requireAdmin)
 */
export const getAdminDashboardStats = async (req, res) => {
  try {
    const [totalStudents, totalAdmins, totalLeads, totalCourses, totalEnrollments] = await Promise.all([
      Student.countDocuments().catch(() => 0),
      Admin.countDocuments().catch(() => 0),
      Lead.countDocuments().catch(() => 0),
      Course.countDocuments().catch(() => 0),
      Enrollment.countDocuments().catch(() => 0)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalAdmins,
        totalLeads,
        totalCourses,
        totalEnrollments,
        serverTime: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[adminController getAdminDashboardStats Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard metrics' });
  }
};

/**
 * @route   GET /admin/users or /api/admin/users
 * @desc    Retrieve all system user accounts (Staff admins & registered students)
 * @access  Admin Private (requires requireAdmin)
 */
export const getAdminUsers = async (req, res) => {
  try {
    const [admins, students] = await Promise.all([
      Admin.find({}, 'name email role isActive createdAt').lean(),
      Student.find({}, 'name email phone role createdAt').lean()
    ]);

    const users = [
      ...admins.map(a => ({ ...a, userType: 'admin' })),
      ...students.map(s => ({ ...s, userType: 'student' }))
    ];

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('[adminController getAdminUsers Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve user accounts' });
  }
};

/**
 * @route   DELETE /admin/users/:id or /api/admin/users/:id
 * @desc    Delete a user account and record immutable audit log (kisne, kya, kab)
 * @access  Admin Private (requires requireAdmin)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Attempt deletion from Student collection first
    let user = await Student.findByIdAndDelete(id);
    let targetType = 'Student';

    // If not found in Student, attempt deletion from Admin (prevent self-deletion)
    if (!user) {
      const adminCandidate = await Admin.findById(id);
      if (adminCandidate) {
        if (adminCandidate._id.toString() === req.admin._id.toString()) {
          return res.status(400).json({
            success: false,
            message: 'Cannot delete your own active administrator account'
          });
        }
        user = await Admin.findByIdAndDelete(id);
        targetType = 'Admin';
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    // Record Audit Log: Who (kisne), What (kya), When (kab)
    const auditEntry = await recordAuditLog({
      action: 'USER_DELETE',
      admin: req.admin,
      targetType,
      targetId: id,
      details: {
        deletedUserId: id,
        deletedEmail: user.email,
        deletedName: user.name,
        targetRole: user.role
      },
      req
    });

    return res.status(200).json({
      success: true,
      message: `${targetType} user account deleted successfully`,
      auditLogId: auditEntry?._id
    });
  } catch (error) {
    console.error('[adminController deleteUser Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete user account' });
  }
};

/**
 * @route   PUT /admin/users/:id/role or /api/admin/users/:id/role
 * @desc    Change a user's role and record immutable audit log (kisne, kya, kab)
 * @access  Admin Private (requires requireAdmin)
 */
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body || {};

    const validRoles = ['Master Admin', 'Admin', 'Counselor', 'Student'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role specified. Allowed roles: ${validRoles.join(', ')}`
      });
    }

    // Try finding Admin account
    let account = await Admin.findById(id);
    let targetType = 'Admin';

    if (account) {
      const oldRole = account.role;
      account.role = role;
      // Invalidate the target admin's existing sessions so a role change
      // (e.g. demotion) takes effect immediately instead of after token expiry.
      if (oldRole !== role) {
        account.tokenVersion = (account.tokenVersion || 0) + 1;
      }
      await account.save();

      // Record Audit Log: Who (kisne), What (kya), When (kab)
      const auditEntry = await recordAuditLog({
        action: 'ROLE_CHANGE',
        admin: req.admin,
        targetType: 'Admin',
        targetId: id,
        details: {
          accountEmail: account.email,
          oldRole,
          newRole: role
        },
        req
      });

      return res.status(200).json({
        success: true,
        message: `Admin role updated to ${role}`,
        data: { id: account._id, email: account.email, role: account.role },
        auditLogId: auditEntry?._id
      });
    }

    // Try finding Student account
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    const oldRole = student.role;
    // Allow admin to update student's role directly
    student.set('role', role);
    await student.save();

    // Record Audit Log: Who (kisne), What (kya), When (kab)
    const auditEntry = await recordAuditLog({
      action: 'ROLE_CHANGE',
      admin: req.admin,
      targetType: 'Student',
      targetId: id,
      details: {
        accountEmail: student.email,
        oldRole,
        newRole: role
      },
      req
    });

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: { id: student._id, email: student.email, role: student.role },
      auditLogId: auditEntry?._id
    });
  } catch (error) {
    console.error('[adminController updateUserRole Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update user role' });
  }
};

/**
 * @route   GET /admin/audit-logs or /api/admin/audit-logs
 * @desc    Retrieve immutable system action audit log stream
 * @access  Admin Private (requires requireAdmin)
 */
export const getAuditLogs = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
    const filter = {};

    if (req.query.action) {
      filter.action = req.query.action;
    }
    if (req.query.targetType) {
      filter.targetType = req.query.targetType;
    }

    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('[adminController getAuditLogs Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve audit logs' });
  }
};
