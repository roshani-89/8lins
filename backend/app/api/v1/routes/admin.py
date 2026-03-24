from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional

from app.core.database import get_db
from app.core.security import require_admin
from app.models.user import (User, Vehicle, Trip, Payout, Ticket, TicketReply, Lead, MechanixAudit, Onboarding)

router = APIRouter()

# ── Stats ──────────────────────────────────────────────────────────────
@router.get("/stats")
def get_stats(db: Session = Depends(get_db), _=Depends(require_admin)):
    now = datetime.utcnow()
    today = now.strftime("%Y-%m-%d")

    total_gross    = db.query(func.sum(Trip.gross_rent)).scalar() or 0
    platform_cut   = db.query(func.sum(Trip.platform_fee)).scalar() or 0
    active_vehicles= db.query(Vehicle).filter(Vehicle.status == "active").count()
    total_investors= db.query(User).filter(User.role == "investor").count()
    pending_kyc    = db.query(User).filter(User.role == "investor", User.kyc_verified == False).count()
    open_tickets   = db.query(Ticket).filter(Ticket.status.in_(["open","in_progress"])).count()
    pending_onboarding = db.query(Onboarding).filter(Onboarding.payment_status == "paid").count()

    return {
        "total_gross_revenue": total_gross,
        "platform_cut": platform_cut, # Strategic 30% Corporate Cut
        "active_vehicles": active_vehicles,
        "total_investors": total_investors,
        "pending_kyc": pending_kyc,
        "open_tickets": open_tickets,
        "pending_onboarding": pending_onboarding,
        "today_trips": 0,
    }

# ── Fleet ───────────────────────────────────────────────────────────────
@router.get("/fleet")
def get_fleet(db: Session = Depends(get_db), _=Depends(require_admin)):
    vehicles = db.query(Vehicle).all()
    return [{"id":v.id,"make":v.make,"model":v.model,"year":v.year,"reg":v.registration_number,
             "owner_id":v.owner_id,"status":v.status,"health_score":v.health_score,
             "total_trips":v.total_trips,"guest_rating":v.guest_rating} for v in vehicles]

# ── Investors & Onboarding ──────────────────────────────────────────────
@router.get("/investors")
def get_investors(db: Session = Depends(get_db), _=Depends(require_admin)):
    investors = db.query(User).filter(User.role == "investor").all()
    return [{"id":u.id,"phone":u.phone,"name":u.name,"email":u.email,
             "kyc_verified":u.kyc_verified,"created_at":str(u.created_at),
             "onboarding_fee_paid": True, # Users in table already finished flow usually
             "vehicle_count": db.query(Vehicle).filter(Vehicle.owner_id == u.id).count()} for u in investors]

@router.get("/onboardings")
def get_onboardings(db: Session = Depends(get_db), _=Depends(require_admin)):
    onboardings = db.query(Onboarding).order_by(Onboarding.created_at.desc()).all()
    return [{"id":o.id,"name":o.full_name,"phone":o.phone,"email":o.email,
             "vehicle": f"{o.vehicle_make} {o.vehicle_model} ({o.reg_number})",
             "payment_status": o.payment_status,"created_at": str(o.created_at)} for o in onboardings]

@router.post("/onboardings/{id}/approve")
def approve_onboarding(id: str, db: Session = Depends(get_db), _=Depends(require_admin)):
    onboarding = db.query(Onboarding).filter(Onboarding.id == id).first()
    if not onboarding: raise HTTPException(404, "Onboarding session not found")
    
    # Check if user already exists
    user = db.query(User).filter(User.phone == onboarding.phone).first()
    if not user:
        user = User(phone=onboarding.phone, name=onboarding.full_name, email=onboarding.email, role="investor")
        db.add(user); db.flush()
    
    # Create vehicle
    vehicle = Vehicle(
        owner_id=user.id, make=onboarding.vehicle_make, model=onboarding.vehicle_model,
        year=onboarding.vehicle_year, registration_number=onboarding.reg_number,
        asset_value=onboarding.asset_value, status="audit_pending",
        rc_s3_key=None, insurance_s3_key=None, # In production these would map from onboarding
        agreement_url=onboarding.agreement_url
    )
    db.add(vehicle); db.commit()
    return {"message": "Onboarding converted to Active Portfolio Asset"}

@router.post("/investors/{user_id}/approve-kyc")
def approve_kyc(user_id: str, db: Session = Depends(get_db), _=Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.kyc_verified = True
    db.commit()
    return {"message": f"KYC approved for {user.phone}"}

class RejectKYCRequest(BaseModel):
    reason: str

@router.post("/investors/{user_id}/reject-kyc")
def reject_kyc(user_id: str, req: RejectKYCRequest, db: Session = Depends(get_db), _=Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.kyc_verified = False
    db.commit()
    return {"message": f"KYC rejected for {user.phone}. Reason: {req.reason}"}

# ── CFO Payout Engine ────────────────────────────────────────────────────
class PayoutRequest(BaseModel):
    vehicle_id: str
    gross_revenue: float
    platform_fee: float
    mechanix_deduction: float
    net_payout: float
    month: Optional[str] = None

@router.post("/payouts/process")
def process_payout(req: PayoutRequest, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == req.vehicle_id).first()
    if not vehicle:
        raise HTTPException(404, "Vehicle not found")

    month = req.month or datetime.utcnow().strftime("%Y-%m")

    payout = Payout(
        investor_id=vehicle.owner_id,
        vehicle_id=req.vehicle_id,
        month=month,
        gross_revenue=req.gross_revenue,
        platform_fee=req.platform_fee,
        mechanix_deductions=req.mechanix_deduction,
        net_payout=req.net_payout,
        status="processed",
        processed_at=datetime.utcnow(),
    )
    db.add(payout)
    db.commit()
    return {"message": "Payout processed", "payout_id": payout.id, "net_payout": req.net_payout}

# ── Tickets (Admin) ───────────────────────────────────────────────────────
@router.get("/tickets")
def get_tickets(db: Session = Depends(get_db), _=Depends(require_admin)):
    tickets = db.query(Ticket).order_by(Ticket.created_at.desc()).all()
    return [{"id":t.id,"investor_id":t.investor_id,"subject":t.subject,"status":t.status,
             "priority":t.priority,"created_at":str(t.created_at),"reply_count":len(t.replies)} for t in tickets]

class ReplyRequest(BaseModel):
    message: str

@router.post("/tickets/{ticket_id}/reply")
def reply_ticket(ticket_id: str, req: ReplyRequest, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(404, "Ticket not found")
    ticket.status = "in_progress"
    reply = TicketReply(ticket_id=ticket_id, sender_id=admin.id, sender_role="admin", message=req.message)
    db.add(reply); db.commit()
    return {"message": "Reply sent"}

# ── Leads ─────────────────────────────────────────────────────────────────
@router.get("/leads")
def get_leads(db: Session = Depends(get_db), _=Depends(require_admin)):
    leads = db.query(Lead).order_by(Lead.created_at.desc()).all()
    return [{"id":l.id,"company_name":l.company_name,"contact_name":l.contact_name,
             "email":l.email,"phone":l.phone,"vehicle_count":l.vehicle_count,
             "status":l.status,"created_at":str(l.created_at)} for l in leads]

class LeadUpdate(BaseModel):
    status: str

@router.put("/leads/{lead_id}")
def update_lead(lead_id: str, req: LeadUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(404, "Lead not found")
    lead.status = req.status; db.commit()
    return {"message": "Lead updated"}
