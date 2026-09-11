# 🚀 CodeGuru Web - Full Stack Placement & Learning Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Compass-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.10-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Architecture](https://img.shields.io/badge/Architecture-MVC-FF6B6B?style=for-the-badge)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)

**CodeGuru Web** is an enterprise-grade Full-Stack MERN (MongoDB, Express, React, Node.js) web platform built for student placement drives, IT certification courses, expert mentorship, and regional campus management.

The entire codebase is structured strictly under the **Model-View-Controller (MVC)** design pattern across all three layers: **Frontend App**, **Admin Management Panel**, and **Node.js Express Backend REST API**.

---

## 🏗️ Enterprise MVC Folder Structure Maps

```text
Codeguru web/
├── 📁 admin/                 # Admin Control Panel App (React + Vite)
├── 📁 backend/               # Express REST API Backend Server (Node.js + MongoDB)
├── 📁 frontend/              # Student Facing Website Application (React + Vite)
└── 📄 README.md              # Project Documentation
```

### 🎨 1. Frontend App Structure (`frontend/src`)

```text
frontend/src/
├── 📁 models/                  # 📊 MODEL LAYER (Data Access, Seed Stores & API Services)
│   ├── apiClient.js            # Base HTTP Fetch Client (http://localhost:5000/api)
│   ├── bannerModel.js          # Hero Banner API fetch & seed fallback (+ JSDoc Comments)
│   ├── courseModel.js          # Courses Catalog API fetch & seed fallback (+ JSDoc Comments)
│   ├── placementModel.js       # Student Placements & Achievers (+ JSDoc Comments)
│   ├── teamModel.js            # Team Mentors & Instructors (+ JSDoc Comments)
│   ├── leadModel.js            # Student Lead Inquiry submission API (+ JSDoc Comments)
│   ├── branchModel.js          # Regional Campuses List
│   ├── categoryModel.js        # Category & Taxonomy Data
│   ├── locationModel.js        # Locations & Geolocation Helper
│   └── index.js                # Models Barrel Export
│
├── 📁 controllers/             # 🎮 CONTROLLER LAYER (State & Business Custom Hooks)
│   ├── useBannersController.js # Hero banner slider state & navigation
│   ├── useCoursesController.js # Course catalog filtering & search query state
│   ├── useTeamController.js    # Team instructors slider state
│   ├── usePlacementController.js# Placement drive modal & filter state
│   ├── useContactFormController.js# Lead inquiry form state & location detection
│   ├── useAutoSlideController.js# Auto-play slider timer hook
│   └── index.js                # Controllers Barrel Export
│
├── 📁 views/                   # 🖼️ VIEW LAYER (UI Presentation & Layout Components)
│   ├── App.jsx                 # Main Application Root View
│   ├── 📁 components/          # Reusable View Components
│   │   ├── Navbar.jsx               # Top navigation bar
│   │   ├── BannerSlider.jsx         # Hero video/image banner carousel
│   │   ├── TechLanguageSlider.jsx   # Tech stack infinite marquee
│   │   ├── CompanyLogoSlider.jsx    # Hiring companies infinite marquee
│   │   ├── CategoryNavbar.jsx       # Category tabs & course drawer
│   │   ├── TopPlacementSlider.jsx   # Student placement auto-slider
│   │   ├── OurTeamSlider.jsx        # Team & Mentors infinite marquee
│   │   ├── OurBranchesSection.jsx   # Office branch location cards
│   │   ├── ContactUsSection.jsx     # Get in Touch contact query form
│   │   ├── ContactModal.jsx         # Contact inquiry modal dialog
│   │   ├── LocationModal.jsx        # Location selection modal
│   │   ├── PlacementSelectorModal.jsx # Placement drive type modal
│   │   ├── BottomNav.jsx            # Mobile bottom navigation bar
│   │   ├── AuthModal.jsx            # Authentication modal dialog
│   │   ├── BatchEnrollModal.jsx     # Batch enrollment modal
│   │   ├── InquiryModal.jsx         # Instant query modal dialog
│   │   ├── ProfilePage.jsx          # Student profile view
│   │   └── Logo.jsx                 # CodeGuru SVG logo component
│   └── 📁 pages/               # Page Views (MyBatchPage.jsx, etc.)
│
├── 📁 services/                # 🔌 BACKWARD COMPATIBILITY BRIDGES
│   └── apiService.js           # Delegates to models layer with API JSDoc comments
│
├── 📁 utils/                   # 🛠️ UTILITIES
│   └── locationSanitizer.js
│
├── index.css                   # Custom TailwindCSS utility animations
└── main.jsx                    # React DOM Root Entrypoint
```

