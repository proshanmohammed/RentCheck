# RentCheck — Transparent Rental Listings & Verification Platform

RentCheck is an enterprise-grade, full-stack rental listing and verification web application that eliminates hidden fees, duplicate syndication spam, and misleading property claims. The platform standardizes rental pricing into a single **True Monthly Occupancy Cost** (Base Rent + Utilities + Parking + HOA), analyzes duplicate listings using heuristics backed by Google Gemini AI, and enforces an evidence-based verification and moderation workflow without unfair automated blacklisting.

---

## 🚀 Key Features

1. **Standardized Pricing & Fee Breakdown Engine**
   - Eliminates hidden lease surprises by itemizing water/sewer/trash, electricity, gas heating, gigabit internet, assigned garage parking, HOA, and pet rent.
   - Calculates **True Monthly Occupancy Cost** (`Base Rent + Recurring Fees`) and **Upfront Move-In Capital** (`First Month + Security Deposit`).

2. **Side-by-Side Cost Calculator Drawer**
   - Interactive comparison drawer comparing up to 3 listings concurrently.
   - Includes an interactive **Lease Term Simulator** (6, 12, 18, 24 months) showing total occupancy expenditure over time and highlighting the lowest true monthly cost.

3. **Gemini AI & Heuristic Deduplication System**
   - Analyzes newly submitted listings against directory records using `@google/genai` with `gemini-2.5-flash` (or deterministic heuristic fallback).
   - Evaluates normalized street addresses, n-gram description cosine similarity, price anomaly margins, and photo URL reuse.
   - Outputs structured JSON matching the strict schema: `{ isDuplicate, matchedListingId, similarityScore, reasoning }`.

4. **Evidence-Based Landlord Verification Workflow**
   - Property managers and landlords upload municipal deed records, tax statements, and certified agreements.
   - Status transitions cleanly: `unverified` ➔ `pending_review` ➔ `verified` ➔ `flagged_duplicate` ➔ `suspicious`.

5. **Reporting & Compliance Moderation Command Center**
   - Renters can submit suspicious listing reports with specific violation reasons and evidence links.
   - Compliance moderators can review pending duplicate flags, examine community reports, inspect proof documents, and safely clear false positives or confirm duplicates.

6. **Interactive Role Persona Switcher**
   - Seamlessly test seeker, landlord, and compliance moderator experiences with one click in the top navigation bar.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, React Router v6, React Hook Form, Zod.
- **Backend**: Node.js, Express.js (ES Modules), Zod request validation middleware, CORS.
- **AI Engine**: Google GenAI SDK (`@google/genai` with `gemini-2.5-flash`) + heuristic similarity fallback.
- **Database & Auth**: Supabase PostgreSQL with comprehensive schema, relational foreign keys, performance indexes, and Row Level Security (RLS) policies.
- **Resilient Storage Layer**: Built-in high-fidelity memory store pre-seeded with verified properties, duplicate flags, and landlord profiles.

---

## 📁 Project Structure

```plaintext
rentcheck/
├── server/
│   ├── index.js                # Express app entrypoint & middleware
│   ├── db.js                   # Supabase client + resilient storage store
│   ├── routes/
│   │   ├── listings.js         # Listings CRUD, batch compare, duplicate scans
│   │   └── moderation.js       # Moderation queue, flag and report resolutions
│   ├── services/
│   │   └── gemini.js           # @google/genai duplicate detection & heuristics
│   ├── middleware/
│   │   └── validate.js         # Zod schemas & request body validation
│   └── .env                    # Server environment variables
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation & persona switcher
│   │   │   ├── Footer.jsx              # Standards & security disclosures
│   │   │   ├── ListingCard.jsx         # Card with transparent fee summary
│   │   │   ├── FeeBreakdownCard.jsx    # Itemized monthly fee breakdown
│   │   │   ├── CostCalculator.jsx      # Side-by-side comparison drawer
│   │   │   ├── DuplicateWarningBanner.jsx # AI duplicate syndication advisory
│   │   │   ├── ReportModal.jsx         # Suspicious listing report modal
│   │   │   ├── ModerationTable.jsx     # Moderator queue management table
│   │   │   └── VerificationBadge.jsx   # Trust & verification badges
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # Seeker/Landlord/Moderator persona state
│   │   │   └── CompareContext.jsx      # Side-by-side comparison drawer state
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx         # Search hero, stats, featured listings
│   │   │   ├── ListingsPage.jsx        # Searchable directory & filter sidebar
│   │   │   ├── ListingDetailPage.jsx   # Photo gallery, itemized fees, reports
│   │   │   ├── CreateListingPage.jsx   # 4-step wizard with live AI duplicate scan
│   │   │   ├── DashboardPage.jsx       # Landlord/Seeker management dashboard
│   │   │   └── ModerationPage.jsx      # Compliance console & review queue
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql      # PostgreSQL schema, indexes, RLS policies
├── package.json                        # Root scripts runner
└── dev.js                              # Concurrent dev server runner
```

---

## 🔒 Database Schema & Row Level Security (RLS)

