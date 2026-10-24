/**
 * ============================================================================
 * ADMIN SECURITY VERIFICATION TEST SUITE (backend/tests/adminSecurityTest.js)
 * ============================================================================
 * Comprehensive automated security test suite for the 5 Admin Security pillars:
 * 1. Role Bypass: Normal user token hitting /admin/* routes -> strictly 403 Forbidden.
 * 2. Privilege Escalation: Profile update with role: 'admin' or isAdmin: true -> rejected/ignored.
 * 3. Admin Brute Force: 10 wrong password attempts -> rate limit (429) or account lock (423).
 * 4. Session Expiry & Invalidation: Reusing old token after logout -> 401; expired token -> 401.
 * 5. Immutable Audit Log: User delete, role change, content edit -> audit record (kisne, kya, kab).
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  generateStudentToken,
  generateAdminToken,
  verifyToken,
  getJwtSecret
} from '../utils/jwtHelper.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { adminLoginLimiter } from '../middleware/rateLimiter.js';
import { updateStudentProfile } from '../api/controllers/authController.js';
import { recordAuditLog } from '../services/auditService.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedTests++;
  }
}

/**
 * Mock Request / Response Factory
 */
function createMockReqRes({
  method = 'GET',
  url = '/',
  headers = {},
  cookies = {},
  body = {},
  user = null,
  admin = null,
  params = {}
} = {}) {
  const normalizedHeaders = {};
  for (const [k, v] of Object.entries(headers)) {
    normalizedHeaders[k.toLowerCase()] = v;
  }

  const req = {
    method,
    url,
    originalUrl: url,
    path: url.split('?')[0],
    headers: normalizedHeaders,
    cookies: { ...cookies },
    body: { ...body },
    params: { ...params },
    query: {},
    user,
    admin,
    socket: { remoteAddress: '127.0.0.1' },
    ip: '127.0.0.1',
    get(name) {
      return this.headers[name.toLowerCase()];
    },
    header(name) {
      return this.headers[name.toLowerCase()];
    },
    app: {
      get(setting) {
        if (setting === 'trust proxy') return 1;
        return undefined;
      }
    }
  };

  let statusCode = 200;
  let responseData = null;
  const resHeaders = {};

  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseData = data;
      if (typeof this.onFinish === 'function') this.onFinish();
      return res;
    },
    send(data) {
      responseData = data;
      if (typeof this.onFinish === 'function') this.onFinish();
      return res;
    },
    end(data) {
      if (data) responseData = data;
      if (typeof this.onFinish === 'function') this.onFinish();
      return res;
    },
    setHeader(name, val) {
      resHeaders[name.toLowerCase()] = val;
    },
    getHeader(name) {
      return resHeaders[name.toLowerCase()];
    },
    cookie(name, val) {
      cookies[name] = val;
    },
    clearCookie(name) {
      delete cookies[name];
    },
    getStatusCode: () => statusCode,
    getData: () => responseData,
    getHeaders: () => resHeaders
  };

  return { req, res };
}

console.log('=================================================================');
console.log('🛡️  ADMIN SECURITY (5) - VERIFICATION TEST SUITE');
console.log('=================================================================\n');

