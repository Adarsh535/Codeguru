# 🚀 CodeGuru Web - Full Stack Placement & Learning Platform (MVC Architecture)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Compass-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.10-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Architecture](https://img.shields.io/badge/Architecture-MVC-FF6B6B?style=for-the-badge)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)

**CodeGuru Web** is an enterprise-grade Full-Stack MERN (MongoDB, Express, React, Node.js) web platform built for student placement drives, IT certification courses, expert mentorship, and regional campus management.

The entire codebase is structured strictly under the **Model-View-Controller (MVC)** design pattern across all three sub-applications: **Frontend Student Application**, **Admin Management Control Panel**, and **Node.js Express Backend REST API**.

---

## 🏗️ Enterprise MVC Architecture Overview

The system enforces strict separation of concerns across Model, View, and Controller layers in all modules:

```text
Codeguru web/
├── 📁 admin/                 # 🛡️ Admin Control Panel App (React + Vite)
├── 📁 backend/               # 📡 Express REST API Backend Server (Node.js + MongoDB)
├── 📁 frontend/              # 🎨 Student Facing Website Application (React + Vite)
└── 📄 README.md              # 📖 Master Project Documentation
```

### 1. 📊 Model Layer (`models/`)
- Encapsulates database schemas, ODM Mongoose entities, data access objects (DAOs), and API network request logic.
- **Backend Models**: `Course.js`, `Lead.js`, `Banner.js`, `Placement.js`, `Team.js`, `Student.js`, `Admin.js`, `Traffic.js`.
- **Frontend Models**: `courseModel.js`, `leadModel.js`, `bannerModel.js`, `placementModel.js`, `userModel.js`.
- **Admin Models**: `adminCmsModel.js`, `leadModel.js`, `authModel.js`, `systemModel.js`.

### 2. 🎮 Controller Layer (`controllers/`)
- Processes HTTP requests, handles business logic, validates parameters, and interacts with Models.
- **Backend Controllers**: `courseController.js`, `leadController.js`, `bannerController.js`, `placementController.js`, `authController.js`, `enrollmentController.js`, `trafficController.js`.
- **Frontend Controllers**: `useCoursesController.js`, `useBannersController.js`, `useTeamController.js`, `useContactFormController.js`.
- **Admin Controllers**: `useCoursesController.js`, `useLeadsController.js`, `useBannersController.js`, `usePlacementsController.js`, `useAuthController.js`.

### 3. 🖼️ View Layer (`views/`)
- Manages user interfaces, JSX components, interactive modals, responsive layouts, and page routing.
- **Frontend Views**: `App.jsx`, `CourseDetailsModal.jsx`, `Navbar.jsx`, `CategoryNavbar.jsx`, `BannerSlider.jsx`, `ProfilePage.jsx`.
- **Admin Views**: `DashboardView.jsx`, `CoursesManagerView.jsx`, `LeadsView.jsx`, `BannersManagerView.jsx`, `AcademicViews.jsx`, `FinanceViews.jsx`.

---

## 📂 Complete Project Directory Maps

### 🎨 Frontend Structure (`frontend/src`)

