# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a monorepo with two independent full-stack applications:

- **`/frontend` + `/backend`** — Office Chore Manager: team-based chore scheduling with calendar views, recurring tasks, and notifications
- **`/bench-bark/frontend` + `/bench-bark/backend`** — Bench Bark: dog owner app with AI photo analysis (Gemini) and training lessons

Both apps share the same stack: React 19 + TypeScript + Vite frontend, Node.js + Express + PostgreSQL backend, deployed to Vercel (frontend) and Railway (backend).

## Commands

### Office Chore Manager — Frontend (`/frontend`)
```bash
npm run dev        # Dev server (port 5173)
npm run build      # TypeScript check + Vite build
npm run lint       # ESLint
npm test           # Vitest (single run)
npm run test:watch # Vitest watch
```

### Office Chore Manager — Backend (`/backend`)
```bash
npm run dev          # Dev server with nodemon (port 5000)
npm start            # Production server
npm test             # Jest
npm run migrate:up   # Run migrations
npm run migrate:down # Rollback last migration
```

### Bench Bark — Frontend (`/bench-bark/frontend`)
```bash
npm run dev    # Dev server (port 5173)
npm run build  # TypeScript + Vite build
npm run lint   # ESLint
npm test       # Vitest
```

### Bench Bark — Backend (`/bench-bark/backend`)
```bash
npm run dev          # Dev server with --watch
npm start            # Production server
npm run migrate:up   # Run migrations
npm run seed         # Seed database
```

## Architecture

### Frontend Pattern (both apps)
- **`/api`** — Axios client (`withCredentials: true` for cookie auth) + typed API functions per resource
- **`/store`** — Zustand stores (auth state)
- **`/components`** — Feature-organized (auth, chores/dogs/lessons, layout, ui)
- **`/pages`** — Page-level components consumed by React Router v7
- **`/types`** — Shared TypeScript interfaces
- React Query (`@tanstack/react-query`) handles server state; Zustand handles client state

### Backend Pattern (both apps)
- `routes/` → `controllers/` → `models/` (raw pg queries, no ORM)
- `middleware/` — JWT auth guard, Joi validation, rate limiting
- `services/` — Reusable business logic (AI integration in Bench Bark)
- `db/` — Migration files + pg pool connection

### Authentication
- JWT access token + refresh token, both stored in HTTP-only cookies
- Frontend Axios interceptor catches 401s and attempts token refresh before retrying
- Bench Bark additionally supports Google OAuth

### Key Environment Variables
- **Frontend:** `VITE_API_BASE_URL` (Chore Manager) / `VITE_API_URL` (Bench Bark)
- **Backend shared:** `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`
- **Bench Bark extras:** `GEMINI_API_KEY`, `CLOUDINARY_*`, `GOOGLE_CLIENT_ID`

### Module Systems
- `/backend` uses CommonJS (`require`/`module.exports`)
- `/bench-bark/backend` uses ESM (`import`/`export default`)
