# EJ Finance

A personal finance management application built with Next.js and FastAPI, designed to help you track expenses, manage budgets, and analyze your spending patterns.

## Overview

EJ Finance is a full-stack financial tracking application that provides:
- Expense and income tracking
- Category management
- Account/payment method tracking
- Budget planning and monitoring
- Analytics and reporting
- Recurring transaction management
- Receipt attachment support

## Tech Stack

### Frontend
- **Next.js 16.1.6** (App Router) - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui or MUI** - Component library
- **React Hook Form** - Form management
- **Recharts** - Data visualization

### Backend
- **FastAPI** - Modern Python web framework
  - Automatic OpenAPI documentation
  - Built-in data validation with Pydantic
  - Async support for better performance
  - Type hints throughout
  - Easy CORS configuration
  - JWT authentication support
- **SQLAlchemy/SQLModel** - ORM for database operations
- **Pydantic** - Data validation
- **python-jose** - JWT token handling
- **Alembic** - Database migrations

### Database
- **PostgreSQL** - Relational database
  - Supabase (managed Postgres, production)
  - Local PostgreSQL (development)

### Deployment
- **Render** - FastAPI backend hosting (see `render.yaml`)
- **Vercel** - Next.js frontend hosting
- **Supabase** - Production database (managed Postgres)
- **Azure Blob Storage** - Receipt file storage

## Project Structure

```
EJFinance/
├── frontend/              # Next.js application (Dockerfile, docker-entrypoint.sh)
├── backend/               # FastAPI application (Dockerfile)
├── docker-compose.yml     # Local full-stack development (db, backend, frontend)
└── README.md              # This file
```

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Docker Compose v2) — recommended for local full-stack development
- Node.js 18+ and npm/yarn (for running the frontend outside Docker)
- Python 3.10+ (for running the backend outside Docker)
- PostgreSQL 14+ (for running the database outside Docker)
- Git clone of this repository

Run Docker commands from the **repository root** unless noted otherwise.

### Docker Development

Local full-stack development using Docker Compose: PostgreSQL, FastAPI backend, and Next.js frontend.

#### Architecture

`docker-compose.yml` at the repository root defines three services and two named volumes.

**Startup order:** `db` starts first and must pass its healthcheck. `backend` starts only after `db` is healthy. `frontend` starts after `backend` is up (no healthcheck on backend or frontend).

```
┌─────────────────────────────────────────────────────────────┐
│  docker compose (repo root)                                  │
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────────┐  │
│  │ db           │   │ backend      │   │ frontend        │  │
│  │ postgres:14  │──►│ FastAPI      │──►│ Next.js dev     │  │
│  │ :5432        │   │ :8000        │   │ :3000           │  │
│  │ healthcheck  │   │ --reload     │   │ 0.0.0.0 bind    │  │
│  └──────────────┘   └──────────────┘   └─────────────────┘  │
│         │                  │                    │            │
│  postgres_data      ./backend:/app      ./frontend:/app      │
│  (named volume)     + env_file          + frontend_node_     │
│                                         modules (named vol.) │
└─────────────────────────────────────────────────────────────┘
```

| Service  | Container name       | Image / build        | Host URL                          |
|----------|----------------------|----------------------|-----------------------------------|
| Frontend | `ejfinance_frontend` | `build: ./frontend`  | http://localhost:3000             |
| Backend  | `ejfinance_backend`  | `build: ./backend`   | http://localhost:8000             |
| API docs | —                    | —                    | http://localhost:8000/api/docs    |
| Database | `ejfinance_db`       | `postgres:14`        | `localhost:5432`                  |

##### Compose services reference

