from app.models.user import (
    User, Vehicle, Trip, Payout, MechanixAudit, 
    AuditItem, Ticket, TicketReply, Lead, 
    Onboarding, BankDetail, VehiclePause
)

# Export all for easy import and to ensure registration with Base
__all__ = [
    "User", "Vehicle", "Trip", "Payout", "MechanixAudit", 
    "AuditItem", "Ticket", "TicketReply", "Lead", 
    "Onboarding", "BankDetail", "VehiclePause"
]
