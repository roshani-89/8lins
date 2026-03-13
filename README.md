# 8-Lines Group — Full Stack Application

> Corporate Mobility Infrastructure · Bengaluru

---

## Project Structure

```
8lines/
├── frontend/          # Next.js 14 + TypeScript + Tailwind CSS
└── backend/           # FastAPI + Python + PostgreSQL
```

---

## Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Copy env file and fill in your keys
cp .env.local.example .env.local

# Run development server
npm run dev
# → http://localhost:3000

# Build for production
npm run build && npm start
```

### Required ENV Variables (frontend)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_XXXXXXXXXXXXXXXX
```

---

## Backend Setup (FastAPI + Python)

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy env file and fill in your keys
cp .env.example .env

# Run development server
uvicorn main:app --reload --port 8000
# → http://localhost:8000
# → API Docs: http://localhost:8000/docs
```

### Required ENV Variables (backend)
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/8lines_db
SECRET_KEY=your-jwt-secret-key
FAST2SMS_API_KEY=your_api_key          # For OTP SMS
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your_secret
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXX       # For KYC document storage
AWS_SECRET_ACCESS_KEY=your_key
S3_BUCKET_NAME=8lines-kyc-documents
```

---

## Pages & Routes

### Public (Unauthenticated)
| Route | Description |
|-------|-------------|
| `/` | Homepage — Hero, Fleet Preview, ROI Teaser |
| `/fleet` | Fleet Catalog — Book a Drive |
| `/investor` | Deploy Asset — ROI Calculator + Onboarding Form |
| `/investor#form` | 4-Step Onboarding Form + Razorpay ₹5,000 |
| `/about` | Hub Info + Team |
| `/login` | OTP Login (Investor + Admin) |

### Investor Portal (OTP Authenticated)
| Route | Description |
|-------|-------------|
| `/dashboard` | Overview, Ledger, Fleet, Pause Calendar, Tickets, KYC, Bank, Tax Export |

### Admin God Mode (Admin Role)
| Route | Description |
|-------|-------------|
| `/admin` | Master Command, Fleet Map, CFO Payout Engine, Mechanix Pro, Investor CRM, IRM Desk, B2B Leads |

---

## API Endpoints

### Auth
- `POST /api/v1/auth/send-otp` — Send OTP to mobile
- `POST /api/v1/auth/verify-otp` — Verify OTP, get JWT
- `GET  /api/v1/auth/me` — Get current user

### Public
- `GET  /api/v1/public/fleet` — Available vehicles
- `POST /api/v1/public/leads` — Submit B2B lead
- `POST /api/v1/public/onboarding` — Submit investor onboarding
- `POST /api/v1/public/payments/create-order` — Razorpay order
- `POST /api/v1/public/payments/verify` — Verify payment

### Investor (JWT Required)
- `GET  /api/v1/investor/stats` — Dashboard KPIs
- `GET  /api/v1/investor/trips` — Trip ledger (paginated)
- `GET  /api/v1/investor/export` — Excel CA export
- `GET  /api/v1/investor/vehicles` — My fleet
- `POST /api/v1/investor/vehicles/{id}/pause` — Pause calendar
- `GET  /api/v1/investor/tickets` — Support tickets
- `POST /api/v1/investor/tickets` — Create ticket
- `GET  /api/v1/investor/bank` — Bank details
- `PUT  /api/v1/investor/bank` — Save bank details
- `POST /api/v1/kyc/upload` — Upload PAN + Aadhar

### Admin (Admin JWT Required)
- `GET  /api/v1/admin/stats` — Platform KPIs
- `GET  /api/v1/admin/fleet` — All vehicles
- `GET  /api/v1/admin/investors` — Investor CRM
- `POST /api/v1/admin/investors/{id}/approve-kyc`
- `POST /api/v1/admin/payouts/process` — CFO payout engine
- `GET  /api/v1/admin/tickets` — All support tickets
- `GET  /api/v1/admin/leads` — B2B leads

### Mechanix Pro (Mechanic JWT Required)
- `POST /api/v1/mechanix/audits` — Start audit
- `GET  /api/v1/mechanix/audits/{id}` — Get audit
- `PUT  /api/v1/mechanix/audits/{id}/items/{itemId}` — Update item
- `POST /api/v1/mechanix/audits/{id}/items/{itemId}/evidence` — Upload photo
- `POST /api/v1/mechanix/audits/{id}/complete` — Complete & generate PDF

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| State | Zustand + React Query |
| Forms | React Hook Form + Zod |
| Backend | FastAPI, Python 3.12 |
| Database | PostgreSQL + SQLAlchemy |
| Auth | JWT + OTP (Fast2SMS / Twilio) |
| Payments | Razorpay (UPI, Cards, Net Banking) |
| Storage | AWS S3 (encrypted KYC documents) |
| PDF | ReportLab (Health Certificates + Invoices) |
| Excel | openpyxl (CA-ready ledger exports) |

---

## Key Business Logic

### Revenue Split
```
Gross Trip Revenue
  - 30% Platform Fee (8-Lines)
  - ~5% Mechanix Pro deductions (repair costs, at wholesale rates)
  = ~65-70% Net Investor Yield
```

### Mechanix Pro Audit
1. 18-checkpoint mandatory audit before every dispatch
2. FAIL or NEEDS REPAIR → photo evidence upload mandatory
3. Cannot submit audit without evidence for failed items
4. ALL PASS → Auto-generates Health Certificate PDF
5. Any FAIL → Auto-generates Repair Invoice PDF
6. Repair cost auto-deducted from investor's next payout

### Investor Onboarding
1. Fill asset details form
2. Clickwrap agreement (IP + timestamp + fingerprint logged)
3. KYC upload (PAN + Aadhar → AWS S3)
4. ₹5,000 Razorpay payment
5. Dashboard activated

---

*8-Lines Group · Mangammanapalya, Bengaluru 560068*
*CEO: Fardeen · CFO: Numer · Head Ops: Junaid · Head Sales: Shaik Afnan Sabil*

