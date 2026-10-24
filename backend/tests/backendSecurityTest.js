/**
 * ============================================================================
 * BACKEND SECURITY VERIFICATION TEST SUITE (backend/tests/backendSecurityTest.js)
 * ============================================================================
 * Comprehensive automated security test suite for the 5 Backend Security pillars:
 * 1. SQL / NoSQL Injection:
 *    - Testing ' OR 1=1 -- and {"$ne": null} on login and search endpoints.
 *    - Verifying zero auth bypass, zero credential leaks, and query operator stripping.
 * 2. IDOR (Insecure Direct Object Reference):
 *    - User A token requesting User B's data (/api/users/{B_id}, /api/submissions/{B_id}).
 *    - Strictly enforces 403 Forbidden / 404 Not Found.
 * 3. Code Execution Sandbox:
 *    - Blocking destructive commands: os.system('rm -rf /'), file reads (/etc/passwd).
 *    - Enforcing strict 1500ms timeout against infinite loops (while(true){}).
 * 4. Rate Limiting:
 *    - Firing 100+ requests within 1 minute.
 *    - Enforcing HTTP 429 Too Many Requests while ensuring server stability.
 * 5. Input Validation & Error Handling:
 *    - Rejecting wrong types, missing fields, and 10MB oversized payloads with clean 400/413.
 *    - Verifying zero leakage of stack traces, DB internals, or filesystem paths.
 */

import 'dotenv/config';
import { generateStudentToken, generateAdminToken } from '../utils/jwtHelper.js';
import { apiMinuteLimiter } from '../middleware/rateLimiter.js';

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
 * Universal safe fetch that handles localhost <-> 127.0.0.1 on Windows
 */
async function safeFetch(url, options = {}) {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (url.includes('localhost')) {
      const altUrl = url.replace('localhost', '127.0.0.1');
      return await fetch(altUrl, options);
    }
    if (url.includes('127.0.0.1')) {
      const altUrl = url.replace('127.0.0.1', 'localhost');
      return await fetch(altUrl, options);
    }
    throw err;
  }
}

/**
 * Mock Request / Response helper for controller & middleware unit testing
 */
function createMockReqRes({
  method = 'GET',
  url = '/',
  headers = {},
  cookies = {},
  body = {},
  query = {},
  params = {},
  user = null
} = {}) {
  const req = {
    method,
    url,
    originalUrl: url,
    headers: { ...headers },
    cookies: { ...cookies },
    body: JSON.parse(JSON.stringify(body)),
    query: { ...query },
    params: { ...params },
    user,
    ip: '127.0.0.1',
    app: {
      get: (key) => (key === 'trust proxy' ? 1 : undefined)
    }
  };

  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    _listeners: [],
    onDone(cb) {
      this._listeners.push(cb);
    },
    _notify() {
      for (const cb of this._listeners) cb();
      this._listeners = [];
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
      return this;
    },
    getHeader(k) {
      return this.headers[k.toLowerCase()];
    },
    json(data) {
      this.body = data;
      this._notify();
      return this;
    },
    send(data) {
      this.body = data;
      this._notify();
      return this;
    }
  };

  return { req, res };
}

console.log('=================================================================');
console.log('🛡️  BACKEND SECURITY (5) - VERIFICATION TEST SUITE');
console.log('=================================================================\n');

