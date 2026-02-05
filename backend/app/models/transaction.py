"""
Transaction model for expenses and income
"""
from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base


class TransactionType(str, enum.Enum):
    """Transaction type enumeration"""
    EXPENSE = "expense"
    INCOME = "income"


class Transaction(Base):
    """Transaction model for expenses and income entries"""
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(TransactionType), nullable=False, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    description = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    date = Column(DateTime, nullable=False, index=True)
    receipt_url = Column(String, nullable=True)  # URL to receipt in Azure Blob Storage
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
    account = relationship("Account", back_populates="transactions")

