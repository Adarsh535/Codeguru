# 🚀 CodeGuru Web - Full Stack Placement & Learning Platform (Enterprise MVC)

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Security-Hardened-red?style=for-the-badge&logo=shield)](https://owasp.org/)
[![Architecture](https://img.shields.io/badge/Architecture-MVC-FF6B6B?style=for-the-badge)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)

**CodeGuru Web** is an enterprise-grade Full-Stack MERN & Next.js platform built for student placement drives, IT certification courses, expert mentorship, online admissions CRM, student batches, and regional campus management.

The codebase strictly follows the **Model-View-Controller (MVC)** architectural design across all three distinct sub-applications:
1. **Frontend Student Portal** (`frontend/`) — Built with **Next.js (App Router)** for dynamic SSR/SSG rendering, SEO metadata, sitemaps, and student interaction.
2. **Admin Management Control Panel** (`admin/`) — Built with **React 18 & Vite** for lightning-fast CMS, admissions CRM, audit logs, and analytics.
3. **Backend REST API Server** (`backend/`) — Built with **Node.js, Express, MongoDB Atlas, and Cloudinary**, featuring production-grade security, rate limiting, and SMS gateways.

---

## 🏗️ Enterprise Architecture Overview

```text
Codeguru web/
├── 📁 admin/                 # 🛡️ Admin Control Panel App (React 18 + Vite) - Port 5174
├── 📁 backend/               # 📡 Express REST API Backend Server (Node.js + MongoDB) - Port 5000
├── 📁 frontend/              # 🎨 Student Facing Portal (Next.js App Router) - Port 3000
└── 📄 README.md              # 📖 Master Project Documentation
```

### 1. 📊 Model Layer (`models/`)
- Encapsulates database schemas, ODM Mongoose entities, and centralized HTTP network access.
- **Backend Models**: `Admin.js`, `Student.js`, `Course.js`, `Lead.js`, `Enrollment.js`, `Banner.js`, `Placement.js`, `Team.js`, `Branch.js`, `Category.js`, `NavMenu.js`, `Ad.js`, `Analytics.js`, `Traffic.js`, `AuditLog.js`, `Settings.js`, `Submission.js`.
- **Frontend Models**: `apiClient.js`, `courseModel.js`, `leadModel.js`, `bannerModel.js`, `placementModel.js`, `teamModel.js`, `userModel.js`, `branchModel.js`.
- **Admin Models**: `apiClient.js`, `adminCmsModel.js`, `leadModel.js`, `authModel.js`, `systemModel.js`.

### 2. 🎮 Controller Layer (`controllers/`)
- Handles business logic, input sanitization, authentication verification, state management, and event handling.
- **Backend Controllers**: `authController.js`, `adminController.js`, `courseController.js`, `leadController.js`, `enrollmentController.js`, `bannerController.js`, `placementController.js`, `teamController.js`, `branchController.js`, `categoryController.js`, `navMenuController.js`, `adController.js`, `analyticsController.js`, `trafficController.js`, `uploadController.js`, `settingsController.js`, `submissionController.js`, `codeExecutionController.js`.
- **Frontend Controllers**: `useCoursesController.js`, `useBannersController.js`, `useTeamController.js`, `usePlacementController.js`, `useContactFormController.js`, `useClientData.js`.
- **Admin Controllers**: `useCoursesController.js`, `useLeadsController.js`, `useBannersController.js`, `usePlacementsController.js`, `useTeamController.js`, `useAuthController.js`.

### 3. 🖼️ View Layer (`views/` & Next.js `app/`)
- Presentation components, responsive layouts, interactive dialogs, and route pages.
- **Frontend Pages & Views**: Next.js App Router (`/about`, `/courses`, `/placements`, `/my-batch`, `/contact`, `/login`, `/profile`, `/privacy`, `/refund-policy`, `/terms`), `Navbar.jsx`, `BannerSlider.jsx`, `CategoryNavbar.jsx`, `TopPlacementSlider.jsx`, `OurTeamSlider.jsx`, `CourseDetailsModal.jsx`, `AuthModal.jsx`, `BatchEnrollModal.jsx`.
- **Admin Views**: `DashboardView.jsx`, `CoursesManagerView.jsx`, `LeadsView.jsx`, `BannersManagerView.jsx`, `PlacementsManagerView.jsx`, `TeamManagerView.jsx`, `AcademicViews.jsx`, `FinanceViews.jsx`, `CrmViews.jsx`, `AdsManagerView.jsx`, `AnalyticsViews.jsx`, `VisitorsView.jsx`, `NotificationsView.jsx`, `SystemViews.jsx`, `SettingsView.jsx`, `LoginView.jsx`.

---

## 📂 Detailed Directory Structures

### 🎨 Frontend Structure (`frontend/`)

```text
frontend/
├── 📁 src/
│   ├── 📁 app/                     # 🌐 Next.js App Router (SSR & SEO)
│   │   ├── layout.jsx              # Global root HTML shell, SEO Meta & Providers
│   │   ├── page.jsx                # Homepage root view
│   │   ├── ClientShell.jsx         # Client-side dynamic interactive provider
│   │   ├── sitemap.js              # Dynamic XML sitemap generator
│   │   ├── robots.js               # Search crawler directive generator
│   │   ├── manifest.js             # PWA Web App manifest
│   │   ├── not-found.jsx           # Branded 404 error page
│   │   ├── 📁 about/               # About Us page route
│   │   ├── 📁 contact/             # Contact & Inquiry page route
│   │   ├── 📁 courses/             # Full Course Catalog page route
│   │   ├── 📁 faq/                 # FAQs page route
│   │   ├── 📁 login/               # Student Login & OTP route
│   │   ├── 📁 my-batch/            # Enrolled Batches & Lectures route
│   │   ├── 📁 placements/          # Student Achievers & Placement Drives route
│   │   ├── 📁 profile/             # Student Profile & Certificates route
│   │   ├── 📁 services/            # Institute offerings & training route
│   │   ├── 📁 privacy/             # Privacy Policy legal route
│   │   ├── 📁 refund-policy/       # Refund & Cancellation policy route
│   │   └── 📁 terms/               # Terms of Service legal route
│   │
│   ├── 📁 models/                  # 📊 MODEL LAYER (Data Access & API Client)
│   │   ├── apiClient.js            # Base Fetch client with credentials & CSRF
│   │   ├── bannerModel.js          # Hero banners API service
│   │   ├── courseModel.js          # Course catalog API service
│   │   ├── placementModel.js       # Placements API service
│   │   ├── teamModel.js            # Mentors & Faculty API service
│   │   ├── leadModel.js            # Student admission lead submission API
│   │   ├── userModel.js            # Student Auth & Session API
│   │   └── branchModel.js          # Campus branch locations API
│   │
│   ├── 📁 controllers/             # 🎮 CONTROLLER LAYER (Custom React Hooks)
│   │   ├── useCoursesController.js # Course filtering, taxonomy & search logic
│   │   ├── useBannersController.js # Banner auto-play & slide navigation
│   │   ├── useTeamController.js    # Team & mentor filtering logic
│   │   ├── usePlacementController.js# Achiever highlight logic
│   │   └── useContactFormController.js# Inquiry form validation & geo-coords
│   │
│   ├── 📁 views/                   # 🖼️ VIEW LAYER (Reusable UI Components)
│   │   ├── 📁 components/          # UI Components (Navbar, Sliders, Modals)
│   │   └── 📁 pages/               # Presentation Views
│   │
│   ├── 📁 context/                 # React Context Providers (Auth, Theme)
│   ├── 📁 services/                # API Bridges & legacy adapters
│   └── 📁 utils/                   # Security, formatting, and helper utilities
│
├── next.config.mjs                 # Next.js configuration (Remote image domains & security headers)
├── tailwind.config.js              # TailwindCSS styling configuration
└── package.json                    # Next.js 14/16 dependencies & scripts
```

---

### 🛡️ Admin Panel Structure (`admin/`)

```text
admin/
├── 📁 src/
│   ├── 📁 models/                  # 📊 MODEL LAYER (Admin API Client & Data Access)
│   │   ├── apiClient.js            # Admin fetch client with Bearer token & CSRF injection
│   │   ├── adminCmsModel.js        # Banners, Courses, Placements & Team CMS API
│   │   ├── leadModel.js            # Admissions CRM & Student Leads API
│   │   ├── authModel.js            # Master Admin Session & Token API
│   │   └── systemModel.js          # System Health & DB Diagnostics API
│   │
│   ├── 📁 controllers/             # 🎮 CONTROLLER LAYER (State Management Hooks)
│   │   ├── useCoursesController.js # Course CRUD operations
│   │   ├── useLeadsController.js   # Lead status transitions & polling
│   │   ├── useBannersController.js # Banner slider & video upload management
│   │   ├── usePlacementsController.js# Placement posters & student data
│   │   ├── useTeamController.js    # Mentors & staff profiles
│   │   └── useAuthController.js    # Session persistence & logout handling
│   │
│   ├── 📁 views/                   # 🖼️ VIEW LAYER (Admin Control Screens)
│   │   ├── DashboardView.jsx       # Realtime statistics & revenue analytics
│   │   ├── CoursesManagerView.jsx  # Course curriculum, pricing & badge editor
│   │   ├── LeadsView.jsx           # Student admissions CRM table & filters
│   │   ├── BannersManagerView.jsx  # Hero slider media management
│   │   ├── PlacementsManagerView.jsx# Student placement gallery manager
│   │   ├── TeamManagerView.jsx     # Instructor profiles manager
│   │   ├── AcademicViews.jsx       # Batches, syllabus & attendance
│   │   ├── FinanceViews.jsx        # Student fees, installments & invoices
│   │   ├── CrmViews.jsx            # Lead tracking & communications
│   │   ├── AdsManagerView.jsx      # Promotional popups & ad banners
│   │   ├── AnalyticsViews.jsx      # Web traffic, conversions & device analytics
│   │   ├── VisitorsView.jsx        # Realtime visitor tracking & geo-logs
│   │   ├── NotificationsView.jsx   # System alerts & SMS broadcast view
│   │   ├── SystemViews.jsx         # Server diagnostics & MongoDB health
│   │   ├── SettingsView.jsx        # Admin credentials, tokenVersion & DB maintenance
│   │   └── LoginView.jsx           # Master Admin login with brute-force protection
│   │
│   ├── 📁 context/                 # Admin AuthContext & ToastContext
│   ├── 📁 components/              # Sidebar, Header, Modals, StatCards
│   └── App.jsx                     # Master Admin View Router & Session Gate
│
├── vite.config.js                  # Vite bundler configuration (Port 5174, CSP headers)
└── package.json                    # Admin dependencies & scripts
```

---

### 📡 Backend Express REST API Structure (`backend/`)

```text
backend/
├── 📁 api/
│   ├── index.js                    # Master API router mounted at /api
│   ├── 📁 controllers/             # 🎮 CONTROLLER LAYER (Business logic & responses)
│   │   ├── authController.js       # Admin & Student authentication, session tokens
│   │   ├── adminController.js      # System diagnostics, credential management & audit logs
│   │   ├── courseController.js     # Course catalog CRUD
│   │   ├── leadController.js       # Student leads, status updates & automated SMS
│   │   ├── enrollmentController.js # Student enrollments & fee transactions
│   │   ├── bannerController.js     # Hero banners CRUD
│   │   ├── placementController.js  # Student placements CRUD
│   │   ├── teamController.js       # Mentors & instructors CRUD
│   │   ├── branchController.js     # Campus branch locations CRUD
│   │   ├── categoryController.js   # Course categories & taxonomies
│   │   ├── navMenuController.js    # Dynamic header navigation menu CRUD
│   │   ├── adController.js         # Promotional announcements & popups
│   │   ├── analyticsController.js  # System metrics & conversion analytics
│   │   ├── trafficController.js    # Live traffic & visitor logs
│   │   ├── uploadController.js     # Cloudinary media uploader
│   │   ├── settingsController.js   # Global platform settings
│   │   ├── submissionController.js # Student assignment & code submissions
│   │   ├── codeExecutionController.js# Online IDE code execution
│   │   └── userController.js       # Student profile & batch data
│   │
│   └── 📁 routes/                  # 🚦 ROUTE LAYER (Express Endpoints)
│       ├── authRoutes.js           # /api/auth
│       ├── adminRoutes.js          # /api/admin
│       ├── courseRoutes.js         # /api/courses
│       ├── leadRoutes.js           # /api/leads
│       ├── enrollmentRoutes.js     # /api/enrollments
│       ├── bannerRoutes.js         # /api/banners
│       ├── placementRoutes.js      # /api/placements
│       ├── teamRoutes.js           # /api/team
│       ├── branchRoutes.js         # /api/branches
│       ├── categoryRoutes.js       # /api/categories
│       ├── navMenuRoutes.js        # /api/nav-menus
│       ├── adRoutes.js             # /api/ads
│       ├── analyticsRoutes.js      # /api/analytics
│       ├── trafficRoutes.js        # /api/traffic
│       ├── realtimeRoutes.js       # /api/realtime (SSE live updates)
│       ├── uploadRoutes.js         # /api/upload
│       ├── settingsRoutes.js       # /api/settings
│       ├── submissionRoutes.js     # /api/submissions
│       ├── codeRoutes.js           # /api/code
│       └── userRoutes.js           # /api/users
│
├── 📁 config/                      # ⚙️ SYSTEM CONFIGURATION
│   ├── db.js                       # MongoDB Atlas connection & auto-seed checks
│   ├── env.js                      # Startup environment validator
│   └── cloudinary.js               # Cloudinary CDN storage configuration
│
├── 📁 models/                      # 📊 MODEL LAYER (Mongoose Schemas)
│   ├── Admin.js                    # Admin account with tokenVersion & lockout
│   ├── Student.js                  # Student profile schema
│   ├── Course.js                   # Training course catalog schema
│   ├── Lead.js                     # Admissions inquiry lead schema
│   ├── Enrollment.js               # Batch enrollment & fee invoice schema
│   ├── Banner.js                   # Hero slider banner schema
│   ├── Placement.js                # Student achiever placement schema
│   ├── Team.js                     # Mentor & staff profile schema
│   ├── Branch.js                   # Campus branch location schema
│   ├── Category.js                 # Course category taxonomy schema
│   ├── NavMenu.js                  # Dynamic navigation menu schema
│   ├── Ad.js                       # Promotional banner schema
│   ├── Analytics.js                # Metric logs schema
│   ├── Traffic.js                  # Visitor tracking schema
│   ├── AuditLog.js                 # Immutable audit trail (Kisne, Kya, Kab)
│   ├── Settings.js                 # System settings schema
│   ├── Submission.js               # Code assignment submission schema
│   └── Counter.js                  # Atomic auto-increment ID counter
│
├── 📁 middleware/                  # 🛡️ SECURITY & REQUEST MIDDLEWARES
│   ├── auth.js                     # JWT verification & role validation
│   ├── rateLimiter.js              # Brute-force protection & endpoint rate limits
│   ├── upload.js                   # Multer media file memory upload
│   └── xssSanitizer.js             # Input sanitization against script injection
│
├── 📁 services/                    # 🔌 EXTERNAL INTEGRATIONS
│   └── smsService.js               # Real SMS & OTP delivery (Twilio, Fast2SMS, 2Factor)
│
├── 📁 tests/                       # 🧪 AUTOMATED SECURITY & INTEGRATION TEST SUITES
│   ├── securityVerification.js     # Offline JWT & cryptographic validation tests
│   ├── adminSecurityTest.js        # Admin RBAC & Audit log tests
│   ├── frontendSecurityTest.js     # XSS & CSRF defense tests
│   └── backendSecurityTest.js      # NoSQL injection & IDOR security tests
│
├── server.js                       # Express Application Entrypoint with CORS & Helmet
└── package.json                    # Dependencies & execution scripts
```

---

## 🔒 Enterprise Security & Hardening Features

- **Strict CORS with `CORS_ORIGINS`**: Configurable domain allowlist prevents unauthorized cross-origin requests.
- **Double-Submit CSRF Defense**: Server issues a cryptographically secure `cg_csrf` cookie; client requests inject `x-csrf-token` header on all non-GET mutations.
- **JWT Authentication with `tokenVersion`**: Single-click session revocation and password rotation support. Invalidates all old tokens upon logout.
- **Role-Based Access Control (RBAC)**: Strict barriers on all `/api/admin/*` routes; student tokens are strictly barred from admin operations.
- **Anti-Brute Force Protection**: Admin login is capped with rate limiting and automated account lockouts after repeated failed attempts.
- **Immutable Audit Trail (`AuditLog.js`)**: Automatically logs every critical action — recording **Kisne (Who)**, **Kya (What)**, and **Kab (When)** with client IP and user agent.
- **Input Sanitization**: Guarded with `express-mongo-sanitize` (against NoSQL operator injection) and custom XSS stripping filters.
- **Security Headers (Helmet & Next.js)**: `X-Frame-Options: DENY`, `Content-Security-Policy: frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`.

---

## ⚙️ Environment Configuration Reference

### 📡 Backend Configuration (`backend/.env` & `.env.example`)

```env
# Server Port & Runtime Mode
PORT=5000
NODE_ENV=production

# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/codeguru_db?retryWrites=true&w=majority

# Cryptographic JWT Secret Key (Minimum 32 characters)
JWT_SECRET=your_jwt_secret_key_minimum_32_characters

# Client URLs & CORS Whitelist (Required for production / Render dashboard)
# Comma-separated list of allowed frontend/admin domains
CORS_ORIGINS=https://codegurru.in,https://www.codegurru.in,https://369.codegurru.in
FRONTEND_URL=https://codegurru.in
ADMIN_URL=https://admin.codegurru.in

# Cloudinary Cloud Storage Credentials (For Media & Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Twilio SMS & OTP Verification Gateway
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_VERIFY_SERVICE_SID=your_twilio_verify_service_sid

# Optional Indian SMS Gateways
FAST2SMS_API_KEY=your_fast2sms_api_key
TWOFACTOR_API_KEY=your_twofactor_api_key
```

### 🛡️ Admin Panel Configuration (`admin/.env` & `.env.production`)

```env
# Local Development (admin/.env)
VITE_API_BASE_URL=http://localhost:5000/api

# Production Deployment (admin/.env.production)
VITE_API_BASE_URL=https://369.codegurru.in/api
```

### 🎨 Frontend Configuration (`frontend/.env` & `.env.production`)

```env
# Local Development (frontend/.env)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=

# Production Deployment (frontend/.env.production)
NEXT_PUBLIC_API_BASE_URL=https://369.codegurru.in/api
NEXT_PUBLIC_SITE_URL=https://codegurru.in
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

---

## 🚀 Local Development & Execution Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: MongoDB Atlas connection string or local MongoDB Community server

### Step-by-Step Launch Commands

#### 1. Start Express REST API Backend (Port 5000)
```bash
cd backend
npm install
npm start
# Or for live auto-reload:
npm run dev
```
*Backend runs at: `http://localhost:5000/api`*

#### 2. Start Admin Control Panel (Port 5174)
```bash
cd admin
npm install
npm run dev
```
*Admin panel runs at: `http://localhost:5174/`*

#### 3. Start Frontend Student Portal (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
*Frontend portal runs at: `http://localhost:3000/`*

---

## 🧪 Running Automated Security Verification Tests

The platform includes test suites ensuring JWT integrity, anti-brute force, double-extension upload rejection, and role-based access control:

```bash
# In the backend directory:
cd backend

# Run all security test suites
npm test

# Run individual suites
npm run test:admin      # Verifies 36 admin RBAC & audit logging security checks
npm run test:backend    # Verifies NoSQL injection & IDOR security checks
npm run seed:admin      # Initializes or resets the Master Admin account
```

---

## 🌐 Production Deployment Guide (Render / Vercel / cPanel)

### Backend (Render / VPS)
1. Set the **Root Directory** to `backend`.
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Set Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI=<your-atlas-uri>`
   - `JWT_SECRET=<32-char-random-key>`
   - `CORS_ORIGINS=https://codegurru.in,https://www.codegurru.in,https://369.codegurru.in`
   - `CLOUDINARY_*` and `TWILIO_*` credentials.

### Frontend (Vercel / Next.js Hosting)
1. Set the **Root Directory** to `frontend`.
2. Framework Preset: **Next.js**.
3. Environment Variables:
   - `NEXT_PUBLIC_API_BASE_URL=https://369.codegurru.in/api`
   - `NEXT_PUBLIC_SITE_URL=https://codegurru.in`

### Admin (Vercel / Netlify / Cloudflare Pages)
1. Set the **Root Directory** to `admin`.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variables:
   - `VITE_API_BASE_URL=https://369.codegurru.in/api`

---

## 📜 License & Copyright

© 2026 **CodeGuru Technologies**. All rights reserved.
