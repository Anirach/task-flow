# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TaskFlow is a full-stack project management app (Kanban board style) with role-based permissions. Frontend is React 19 + TypeScript + Vite. Backend is Node.js + Express + Prisma ORM + SQLite.

## Commands

### Frontend (root directory)
- `npm run dev` — Start frontend dev server on port 3000 (proxies `/api` to backend)
- `npm run build` — Production build (outputs to `dist/`)
- `npm run lint` — Type-check via `tsc --noEmit`
- `npm run preview` — Preview production build

### Backend (`server/` directory)
- `npm run dev` — Start backend on port 3001 (auto-reloads via `tsx watch`)
- `npm run db:migrate` — Run Prisma migrations
- `npm run db:seed` — Seed database with test data (password: `password123`)
- `npm run db:reset` — Reset database and re-run migrations
- `npm run db:studio` — Open Prisma Studio GUI

### Running both
Start backend first (`cd server && npm run dev`), then frontend (`npm run dev`). The Vite dev server proxies `/api` requests to `localhost:3001`.

## Architecture

### Frontend (`src/`)

**State Management:** Zustand (not Redux). Two stores:
- `src/store/useTaskStore.ts` — All app data + async API-backed actions. Every mutation calls the backend API first, then updates local state. Includes `restoreSession()` for JWT persistence across page refreshes.
- `src/store/useThemeStore.ts` — Light/dark theme toggle, persisted to localStorage.

**API Client:** `src/lib/api.ts` — Fetch wrapper with JWT token management (stored in localStorage). All backend calls go through this module.

**Routing:** React Router v7 in `src/App.tsx`. Lazy-loaded routes with `React.lazy()` + `Suspense`. Public routes (`/`, `/login`) redirect to `/dashboard` when authenticated. Protected routes are wrapped in `<Layout>`.

**Pages:** Dashboard, MyTasks, SearchPage, ProjectBoard, ProjectList, Settings — all lazy-loaded.

**Performance patterns:**
- `useDebounce` hook (`src/hooks/useDebounce.ts`) on search inputs
- `React.memo` on TaskCard and ProjectCard
- `useMemo` for Dashboard stats computation
- Error boundary wrapping page content (`src/components/ErrorBoundary.tsx`)
- Vite manual chunks for dnd-kit, lucide-react, date-fns, react-router

**Path alias:** `@/` maps to the project root (not `src/`), configured in both `vite.config.ts` and `tsconfig.json`.

**Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin. Dark mode uses class strategy.

**Drag and drop:** `@dnd-kit` for Kanban board task and column reordering.

**UI structure:**
- `src/components/ui/` — Reusable primitives (Button, Modal, Badge, Avatar, ProgressBar, SlidePanel)
- `src/components/features/` — Domain components (TaskCard, KanbanColumn, modals)
- `src/components/layout/` — Layout shell (Sidebar, Navbar, Layout with Outlet)
- `src/pages/` — Route-level page components

### Backend (`server/`)

**Stack:** Express + TypeScript + Prisma ORM + SQLite + JWT + bcrypt

**Structure:** 3-layer architecture (routes → controllers → services)
- `server/src/routes/` — Express routers with auth + authorization middleware
- `server/src/controllers/` — Request handling, validation, response formatting
- `server/src/services/` — Business logic, Prisma queries, data transformation
- `server/src/middleware/auth.ts` — JWT verification with 60s in-memory user cache
- `server/src/middleware/authorize.ts` — Project role-based authorization (`requireProjectRole()`)
- `server/src/middleware/errorHandler.ts` — Global error handler with `AppError` class
- `server/src/lib/prisma.ts` — Singleton PrismaClient

**Database:** SQLite via Prisma. Schema at `server/prisma/schema.prisma`.
- Models: User, Project, ProjectColumn, ProjectMember (with role), Task, Comment, Notification
- Key indexes: `(projectId, status)` on Task, `(userId, createdAt)` on Notification

**Authentication:** JWT (7-day expiry) + bcrypt (12 rounds). Token returned on login/register, stored in frontend localStorage.

**Role-Based Permissions:** Project-scoped roles via `ProjectMember.role` field:
- **Admin** — Full access: CRUD project, manage members, add/reorder columns, delete any task
- **Member** — Create/edit tasks, comment, move tasks, delete own tasks. Cannot modify project settings or members.
- **Viewer** — Read-only. Cannot create tasks, comment, or modify anything.

The `requireProjectRole()` middleware enforces these on the backend. Frontend conditionally hides UI elements based on `project.userRole`.

**API Endpoints (all prefixed `/api`):**
- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PATCH /auth/profile`, `PATCH /auth/password`
- Users: `GET /users`
- Projects: `GET/POST /projects`, `GET/PATCH/DELETE /projects/:id`, `POST/PUT /projects/:id/columns`
- Tasks: `GET/POST /tasks`, `GET/PATCH/DELETE /tasks/:id`, `PATCH /tasks/:id/move`
- Comments: `GET/POST /tasks/:taskId/comments`
- Notifications: `GET /notifications`, `PATCH /notifications/:id/read`

### Key Domain Model

Defined in `src/types/index.ts`:
- **Project** has columns (ordered strings for Kanban), memberIds, `userRole` (current user's role), `memberRoles` (map of userId → role)
- **Task** belongs to a project, has status matching a column name. Last column = "Done" for completion counting.
- **ProjectMember** links User to Project with a role (Admin/Member/Viewer). Project creator gets Admin automatically.

### Test Users (seeded)

All use password `password123`:
| Email | Name | Role |
|-------|------|------|
| anirach@taskflow.io | Anirach M. | Team Lead |
| sarah@taskflow.io | Sarah K. | Designer |
| james@taskflow.io | James T. | Developer |
| prae@taskflow.io | Prae N. | Developer |
| leo@taskflow.io | Leo C. | QA Engineer |
