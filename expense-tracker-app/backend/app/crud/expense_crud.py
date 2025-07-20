from sqlalchemy.orm import Session
from models.expense_model import Expense
from schemas.expense_schema import ExpenseCreate

def create_expense(db: Session, expense: ExpenseCreate):
    db_expense = Expense(**expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_expenses(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Expense).offset(skip).limit(limit).all()

def get_expense_by_id(db: Session, expense_id: int):
    return db.query(Expense).filter(Expense.id == expense_id).first()

def update_expense(db: Session, expense_id: int, updated_expense: ExpenseCreate):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        return None
    setattr(expense, "title", updated_expense.title)
    setattr(expense, "amount", updated_expense.amount)
    setattr(expense, "category", updated_expense.category)
    db.commit()
    db.refresh(expense)
    return expense

def delete_expense(db: Session, expense_id: int):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        return None
    db.delete(expense)
    db.commit()
    return expense