---

### 🛡️ 2. Admin Panel Structure (`admin/src`)

```text
admin/src/
├── 📁 models/                  # 📊 MODEL LAYER (API Services & Data Models)
│   ├── apiClient.js            # Centralized API Fetch Helper
│   ├── leadModel.js            # Student Leads CRUD & Stats API (+ JSDoc Comments)
│   ├── adminCmsModel.js        # Banners, Courses, Placements & Team APIs (+ JSDoc Comments)
│   ├── authModel.js            # Master Admin Login & Credential APIs (+ JSDoc Comments)
│   ├── systemModel.js          # System Health & DB Diagnostics API (+ JSDoc Comments)
│   └── index.js                # Models Barrel Export
│
├── 📁 controllers/             # 🎮 CONTROLLER LAYER (Business Logic & Hooks)
│   ├── useLeadsController.js     # Leads CRUD, search, auto-polling controller
│   ├── useBannersController.js   # Hero slider & video banner controller
│   ├── useCoursesController.js   # Courses directory controller
│   ├── usePlacementsController.js# Placement drive posters controller
│   ├── useTeamController.js      # Staff & Instructors controller
│   ├── useSystemController.js    # System health & settings controller
│   ├── useAuthController.js      # Session & authentication controller
│   └── index.js                 # Controllers Barrel Export
│
├── 📁 views/                   # 🖼️ VIEW LAYER (Admin Control Panel Screens)
│   ├── AcademicViews.jsx        # Modules, Lessons, Batches & Attendance
│   ├── AnalyticsViews.jsx       # Reports & Revenue Analytics
│   ├── BannersManagerView.jsx   # Hero Slide & Video Banners CMS
│   ├── CmsExtraViews.jsx        # Media Library & SEO Settings
│   ├── CoursesManagerView.jsx   # Courses Directory Management
│   ├── CrmViews.jsx             # Admissions & Communication CRM
│   ├── DashboardView.jsx        # Master Analytics Dashboard
│   ├── FinanceViews.jsx         # Fees, Invoices & Receipts
│   ├── LeadsView.jsx            # Student Leads Management & Search
│   ├── LoginView.jsx            # Master Admin Authentication View
│   ├── NotificationsView.jsx    # System Alerts & Notifications
│   ├── PlacementsManagerView.jsx# Student Star Achievers Manager
│   ├── SettingsView.jsx         # Security & Database Connection Settings
│   ├── SystemViews.jsx          # Audit Logs & Backup Center
│   └── TeamManagerView.jsx      # Instructors & Mentors Manager
│
├── 📁 components/              # 🧩 REUSABLE ADMIN COMPONENTS
│   ├── Sidebar.jsx              # Navigation Taxonomy Sidebar
│   ├── Topbar.jsx               # Header Search Bar & User Profile
│   ├── ProtectedRoute.jsx       # Authentication Route Guard
│   └── DistrictInquiryMap.jsx   # Regional Analytics Map
│
├── 📁 context/                 # 🔑 CONTEXT PROVIDER
│   └── AuthContext.jsx          # Global Auth Provider using authModel
│
├── 📁 services/                # 🔌 BACKWARD COMPATIBILITY BRIDGES
│   ├── apiAdminService.js       # Delegates to adminCmsModel (+ JSDoc)
│   └── leadService.js           # Delegates to leadModel (+ JSDoc)
│
├── App.jsx                     # Master App Router & State Provider
└── main.jsx                    # React Mount Entrypoint
```

---

### 📡 3. Backend Express REST API Structure (`backend/`)

