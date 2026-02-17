# Bench Bark

A dog owner web app for managing dog profiles with AI-powered breed/age detection and browsing training lessons.

## Structure

- `backend/` — Node.js/Express API
- `frontend/` — React + TypeScript + Vite

## Getting Started

### Backend

```bash
cd backend
cp .env.example .env  # Fill in your values
npm install
npm run migrate:up
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deployment

- **Frontend:** Vercel
- **Backend:** Railway (PostgreSQL included)
