"""
API v1 router - aggregates all v1 endpoints
"""
from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, categories, transactions, accounts, budgets, recurring_transactions

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
api_router.include_router(budgets.router, prefix="/budgets", tags=["budgets"])
api_router.include_router(recurring_transactions.router, prefix="/recurring-transactions", tags=["recurring-transactions"])

