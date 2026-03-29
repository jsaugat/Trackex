# Trackex — Expense & Revenue Tracker

Trackex is a MERN stack expense and revenue tracking application designed for organizations to monitor transactions, analyze trends, and manage budgets. This upgraded version transforms the original single-store tracker into a **real multi-tenant system** with polished UX, interactive charts, export capabilities, and advanced reporting.

---

## Features

### Multi-Tenant Support

- Real organization separation via `orgId` in users, transactions, categories, budgets, and audit logs
- Each user's data is scoped to their organization — no cross-org data leakage
- Admins manage users within their organization only
- Organization displayed in navbar for context

### Transactions

- Full CRUD for revenue and expenses
- Categories can be created dynamically
- Date range and category filters
- Drill-down charts: clicking chart elements filters tables dynamically
- Table of top products, categories, and customers
- Net profit computation and analytics per org

### Dashboard & Charts

- Line charts for revenue and expenses (7/14/30 days)
- Bar charts for category totals
- Interactive tooltips with delta vs previous periods
- Charts respond to filters, date ranges, and category selection
- Skeleton loaders and empty/error states for better UX

### Budgets

- Per-category monthly budgets per organization
- Progress bars indicate usage with color thresholds (green → amber → red)
- Remaining amount and % used shown alongside each category
- Subtle prompts to set budgets if none exist

### Audit Log

- Tracks create/edit/delete actions for transactions, budgets, and user roles
- Admin-only timeline view of recent activities
- Reusable logging system integrated into backend controllers

### Export & Reports

- CSV export respecting active filters
- PDF report captures KPI cards and chart snapshots
- Provides quick offline summaries for any date range

### Mobile & Responsive Design

- Sidebar collapses to bottom tab bar on mobile
- Transaction modal goes full-screen
- Charts scroll horizontally on small screens
- Dashboard KPI cards stack correctly

---

## Tech Stack

- **Frontend:** React, Redux Toolkit, RTK Query, shadcn UI components
- **Backend:** Node.js, Express, MongoDB Atlas
- **Authentication:** JWT
- **Export/Reports:** jsPDF, html2canvas
- **Deployment:** Vercel

---

## Getting Started

1. Clone the repo:

   ```bash
   git clone <repo-url>
   cd trackex
   ```

2. Install Dependencies

   `bun install`

3. Set environment variables in `.env`:
   - `MONGO_URL`
   - `JWT_SECRET_KEY`
   - `CORS_ORIGIN`
   - `CLIENT_URL`
   - `ENABLE_GUEST_LOGIN=true`
   - `GUEST_LOGIN_EMAIL=guest@trackex.com`

4. Start development servers:
   `bun run client` & `bun run server`

---

## Demo & Guest Access

- Login page includes **Continue as Guest** for instant access (no email/password/OTP input).
- Backend endpoint: `POST /api/auth/guest`.
- Endpoint is available only when `ENABLE_GUEST_LOGIN=true`.
- Demo account is resolved from `GUEST_LOGIN_EMAIL` (default `guest@trackex.com`).

Seed demo org + guest data:

```bash
cd server
MONGO_URL=<your-mongo-uri> ENABLE_GUEST_LOGIN=true GUEST_LOGIN_EMAIL=guest@trackex.com node scripts/seedOrgData.js
```

Demo credentials (fallback login, if needed):

- `guest@trackex.com / guest123`

## Miscelleanous

### My learnings:

- MongoDB Transaction Session
- DB Indexing
