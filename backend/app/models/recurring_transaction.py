"""
Recurring transaction model for automated transaction creation
"""
from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, Enum, Boolean, Date
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base
from app.models.transaction import TransactionType


class Frequency(str, enum.Enum):
    """Recurring transaction frequency"""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"


class RecurringTransaction(Base):
    """Recurring transaction model for automated entries"""
    __tablename__ = "recurring_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(TransactionType), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    description = Column(String, nullable=True)
    frequency = Column(Enum(Frequency), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)  # None for indefinite
    next_occurrence = Column(Date, nullable=False, index=True)
    is_active = Column(Boolean, default=True)
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="recurring_transactions")
    category = relationship("Category")
    account = relationship("Account")

