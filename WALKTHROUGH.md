# Walkthrough: ASX DIGITAL SOLUTIONS Full-Stack MERN Agency Platform

We have designed, engineered, and verified a professional, full-stack MERN platform for **ASX DIGITAL SOLUTIONS**. The platform features an ultra-modern dark-cyber corporate aesthetic, responsive layout, animated micro-interactions, client consultation messaging, an online multi-channel billing hub, client review/rating system, and a Role-Based Access Control (RBAC) Admin Dashboard.

---

## 🌟 Highlights & Capabilities

### 1. Modern Agency Public Showcase
- **Animated Hero Section**: Glowing badges, live agency stats (150+ Projects, 99.4% Satisfaction, 15+ Senior Engineers, 24/7 SLA), dual CTAs, and interactive service card preview.
- **Core Services Offered**:
  1. **Full-Stack Web Development** (MERN Stack, Next.js, Cloud APIs)
  2. **Mobile App Development** (React Native, Flutter, iOS & Android)
  3. **Web & UI/UX Design** (Figma, Design Systems, Prototypes)
  4. **Video Editing & Motion Graphics** (Cinematic Ads, 3D VFX, Viral Social Reels)
  5. **Shopify & E-Commerce Solutions** (Shopify 2.0, Headless, Custom Liquid, CRO)
- **Interactive Portfolio & Case Studies**:
  - Filterable by category (Web, App, Shopify, Design, Video Editing).
  - High-res project modal with full screenshots, client names, year, technology tags, and live prototype links.
- **Verified Team & Employee Profiles**:
  - Specialist cards displaying profile photos, designations, bios, skills, and assigned portfolio items.
  - Security note: Profiles are strictly managed and verified by ASX Administration.
- **Client Ratings & Verified Reviews**:
  - Aggregate 5.0 rating breakdown.
  - Testimonial cards with client avatar, company, star rating, and verified badge.
  - Interactive **"Leave Your Review"** modal with star picker and instant feedback submission.
- **Online Multi-Channel Billing Hub**:
  - **Bank Transfer (IBAN)**: Meezan Bank, title, account number, IBAN, swift code with 1-click copy.
  - **Easypaisa**: Mobile account and title with 1-click copy.
  - **JazzCash**: Mobile account and title with 1-click copy.
  - **Credit / Debit Card Simulator**: Card checkout with instant digital receipt generator.
  - **Payoneer & PayPal**: Direct account details with 1-click copy.
  - **Invoice Lookup & Payment Verification**: Clients can search by Invoice # (e.g. `ASX-2026-001` or `ASX-PK-809`) and submit payment proof (transaction ID/screenshot) for admin confirmation.
- **Consultation & Messaging Hub**:
  - Comprehensive project proposal form with service selector, budget slider, timeline, and scope description.
  - Floating **"Chat with ASX"** quick inquiry widget for rapid client messaging.

---

### 2. Role-Based Admin Dashboard (RBAC)
- **Portal Access**: Click **"Portal Login"** in the top navigation bar.
- **Pre-Configured Accounts**:
  - **Super Admin**: `admin@asxdigital.com` / `Admin@ASX2026` (Full access to all sections).
  - **Sub-Admin / Manager**: `manager@asxdigital.com` / `Manager@ASX2026` (Custom permissions).
- **Staff & Permission Delegation**:
  - Admin can add new staff/managers.
  - Admin can toggle granular permissions per user:
    - `can_manage_services`
    - `can_manage_portfolio`
    - `can_manage_team` (Only Admin or permitted staff can edit employee profiles/portfolios)
    - `can_manage_reviews` (Approve/reject client feedback)
    - `can_manage_messages` (Inquiry inbox & staff follow-up replies)
    - `can_manage_billing` (Edit Bank, Easypaisa, JazzCash, Card, Payoneer, PayPal info, and generate invoices)
    - `can_manage_users` (Super Admin privilege to manage roles)
- **Payment Gateway Editor**: Admin can edit Bank, Easypaisa, JazzCash, PayPal, and Payoneer details dynamically; changes instantly reflect on the public website.
- **Client Invoices & Settlement**: Generate client invoices and review submitted payment proofs with 1-click "Mark Paid".

---

## 🛠️ Verification & Testing Results

| Test Item | Endpoint / Action | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Server Health** | `GET /api/health` | **PASS** | Responding with HTTP 200 and agency metadata |
| **Super Admin Auth** | `POST /api/auth/login` | **PASS** | Valid JWT token generated |
| **RBAC Enforcement** | `PUT /api/auth/users/:id/permissions` | **PASS** | Super Admin successfully delegated permissions |
| **Services API** | `GET /api/services` | **PASS** | Loaded 5 flagship agency services |
| **Portfolio API** | `GET /api/portfolio` | **PASS** | Loaded 6 case studies with category filtering |
| **Team Profiles** | `GET /api/team` | **PASS** | Loaded 5 specialists with bios, skills, and portfolios |
| **Reviews Engine** | `POST /api/reviews` & `GET /api/reviews` | **PASS** | Client review submitted into approval queue |
| **Billing Hub** | `GET /api/billing/methods` | **PASS** | All 6 payment channels loaded |
| **Invoice Search** | `GET /api/billing/invoices/search` | **PASS** | Found `ASX-2026-001` with breakdown |
| **Payment Proof** | `POST /api/billing/invoices/verify-proof` | **PASS** | Status updated to 'Under Review' |
| **Client Messaging** | `POST /api/messages` | **PASS** | Consultation inquiry saved to admin inbox |
| **Vite Production Build** | `npm run build` | **PASS** | Transformed 1591 modules in 29s with 0 errors |
| **Live Web Server** | `http://localhost:3000` | **PASS** | HTTP 200, full responsive UI rendering |

---

## 🚀 How to Run & Use the Application

1. **Backend Server**:
   ```bash
   cd server
   npm start
   # Server runs on http://localhost:5000
   ```
2. **Frontend Client**:
   ```bash
   cd client
   npm run dev
   # Website runs on http://localhost:3000
   ```
3. **Login to Admin Dashboard**:
   - Open [http://localhost:3000](http://localhost:3000)
   - Click **"Portal Login"** in the top-right corner.
   - Click the 1-click button **"👑 Super Admin"** to pre-fill credentials (`admin@asxdigital.com` / `Admin@ASX2026`).
   - Click **"Sign In to Control Center"** to access the complete Admin Dashboard.