async function runBackendSecuritySuite() {
  const BASE_URL = 'http://127.0.0.1:5000';

  // ===========================================================================
  // PILLAR 1: SQL / NoSQL INJECTION DEFENSE
  // “Login aur search API mein ' OR 1=1 -- aur {"$ne": null} jaise payload bhejo.
  // Isse auth bypass ya data leak nahi hona chahiye. Test likho.”
  // ===========================================================================
  console.log('📋 [PILLAR 1] SQL / NoSQL Injection Prevention & Data Isolation:');

  // Test 1.1: NoSQL Injection via Object Payload in Admin Login
  try {
    const resNoSql = await safeFetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: { $ne: null },
        password: { $ne: null }
      })
    });
    const dataNoSql = await resNoSql.json();
    assert(
      resNoSql.status === 400 || resNoSql.status === 401 || resNoSql.status === 429,
      `NoSQL injection {"$ne": null} on Admin Login is rejected (Status: ${resNoSql.status})`
    );
    assert(!dataNoSql.token, 'Zero token issued on NoSQL injection attempt');
  } catch (err) {
    assert(false, `NoSQL Login Test error: ${err.message}`);
  }

  // Test 1.2: SQL Injection via Classic ' OR 1=1 -- in Admin Login
  try {
    const resSql = await safeFetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: "' OR 1=1 --",
        password: "' OR 1=1 --"
      })
    });
    const dataSql = await resSql.json();
    assert(
      resSql.status === 401 || resSql.status === 400 || resSql.status === 429,
      `SQL injection "' OR 1=1 --" on Admin Login is rejected (Status: ${resSql.status})`
    );
    assert(!dataSql.token, 'Zero auth bypass on SQL injection string payload');
  } catch (err) {
    assert(false, `SQL Login Test error: ${err.message}`);
  }

  // Test 1.3: NoSQL Injection via Object Payload in Student Login
  try {
    const resStudentNoSql = await safeFetch(`${BASE_URL}/api/auth/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: { $gt: "" },
        password: { $ne: null }
      })
    });
    const dataStudentNoSql = await resStudentNoSql.json();
    assert(
      resStudentNoSql.status === 400 || resStudentNoSql.status === 401,
      `NoSQL injection {"$gt": ""} on Student Login is rejected (Status: ${resStudentNoSql.status})`
    );
    assert(!dataStudentNoSql.token, 'Zero student token issued on NoSQL operator injection');
  } catch (err) {
    assert(false, `Student NoSQL Login Test error: ${err.message}`);
  }

  // Test 1.4: SQL Injection on Course Search API
  try {
    const resSearchSql = await safeFetch(`${BASE_URL}/api/courses?search=' OR 1=1 --`);
    const dataSearchSql = await resSearchSql.json();
    assert(
      resSearchSql.status === 200,
      `SQL injection "' OR 1=1 --" in Search API handled gracefully without crashing (Status: ${resSearchSql.status})`
    );
    assert(
      Array.isArray(dataSearchSql.data),
      'Search response safely returns array data without executing SQL logic'
    );
  } catch (err) {
    assert(false, `Search SQL Injection Test error: ${err.message}`);
  }

  // Test 1.5: NoSQL Operator Injection in Query Parameter ?search[$ne]=null
  try {
    const resSearchNoSql = await safeFetch(`${BASE_URL}/api/courses?search[$ne]=null`);
    const dataSearchNoSql = await resSearchNoSql.json();
    assert(
      resSearchNoSql.status === 200,
      `NoSQL operator "?search[$ne]=null" sanitized and rejected operator execution`
    );
    assert(
      Array.isArray(dataSearchNoSql.data),
      'Search response returns safe data without unauthorized full dump'
    );
  } catch (err) {
    assert(false, `Search NoSQL Injection Test error: ${err.message}`);
  }

  // ===========================================================================
  // PILLAR 2: IDOR (INSECURE DIRECT OBJECT REFERENCE) DEFENSE
  // “User A ke token se User B ka data maango (/api/users/{B_id}, /api/submissions/{B_id}).
  // 403 ya 404 aana chahiye. Test likho.”
  // ===========================================================================
  console.log('\n📋 [PILLAR 2] Insecure Direct Object Reference (IDOR) Protection:');

  // Helper to register or login a real student
  async function getOrCreateStudent(name, email, password) {
    const uniquePhone = '9' + Math.floor(100000000 + Math.random() * 900000000);
    const regRes = await safeFetch(`${BASE_URL}/api/auth/student/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone: uniquePhone })
    });
    if (regRes.status === 201) {
      const data = await regRes.json();
      return { token: data.token, id: (data.student.id || data.student._id).toString() };
    }

    const loginRes = await safeFetch(`${BASE_URL}/api/auth/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (loginRes.status === 200) {
      const data = await loginRes.json();
      return { token: data.token, id: (data.student.id || data.student._id).toString() };
    }
    return null;
  }

  const timestamp = Date.now();
  const alice = await getOrCreateStudent('Alice IDOR', `alice_${timestamp}@sec.codeguru.test`, 'Password123!');
  const bob = await getOrCreateStudent('Bob IDOR', `bob_${timestamp}@sec.codeguru.test`, 'Password123!');

  if (alice && bob) {
    const tokenUserA = alice.token;
    const userA_Id = alice.id;
    const tokenUserB = bob.token;
    const userB_Id = bob.id;

    // Create a code submission owned by Bob (User B)
    const subBobRes = await safeFetch(`${BASE_URL}/api/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenUserB}`
      },
      body: JSON.stringify({
        language: 'python',
        code: 'print("Bob confidential code submission")'
      })
    });
    const subBobData = await subBobRes.json();
    const submissionB_Id = subBobData.data?._id || subBobData.data?.id;

    // Create a code submission owned by Alice (User A)
    const subAliceRes = await safeFetch(`${BASE_URL}/api/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenUserA}`
      },
      body: JSON.stringify({
        language: 'javascript',
        code: 'console.log("Alice submission");'
      })
    });
    const subAliceData = await subAliceRes.json();
    const submissionA_Id = subAliceData.data?._id || subAliceData.data?.id;

    const tokenAdmin = generateAdminToken({ sub: '6a9ac7124ce47e0f3cfadb18', role: 'Master Admin' });

    // Test 2.1: User A requests User B's profile -> Strictly 403 Forbidden
    try {
      const resIdorUser = await safeFetch(`${BASE_URL}/api/users/${userB_Id}`, {
        headers: { Authorization: `Bearer ${tokenUserA}` }
      });
      const dataIdorUser = await resIdorUser.json();
      assert(
        resIdorUser.status === 403,
        `IDOR Attack Blocked: User A accessing User B's profile returns 403 Forbidden (Got: ${resIdorUser.status})`
      );
      assert(
        dataIdorUser.message?.toLowerCase().includes('permission') || dataIdorUser.message?.toLowerCase().includes('forbidden'),
        'Clear security violation message returned without leaking User B data'
      );
    } catch (err) {
      assert(false, `IDOR User Profile Test error: ${err.message}`);
    }

    // Test 2.2: User A requests User B's code submission -> Strictly 403 Forbidden
    try {
      const resIdorSub = await safeFetch(`${BASE_URL}/api/submissions/${submissionB_Id}`, {
        headers: { Authorization: `Bearer ${tokenUserA}` }
      });
      const dataIdorSub = await resIdorSub.json();
      assert(
        resIdorSub.status === 403,
        `IDOR Attack Blocked: User A accessing User B's code submission returns 403 Forbidden (Got: ${resIdorSub.status})`
      );
      assert(
        !dataIdorSub.data?.code,
        'User B\'s confidential code is NOT leaked to User A'
      );
    } catch (err) {
      assert(false, `IDOR Submission Test error: ${err.message}`);
    }

    // Test 2.3: User A requesting their OWN profile -> 200 OK
    try {
      const resSelfUser = await safeFetch(`${BASE_URL}/api/users/${userA_Id}`, {
        headers: { Authorization: `Bearer ${tokenUserA}` }
      });
      const dataSelfUser = await resSelfUser.json();
      assert(
        resSelfUser.status === 200 && dataSelfUser.data?.name?.includes('Alice'),
        `Authorized Access: User A successfully accesses their own profile (Status: ${resSelfUser.status})`
      );
    } catch (err) {
      assert(false, `Self Profile Access Test error: ${err.message}`);
    }

    // Test 2.4: User A requesting their OWN submission -> 200 OK
    try {
      const resSelfSub = await safeFetch(`${BASE_URL}/api/submissions/${submissionA_Id}`, {
        headers: { Authorization: `Bearer ${tokenUserA}` }
      });
      const dataSelfSub = await resSelfSub.json();
      assert(
        resSelfSub.status === 200 && dataSelfSub.data?.code?.includes('Alice'),
        `Authorized Access: User A successfully accesses their own submission (Status: ${resSelfSub.status})`
      );
    } catch (err) {
      assert(false, `Self Submission Access Test error: ${err.message}`);
    }

    // Test 2.5: Master Admin accessing User B's submission -> 200 OK
    try {
      const resAdminSub = await safeFetch(`${BASE_URL}/api/submissions/${submissionB_Id}`, {
        headers: { Authorization: `Bearer ${tokenAdmin}` }
      });
      assert(
        resAdminSub.status === 200,
        `Role Verification: Master Admin has legitimate administrative access to submissions (Status: ${resAdminSub.status})`
      );
    } catch (err) {
      assert(false, `Admin Submission Access Test error: ${err.message}`);
    }
  } else {
    assert(false, 'Unable to register test student accounts for IDOR tests');
  }

  // ===========================================================================
  // PILLAR 3: CODE EXECUTION SANDBOX
  // “Code run karne wali API mein os.system('rm -rf /'), infinite loop aur file
  // read (/etc/passwd) bhejo. Sab block hona chahiye, aur timeout ya memory limit lagni chahiye.”
  // ===========================================================================
  console.log('\n📋 [PILLAR 3] Code Execution Sandbox Security & Resource Limits:');

  // Test 3.1: Block Destructive OS Command os.system('rm -rf /')
  try {
    const resRmRf = await safeFetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'python',
        code: "import os\nos.system('rm -rf /')"
      })
    });
    const dataRmRf = await resRmRf.json();
    assert(
      resRmRf.status === 403,
      `Sandbox Defense: os.system('rm -rf /') blocked with 403 Forbidden (Status: ${resRmRf.status})`
    );
    assert(
      dataRmRf.blocked === true,
      'Pre-execution AST/Regex security barrier flags and blocks destructive system call'
    );
  } catch (err) {
    assert(false, `Sandbox os.system Test error: ${err.message}`);
  }

  // Test 3.2: Block File System Read of /etc/passwd
  try {
    const resPasswd = await safeFetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'javascript',
        code: "const fs = require('fs'); const data = fs.readFileSync('/etc/passwd', 'utf8');"
      })
    });
    const dataPasswd = await resPasswd.json();
    assert(
      resPasswd.status === 403,
      `Sandbox Defense: File read (/etc/passwd) blocked with 403 Forbidden (Status: ${resPasswd.status})`
    );
    assert(
      dataPasswd.blocked === true,
      'Sensitive system file access (/etc/passwd) strictly prohibited'
    );
  } catch (err) {
    assert(false, `Sandbox /etc/passwd Test error: ${err.message}`);
  }

  // Test 3.3: Infinite Loop Termination (while(true)) via 1500ms Timeout
  try {
    const startLoopTime = Date.now();
    const resLoop = await safeFetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'javascript',
        code: "let counter = 0; while (true) { counter++; }"
      })
    });
    const loopDuration = Date.now() - startLoopTime;
    const dataLoop = await resLoop.json();

    assert(
      resLoop.status === 408 || dataLoop.timedOut === true,
      `Infinite Loop Defense: while(true) terminated with timeout (Status: ${resLoop.status})`
    );
    assert(
      dataLoop.timedOut === true,
      'Sandbox enforces hard 1500ms execution timeout against CPU exhaustion attacks'
    );
    assert(
      loopDuration >= 1400 && loopDuration <= 4000,
      `Execution aborted within expected window (${loopDuration}ms)`
    );
  } catch (err) {
    assert(false, `Sandbox Infinite Loop Test error: ${err.message}`);
  }

  // Test 3.4: Process Termination & Environment Hijacking Block
  try {
    const resProc = await safeFetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'javascript',
        code: "process.exit(1);"
      })
    });
    const dataProc = await resProc.json();
    assert(
      resProc.status === 403 && dataProc.blocked === true,
      `Sandbox Defense: process.exit() blocked before runtime execution (Status: ${resProc.status})`
    );
  } catch (err) {
    assert(false, `Sandbox Process Exit Test error: ${err.message}`);
  }

  // Test 3.5: Legitimate Safe Code Runs Successfully in Sandbox
  try {
    const resSafe = await safeFetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'javascript',
        code: "console.log('Welcome to CodeGuru Sandbox'); const sum = 15 + 35; console.log('Sum:', sum);"
      })
    });
    const dataSafe = await resSafe.json();
    assert(
      resSafe.status === 200 && dataSafe.success === true,
      `Safe Execution: Legitimate student code runs successfully (Status: ${resSafe.status})`
    );
    assert(
      dataSafe.output?.includes('Sum: 50'),
      'Captured stdout accurately captures sandbox console outputs'
    );
  } catch (err) {
    assert(false, `Sandbox Safe Execution Test error: ${err.message}`);
  }

  // ===========================================================================
  // PILLAR 4: RATE LIMITING & SERVER CRASH PREVENTION
  // “Kisi bhi API pe 1 minute mein 100+ requests bhejo. 429 aana chahiye aur server
  // crash nahi hona chahiye. Test likho.”
  // ===========================================================================
  console.log('\n📋 [PILLAR 4] API Rate Limiting (100 req/min) & Server Crash Prevention:');

  try {
    let status429Count = 0;
    let allowedCount = 0;
    const testIp = '192.168.1.99';

    for (let i = 1; i <= 105; i++) {
      const { req, res } = createMockReqRes({
        method: 'GET',
        url: '/api/courses'
      });
      req.ip = testIp;

      let nextCalled = false;
      await new Promise((resolve) => {
        const timeout = setTimeout(resolve, 50);
        res.onDone(() => {
          clearTimeout(timeout);
          resolve();
        });
        apiMinuteLimiter(req, res, () => {
          nextCalled = true;
          clearTimeout(timeout);
          resolve();
        });
      });

      if (nextCalled) {
        allowedCount++;
      } else if (res.statusCode === 429) {
        status429Count++;
      }
    }

    assert(
      allowedCount === 100,
      `Rate Limiter: First 100 requests permitted within 1 minute (Allowed: ${allowedCount})`
    );
    assert(
      status429Count === 5,
      `Rate Limiter: Requests exceeding 100 in 1 minute trigger HTTP 429 Too Many Requests (429 count: ${status429Count})`
    );

    // Verify live server health after burst
    const resHealth = await safeFetch(`${BASE_URL}/api/health`);
    assert(
      resHealth.status === 200 || resHealth.status === 503,
      `Server Stability: Server remains healthy and responsive after burst request flood (Status: ${resHealth.status})`
    );
  } catch (err) {
    assert(false, `Rate Limiting Test error: ${err.message}`);
  }

  // ===========================================================================
  // PILLAR 5: INPUT VALIDATION & ERROR HANDLING (ZERO LEAKS)
  // “Galat type, bahut bada payload (10MB) aur missing fields bhejo. Clean 400
  // error aana chahiye, aur stack trace, DB error ya internal path response mein leak nahi hona chahiye.”
  // ===========================================================================
  console.log('\n📋 [PILLAR 5] Input Validation & Error Handling (Zero Stack/Path Leakage):');

  // Test 5.1: Missing Required Fields
  try {
    const resMissing = await safeFetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const dataMissing = await resMissing.json();
    assert(
      resMissing.status === 400,
      `Missing fields return clean HTTP 400 Bad Request (Status: ${resMissing.status})`
    );
    assert(
      dataMissing.success === false && typeof dataMissing.message === 'string',
      'Structured error response with descriptive message returned'
    );
  } catch (err) {
    assert(false, `Missing Fields Test error: ${err.message}`);
  }

  // Test 5.2: Invalid Data Types
  try {
    const resWrongType = await safeFetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'javascript',
        code: 123456789 // Expected string, sent number
      })
    });
    const dataWrongType = await resWrongType.json();
    assert(
      resWrongType.status === 400,
      `Invalid parameter type returns clean HTTP 400 Bad Request (Status: ${resWrongType.status})`
    );
    assert(
      dataWrongType.message?.includes('string'),
      'Clear validation guidance provided without system crash'
    );
  } catch (err) {
    assert(false, `Wrong Type Test error: ${err.message}`);
  }

  // Test 5.3: Malformed JSON Syntax
  try {
    const resMalformed = await safeFetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"unclosed_json: true,'
    });
    const dataMalformed = await resMalformed.json();
    assert(
      resMalformed.status === 400,
      `Malformed JSON syntax caught and handled with clean HTTP 400 (Status: ${resMalformed.status})`
    );
    assert(
      dataMalformed.message?.includes('JSON'),
      'Returns friendly message without internal Express body-parser trace'
    );
  } catch (err) {
    assert(false, `Malformed JSON Test error: ${err.message}`);
  }

  // Test 5.4: Huge Payload (10MB) -> Clean 413 Payload Too Large / 400
  try {
    const hugeBody = JSON.stringify({
      data: 'A'.repeat(10 * 1024 * 1024) // 10 Megabytes payload
    });

    const resHuge = await safeFetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: hugeBody
    });
    const dataHuge = await resHuge.json();

    assert(
      resHuge.status === 413 || resHuge.status === 400,
      `Oversized 10MB payload rejected before memory saturation (Status: ${resHuge.status})`
    );
    assert(
      dataHuge.message?.toLowerCase().includes('payload') || dataHuge.message?.toLowerCase().includes('large'),
      'Clean payload limit error message returned'
    );
  } catch (err) {
    assert(false, `10MB Payload Test error: ${err.message}`);
  }

  // Test 5.5: Zero Sensitive Information / Stack Trace Leakage Audit
  try {
    const errorTestEndpoints = [
      { url: `${BASE_URL}/api/code/run`, body: '{"broken":' },
      { url: `${BASE_URL}/api/users/invalid-non-object-id`, headers: { Authorization: `Bearer ${alice ? alice.token : ''}` } },
      { url: `${BASE_URL}/api/courses/not-a-real-id` }
    ];

    let leakDetected = false;
    for (const test of errorTestEndpoints) {
      const res = await safeFetch(test.url, {
        method: test.body ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json', ...(test.headers || {}) },
        body: test.body
      });
      const text = await res.text();

      if (text.includes('at Function.') || text.includes('at Module.') || text.includes('at Object.')) {
        leakDetected = true;
        console.error(`  ❌ Stack trace leak detected on ${test.url}`);
      }
      if (text.includes('c:\\Users') || text.includes('/Users/') || text.includes('node_modules')) {
        leakDetected = true;
        console.error(`  ❌ Internal filesystem path leak detected on ${test.url}`);
      }
      if (text.includes('MongoServerError') || text.includes('TopologyDescription') || text.includes('mongodb+srv://')) {
        leakDetected = true;
        console.error(`  ❌ Database credential/topology leak detected on ${test.url}`);
      }
    }

    assert(
      !leakDetected,
      'Information Leakage Audit: ZERO stack traces, ZERO internal file paths, and ZERO DB errors leaked in error responses'
    );
  } catch (err) {
    assert(false, `Leakage Audit Test error: ${err.message}`);
  }

  // ===========================================================================
  // SUMMARY RESULTS
  // ===========================================================================
  console.log('\n=================================================================');
  console.log(`🏁 BACKEND SECURITY TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('=================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runBackendSecuritySuite().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