| Service | Ports | Depends on | Notes |
|---------|-------|------------|-------|
| `db` | `5432:5432` | — | Healthcheck: `pg_isready -U ejfinance_user` (10s interval, 5s timeout, 5 retries) |
| `backend` | `8000:8000` | `db` (`service_healthy`) | Command: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`; bind mount `./backend:/app`; `env_file: ./backend/.env` |
| `frontend` | `3000:3000` | `backend` | Command: `npm run dev -- --hostname 0.0.0.0`; bind mount `./frontend:/app`; `node_modules` on named volume |

**Named volumes:** `postgres_data`, `frontend_node_modules` (declared under top-level `volumes:`).

#### Docker files

| Path | Purpose |
|------|---------|
| `docker-compose.yml` | Orchestrates all services, volumes, and networking |
| `backend/Dockerfile` | Python 3.11 image; installs `requirements.txt` |
| `frontend/Dockerfile` | Node 20 Alpine image; runs `npm ci` at build time; entrypoint syncs deps on start |
| `frontend/docker-entrypoint.sh` | Runs `npm ci` and symlinks `node_modules` for Turbopack CSS resolution |
| `frontend/.dockerignore` | Excludes `node_modules`, `.next`, etc. from frontend image |

##### Volume strategy

- **Database** — `postgres_data` persists PostgreSQL data across restarts.
- **Backend** — `./backend` is bind-mounted to `/app` with `--reload` for live code changes.
- **Frontend** — `./frontend` is bind-mounted to `/app`, but `node_modules` lives in a separate named volume (`frontend_node_modules`) so host and container dependencies do not conflict.

#### First-time setup

##### 1. Backend environment file

Create `backend/.env` before starting. At minimum, set a secret key:

```bash
# backend/.env (example — adjust as needed)
SECRET_KEY=your-local-dev-secret-key
```

Compose loads `env_file: ./backend/.env` on the backend service, then applies inline `environment` entries. **`DATABASE_URL` and `DEBUG` in compose override the same keys in `.env`.** Other variables (e.g. `SECRET_KEY`) come from `.env` only unless you add them to compose.

Default database credentials (from compose):

| Variable | Value |
|----------|-------|
| User | `ejfinance_user` |
| Password | `ejfinance_pass` |
| Database | `ejfinance_db` |
| Connection (inside Docker) | `postgresql://ejfinance_user:ejfinance_pass@db:5432/ejfinance_db` |

