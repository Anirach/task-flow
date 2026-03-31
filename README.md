# TaskFlow

A full-stack project management application with Kanban boards, role-based permissions, and real-time task tracking.

## Features

- **Kanban Board** — Drag-and-drop tasks between columns, reorder columns
- **Project Management** — Create projects, manage members, customize columns
- **Role-Based Permissions** — Admin, Member, and Viewer roles per project
- **Task Management** — Create, edit, move, delete tasks with priorities, labels, due dates
- **Comments** — Comment on tasks with real-time updates
- **Search** — Search tasks by title and description with priority filtering
- **Dark Mode** — Toggle between light and dark themes
- **Settings** — Edit profile, change password, manage appearance

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| State | Zustand |
| Drag & Drop | @dnd-kit |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Database | SQLite |
| Auth | JWT + bcrypt |
| Security | Helmet, CORS, rate limiting, input validation |

## Getting Started

### Prerequisites

- Node.js 20+

### Setup

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install

# Create database and run migrations
npm run db:migrate

# Seed with test data
npm run db:seed
```

### Run

```bash
# Terminal 1: Start backend (port 3001)
cd server
npm run dev

# Terminal 2: Start frontend (port 3000)
npm run dev
```

Open http://localhost:3000

### Test Users

All seeded users use password: `password123`

| Email | Name |
|-------|------|
| anirach@taskflow.io | Anirach M. |
| sarah@taskflow.io | Sarah K. |
| james@taskflow.io | James T. |
| prae@taskflow.io | Prae N. |
| leo@taskflow.io | Leo C. |

## Project Structure

```
task-flow/
├── src/                    # Frontend (React)
│   ├── components/         # UI primitives, features, layout
│   ├── hooks/              # Custom hooks (useDebounce)
│   ├── lib/                # API client
│   ├── pages/              # Route pages
│   ├── store/              # Zustand stores
│   ├── types/              # TypeScript interfaces
│   └── utils/              # Utilities (cn)
├── server/                 # Backend (Express)
│   ├── prisma/             # Schema, migrations, seed
│   └── src/
│       ├── controllers/    # Request handlers
│       ├── middleware/      # Auth, authorization, errors
│       ├── routes/          # Express routers
│       └── services/        # Business logic
├── package.json            # Frontend dependencies
└── vite.config.ts          # Vite + Tailwind + proxy config
```

## Role-Based Permissions

Each project member has a role:

| Action | Admin | Member | Viewer |
|--------|-------|--------|--------|
| View project & tasks | Yes | Yes | Yes |
| Create/edit tasks | Yes | Yes | No |
| Move tasks (drag-and-drop) | Yes | Yes | No |
| Delete tasks | All | Own only | No |
| Add comments | Yes | Yes | No |
| Add/reorder columns | Yes | No | No |
| Edit project settings | Yes | No | No |
| Manage members & roles | Yes | No | No |
| Delete project | Yes | No | No |

## Security

- **Helmet.js** — Security headers (X-Frame-Options, HSTS, X-Content-Type-Options, etc.)
- **CORS** — Restricted to allowed origins only
- **Rate Limiting** — Login: 10 attempts/15min, Register: 5/hour, Password change: 5/15min
- **Input Validation** — Length limits, format checks, and enum validation on all endpoints
- **Body Size Limit** — 1MB max JSON payload
- **Mass Assignment Protection** — Users cannot escalate their own roles
- **JWT** — 24-hour token expiry, bcrypt password hashing (12 rounds), min 8 char passwords
- **Avatar URL Validation** — Only http/https URLs accepted
- **Error Sanitization** — No internal details or stack traces leak to clients
- **Gzip Compression** — Responses compressed for faster delivery
