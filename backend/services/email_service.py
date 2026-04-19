import imaplib
import email
from email.header import decode_header
import os
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.imap_server = os.getenv("IMAP_SERVER")
        self.email_user = os.getenv("EMAIL_USER")
        self.email_pass = os.getenv("EMAIL_PASS")

    def fetch_emails(self, search_criteria="UNSEEN"):
        if not all([self.imap_server, self.email_user, self.email_pass]):
            raise ValueError("Email credentials not configured in .env file")

        mail = imaplib.IMAP4_SSL(self.imap_server)
        try:
            mail.login(self.email_user, self.email_pass)
        except imaplib.IMAP4.error as e:
            error_text = str(e)
            if "Application-specific password required" in error_text:
                raise ValueError(
                    "Gmail requires an app-specific password for IMAP access. "
                    "Create one in your Google Account security settings and retry. "
                    "See https://support.google.com/accounts/answer/185833"
                ) from e
            raise ValueError(f"IMAP login failed: {error_text}") from e

        mail.select("inbox")

        status, messages = mail.search(None, search_criteria)
        email_ids = messages[0].split()
        
        fetched_emails = []
        for e_id in email_ids:
            res, msg_data = mail.fetch(e_id, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    subject = decode_header(msg["Subject"])[0][0]
                    if isinstance(subject, bytes):
                        subject = subject.decode()
                    
                    content = ""
                    if msg.is_multipart():
                        for part in msg.walk():
                            if part.get_content_type() == "text/plain":
                                content = part.get_payload(decode=True).decode()
                                break
                    else:
                        content = msg.get_payload(decode=True).decode()
                    
                    fetched_emails.append({
                        "subject": subject,
                        "content": content,
                        "id": e_id.decode()
                    })
        
        mail.logout()
        return fetched_emails

    def parse_expense_from_content(self, content: str):
        # Placeholder for bank statement parsing logic.
        # Parse amount, date, and category from email content.
        # In production, use regex, templates, or LLM for bank-specific formats.
        import re
        
        # Example pattern: "Amount: $123.45"
        amount_match = re.search(r"Amount:\s*\$?\s*(\d+\.\d{2})", content)
        description_match = re.search(r"Description:\s*(.*)", content)
        
        if amount_match and description_match:
            return {
                "amount": float(amount_match.group(1)),
                "description": description_match.group(1).strip(),
                "category": "Uncategorized",
                "source": "Email"
            }
        return None