```text
frontend/src/
├── 📁 models/                  # 📊 MODEL LAYER (Data Persistence & API Integrations)
│   ├── apiClient.js            # Base Axios/Fetch HTTP Client (http://localhost:5000/api)
│   ├── bannerModel.js          # Hero Banner API service (+ JSDoc API comments)
│   ├── courseModel.js          # Training Courses Catalog API service (+ JSDoc API comments)
│   ├── placementModel.js       # Student Placements & Achievers API (+ JSDoc API comments)
│   ├── teamModel.js            # Instructors & Mentors API (+ JSDoc API comments)
│   ├── leadModel.js            # Student Inquiry Lead submission API (+ JSDoc API comments)
│   ├── userModel.js            # Student Auth & Profile Registration API (+ JSDoc API comments)
│   └── branchModel.js          # Regional Branch Campuses Data
│
├── 📁 controllers/             # 🎮 CONTROLLER LAYER (State & Business Logic Custom Hooks)
│   ├── useBannersController.js # Hero slider auto-play & navigation controller
│   ├── useCoursesController.js # Course catalog filtering, taxonomy & search controller
│   ├── useTeamController.js    # Instructors marquee & filter controller
│   ├── usePlacementController.js# Student placement modal & drive controller
│   └── useContactFormController.js# Admission query form & geolocation controller
│
├── 📁 views/                   # 🖼️ VIEW LAYER (JSX UI Presentation Components)
│   ├── App.jsx                 # Application Main View Shell
│   ├── 📁 components/          # Reusable View Components
│   │   ├── CourseDetailsModal.jsx   # Sleek Course Syllabus & Enrollment Modal View
│   │   ├── Navbar.jsx               # Header Navigation Bar
│   │   ├── BannerSlider.jsx         # Hero Banner Carousel View
│   │   ├── CategoryNavbar.jsx       # Course Categories & Drawer Filter Bar
│   │   ├── TopPlacementSlider.jsx   # Student Placements Auto-Marquee
│   │   ├── OurTeamSlider.jsx        # Mentors & Instructors Marquee
│   │   ├── OurBranchesSection.jsx   # Office Locations Grid
│   │   ├── ContactUsSection.jsx     # Admission Query Form
│   │   ├── ContactModal.jsx         # Quick Inquiry Dialog
│   │   ├── AuthModal.jsx            # Student Login / Register Dialog
│   │   ├── BatchEnrollModal.jsx     # Course Batch Checkout Modal
│   │   └── ProfilePage.jsx          # Student Dashboard Profile View
│   └── 📁 pages/               # Page Components (MyBatchPage.jsx, etc.)
│
├── 📁 services/                # 🔌 BACKWARD COMPATIBILITY BRIDGES
│   └── apiService.js           # API Bridge with comprehensive JSDoc comments
│
├── index.css                   # Custom TailwindCSS utilities & keyframe animations
└── main.jsx                    # React Mount Entrypoint
```

---

### 🛡️ Admin Panel Structure (`admin/src`)

```text
admin/src/
├── 📁 models/                  # 📊 MODEL LAYER (API Services & Data Models)
│   ├── apiClient.js            # Base Admin HTTP Fetch Client
│   ├── adminCmsModel.js        # Banners, Courses, Placements & Team CMS API (+ JSDoc)
│   ├── leadModel.js            # Student Leads & CRM Analytics API (+ JSDoc)
│   ├── authModel.js            # Master Admin Session & Login API (+ JSDoc)
│   └── systemModel.js          # DB Diagnostics & System Health API (+ JSDoc)
│
├── 📁 controllers/             # 🎮 CONTROLLER LAYER (State Hooks & Event Handlers)
│   ├── useCoursesController.js # Course catalog creation, editing & deletion controller
│   ├── useLeadsController.js   # Leads search, status update & auto-polling controller
│   ├── useBannersController.js # Hero slider & video upload controller
│   ├── usePlacementsController.js# Student achievers management controller
│   ├── useTeamController.js    # Instructors & staff profiles controller
│   └── useAuthController.js    # Auth session state controller
│
├── 📁 views/                   # 🖼️ VIEW LAYER (Admin Dashboard Views & Screens)
│   ├── CoursesManagerView.jsx  # Course Catalog Manager View
│   ├── LeadsView.jsx           # Admissions CRM & Student Leads View
│   ├── BannersManagerView.jsx  # Hero Banner & Video CMS View
│   ├── DashboardView.jsx       # Analytics & Revenue Dashboard View
│   ├── AcademicViews.jsx       # Batch Schedules, Syllabus & Attendance View
│   ├── FinanceViews.jsx        # Student Fees, Invoices & Payment Status View
│   ├── PlacementsManagerView.jsx# Placement Drives & Student Achievers View
│   ├── TeamManagerView.jsx     # Instructors & Mentors Management View
│   ├── LoginView.jsx           # Master Admin Login Screen
│   └── SettingsView.jsx        # System Security & DB Config View
│
├── 📁 services/                # 🔌 BACKWARD COMPATIBILITY BRIDGES
│   ├── apiAdminService.js      # Admin API Bridge (+ JSDoc comments)
│   └── leadService.js          # Lead Service Bridge (+ JSDoc comments)
│
└── App.jsx                     # Master Admin Router Shell
```

