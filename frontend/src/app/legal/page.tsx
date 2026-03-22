'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useState } from 'react'

const TABS = [
  {id:'terms',     label:'Terms of Service'},
  {id:'privacy',   label:'Privacy Policy'},
  {id:'agreement', label:'Master Agreement'},
]

export default function LegalPage() {
  const [tab, setTab] = useState('terms')

  return (
    <main>
      <Navbar />
      <div className="pt-[68px]">
        {/* Header */}
        <div className="bg-void border-b border-navy/5 px-6 md:px-20 py-10 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 60% at 80% 50%,rgba(12,29,54,.02),transparent)'}} />
          <div className="text-[8px] tracking-[4px] md:tracking-[5px] text-green uppercase mb-3 flex items-center gap-3 font-bold relative z-10"><span className="w-8 h-px bg-green"/>Legal Documents</div>
          <h1 className="font-display text-[clamp(36px,5vw,72px)] text-navy leading-[0.85] relative z-10 uppercase">LEGAL &<br/><em className="text-green not-italic">COMPLIANCE.</em></h1>
          <p className="text-[11px] md:text-[12px] text-ash mt-4 max-w-lg font-medium relative z-10 leading-relaxed">8-Lines Group operates with institutional-grade legal documentation. All agreements are executed via clickwrap with IP address and UTC timestamp logging.</p>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar / Tabs */}
          <div className="w-full md:w-64 shrink-0 bg-abyss border-b md:border-b-0 md:border-r border-navy/5 flex md:flex-col overflow-x-auto custom-scrollbar">
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                className={`flex-1 md:flex-none text-center md:text-left px-6 md:px-8 py-4 md:py-5 text-[9px] tracking-[2px] uppercase transition-all border-b-2 md:border-b-0 md:border-l-2 font-bold whitespace-nowrap ${tab===t.id?'text-green border-green bg-green/5':'text-ash border-transparent hover:text-navy hover:bg-navy/5'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 px-6 md:px-16 py-10 md:py-12 max-w-4xl">

            {tab==='terms' && (
              <div className="prose-legal">
                <div className="text-[8px] tracking-[3px] text-green uppercase mb-2 font-bold">Effective Date: 01 January 2026</div>
                <h2 className="font-display text-3xl md:text-4xl text-navy mb-8 uppercase leading-tight">TERMS OF SERVICE</h2>
                {[
                  {title:'1. Acceptance of Terms', body:'By accessing or using the 8-Lines Group platform (8linesgroup.com), you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.'},
                  {title:'2. Platform Description', body:'8-Lines Group operates a dual-sided marketplace connecting vehicle investors (Asset Partners) with corporate and individual vehicle renters. 8-Lines acts as the operator, not the owner or insurer of any vehicle.'},
                  {title:'3. Investor (Asset Partner) Terms', body:'Asset Partners deploy their vehicles under the 9-Month Master Asset Management Agreement. The revenue split is 70% to the Asset Partner and 30% to 8-Lines Group, after deduction of Mechanix Pro maintenance costs. All splits are contractual and logged per trip.'},
                  {title:'4. Renter Terms', body:'All renters must hold a valid Indian driving licence. Renters are responsible for fuel, tolls, and any traffic violations during the rental period. The vehicle must be returned in the same condition as received.'},
                  {title:'5. Payments', body:'The ₹5,000 investor onboarding fee is non-refundable. All payments are processed via Razorpay. Payout to Asset Partners occurs on the 15th of each calendar month.'},
                  {title:'6. MECHANIX PRO Compliance', body:'All vehicles undergo the 21-point MECHANIX PRO digital audit before every dispatch. Audit results and any repair deductions are transparently visible to the Asset Partner in their dashboard.'},
                  {title:'7. Limitation of Liability', body:'8-Lines Group is not liable for any indirect, incidental, or consequential damages arising from platform use. Our liability is limited to the platform fee collected in the relevant month.'},
                  {title:'8. Governing Law', body:'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.'},
                ].map(s=>(
                  <div key={s.title} className="mb-8 border-b border-navy/5 pb-8">
                    <h3 className="text-[11px] tracking-[2px] text-navy font-bold mb-3 uppercase">{s.title}</h3>
                    <p className="text-[11px] leading-[2] text-ash font-medium">{s.body}</p>
                  </div>
                ))}
              </div>
            )}

            {tab==='privacy' && (
              <div className="prose-legal">
                <div className="text-[8px] tracking-[3px] text-green uppercase mb-2 font-bold">Effective Date: 01 January 2026</div>
                <h2 className="font-display text-3xl md:text-4xl text-navy mb-8 uppercase leading-tight">PRIVACY POLICY</h2>
                {[
                  {title:'1. Data We Collect', body:'We collect: mobile number (for OTP authentication), KYC documents (PAN card, Aadhaar card), vehicle registration details, bank account details (for payouts), and IP address and timestamp (for legal e-signature compliance).'},
                  {title:'2. How We Use Your Data', body:'Your data is used exclusively to: operate the 8-Lines platform, process payouts, verify your identity as required by Indian law, and provide platform support. We do not sell your data.'},
                  {title:'3. Document Storage', body:'All KYC documents are encrypted and stored in AWS S3 with AES-256 encryption. Only authorised 8-Lines executives (Fardeen, Numer) have access to KYC vaults.'},
                  {title:'4. E-Signature Logging', body:'When you execute the Master Asset Management Agreement, we log your IP address, UTC timestamp, and device fingerprint. This is required under the Indian Information Technology Act, 2000, Section 10A to make the agreement legally binding.'},
                  {title:'5. OTP Authentication', body:'We use SMS-based OTP (via Fast2SMS) for all logins. We never store passwords. OTPs are one-time use and expire in 10 minutes.'},
                  {title:'6. Data Retention', body:'We retain your financial data (ledger, trip records) for 7 years as required by Indian financial regulations. KYC documents are retained for the duration of your active agreement plus 5 years.'},
                  {title:'7. Your Rights', body:'You may request access to, correction of, or deletion of your personal data by contacting support@8linesgroup.com. Some data cannot be deleted due to legal retention requirements.'},
                ].map(s=>(
                  <div key={s.title} className="mb-8 border-b border-navy/5 pb-8">
                    <h3 className="text-[11px] tracking-[2px] text-navy font-bold mb-3 uppercase">{s.title}</h3>
                    <p className="text-[11px] leading-[2] text-ash font-medium">{s.body}</p>
                  </div>
                ))}
              </div>
            )}

            {tab==='agreement' && (
              <div className="prose-legal">
                <div className="bg-orange/5 border border-orange/20 p-5 mb-8 text-[10px] text-orange leading-relaxed font-bold uppercase tracking-wide">
                  ⚠ This is the public view of the Master Asset Management Agreement. The executed version, with your IP address, timestamp, and digital signature, will be emailed to you upon completion of onboarding.
                </div>
                <div className="text-[8px] tracking-[3px] text-green uppercase mb-2 font-bold">Document Ref: 8L-MAMA-2026-v3</div>
                <h2 className="font-display text-3xl md:text-4xl text-navy mb-2 uppercase leading-tight">MASTER ASSET MANAGEMENT AGREEMENT</h2>
                <p className="text-[10px] text-ash mb-8 font-bold uppercase tracking-wider">Between: 8-Lines Group (Operator) and the Asset Partner (Investor)</p>
                {[
                  {title:'1. Engagement Duration', body:'This Agreement is effective for a period of nine (9) calendar months from the date of execution. Either party may terminate with 30 days written notice after the initial 9-month lock-in period.'},
                  {title:'2. Revenue Sharing', body:'The Operator shall retain 30% of Gross Revenue generated by the Asset as its Platform Fee. The remaining 70% constitutes the Asset Partner\'s Net Yield. This split is fixed and cannot be unilaterally modified by the Operator.'},
                  {title:'3. Mechanix Pro Deductions', body:'Maintenance costs incurred under the MECHANIX PRO protocol (wholesale part costs + labor) shall be deducted from the Asset Partner\'s 70% Net Yield. All deductions require: (a) a completed digital audit with fail evidence, and (b) a Mechanix Pro Service Invoice. Deduction receipts are visible to the Asset Partner in their dashboard.'},
                  {title:'4. Onboarding Fee', body:'A one-time, non-refundable Onboarding Fee of ₹5,000 (Five Thousand Rupees) is payable by the Asset Partner upon execution of this Agreement. This fee covers GPS installation, platform setup, and first-month insurance audit.'},
                  {title:'5. Pause Protocol', body:'The Asset Partner may pause their vehicle from the rental pool for personal use for a maximum of five (5) days per calendar quarter. Pause requests must be submitted via the dashboard Pause Calendar with minimum 48 hours notice.'},
                  {title:'6. Asset Condition', body:'The Asset Partner warrants that the vehicle is free of undisclosed mechanical defects, has valid insurance and registration, and will be maintained in roadworthy condition. Failure to disclose known defects may result in immediate agreement termination.'},
                  {title:'7. Payout Schedule', body:'Net Yield payouts are processed on the 15th of each calendar month for the preceding month\'s trips. Payouts are made to the Asset Partner\'s registered bank account or UPI ID. Processing takes 1-3 business days.'},
                  {title:'8. Dispute Resolution', body:'In case of disputes regarding payout calculations, the MECHANIX PRO audit logs and trip ledger shall be the definitive record. Disputes must be raised within 15 days of payout via the IRM ticketing system.'},
                  {title:'9. Legal Execution', body:'This Agreement is executed electronically. By checking the "I Agree" box on the 8-Lines platform, the Asset Partner acknowledges reading and accepting all terms. The platform records the IP address, UTC timestamp, and device fingerprint as legal proof of execution under Section 10A of the Information Technology Act, 2000.'},
                ].map(s=>(
                  <div key={s.title} className="mb-8 border-b border-navy/5 pb-8">
                    <h3 className="text-[11px] tracking-[2px] text-navy font-bold mb-3 uppercase">{s.title}</h3>
                    <p className="text-[11px] leading-[2] text-ash font-medium">{s.body}</p>
                  </div>
                ))}
                <div className="mt-8 bg-green/5 border border-green/20 p-6 md:p-8">
                  <p className="text-[11px] text-ash mb-4 font-bold uppercase tracking-wide">Ready to deploy your asset under this agreement?</p>
                  <a href="/investor#form" className="inline-flex items-center gap-3 bg-green text-void text-[10px] tracking-[3px] uppercase px-8 py-5 font-bold cut-md hover:bg-green-dim transition-all w-full sm:w-auto text-center justify-center">
                    Start Onboarding →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </main>
  )
}