The complete SQL migration is located at [`supabase/migrations/001_initial_schema.sql`](file:///c:/antigravity%202/supabase/migrations/001_initial_schema.sql):

- **`profiles`**: User profiles with roles (`seeker`, `landlord`, `moderator`).
- **`listings`**: Standardized rental specifications, base rent, recurring fees, itemized fee JSONB, verification status, and uploaded evidence documents.
- **`duplicate_flags`**: AI deduplication flags linking duplicate listings to original listings with similarity scores and reasoning.
- **`reports`**: Community reports with violation categories, details, evidence URLs, and resolution states.
- **RLS Policies**: Restrict listing modifications to verified owners or moderators, protect private moderation queues, and enforce data isolation.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `server/.env`:
```bash
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgres://postgres:password@localhost:5432/rentcheck
SUPABASE_URL=https://your-supabase.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```
*(Note: If `GEMINI_API_KEY` or Supabase credentials are not provided, the platform automatically utilizes its high-precision heuristic intelligence engine and resilient storage store.)*

### 3. Start Development Servers
```bash
# From workspace root
node dev.js

# Or start individually:
# Backend:
cd server && npm start
# Frontend:
cd client && npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Testing the Core Flows

1. **Explore & Filter**: Visit `/listings`, filter by city (e.g. San Francisco), and observe true monthly costs.
2. **Cost Comparison Drawer**: Click "Compare" on 2 or 3 listings to slide out the side-by-side comparison matrix and test the lease term simulator.
3. **Inspect Duplicate Warning**: View listing `Mission Bay 1BR King St — Special Rent Promo` to see the **DuplicateWarningBanner** highlighting the AI similarity confidence score and reasoning.
4. **Publish Wizard with Duplicate Scan**: Navigate to `/listings/new` and complete the 4-step wizard. Submitting a listing with an address like `260 King Street` will trigger the AI duplicate detection engine and output the structured duplicate analysis.
5. **Report a Listing**: On any listing page, click **"Report Ad"** to open the modal, attach evidence links, and submit for audit.
6. **Compliance Moderation**: Switch your persona to **Elena Rostova (Moderator)** in the top navigation bar and visit `/moderation` to inspect flags, dismiss or confirm duplicate statuses, and verify ownership documents.

---

## 🔐 Google Authentication Setup

RentCheck uses **Supabase Auth** with **Google OAuth 2.0**. Complete the following one-time setup to enable real authentication.

### Step 1 — Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign up or log in.
2. Click **New Project**, choose an organisation, set a project name (e.g. `rentcheck`), pick a region, set a strong database password, and click **Create new project**.
3. Wait ~2 minutes for provisioning to complete.

### Step 2 — Copy your Supabase credentials

In your Supabase dashboard, go to **Settings → API**.

| Setting | Where to find it |
|---|---|
| **Project URL** | "Project URL" box |
| **Anon / public key** | "Project API keys" → `anon` / `public` row |

> ⚠️ **Never** copy the `service_role` key into the frontend. Only the `anon` key belongs in `VITE_SUPABASE_ANON_KEY`.

### Step 3 — Configure Google OAuth in Google Cloud Console

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com) and create (or select) a project.
2. Enable the **Google People API**:
   `APIs & Services → Library → Google People API → Enable`.
3. Create OAuth 2.0 credentials:
   `APIs & Services → Credentials → Create Credentials → OAuth client ID`.
   - Application type: **Web application**
   - Name: `RentCheck`
   - Authorised JavaScript origins:
     - `http://localhost:5173` (local dev)
     - `https://<your-vercel-domain>.vercel.app` (production)
   - Authorised redirect URIs:
     - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
4. Note your **Client ID** and **Client Secret**.

### Step 4 — Add Google OAuth to Supabase

1. In Supabase dashboard → **Authentication → Providers → Google**.
2. Toggle **Google** to **Enabled**.
3. Paste your Google **Client ID** and **Client Secret**.
4. Click **Save**.
5. Supabase will display a **Callback URL** — this is the URL you added to Google in Step 3.

### Step 5 — Add Redirect URLs to Supabase

In Supabase dashboard → **Authentication → URL Configuration**:

| Setting | Value |
|---|---|
| **Site URL** | `http://localhost:5173` (change to your production URL after deploy) |
| **Redirect URLs** | `http://localhost:5173/auth/callback` and `https://<your-vercel-domain>.vercel.app/auth/callback` |

### Step 6 — Add environment variables

**Local development** — create `client/.env` (never commit this):

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Vercel production** — in your Vercel project dashboard:
`Settings → Environment Variables`, add both variables above with your real values.

### Step 7 — Run and test locally

```bash
# Start both services from repo root:
node dev.js
```

1. Navigate to `http://localhost:5173/login`.
2. Click **Continue with Google** — you should be redirected to Google's OAuth page.
3. Sign in with your Google account.
4. You should be redirected to `/auth/callback` then automatically to `/dashboard`.
5. Your name and Google profile photo should appear in the Navbar.
6. Click your avatar → **Sign Out** — you should be redirected to `/`.

### Step 8 — Verify in production

After deploying to Vercel:
1. Update **Supabase → Authentication → URL Configuration → Site URL** to your production domain.
2. Add `https://<your-domain>/auth/callback` to **Redirect URLs**.
3. Add `https://<your-domain>` to the **Authorised JavaScript origins** in Google Cloud Console.
4. Redeploy (Vercel automatically redeploys on `git push`).

### Demo mode (no credentials)

If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not set or are set to placeholder values, RentCheck operates in **demo mode**: all pages remain accessible, the persona switcher works normally, and no auth wall is shown. This is the default behaviour out of the box.

