from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.expense_schema import ExpenseCreate, ExpenseResponse, ExpenseUpdate, CategoryReport, MonthlyReport, Settings
from models.expense_model import Expense
from models.user_model import User
from crud import expense_crud
from core.auth import get_current_user
from core.categories import get_available_categories, get_random_title_for_category
from typing import List, Dict, Any

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.post("/", response_model=ExpenseResponse)
def create_expense(
    expense: ExpenseCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return expense_crud.create_expense(db, expense, current_user.id)

@router.get("/", response_model=List[ExpenseResponse])
def read_expenses(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return expense_crud.get_expenses(db, current_user.id, skip=skip, limit=limit)

@router.post("/seed", response_model=List[ExpenseResponse])
def seed_expenses(
    count: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from datetime import datetime, timedelta
    import random

    # Clear existing data for this user first
    db.query(Expense).filter(Expense.user_id == current_user.id).delete()
    db.commit()

    # Get available categories from global configuration
    available_categories = get_available_categories()

    seed_data = []
    for i in range(count):
        # Select a random category
        category = random.choice(available_categories)
        # Get a random title for that category
        title = get_random_title_for_category(category)

        expense = Expense(
            user_id=current_user.id,
            title=title,
            amount=round(random.uniform(50, 1000), 2),
            category=category,
            date=datetime.now() - timedelta(days=random.randint(0, 30))
        )
        seed_data.append(expense)

    db.add_all(seed_data)
    db.commit()

    for item in seed_data:
        db.refresh(item)

    return seed_data

@router.delete("/clear", response_model=Dict[str, str])
def clear_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Clear all expenses for current user"""
    db.query(Expense).filter(Expense.user_id == current_user.id).delete()
    db.commit()
    return {"message": "All expenses cleared successfully"}

# Settings routes (must come before dynamic routes)
@router.get("/settings", response_model=Settings)
def get_settings():
    """Get current settings"""
    return Settings()

@router.put("/settings", response_model=Settings)
def update_settings(settings: Settings):
    """Update settings"""
    # In a real app, you'd save this to a database
    return settings

# Reports routes (must come before dynamic routes)
@router.get("/reports/categories", response_model=List[Dict[str, Any]])
def get_category_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get expense report grouped by category for current user"""
    return expense_crud.get_category_report(db, current_user.id)

@router.get("/reports/monthly", response_model=List[Dict[str, Any]])
def get_monthly_report(
    months: int = 6, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get monthly expense report for the last N months for current user"""
    return expense_crud.get_monthly_report(db, current_user.id, months)

@router.get("/reports/summary", response_model=Dict[str, Any])
def get_summary_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get summary statistics for current user"""
    total_amount = expense_crud.get_total_expenses(db, current_user.id)
    total_count = expense_crud.get_expenses_count(db, current_user.id)
    category_report = expense_crud.get_category_report(db, current_user.id)

    return {
        "total_amount": total_amount,
        "total_count": total_count,
        "average_amount": round(total_amount / total_count, 2) if total_count > 0 else 0,
        "categories": category_report
    }

# Dynamic routes (must come after static routes)
@router.get("/{expense_id}", response_model=ExpenseResponse)
def read_expense(
    expense_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expense = expense_crud.get_expense_by_id(db, expense_id, current_user.id)
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense_route(
    expense_id: int, 
    updated_data: ExpenseUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated = expense_crud.update_expense(db, expense_id, updated_data, current_user.id)
    if updated is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return updated

@router.delete("/{expense_id}", response_model=ExpenseResponse)
def delete_expense_route(
    expense_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = expense_crud.delete_expense(db, expense_id, current_user.id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return deleted