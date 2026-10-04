# learning-react

A full-stack learning project — a personal finance dashboard with a Next.js 16 frontend and an Express 4 backend. The UI explores three different dashboard layout variants (A/B/C) switchable at runtime.

## Project structure

```
learning-react/
├── frontend/          # Next.js 16 app (React 19, Tailwind v4, shadcn/ui)
├── backend/           # Express 4 REST API (TypeScript)
├── docs/              # Supplementary documentation
└── start.sh           # Convenience script — starts both servers together
```

## Prerequisites

- Node.js ≥ 20
- npm ≥ 10

## Quick start

```bash
# Install dependencies for both projects
cd frontend && npm install && cd ../backend && npm install && cd ..

# Start both servers with a single command
./start.sh
```

| Server   | URL                         |
|----------|-----------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://127.0.0.1:4000       |

The frontend proxies all `/api/*` requests to the backend automatically via `next.config.ts`.

---

## Frontend (`frontend/`)

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui

### Key pages

| Route | Description |
|---|---|
| `/` | Login page — email + password form |
| `/prototype/dashboard?variant=A` | Finance dashboard, Card grid layout |
| `/prototype/dashboard?variant=B` | Finance dashboard, Sidebar + detail layout |
| `/prototype/dashboard?variant=C` | Finance dashboard, Statement strip layout |

Use the floating switcher at the bottom of the dashboard (or `←` / `→` arrow keys) to cycle between variants.

### Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

---

## Backend (`backend/`)

**Stack:** Express 4 · TypeScript · cookie-parser · CORS

### API routes

| Method | Route | Auth required | Description |
|--------|-------|:---:|---|
| `GET` | `/health` | No | Health check — returns `{ status: "ok" }` |
| `POST` | `/auth/login` | No | Login — sets httpOnly `userId` cookie |
| `POST` | `/auth/logout` | No | Logout — clears `userId` cookie |
| `GET` | `/users/me` | Yes | Returns authenticated user profile (no password) |
| `GET` | `/users/me/accounts` | Yes | Returns savings account + credit cards |

Authentication uses an httpOnly cookie (`userId`) set on login. All `/users/*` routes require it.

### Scripts

```bash
npm run dev          # Start dev server with hot-reload (http://127.0.0.1:4000)
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled output
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

---

## Testing

Both projects use **Vitest**. The backend additionally uses **Supertest** for HTTP-level integration tests. Test files live co-located next to the source they cover (e.g. `auth.test.ts` next to `auth.ts`).

### Run all tests

```bash
# Backend — 13 tests
cd backend && npm test

# Frontend — 20 tests
cd frontend && npm test
```

### What is covered

| Layer | File | Tests | What it covers |
|---|---|:---:|---|
| Backend | `src/routes/auth.test.ts` | 6 | Login validation, 400/401 errors, cookie set on success, logout clears cookie |
| Backend | `src/routes/users.test.ts` | 7 | Auth guard (401), `/me` profile (password omitted), `/me/accounts` shape + data isolation |
| Frontend | `src/components/usage-bar.test.tsx` | 6 | Rendered text, green/amber/red colour thresholds, bar width, over-limit edge case |
| Frontend | `src/components/prototype-switcher.test.tsx` | 7 | Label rendering, prev/next navigation, wrap-around, hidden in production |
| Frontend | `src/app/page.test.tsx` | 7 | Form render, error on bad login, network error fallback, redirect on success, error clears on re-type, loading state, Enter key submits |

### Test file placement and production builds

Test files are **never included in production output**:

- **Frontend (Next.js):** The bundler only follows the import graph from pages/layouts. `*.test.tsx` files are never imported, so they produce zero bytes in the build.
- **Backend (tsc):** `*.test.ts` files are excluded in `tsconfig.json`, so they are not compiled into `dist/`.

---

## Seed users

The backend ships with three in-memory users for local development:

| Name | Email | Password |
|---|---|---|
| Alex Morgan | `alex.morgan@example.com` | `password123` |
| Jamie Lee | `jamie.lee@example.com` | `letmein456` |
| Sam Taylor | `sam.taylor@example.com` | `qwerty789` |
