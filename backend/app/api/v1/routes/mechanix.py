from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.core.database import get_db
from app.core.security import require_mechanic, require_admin
from app.models.user import User, MechanixAudit, AuditItem, Vehicle, Payout
from app.services.s3 import upload_to_s3
from app.services.pdf_generator import generate_health_certificate, generate_repair_invoice

router = APIRouter()

# Strict, digitized Pass/Fail checklist derived from premium corporate mobility standards
AUDIT_TEMPLATE = [
    # 1. Legal & Compliance
    {"category":"Legal",      "label":"RC Copy & Comprehensive Insurance Present"},
    {"category":"Legal",      "label":"Valid Fitness Certificate"},
    {"category":"Legal",      "label":"RAC Registration Document"},
    {"category":"Legal",      "label":"First-Aid Box present in the vehicle"},
    
    # 2. Braking System
    {"category":"Braking",    "label":"Parking brake operational"},
    {"category":"Braking",    "label":"Service brake pads @ 3mm+ (min 25% life)"},
    
    # 3. Engine, Powertrain & Fluids
    {"category":"Engine",     "label":"Transmission, including clutch / torque converter"},
    {"category":"Engine",     "label":"All fluids and lubricants at optimal levels"},
    {"category":"Engine",     "label":"Dashboard clear of check engine lights / recalls"},
    {"category":"Engine",     "label":"Exhaust system / muffler — No blue/black smoke"},
    
    # 4. Steering & Suspension
    {"category":"Steering",   "label":"Steering wheel, box, springs, shocks & height"},
    
    # 5. Tires & Mirrors
    {"category":"Tires",      "label":"Tire tread depth 4/32″+ (50% or higher)"},
    {"category":"Tires",      "label":"Tires must be six years old or newer"},
    {"category":"Tires",      "label":"Tires: No cuts, gouges, bulges, or bubbles"},
    {"category":"Tires",      "label":"Rearview and general mirrors intact"},
    
    # 6. Safety Restraints & Body
    {"category":"Safety",     "label":"Seat Belts intact and usable"},
    {"category":"Safety",     "label":"No Airbag / SRS / OCS warning lights"},
    {"category":"Body",       "label":"No hanging body panels / pillar damage"},
    {"category":"Body",       "label":"Horn securely fastened and sounding adequate"},
    
    # 7. Glazing & Visibility
    {"category":"Glazing",    "label":"Windshield crack-free; Wipers & Washers functional"},
    {"category":"Glazing",    "label":"Window tint adhering to legal specifications"},
    {"category":"Glazing",    "label":"All Headlights, Rear, Hazard & License lights functional"},
]

class StartAuditRequest(BaseModel):
    vehicle_id: str

class UpdateItemRequest(BaseModel):
    result: str                   # pass | fail | needs_repair
    repair_cost: Optional[float] = 0.0
    notes: Optional[str] = None

class CompleteAuditRequest(BaseModel):
    total_repair_cost: float

@router.get("/audits")
def get_audits(db: Session = Depends(get_db), user: User = Depends(require_mechanic)):
    audits = db.query(MechanixAudit).filter(MechanixAudit.mechanic_id == user.id)\
               .order_by(MechanixAudit.created_at.desc()).limit(50).all()
    return [{"id":a.id,"vehicle_id":a.vehicle_id,"overall_result":a.overall_result,
             "total_repair_cost":a.total_repair_cost,"created_at":str(a.created_at),
             "completed_at":str(a.completed_at) if a.completed_at else None,
             "items_done": sum(1 for i in a.items if i.result != "pending"),
             "items_total": len(a.items)} for a in audits]

@router.post("/audits")
def start_audit(req: StartAuditRequest, db: Session = Depends(get_db), user: User = Depends(require_mechanic)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == req.vehicle_id).first()
    if not vehicle:
        raise HTTPException(404, "Vehicle not found")

    audit = MechanixAudit(vehicle_id=req.vehicle_id, mechanic_id=user.id)
    db.add(audit); db.flush()

    # Create all checklist items
    for tmpl in AUDIT_TEMPLATE:
        db.add(AuditItem(audit_id=audit.id, category=tmpl["category"], label=tmpl["label"]))

    db.commit(); db.refresh(audit)
    return {"id": audit.id, "vehicle_id": audit.vehicle_id, "items": len(AUDIT_TEMPLATE)}

