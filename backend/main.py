import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.core.config import settings
from contextlib import asynccontextmanager
from app.api.v1.routes import (
    auth, investor, admin, mechanix, public, kyc, payments
)
from app.core.database import engine, Base
import app.models  # Ensures all models are registered for Metadata

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup if they don't exist
    Base.metadata.create_all(bind=engine)
    yield
    # Cleanup (if needed)

app = FastAPI(
    title="8-Lines Group API",
    description="Corporate Mobility Infrastructure — Bengaluru",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url=None,
)

# ── CORS ─────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL, 
        "http://localhost:3000", 
        "http://localhost:3001", 
        "http://localhost:3002",
        "http://localhost:3003"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────
app.include_router(auth.router,     prefix="/api/v1/auth",     tags=["Auth"])
app.include_router(public.router,   prefix="/api/v1/public",   tags=["Public"])
app.include_router(payments.router, prefix="/api/v1/public/payments", tags=["Payments"])
app.include_router(kyc.router,      prefix="/api/v1/kyc",      tags=["KYC"])
app.include_router(investor.router, prefix="/api/v1/investor", tags=["Investor"])
app.include_router(admin.router,    prefix="/api/v1/admin",    tags=["Admin"])
app.include_router(mechanix.router, prefix="/api/v1/mechanix", tags=["Mechanix Pro"])

@app.get("/")
def root():
    return {
        "service": "8-Lines Group API",
        "version": "1.0.0",
        "status": "operational",
        "hub": "Mangammanapalya, Bengaluru 560068"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
