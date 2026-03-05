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

3. Set environment variables in .env (MongoDB URI, JWT secret, etc.)

4. Start development servers:
   `bun run client` & `bun run server`

---

## Demo & Guest Access

**Guest login:** `guest@trackex.com` / `guest123`

Guest users access pre-seeded realistic 90-day transaction data across categories, allowing exploration of charts, budgets, and audit logs without creating an account.

## Miscelleanous

### My learnings:

- MongoDB Transaction Session
- DB Indexing
