import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

def gen_uuid():
    return str(uuid.uuid4())

# ── User ────────────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"
    id            = Column(String, primary_key=True, default=gen_uuid)
    phone         = Column(String(15), unique=True, nullable=False, index=True)
    name          = Column(String(100), nullable=True)
    email         = Column(String(200), nullable=True)
    role          = Column(Enum("investor","admin","mechanic", name="user_role"), default="investor")
    kyc_verified  = Column(Boolean, default=False)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime, default=datetime.utcnow)
    pan_number    = Column(String(20), nullable=True)
    aadhaar_number= Column(String(20), nullable=True)
    pan_s3_key    = Column(String(500), nullable=True)
    aadhaar_s3_key= Column(String(500), nullable=True)

    vehicles      = relationship("Vehicle", back_populates="owner")
    payouts       = relationship("Payout",  back_populates="investor")
    tickets       = relationship("Ticket",  back_populates="investor")
    bank_detail   = relationship("BankDetail", back_populates="user", uselist=False)

# ── Vehicle ──────────────────────────────────────────────────────────
class Vehicle(Base):
    __tablename__ = "vehicles"
    id                   = Column(String, primary_key=True, default=gen_uuid)
    owner_id             = Column(String, ForeignKey("users.id"), nullable=False)
    make                 = Column(String(100), nullable=False)
    model                = Column(String(100), nullable=False)
    year                 = Column(Integer, nullable=False)
    registration_number  = Column(String(20), unique=True, nullable=False)
    asset_value          = Column(Float, nullable=False)
    status               = Column(Enum("active","audit_pending","paused","maintenance","available", name="vehicle_status"), default="audit_pending")
    health_score         = Column(Integer, default=100)
    last_audit_date      = Column(DateTime, nullable=True)
    total_trips          = Column(Integer, default=0)
    guest_rating         = Column(Float, default=0.0)
    rc_s3_key            = Column(String(500), nullable=True)
    insurance_s3_key     = Column(String(500), nullable=True)
    agreement_url        = Column(String(500), nullable=True)
    created_at           = Column(DateTime, default=datetime.utcnow)

    owner    = relationship("User",    back_populates="vehicles")
    trips    = relationship("Trip",    back_populates="vehicle")
    audits   = relationship("MechanixAudit", back_populates="vehicle")
    pauses   = relationship("VehiclePause",  back_populates="vehicle")

# ── Trip ────────────────────────────────────────────────────────────
class Trip(Base):
    __tablename__ = "trips"
    id                   = Column(String, primary_key=True, default=gen_uuid)
    vehicle_id           = Column(String, ForeignKey("vehicles.id"), nullable=False)
    guest_name           = Column(String(200), nullable=True)
    start_date           = Column(DateTime, nullable=False)
    end_date             = Column(DateTime, nullable=False)
    gross_rent           = Column(Float, nullable=False)
    platform_fee         = Column(Float, nullable=False)       # 30%
    mechanix_deduction   = Column(Float, default=0.0)
    net_yield            = Column(Float, nullable=False)       # 70%
    status               = Column(Enum("completed","active","upcoming","cancelled", name="trip_status"), default="upcoming")
    created_at           = Column(DateTime, default=datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="trips")

# ── Payout ───────────────────────────────────────────────────────────
class Payout(Base):
    __tablename__ = "payouts"
    id                   = Column(String, primary_key=True, default=gen_uuid)
    investor_id          = Column(String, ForeignKey("users.id"), nullable=False)
    vehicle_id           = Column(String, ForeignKey("vehicles.id"), nullable=False)
    month                = Column(String(7), nullable=False)   # "2026-02"
    gross_revenue        = Column(Float, nullable=False)
    platform_fee         = Column(Float, nullable=False)
    mechanix_deductions  = Column(Float, default=0.0)
    net_payout           = Column(Float, nullable=False)
    status               = Column(Enum("pending","processed","failed", name="payout_status"), default="pending")
    processed_at         = Column(DateTime, nullable=True)
    created_at           = Column(DateTime, default=datetime.utcnow)

    investor = relationship("User",    back_populates="payouts")

# ── MechanixAudit ────────────────────────────────────────────────────
class MechanixAudit(Base):
    __tablename__ = "mechanix_audits"
    id                     = Column(String, primary_key=True, default=gen_uuid)
    vehicle_id             = Column(String, ForeignKey("vehicles.id"), nullable=False)
    mechanic_id            = Column(String, ForeignKey("users.id"), nullable=False)
    overall_result         = Column(Enum("pass","fail","incomplete", name="audit_result"), default="incomplete")
    total_repair_cost      = Column(Float, default=0.0)
    health_certificate_url = Column(String(1000), nullable=True)
    invoice_url            = Column(String(1000), nullable=True)
    created_at             = Column(DateTime, default=datetime.utcnow)
    completed_at           = Column(DateTime, nullable=True)

    vehicle  = relationship("Vehicle", back_populates="audits")
    items    = relationship("AuditItem", back_populates="audit", cascade="all, delete-orphan")

