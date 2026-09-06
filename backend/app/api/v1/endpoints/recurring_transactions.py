"""
Recurring transaction management endpoints
"""
from typing import List
from datetime import date
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.models.recurring_transaction import RecurringTransaction, Frequency
from app.models.transaction import TransactionType
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


class RecurringTransactionBase(BaseModel):
    """Base recurring transaction schema"""
    type: TransactionType
    amount: Decimal
    description: str | None = None
    frequency: Frequency
    start_date: date
    end_date: date | None = None
    category_id: int
    account_id: int


class RecurringTransactionCreate(RecurringTransactionBase):
    """Schema for creating a recurring transaction"""
    pass


class RecurringTransactionUpdate(BaseModel):
    """Schema for updating a recurring transaction"""
    amount: Decimal | None = None
    description: str | None = None
    frequency: Frequency | None = None
    end_date: date | None = None
    is_active: bool | None = None


class RecurringTransactionResponse(RecurringTransactionBase):
    """Schema for recurring transaction response"""
    id: int
    user_id: int
    next_occurrence: date
    is_active: bool

    class Config:
        from_attributes = True


@router.get("/", response_model=List[RecurringTransactionResponse])
async def get_recurring_transactions(
    is_active: bool | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all of the user's recurring transactions"""
    query = db.query(RecurringTransaction).filter(RecurringTransaction.user_id == current_user.id)

    if is_active is not None:
        query = query.filter(RecurringTransaction.is_active == is_active)

    return query.all()


@router.post("/", response_model=RecurringTransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_recurring_transaction(
    recurring_data: RecurringTransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new recurring transaction"""
    from app.models.category import Category
    from app.models.account import Account

    category = db.query(Category).filter(
        Category.id == recurring_data.category_id,
        (Category.user_id == None) | (Category.user_id == current_user.id)
    ).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    account = db.query(Account).filter(
        Account.id == recurring_data.account_id,
        Account.user_id == current_user.id
    ).first()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )

    db_recurring = RecurringTransaction(
        **recurring_data.model_dump(),
        user_id=current_user.id,
        next_occurrence=recurring_data.start_date
    )
    db.add(db_recurring)
    db.commit()
    db.refresh(db_recurring)
    return db_recurring


@router.get("/{recurring_id}", response_model=RecurringTransactionResponse)
async def get_recurring_transaction(
    recurring_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific recurring transaction"""
    recurring = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == recurring_id,
        RecurringTransaction.user_id == current_user.id
    ).first()

    if not recurring:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recurring transaction not found"
        )

    return recurring


@router.put("/{recurring_id}", response_model=RecurringTransactionResponse)
async def update_recurring_transaction(
    recurring_id: int,
    recurring_data: RecurringTransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a recurring transaction"""
    recurring = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == recurring_id,
        RecurringTransaction.user_id == current_user.id
    ).first()

    if not recurring:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recurring transaction not found"
        )

    update_data = recurring_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(recurring, key, value)

    db.commit()
    db.refresh(recurring)
    return recurring


@router.delete("/{recurring_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recurring_transaction(
    recurring_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a recurring transaction"""
    recurring = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == recurring_id,
        RecurringTransaction.user_id == current_user.id
    ).first()

    if not recurring:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recurring transaction not found"
        )

    db.delete(recurring)
    db.commit()
    return None
