'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useState } from 'react'
import toast from 'react-hot-toast'

const TEAM = [
  {name:'Fardeen',      role:'Chief Executive Officer',   init:'F', desc:'Vision, strategy, and investor relationships. Driving 8-Lines from idea to institution.'},
  {name:'Numer',        role:'Chief Financial Officer',   init:'N', desc:'Financial architecture, payout engine, and investor returns. Every rupee accounted for.'},
  {name:'Junaid',       role:'Head of Operations',        init:'J', desc:'Fleet deployment, hub logistics, and ground operations. The machine that keeps the wheels turning.'},
  {name:'Shaik Afnan Sabil', role:'Head of Sales',        init:'A', desc:'Corporate leasing pipeline, B2B partnerships, and investor acquisition. The growth engine.'},
]

const TIMELINE = [
  {year:'2023', title:'Founded', desc:'8-Lines Group incorporated in Bengaluru with a vision to institutionalize the peer-to-peer vehicle market.'},
  {year:'2024', title:'First Fleet', desc:'4 vehicles deployed. First 100 corporate trips completed. MECHANIX PRO protocol drafted and implemented.'},
  {year:'2025', title:'Investor Program', desc:'Launched the 70/30 investor model. 11 assets deployed. ₹0 investor disputes — 100% transparent ledger.'},
  {year:'2026', title:'Scaling', desc:'638+ trips. 4.8★ rating. B2B leasing pipeline active. Expanding to 25+ assets by Q4 2026.'},
]

const PHILOSOPHY = [
  {icon:'🔐', title:'Zero Ambiguity Contracts', desc:'Every agreement is legally executed via clickwrap with IP address, UTC timestamp, and device fingerprint. Binding under Indian IT Act 2000, Section 10A.'},
  {icon:'🔧', title:'MECHANIX PRO Protocol', desc:'18-point mandatory audit before every single dispatch. If a mechanic marks FAIL, they must upload photo evidence. The car does not move without certification.'},
  {icon:'📊', title:'Institutional Transparency', desc:'Every rupee is accounted for. Gross rent → 30% platform fee → mechanix deductions → 70% net yield. Trip-by-trip. No black boxes.'},
  {icon:'🛡️', title:'Asset Protection First', desc:'We carry the operational risk. Logistics, GPS, maintenance, guest disputes — all handled by 8-Lines. Your asset earns while you sleep.'},
]

