import random, httpx
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import create_access_token, get_current_user
from app.core.config import settings
from app.models.user import User

router = APIRouter()

# In-memory OTP store (use Redis in production)
_otp_store: dict = {}

class SendOTPRequest(BaseModel):
    phone: str

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str

def send_otp_fast2sms(phone: str, otp: str):
    """Send OTP via Fast2SMS (Indian provider)"""
    if not settings.FAST2SMS_API_KEY:
        print(f"[DEV] OTP for {phone}: {otp}")
        return
    import httpx
    httpx.post(
        "https://www.fast2sms.com/dev/bulkV2",
        headers={"authorization": settings.FAST2SMS_API_KEY},
        params={"variables_values": otp, "route": "otp", "numbers": phone}
    )

@router.post("/send-otp")
def send_otp(req: SendOTPRequest, db: Session = Depends(get_db)):
    # Safely extract last 10 digits
    phone = "".join(filter(str.isdigit, req.phone))[-10:]
    if len(phone) != 10:
        raise HTTPException(400, "Invalid phone number")

    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    # In dev, always use 123456 for testing
    if settings.ENVIRONMENT == "development":
        otp = "123456"

    _otp_store[phone] = {
        "otp": otp,
        "expires": datetime.utcnow() + timedelta(minutes=5),
        "attempts": 0
    }

    send_otp_fast2sms(phone, otp)
    return {"message": "OTP sent", "phone": phone}

@router.post("/verify-otp")
def verify_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    phone = "".join(filter(str.isdigit, req.phone))[-10:]
    record = _otp_store.get(phone)

    if not record:
        raise HTTPException(400, "OTP not requested or expired")
    if datetime.utcnow() > record["expires"]:
        del _otp_store[phone]
        raise HTTPException(400, "OTP expired. Please request a new one.")
    if record["attempts"] >= 3:
        raise HTTPException(429, "Too many attempts. Request a new OTP.")
    if record["otp"] != req.otp:
        _otp_store[phone]["attempts"] += 1
        raise HTTPException(400, "Invalid OTP")

    del _otp_store[phone]

    # Get or create user
    user = db.query(User).filter(User.phone == phone).first()
    admin_list = settings.ADMIN_PHONES.split(",")
    
    if not user:
        role = "admin" if phone in admin_list else "investor"
        user = User(phone=phone, role=role)
        db.add(user)
    else:
        # Re-sync role if added to admin list
        if phone in admin_list and user.role != "admin":
            user.role = "admin"
            
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "token": token,
        "user": {
            "id": user.id, "phone": user.phone, "name": user.name,
            "role": user.role, "kycVerified": user.kyc_verified
        }
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id, "phone": current_user.phone,
        "name": current_user.name, "email": current_user.email,
        "role": current_user.role, "kycVerified": current_user.kyc_verified
    }
