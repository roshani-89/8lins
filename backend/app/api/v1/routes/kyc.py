from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import require_investor
from app.models.user import User
from app.services.s3 import upload_to_s3

router = APIRouter()

@router.post("/upload")
async def upload_kyc(
    pan:     UploadFile = File(...),
    aadhaar: UploadFile = File(...),
    db:      Session = Depends(get_db),
    user:    User    = Depends(require_investor),
):
    allowed = {"image/jpeg","image/png","application/pdf"}
    for f in [pan, aadhaar]:
        if f.content_type not in allowed:
            raise HTTPException(400, f"Invalid file type: {f.content_type}")

    pan_content     = await pan.read()
    aadhaar_content = await aadhaar.read()

    pan_key     = f"kyc/{user.id}/pan/{pan.filename}"
    aadhaar_key = f"kyc/{user.id}/aadhaar/{aadhaar.filename}"

    pan_url     = upload_to_s3(pan_content,     pan_key,     pan.content_type)
    aadhaar_url = upload_to_s3(aadhaar_content, aadhaar_key, aadhaar.content_type)

    user.pan_s3_key     = pan_key
    user.aadhaar_s3_key = aadhaar_key
    db.commit()

    return {"message": "KYC documents uploaded. Verification within 24 hours.", "pan_url": pan_url, "aadhaar_url": aadhaar_url}

@router.get("/status")
def kyc_status(user: User = Depends(require_investor)):
    return {
        "kyc_verified":   user.kyc_verified,
        "pan_uploaded":   bool(user.pan_s3_key),
        "aadhaar_uploaded": bool(user.aadhaar_s3_key),
    }
