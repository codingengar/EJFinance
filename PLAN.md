# EJ Finance — Implementation Plan

This document outlines the phased implementation plan for the EJ Finance frontend application. It is derived from the project README and backend documentation, and coordinates with the FastAPI backend in `../backend/`.

---

## Application Overview

**EJ Finance** is a personal finance management application that provides:

- Expense and income tracking
- Category management
- Account/payment method tracking
- Budget planning and monitoring
- Analytics and reporting
- Recurring transaction management
- Receipt attachment support

---

## Tech Stack (Frontend)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui or MUI |
| Forms | React Hook Form |
| Charts | Recharts |
| API Client | Fetch / axios (TBD) |

**Current state:** Next.js 16 with Tailwind CSS is initialized. Component library, forms, and charts are not yet installed.

---

## Implementation Phases

### Phase 1: Foundation & Project Setup (Week 1)

**Goal:** Establish project structure, API integration, and development workflow.

| Task | Description | Dependencies |
|------|-------------|--------------|
| 1.1 | Install and configure shadcn/ui | — |
| 1.2 | Install React Hook Form, Recharts, and API client | — |
| 1.3 | Create environment variables (e.g. `NEXT_PUBLIC_API_URL`) | Backend running |
| 1.4 | Set up API client module with base URL and auth headers | 1.3 |
| 1.5 | Define shared TypeScript types for API responses | Backend schemas |
| 1.6 | Configure layout (root layout, navigation shell) | 1.1 |

**Deliverables:** Project ready for feature development; API client and types in place.

---

### Phase 2: Authentication (Week 1–2)

**Goal:** Implement login, registration, and protected routes.

| Task | Description | Dependencies |
|------|-------------|--------------|
| 2.1 | Create auth context/provider for user state and tokens | — |
| 2.2 | Implement login page and form | 2.1, 1.4 |
| 2.3 | Implement registration page and form | 2.1, 1.4 |
| 2.4 | Implement token storage (e.g. httpOnly cookie or localStorage) | 2.1 |
| 2.5 | Create auth middleware for protected routes | 2.1 |
| 2.6 | Build user profile page and profile update form | 2.1, Backend `/users/me` |
| 2.7 | Add logout and redirect logic | 2.1 |

**Backend endpoints:** `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`

**Deliverables:** Users can register, log in, view/update profile, and access protected pages.

---

### Phase 3: Categories (Week 2)

**Goal:** Manage expense and income categories.

| Task | Description | Dependencies |
|------|-------------|--------------|
| 3.1 | Create categories API service (CRUD) | 1.4, 2.1 |
| 3.2 | Build category list view with table/list component | 3.1, 1.1 |
| 3.3 | Build category create/edit form (modal or page) | 3.1, 1.2 |
| 3.4 | Add category delete with confirmation dialog | 3.1 |
| 3.5 | Create category selector component for reuse in forms | 3.1 |

**Backend endpoints:** `GET/POST /api/v1/categories/`, `GET/PUT/DELETE /api/v1/categories/{id}`

**Deliverables:** Full category CRUD UI; reusable category selector.

---

### Phase 4: Transactions — MVP (Week 2–3)

**Goal:** Core expense and income entry and listing.

| Task | Description | Dependencies |
|------|-------------|--------------|
| 4.1 | Create transactions API service (CRUD) | 1.4, 2.1 |
| 4.2 | Build transaction entry form (expense) | 4.1, 3.5, 1.2 |
| 4.3 | Build transaction entry form (income) | 4.1, 3.5, 1.2 |
| 4.4 | Create transaction list view with basic table | 4.1, 1.1 |
| 4.5 | Implement edit transaction (inline or modal) | 4.1 |
| 4.6 | Implement delete transaction with confirmation | 4.1 |
| 4.7 | Add date and amount validation (client-side) | 4.2, 4.3 |

**Backend endpoints:** `GET/POST /api/v1/transactions/`, `GET/PUT/DELETE /api/v1/transactions/{id}`

**Deliverables:** MVP — users can add, view, edit, and delete expenses and income.

---

### Phase 5: Accounts & Payment Methods (Week 3–4)

**Goal:** Manage accounts and link transactions to them.

| Task | Description | Dependencies |
|------|-------------|--------------|
| 5.1 | Create accounts API service (CRUD) | 1.4, 2.1 |
| 5.2 | Build account management UI (list, create, edit, delete) | 5.1 |
| 5.3 | Add account selector to transaction forms | 5.1, 4.2, 4.3 |
| 5.4 | Implement account balance display logic | 5.1, 4.1 |
| 5.5 | Show account balances in dashboard or sidebar | 5.4 |

**Backend endpoints:** `GET/POST /api/v1/accounts/`, `GET/PUT/DELETE /api/v1/accounts/{id}`

**Deliverables:** Account CRUD; transactions linked to accounts; balance display.

---

### Phase 6: Search & Filtering (Week 4–5)

**Goal:** Filter and paginate transaction lists.

| Task | Description | Dependencies |
|------|-------------|--------------|
| 6.1 | Add query params to transactions API (date range, category, account, amount) | 4.1 |
| 6.2 | Build filter UI (date picker, category dropdown, account dropdown) | 6.1 |
| 6.3 | Implement pagination for transaction list | 6.1 |
| 6.4 | Add sorting (date, amount, category) | 6.1 |
| 6.5 | Centralize filter state (e.g. URL params or context) | 6.2 |

**Deliverables:** Filterable, sortable, paginated transaction list.

---

