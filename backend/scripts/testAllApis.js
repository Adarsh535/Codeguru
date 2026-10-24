/**
 * ============================================================================
 * FULL BACKEND REST API END-TO-END DIAGNOSTIC TEST (testAllApis.js)
 * ============================================================================
 * Tests all key REST API endpoints on http://127.0.0.1:5000:
 * - Public data APIs (Courses, Categories, Banners, Ads, Placements, Team, Branches, Menus)
 * - Lead inquiry generation
 * - Student Authentication (Registration, Login, Profile)
 * - Code & Assignment Submissions
 * - Code Execution Sandbox Runner
 * - Security & Health Check
 */

const BASE_URL = 'http://127.0.0.1:5000';

const results = [];

async function testEndpoint({ name, method = 'GET', path, headers = {}, body = null, expectedStatus = 200 }) {
  const startTime = Date.now();
  const url = `${BASE_URL}${path}`;

  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    if (body) {
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const res = await fetch(url, options);
    const latency = Date.now() - startTime;
    let data = null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    const isMatch = Array.isArray(expectedStatus)
      ? expectedStatus.includes(res.status)
      : res.status === expectedStatus;

    const result = {
      name,
      method,
      path,
      status: res.status,
      expectedStatus,
      latencyMs: latency,
      passed: isMatch,
      response: data
    };

    results.push(result);

    if (isMatch) {
      console.log(`  ✅ [${res.status}] ${method} ${path} (${latency}ms) - ${name}`);
    } else {
      console.error(`  ❌ [${res.status} != ${expectedStatus}] ${method} ${path} (${latency}ms) - ${name}`);
    }

    return result;
  } catch (err) {
    const latency = Date.now() - startTime;
    console.error(`  ❌ [ERROR] ${method} ${path} (${latency}ms) - ${name}: ${err.message}`);
    const result = {
      name,
      method,
      path,
      status: 'CONN_ERR',
      expectedStatus,
      latencyMs: latency,
      passed: false,
      error: err.message
    };
    results.push(result);
    return result;
  }
}

