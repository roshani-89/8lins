from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional
import io, openpyxl

from app.core.database import get_db
from app.core.security import require_investor
from app.models.user import User, Trip, Payout, Ticket, TicketReply, BankDetail, VehiclePause, Vehicle

router = APIRouter()

# ── Stats ─────────────────────────────────────────────────────────────
@router.get("/stats")
def get_stats(db: Session = Depends(get_db), user: User = Depends(require_investor)):
    vehicles = db.query(Vehicle).filter(Vehicle.owner_id == user.id).all()
    vehicle_ids = [v.id for v in vehicles]

    now = datetime.utcnow()
    month_str = now.strftime("%Y-%m")

    # This month trips
    month_trips = db.query(Trip).filter(
        Trip.vehicle_id.in_(vehicle_ids),
        func.strftime("%Y-%m", Trip.start_date) == month_str
    ).all() if vehicle_ids else []

    this_month_gross = sum(t.gross_rent for t in month_trips)
    this_month_net   = sum(t.net_yield  for t in month_trips)

    # Upcoming bookings
    upcoming = db.query(Trip).filter(
        Trip.vehicle_id.in_(vehicle_ids),
        Trip.status == "upcoming"
    ).count() if vehicle_ids else 0

    locked_rev = sum(t.net_yield for t in db.query(Trip).filter(
        Trip.vehicle_id.in_(vehicle_ids),
        Trip.status == "upcoming"
    ).all()) if vehicle_ids else 0

    # Pause days
    used_pauses = db.query(VehiclePause).filter(
        VehiclePause.vehicle_id.in_(vehicle_ids),
        VehiclePause.pause_date >= f"{now.year}-{now.month:02d}-01"
    ).count() if vehicle_ids else 0

    return {
        "lockedRevenue":       locked_rev,
        "nextPayoutDate":     "2026-03-15",
        "nextPayoutAmount":   locked_rev * 0.70,
        "thisMonthNet":       this_month_net,
        "thisMonthGross":     this_month_gross,
        "totalEarned":         0,
        "upcomingBookings":    upcoming,
        "pauseDaysUsed":      used_pauses,
        "pauseDaysRemaining": max(0, 5 - used_pauses),
    }

# ── Trips / Ledger ────────────────────────────────────────────────────
@router.get("/trips")
def get_trips(page: int = 1, limit: int = 20, db: Session = Depends(get_db), user: User = Depends(require_investor)):
    vehicles = db.query(Vehicle).filter(Vehicle.owner_id == user.id).all()
    vehicle_ids = [v.id for v in vehicles]
    if not vehicle_ids:
        return {"trips": [], "total": 0}

    total = db.query(Trip).filter(Trip.vehicle_id.in_(vehicle_ids)).count()
    trips = db.query(Trip).filter(Trip.vehicle_id.in_(vehicle_ids))\
              .order_by(Trip.created_at.desc()).offset((page-1)*limit).limit(limit).all()

    return {
        "trips": [{"id":t.id,"vehicleId":t.vehicle_id,"guestName":t.guest_name,
                   "startDate":str(t.start_date),"endDate":str(t.end_date),
                   "grossRent":t.gross_rent,"platformFee":t.platform_fee,
                   "mechanixDeduction":t.mechanix_deduction,"netYield":t.net_yield,
                   "status":t.status} for t in trips],
        "total": total, "page": page
    }

# ── Excel Export ──────────────────────────────────────────────────────
@router.get("/export")
def export_ledger(month: Optional[str] = None, db: Session = Depends(get_db), user: User = Depends(require_investor)):
    vehicles = db.query(Vehicle).filter(Vehicle.owner_id == user.id).all()
    vehicle_ids = [v.id for v in vehicles]

    q = db.query(Trip).filter(Trip.vehicle_id.in_(vehicle_ids))
    if month:
        q = q.filter(func.strftime("%Y-%m", Trip.start_date) == month)
    trips = q.order_by(Trip.start_date.desc()).all()

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "8-Lines Ledger"
    ws.append(["Trip ID","Vehicle ID","Guest","Start Date","End Date","Gross Rent","Platform Fee (30%)","Mechanix Deduction","Net Yield (70%)","Status"])
    for t in trips:
        ws.append([str(t.id)[:8], str(t.vehicle_id)[:8], t.guest_name or "-",
                   str(t.start_date)[:10], str(t.end_date)[:10],
                   t.gross_rent, t.platform_fee, t.mechanix_deduction, t.net_yield, t.status])

    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    fn = f"8lines-ledger-{month or 'all'}.xlsx"
    return StreamingResponse(buf, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                             headers={"Content-Disposition": f"attachment; filename={fn}"})

# ── Vehicles ───────────────────────────────────────────────────────────
@router.get("/vehicles")
def get_vehicles(db: Session = Depends(get_db), user: User = Depends(require_investor)):
    vehicles = db.query(Vehicle).filter(Vehicle.owner_id == user.id).all()
    return [{"id":v.id,"make":v.make,"model":v.model,"year":v.year,"registrationNumber":v.registration_number,
             "status":v.status,"healthScore":v.health_score,"totalTrips":v.total_trips,
             "guestRating":v.guest_rating} for v in vehicles]