---

### 📡 Backend Express REST API Structure (`backend/`)

```text
backend/
├── 📁 api/                     # 🌐 REST API ENDPOINTS & CONTROLLERS
│   ├── index.js                # Master API Router mounted at /api
│   ├── 📁 controllers/         # 🎮 CONTROLLER LAYER (Request Handler & Database Logic)
│   │   ├── authController.js       # Admin Login, Student Register/Login (+ JSDoc)
│   │   ├── bannerController.js     # Hero Banners GET/POST/PUT/DELETE (+ JSDoc)
│   │   ├── courseController.js     # Courses Catalog GET/POST/PUT/DELETE (+ JSDoc)
│   │   ├── leadController.js       # Student Leads GET/POST/PUT/DELETE (+ JSDoc)
│   │   ├── placementController.js  # Student Placements GET/POST/DELETE (+ JSDoc)
│   │   ├── teamController.js       # Staff Instructors GET/POST/DELETE (+ JSDoc)
│   │   ├── trafficController.js    # Analytics & Live Traffic (+ JSDoc)
│   │   ├── uploadController.js     # Media File Upload (+ JSDoc)
│   │   └── enrollmentController.js # Student Enrollments & Fee Payments (+ JSDoc)
│   │
│   └── 📁 routes/              # 🚦 ROUTE LAYER (Express Endpoint Routers)
│       ├── authRoutes.js           # /api/auth endpoints
│       ├── bannerRoutes.js         # /api/banners endpoints
│       ├── courseRoutes.js         # /api/courses endpoints
│       ├── leadRoutes.js           # /api/leads endpoints
│       ├── placementRoutes.js      # /api/placements endpoints
│       ├── teamRoutes.js           # /api/team endpoints
│       ├── trafficRoutes.js        # /api/traffic endpoints
│       └── uploadRoutes.js         # /api/upload endpoints
│
├── 📁 config/                  # ⚙️ CONFIGURATION
│   └── db.js                   # MongoDB Connection & Initial DB Seeding
│
├── 📁 models/                  # 📊 MODEL LAYER (Mongoose Schemas & Database Entities)
│   ├── Admin.js                # Master Admin Account Schema
│   ├── Course.js               # Training Course Schema
│   ├── Lead.js                 # Student Lead Schema
│   ├── Banner.js               # Hero Banner Schema
│   ├── Placement.js            # Student Placement Schema
│   └── Team.js                 # Instructor Schema
│
├── 📁 middleware/              # 🛡️ MIDDLEWARE
│   └── upload.js               # Multer File Upload Handler
│
├── 📁 uploads/                 # 🖼️ STATIC MEDIA STORAGE
└── server.js                   # Express Application Entrypoint
```

---

## 🌐 Complete REST API Endpoint Reference

Every single API endpoint is documented in source code with JSDoc headers containing `@route`, `@desc`, `@access`, `@param`, and `@returns`.

