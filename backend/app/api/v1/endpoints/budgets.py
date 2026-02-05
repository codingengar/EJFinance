"""
Budget management endpoints
"""
from typing import List
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.budget import Budget
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from pydantic import BaseModel
from decimal import Decimal

router = APIRouter()


class BudgetBase(BaseModel):
    """Base budget schema"""
    amount: Decimal
    month: date
    category_id: int


class BudgetCreate(BudgetBase):
    """Schema for creating a budget"""
    pass


class BudgetResponse(BudgetBase):
    """Schema for budget response"""
    id: int
    user_id: int
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[BudgetResponse])
async def get_budgets(
    month: date | None = Query(None, description="Filter by month (first day of month)"),
    category_id: int | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get budgets with optional filtering"""
    query = db.query(Budget).filter(Budget.user_id == current_user.id)
    
    if month:
        query = query.filter(Budget.month == month)
    if category_id:
        query = query.filter(Budget.category_id == category_id)
    
    budgets = query.all()
    return budgets


@router.post("/", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
async def create_budget(
    budget_data: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new budget"""
    # Verify category belongs to user
    from app.models.category import Category
    category = db.query(Category).filter(
        Category.id == budget_data.category_id,
        (Category.user_id == None) | (Category.user_id == current_user.id)
    ).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Check if budget already exists for this month and category
    existing_budget = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month == budget_data.month,
        Budget.category_id == budget_data.category_id
    ).first()
    
    if existing_budget:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Budget already exists for this month and category"
        )
    
    db_budget = Budget(
        **budget_data.model_dump(),
        user_id=current_user.id
    )
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget


@router.get("/{budget_id}", response_model=BudgetResponse)
async def get_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific budget"""
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()
    
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )
    
    return budget


@router.put("/{budget_id}", response_model=BudgetResponse)
async def update_budget(
    budget_id: int,
    budget_data: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a budget"""
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()
    
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )
    
    for key, value in budget_data.model_dump().items():
        setattr(budget, key, value)
    
    db.commit()
    db.refresh(budget)
    return budget


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a budget"""
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()
    
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )
    
    db.delete(budget)
    db.commit()
    return None

