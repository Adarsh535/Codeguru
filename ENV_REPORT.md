# CodeGurru – ENV Files Audit Report

**Date:** 24 Oct 2026
**Scope:** `backend/.env`, `backend/.env.example`, `frontend/.env`, `frontend/.env.production`, `admin/.env`, `admin/.env.production`
**Method:** Har variable ko poore source code (backend, frontend/src, admin/src, render.yaml) me search karke dekha ki woh kahin use hota hai ya nahi.

Legend: ✅ Kaam ka hai | ⚠️ Optional / khaali hai | ❌ Kaam ka nahi (hata sakte ho)

---

## 1. backend/.env

| # | Variable | Kya kaam hai | Kahan use hota hai | Status |
|---|----------|--------------|--------------------|--------|
| 1 | `PORT` | Server kis port par chalega (5000) | `server.js` | ✅ |
| 2 | `NODE_ENV` | dev/production mode. Production me cookies `secure` hoti hain, rate-limit on hota hai, env validation strict hoti hai | `server.js`, `config/env.js`, `config/db.js`, `utils/jwtHelper.js`, `middleware/rateLimiter.js`, `authController.js` | ✅ |
| 3 | `MONGODB_URI` | MongoDB Atlas database connection | `config/db.js`, `config/env.js`, `scripts/createAdmin.js` | ✅ |
| 4 | `JWT_SECRET` | Login token (JWT) sign/verify karne ki secret key. Kam se kam 32 characters chahiye (abhi 34 hai – OK) | `utils/jwtHelper.js`, `config/env.js` | ✅ |
| 5 | `API_SECRET_KEY` | Pehle `x-api-key` header check ke liye tha | **Kahin use nahi hota.** `validateApiKey` middleware ab sirf `next()` karta hai (no-op stub) | ❌ |
| 6 | `CLOUDINARY_CLOUD_NAME` | Image/media upload – Cloudinary account name | `config/cloudinary.js`, `uploadController.js` | ✅ |
| 7 | `CLOUDINARY_API_KEY` | Cloudinary API key | same | ✅ |
| 8 | `CLOUDINARY_API_SECRET` | Cloudinary secret | same | ✅ |
| 9 | `FRONTEND_URL` | CORS allowlist me frontend ka URL | `server.js` (`getCORSOrigins`), `config/env.js` | ✅ (sirf jab `CORS_ORIGINS` set na ho) |
| 10 | `ADMIN_URL` | CORS allowlist me admin panel ka URL | `server.js` | ✅ (sirf jab `CORS_ORIGINS` set na ho) |
| 11 | `TWILIO_ACCOUNT_SID` | Twilio account ID – SMS bhejne ke liye | `services/smsService.js` → `sendRealSMS()` (naya lead aane par admin ko SMS) | ✅ |
| 12 | `TWILIO_AUTH_TOKEN` | Twilio auth token | same | ✅ |
| 13 | `TWILIO_PHONE_NUMBER` | Twilio ka "from" number | `sendRealSMS()` | ✅ |
| 14 | `TWILIO_VERIFY_SERVICE_SID` | Twilio Verify (OTP) service | Sirf `sendOtpSMS()` aur `checkTwilioVerify()` me – **ye dono functions kahin import/call nahi hote** (dead code) | ❌ |
| 15 | `FAST2SMS_API_KEY` | Indian SMS gateway (Fast2SMS) | `sendRealSMS()` – lekin value **khaali** hai | ⚠️ Optional |
| 16 | `TWOFACTOR_API_KEY` | 2Factor.in SMS gateway | `sendRealSMS()` – value **khaali** hai | ⚠️ Optional |

**Missing (code me use hota hai, .env me nahi):**

- `CORS_ORIGINS` – `server.js` aur `render.yaml` me use hota hai. Comma-separated list (jaise `https://codegurru.in,https://admin.codegurru.in`). Agar ye set hai to `FRONTEND_URL`/`ADMIN_URL` ignore ho jaate hain. Production (Render) me isse set karna zaroori hai, warna `FRONTEND_URL` chahiye.

## 2. backend/.env.example (template)

| Variable | Status | Note |
|----------|--------|------|
| `MONGODB_DIRECT_URI` | ❌ | Code me kahin use nahi hota |
| `API_SECRET_KEY` | ❌ | Upar dekho – unused |
| `TWILIO_VERIFY_SERVICE_SID` | ❌ | Dead code |
| `CORS_ORIGINS` | ➕ Add karo | Template me missing hai |
| Baaki sab | ✅ | Real `.env` jaise hi |

