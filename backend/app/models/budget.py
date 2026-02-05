"""
Budget model for monthly budget planning
"""
from sqlalchemy import Column, Integer, Numeric, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class Budget(Base):
    """Budget model for monthly budget planning per category"""
    __tablename__ = "budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    month = Column(Date, nullable=False, index=True)  # First day of the month
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="budgets")
    category = relationship("Category")