```text
backend/
├── 📁 api/                     # 🌐 ALL REST API ENDPOINTS & CONTROLLERS
│   ├── index.js                # Central API Router mounted at /api
│   ├── 📁 controllers/         # 🎮 CONTROLLER LAYER (Request Processing & DB Logic)
│   │   ├── authController.js       # Admin Login & Update Credentials (+ JSDoc Comments)
│   │   ├── bannerController.js     # Hero Banners GET/POST/PUT/DELETE (+ JSDoc Comments)
│   │   ├── branchController.js     # Regional Campuses GET/POST/DELETE (+ JSDoc Comments)
│   │   ├── courseController.js     # Courses Catalog GET/POST/PUT/DELETE (+ JSDoc Comments)
│   │   ├── leadController.js       # Student Leads GET/POST/PUT/DELETE (+ JSDoc Comments)
│   │   ├── navMenuController.js    # Dynamic Navbar GET/POST/DELETE (+ JSDoc Comments)
│   │   ├── placementController.js  # Placements Drive GET/POST/DELETE (+ JSDoc Comments)
│   │   ├── teamController.js       # Staff & Instructors GET/POST/DELETE (+ JSDoc Comments)
│   │   ├── trafficController.js    # Live Visitors & Search Stats (+ JSDoc Comments)
│   │   ├── uploadController.js     # Media File Upload Formatter (+ JSDoc Comments)
│   │   └── index.js               # Controller Barrel Export
│   └── 📁 routes/              # 🚦 ROUTE LAYER (Express Endpoint Maps)
│       ├── authRoutes.js           # /api/auth endpoints
│       ├── bannerRoutes.js         # /api/banners endpoints
│       ├── branchRoutes.js         # /api/branches endpoints
│       ├── courseRoutes.js         # /api/courses endpoints
│       ├── leadRoutes.js           # /api/leads endpoints
│       ├── navMenuRoutes.js        # /api/navmenus endpoints
│       ├── placementRoutes.js      # /api/placements endpoints
│       ├── teamRoutes.js           # /api/team endpoints
│       ├── trafficRoutes.js        # /api/traffic endpoints
│       └── uploadRoutes.js         # /api/upload endpoints
│
├── 📁 config/                  # ⚙️ CONFIGURATION
│   └── db.js                   # MongoDB Mongoose Connection & Initial Seeding
│
├── 📁 models/                  # 📊 MODEL LAYER (Mongoose Schemas & Database Models)
│   ├── Admin.js                # Master Admin Account Schema
│   ├── Banner.js               # Hero Banner Schema
│   ├── Branch.js               # Regional Branch Schema
│   ├── Course.js               # Training Course Schema
│   ├── Lead.js                 # Student Inquiry Lead Schema
│   ├── NavMenu.js              # Navbar Menu Schema
│   ├── Placement.js            # Student Placement Schema
│   ├── Team.js                 # Staff Instructor Schema
│   └── Traffic.js              # Visitor Analytics Schema
│
├── 📁 middleware/              # 🛡️ MIDDLEWARE
│   └── upload.js               # Multer File Upload Middleware
│
├── 📁 db/                      # 💾 BACKUP STORE
│   └── jsonStore.js            # Local JSON Persistence Fallback
│
├── 📁 uploads/                 # 🖼️ STATIC MEDIA FILES
├── .env                        # Environment Configuration
├── package.json
└── server.js                   # Express Application Entrypoint
```

---

## 🌐 Express REST API Endpoints Reference

