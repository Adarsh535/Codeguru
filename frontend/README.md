# 🚀 CodeGuru Web - Frontend Documentation

This directory contains the React 18 + Vite + TailwindCSS frontend codebase for **CodeGuru Web Platform**, organized using the **Model-View-Controller (MVC)** architectural design pattern.

---

## 🏗️ Folder Structure Overview

```text
src/
├── models/                     # 📁 MODEL LAYER
│   ├── locationModel.js        # Location dataset & helpers
│   ├── categoryModel.js        # Course categories dataset
│   ├── teamModel.js            # Team mentors dataset
│   ├── branchModel.js          # Office branch locations dataset
│   └── placementModel.js       # Student placements & model aggregator
│
├── controllers/                # 🎮 CONTROLLER LAYER
│   ├── usePlacementController.js  # Main application controller
│   ├── useAutoSlideController.js  # Step-by-step auto slide hook
│   └── useContactFormController.js # Contact form controller
│
└── views/                      # 🖼️ VIEW LAYER
    ├── components/             # Reusable UI Components & Modals
    └── App.jsx                 # Application Main View Layout
```

---

## 💻 Available Scripts

In the `frontend/` directory, you can run:

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Bundles the app into static production files in `dist/`.
- `npm run preview`: Previews the production build locally.

---

© 2026 **CodeGuru Technologies**.