async function runAllApiTests() {
  console.log('=================================================================');
  console.log('🚀 CODEGURU REST API BACKEND - LIVE END-TO-END DIAGNOSTIC TEST');
  console.log(`🎯 Target Base URL: ${BASE_URL}`);
  console.log('=================================================================\n');

  // 1. Health & Security Tokens
  console.log('📌 [GROUP 1] Health & System Integrity:');
  await testEndpoint({
    name: 'Health Check & DB Atlas Status',
    method: 'GET',
    path: '/api/health',
    expectedStatus: 200
  });

  const csrfResult = await testEndpoint({
    name: 'Get Anti-CSRF Token',
    method: 'GET',
    path: '/api/auth/csrf-token',
    expectedStatus: 200
  });

  // 2. Public Catalog & CMS APIs
  console.log('\n📌 [GROUP 2] Public Courses, Banners & CMS Data:');
  await testEndpoint({
    name: 'Get All Courses Catalog',
    method: 'GET',
    path: '/api/courses',
    expectedStatus: 200
  });

  await testEndpoint({
    name: 'Search Courses (Safe String Filter)',
    method: 'GET',
    path: '/api/courses?search=Full+Stack',
    expectedStatus: 200
  });

  await testEndpoint({
    name: 'Get Categories List',
    method: 'GET',
    path: '/api/categories',
    expectedStatus: 200
  });

  await testEndpoint({
    name: 'Get Banners List',
    method: 'GET',
    path: '/api/banners',
    expectedStatus: 200
  });

  await testEndpoint({
    name: 'Get Advertisements List',
    method: 'GET',
    path: '/api/ads',
    expectedStatus: 200
  });

  await testEndpoint({
    name: 'Get Placements List',
    method: 'GET',
    path: '/api/placements',
    expectedStatus: 200
  });

  await testEndpoint({
    name: 'Get Team / Instructors List',
    method: 'GET',
    path: '/api/team',
    expectedStatus: 200
  });

  await testEndpoint({
    name: 'Get Branch Locations',
    method: 'GET',
    path: '/api/branches',
    expectedStatus: 200
  });

  await testEndpoint({
    name: 'Get Navigation Menus',
    method: 'GET',
    path: '/api/navmenus',
    expectedStatus: 200
  });

  // 3. Lead Generation Form
  console.log('\n📌 [GROUP 3] Inquiry Leads & CRM Generation:');
  const leadTimestamp = Date.now();
  await testEndpoint({
    name: 'Submit Public Inquiry Lead',
    method: 'POST',
    path: '/api/leads',
    body: {
      name: 'Rohan Sharma',
      phone: '9' + Math.floor(100000000 + Math.random() * 900000000),
      email: `rohan_${leadTimestamp}@gmail.com`,
      course: 'MERN Full Stack Development',
      branch: 'Ayodhya',
      source: 'Website Live Test'
    },
    expectedStatus: 201
  });

  // 4. Student Authentication Lifecycle
  console.log('\n📌 [GROUP 4] Student Authentication Lifecycle:');
  const studentEmail = `student_${Date.now()}@codeguru.test`;
  const studentPassword = 'Password123!';
  const studentPhone = '9' + Math.floor(100000000 + Math.random() * 900000000);

  const regRes = await testEndpoint({
    name: 'Student Registration',
    method: 'POST',
    path: '/api/auth/student/register',
    body: {
      name: 'Priya Verma',
      email: studentEmail,
      password: studentPassword,
      phone: studentPhone
    },
    expectedStatus: 201
  });

  let studentToken = regRes.response?.token || '';
  let studentId = regRes.response?.student?.id || '';

  const loginRes = await testEndpoint({
    name: 'Student Login (Email + Password)',
    method: 'POST',
    path: '/api/auth/student/login',
    body: {
      email: studentEmail,
      password: studentPassword
    },
    expectedStatus: 200
  });

  if (!studentToken) {
    studentToken = loginRes.response?.token || '';
    studentId = loginRes.response?.student?.id || studentId;
  }

  // 5. Authenticated Protected APIs (IDOR Safe)
  console.log('\n📌 [GROUP 5] Authenticated User & Submissions APIs:');
  const authHeaders = studentToken ? { Authorization: `Bearer ${studentToken}` } : {};

  if (studentId && studentToken) {
    await testEndpoint({
      name: 'Get Own User Profile (IDOR Guarded)',
      method: 'GET',
      path: `/api/users/${studentId}`,
      headers: authHeaders,
      expectedStatus: 200
    });

    const subRes = await testEndpoint({
      name: 'Create Code Submission',
      method: 'POST',
      path: '/api/submissions',
      headers: authHeaders,
      body: {
        language: 'javascript',
        code: 'console.log("Two sum solution by Priya");',
        assignmentId: 'ASSIGN-LEETCODE-01'
      },
      expectedStatus: 201
    });

    const submissionId = subRes.response?.data?._id || subRes.response?.data?.id;
    if (submissionId) {
      await testEndpoint({
        name: 'Get Code Submission Details',
        method: 'GET',
        path: `/api/submissions/${submissionId}`,
        headers: authHeaders,
        expectedStatus: 200
      });
    }

    await testEndpoint({
      name: 'Get Student Enrollments',
      method: 'GET',
      path: '/api/enrollments',
      headers: authHeaders,
      expectedStatus: 200
    });
  } else {
    console.warn('  ⚠️ Skipping authenticated tests: student token not acquired');
  }

  // 6. Code Execution Sandbox API
  console.log('\n📌 [GROUP 6] Code Execution Sandbox Engine:');
  await testEndpoint({
    name: 'Execute Safe JavaScript in Sandbox',
    method: 'POST',
    path: '/api/code/run',
    body: {
      language: 'javascript',
      code: 'const nums = [1, 2, 3, 4, 5]; console.log("Sum:", nums.reduce((a, b) => a + b, 0));'
    },
    expectedStatus: 200
  });

  await testEndpoint({
    name: 'Sandbox Blocks Malicious System Command (rm -rf)',
    method: 'POST',
    path: '/api/code/run',
    body: {
      language: 'python',
      code: "import os; os.system('rm -rf /')"
    },
    expectedStatus: 403
  });

  // 7. Logout & Session Termination
  console.log('\n📌 [GROUP 7] Logout & Cookie Invalidation:');
  await testEndpoint({
    name: 'User Logout',
    method: 'POST',
    path: '/api/auth/logout',
    expectedStatus: 200
  });

  // Final Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log('\n=================================================================');
  console.log(`🏁 API TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (Total: ${results.length})`);
  console.log('=================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllApiTests().catch(err => {
  console.error('Fatal API Test Error:', err);
  process.exit(1);
});
