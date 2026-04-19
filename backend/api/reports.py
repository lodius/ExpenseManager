from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List, Dict
from datetime import datetime, timedelta
from ..database import SessionLocal, Expense
from pydantic import BaseModel

router = APIRouter()

# Pydantic models
class ExpenseSummary(BaseModel):
    total: float
    count: int
    average: float

class CategoryBreakdown(BaseModel):
    category: str
    total: float
    count: int
    percentage: float

class MonthlySummary(BaseModel):
    month: str
    year: int
    total: float
    count: int
    by_category: List[CategoryBreakdown]

class DailySummary(BaseModel):
    date: str
    total: float
    count: int

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/summary", response_model=ExpenseSummary)
def get_total_summary(db: Session = Depends(get_db)):
    """Get total spending summary across all expenses"""
    total = db.query(func.sum(Expense.amount)).scalar() or 0.0
    count = db.query(func.count(Expense.id)).scalar() or 0
    average = total / count if count > 0 else 0.0
    
    return {
        "total": total,
        "count": count,
        "average": average
    }

@router.get("/monthly", response_model=List[MonthlySummary])
def get_monthly_summary(db: Session = Depends(get_db)):
    """Get monthly expense breakdown"""
    expenses = db.query(Expense).all()
    
    # Group by month/year
    monthly_data = {}
    for expense in expenses:
        key = expense.date.strftime("%Y-%m")
        if key not in monthly_data:
            monthly_data[key] = {
                "month": expense.date.strftime("%B"),
                "year": expense.date.year,
                "total": 0,
                "count": 0,
                "by_category": {}
            }
        
        monthly_data[key]["total"] += expense.amount
        monthly_data[key]["count"] += 1
        
        category = expense.category or "Uncategorized"
        if category not in monthly_data[key]["by_category"]:
            monthly_data[key]["by_category"][category] = {"total": 0, "count": 0}
        
        monthly_data[key]["by_category"][category]["total"] += expense.amount
        monthly_data[key]["by_category"][category]["count"] += 1
    
    # Format response
    result = []
    for key in sorted(monthly_data.keys(), reverse=True):
        data = monthly_data[key]
        category_breakdown = []
        
        for cat, vals in data["by_category"].items():
            percentage = (vals["total"] / data["total"] * 100) if data["total"] > 0 else 0
            category_breakdown.append({
                "category": cat,
                "total": vals["total"],
                "count": vals["count"],
                "percentage": round(percentage, 2)
            })
        
        result.append({
            "month": data["month"],
            "year": data["year"],
            "total": data["total"],
            "count": data["count"],
            "by_category": category_breakdown
        })
    
    return result

@router.get("/daily", response_model=List[DailySummary])
def get_daily_summary(days: int = Query(30, ge=1, le=365), db: Session = Depends(get_db)):
    """Get daily expense summary for the last N days"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    expenses = db.query(Expense).filter(Expense.date >= cutoff_date).all()
    
    daily_data = {}
    for expense in expenses:
        date_key = expense.date.strftime("%Y-%m-%d")
        if date_key not in daily_data:
            daily_data[date_key] = {"total": 0, "count": 0}
        
        daily_data[date_key]["total"] += expense.amount
        daily_data[date_key]["count"] += 1
    
    result = []
    for date_str in sorted(daily_data.keys()):
        result.append({
            "date": date_str,
            "total": daily_data[date_str]["total"],
            "count": daily_data[date_str]["count"]
        })
    
    return result

@router.get("/by-category", response_model=List[CategoryBreakdown])
def get_by_category(db: Session = Depends(get_db)):
    """Get spending breakdown by category"""
    expenses = db.query(Expense).all()
    
    category_totals = {}
    for expense in expenses:
        category = expense.category or "Uncategorized"
        if category not in category_totals:
            category_totals[category] = {"total": 0, "count": 0}
        
        category_totals[category]["total"] += expense.amount
        category_totals[category]["count"] += 1
    
    total_spending = sum(cat["total"] for cat in category_totals.values())
    
    result = []
    for category, data in sorted(category_totals.items(), key=lambda x: x[1]["total"], reverse=True):
        percentage = (data["total"] / total_spending * 100) if total_spending > 0 else 0
        result.append({
            "category": category,
            "total": data["total"],
            "count": data["count"],
            "percentage": round(percentage, 2)
        })
    
    return result

@router.get("/date-range", response_model=ExpenseSummary)
def get_summary_by_date_range(
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """Get expense summary for a specific date range"""
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        end = end.replace(hour=23, minute=59, second=59)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    total = db.query(func.sum(Expense.amount)).filter(
        Expense.date >= start,
        Expense.date <= end
    ).scalar() or 0.0
    
    count = db.query(func.count(Expense.id)).filter(
        Expense.date >= start,
        Expense.date <= end
    ).scalar() or 0
    
    average = total / count if count > 0 else 0.0
    
    return {
        "total": total,
        "count": count,
        "average": average
    }
