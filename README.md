# The Platform — Golf Performance Tracking, Charity Giving & Reward Draws

A modern, subscription-driven full-stack platform combining athletic performance tracking, verified Stableford golf scoring (1–45 net points), and monthly draw-based rewards — leading first and foremost with charitable impact.

---

## 📂 Folder Structure Overview

```text
Golf-Subscription/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Express controllers (auth, score, draw, charity, winner, admin)
│   │   ├── db/               # Supabase PostgreSQL client (db/index.js)
│   │   ├── middlewares/      # JWT authentication, role guards & multer file uploads
│   │   ├── routes/           # REST API route handlers (/api/v1/*)
│   │   ├── utils/            # AsyncHandler, ApiError, ApiResponse, ticketSync
│   │   ├── constants.js      # Pool tiers (40%/35%/25%), scoring limits & subscription plans
│   │   ├── app.js            # Express application setup & CORS configuration
│   │   └── index.js          # Backend server entrypoint (port 5000)
│   └── supabase_schema.sql   # PostgreSQL database schema & initial seed data
├── frontend/
│   ├── src/
│   │   ├── components/       # Modular UI components (admin surfaces, draw, score, charity, modals)
│   │   ├── context/          # Global AuthContext & ToastContext
│   │   ├── pages/            # Core views (Home, Charities, HowItWorks, Draws, Dashboard, Admin)
│   │   ├── services/         # Client API services connecting to /api/v1
│   │   ├── App.jsx           # Main application state & view router
│   │   ├── index.css         # Modern typography (Inter & Plus Jakarta Sans) & styling
│   │   └── main.jsx          # React 19 root mount
│   ├── vercel.json           # Single-Page Application (SPA) rewrite rules for Vercel
│   └── vite.config.js        # Vite bundler configuration & local development proxy
└── README.md
```

---

## ✨ Core Features & Implementation

- **Role-Based Access**: 
  - `Public`: Browse charity directory, inspect draw rules, and make direct donations.
  - `Subscriber`: Manage 5 Stableford scores, designate charitable giving (10%–50%), and enroll draw tickets.
  - `Administrator`: Full control over 5 surfaces (Users, Draws & Simulation, Charities, Winner Audits, Reports).
- **Stableford Scoring Engine**: Net points (1–45), 5 latest rounds retained, automatic FIFO replacement on 6th score, and enforced 1 score per date.
- **Audited 3-Tier Draw Engine**: 5-Number Match (40% + Jackpot Rollover), 4-Number Match (35%), and 3-Number Match (25%).
- **Winner Verification & Payout**: Scorecard upload workflow for winners, admin audit (approve/reject), and payout tracking.
- **Dynamic Database**: 100% powered by live Supabase PostgreSQL queries with zero static mock fallbacks.

---

## 🚀 Quick Start Locally

### 1. Database Setup (Supabase)
Paste and run `backend/supabase_schema.sql` in your **Supabase Project Dashboard &rarr; SQL Editor**.

### 2. Backend Server
Create `backend/.env` with your Supabase credentials:
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
```
Then start the server:
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Client
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 Production Deployment

- **Frontend (Vercel)**: Connect repository, set Root Directory to `frontend`, and add `VITE_API_URL=https://your-backend.onrender.com`.
- **Backend (Render / Railway)**: Connect repository, set Root Directory to `backend`, Build Command: `npm install`, Start Command: `npm start`, and configure environment variables.