@router.get("/audits/{audit_id}")
def get_audit(audit_id: str, db: Session = Depends(get_db), _=Depends(require_mechanic)):
    audit = db.query(MechanixAudit).filter(MechanixAudit.id == audit_id).first()
    if not audit:
        raise HTTPException(404, "Audit not found")
    return {
        "id": audit.id, "vehicle_id": audit.vehicle_id, "overall_result": audit.overall_result,
        "total_repair_cost": audit.total_repair_cost,
        "items": [{"id":i.id,"category":i.category,"label":i.label,"result":i.result,
                   "evidence_url":i.evidence_url,"repair_cost":i.repair_cost,"notes":i.notes} for i in audit.items]
    }

@router.put("/audits/{audit_id}/items/{item_id}")
def update_item(audit_id: str, item_id: str, req: UpdateItemRequest,
                db: Session = Depends(get_db), _=Depends(require_mechanic)):
    item = db.query(AuditItem).filter(AuditItem.id == item_id, AuditItem.audit_id == audit_id).first()
    if not item:
        raise HTTPException(404, "Audit item not found")

    # Enforce: fail/needs_repair requires evidence before allowing
    if req.result in ("fail", "needs_repair") and not item.evidence_url:
        # Allow setting result but flag it
        pass

    item.result      = req.result
    item.repair_cost = req.repair_cost or 0.0
    item.notes       = req.notes
    db.commit()
    return {"message": "Item updated", "result": req.result}

@router.post("/audits/{audit_id}/items/{item_id}/evidence")
async def upload_evidence(audit_id: str, item_id: str, file: UploadFile = File(...),
                          db: Session = Depends(get_db), _=Depends(require_mechanic)):
    item = db.query(AuditItem).filter(AuditItem.id == item_id, AuditItem.audit_id == audit_id).first()
    if not item:
        raise HTTPException(404, "Audit item not found")

    content = await file.read()
    key = f"audits/{audit_id}/{item_id}/{file.filename}"
    url = upload_to_s3(content, key, file.content_type)

    item.evidence_url = url
    db.commit()
    return {"evidence_url": url, "message": "Evidence uploaded"}

@router.post("/audits/{audit_id}/complete")
def complete_audit(audit_id: str, req: CompleteAuditRequest,
                   db: Session = Depends(get_db), _=Depends(require_mechanic)):
    audit = db.query(MechanixAudit).filter(MechanixAudit.id == audit_id).first()
    if not audit:
        raise HTTPException(404, "Audit not found")

    items = audit.items
    has_fail    = any(i.result in ("fail","needs_repair") for i in items)
    all_done    = all(i.result != "pending" for i in items)

    # Validate: fail items must have evidence
    for item in items:
        if item.result in ("fail","needs_repair") and not item.evidence_url:
            raise HTTPException(400, f"Evidence required for failed item: {item.label}")

    if not all_done:
        raise HTTPException(400, "Complete all checklist items first")

    audit.overall_result    = "fail" if has_fail else "pass"
    audit.total_repair_cost = req.total_repair_cost
    audit.completed_at      = datetime.utcnow()

    # Update vehicle health score
    pass_count    = sum(1 for i in items if i.result == "pass")
    health_score  = int((pass_count / len(items)) * 100)
    vehicle       = db.query(Vehicle).filter(Vehicle.id == audit.vehicle_id).first()
    if vehicle:
        vehicle.health_score    = health_score
        vehicle.last_audit_date = datetime.utcnow()
        if not has_fail:
            vehicle.status = "available"

    # Generate PDF certificate or invoice
    if not has_fail:
        cert_pdf = generate_health_certificate(audit, vehicle)
        audit.health_certificate_url = cert_pdf
    else:
        invoice_pdf = generate_repair_invoice(audit, vehicle, req.total_repair_cost)
        audit.invoice_url = invoice_pdf

        # Auto-deduct from investor's next payout
        if vehicle and req.total_repair_cost > 0:
            payout = db.query(Payout).filter(
                Payout.vehicle_id == vehicle.id,
                Payout.status == "pending"
            ).first()
            if payout:
                payout.mechanix_deductions += req.total_repair_cost
                payout.net_payout          -= req.total_repair_cost

    db.commit()
    return {
        "message": "Audit complete",
        "overall_result": audit.overall_result,
        "health_score": health_score,
        "total_repair_cost": req.total_repair_cost,
        "certificate_url": audit.health_certificate_url,
        "invoice_url": audit.invoice_url,
    }

@router.get("/audits/{audit_id}/certificate")
def get_certificate(audit_id: str, db: Session = Depends(get_db), _=Depends(require_mechanic)):
    audit = db.query(MechanixAudit).filter(MechanixAudit.id == audit_id).first()
    if not audit or not audit.health_certificate_url:
        raise HTTPException(404, "Certificate not available")
    return {"certificate_url": audit.health_certificate_url}
