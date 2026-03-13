import razorpay, hmac, hashlib
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.core.database import get_db
from app.core.config import settings
from app.core.security import require_investor
from app.models.user import User, Vehicle, Lead, Onboarding
from app.services.s3 import upload_to_s3
from app.services.pdf_generator import generate_agreement_pdf
from app.services.email import send_agreement_email
import io

# ── Public ──────────────────────────────────────────────────────────────
router = APIRouter()

@router.get("/fleet")
def public_fleet(db: Session = Depends(get_db)):
    vehicles = db.query(Vehicle).filter(Vehicle.status.in_(["active","available"])).all()
    return [{"id":v.id,"make":v.make,"model":v.model,"year":v.year,"status":v.status,
             "health_score":v.health_score,"guest_rating":v.guest_rating,
             "total_trips":v.total_trips} for v in vehicles]

class LeadCreate(BaseModel):
    company_name: str; contact_name: str; email: str; phone: str
    vehicle_count: int = 1; message: Optional[str] = None; source: str = "website"

@router.post("/leads")
def submit_lead(req: LeadCreate, db: Session = Depends(get_db)):
    lead = Lead(**req.dict()); db.add(lead); db.commit()
    return {"message": "Lead received. Our team will contact you within 24 hours.", "id": lead.id}

class OnboardingCreate(BaseModel):
    full_name: str; phone: str; email: str
    vehicle_make: str; vehicle_model: str; vehicle_year: int
    reg_number: str; asset_value: float; agreement_accepted: bool

@router.post("/onboarding")
def submit_onboarding(req: OnboardingCreate, request: Request, db: Session = Depends(get_db)):
    if not req.agreement_accepted:
        raise HTTPException(400, "Agreement must be accepted")

    onboarding = Onboarding(
        full_name=req.full_name, phone=req.phone, email=req.email,
        vehicle_make=req.vehicle_make, vehicle_model=req.vehicle_model,
        vehicle_year=req.vehicle_year, reg_number=req.reg_number,
        asset_value=req.asset_value, agreement_accepted=True,
        agreement_ip=request.client.host,
        agreement_timestamp=datetime.utcnow(),
    )
    db.add(onboarding)
    db.commit()
    db.refresh(onboarding)

    # ── Master Agreement Automation ──
    try:
        # 1. Generate PDF (returns S3 URL and raw bytes)
        agreement_url, pdf_bytes = generate_agreement_pdf(onboarding)
        onboarding.agreement_url = agreement_url
        db.commit()

        # 2. Email PDF to Investor as attachment
        send_agreement_email(
            user_email=onboarding.email,
            user_name=onboarding.full_name,
            agreement_url=agreement_url,
            pdf_content=pdf_bytes
        )
    except Exception as e:
        print(f"Contract automation failed: {e}")

    return {"message": "Onboarding submitted. Check your email for the Master Agreement.", "id": onboarding.id}