| Category | HTTP Method | Endpoint Route | Controller Function | Description |
| :--- | :--- | :--- | :--- | :--- |
| **System** | `GET` | `/api/health` | `server.js` | Server & MongoDB connection status check |
| **Auth** | `POST` | `/api/auth/login` | `authController.loginAdmin` | Authenticates master admin credentials |
| **Auth** | `POST` | `/api/auth/update-credentials` | `authController.updateCredentials` | Updates admin email/password in MongoDB |
| **Auth** | `POST` | `/api/auth/student/register` | `authController.registerStudent` | Registers a new student account |
| **Auth** | `POST` | `/api/auth/student/login` | `authController.loginStudent` | Authenticates student credentials |
| **Enrollments** | `GET` | `/api/enrollments` | `enrollmentController.getEnrollments` | Fetches all student course enrollments |
| **Enrollments** | `POST` | `/api/enrollments` | `enrollmentController.createEnrollment` | Submits new student enrollment & records fee payment |
| **Enrollments** | `PUT` | `/api/enrollments/:id` | `enrollmentController.updateEnrollmentStatus` | Updates enrollment or payment fee status |
| **Enrollments** | `DELETE` | `/api/enrollments/:id` | `enrollmentController.deleteEnrollment` | Deletes an enrollment record by ID |
| **Banners** | `GET` | `/api/banners` | `bannerController.getBanners` | Fetches homepage hero slider banners |
| **Banners** | `POST` | `/api/banners` | `bannerController.addBanner` | Uploads/creates a new image or video banner |
| **Banners** | `PUT` | `/api/banners/:id` | `bannerController.updateBanner` | Updates banner details by ID |
| **Banners** | `DELETE` | `/api/banners/:id` | `bannerController.deleteBanner` | Deletes a banner by ID |
| **Courses** | `GET` | `/api/courses` | `courseController.getCourses` | Fetches training courses catalog |
| **Courses** | `POST` | `/api/courses` | `courseController.addCourse` | Creates a new training course entry |
| **Courses** | `PUT` | `/api/courses/:id` | `courseController.updateCourse` | Updates course details by ID |
| **Courses** | `DELETE` | `/api/courses/:id` | `courseController.deleteCourse` | Deletes a course entry by ID |
| **Leads** | `GET` | `/api/leads` | `leadController.getLeads` | Fetches all student lead inquiries |
| **Leads** | `POST` | `/api/leads` | `leadController.addLead` | Submits a new student admission inquiry |
| **Leads** | `PUT` | `/api/leads/:id` | `leadController.updateLeadStatus` | Updates lead status (`New`/`Contacted`/`Enrolled`) |
| **Leads** | `DELETE` | `/api/leads/:id` | `leadController.deleteLead` | Deletes a lead record by ID |
| **Placements**| `GET` | `/api/placements` | `placementController.getPlacements` | Fetches student placement drive posters |
| **Placements**| `POST` | `/api/placements` | `placementController.addPlacement` | Adds a new placed student poster |
| **Placements**| `DELETE` | `/api/placements/:id` | `placementController.deletePlacement` | Deletes a placement poster by ID |
| **Team** | `GET` | `/api/team` | `teamController.getTeam` | Fetches instructors & mentors profiles |
| **Team** | `POST` | `/api/team` | `teamController.addTeamMember` | Adds a new instructor profile |
| **Team** | `DELETE` | `/api/team/:id` | `teamController.deleteTeamMember` | Deletes an instructor profile by ID |
| **Traffic** | `GET` | `/api/traffic/stats` | `trafficController.getTrafficStats` | Returns realtime visitor analytics & stats |
| **Traffic** | `POST` | `/api/traffic/visit` | `trafficController.recordVisit` | Logs a user page visit |
| **Upload** | `POST` | `/api/upload` | `uploadController.handleFileUpload` | Uploads image/video and returns static URL |

---

## ⚡ Key Highlights & Features

- **Enterprise MVC Architecture**: Clean separation into `models/`, `controllers/`, and `views/` across Backend, Admin Panel, and Frontend Application.
- **JSDoc API Documentation**: Every Express API endpoint and controller is fully documented with `@route`, `@desc`, `@access`, `@param`, and `@returns` metadata.
- **Advanced SEO Hub & Google SERP Preview**: Integrated Google SERP live search result preview (Desktop/Mobile), 0–100% SEO Ranking Health Score Meter, OpenGraph Social Media tags, Google Search Console Verification (`google-site-verification`), GA4 Analytics, and Schema.org JSON-LD Structured Data.
- **Realtime Fee Collection & Certificates**: Live student enrollment & fee tracking, automatic lead CRM sync, GST tax invoice generation, and official Black/Gold graduation certificates.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 5, TailwindCSS 3, Material-UI Icons
- **Admin**: React 18, Vite 5, TailwindCSS 3, Context API, Lucide/MUI Icons
- **Backend**: Node.js, Express.js, Mongoose ODM, Multer File Uploader, CORS
- **Database**: MongoDB Compass (`codeguru_db`) with JSON File Fallback persistence
- **Architecture**: Enterprise Model-View-Controller (MVC) across all layers

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB Compass / Community Server**: Running at `mongodb://127.0.0.1:27017`

### Execution Instructions

1. **Start Express REST API Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   *Backend runs at `http://localhost:5000/api`.*

2. **Start Admin Control Panel**:
   ```bash
   cd admin
   npm install
   npm run dev
   ```
   *Admin app runs locally at `http://localhost:5173/`.*

3. **Start Frontend Student Website**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend site runs locally at `http://localhost:5174/`.*

---

## ⚙️ Environment Configuration (`.env` Files)

Each sub-application contains a `.env` configuration file:

### 📡 1. Backend Environment (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codeguru_db
JWT_SECRET=codeguru_super_secret_jwt_key_2026
NODE_ENV=development
```

### 🛡️ 2. Admin Environment (`admin/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_TITLE=CodeGuru Enterprise Admin Control Panel
```

### 🎨 3. Frontend Environment (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_TITLE=CodeGuru Student Placement & Learning Platform
```

---

## 📜 License & Copyright

© 2026 **CodeGuru Technologies**. All rights reserved.
