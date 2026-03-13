from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import io
from app.services.s3 import upload_to_s3

BG   = colors.HexColor("#060806")
GREEN= colors.HexColor("#00FF41")
GREY = colors.HexColor("#4A604A")

def _base_doc(title: str) -> tuple:
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, topMargin=.5*inch, bottomMargin=.5*inch,
                            leftMargin=.75*inch, rightMargin=.75*inch)
    styles = getSampleStyleSheet()
    return buf, doc, styles

def generate_health_certificate(audit, vehicle) -> str:
    """Generate ALL-PASS Mechanix Pro Health Certificate PDF."""
    buf, doc, styles = _base_doc("Mechanix Pro Health Certificate")
    now = datetime.utcnow()

    title_style = ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=22, textColor=GREEN, spaceAfter=6)
    sub_style   = ParagraphStyle("sub",   fontName="Helvetica",      fontSize=10, textColor=GREY,  spaceAfter=4)
    body_style  = ParagraphStyle("body",  fontName="Helvetica",      fontSize=9,  textColor=colors.black, spaceAfter=3)

    elements = [
        Paragraph("MECHANIX PRO", title_style),
        Paragraph("CERTIFIED HEALTH REPORT", ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=14, textColor=colors.black)),
        Spacer(1, 12),
        Paragraph(f"Vehicle: {vehicle.make} {vehicle.model} ({vehicle.year}) · {vehicle.registration_number}", body_style),
        Paragraph(f"Audit ID: {audit.id}", sub_style),
        Paragraph(f"Issued: {now.strftime('%d %B %Y %H:%M UTC')}", sub_style),
        Paragraph(f"Health Score: {vehicle.health_score}/100", ParagraphStyle("score", fontName="Helvetica-Bold", fontSize=16, textColor=GREEN)),
        Spacer(1, 16),
    ]

    # Checklist table
    data = [["CATEGORY", "CHECKPOINT", "RESULT"]]
    for item in audit.items:
        data.append([item.category.upper(), item.label, "✓ PASS"])

    t = Table(data, colWidths=[1.2*inch, 4*inch, 1*inch])
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,0), GREEN),
        ("TEXTCOLOR",    (0,0),(-1,0), BG),
        ("FONTNAME",     (0,0),(-1,0), "Helvetica-Bold"),
        ("FONTSIZE",     (0,0),(-1,0), 8),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white, colors.HexColor("#F5FFF5")]),
        ("FONTSIZE",     (0,1),(-1,-1), 8),
        ("GRID",         (0,0),(-1,-1), 0.5, colors.HexColor("#DDD")),
        ("TEXTCOLOR",    (2,1),(2,-1),  GREEN),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 20))
    elements.append(Paragraph("This certificate legally proves the vehicle met all mandated safety requirements right before the guest took the keys. Valid for this dispatch only.", sub_style))
    elements.append(Paragraph("8-Lines Group · Corporate Mobility Infrastructure · Bengaluru", sub_style))

    doc.build(elements)
    content = buf.getvalue()
    key = f"certificates/{audit.id}/health_certificate.pdf"
    return upload_to_s3(content, key, "application/pdf")

def generate_repair_invoice(audit, vehicle, total_cost: float) -> str:
    """Generate Mechanix Pro Repair Invoice PDF (deducted from investor payout)."""
    buf, doc, styles = _base_doc("Mechanix Pro Repair Invoice")
    now = datetime.utcnow()

    title_style = ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=18, textColor=colors.HexColor("#FF3B3B"))
    body_style  = ParagraphStyle("body",  fontName="Helvetica",      fontSize=9,  spaceAfter=3)
    sub_style   = ParagraphStyle("sub",   fontName="Helvetica",      fontSize=8,  textColor=GREY)

    elements = [
        Paragraph("MECHANIX PRO", title_style),
        Paragraph("SERVICE & REPAIR INVOICE", ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=13)),
        Spacer(1, 10),
        Paragraph(f"Vehicle: {vehicle.make} {vehicle.model} ({vehicle.year}) · {vehicle.registration_number}", body_style),
        Paragraph(f"Audit ID: {audit.id}", sub_style),
        Paragraph(f"Date: {now.strftime('%d %B %Y %H:%M UTC')}", sub_style),
        Spacer(1, 14),
    ]

    # Failed items with costs
    data = [["CATEGORY", "ISSUE", "REPAIR COST"]]
    for item in audit.items:
        if item.result in ("fail","needs_repair"):
            data.append([item.category.upper(), item.label, f"Rs {item.repair_cost:,.0f}"])
    data.append(["", "TOTAL DEDUCTION", f"Rs {total_cost:,.0f}"])

    t = Table(data, colWidths=[1.2*inch, 3.8*inch, 1.2*inch])
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,0),  colors.HexColor("#FF3B3B")),
        ("TEXTCOLOR",    (0,0),(-1,0),  colors.white),
        ("FONTNAME",     (0,0),(-1,0),  "Helvetica-Bold"),
        ("FONTSIZE",     (0,0),(-1,-1), 8),
        ("GRID",         (0,0),(-1,-1), 0.5, colors.HexColor("#DDD")),
        ("FONTNAME",     (0,-1),(-1,-1),"Helvetica-Bold"),
        ("BACKGROUND",   (0,-1),(-1,-1),colors.HexColor("#FFF0F0")),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 16))
    elements.append(Paragraph(f"Amount of Rs {total_cost:,.0f} will be deducted from the investor's next payout.", body_style))
    elements.append(Paragraph("8-Lines Group · Mangammanapalya, Bengaluru 560068", sub_style))

    doc.build(elements)
    content = buf.getvalue()
    key = f"invoices/{audit.id}/repair_invoice.pdf"
    return upload_to_s3(content, key, "application/pdf")