# ── Payouts ────────────────────────────────────────────────────────────
@router.get("/payouts")
def get_payouts(db: Session = Depends(get_db), user: User = Depends(require_investor)):
    payouts = db.query(Payout).filter(Payout.investor_id == user.id).order_by(Payout.created_at.desc()).all()
    return [{"id":p.id,"month":p.month,"grossRevenue":p.gross_revenue,"platformFee":p.platform_fee,
             "mechanixDeductions":p.mechanix_deductions,"netPayout":p.net_payout,"status":p.status} for p in payouts]

# ── Pause Calendar ─────────────────────────────────────────────────────
class PauseRequest(BaseModel):
    dates: List[str]

@router.post("/vehicles/{vehicle_id}/pause")
def pause_vehicle(vehicle_id: str, req: PauseRequest, db: Session = Depends(get_db), user: User = Depends(require_investor)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id, Vehicle.owner_id == user.id).first()
    if not vehicle:
        raise HTTPException(404, "Vehicle not found")

    # Check 5-day quarterly limit
    now = datetime.utcnow()
    quarter_start = f"{now.year}-{((now.month-1)//3)*3+1:02d}-01"
    used = db.query(VehiclePause).filter(VehiclePause.vehicle_id == vehicle_id,
                                          VehiclePause.pause_date >= quarter_start).count()
    if used + len(req.dates) > 5:
        raise HTTPException(400, f"Quarterly pause limit exceeded. Used: {used}/5")

    for date in req.dates:
        db.add(VehiclePause(vehicle_id=vehicle_id, pause_date=date))
    db.commit()
    return {"message": f"{len(req.dates)} day(s) paused successfully"}

# ── Tickets ────────────────────────────────────────────────────────────
class TicketCreate(BaseModel):
    subject: str; message: str; priority: str = "medium"; vehicle_id: Optional[str] = None

class TicketReplyCreate(BaseModel):
    message: str

@router.get("/tickets")
def get_tickets(db: Session = Depends(get_db), user: User = Depends(require_investor)):
    tickets = db.query(Ticket).filter(Ticket.investor_id == user.id).order_by(Ticket.created_at.desc()).all()
    return [{"id":t.id,"subject":t.subject,"status":t.status,"priority":t.priority,
             "createdAt":str(t.created_at),"replyCount":len(t.replies)} for t in tickets]

@router.post("/tickets")
def create_ticket(req: TicketCreate, db: Session = Depends(get_db), user: User = Depends(require_investor)):
    ticket = Ticket(investor_id=user.id, subject=req.subject, message=req.message,
                    priority=req.priority, vehicle_id=req.vehicle_id)
    db.add(ticket); db.commit(); db.refresh(ticket)
    return {"id": ticket.id, "message": "Ticket created"}

@router.post("/tickets/{ticket_id}/reply")
def reply_ticket(ticket_id: str, req: TicketReplyCreate, db: Session = Depends(get_db), user: User = Depends(require_investor)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id, Ticket.investor_id == user.id).first()
    if not ticket:
        raise HTTPException(404, "Ticket not found")
    reply = TicketReply(ticket_id=ticket_id, sender_id=user.id, sender_role="investor", message=req.message)
    db.add(reply); db.commit()
    return {"message": "Reply sent"}

# ── Bank Details ───────────────────────────────────────────────────────
class BankDetailIn(BaseModel):
    account_number: Optional[str] = None
    ifsc_code: Optional[str] = None
    upi_id: Optional[str] = None

@router.get("/bank")
def get_bank(db: Session = Depends(get_db), user: User = Depends(require_investor)):
    b = db.query(BankDetail).filter(BankDetail.user_id == user.id).first()
    if not b:
        return {}
    return {"accountNumber": b.account_number, "ifscCode": b.ifsc_code, "upiId": b.upi_id}

@router.put("/bank")
def save_bank(req: BankDetailIn, db: Session = Depends(get_db), user: User = Depends(require_investor)):
    b = db.query(BankDetail).filter(BankDetail.user_id == user.id).first()
    if not b:
        b = BankDetail(user_id=user.id)
        db.add(b)
    if req.account_number: b.account_number = req.account_number
    if req.ifsc_code:      b.ifsc_code      = req.ifsc_code
    if req.upi_id:         b.upi_id         = req.upi_id
    db.commit()
    return {"message": "Bank details saved"}
@router.get("/documents")
def get_documents(db: Session = Depends(get_db), user: User = Depends(require_investor)):
    vehicles = db.query(Vehicle).filter(Vehicle.owner_id == user.id).all()
    docs = []
    
    for v in vehicles:
        if v.agreement_url:
            docs.append({
                "name": f"Master Agreement — {v.make} {v.model}",
                "date": str(v.created_at)[:10],
                "type": "Contract",
                "url": v.agreement_url,
                "icon": "📋"
            })
        
        # Add mechanix audits too
        audits = db.query(MechanixAudit).filter(MechanixAudit.vehicle_id == v.id).all()
        for a in audits:
            if a.health_certificate_url:
                docs.append({
                    "name": f"Health Certificate — {v.registration_number}",
                    "date": (str(a.completed_at)[:10] if a.completed_at else str(a.created_at)[:10]),
                    "type": "Audit",
                    "url": a.health_certificate_url,
                    "icon": "🔧"
                })
            if a.invoice_url:
                docs.append({
                    "name": f"Repair Invoice — {v.registration_number}",
                    "date": (str(a.completed_at)[:10] if a.completed_at else str(a.created_at)[:10]),
                    "type": "Invoice",
                    "url": a.invoice_url,
                    "icon": "🧾"
                })
    
    return sorted(docs, key=lambda x: x["date"], reverse=True)
