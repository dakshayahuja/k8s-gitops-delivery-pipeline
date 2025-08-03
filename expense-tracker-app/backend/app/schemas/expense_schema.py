from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ExpenseBase(BaseModel):
    title: str
    amount: float
    category: str
    date: Optional[datetime] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: int
    created_at: datetime
    date: datetime

    class Config:
        from_attributes = True

class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[datetime] = None

class CategoryReport(BaseModel):
    category: str
    total_amount: float
    count: int
    percentage: float

class MonthlyReport(BaseModel):
    month: str
    total_amount: float
    count: int

class Settings(BaseModel):
    currency: str = "₹"
    theme: str = "light"
    notifications: bool = True