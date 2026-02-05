"""
Transaction management endpoints
"""
from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from decimal import Decimal
from app.core.database import get_db
from app.models.transaction import Transaction, TransactionType
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()


class TransactionBase(BaseModel):
    """Base transaction schema"""
    type: TransactionType
    amount: Decimal
    description: str | None = None
    notes: str | None = None
    date: datetime
    category_id: int
    account_id: int


class TransactionCreate(TransactionBase):
    """Schema for creating a transaction"""
    pass


class TransactionResponse(TransactionBase):
    """Schema for transaction response"""
    id: int
    user_id: int
    receipt_url: str | None = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    type: Optional[TransactionType] = None,
    category_id: Optional[int] = None,
    account_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    min_amount: Optional[Decimal] = None,
    max_amount: Optional[Decimal] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get transactions with filtering and pagination"""
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    
    # Apply filters
    if type:
        query = query.filter(Transaction.type == type)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if account_id:
        query = query.filter(Transaction.account_id == account_id)
    if start_date:
        query = query.filter(Transaction.date >= datetime.combine(start_date, datetime.min.time()))
    if end_date:
        query = query.filter(Transaction.date <= datetime.combine(end_date, datetime.max.time()))
    if min_amount:
        query = query.filter(Transaction.amount >= min_amount)
    if max_amount:
        query = query.filter(Transaction.amount <= max_amount)
    
    # Order by date descending
    query = query.order_by(Transaction.date.desc())
    
    transactions = query.offset(skip).limit(limit).all()
    return transactions


@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction_data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new transaction"""
    # Verify category and account belong to user
    from app.models.category import Category
    from app.models.account import Account
    
    category = db.query(Category).filter(
        Category.id == transaction_data.category_id,
        (Category.user_id == None) | (Category.user_id == current_user.id)
    ).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    account = db.query(Account).filter(
        Account.id == transaction_data.account_id,
        Account.user_id == current_user.id
    ).first()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # Create transaction
    db_transaction = Transaction(
        **transaction_data.model_dump(),
        user_id=current_user.id
    )
    db.add(db_transaction)
    
    # Update account balance
    if transaction_data.type == TransactionType.INCOME:
        account.balance += transaction_data.amount
    else:  # EXPENSE
        account.balance -= transaction_data.amount
    
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific transaction"""
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    return transaction


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: int,
    transaction_data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a transaction"""
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Store old values for balance adjustment
    old_amount = transaction.amount
    old_type = transaction.type
    old_account_id = transaction.account_id
    
    # Update transaction
    for key, value in transaction_data.model_dump().items():
        setattr(transaction, key, value)
    
    # Adjust account balances
    from app.models.account import Account
    
    # Revert old transaction
    old_account = db.query(Account).filter(Account.id == old_account_id).first()
    if old_account:
        if old_type == TransactionType.INCOME:
            old_account.balance -= old_amount
        else:
            old_account.balance += old_amount
    
    # Apply new transaction
    new_account = db.query(Account).filter(Account.id == transaction_data.account_id).first()
    if new_account:
        if transaction_data.type == TransactionType.INCOME:
            new_account.balance += transaction_data.amount
        else:
            new_account.balance -= transaction_data.amount
    
    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a transaction"""
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Revert account balance
    from app.models.account import Account
    account = db.query(Account).filter(Account.id == transaction.account_id).first()
    if account:
        if transaction.type == TransactionType.INCOME:
            account.balance -= transaction.amount
        else:
            account.balance += transaction.amount
    
    db.delete(transaction)
    db.commit()
    return None