export default function AboutPage() {
  const [form, setForm] = useState({name:'',company:'',phone:'',vehicles:'1',message:''})
  const [busy, setBusy] = useState(false)

  const submitLead = async () => {
    if (!form.name||!form.phone) { toast.error('Name and phone required'); return }
    setBusy(true)
    await new Promise(r=>setTimeout(r,1000))
    toast.success('✓ Enquiry received. Shaik Afnan will reach out within 2 hours.')
    setForm({name:'',company:'',phone:'',vehicles:'1',message:''})
    setBusy(false)
  }

  return (
    <main>
      <Navbar />
      <div className="pt-[68px]">

        {/* HERO */}
        <section className="py-20 px-20 bg-void relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 70% 60% at 80% 40%,rgba(12,29,54,.03),transparent)'}} />
          <div className="reveal">
            <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green"/>About 8-Lines Group</div>
            <h1 className="font-display text-[clamp(48px,6vw,88px)] leading-[.9] text-navy mb-6">WE ARE NOT<br/>A RENTAL<br/><em className="text-green not-italic">COMPANY.</em></h1>
            <p className="text-[14px] leading-[2] text-ash max-w-2xl font-medium">We are an asset management infrastructure. We take idle depreciating vehicles and turn them into yield-generating financial instruments — with the transparency of a public ledger and the protection of an institutional contract.</p>
          </div>
        </section>

        {/* STATS */}
        <div className="bg-void border-y border-navy/5 grid grid-cols-4 shadow-sm">
          {[{v:'638+',l:'Corporate Trips'},{v:'11',l:'Assets Under Management'},{v:'4.8★',l:'Guest Rating'},{v:'₹0',l:'Investor Disputes'}].map((s,i)=>(
            <div key={i} className={`py-6 px-8 text-center ${i<3?'border-r border-navy/5':''}`}>
              <div className="font-display text-4xl text-green glow-green mb-1">{s.v}</div>
              <div className="text-[8px] tracking-[2px] text-ash uppercase font-bold">{s.l}</div>
            </div>
          ))}
        </div>

        {/* HUB */}
        <section id="hub" className="py-20 px-20 bg-abyss border-y border-navy/5">
          <div className="grid grid-cols-2 gap-20 items-center">
            <div className="reveal-l">
              <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green"/>Hub Operations</div>
              <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[.92] text-navy mb-6">MANGAMMANAPALYA<br/><em className="text-green not-italic">HUB.</em></h2>
              <p className="text-[12px] leading-[1.9] text-ash mb-8 font-medium">Our centralized operations hub handles all vehicle intake, audit, deployment, and return. Every vehicle in the 8-Lines fleet is processed through this hub before and after every trip — no exceptions.</p>
              <div className="space-y-4">
                {[
                  {label:'Address',  val:'Mangammanapalya, Bengaluru 560068'},
                  {label:'Hub Type', val:'24×7 Secure Compound · CCTV Monitored'},
                  {label:'Capacity', val:'15 Vehicles · Expandable to 30'},
                  {label:'Audit Bay', val:'Dedicated MECHANIX PRO Station'},
                ].map(r=>(
                  <div key={r.label} className="flex gap-4 border-b border-green/6 pb-3">
                    <span className="text-[8px] tracking-[3px] text-green uppercase w-24 shrink-0">{r.label}</span>
                    <span className="text-[11px] text-ash">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-r">
              <div className="h-80 bg-deep border border-green/12 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20"/>
                <div className="text-center relative z-10">
                  <div className="text-6xl mb-4">📍</div>
                  <div className="text-[11px] text-ash mb-2">Mangammanapalya, Bengaluru</div>
                  <div className="text-[9px] text-fog">Google Maps — Live Hub View</div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-void/80 border border-green/12 p-3">
                  <div className="text-[8px] tracking-[3px] text-green uppercase mb-1">HUB STATUS</div>
                  <div className="flex items-center gap-2 text-[10px] text-ash">
                    <span className="w-2 h-2 bg-green rounded-full" style={{animation:'blink 2s infinite'}}/>Operational · 3 vehicles being processed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="py-20 px-20 bg-void">
          <div className="reveal mb-16">
            <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green"/>Executive Board</div>
            <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[.92] text-navy">THE PEOPLE<br/><em className="text-green not-italic">BEHIND THE WHEEL.</em></h2>
          </div>
          <div className="grid grid-cols-4 gap-px bg-green/8">
            {TEAM.map((m,i)=>(
              <div key={i} className={`reveal delay-${i+1} bg-abyss hover:bg-obsidian transition-all duration-400 p-8 group border border-transparent hover:border-green/12`}>
                <div className="w-14 h-14 bg-gradient-to-br from-graphite to-slate border border-green/20 flex items-center justify-center font-display text-2xl text-green mb-6 group-hover:border-green/40 group-hover:shadow-[0_0_20px_rgba(0,255,65,.15)] transition-all">
                  {m.init}
                </div>
                <div className="font-display text-xl tracking-[2px] text-white mb-1">{m.name}</div>
                <div className="text-[8px] tracking-[2px] text-green uppercase mb-4">{m.role}</div>
                <p className="text-[11px] leading-[1.8] text-fog">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MECHANIX PRO */}
        <section id="mechanix" className="py-20 px-20 bg-void border-b border-navy/5">
          <div className="grid grid-cols-2 gap-20 items-center">
            <div className="reveal-l">
              <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green"/>Our Standard</div>
              <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[.92] text-navy mb-6">MECHANIX PRO<br/><em className="text-green not-italic">PROTOCOL.</em></h2>
              <p className="text-[12px] leading-[1.9] text-ash mb-8 font-medium">Every vehicle undergoes a mandatory 18-point digitized audit before every single dispatch. Our mechanic uses a tablet-based checklist — Pass, Fail, or Needs Repair. If anything fails, photo evidence is mandatory. The car does not move.</p>
              <div className="bg-navy/5 border border-navy/10 p-5 mb-6">
                <div className="text-[8px] tracking-[3px] text-green uppercase mb-3 font-bold">What happens when ALL 18 checkpoints PASS?</div>
                <p className="text-[11px] leading-[1.8] text-ash font-medium">The system auto-generates a <span className="text-green font-bold">Mechanix Pro Certified Health Report</span> PDF — timestamped, digitally signed. This is our legal shield against any guest damage claims.</p>
              </div>
              <div className="bg-red/5 border border-red/15 p-5">
                <div className="text-[8px] tracking-[3px] text-red uppercase mb-3 font-bold">What happens on FAIL?</div>
                <p className="text-[11px] leading-[1.8] text-ash font-medium">Mechanic must upload photo/video evidence. Repair cost is input. System auto-generates a <span className="text-green font-bold">Mechanix Pro Service Invoice</span> and deducts the wholesale cost from the investor's next payout with full PDF transparency.</p>
              </div>
            </div>
            <div className="reveal-r">
              <div className="space-y-2">
                {['Legal & Compliance (RC, Insurance, Fitness, RAC, First-Aid)','Braking System (Pads + Parking Brake)','Engine, Powertrain & All Fluids','Check Engine / Warning Lights Clear','Exhaust — No Blue/Black Smoke','Steering & Suspension Normal','Tire Tread 4/32″ Minimum · Under 6 Years','No Sidewall Cuts, Gouges, or Bulges','Rearview and All Mirrors Intact','Seat Belts Intact and Usable','No Airbag / SRS Warning Lights','No Structural Panel Damage','Horn Operational','Windshield Free of Cracks','Window Tint Legal Compliance','All Exterior Lights Functional','Wiper / Washer Operational','Headlights & License Plate Lights OK'].map((item,i)=>(
                  <div key={i} className="flex items-center gap-4 bg-obsidian border border-green/6 px-4 py-3 hover:bg-deep hover:border-green/20 transition-all">
                    <span className="text-green text-[10px] font-mono w-6 shrink-0">{String(i+1).padStart(2,'0')}</span>
                    <span className="text-[10px] text-ash flex-1">{item}</span>
                    <span className="text-green text-[8px] border border-green/20 px-2 py-0.5 shrink-0">PASS ✓</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="py-20 px-20 bg-abyss border-y border-navy/5">
          <div className="reveal mb-16">
            <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green"/>Our Story</div>
            <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[.92] text-navy">THE <em className="text-green not-italic">JOURNEY.</em></h2>
          </div>
          <div className="grid grid-cols-4 gap-px bg-navy/5 border border-navy/5">
            {TIMELINE.map((t,i)=>(
              <div key={i} className={`reveal delay-${i+1} bg-void hover:bg-abyss p-8 transition-all border border-transparent hover:border-navy/10 shadow-sm`}>
                <div className="font-display text-5xl text-navy/10 mb-4 group-hover:text-navy/20 transition-colors">{t.year}</div>
                <div className="text-[13px] font-bold text-navy mb-3 font-body">{t.title}</div>
                <p className="text-[11px] leading-[1.8] text-ash font-medium">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="py-20 px-20 bg-void">
          <div className="reveal mb-16 text-center">
            <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center justify-center gap-3 font-bold"><span className="w-8 h-px bg-green"/>Core Values <span className="w-8 h-px bg-green"/></div>
            <h2 className="font-display text-[clamp(32px,4vw,56px)] text-navy">THE <em className="text-green not-italic">PHILOSOPHY.</em></h2>
          </div>
          <div className="grid grid-cols-2 gap-px bg-navy/5 border border-navy/5">
            {PHILOSOPHY.map((p,i)=>(
              <div key={i} className={`reveal delay-${i%2+1} bg-void hover:bg-abyss p-10 transition-all border border-transparent hover:border-navy/10 group shadow-sm`}>
                <div className="w-12 h-12 bg-navy/5 border border-navy/10 flex items-center justify-center text-2xl mb-6 group-hover:border-navy/20 transition-colors">{p.icon}</div>
                <div className="text-[14px] font-semibold text-navy mb-3 font-body">{p.title}</div>
                <p className="text-[11px] leading-[1.9] text-ash font-medium">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT / B2B */}
        <section id="contact" className="py-20 px-20 bg-void">
          <div className="grid grid-cols-2 gap-20">
            <div className="reveal-l">
              <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green"/>Corporate Leasing</div>
              <h2 className="font-display text-[clamp(32px,4vw,52px)] leading-[.92] text-navy mb-6">LET'S BUILD<br/><em className="text-green not-italic">A DEAL.</em></h2>
              <p className="text-[12px] leading-[1.9] text-ash mb-8 font-medium">Need a dedicated fleet for your corporate campus, hotel, or executive transport? We offer custom SLAs, dedicated account managers, and flexible terms.</p>
              <div className="space-y-3">
                {[
                  {icon:'📞', label:'Sales — Shaik Afnan Sabil', val:'+91 XXXXXXXXXX'},
                  {icon:'✉️', label:'Email', val:'sales@8linesgroup.com'},
                  {icon:'📍', label:'Hub', val:'Mangammanapalya, Bengaluru 560068'},
                ].map(c=>(
                  <div key={c.label} className="flex items-center gap-4 p-4 bg-navy/5 border border-navy/10 group hover:border-green/30 transition-all">
                    <span className="text-xl group-hover:scale-110 transition-transform">{c.icon}</span>
                    <div>
                      <div className="text-[8px] tracking-[2px] text-ash uppercase font-bold">{c.label}</div>
                      <div className="text-[12px] text-navy font-bold">{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-r">
              <div className="bg-void border border-navy/10 overflow-hidden shadow-2xl">
                <div className="bg-navy/5 border-b border-navy/10 px-6 py-4">
                  <span className="text-[9px] tracking-[3px] text-navy uppercase font-bold">Corporate Enquiry Form</span>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    {key:'name',     label:'Contact Name',   ph:'Your full name',      type:'text'},
                    {key:'company',  label:'Company Name',   ph:'Infosys, Taj Hotels…',type:'text'},
                    {key:'phone',    label:'Mobile',         ph:'9XXXXXXXXX',          type:'tel'},
                    {key:'vehicles', label:'Vehicles Needed',ph:'e.g. 5',              type:'number'},
                  ].map(f=>(
                    <div key={f.key}>
                      <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">{f.label}</label>
                      <input value={(form as any)[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                        type={f.type} placeholder={f.ph}
                        className="w-full bg-void border border-navy/10 px-4 py-3 text-[12px] text-navy font-mono placeholder:text-navy/20 focus:border-green outline-none transition-all" />
                    </div>
                  ))}
                  <div>
                    <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Message</label>
                    <textarea value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} rows={3}
                      className="w-full bg-void border border-navy/10 px-4 py-3 text-[12px] text-navy font-mono placeholder:text-navy/20 focus:border-green outline-none transition-all resize-none font-medium" placeholder="Tell us about your requirement…"/>
                  </div>
                  <button onClick={submitLead} disabled={busy}
                    className="w-full bg-green text-void text-[9px] tracking-[4px] uppercase py-4 font-medium transition-all hover:bg-green-dim hover:shadow-[0_0_40px_rgba(248,147,31,.4)] disabled:opacity-60">
                    {busy ? 'Sending...' : 'SUBMIT ENQUIRY →'}
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
