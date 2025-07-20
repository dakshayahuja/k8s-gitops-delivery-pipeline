from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.expense_schema import ExpenseCreate, ExpenseResponse
from models.expense_model import Expense
from crud import expense_crud

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.post("/", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    return expense_crud.create_expense(db, expense)

@router.get("/", response_model=list[ExpenseResponse])
def read_expenses(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return expense_crud.get_expenses(db, skip=skip, limit=limit)

@router.post("/seed", response_model=list[ExpenseResponse])
def seed_expenses(db: Session = Depends(get_db)):
    seed_data = [
        Expense(title="Groceries", amount=150.75, category="Food"),
        Expense(title="Movie Night", amount=80.00, category="Entertainment"),
        Expense(title="Gym Membership", amount=999.99, category="Health"),
        Expense(title="Internet Bill", amount=499.00, category="Utilities"),
        Expense(title="Coffee", amount=89.50, category="Food"),
    ]

    db.add_all(seed_data)
    db.commit()

    for item in seed_data:
        db.refresh(item)

    return seed_data

@router.get("/{expense_id}", response_model=ExpenseResponse)
def read_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = expense_crud.get_expense_by_id(db, expense_id)
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense_route(expense_id: int, updated_data: ExpenseCreate, db: Session = Depends(get_db)):
    updated = expense_crud.update_expense(db, expense_id, updated_data)
    if updated is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return updated

# Delete route
@router.delete("/{expense_id}", response_model=ExpenseResponse)
def delete_expense_route(expense_id: int, db: Session = Depends(get_db)):
    deleted = expense_crud.delete_expense(db, expense_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return deleted