"""
Category model for expenses and income
"""
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base


class CategoryType(str, enum.Enum):
    """Category type enumeration"""
    EXPENSE = "expense"
    INCOME = "income"
    BOTH = "both"


class Category(Base):
    """Category model for organizing transactions"""
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    type = Column(Enum(CategoryType), default=CategoryType.EXPENSE, nullable=False)
    icon = Column(String, nullable=True)  # Icon name or emoji
    color = Column(String, nullable=True)  # Hex color code
    is_default = Column(Boolean, default=False)  # System default categories
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Null for default categories
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="categories")
    transactions = relationship("Transaction", back_populates="category")

