# ShopSphere Commerce Platform

> InternX Virtual Internship — Sprint 01  
> A lightweight, self-hosted e-commerce platform for small retailers.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Seed Data](#seed-data)
- [Running Tests](#running-tests)
- [CI/CD](#cicd)
- [Contribution Guidelines](#contribution-guidelines)

---

## Project Overview

ShopSphere is a full-stack e-commerce application built as part of the InternX virtual internship programme. It includes a public storefront, shopping cart, Stripe-powered checkout, order management, and a merchant admin dashboard.

**This repository contains the legacy codebase.** Interns are expected to implement missing features, fix bugs, and add test coverage according to the sprint task backlog.

---

## Tech Stack

| Layer      | Technology              | Purpose                                    |
|------------|-------------------------|--------------------------------------------|
| Frontend   | Next.js 14 + React      | App router, SSR, client components         |
| Styling    | Tailwind CSS            | Utility-first responsive layouts           |
| State      | Zustand                 | Global cart and auth state                 |
| Data fetch | SWR                     | Stale-while-revalidate hooks               |
| Backend    | FastAPI (Python 3.11)   | REST API, automatic OpenAPI docs           |
| Database   | Supabase (PostgreSQL)   | Auth, RLS, real-time                       |
| Payments   | Stripe (test mode)      | PaymentIntents, webhooks, Elements UI      |
| Email      | Resend SDK              | Transactional order confirmation emails    |
| Testing    | Playwright              | Browser-level E2E automation               |
| CI/CD      | GitHub Actions          | Lint, test, build on every PR              |

---

## Repository Structure

```
shopsphere/
├── frontend/          # Next.js 14 application
├── backend/           # FastAPI Python application
├── e2e/               # Playwright end-to-end tests
├── docs/              # Project documentation
├── infra/             # Infrastructure config
└── .github/           # GitHub Actions workflows
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker (optional, for local Supabase)
- Stripe CLI (for webhook testing)

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Runs on `http://localhost:3000`

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`

---

## Environment Variables

### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Backend (`backend/.env`)

```
DATABASE_URL=postgresql://...
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
JWT_SECRET=your_jwt_secret
ENVIRONMENT=development
```

---

## Seed Data

Populate the database with 30 realistic products across four categories:

```bash
make seed
```

Or manually:

```bash
cd backend
python scripts/seed_products.py
```

The script is idempotent — running it multiple times will not create duplicates. It uses Supabase upsert logic keyed on the product name slug.

---

## Running Tests

### Backend unit tests

```bash
cd backend
pytest tests/ -v --cov=app --cov-report=term-missing
```

### Playwright E2E

```bash
cd e2e
npx playwright install
npx playwright test
```

### Frontend component tests

```bash
cd frontend
npm run test
```

---

## CI/CD

Every pull request triggers the GitHub Actions pipeline:

1. **Lint** — ESLint (frontend) + Ruff (backend)
2. **Type check** — TypeScript check
3. **Unit tests** — pytest + React Testing Library
4. **E2E tests** — Playwright in headless Chromium

PRs are blocked from merging if any step fails.

---

## Contribution Guidelines

- Branch naming: `<github-username>-<role>-dev`
- Every task must be delivered as a PR against `main`
- Link the task card ID in your PR title (e.g., `feat(FE-01): add ProductCard component`)
- Commit convention: `feat|fix|test|chore(<TASK-ID>): description`
- No force-pushing to `main`
- QA testers must sign off on backend PRs before merge

---

© 2025 InternX · ShopSphere Commerce Platform