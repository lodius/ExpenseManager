import asyncio
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import SessionLocal, Expense
from ..services.email_service import EmailService
from pydantic import BaseModel
import datetime

router = APIRouter()

DEFAULT_SYNC_TIMEOUT = 30

class EmailFetchResponse(BaseModel):
    success: bool
    message: str
    expenses_found: int

@router.post("/fetch-emails", response_model=EmailFetchResponse)
async def fetch_and_process_emails():
    service = EmailService()
    db = SessionLocal()
    expenses_created = 0

    try:
        emails = await asyncio.wait_for(
            asyncio.to_thread(service.fetch_emails),
            timeout=DEFAULT_SYNC_TIMEOUT,
        )

        for email_data in emails:
            parsed_expense = service.parse_expense_from_content(email_data['content'])
            if parsed_expense:
                new_expense = Expense(
                    amount=parsed_expense['amount'],
                    description=parsed_expense['description'],
                    category=parsed_expense['category'],
                    source=parsed_expense['source'],
                    date=datetime.datetime.utcnow()
                )
                db.add(new_expense)
                expenses_created += 1

        db.commit()
        return {
            "success": True,
            "message": f"Successfully processed emails. Created {expenses_created} expenses.",
            "expenses_found": expenses_created
        }
    except asyncio.TimeoutError:
        db.rollback()
        return {
            "success": False,
            "message": "Email sync timed out. Please try again later or check your email server settings.",
            "expenses_found": 0
        }
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": f"Error fetching emails: {str(e)}",
            "expenses_found": 0
        }
    finally:
        db.close()
