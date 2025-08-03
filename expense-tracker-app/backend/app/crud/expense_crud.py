from sqlalchemy.orm import Session
from models.expense_model import Expense
from schemas.expense_schema import ExpenseCreate, ExpenseUpdate
from datetime import datetime, timedelta
from sqlalchemy import func
from typing import List, Dict, Any

def create_expense(db: Session, expense: ExpenseCreate):
    db_expense = Expense(
        title=expense.title,
        amount=expense.amount,
        category=expense.category or "Other",
        date=expense.date or datetime.now()
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_expenses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Expense).offset(skip).limit(limit).all()

def get_expense_by_id(db: Session, expense_id: int):
    return db.query(Expense).filter(Expense.id == expense_id).first()

def update_expense(db: Session, expense_id: int, expense_update: ExpenseUpdate):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if db_expense:
        update_data = expense_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_expense, field, value)
        db.commit()
        db.refresh(db_expense)
    return db_expense

def delete_expense(db: Session, expense_id: int):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if db_expense:
        db.delete(db_expense)
        db.commit()
    return db_expense

def get_category_report(db: Session) -> List[Dict[str, Any]]:
    """Get expense report grouped by category"""
    result = db.query(
        Expense.category,
        func.sum(Expense.amount).label('total_amount'),
        func.count(Expense.id).label('count')
    ).group_by(Expense.category).all()

    total = sum(row.total_amount for row in result)

    return [
        {
            "category": row.category,
            "total_amount": float(row.total_amount),
            "count": row.count,
            "percentage": round((row.total_amount / total * 100), 2) if total > 0 else 0
        }
        for row in result
    ]

def get_monthly_report(db: Session, months: int = 6) -> List[Dict[str, Any]]:
    """Get monthly expense report for the last N months"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=months * 30)

    result = db.query(
        func.date_trunc('month', Expense.date).label('month'),
        func.sum(Expense.amount).label('total_amount'),
        func.count(Expense.id).label('count')
    ).filter(
        Expense.date >= start_date
    ).group_by(
        func.date_trunc('month', Expense.date)
    ).order_by(
        func.date_trunc('month', Expense.date)
    ).all()

    return [
        {
            "month": row.month.strftime("%B %Y"),
            "total_amount": float(row.total_amount),
            "count": row.count
        }
        for row in result
    ]

def get_total_expenses(db: Session) -> float:
    """Get total expenses amount"""
    result = db.query(func.sum(Expense.amount)).scalar()
    return float(result) if result else 0.0

def get_expenses_count(db: Session) -> int:
    """Get total number of expenses"""
    return db.query(Expense).count()