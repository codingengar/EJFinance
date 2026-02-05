"""
Initialize database with default categories
Run this after creating the database tables
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import Base, Category, CategoryType


def init_default_categories(db: Session):
    """Create default expense and income categories"""
    default_categories = [
        # Expense categories
        {"name": "Food & Dining", "type": CategoryType.EXPENSE, "icon": "🍽️", "color": "#FF6B6B"},
        {"name": "Shopping", "type": CategoryType.EXPENSE, "icon": "🛍️", "color": "#4ECDC4"},
        {"name": "Transportation", "type": CategoryType.EXPENSE, "icon": "🚗", "color": "#45B7D1"},
        {"name": "Bills & Utilities", "type": CategoryType.EXPENSE, "icon": "💡", "color": "#FFA07A"},
        {"name": "Entertainment", "type": CategoryType.EXPENSE, "icon": "🎬", "color": "#98D8C8"},
        {"name": "Healthcare", "type": CategoryType.EXPENSE, "icon": "🏥", "color": "#F7DC6F"},
        {"name": "Education", "type": CategoryType.EXPENSE, "icon": "📚", "color": "#BB8FCE"},
        {"name": "Travel", "type": CategoryType.EXPENSE, "icon": "✈️", "color": "#85C1E2"},
        {"name": "Personal Care", "type": CategoryType.EXPENSE, "icon": "💅", "color": "#F8B88B"},
        {"name": "Other", "type": CategoryType.EXPENSE, "icon": "📦", "color": "#D5DBDB"},
        
        # Income categories
        {"name": "Salary", "type": CategoryType.INCOME, "icon": "💰", "color": "#52BE80"},
        {"name": "Freelance", "type": CategoryType.INCOME, "icon": "💼", "color": "#5DADE2"},
        {"name": "Investment", "type": CategoryType.INCOME, "icon": "📈", "color": "#F4D03F"},
        {"name": "Gift", "type": CategoryType.INCOME, "icon": "🎁", "color": "#EC7063"},
        {"name": "Other Income", "type": CategoryType.INCOME, "icon": "💵", "color": "#A569BD"},
    ]
    
    for cat_data in default_categories:
        # Check if category already exists
        existing = db.query(Category).filter(
            Category.name == cat_data["name"],
            Category.is_default == True
        ).first()
        
        if not existing:
            category = Category(
                **cat_data,
                is_default=True,
                user_id=None
            )
            db.add(category)
    
    db.commit()
    print("Default categories initialized successfully!")


if __name__ == "__main__":
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Initialize default categories
    db = SessionLocal()
    try:
        init_default_categories(db)
    finally:
        db.close()