### Phase 7: Dashboard & Analytics (Week 5–6)

**Goal:** Visualize spending and income.

| Task | Description | Dependencies |
|------|-------------|--------------|
| 7.1 | Create aggregation API helpers (by category, by month, income vs expense) | Backend aggregation endpoints |
| 7.2 | Build dashboard layout with summary cards | 7.1, 1.1 |
| 7.3 | Implement category spending pie chart (Recharts) | 7.1, 1.2 |
| 7.4 | Implement monthly spending line chart | 7.1 |
| 7.5 | Implement income vs expenses bar chart | 7.1 |
| 7.6 | Add date range selector for analytics | 7.1 |

**Deliverables:** Dashboard with summary cards and charts.

---

### Phase 8: Budgeting (Week 6)

**Goal:** Set budgets and track progress.

| Task | Description | Dependencies |
|------|-------------|--------------|
| 8.1 | Create budgets API service (CRUD) | 1.4, 2.1 |
| 8.2 | Build budget management UI | 8.1 |
| 8.3 | Implement budget vs actual comparison logic | 8.1, 4.1 |
| 8.4 | Add budget progress indicators (e.g. progress bars) | 8.3 |
| 8.5 | Add budget warnings/alerts | 8.3 |

**Backend endpoints:** `GET/POST /api/v1/budgets/`, `GET/PUT/DELETE /api/v1/budgets/{id}`

**Deliverables:** Budget CRUD; budget vs actual display; progress and alerts.

---

### Phase 9: Recurring Transactions (Week 6–7)

**Goal:** Manage and display recurring expenses/income.

| Task | Description | Dependencies |
|------|-------------|--------------|
| 9.1 | Create recurring transactions API service | 1.4, 2.1 |
| 9.2 | Build recurring transaction management UI | 9.1 |
| 9.3 | Add frequency options (daily, weekly, monthly, yearly) | 9.2 |
| 9.4 | Display upcoming recurring expenses (if backend supports) | 9.1 |

**Deliverables:** Recurring transaction CRUD; frequency selection; upcoming list (if applicable).

---

### Phase 10: Data Export/Import (Week 7)

**Goal:** CSV export and import.

| Task | Description | Dependencies |
|------|-------------|--------------|
| 10.1 | Implement CSV export (call backend or client-side) | 4.1 |
| 10.2 | Implement CSV import with validation and preview | Backend import endpoint |
| 10.3 | Add error handling for malformed files | 10.2 |
| 10.4 | Build import confirmation UI | 10.2 |

**Deliverables:** Export and import flows with validation and feedback.

---

### Phase 11: Receipt Attachments (Week 7–8)

**Goal:** Attach and view receipts for transactions.

| Task | Description | Dependencies |
|------|-------------|--------------|
| 11.1 | Integrate file upload in transaction forms | Backend upload endpoint |
| 11.2 | Display receipt images in transaction details | 11.1 |
| 11.3 | Add file size and type validation | 11.1 |
| 11.4 | Optional: image gallery view | 11.2 |

**Backend:** Azure Blob Storage integration; upload endpoint.

**Deliverables:** Receipt upload and display; basic validation.

---

### Phase 12: Polish & Deployment (Week 8)

**Goal:** Production-ready deployment and UX polish.

| Task | Description | Dependencies |
|------|-------------|--------------|
| 12.1 | Configure production environment variables | — |
| 12.2 | Set up Vercel or Azure Static Web Apps deployment | — |
| 12.3 | Configure CORS and API URL for production | Backend |
| 12.4 | Add loading states and error boundaries | All phases |
| 12.5 | Responsive design review and fixes | All phases |
| 12.6 | End-to-end testing in production | 12.2 |

**Deliverables:** Deployed app; improved error handling and responsiveness.

---

## Milestones

| Milestone | Phase | Target |
|-----------|-------|--------|
| **MVP** | Phases 1–4 | Week 3 — Core expense/income tracking |
| **Full Core** | Phases 1–6 | Week 5 — Accounts, search, filtering |
| **Analytics** | Phases 1–8 | Week 6 — Dashboard, budgets |
| **Feature Complete** | Phases 1–11 | Week 8 — Recurring, export/import, receipts |
| **Production** | Phase 12 | Week 8+ — Deployed and polished |

---

## Suggested Frontend Structure

```
frontend/
├── app/
│   ├── (auth)/           # Login, register
│   ├── (dashboard)/      # Protected routes
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── categories/
│   │   ├── accounts/
│   │   └── budgets/
│   ├── layout.tsx
│   └── page.tsx          # Landing or redirect
├── components/
│   ├── ui/               # shadcn components
│   ├── forms/
│   ├── charts/
│   └── layout/
├── lib/
│   ├── api.ts            # API client
│   ├── auth.ts           # Auth utilities
│   └── types.ts          # Shared types
├── hooks/
└── contexts/
```

---

## Dependencies to Add

```bash
# Component library
npx shadcn@latest init

# Forms & validation
npm install react-hook-form @hookform/resolvers zod

# Charts
npm install recharts

# API client (optional)
npm install axios
# or use native fetch with a thin wrapper
```

---

## Notes

- **MVP first:** Phases 1–4 deliver a usable expense/income tracker.
- **Backend alignment:** Backend API structure is documented in `../backend/README.md`.
- **Local dev:** Backend runs via Docker Compose (`../backend/docker-compose.yml`); frontend uses `npm run dev`.
- **Database:** PostgreSQL + NocoDB in Docker; frontend talks to FastAPI at `http://localhost:8000`.
