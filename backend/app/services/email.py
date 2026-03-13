import logging
from typing import Optional, List
from pydantic import EmailStr

logger = logging.getLogger(__name__)

def send_email(
    to_email: EmailStr,
    subject: str,
    body: str,
    attachments: Optional[List[dict]] = None
):
    """
    Send an email with optional attachments.
    For production, integrate with SendGrid, Amazon SES, or Mailgun.
    
    Attachments format: [{"content": b"...", "filename": "contract.pdf", "type": "application/pdf"}]
    """
    logger.info(f"--- MOCK EMAIL SENT ---")
    logger.info(f"To: {to_email}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Body: {body[:100]}...")
    if attachments:
        for att in attachments:
            logger.info(f"Attachment: {att['filename']} ({len(att['content'])} bytes)")
    logger.info(f"-----------------------")
    
    return True

def send_agreement_email(user_email: str, user_name: str, agreement_url: str, pdf_content: bytes):
    """Sends the Master Agreement PDF to the investor."""
    subject = "Your 8-Lines Master Asset Management Agreement"
    body = f"Dear {user_name},\n\nPlease find attached your signed Master Asset Management Agreement.\n\nYou can also view it online here: {agreement_url}\n\nWelcome to the 8-Lines Network.\n\nBest regards,\n8-Lines Group"
    
    attachments = [{
        "content": pdf_content,
        "filename": "8Lines_Master_Agreement.pdf",
        "type": "application/pdf"
    }]
    
    return send_email(user_email, subject, body, attachments)
