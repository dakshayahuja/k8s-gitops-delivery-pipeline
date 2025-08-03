from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.expense_schema import ExpenseCreate, ExpenseResponse, ExpenseUpdate, CategoryReport, MonthlyReport, Settings
from models.expense_model import Expense
from crud import expense_crud
from typing import List, Dict, Any

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.post("/", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    return expense_crud.create_expense(db, expense)

@router.get("/", response_model=List[ExpenseResponse])
def read_expenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return expense_crud.get_expenses(db, skip=skip, limit=limit)

@router.post("/seed", response_model=List[ExpenseResponse])
def seed_expenses(db: Session = Depends(get_db)):
    from datetime import datetime, timedelta
    import random

    # Clear existing data first
    db.query(Expense).delete()
    db.commit()

    categories = ["Food", "Entertainment", "Health", "Utilities", "Transport", "Shopping", "Other"]
    titles = [
        "Groceries", "Movie Night", "Gym Membership", "Internet Bill", "Coffee",
        "Uber Ride", "Restaurant", "Netflix", "Phone Bill", "Gas Station", "Miscellaneous"
    ]

    seed_data = []
    for i in range(10):
        expense = Expense(
            title=random.choice(titles),
            amount=round(random.uniform(50, 1000), 2),
            category=random.choice(categories),
            date=datetime.now() - timedelta(days=random.randint(0, 30))
        )
        seed_data.append(expense)

    db.add_all(seed_data)
    db.commit()

    for item in seed_data:
        db.refresh(item)

    return seed_data

@router.delete("/clear", response_model=Dict[str, str])
def clear_expenses(db: Session = Depends(get_db)):
    """Clear all expenses from database"""
    db.query(Expense).delete()
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
def get_category_report(db: Session = Depends(get_db)):
    """Get expense report grouped by category"""
    return expense_crud.get_category_report(db)

@router.get("/reports/monthly", response_model=List[Dict[str, Any]])
def get_monthly_report(months: int = 6, db: Session = Depends(get_db)):
    """Get monthly expense report for the last N months"""
    return expense_crud.get_monthly_report(db, months)

@router.get("/reports/summary", response_model=Dict[str, Any])
def get_summary_report(db: Session = Depends(get_db)):
    """Get summary statistics"""
    total_amount = expense_crud.get_total_expenses(db)
    total_count = expense_crud.get_expenses_count(db)
    category_report = expense_crud.get_category_report(db)

    return {
        "total_amount": total_amount,
        "total_count": total_count,
        "average_amount": round(total_amount / total_count, 2) if total_count > 0 else 0,
        "categories": category_report
    }

# Dynamic routes (must come after static routes)
@router.get("/{expense_id}", response_model=ExpenseResponse)
def read_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = expense_crud.get_expense_by_id(db, expense_id)
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense_route(expense_id: int, updated_data: ExpenseUpdate, db: Session = Depends(get_db)):
    updated = expense_crud.update_expense(db, expense_id, updated_data)
    if updated is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return updated

@router.delete("/{expense_id}", response_model=ExpenseResponse)
def delete_expense_route(expense_id: int, db: Session = Depends(get_db)):
    deleted = expense_crud.delete_expense(db, expense_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return deleted