## 3. frontend/.env (local development)

| # | Variable | Kya kaam hai | Kahan use | Status |
|---|----------|--------------|-----------|--------|
| 1 | `NEXT_PUBLIC_API_BASE_URL` | Backend API ka URL | `src/models/apiClient.js` | ✅ (note neeche) |
| 2 | `NEXT_PUBLIC_SITE_URL` | Website ka base URL – SEO metadata, sitemap, robots.txt | `app/layout.jsx`, `app/sitemap.js`, `app/robots.js` | ✅ |
| 3 | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification meta tag | `app/layout.jsx` – value **khaali** | ⚠️ Optional |

> Note: `apiClient.js` me agar browser `localhost` par hai to URL hardcode `http://localhost:5000/api` ho jaata hai – yaani local par `.env` wala `NEXT_PUBLIC_API_BASE_URL` effectively ignore hota hai. Production me ye kaam karta hai.

## 4. frontend/.env.production

| # | Variable | Status | Note |
|---|----------|--------|------|
| 1 | `NEXT_PUBLIC_API_BASE_URL` | ✅ | Production API URL |
| 2 | `NEXT_PUBLIC_API_SECRET_KEY` | ❌ | **Code me kahin use nahi hota.** Aur `NEXT_PUBLIC_` prefix wali cheez browser me public hoti hai – secret key yahan rakhna galat hai. Hata do. |
| 3 | `NEXT_PUBLIC_SITE_URL` | ✅ | |
| 4 | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | ⚠️ | Khaali – optional |

**Optional (code support karta hai, env me nahi hai):** `NEXT_PUBLIC_YANDEX_VERIFICATION`, `NEXT_PUBLIC_BING_VERIFICATION` (`app/layout.jsx`). Zarurat ho to add kar sakte ho.

## 5. admin/.env (local)

| Variable | Kya kaam hai | Kahan use | Status |
|----------|--------------|-----------|--------|
| `VITE_API_BASE_URL` | Admin panel ka backend API URL | `src/models/apiClient.js` | ✅ |

## 6. admin/.env.production

| Variable | Status | Note |
|----------|--------|------|
| `VITE_API_BASE_URL` | ✅ | Production API URL |
| `VITE_API_SECRET_KEY` | ❌ | **Code me use nahi hota.** `VITE_` variables bhi browser bundle me public hote hain – secret yahan nahi hona chahiye. Hata do. |

---

## Summary – jo hata sakte ho (❌)

| File | Line / Variable | Wajah |
|------|-----------------|-------|
| backend/.env | `API_SECRET_KEY` | API-key check middleware ab no-op hai |
| backend/.env | `TWILIO_VERIFY_SERVICE_SID` | Sirf unused OTP functions me |
| backend/.env.example | `API_SECRET_KEY`, `MONGODB_DIRECT_URI`, `TWILIO_VERIFY_SERVICE_SID` | Unused |
| frontend/.env.production | `NEXT_PUBLIC_API_SECRET_KEY` | Unused + public prefix (security risk) |
| admin/.env.production | `VITE_API_SECRET_KEY` | Unused + public prefix (security risk) |

**Khaali / optional (rakh sakte ho, ya hata sakte ho):** `FAST2SMS_API_KEY`, `TWOFACTOR_API_KEY`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (dono frontend files).

**Add karna chahiye:** `CORS_ORIGINS` → `backend/.env.example` me (aur Render dashboard me production value).

## Extra observations

1. Teeno jagah (`API_SECRET_KEY`, `NEXT_PUBLIC_API_SECRET_KEY`, `VITE_API_SECRET_KEY`) ek hi value hai. Kyunki ye unused hai, isse hata dena hi best hai.
2. `render.yaml` me `FRONTEND_URL`/`ADMIN_URL` nahi hain, sirf `CORS_ORIGINS` hai – Render par `CORS_ORIGINS` zaroor set karna.
3. `.gitignore` sahi hai – saari `.env` files ignore hain, sirf `.env.example` commit hota hai.
4. `backend/.env` me real secrets hain (Mongo, Twilio, Cloudinary). Agar ye file kabhi bhi git/chat/kisi ke saath share hui ho to in keys ko rotate kar lena.
5. `services/smsService.js` me `sendOtpSMS()` aur `checkTwilioVerify()` dead code hain – env cleanup ke saath inhe bhi hata sakte ho.
