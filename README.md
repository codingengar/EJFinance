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
- **Next.js 14+** (App Router) - React framework with server-side rendering
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
  - Azure Database for PostgreSQL (production)
  - Local PostgreSQL (development)

### Deployment
- **Azure App Service** - FastAPI backend hosting
- **Vercel or Azure Static Web Apps** - Next.js frontend hosting
- **Azure PostgreSQL** - Production database
- **Azure Blob Storage** - Receipt file storage

## Project Structure

```
EJFinance/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── docker-compose.yml # Local development setup
└── README.md          # This file
```

## To Do List

### Week 1-2: Foundation

#### Project Setup
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up FastAPI backend with project structure
- [ ] Configure PostgreSQL database
- [ ] Set up basic Docker compose for local development
- [ ] Configure environment variables and settings

#### Authentication System
- [ ] Create user registration endpoint (FastAPI)
- [ ] Create user login endpoint (FastAPI)
- [ ] Implement JWT token generation and validation
- [ ] Set up Next.js auth context
- [ ] Implement protected routes in Next.js
- [ ] Create basic user profile management endpoints
- [ ] Build user profile UI components

### Week 2-3: Core Transaction Features

#### Categories Management
- [ ] Design database schema for categories
- [ ] Create seed data with predefined categories
- [ ] Implement CRUD endpoints for categories (FastAPI)
- [ ] Build category management UI in Next.js
- [ ] Add category selection to expense forms

#### Expense Entry (MVP)
- [ ] Design database schema for expenses
- [ ] Create POST endpoint to create expenses
- [ ] Create GET endpoint to retrieve expenses
- [ ] Build expense entry form in Next.js
- [ ] Create expense list view component
- [ ] Add date and amount validation

#### Basic CRUD Operations
- [ ] Implement edit expense endpoint (PUT/PATCH)
- [ ] Implement delete expense endpoint (DELETE)
- [ ] Build edit expense UI component
- [ ] Add delete confirmation dialog
- [ ] Implement frontend validation
- [ ] Implement backend validation

### Week 3-4: Accounts & Payment Methods

#### Payment Methods/Accounts
- [ ] Design database schema for accounts
- [ ] Create CRUD endpoints for accounts
- [ ] Build account management UI
- [ ] Add account selection to expense form
- [ ] Implement account balance calculation logic
- [ ] Display account balances in UI

#### Income Tracking
- [ ] Design database schema for income
- [ ] Create income entry endpoints (similar to expenses)
- [ ] Build income entry form in Next.js
- [ ] Create income list view
- [ ] Set up separate income categories
- [ ] Add income to transaction views

### Week 4-5: Search & Filtering

#### Search Functionality
- [ ] Implement backend query parameters for filtering
  - [ ] Date range filtering
  - [ ] Category filtering
  - [ ] Amount range filtering
  - [ ] Account filtering
- [ ] Build search and filter UI components
- [ ] Implement pagination for transaction lists
- [ ] Add sorting options (date, amount, category)
- [ ] Create filter state management

### Week 5-6: Analytics & Reporting

#### Dashboard & Basic Analytics
- [ ] Create aggregation endpoints
  - [ ] Total spent by category
  - [ ] Total spent by month
  - [ ] Income vs expenses comparison
- [ ] Build dashboard page layout
- [ ] Create summary cards component
- [ ] Implement charts using Recharts
  - [ ] Category spending pie chart
  - [ ] Monthly spending line chart
  - [ ] Income vs expenses bar chart
- [ ] Add date range selector for analytics

#### Budgeting System
- [ ] Design database schema for budgets
- [ ] Create budget CRUD endpoints
- [ ] Implement monthly budget per category logic
- [ ] Build budget vs actual comparison logic
- [ ] Create budget management UI
- [ ] Add budget progress indicators
- [ ] Display budget warnings/alerts

### Week 6-7: Advanced Features

#### Recurring Expenses
- [ ] Design database schema for recurring transactions
- [ ] Create CRUD endpoints for recurring expenses
- [ ] Implement background job to auto-create recurring entries
- [ ] Build UI to manage recurring expenses
- [ ] Add frequency options (daily, weekly, monthly, yearly)
- [ ] Create notification system for upcoming recurring expenses

#### Data Export/Import
- [ ] Create CSV export endpoint
- [ ] Implement CSV import with validation
- [ ] Build export functionality in Next.js
- [ ] Build import functionality in Next.js
- [ ] Add error handling for malformed CSV files
- [ ] Create import preview/confirmation UI

### Week 7-8: Polish & Deployment

#### Receipt Attachments
- [ ] Set up Azure Blob Storage integration
- [ ] Create file upload endpoint
- [ ] Implement image upload in transaction forms
- [ ] Build image display in transaction details
- [ ] Add thumbnail generation
- [ ] Create image gallery view
- [ ] Add file size and type validation

#### Deployment
- [ ] Set up Azure App Service for FastAPI backend
- [ ] Configure Vercel/Azure Static Web Apps for Next.js frontend
- [ ] Set up Azure PostgreSQL for production database
- [ ] Configure environment variables for production
- [ ] Set up CI/CD pipeline
- [ ] Configure CORS for production domains
- [ ] Set up monitoring and logging
- [ ] Create deployment documentation
- [ ] Perform end-to-end testing in production environment

## Development Notes

- **MVP Target**: A working MVP is achievable after completing Week 2-3 (Core Transaction Features)
- **Build Strategy**: Each phase builds logically on the previous one, allowing for incremental value delivery
- **Alternative Backend**: Django REST Framework could be used if more batteries-included features are needed (admin panel, ORM), but FastAPI provides more control and is lighter

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.10+
- PostgreSQL 14+
- Docker and Docker Compose (optional, for local development)

### Local Development Setup
1. Clone the repository
2. Set up the backend (see `backend/README.md`)
3. Set up the frontend (see `frontend/README.md`)
4. Configure environment variables
5. Run database migrations
6. Start the development servers

## License

[Add your license here]