See `backend/README.md` and [Environment variables (Docker)](#environment-variables-docker) for more.

##### 2. Build and start all services

```bash
docker compose up -d --build
```

##### 3. Initialize the database (first run only)

Wait until `db` is healthy and `backend` is running (`docker compose ps` — backend has no healthcheck), then run migrations and seed default categories:

```bash
docker compose exec backend alembic upgrade head
docker compose exec backend python scripts/init_db.py
```

##### 4. Open the app

- Frontend: http://localhost:3000
- API: http://localhost:8000
- Swagger UI: http://localhost:8000/api/docs

#### Daily commands

##### Start / stop

```bash
# Start all services (foreground, with logs)
docker compose up

# Start all services (detached)
docker compose up -d

# Start only database + API (no frontend)
docker compose up -d db backend

# Stop all services (containers removed, volumes kept)
docker compose down

# Stop and remove volumes (⚠️ deletes database + frontend node_modules)
docker compose down -v
```

##### Rebuild after Dockerfile or dependency changes

```bash
# Rebuild and recreate all services
docker compose up -d --build

# Rebuild only the frontend
docker compose up -d --build frontend

# Rebuild only the backend
docker compose up -d --build backend
```

##### Restart a single service

```bash
docker compose restart frontend
docker compose restart backend
docker compose restart db
```

Restart alone does **not** reinstall dependencies. See [Frontend node_modules](#frontend-node_modules) and [Backend Python packages](#backend-python-packages) below.

##### Logs

```bash
# All services
docker compose logs -f

# One service
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f db
```

##### Shell access

```bash
docker compose exec frontend sh
docker compose exec backend bash
docker compose exec db psql -U ejfinance_user -d ejfinance_db
```

#### Frontend node_modules

The frontend uses a **named volume** for `/app/node_modules`. A plain restart or rebuild does not always refresh installed packages if the volume already exists.

##### Reinstall dependencies (after `package.json` / lockfile changes)

```bash
docker compose exec frontend npm ci
docker compose restart frontend
```

##### Full reset of frontend dependencies

```bash
docker compose stop frontend
docker compose rm -f frontend
docker volume rm ejfinance_frontend_node_modules   # confirm name with: docker volume ls | grep frontend
docker compose up -d --build frontend
```

On first start after removing the volume, Docker populates `node_modules` from the image built by `npm ci` in `frontend/Dockerfile`.

##### Hot reload on macOS

File watching inside Docker on macOS can be unreliable. If Next.js does not pick up changes, add this to the `frontend` service in `docker-compose.yml`:

```yaml
environment:
  - WATCHPACK_POLLING=true
```

Then recreate the frontend container:

```bash
docker compose up -d --force-recreate frontend
```

##### Browser API URL

The frontend container sets:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Browser requests go to the host-mapped backend port, not the internal Docker service name.

#### Backend Python packages

Backend source is bind-mounted; Python packages are installed in the image at build time.

After changing `backend/requirements.txt`:

```bash
docker compose up -d --build backend
```

Or install into the running container (temporary until rebuild):

```bash
docker compose exec backend pip install -r requirements.txt
```

#### Database operations

##### Migrations

```bash
# Apply all pending migrations
docker compose exec backend alembic upgrade head

# Create a new migration (after model changes)
docker compose exec backend alembic revision --autogenerate -m "description"

# Roll back one migration
docker compose exec backend alembic downgrade -1
```

##### Reset database (⚠️ destroys all data)

```bash
docker compose down
docker volume rm ejfinance_postgres_data   # confirm name with: docker volume ls | grep postgres
docker compose up -d db backend
docker compose exec backend alembic upgrade head
docker compose exec backend python scripts/init_db.py
```

#### Environment variables (Docker)

Values below match `docker-compose.yml` unless you override them locally.

##### `db` service (Postgres image)

| Variable | Value |
|----------|-------|
| `POSTGRES_USER` | `ejfinance_user` |
| `POSTGRES_PASSWORD` | `ejfinance_pass` |
| `POSTGRES_DB` | `ejfinance_db` |

##### `backend` service

| Source | Variable | Value / notes |
|--------|----------|---------------|
| `environment` | `DATABASE_URL` | `postgresql://ejfinance_user:ejfinance_pass@db:5432/ejfinance_db` (host `db` = compose service name) |
| `environment` | `DEBUG` | `True` — set `False` for production-like behavior |
| `env_file` | *(see below)* | `./backend/.env` — merged first; keys above override duplicates |

##### `frontend` service

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Browser calls the host-mapped API port, not `http://backend:8000` |

##### Loaded from `backend/.env`

See `backend/app/core/config.py` for the full list. Common entries:

| Variable | Purpose |
|----------|---------|
| `SECRET_KEY` | JWT signing key — **required for auth** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime (default: 30) |
| `CORS_ORIGINS` | Allowed frontend origins |
| `AZURE_STORAGE_*` | Optional receipt storage |

#### Docker troubleshooting

| Problem | What to try |
|---------|-------------|
| Port already in use | Stop conflicting processes or change host ports in `docker-compose.yml` |
| Backend cannot connect to DB | Ensure `db` is healthy: `docker compose ps`. Backend waits for DB healthcheck before starting |
| Frontend module not found | Run `docker compose exec frontend npm ci` and restart |
| Stale frontend deps after rebuild | Remove `frontend_node_modules` volume (see [Frontend node_modules](#frontend-node_modules)) |
| Changes not reflected (backend) | Confirm `./backend` mount and `--reload` in compose command |
| Changes not reflected (frontend) | Enable `WATCHPACK_POLLING=true` on macOS |
| Permission errors on volumes | On Linux, check UID/GID mapping; Alpine frontend runs as root by default |
| Need a clean slate | `docker compose down -v` then full setup from [First-time setup](#first-time-setup) |

##### Inspect service status

```bash
docker compose ps
docker compose top
```

#### Docker production note

This Compose setup is for **local development** only:

- Backend: bind-mounted source, `uvicorn` with `--reload` (overrides image `CMD`)
- Frontend: bind-mounted source, `npm run dev` with `--hostname 0.0.0.0`
- Database: default credentials in compose `environment` for convenience

For production, use separate deployment targets (Render for the backend, Vercel for the frontend — see `render.yaml`) with strong secrets, managed PostgreSQL (Supabase), and production build commands — not this compose file as-is.

### Local Development Setup (without Docker)

1. Clone the repository
2. Set up the backend (see `backend/README.md`)
3. Set up the frontend (see `frontend/README.md`)
4. Configure environment variables
5. Run database migrations
6. Start the development servers

## License

[Add your license here]
