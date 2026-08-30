# EJ Finance Backend

FastAPI backend for the EJ Finance personal finance management application.

## Features

- **Authentication**: JWT-based user authentication
- **User Management**: User registration, login, and profile management
- **Categories**: Default and custom category management
- **Transactions**: Full CRUD for expenses and income
- **Accounts**: Payment method and bank account management
- **Budgets**: Monthly budget planning per category
- **Database**: PostgreSQL with SQLAlchemy ORM
- **API Documentation**: Automatic OpenAPI/Swagger documentation

## Tech Stack

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Relational database
- **Alembic** - Database migrations
- **JWT** - Authentication tokens
- **Pydantic** - Data validation

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── core/
│   │   ├── config.py           # Application settings
│   │   ├── database.py         # Database configuration
│   │   └── security.py         # Authentication utilities
│   ├── models/                 # SQLAlchemy models
│   │   ├── user.py
│   │   ├── category.py
│   │   ├── account.py
│   │   ├── transaction.py
│   │   ├── budget.py
│   │   └── recurring_transaction.py
│   ├── schemas/                # Pydantic schemas
│   │   └── user.py
│   └── api/
│       └── v1/
│           ├── api.py          # API router aggregation
│           └── endpoints/      # API endpoints
│               ├── auth.py
│               ├── users.py
│               ├── categories.py
│               ├── transactions.py
│               ├── accounts.py
│               └── budgets.py
├── alembic/                    # Database migrations
├── scripts/                    # Utility scripts
│   └── init_db.py             # Initialize default categories
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## Setup

### Prerequisites

- Python 3.11+
- PostgreSQL 14+
- pip or poetry

### Installation

1. **Clone the repository and navigate to backend directory**

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Set up PostgreSQL database**
   - Create a PostgreSQL database
   - Update `DATABASE_URL` in `.env` file

6. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

7. **Initialize default categories** (optional)
   ```bash
   python scripts/init_db.py
   ```

8. **Run the development server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at:
- API: http://localhost:8000
- Documentation: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Docker Setup

Docker is configured at the repository root: `docker-compose.yml` orchestrates services; the backend image is built from `backend/Dockerfile`. See the main `README.md` for full-stack setup.

From the repo root, run migrations and init against the `backend` service:

```bash
docker compose exec backend alembic upgrade head
docker compose exec backend python scripts/init_db.py
```

For API and database only (no frontend): `docker compose up -d db backend`.

## Database Migrations

### Create a new migration
```bash
alembic revision --autogenerate -m "description of changes"
```

### Apply migrations
```bash
alembic upgrade head
```

### Rollback migration
```bash
alembic downgrade -1
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get access token
- `GET /api/v1/auth/me` - Get current user info

### Users
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update user profile

### Categories
- `GET /api/v1/categories/` - Get all categories
- `POST /api/v1/categories/` - Create a category
- `GET /api/v1/categories/{id}` - Get a category
- `PUT /api/v1/categories/{id}` - Update a category
- `DELETE /api/v1/categories/{id}` - Delete a category

### Transactions
- `GET /api/v1/transactions/` - Get transactions (with filtering)
- `POST /api/v1/transactions/` - Create a transaction
- `GET /api/v1/transactions/{id}` - Get a transaction
- `PUT /api/v1/transactions/{id}` - Update a transaction
- `DELETE /api/v1/transactions/{id}` - Delete a transaction

### Accounts
- `GET /api/v1/accounts/` - Get all accounts
- `POST /api/v1/accounts/` - Create an account
- `GET /api/v1/accounts/{id}` - Get an account
- `PUT /api/v1/accounts/{id}` - Update an account
- `DELETE /api/v1/accounts/{id}` - Delete an account

### Budgets
- `GET /api/v1/budgets/` - Get budgets
- `POST /api/v1/budgets/` - Create a budget
- `GET /api/v1/budgets/{id}` - Get a budget
- `PUT /api/v1/budgets/{id}` - Update a budget
- `DELETE /api/v1/budgets/{id}` - Delete a budget

## Environment Variables

See `.env.example` for all available environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - Secret key for JWT tokens (change in production!)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - JWT token expiration time
- `CORS_ORIGINS` - Allowed CORS origins (JSON array)
- `AZURE_STORAGE_*` - Azure Blob Storage configuration (optional)

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black app/
isort app/
```

## Production Deployment

Deployment target: **Supabase (managed Postgres) + Render (FastAPI hosting)**. See `render.yaml` at the repo root.

1. Create a Supabase project and copy its connection-pooler URL (port 6543) — see `.env.example` for the format
2. Set `DEBUG=False` in environment variables
3. Use a strong `SECRET_KEY` (generate with `openssl rand -hex 32`)
4. Configure `CORS_ORIGINS` to your deployed frontend URL
5. Connect this repo to Render as a Blueprint (reads `render.yaml`); set `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS` as secrets in the Render dashboard
6. Render runs `alembic upgrade head` as a pre-deploy step on every push to `main` — no manual migration step needed in production

## License

[Add your license here]

