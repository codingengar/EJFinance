"""
Category management endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.category import Category, CategoryType
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()


class CategoryBase(BaseModel):
    """Base category schema"""
    name: str
    type: CategoryType
    icon: str | None = None
    color: str | None = None


class CategoryCreate(CategoryBase):
    """Schema for creating a category"""
    pass


class CategoryResponse(CategoryBase):
    """Schema for category response"""
    id: int
    is_default: bool
    user_id: int | None
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[CategoryResponse])
async def get_categories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all categories (default + user's custom categories)"""
    # Get default categories and user's custom categories
    categories = db.query(Category).filter(
        (Category.user_id == None) | (Category.user_id == current_user.id)
    ).all()
    return categories


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new custom category"""
    db_category = Category(
        **category_data.model_dump(),
        user_id=current_user.id,
        is_default=False
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific category"""
    category = db.query(Category).filter(
        Category.id == category_id,
        (Category.user_id == None) | (Category.user_id == current_user.id)
    ).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    category_data: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a custom category (cannot update default categories)"""
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found or you don't have permission to update it"
        )
    
    for key, value in category_data.model_dump().items():
        setattr(category, key, value)
    
    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a custom category (cannot delete default categories)"""
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found or you don't have permission to delete it"
        )
    
    db.delete(category)
    db.commit()
    return None