def generate_agreement_pdf(onboarding) -> tuple:
    """Generate the 9-Month Master Asset Management Agreement with Clickwrap metadata. Returns (url, bytes)."""
    buf, doc, styles = _base_doc("Master Asset Management Agreement")
    now = datetime.utcnow()
    
    brand_style = ParagraphStyle("brand", fontName="Helvetica-Bold", fontSize=24, textColor=colors.HexColor("#F8931F"))
    title_style = ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=14, spaceAfter=12)
    body_style  = ParagraphStyle("body",  fontName="Helvetica",      fontSize=10, leading=14, spaceAfter=8)
    stamp_style = ParagraphStyle("stamp", fontName="Helvetica-Bold", fontSize=9, textColor=colors.HexColor("#0C1D36"), 
                                 backColor=colors.HexColor("#F0F4F8"), borderPadding=10)

    elements = [
        Paragraph("8-LINES GROUP", brand_style),
        Paragraph("MASTER ASSET MANAGEMENT AGREEMENT", title_style),
        Spacer(1, 12),
        Paragraph(f"<b>EFFECTIVE DATE:</b> {onboarding.agreement_timestamp.strftime('%d %B %Y')}", body_style),
        Paragraph(f"<b>INVESTOR:</b> {onboarding.full_name}", body_style),
        Paragraph(f"<b>VEHICLE:</b> {onboarding.vehicle_make} {onboarding.vehicle_model} ({onboarding.reg_number})", body_style),
        Spacer(1, 12),
        Paragraph("<b>1. SCOPE OF SERVICES:</b> 8-Lines Group shall manage, operate, and maintain the vehicle for corporate mobility services in Bengaluru.", body_style),
        Paragraph("<b>2. REVENUE SHARE:</b> The Investor is entitled to 70% of the Gross Trip Revenue. The Platform retains 30% for operations and guest acquisition.", body_style),
        Paragraph("<b>3. MAINTENANCE:</b> All maintenance is managed via MECHANIX PRO. Costs are deducted from the Investor's share at wholesale rates.", body_style),
        Paragraph("<b>4. TERM:</b> This agreement is valid for a period of 9 months from the date of execution.", body_style),
        Spacer(1, 24),
        Paragraph("<b>DIGITAL EXECUTION STAMP (CLICKWRAP)</b>", title_style),
        Paragraph(f"This document was digitally executed and accepted via the 8-Lines Investor Portal.", body_style),
        Paragraph(f"<b>IP ADDRESS:</b> {onboarding.agreement_ip}", stamp_style),
        Paragraph(f"<b>TIMESTAMP:</b> {onboarding.agreement_timestamp.strftime('%Y-%m-%d %H:%M:%S')} UTC", stamp_style),
        Paragraph(f"<b>LEGAL VALIDITY:</b> Indian IT Act 2000, Section 10A (Validity of contracts formed through electronic means).", body_style),
        Spacer(1, 40),
        Paragraph("8-Lines Group · Corporate Mobility Infrastructure · Bengaluru", sub_style := ParagraphStyle("footer", fontSize=8, textColor=GREY, alignment=1)),
    ]

    doc.build(elements)
    content = buf.getvalue()
    key = f"agreements/{onboarding.id}/agreement.pdf"
    url = upload_to_s3(content, key, "application/pdf")
    return url, content