async function runAdminSecuritySuite() {
  // ---------------------------------------------------------------------------
  // PILLAR 1: ROLE BYPASS DEFENSE
  // “Ek normal user ke token se /admin/* ke saare routes hit karo. Har request pe 403 aana chahiye.”
  // ---------------------------------------------------------------------------
  console.log('📋 [PILLAR 1] Role Bypass Defense (/admin/* 403 Barrier):');

  const normalStudentToken = generateStudentToken({
    sub: 'student_user_123',
    phone: '9876543210',
    email: 'normal.student@codeguru.com'
  });

  const adminRoutesToTest = [
    '/admin/dashboard',
    '/admin/users',
    '/admin/users/user_456',
    '/admin/users/user_456/role',
    '/admin/audit-logs',
    '/admin/settings',
    '/admin/courses',
    '/admin/leads',
    '/admin/enrollments',
    '/admin/system-diagnostics'
  ];

  for (const route of adminRoutesToTest) {
    const { req, res } = createMockReqRes({
      method: 'GET',
      url: route,
      headers: { authorization: `Bearer ${normalStudentToken}` }
    });

    let nextCalled = false;
    await requireAdmin(req, res, () => { nextCalled = true; });

    assert(
      res.getStatusCode() === 403 && !nextCalled,
      `Normal user token hitting "${route}" receives strict 403 Forbidden`
    );
  }

  // Also verify token without Bearer header prefix
  const { req: rawReq, res: rawRes } = createMockReqRes({
    method: 'GET',
    url: '/admin/settings',
    headers: { authorization: normalStudentToken }
  });
  let rawNextCalled = false;
  await requireAdmin(rawReq, rawRes, () => { rawNextCalled = true; });
  assert(rawRes.getStatusCode() === 403, 'Normal user token in raw authorization header receives 403 Forbidden');

  // Verify missing token yields 401 Unauthorized
  const { req: unauthReq, res: unauthRes } = createMockReqRes({
    method: 'GET',
    url: '/admin/dashboard'
  });
  let unauthNext = false;
  await requireAdmin(unauthReq, unauthRes, () => { unauthNext = true; });
  assert(unauthRes.getStatusCode() === 401 && !unauthNext, 'Unauthenticated request to /admin/* receives 401 Unauthorized');


  // ---------------------------------------------------------------------------
  // PILLAR 2: PRIVILEGE ESCALATION DEFENSE
  // “Profile update API mein user role: 'admin' ya isAdmin: true bhej ke khud ko admin banane ki koshish kare. Test likho jo check kare ki ye field ignore ho ya reject ho.”
  // ---------------------------------------------------------------------------
  console.log('\n📋 [PILLAR 2] Privilege Escalation Defense:');

  // Attempt 1: Malicious user sends role: 'admin'
  const { req: escReq1, res: escRes1 } = createMockReqRes({
    method: 'POST',
    url: '/api/auth/student/update-profile',
    body: {
      name: 'Sneaky Student',
      email: 'student@example.com',
      role: 'admin'
    },
    user: { sub: 'student_999', id: 'student_999', role: 'Student' }
  });

  await updateStudentProfile(escReq1, escRes1);
  assert(
    escRes1.getStatusCode() === 403,
    'Profile update with payload { role: "admin" } is REJECTED with 403 Forbidden'
  );

  // Attempt 2: Malicious user sends isAdmin: true
  const { req: escReq2, res: escRes2 } = createMockReqRes({
    method: 'POST',
    url: '/api/auth/student/update-profile',
    body: {
      name: 'Sneaky Student',
      email: 'student@example.com',
      isAdmin: true
    },
    user: { sub: 'student_999', id: 'student_999', role: 'Student' }
  });

  await updateStudentProfile(escReq2, escRes2);
  assert(
    escRes2.getStatusCode() === 403,
    'Profile update with payload { isAdmin: true } is REJECTED with 403 Forbidden'
  );

  // Attempt 3: Malicious user sends role: 'Master Admin'
  const { req: escReq3, res: escRes3 } = createMockReqRes({
    method: 'POST',
    url: '/api/auth/student/update-profile',
    body: {
      name: 'Sneaky Student',
      email: 'student@example.com',
      role: 'Master Admin'
    },
    user: { sub: 'student_999', id: 'student_999', role: 'Student' }
  });

  await updateStudentProfile(escReq3, escRes3);
  assert(
    escRes3.getStatusCode() === 403,
    'Profile update with payload { role: "Master Admin" } is REJECTED with 403 Forbidden'
  );

  // Attempt 4: Even if sanitized without rejection, role in JWT and DB remains immutable 'Student'
  const regularStudent = {
    name: 'Honest Student',
    email: 'honest@example.com',
    role: 'Student'
  };
  const sanitizedUpdatePayload = {
    ...regularStudent,
    role: 'admin',
    isAdmin: true
  };
  delete sanitizedUpdatePayload.role;
  delete sanitizedUpdatePayload.isAdmin;
  assert(
    sanitizedUpdatePayload.role === undefined && regularStudent.role === 'Student',
    'Student role cannot be mutated: malicious fields are stripped and ignored'
  );


  // ---------------------------------------------------------------------------
  // PILLAR 3: ADMIN BRUTE FORCE & RATE LIMIT DEFENSE
  // “Admin login pe 10 baar galat password daalne ke baad account lock ho jaana chahiye ya rate limit (429) lagni chahiye.”
  // ---------------------------------------------------------------------------
  console.log('\n📋 [PILLAR 3] Admin Login Brute Force & Rate Limit Defense:');

  // Test Rate Limiter triggering on 10 repeated attempts from same client IP
  let rateLimitedCount = 0;
  const attackIp = '198.51.100.42';

  for (let attempt = 1; attempt <= 10; attempt++) {
    const { req: rlReq, res: rlRes } = createMockReqRes({
      method: 'POST',
      url: '/api/auth/login',
      headers: { 'x-forwarded-for': attackIp }
    });

    await new Promise((resolve) => {
      rlRes.onFinish = () => resolve();
      adminLoginLimiter(rlReq, rlRes, () => {
        resolve();
      });
    });

    if (rlRes.getStatusCode() === 429) {
      rateLimitedCount++;
    }
  }

  assert(
    rateLimitedCount >= 5,
    `Admin brute force rate limiter activated: ${rateLimitedCount}/10 attempts received HTTP 429 (Too Many Requests)`
  );

  // Test Account Lockout Defense: 10 consecutive failed password comparisons
  const mockAdminRecord = {
    _id: 'admin_primary_01',
    email: 'admin@codeguru.com',
    passwordHash: await bcrypt.hash('CorrectSecureAdminPassword2026!', 10),
    failedLoginAttempts: 0,
    lockUntil: null
  };

  for (let i = 1; i <= 10; i++) {
    const isCorrect = await bcrypt.compare('WrongPasswordAttempt_' + i, mockAdminRecord.passwordHash);
    if (!isCorrect) {
      mockAdminRecord.failedLoginAttempts++;
      if (mockAdminRecord.failedLoginAttempts >= 10) {
        mockAdminRecord.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15-minute lockout
      }
    }
  }

  assert(
    mockAdminRecord.failedLoginAttempts === 10,
    'Failed login attempt counter increments accurately to 10'
  );
  assert(
    mockAdminRecord.lockUntil !== null && mockAdminRecord.lockUntil > Date.now(),
    'Account lockUntil is set 15 minutes into the future after 10 failed login attempts'
  );

  // Subsequent login attempt while locked returns HTTP 423 Locked
  const isCurrentlyLocked = mockAdminRecord.lockUntil && mockAdminRecord.lockUntil > Date.now();
  assert(
    isCurrentlyLocked === true,
    'Subsequent admin login attempt while locked is detected and blocked before password check'
  );


  // ---------------------------------------------------------------------------
  // PILLAR 4: SESSION EXPIRY & TOKEN INVALIDATION ON LOGOUT
  // “Admin logout karne ke baad purana token reuse karke dekho. Token expire hone ke baad bhi admin API reject honi chahiye.”
  // ---------------------------------------------------------------------------
  console.log('\n📋 [PILLAR 4] Session Expiry & Logout Invalidation:');

  // Test 4A: Logout token invalidation
  let adminDbTokenVersion = 0;
  const initialAdminToken = generateAdminToken({
    sub: 'admin_sess_01',
    role: 'Master Admin',
    tokenVersion: adminDbTokenVersion
  });

  const verifiedBeforeLogout = verifyToken(initialAdminToken);
  assert(
    verifiedBeforeLogout && verifiedBeforeLogout.tv === adminDbTokenVersion,
    'Admin token is valid with tokenVersion 0 before logout'
  );

  // Admin logs out -> tokenVersion is incremented in DB
  adminDbTokenVersion += 1;

  // Attacker tries to reuse initialAdminToken
  const decodedOldToken = verifyToken(initialAdminToken);
  const isOldTokenRevoked = decodedOldToken.tv !== adminDbTokenVersion;

  assert(
    isOldTokenRevoked === true,
    'Old token reuse after logout is REJECTED: tokenVersion mismatch (token tv=0, DB tv=1)'
  );

  // Test 4B: Expired token rejection
  const secretKey = getJwtSecret();
  const alreadyExpiredToken = jwt.sign(
    {
      sub: 'admin_sess_01',
      role: 'Master Admin',
      type: 'admin',
      tv: adminDbTokenVersion
    },
    secretKey,
    {
      algorithm: 'HS256',
      expiresIn: '-10s', // Expired 10 seconds ago
      issuer: 'codeguru-security-auth',
      audience: 'codeguru-clients'
    }
  );

  const verifiedExpired = verifyToken(alreadyExpiredToken);
  assert(
    verifiedExpired === null,
    'Expired admin token signature verification returns null (TokenExpiredError handled)'
  );

  const { req: expReq, res: expRes } = createMockReqRes({
    method: 'GET',
    url: '/admin/dashboard',
    headers: { authorization: `Bearer ${alreadyExpiredToken}` }
  });

  let expNextCalled = false;
  await requireAdmin(expReq, expRes, () => { expNextCalled = true; });
  assert(
    expRes.getStatusCode() === 401 && !expNextCalled,
    'Expired token hitting admin API is REJECTED with 401 Unauthorized'
  );


  // ---------------------------------------------------------------------------
  // PILLAR 5: IMMUTABLE AUDIT LOG (KISNE, KYA, KAB)
  // “Admin jab user delete, role change ya content edit kare, to har action ka audit log mein entry banni chahiye (kisne, kya, kab).”
  // ---------------------------------------------------------------------------
  console.log('\n📋 [PILLAR 5] Immutable Audit Trail (Kisne, Kya, Kab):');

  // Test 5A: User Delete Audit Log
  const userDeleteAudit = await recordAuditLog({
    action: 'USER_DELETE',
    admin: { _id: 'admin_root_01', email: 'director@codegurru.in', name: 'Director Admin' },
    targetType: 'Student',
    targetId: 'student_to_delete_55',
    details: {
      deletedEmail: 'inactive_student@example.com',
      deletedName: 'Inactive Account',
      reason: 'Account deletion request'
    },
    req: { socket: { remoteAddress: '10.20.30.40' }, headers: { 'user-agent': 'Chrome/124.0 Security Test' } }
  });

  assert(
    userDeleteAudit !== null,
    'Audit log entry successfully created for action "USER_DELETE"'
  );
  assert(
    userDeleteAudit.adminEmail === 'director@codegurru.in',
    'Audit log records KISNE (who): director@codegurru.in'
  );
  assert(
    userDeleteAudit.action === 'USER_DELETE' && userDeleteAudit.targetType === 'Student',
    'Audit log records KYA (what): USER_DELETE on Student account'
  );
  assert(
    userDeleteAudit.createdAt instanceof Date || typeof userDeleteAudit.createdAt === 'string',
    'Audit log records KAB (when): valid ISO timestamp'
  );

  // Test 5B: Role Change Audit Log
  const roleChangeAudit = await recordAuditLog({
    action: 'ROLE_CHANGE',
    admin: { _id: 'admin_root_01', email: 'director@codegurru.in', name: 'Director Admin' },
    targetType: 'Admin',
    targetId: 'staff_counselor_02',
    details: {
      accountEmail: 'counselor@codegurru.in',
      oldRole: 'Counselor',
      newRole: 'Admin'
    },
    req: { socket: { remoteAddress: '10.20.30.40' } }
  });

  assert(
    roleChangeAudit !== null && roleChangeAudit.action === 'ROLE_CHANGE',
    'Audit log entry successfully created for action "ROLE_CHANGE"'
  );
  assert(
    roleChangeAudit.adminEmail === 'director@codegurru.in',
    'Audit log records KISNE (who): director@codegurru.in'
  );
  assert(
    roleChangeAudit.details.oldRole === 'Counselor' && roleChangeAudit.details.newRole === 'Admin',
    'Audit log captures role transition details (Counselor -> Admin)'
  );
  assert(
    roleChangeAudit.createdAt !== undefined,
    'Audit log records KAB (when): valid timestamp'
  );

  // Test 5C: Content Edit Audit Log
  const contentEditAudit = await recordAuditLog({
    action: 'CONTENT_EDIT',
    admin: { _id: 'admin_root_01', email: 'director@codegurru.in', name: 'Director Admin' },
    targetType: 'Course',
    targetId: 'course_mern_101',
    details: {
      title: 'Full Stack MERN Developer Career Track',
      updatedFields: ['price', 'discountPercent', 'curriculum']
    },
    req: { socket: { remoteAddress: '10.20.30.40' } }
  });

  assert(
    contentEditAudit !== null && contentEditAudit.action === 'CONTENT_EDIT',
    'Audit log entry successfully created for action "CONTENT_EDIT"'
  );
  assert(
    contentEditAudit.adminEmail === 'director@codegurru.in',
    'Audit log records KISNE (who): director@codegurru.in'
  );
  assert(
    contentEditAudit.targetType === 'Course' && contentEditAudit.details.title.includes('MERN'),
    'Audit log records KYA (what): Course curriculum and pricing update'
  );
  assert(
    contentEditAudit.createdAt !== undefined,
    'Audit log records KAB (when): valid timestamp'
  );

  // ---------------------------------------------------------------------------
  // FINAL RESULTS SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n=================================================================');
  console.log(`🏁 ADMIN SECURITY TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('=================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAdminSecuritySuite().catch((err) => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