# ── AuditItem ────────────────────────────────────────────────────────
class AuditItem(Base):
    __tablename__ = "audit_items"
    id           = Column(String, primary_key=True, default=gen_uuid)
    audit_id     = Column(String, ForeignKey("mechanix_audits.id"), nullable=False)
    category     = Column(String(50), nullable=False)
    label        = Column(String(200), nullable=False)
    result       = Column(Enum("pass","fail","needs_repair","pending", name="item_result"), default="pending")
    evidence_url = Column(String(1000), nullable=True)
    repair_cost  = Column(Float, default=0.0)
    notes        = Column(Text, nullable=True)

    audit = relationship("MechanixAudit", back_populates="items")

# ── Ticket ───────────────────────────────────────────────────────────
class Ticket(Base):
    __tablename__ = "tickets"
    id           = Column(String, primary_key=True, default=gen_uuid)
    investor_id  = Column(String, ForeignKey("users.id"), nullable=False)
    vehicle_id   = Column(String, nullable=True)
    subject      = Column(String(300), nullable=False)
    message      = Column(Text, nullable=False)
    status       = Column(Enum("open","in_progress","resolved","closed", name="ticket_status"), default="open")
    priority     = Column(Enum("low","medium","high","urgent", name="ticket_priority"), default="medium")
    created_at   = Column(DateTime, default=datetime.utcnow)

    investor = relationship("User",         back_populates="tickets")
    replies  = relationship("TicketReply",  back_populates="ticket", cascade="all, delete-orphan")

class TicketReply(Base):
    __tablename__ = "ticket_replies"
    id          = Column(String, primary_key=True, default=gen_uuid)
    ticket_id   = Column(String, ForeignKey("tickets.id"), nullable=False)
    sender_id   = Column(String, ForeignKey("users.id"), nullable=False)
    sender_role = Column(Enum("investor","admin", name="reply_role"), nullable=False)
    message     = Column(Text, nullable=False)
    created_at  = Column(DateTime, default=datetime.utcnow)

    ticket = relationship("Ticket", back_populates="replies")

# ── Lead ─────────────────────────────────────────────────────────────
class Lead(Base):
    __tablename__ = "leads"
    id            = Column(String, primary_key=True, default=gen_uuid)
    company_name  = Column(String(200), nullable=False)
    contact_name  = Column(String(200), nullable=False)
    email         = Column(String(200), nullable=False)
    phone         = Column(String(15), nullable=False)
    vehicle_count = Column(Integer, default=1)
    message       = Column(Text, nullable=True)
    source        = Column(String(50), default="website")
    status        = Column(Enum("new","contacted","qualified","closed_won","closed_lost", name="lead_status"), default="new")
    created_at    = Column(DateTime, default=datetime.utcnow)

# ── Onboarding ───────────────────────────────────────────────────────
class Onboarding(Base):
    __tablename__ = "onboardings"
    id                  = Column(String, primary_key=True, default=gen_uuid)
    full_name           = Column(String(200), nullable=False)
    phone               = Column(String(15), nullable=False)
    email               = Column(String(200), nullable=False)
    vehicle_make        = Column(String(100), nullable=False)
    vehicle_model       = Column(String(100), nullable=False)
    vehicle_year        = Column(Integer, nullable=False)
    reg_number          = Column(String(20), nullable=False)
    asset_value         = Column(Float, nullable=False)
    agreement_accepted  = Column(Boolean, default=False)
    agreement_ip        = Column(String(50), nullable=True)
    agreement_timestamp = Column(DateTime, nullable=True)
    agreement_url       = Column(String(500), nullable=True)
    payment_order_id    = Column(String(200), nullable=True)
    payment_status      = Column(Enum("pending","paid","failed", name="payment_status"), default="pending")
    razorpay_payment_id = Column(String(200), nullable=True)
    pan_s3_key          = Column(String(500), nullable=True)
    aadhaar_s3_key      = Column(String(500), nullable=True)
    created_at          = Column(DateTime, default=datetime.utcnow)

# ── BankDetail ───────────────────────────────────────────────────────
class BankDetail(Base):
    __tablename__ = "bank_details"
    id             = Column(String, primary_key=True, default=gen_uuid)
    user_id        = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    account_number = Column(String(30), nullable=True)
    ifsc_code      = Column(String(20), nullable=True)
    upi_id         = Column(String(100), nullable=True)
    updated_at     = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="bank_detail")

# ── VehiclePause ──────────────────────────────────────────────────────
class VehiclePause(Base):
    __tablename__ = "vehicle_pauses"
    id         = Column(String, primary_key=True, default=gen_uuid)
    vehicle_id = Column(String, ForeignKey("vehicles.id"), nullable=False)
    pause_date = Column(String(10), nullable=False)  # "2026-03-15"
    created_at = Column(DateTime, default=datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="pauses")
