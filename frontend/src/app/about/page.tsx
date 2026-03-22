'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useState } from 'react'
import toast from 'react-hot-toast'

const TEAM = [
  { name: 'Fardeen', role: 'Chief Executive Officer', init: 'F', desc: 'Vision, strategy, and investor relationships. Driving 8-Lines from idea to institution.' },
  { name: 'Numer', role: 'Chief Financial Officer', init: 'N', desc: 'Financial architecture, payout engine, and investor returns. Every rupee accounted for.' },
  { name: 'Junaid', role: 'Head of Operations', init: 'J', desc: 'Fleet deployment, hub logistics, and ground operations. The machine that keeps the wheels turning.' },
  { name: 'Shaik Afnan Sabil', role: 'Head of Sales', init: 'A', desc: 'Corporate leasing pipeline, B2B partnerships, and investor acquisition. The growth engine.' },
]

const TIMELINE = [
  { year: '2023', title: 'Founded', desc: '8-Lines Group incorporated in Bengaluru with a vision to institutionalize the peer-to-peer vehicle market.' },
  { year: '2024', title: 'First Fleet', desc: '4 vehicles deployed. First 100 corporate trips completed. MECHANIX PRO protocol drafted and implemented.' },
  { year: '2025', title: 'Investor Program', desc: 'Launched the 70/30 investor model. 11 assets deployed. ₹0 investor disputes — 100% transparent ledger.' },
  { year: '2026', title: 'Scaling', desc: '638+ trips. 4.8★ rating. B2B leasing pipeline active. Expanding to 25+ assets by Q4 2026.' },
]

const PHILOSOPHY = [
  { icon: '🔐', title: 'Zero Ambiguity Contracts', desc: 'Every agreement is legally executed via clickwrap with IP address, UTC timestamp, and device fingerprint. Binding under Indian IT Act 2000, Section 10A.' },
  { icon: '🔧', title: 'MECHANIX PRO Protocol', desc: '18-point mandatory audit before every single dispatch. If a mechanic marks FAIL, they must upload photo evidence. The car does not move without certification.' },
  { icon: '📊', title: 'Institutional Transparency', desc: 'Every rupee is accounted for. Gross rent → 30% platform fee → mechanix deductions → 70% net yield. Trip-by-trip. No black boxes.' },
  { icon: '🛡️', title: 'Asset Protection First', desc: 'We carry the operational risk. Logistics, GPS, maintenance, guest disputes — all handled by 8-Lines. Your asset earns while you sleep.' },
]

