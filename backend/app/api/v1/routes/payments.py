import razorpay, hmac, hashlib
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.config import settings
from app.core.database import get_db
from app.models.user import Onboarding, User, Vehicle, gen_uuid

router = APIRouter()

def get_razorpay():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@router.post("/create-order")
def create_order(onboarding_id: str, db: Session = Depends(get_db)):
    onboarding = db.query(Onboarding).filter(Onboarding.id == onboarding_id).first()
    if not onboarding:
        raise HTTPException(404, "Onboarding record not found")

    try:
        client = get_razorpay()
        order  = client.order.create({"amount": 500000, "currency": "INR", "receipt": onboarding_id})
        
        onboarding.payment_order_id = order["id"]
        db.commit()
        
        return {"order_id": order["id"], "amount": 500000, "currency": "INR"}
    except Exception as e:
        raise HTTPException(500, f"Razorpay error: {str(e)}")

class VerifyPayment(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/verify")
def verify_payment(req: VerifyPayment, db: Session = Depends(get_db)):
    # Verify HMAC signature
    body      = f"{req.razorpay_order_id}|{req.razorpay_payment_id}"
    expected  = hmac.new(settings.RAZORPAY_KEY_SECRET.encode(), body.encode(), hashlib.sha256).hexdigest()
    if expected != req.razorpay_signature:
        raise HTTPException(400, "Invalid payment signature")

    # Update onboarding record
    onboarding = db.query(Onboarding).filter(Onboarding.payment_order_id == req.razorpay_order_id).first()
    if onboarding:
        onboarding.payment_status      = "paid"
        onboarding.razorpay_payment_id = req.razorpay_payment_id
        
        # ── Activate Investor Account ──
        # Check if user exists (phone normalization matches auth.py)
        clean_phone = "".join(filter(str.isdigit, onboarding.phone))[-10:]
        user = db.query(User).filter(User.phone == clean_phone).first()
        if not user:
            user = User(
                id=gen_uuid(),
                phone=clean_phone,
                name=onboarding.full_name,
                email=onboarding.email,
                role="investor",
                kyc_verified=False,
                pan_s3_key=onboarding.pan_s3_key,
                aadhaar_s3_key=onboarding.aadhaar_s3_key
            )
            db.add(user)
            db.flush()
        else:
            # If user existed, update KYC keys if they were provided during onboarding
            if onboarding.pan_s3_key: user.pan_s3_key = onboarding.pan_s3_key
            if onboarding.aadhaar_s3_key: user.aadhaar_s3_key = onboarding.aadhaar_s3_key
        
        # Create Vehicle
        vehicle = Vehicle(
            id=gen_uuid(),
            owner_id=user.id,
            make=onboarding.vehicle_make,
            model=onboarding.vehicle_model,
            year=onboarding.vehicle_year,
            registration_number=onboarding.reg_number,
            status="onboarding",
            agreement_url=onboarding.agreement_url
        )
        db.add(vehicle)
        db.commit()

    return {"message": "Payment verified and account activated", "payment_id": req.razorpay_payment_id}
