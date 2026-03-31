# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TaskFlow is a project management app (Kanban board style) built with React 19, TypeScript, and Vite. It uses mock data with no backend — all state lives in Zustand stores in-memory. Originally scaffolded via Google AI Studio.

## Commands

- `npm run dev` — Start dev server on port 3000
- `npm run build` — Production build (outputs to `dist/`)
- `npm run lint` — Type-check via `tsc --noEmit` (no ESLint configured)
- `npm run preview` — Preview production build

## Architecture

**State Management:** Zustand (not Redux). Two stores:
- `src/store/useTaskStore.ts` — All app data (projects, tasks, users, comments, notifications) plus auth state. This is the central store; most components read from here.
- `src/store/useThemeStore.ts` — Light/dark theme toggle, persisted to localStorage.

**Routing:** React Router v7 in `src/App.tsx`. Public routes (`/`, `/login`) redirect to `/dashboard` when authenticated. Protected routes are wrapped in `<Layout>` which provides sidebar + navbar.

**Data:** All data is mock, defined in `src/data/mockData.ts`. No API calls, no backend. Auth is simulated — `login()` just sets `isAuthenticated: true` and picks a user by email.

**Path alias:** `@/` maps to the project root (not `src/`), configured in both `vite.config.ts` and `tsconfig.json`.

**Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin. Dark mode uses class strategy (`document.documentElement.classList`).

**Drag and drop:** `@dnd-kit` for Kanban board task reordering.

**UI structure:**
- `src/components/ui/` — Reusable primitives (Button, Modal, Badge, Avatar, ProgressBar, SlidePanel)
- `src/components/features/` — Domain components (TaskCard, KanbanColumn, modals)
- `src/components/layout/` — Layout shell (Sidebar, Navbar, Layout with Outlet)
- `src/pages/` — Route-level page components

**Key domain model** (defined in `src/types/index.ts`): Projects have columns (string array representing Kanban columns). Tasks belong to a project and have a status matching one of the project's column names. The last column is treated as "Done" for completion counting.