export default function AboutPage() {
  const [form, setForm] = useState({ name: '', company: '', phone: '', vehicles: '1', message: '' })
  const [busy, setBusy] = useState(false)

  const submitLead = async () => {
    if (!form.name || !form.phone) { toast.error('Name and phone required'); return }
    setBusy(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('✓ Enquiry received. Shaik Afnan will reach out within 2 hours.')
    setForm({ name: '', company: '', phone: '', vehicles: '1', message: '' })
    setBusy(false)
  }

  return (
    <main>
      <Navbar />
      <div className="pt-[68px]">

        {/* HERO (Machined Premium) */}
        <section className="relative pt-32 md:pt-48 pb-20 md:pb-32 px-6 md:px-20 overflow-hidden bg-void group">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-full lg:w-[60%] h-full opacity-[0.35] select-none pointer-events-none transition-opacity duration-1000">
            <img src="/images/thar_roxx.png" alt="Engineering" className="w-full h-full object-contain object-right md:scale-110" />
          </div>
          <div className="absolute inset-0 carbon-fiber opacity-[0.03] pointer-events-none" />
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-void via-void/40 to-void" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center md:text-left reveal">
            <div className="flex items-center justify-center md:justify-start gap-5 mb-10">
              <span className="w-12 md:w-20 h-px bg-green shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-[11px] tracking-[8px] text-green uppercase font-black">MANIFESTO // EST. 2023</span>
              <span className="w-12 md:w-20 h-px bg-green shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>
            <h1 className="font-display text-[clamp(54px,9vw,140px)] leading-[0.8] text-navy mb-12 uppercase animate-float font-black">
              WE ARE NOT<br />
              <span className="text-orange relative inline-block">
                A RENTAL COMPANY.
              </span>
            </h1>
            <p className="text-[15px] md:text-[18px] leading-[1.8] text-ash max-w-3xl font-medium mb-16 px-4 md:px-0">
              8-Lines is an institutional asset management infrastructure. We transform idle, depreciating vehicles into high-yield financial instruments — fortified by cryptographically secure contracts and the MECHANIX PRO audit protocol.
            </p>
          </div>
        </section>

        {/* STATS (Machined Bar) */}
        <div className="bg-navy border-y border-white/5 grid grid-cols-2 lg:grid-cols-4 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 carbon-fiber opacity-10 pointer-events-none" />
          {[
            { v: '638+', l: 'SUCCESSFUL DEPLOYMENTS', i: '🚀' },
            { v: '11', l: 'ACTIVE ASSET NODES', i: '🚗' },
            { v: '4.8★', l: 'PROTOCOL RATING', i: '⚡' },
            { v: '₹0', l: 'INVESTOR DISPUTES', i: '🛡️' }
          ].map((s, i) => (
            <div key={i} className={`relative z-10 py-10 lg:py-14 px-8 text-center border-white/5 hover:bg-white/[0.02] transition-colors group ${(i + 1) % 2 === 0 ? 'lg:border-r-0' : 'border-r'} ${i < 2 ? 'border-b lg:border-b-0' : ''}`}>
              <div className="text-2xl mb-4 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all">{s.i}</div>
              <div className="font-display text-4xl md:text-5xl lg:text-6xl text-void mb-3 font-black drop-shadow-md">{s.v}</div>
              <div className="text-[9px] lg:text-[10px] tracking-[4px] text-green uppercase font-black">{s.l}</div>
            </div>
          ))}
        </div>

        {/* HUB (Operations Center) */}
        <section id="hub" className="py-24 md:py-40 px-6 md:px-20 bg-void relative overflow-hidden">
          <div className="absolute inset-0 carbon-fiber opacity-[0.02] pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <div className="reveal-l order-2 lg:order-1 text-center md:text-left">
              <div className="text-[10px] tracking-[6px] text-green uppercase mb-8 flex items-center justify-center md:justify-start gap-5 font-black">
                <span className="w-12 h-px bg-green shadow-[0_0_8px_rgba(34,197,94,0.5)]" /> HUB OPERATIONS
              </div>
              <h2 className="font-display text-[clamp(44px,5vw,72px)] leading-[0.9] text-navy mb-10 uppercase font-black">
                MANGAMMANAPALYA<br /><em className="text-green not-italic">COMMAND HUB.</em>
              </h2>
              <p className="text-[14px] md:text-[16px] leading-[1.8] text-ash mb-12 font-medium">Our centralized operations infrastructure handles all vehicle intake, digitization, and dispatch. Every asset in the 8-Lines ecosystem is processed through this high-security compound.</p>
              <div className="space-y-6 max-w-lg mx-auto md:mx-0">
                {[
                  { label: 'GEOLOCATION', val: 'Mangammanapalya, Bengaluru 560068' },
                  { label: 'HUB PROTOCOL', val: '24×7 Secure Compound · CCTV Monitored · Biometric Access' },
                  { label: 'NODE CAPACITY', val: '15 Full-Size Assets · Expandable to 30 Nodes' },
                  { label: 'AUDIT BAY', val: 'Dedicated MECHANIX PRO Diagnostic Station' },
                ].map(r => (
                  <div key={r.label} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-6 border-b border-navy/5 pb-5 group">
                    <span className="text-[9px] tracking-[3px] text-green uppercase w-auto sm:w-32 shrink-0 font-black group-hover:text-orange transition-colors">{r.label}</span>
                    <span className="text-[12px] text-navy font-black uppercase tracking-tight">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-r order-1 lg:order-2 relative">
              <div className="absolute -inset-10 bg-green/5 blur-3xl rounded-full opacity-30 pointer-events-none" />
              <div className="h-64 sm:h-80 lg:h-96 bg-navy border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl cut-lg">
                <div className="absolute inset-0 carbon-fiber opacity-10 pointer-events-none" />
                <div className="text-center relative z-10">
                  <div className="text-5xl sm:text-6xl lg:text-7xl mb-6 drop-shadow-glow">📍</div>
                  <div className="text-[12px] text-void mb-2 uppercase font-black tracking-[4px]">HUB ALPHA // BENGALURU</div>
                  <div className="text-[9px] text-void/40 font-black uppercase tracking-widest shadow-sm">Audit & Deployment Sector</div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-void/5 backdrop-blur-md border border-white/10 p-5">
                  <div className="text-[9px] tracking-[4px] text-green uppercase mb-2 font-black">LIVE FEED // SECTOR-1</div>
                  <div className="flex items-center gap-3 text-[10px] text-void font-black uppercase tracking-[1px]">
                    <span className="w-2 h-2 bg-green rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />OPERATIONAL · SECURE DATA LINK
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM (Board) */}
        <section className="py-24 md:py-40 px-6 md:px-20 bg-void relative overflow-hidden">
          <div className="absolute inset-0 carbon-fiber opacity-[0.01] pointer-events-none" />
          <div className="reveal mb-20 text-center md:text-left">
            <div className="text-[10px] tracking-[8px] text-green uppercase mb-6 flex items-center justify-center md:justify-start gap-5 font-black">
              <span className="w-12 h-px bg-green shadow-[0_0_8px_rgba(34,197,94,0.5)]" /> EXECUTIVE BOARD
            </div>
            <h2 className="font-display text-[clamp(44px,6vw,90px)] leading-[0.9] text-navy uppercase font-black">THE MINDS<br /><em className="text-green not-italic">AT THE CORE.</em></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((m, i) => (
              <div key={i} className={`reveal delay-${i + 1} bg-void border border-navy/10 hover:border-orange/30 transition-all duration-700 p-10 group hover:-translate-y-4 hover:shadow-2xl cut-md`}>
                <div className="w-16 h-16 bg-navy border border-white/10 flex items-center justify-center font-display text-3xl text-void mb-8 group-hover:bg-orange transition-all duration-500 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 carbon-fiber opacity-20" />
                  <span className="relative z-10">{m.init}</span>
                </div>
                <div className="font-display text-2xl tracking-[2px] text-navy mb-2 uppercase font-black">{m.name}</div>
                <div className="text-[10px] tracking-[3px] text-orange uppercase mb-6 font-black">{m.role}</div>
                <p className="text-[12px] leading-[1.8] text-ash font-medium">{m.desc}</p>
                <div className="mt-8 pt-6 border-t border-navy/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-[9px] tracking-[2px] text-navy font-black">ENCRYPTED PROTOCOL</div>
                  <div className="w-2 h-2 bg-green rounded-full shadow-glow-sm" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MECHANIX PRO (Audit Sector) */}
        <section id="mechanix" className="py-24 md:py-40 px-6 md:px-20 bg-void relative overflow-hidden">
          <div className="absolute inset-0 carbon-fiber opacity-[0.03] pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
            <div className="reveal-l text-center md:text-left sticky top-32">
              <div className="text-[10px] tracking-[8px] text-green uppercase mb-8 flex items-center justify-center md:justify-start gap-5 font-black">
                <span className="w-12 h-px bg-green shadow-[0_0_8px_rgba(34,197,94,0.5)]" /> SAFETY ARCHITECTURE
              </div>
              <h2 className="font-display text-[clamp(44px,5vw,72px)] leading-[0.9] text-navy mb-10 uppercase font-black">MECHANIX PRO<br /><em className="text-green not-italic">AUDIT PROTOCOL.</em></h2>
              <p className="text-[14px] md:text-[16px] leading-[1.8] text-ash mb-12 font-medium">Every asset undergoes a mandatory 18-point high-fidelity digitized audit before every dispatch. This is the bedrock of 8-Lines infrastructure.</p>

              <div className="space-y-6">
                <div className="bg-navy border border-white/5 p-8 relative overflow-hidden group">
                  <div className="absolute inset-0 carbon-fiber opacity-10" />
                  <div className="relative z-10">
                    <div className="text-[10px] tracking-[4px] text-green uppercase mb-4 font-black flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-green animate-pulse" /> CERTIFICATION PASS
                    </div>
                    <p className="text-[13px] leading-[1.8] text-void/60 font-medium">System auto-generates a <span className="text-void font-black uppercase tracking-wider">MECHANIX PRO GLOBAL REPORT</span> — cryptographically signed and stored in AWS S3 for investor transparency.</p>
                  </div>
                </div>

                <div className="bg-orange/5 border border-orange/20 p-8 relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="text-[10px] tracking-[4px] text-orange uppercase mb-4 font-black flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-orange animate-pulse" /> ANOMALY DETECTED
                    </div>
                    <p className="text-[13px] leading-[1.8] text-navy/70 font-medium">Automatic lockout. Technician must upload 4K photo evidence. Servicing is dispatched at wholesale institutional rates, fully logged trip-by-trip.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal-r">
              <div className="bg-void border border-navy/15 shadow-2xl overflow-hidden relative cut-lg">
                <div className="absolute inset-0 carbon-fiber opacity-[0.02] pointer-events-none" />
                <div className="bg-navy px-8 py-5 border-b border-white/10 relative z-10 flex justify-between items-center">
                  <span className="text-[11px] tracking-[4px] text-void uppercase font-black">18-POINT DIAGNOSTIC QUEUE</span>
                  <span className="text-[9px] text-green font-black animate-pulse uppercase">LIVE AUDIT</span>
                </div>
                <div className="p-4 md:p-8 space-y-3 max-h-[700px] overflow-y-auto custom-scrollbar relative z-10">
                  {['Legal & Compliance (RC, Insurance, Fitness)', 'Braking System (Pads + Parking Brake)', 'Engine, Powertrain & All Fluids', 'Check Engine / Warning Lights Clear', 'Exhaust — No Blue/Black Smoke', 'Steering & Suspension Normal', 'Tire Tread 4/32″ Minimum · Under 6 Years', 'No Sidewall Cuts, Gouges, or Bulges', 'Rearview and All Mirrors Intact', 'Seat Belts Intact and Usable', 'No Airbag / SRS Warning Lights', 'No Structural Panel Damage', 'Horn Operational', 'Windshield Free of Cracks', 'Window Tint Legal Compliance', 'All Exterior Lights Functional', 'Wiper / Washer Operational', 'Headlights & License Plate Lights OK'].map((item, i) => (
                    <div key={i} className="flex items-center gap-5 bg-navy/[0.02] border border-navy/5 px-6 py-4 hover:bg-navy group transition-all duration-300">
                      <span className="text-orange text-[10px] font-black w-8 shrink-0 group-hover:text-void">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[11px] text-navy flex-1 font-black uppercase tracking-tight group-hover:text-void">{item}</span>
                      <span className="text-green text-[8px] bg-green/10 px-3 py-1.5 shrink-0 font-black tracking-widest border border-green/20 group-hover:bg-green group-hover:text-void group-hover:border-green">PASS</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE (Progress Series) */}
        <section className="py-24 md:py-40 px-6 md:px-20 bg-void relative overflow-hidden">
          <div className="absolute inset-0 carbon-fiber opacity-[0.01] pointer-events-none" />
          <div className="reveal mb-20 text-center md:text-left">
            <div className="text-[10px] tracking-[8px] text-green uppercase mb-6 flex items-center justify-center md:justify-start gap-5 font-black">
              <span className="w-12 h-px bg-green shadow-[0_0_8px_rgba(34,197,94,0.5)]" /> THE JOURNEY
            </div>
            <h2 className="font-display text-[clamp(44px,6vw,90px)] leading-[0.9] text-navy uppercase font-black">CHRONOLOGICAL<br /><em className="text-green not-italic">VELOCITY.</em></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {TIMELINE.map((t, i) => (
              <div key={i} className={`reveal delay-${i + 1} bg-void border border-navy/10 hover:border-orange/20 p-10 lg:p-12 transition-all duration-700 relative overflow-hidden group hover:-translate-y-4 hover:shadow-premium cut-md`}>
                <div className="font-display text-7xl lg:text-8xl text-navy/[0.03] group-hover:text-navy/[0.08] transition-colors mb-4 italic font-black">{t.year}</div>
                <div className="text-[16px] md:text-[18px] font-black text-navy mb-4 font-display uppercase tracking-widest leading-tight">{t.title}</div>
                <p className="text-[12px] md:text-[13px] leading-[1.8] text-ash font-medium">{t.desc}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-navy via-orange to-green scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" />
              </div>
            ))}
          </div>
        </section>

        {/* PHILOSOPHY (Dark Carbon) */}
        <section className="py-24 md:py-40 px-6 md:px-20 bg-navy relative overflow-hidden">
          <div className="absolute inset-0 carbon-fiber opacity-10 pointer-events-none" />
          <div className="reveal mb-20 text-center">
            <div className="text-[10px] tracking-[8px] text-green uppercase mb-6 flex items-center justify-center gap-6 font-black">
              <span className="w-12 h-px bg-green shadow-glow-sm" /> CORE VALUES <span className="w-12 h-px bg-green shadow-glow-sm" />
            </div>
            <h2 className="font-display text-[clamp(44px,6vw,90px)] text-void uppercase font-black tracking-tight">THE <em className="text-green not-italic">PHILOSOPHY.</em></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {PHILOSOPHY.map((p, i) => (
              <div key={i} className={`reveal delay-${i % 2 + 1} bg-void/5 border border-white/10 p-10 md:p-16 transition-all duration-700 hover:border-orange/30 group flex flex-col items-center text-center md:items-start md:text-left cut-md backdrop-blur-sm shadow-2xl hover:shadow-glow-sm`}>
                <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-10 group-hover:scale-110 group-hover:bg-orange group-hover:text-void transition-all duration-500 shadow-xl">{p.icon}</div>
                <div className="text-[20px] md:text-[24px] font-black text-void mb-6 font-display uppercase tracking-[4px]">{p.title}</div>
                <p className="text-[13px] md:text-[14px] leading-[2] text-ash/60 font-medium group-hover:text-ash transition-colors duration-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT / B2B (Machined Gateway) */}
        <section id="contact" className="py-24 md:py-40 px-6 md:px-20 bg-void relative overflow-hidden">
          <div className="absolute inset-0 carbon-fiber opacity-[0.02] pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
            <div className="reveal-l text-center md:text-left">
              <div className="text-[10px] tracking-[8px] text-green uppercase mb-8 flex items-center justify-center md:justify-start gap-5 font-black">
                <span className="w-12 h-px bg-green shadow-[0_0_8px_rgba(34,197,94,0.5)]" /> CORPORATE LEASING
              </div>
              <h2 className="font-display text-[clamp(44px,5vw,72px)] leading-[0.9] text-navy mb-10 uppercase font-black">
                LET&apos;S BUILD<br /><em className="text-orange not-italic">A FLEET.</em>
              </h2>
              <p className="text-[14px] md:text-[16px] leading-[1.8] text-ash mb-12 font-medium">Need a dedicated infrastructure for your corporate campus, luxury hotel, or executive transport? We offer custom SLAs and institutional-grade management.</p>

              <div className="space-y-6 max-w-lg mx-auto md:mx-0">
                {[
                  { icon: '📞', label: 'SALES — SHAIK AFNAN SABIL', val: '+91 XXXXXXXXXX', c: 'group-hover:text-green' },
                  { icon: '✉️', label: 'ENQUIRY CHANNEL', val: 'sales@8linesgroup.com', c: 'group-hover:text-orange' },
                  { icon: '📍', label: 'HUB ALPHA ACCESS', val: 'Mangammanapalya, Bengaluru 560068', c: 'group-hover:text-green' },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-6 p-6 bg-void border border-navy/10 group hover:border-navy transition-all text-left shadow-sm relative overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-navy/5 group-hover:bg-navy transition-colors" />
                    <span className="text-3xl group-hover:scale-110 transition-transform">{c.icon}</span>
                    <div>
                      <div className="text-[9px] tracking-[3px] text-ash uppercase font-black mb-1">{c.label}</div>
                      <div className={`text-[12px] text-navy font-black uppercase tracking-wider transition-colors ${c.c}`}>{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal-r">
              <div className="bg-void border border-navy/15 shadow-2xl relative overflow-hidden cut-lg group">
                <div className="absolute inset-0 carbon-fiber opacity-[0.02] pointer-events-none" />
                <div className="bg-navy px-8 py-5 border-b border-white/10 relative z-10 flex justify-between items-center">
                  <span className="text-[11px] tracking-[4px] text-void uppercase font-black">CORPORATE PROTOCOL INTAKE</span>
                  <div className="w-2 h-2 rounded-full bg-orange animate-pulse" />
                </div>
                <div className="p-8 md:p-12 space-y-6 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[9px] tracking-[3px] text-navy uppercase block mb-2 font-black">Contact Identifier</label>
                      <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        type="text" placeholder="Your full name"
                        className="w-full bg-void border border-navy/10 px-5 py-4 text-[12px] text-navy font-black placeholder:text-navy/20 focus:border-orange outline-none transition-all uppercase" />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-[3px] text-navy uppercase block mb-2 font-black">Corporate Entity</label>
                      <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                        type="text" placeholder="Company name"
                        className="w-full bg-void border border-navy/10 px-5 py-4 text-[12px] text-navy font-black placeholder:text-navy/20 focus:border-orange outline-none transition-all uppercase" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[9px] tracking-[3px] text-navy uppercase block mb-2 font-black">Node Mobile</label>
                      <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        type="tel" placeholder="9XXXXXXXXX"
                        className="w-full bg-void border border-navy/10 px-5 py-4 text-[12px] text-navy font-black placeholder:text-navy/20 focus:border-orange outline-none transition-all uppercase" />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-[3px] text-navy uppercase block mb-2 font-black">Fleet Scale</label>
                      <input value={form.vehicles} onChange={e => setForm(p => ({ ...p, vehicles: e.target.value }))}
                        type="number" placeholder="5"
                        className="w-full bg-void border border-navy/10 px-5 py-4 text-[12px] text-navy font-black placeholder:text-navy/20 focus:border-orange outline-none transition-all uppercase" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] tracking-[3px] text-navy uppercase block mb-2 font-black">Protocol Requirements</label>
                    <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4}
                      className="w-full bg-void border border-navy/10 px-5 py-5 text-[12px] text-navy font-black placeholder:text-navy/20 focus:border-orange outline-none transition-all resize-none uppercase" placeholder="Tell us about your requirement…" />
                  </div>
                  <button onClick={submitLead} disabled={busy}
                    className="w-full bg-navy text-void text-[12px] tracking-[6px] uppercase py-6 font-black transition-all hover:bg-orange hover:shadow-2xl disabled:opacity-60 flex items-center justify-center gap-4 cut-md shadow-xl">
                    {busy ? 'PROCESSING...' : 'INITIATE ENQUIRY →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
