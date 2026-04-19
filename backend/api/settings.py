import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import os
from dotenv import load_dotenv, set_key

router = APIRouter()

load_dotenv()

ENV_FILE = ".env"

class EmailSettings(BaseModel):
    imap_server: str
    email_user: EmailStr
    email_pass: str

class EmailSettingsResponse(BaseModel):
    imap_server: str
    email_user: str
    status: str

@router.get("/", response_model=EmailSettingsResponse)
def get_email_settings():
    """Get current email settings (password masked)"""
    imap_server = os.getenv("IMAP_SERVER", "")
    email_user = os.getenv("EMAIL_USER", "")
    
    status = "configured" if imap_server and email_user else "not_configured"
    
    return {
        "imap_server": imap_server,
        "email_user": email_user,
        "status": status
    }

@router.post("/", response_model=dict)
def save_email_settings(settings: EmailSettings):
    """Save email settings to .env file"""
    try:
        # Create .env file if it doesn't exist
        if not os.path.exists(ENV_FILE):
            with open(ENV_FILE, "w") as f:
                f.write("")
        
        # Update or create environment variables
        set_key(ENV_FILE, "IMAP_SERVER", settings.imap_server)
        set_key(ENV_FILE, "EMAIL_USER", settings.email_user)
        set_key(ENV_FILE, "EMAIL_PASS", settings.email_pass)
        
        # Reload environment variables
        load_dotenv(override=True)
        
        return {
            "success": True,
            "message": "Email settings saved successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save email settings: {str(e)}"
        )

DEFAULT_EMAIL_TEST_TIMEOUT = 15

@router.post("/test")
async def test_email_connection():
    """Test the email connection"""
    from ..services.email_service import EmailService

    try:
        service = EmailService()
        emails = await asyncio.wait_for(
            asyncio.to_thread(service.fetch_emails, search_criteria="ALL"),
            timeout=DEFAULT_EMAIL_TEST_TIMEOUT,
        )

        return {
            "success": True,
            "message": f"Connection successful! Found {len(emails)} emails.",
            "email_count": len(emails)
        }
    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=504,
            detail="Connection timed out while testing email settings. Please try again or verify your IMAP server settings.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Connection failed: {str(e)}"
        )