| Module | HTTP Method | Endpoint Route | Controller Function | Description |
| :--- | :--- | :--- | :--- | :--- |
| **System** | `GET` | `/api/health` | `server.js` | Backend API & MongoDB connection status check |
| **Auth** | `POST` | `/api/auth/login` | `authController.loginAdmin` | Authenticates master admin credentials |
| **Auth** | `POST` | `/api/auth/update-credentials` | `authController.updateCredentials` | Updates admin credentials in MongoDB |
| **Auth** | `POST` | `/api/auth/student/register` | `authController.registerStudent` | Registers a new student account |
| **Auth** | `POST` | `/api/auth/student/login` | `authController.loginStudent` | Authenticates student credentials |
| **Courses** | `GET` | `/api/courses` | `courseController.getCourses` | Fetches full courses catalog |
| **Courses** | `POST` | `/api/courses` | `courseController.addCourse` | Creates a new training course entry |
| **Courses** | `PUT` | `/api/courses/:id` | `courseController.updateCourse` | Updates course details by ID |
| **Courses** | `DELETE` | `/api/courses/:id` | `courseController.deleteCourse` | Deletes a course entry by ID |
| **Leads** | `GET` | `/api/leads` | `leadController.getLeads` | Fetches student lead inquiries |
| **Leads** | `POST` | `/api/leads` | `leadController.addLead` | Submits a new admission inquiry lead |
| **Leads** | `PUT` | `/api/leads/:id` | `leadController.updateLeadStatus` | Updates lead status (`New`/`Contacted`/`Enrolled`) |
| **Leads** | `DELETE` | `/api/leads/:id` | `leadController.deleteLead` | Deletes a lead record by ID |
| **Banners** | `GET` | `/api/banners` | `bannerController.getBanners` | Fetches homepage hero slider banners |
| **Banners** | `POST` | `/api/banners` | `bannerController.addBanner` | Creates a new image or video banner |
| **Banners** | `PUT` | `/api/banners/:id` | `bannerController.updateBanner` | Updates banner slide details by ID |
| **Banners** | `DELETE` | `/api/banners/:id` | `bannerController.deleteBanner` | Deletes a hero banner slide by ID |
| **Placements**| `GET` | `/api/placements` | `placementController.getPlacements` | Fetches student placement drive posters |
| **Placements**| `POST` | `/api/placements` | `placementController.addPlacement` | Adds a new placed student record |
| **Placements**| `DELETE` | `/api/placements/:id` | `placementController.deletePlacement` | Deletes a placement poster by ID |
| **Team** | `GET` | `/api/team` | `teamController.getTeam` | Fetches instructors & mentors list |
| **Team** | `POST` | `/api/team` | `teamController.addTeamMember` | Adds a new instructor profile |
| **Team** | `DELETE` | `/api/team/:id` | `teamController.deleteTeamMember` | Deletes an instructor profile by ID |
| **Traffic** | `GET` | `/api/traffic/stats` | `trafficController.getTrafficStats` | Returns realtime visitor analytics & search stats |
| **Upload** | `POST` | `/api/upload` | `uploadController.handleFileUpload` | Uploads media file and returns static URL |

---

## ⚡ Key Highlights & Features

- **Strict MVC Design Pattern**: Clean separation into `models/`, `controllers/`, and `views/` across Backend REST API, Admin Control Panel, and Frontend Student Portal.
- **Comprehensive JSDoc Documentation**: Every single API endpoint, service method, and controller is annotated with detailed JSDoc metadata (`@route`, `@desc`, `@param`, `@returns`).
- **Interactive Sleek Course Details Modal**: Custom course detail modal with M-E-R-N tech stack flow, circular duration progress ring, 2x2 highlight pills, tabbed syllabus, and full-width CTA buttons.
- **Admissions CRM & Realtime Analytics**: Full student lead management with instant SMS notification alerts, visitor traffic tracking, and enrollment fee analytics.

---

## 🛠️ Technology Stack

- **Frontend Application**: React 18, Vite 5, TailwindCSS 3, Lucide React Icons
- **Admin Control Panel**: React 18, Vite 5, TailwindCSS 3, Context API, Lucide Icons
- **Backend REST API**: Node.js, Express.js, Mongoose ODM, Multer Uploader, CORS
- **Database**: MongoDB Compass / MongoDB Atlas (`codeguru_db`)
- **Architecture**: Enterprise Model-View-Controller (MVC) across all modules

---

## 🚀 Local Development & Execution Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB Server / Compass or Atlas Cluster

### Step-by-Step Launch Commands

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
   *Admin panel runs at `http://localhost:5173/`.*

3. **Start Frontend Student Portal**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend portal runs at `http://localhost:5174/`.*

---

## ⚙️ Environment Configuration (`.env`)

### 📡 Backend Configuration (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codeguru_db
JWT_SECRET=codeguru_super_secret_jwt_key_2026
NODE_ENV=development
```

### 🛡️ Admin Configuration (`admin/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_TITLE=CodeGuru Enterprise Admin Control Panel
```

### 🎨 Frontend Configuration (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_TITLE=CodeGuru Student Placement & Learning Platform
```

---

## 📜 License & Copyright

© 2026 **CodeGuru Technologies**. All rights reserved.
