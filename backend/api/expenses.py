from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ..database import SessionLocal, Expense
from pydantic import BaseModel
import datetime
from sqlalchemy import func

# Pydantic models for request/response
class ExpenseBase(BaseModel):
    amount: float
    description: str
    category: str
    source: str
    date: datetime.datetime = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    amount: float = None
    description: str = None
    category: str = None
    source: str = None
    date: datetime.datetime = None

class ExpenseResponse(BaseModel):
    id: int
    amount: float
    description: str
    category: str
    source: str
    date: datetime.datetime

    class Config:
        from_attributes = True

class DailyTrendResponse(BaseModel):
    date: str
    total: float

class CategoryBreakdownResponse(BaseModel):
    category: str
    total: float
    percentage: float

class SummaryResponse(BaseModel):
    total: float
    count: int
    average: float

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter()

@router.post("/", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    """Create a new expense"""
    db_expense = Expense(
        amount=expense.amount,
        description=expense.description,
        category=expense.category,
        source=expense.source,
        date=expense.date if expense.date else datetime.datetime.utcnow()
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/", response_model=List[ExpenseResponse])
def read_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    category: str = Query(None),
    source: str = Query(None),
    min_amount: float = Query(None),
    max_amount: float = Query(None),
    db: Session = Depends(get_db)
):
    """Get expenses with optional filtering"""
    query = db.query(Expense)
    
    if category:
        query = query.filter(Expense.category == category)
    if source:
        query = query.filter(Expense.source == source)
    if min_amount is not None:
        query = query.filter(Expense.amount >= min_amount)
    if max_amount is not None:
        query = query.filter(Expense.amount <= max_amount)
    
    return query.order_by(Expense.date.desc()).offset(skip).limit(limit).all()

@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    """Get a specific expense by ID"""
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, expense: ExpenseUpdate, db: Session = Depends(get_db)):
    """Update an expense"""
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    if expense.amount is not None:
        db_expense.amount = expense.amount
    if expense.description is not None:
        db_expense.description = expense.description
    if expense.category is not None:
        db_expense.category = expense.category
    if expense.source is not None:
        db_expense.source = expense.source
    if expense.date is not None:
        db_expense.date = expense.date
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.delete("/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    """Delete an expense"""
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(db_expense)
    db.commit()
    return {"message": "Expense deleted successfully"}

@router.get("/reports/summary", response_model=SummaryResponse)
def get_expense_summary(db: Session = Depends(get_db)):
    """Get total expense summary"""
    total = db.query(func.sum(Expense.amount)).scalar() or 0.0
    count = db.query(func.count(Expense.id)).scalar() or 0
    return {
        "total": total,
        "count": count,
        "average": total / count if count > 0 else 0.0
    }

@router.get("/reports/daily", response_model=List[DailyTrendResponse])
def get_daily_trend(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """Get daily expense trend for the last N days"""
    results = db.query(
        func.date(Expense.date).label('date'),
        func.sum(Expense.amount).label('total')
    ).filter(
        Expense.date >= datetime.datetime.utcnow() - datetime.timedelta(days=days)
    ).group_by(
        func.date(Expense.date)
    ).order_by(
        func.date(Expense.date)
    ).all()
    
    return [
        {"date": str(row.date), "total": float(row.total)}
        for row in results
    ]

@router.get("/reports/category", response_model=List[CategoryBreakdownResponse])
def get_category_breakdown(db: Session = Depends(get_db)):
    """Get expense breakdown by category"""
    results = db.query(
        Expense.category,
        func.sum(Expense.amount).label('total')
    ).group_by(
        Expense.category
    ).all()
    
    total_sum = sum(row.total for row in results) or 1
    
    return [
        {
            "category": row.category,
            "total": float(row.total),
            "percentage": float((row.total / total_sum) * 100)
        }
        for row in results
    ]

