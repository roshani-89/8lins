'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { MechanixLogo } from '@/components/ui/Logos'
import { publicAPI } from '@/lib/api'
import toast from 'react-hot-toast'

/* ── Particle Canvas ─────────────────────────────── */
function ParticlesBG() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext('2d')!
    let W = 0, H = 0
    type P = { x:number; y:number; r:number; vx:number; vy:number; o:number }
    let pts: P[] = []
    const init = () => {
      W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; pts = []
      for (let i = 0; i < 55; i++) pts.push({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.2+.3, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.2, o:Math.random()*.2+.04 })
    }
    init(); window.addEventListener('resize', init)
    let raf: number
    const draw = () => {
      ctx.clearRect(0,0,W,H)
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(12,29,54,${p.o})`; ctx.fill()
        p.x+=p.vx; p.y+=p.vy
        if(p.x<0||p.x>W) p.vx*=-1
        if(p.y<0||p.y>H) p.vy*=-1
      })
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy)
        if(d<130){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`rgba(12,29,54,${(1-d/130)*.03})`; ctx.lineWidth=.5; ctx.stroke() }
      }
      raf=requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize',init); cancelAnimationFrame(raf) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full z-0" />
}

/* ── Animated Counter ─────────────────────────────── */
function Counter({ to, suffix='', dec=false }: {to:number;suffix?:string;dec?:boolean}) {
  const [v, setV] = useState(0); const [go, setGo] = useState(false); const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => { const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setGo(true)},{threshold:.1}); if(ref.current)o.observe(ref.current); return()=>o.disconnect() },[])
  useEffect(() => {
    if(!go) return; let s: number|null=null; const dur=2000
    const step=(ts:number)=>{ if(!s)s=ts; const p=Math.min((ts-s)/dur,1); const e=1-Math.pow(1-p,4); setV(dec?parseFloat((e*to).toFixed(1)):Math.floor(e*to)); if(p<1)requestAnimationFrame(step) }
    requestAnimationFrame(step)
  },[go,to,dec])
  return <span ref={ref}>{dec?v.toFixed(1):v}{suffix}</span>
}

/* ── Reveal hook ──────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.reveal-l,.reveal-r')
    const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in') }), {threshold:.08})
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ── ROI Calculator ───────────────────────────────── */
function ROISlider() {
  const [asset, setAsset] = useState(1500000)
  const [days, setDays]   = useState(18)
  const gross  = Math.round(asset * 0.0025 * days)
  const fee    = Math.round(gross * 0.30)
  const mech   = Math.round(gross * 0.05)
  const net    = gross - fee - mech
  const annual = net * 12
  const roi    = Math.round((annual / asset) * 100)

  return (
    <div className="bg-void border border-navy/10 overflow-hidden shadow-2xl">
      <div className="bg-navy/5 border-b border-navy/10 px-6 py-4 flex items-center justify-between">
        <span className="text-[8px] tracking-[4px] text-navy uppercase font-bold">Asset ROI Predictor</span>
        <span className="flex items-center gap-1.5 text-[8px] text-green font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-green" style={{animation:'blink 2s infinite'}} />LIVE
        </span>
      </div>
      <div className="p-8 space-y-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[9px] tracking-[3px] text-ash uppercase font-bold">Asset Market Value</span>
            <span className="font-display text-3xl text-navy">₹{asset.toLocaleString('en-IN')}</span>
          </div>
          <input type="range" min={500000} max={3000000} step={50000} value={asset}
            onChange={e => setAsset(+e.target.value)}
            className="w-full accent-orange h-1 cursor-pointer" />
          <div className="flex justify-between text-[8px] text-fog mt-1"><span>₹5L</span><span>₹30L</span></div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[9px] tracking-[3px] text-ash uppercase font-bold">Rental Days per Month</span>
            <span className="font-display text-3xl text-navy">{days} days</span>
          </div>
          <input type="range" min={8} max={28} step={1} value={days}
            onChange={e => setDays(+e.target.value)}
            className="w-full accent-orange h-1 cursor-pointer" />
          <div className="flex justify-between text-[8px] text-fog mt-1"><span>8 days</span><span>28 days</span></div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-navy/5">
          {[
            {label:'Gross Monthly', val:`₹${gross.toLocaleString('en-IN')}`, c:'text-navy'},
            {label:'Platform Fee 30%', val:`-₹${fee.toLocaleString('en-IN')}`, c:'text-fog'},
            {label:'Mechanix Est. 5%', val:`-₹${mech.toLocaleString('en-IN')}`, c:'text-fog'},
            {label:'Your 70% Net', val:`₹${net.toLocaleString('en-IN')}`, c:'text-green'},
          ].map(r => (
            <div key={r.label} className="bg-void p-5">
              <div className="text-[8px] text-ash mb-1 uppercase tracking-wide font-bold">{r.label}</div>
              <div className={`font-display text-2xl ${r.c}`}>{r.val}</div>
            </div>
          ))}
        </div>
        <div className="bg-orange/5 border border-orange/20 p-5 flex items-center justify-between">
          <div>
            <div className="text-[8px] tracking-[3px] text-orange uppercase mb-1 font-bold">Annual Yield</div>
            <div className="font-display text-5xl text-navy">₹{annual.toLocaleString('en-IN')}</div>
          </div>
          <div className="text-right">
            <div className="font-display text-4xl text-orange">{roi}%</div>
            <div className="text-[8px] text-ash mt-1 font-bold uppercase tracking-wider">Estimated ROI</div>
          </div>
        </div>
        <Link href="/login"
          className="w-full flex items-center justify-center gap-4 bg-orange text-void text-[10px] tracking-[4px] uppercase py-5 font-bold transition-all hover:bg-orange-dim hover:shadow-[0_0_50px_rgba(248,147,31,.5)] cut-lg">
          Start the 4-Step Onboarding Protocol →
        </Link>
      </div>
    </div>
  )
}

/* ── Callback Form ────────────────────────────────── */
function CallbackForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async () => {
    if (!name || !phone) { toast.error('Name and phone required'); return }
    setBusy(true)
    try {
      await publicAPI.submitLead({ name, phone, company, source: 'homepage_callback', type: 'b2b' })
      setSent(true)
      toast.success('✓ Request received. Afnan will call within 4 hours.')
    } catch {
      toast.error('Submission failed. Try again.')
    } finally { setBusy(false) }
  }

  if (sent) return (
    <div className="bg-green/5 border border-green/20 p-8 text-center">
      <div className="text-4xl mb-4">✓</div>
      <div className="text-[11px] text-green font-bold uppercase tracking-wider mb-2">Request Submitted</div>
      <p className="text-[10px] text-ash">Shaik Afnan Sabil will contact you within 4 business hours.</p>
    </div>
  )

  return (
    <div className="space-y-3">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name / Company Contact"
        className="w-full bg-void border border-navy/10 px-4 py-3 text-[12px] text-navy font-mono placeholder:text-navy/30 focus:border-orange outline-none transition-all" />
      <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Mobile Number (+91)" type="tel"
        className="w-full bg-void border border-navy/10 px-4 py-3 text-[12px] text-navy font-mono placeholder:text-navy/30 focus:border-orange outline-none transition-all" />
      <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="IT Park / Hotel / Company (Optional)"
        className="w-full bg-void border border-navy/10 px-4 py-3 text-[12px] text-navy font-mono placeholder:text-navy/30 focus:border-orange outline-none transition-all" />
      <button onClick={submit} disabled={busy}
        className="w-full bg-orange text-void text-[9px] tracking-[4px] uppercase py-4 font-bold hover:bg-orange-dim hover:shadow-[0_0_40px_rgba(248,147,31,.4)] disabled:opacity-60 transition-all cut-md">
        {busy ? 'Sending Request...' : 'REQUEST EXECUTIVE CALLBACK →'}
      </button>
    </div>
  )
}

const TICKER = [
  'Thar Roxx KA04XX0001 ● Active — Trip #4821',
  'XUV 300 KA04ND5967 ● Active — Trip #4820',
  'Kia Carens KA05XX0023 ● Active — Trip #4819',
  'Nissan Magnite KA01XX0089 ○ Available at Hub',
  "Today Revenue ₹62,400 ↑ +12%",
  'Next Payout 15 Mar · ₹1,24,500',
  'MECHANIX PRO — 100% Pass Rate Feb 2026',
  '638 trips · Zero investor disputes',
]

const FLEET = [
  { e:'🚙', name:'THAR ROXX',      meta:'4WD · DIESEL · 5 SEAT', reg:'KA04 XX0001', trips:142, rating:'4.9', price:'₹3,499', health:98 },
  { e:'🚗', name:'XUV 300',        meta:'AWD · PETROL · 5 SEAT',  reg:'KA04 ND5967', trips:198, rating:'4.8', price:'₹2,799', health:95 },
  { e:'🚐', name:'KIA CARENS',     meta:'FWD · DIESEL · 7 SEAT',  reg:'KA05 XX0023', trips:167, rating:'4.7', price:'₹2,499', health:96 },
  { e:'🚘', name:'NISSAN MAGNITE', meta:'FWD · TURBO · 5 SEAT',   reg:'KA01 XX0089', trips:131, rating:'4.6', price:'₹1,999', health:92 },
]

const COMPARE = [
  { f:'Revenue Split',    zc:'~60% Payout (Minus hidden reversals)', us:'70% Pure Passive Income — Contractual' },
  { f:'GPS / Telematics', zc:'Host pays ₹499/month',                 us:'₹0 — We cover the telematics' },
  { f:'Maintenance',      zc:'Host\'s Responsibility',                 us:'Fully managed by MECHANIX PRO at wholesale cost' },
  { f:'Guest Liability',  zc:'Weak — Hosts often pay for clutch burnouts', us:'Bulletproof — Direct lease agreements with guests' },
  { f:'Ledger',           zc:'Opaque, algorithmically delayed',       us:'Real-time trip-by-trip breakdown' },
  { f:'Tax Export',       zc:'None provided',                         us:'One-Click CA Export — Excel/CSV' },
  { f:'Legal Agreement',  zc:'Platform-favouring ToS',                us:'Clickwrap + IP + Timestamp logged' },
]

const TESTIMONIALS = [
  { name:'Rohan Sharma', role:'Investor · XUV 300', text:'Deployed my XUV 300 in October. By March I had ₹91,000 in my account. The ledger shows every single rupee — no questions, no chasing. This is what passive income actually looks like.', yield:'₹91,000', months:'5 months' },
  { name:'Priya Nair',   role:'Investor · Thar Roxx', text:'I was skeptical. But the MECHANIX PRO audit gave me confidence — I can see my car\'s health score anytime. The team is transparent in a way I\'ve never seen from any rental company.', yield:'₹1,18,500', months:'7 months' },
  { name:'Kiran Reddy',  role:'Investor · Kia Carens', text:'The tax export alone saved me 3 hours with my CA. One click, clean Excel, FY breakdown. The platform runs like a fintech product, not a startup.', yield:'₹74,200', months:'4 months' },
]

export default function Home() {
  useReveal()

  return (
    <main>
      <Navbar />

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 01. CINEMATIC SPLIT-SCREEN HERO                                */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[750px] flex overflow-hidden bg-void">
        <ParticlesBG />

        {/* DOOR 1: B2C RENTER */}
        <div className="flex-1 relative z-[5] flex flex-col justify-end p-12 lg:p-20 group h-full border-r border-navy/8 overflow-hidden transition-all duration-[800ms] hover:flex-[1.65] bg-white/50">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-orange/6 to-transparent pointer-events-none" />
          <div className="absolute -top-16 -left-16 font-display text-[40vw] text-orange/[.04] leading-none pointer-events-none select-none transition-transform duration-[800ms] group-hover:scale-105 group-hover:-translate-x-4">D</div>

          <div className="relative z-10 max-w-lg">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-orange" />
              <span className="text-[9px] tracking-[4px] text-orange uppercase font-bold">B2C · Corporate Rentals</span>
            </div>

            <h1 className="font-display text-[clamp(60px,9vw,128px)] leading-[0.82] text-navy mb-6">
              DRIVE<br/>
              <span className="text-orange relative">
                8-LINES.
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-orange shadow-[0_4px_24px_rgba(248,147,31,.5)]" />
              </span>
            </h1>

            <p className="text-[13px] leading-[1.85] text-ash mb-10 max-w-sm font-body">
              Skip the algorithmic middlemen. Rent impeccably maintained, premium SUVs directly from Bengaluru&apos;s top corporate fleet. Delivered to your doorstep.
            </p>

            <Link href="/login" id="book-drive-cta"
              className="inline-flex items-center gap-5 bg-orange text-void text-[10px] tracking-[4px] uppercase px-10 py-5 cut-lg font-bold transition-all hover:shadow-[0_16px_48px_rgba(248,147,31,.45)] hover:-translate-y-1 group/btn">
              Book a Premium Drive
              <span className="text-lg transition-transform duration-300 group-hover/btn:translate-x-2">→</span>
            </Link>

            <div className="mt-8 flex gap-8 opacity-40">
              <span className="text-[8px] text-navy font-bold uppercase tracking-wider">100% Insured</span>
              <span className="text-[8px] text-navy font-bold uppercase tracking-wider">Doorstep Delivery</span>
              <span className="text-[8px] text-navy font-bold uppercase tracking-wider">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* CENTER DIVIDER — VS Circle only */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="bg-void border border-navy/10 w-14 h-14 rounded-full flex items-center justify-center text-[9px] font-display text-navy shadow-xl" style={{backdropFilter:'blur(12px)'}}>VS</div>
        </div>

        {/* DOOR 2: B2B INVESTOR */}
        <div className="flex-1 relative z-[5] flex flex-col justify-end items-end p-12 lg:p-20 group h-full overflow-hidden transition-all duration-[800ms] hover:flex-[1.65] bg-abyss">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-bl from-green/8 to-transparent pointer-events-none" />
          <div className="absolute -top-16 -right-16 font-display text-[40vw] text-green/[.04] leading-none pointer-events-none select-none transition-transform duration-[800ms] group-hover:scale-105 group-hover:translate-x-4">I</div>

          <div className="relative z-10 text-right max-w-lg">
            <div className="flex items-center gap-3 mb-5 justify-end">
              <span className="text-[9px] tracking-[4px] text-green uppercase font-bold">B2B · Asset Investment Gateway</span>
              <span className="w-8 h-px bg-green" />
            </div>

            <h1 className="font-display text-[clamp(60px,9vw,128px)] leading-[0.82] text-navy mb-6">
              DEPLOY<br/>
              <span className="text-green relative">
                ASSET.
                <span className="absolute -bottom-2 right-0 w-full h-1 bg-green shadow-[0_4px_24px_rgba(18,51,43,.35)]" />
              </span>
            </h1>

            <p className="text-[13px] leading-[1.85] text-ash mb-10 max-w-sm ml-auto font-body">
              Don&apos;t just host your car — delegate it to the experts. We manage the logistics, the maintenance, and the algorithm. You collect the passive corporate income.
              <span className="block mt-3 text-green font-bold">70% Net Yield. Guaranteed by contract.</span>
            </p>

            <Link href="/login" id="deploy-asset-cta"
              className="inline-flex items-center gap-5 border-2 border-green/50 text-green text-[10px] tracking-[4px] uppercase px-10 py-5 cut-lg font-bold transition-all hover:bg-green hover:text-void hover:shadow-[0_16px_48px_rgba(18,51,43,.3)] hover:-translate-y-1 group/btn">
              Calculate Your ROI
              <span className="text-lg transition-transform duration-300 group-hover/btn:translate-x-2">→</span>
            </Link>

            <div className="mt-8 flex gap-8 opacity-30 justify-end">
              <span className="text-[8px] text-navy font-bold uppercase tracking-wider">ROI Calculator</span>
              <span className="text-[8px] text-navy font-bold uppercase tracking-wider">Legal Agreement</span>
            </div>
          </div>
        </div>

        {/* Scroll Cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[8px] tracking-[4px] text-ash/50 uppercase font-bold">Scroll</span>
          <div className="w-px h-12 bg-navy/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-orange" style={{animation:'scroll-down 2s infinite'}} />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 02. LIVE STATS BAR                                             */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <div className="bg-void border-y border-navy/5 grid grid-cols-4">
        {[
          {to:638, s:'+', label:'Completed Corporate Trips', dec:false},
          {to:11,  s:'+', label:'Premium Assets Deployed',  dec:false},
          {to:4.7, s:'★', label:'Professional Guest Rating', dec:true},
          {to:100, s:'%', label:'Hub-Verified Maintenance',  dec:false},
        ].map((s,i)=>(
          <div key={i} className={`py-8 px-8 text-center group cursor-default ${i<3?'border-r border-navy/5':''}`}>
            <div className="font-display text-5xl text-navy mb-2 group-hover:scale-110 group-hover:text-green transition-all duration-300">
              <Counter to={s.to} suffix={s.s} dec={s.dec} />
            </div>
            <div className="text-[8px] tracking-[2px] text-ash uppercase font-bold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 03. LIVE TICKER                                                */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <div className="bg-abyss border-b border-navy/8 h-11 flex items-center overflow-hidden">
        <div className="shrink-0 bg-orange text-void text-[8px] tracking-[3px] uppercase px-5 h-full flex items-center font-bold z-10 gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-void" style={{animation:'blink 1.5s infinite'}}/>LIVE
        </div>
        <div className="flex ticker-wrap">
          {[...TICKER,...TICKER].map((t,i)=>(
            <div key={i} className="flex items-center whitespace-nowrap px-10 text-[9px] tracking-[1px] text-fog/70 border-r border-orange/8 gap-2">{t}</div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 04. PATH 1 — THE 8-LINES GUARANTEE (B2C)                      */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section id="rental" className="py-24 px-20 bg-void relative overflow-hidden">
        <div className="absolute right-0 top-0 font-display text-[22vw] text-orange/[.025] pointer-events-none leading-none select-none">DRIVE</div>

        <div className="reveal mb-16 max-w-4xl">
          <div className="text-[8px] tracking-[5px] text-orange uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-orange" />Path 01 — B2C Rental</div>
          <h2 className="font-display text-[clamp(40px,5vw,72px)] leading-[.92] text-navy mb-6">
            THE 8-LINES GUARANTEE:<br/>
            <em className="text-orange not-italic">SUPERIOR FLEET. ZERO COMPROMISE.</em>
          </h2>
          <p className="text-[13px] leading-[1.9] text-ash max-w-2xl font-body">
            We are not a peer-to-peer sharing app where you gamble on a stranger&apos;s dirty car. 8-Lines Group owns, operates, and meticulously maintains every vehicle in our premium pool.
          </p>
        </div>

        {/* 3-Column Feature Grid */}
        <div className="grid grid-cols-3 gap-px bg-navy/5 border border-navy/5 mb-16">
          {[
            {
              icon:<MechanixLogo className="h-10 w-auto" />,
              title:'MECHANIX PRO CERTIFIED',
              desc:'Every vehicle undergoes a mandatory 22-point safety and powertrain digital audit at our private hub before every dispatch. The mechanic cannot submit without photographic proof on any failed item. No breakdowns. Just performance.',
              tag:'22-Point Audit'
            },
            {
              icon:'📍',
              title:'EXECUTIVE DOORSTEP DELIVERY',
              desc:'From Kempegowda International Airport to Electronic City IT Parks — we drop the keys in your hand at your chosen location. Zero dead-mileage costs. Zero inconvenience.',
              tag:'Bengaluru-Wide'
            },
            {
              icon:'🛡️',
              title:'CORPORATE-GRADE SAFETY',
              desc:'Every rental is backed by Comprehensive Insurance and a legally-binding Digital Lease Agreement executed with the guest\'s IP and timestamp. 8-Lines bears the liability, not you.',
              tag:'Fully Insured'
            },
          ].map((f,i)=>(
            <div key={i} className={`reveal delay-${i+1} bg-void hover:bg-abyss transition-all duration-400 p-10 group relative overflow-hidden`}>
              <div className="w-14 h-14 bg-navy/5 border border-navy/10 flex items-center justify-center mb-6 group-hover:border-orange/40 group-hover:shadow-[0_0_20px_rgba(248,147,31,.1)] transition-all overflow-hidden p-1.5">
                {typeof f.icon === 'string' ? <span className="text-2xl">{f.icon}</span> : f.icon}
              </div>
              <div className="text-[8px] tracking-[3px] text-orange uppercase mb-3 font-bold">{f.tag}</div>
              <div className="text-[14px] font-bold text-navy mb-4 font-display">{f.title}</div>
              <p className="text-[11px] leading-[1.9] text-ash font-body">{f.desc}</p>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{boxShadow:'0 0 8px #F8931F'}} />
            </div>
          ))}
        </div>

        {/* Fleet Showcase */}
        <div className="reveal flex justify-between items-end mb-10">
          <div>
            <div className="text-[8px] tracking-[5px] text-orange uppercase mb-3 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-orange" />FLEET REGISTRY · BLR-01</div>
            <h3 className="font-display text-[clamp(32px,4vw,56px)] leading-[.92] text-navy">
              BROWSE THE FLEET<br/><em className="text-orange not-italic">& RESERVE DATES.</em>
            </h3>
          </div>
          <Link href="/login" id="browse-fleet-btn"
            className="inline-flex items-center gap-3 border border-orange/40 text-orange text-[9px] tracking-[3px] uppercase px-7 py-3 cut-sm hover:bg-orange hover:text-void transition-all font-bold">
            View Full Fleet →
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-px bg-navy/5 border border-navy/5">
          {FLEET.map((car,i)=>(
            <Link key={i} href="/login" id={`fleet-card-${i}`}
              className={`reveal delay-${i+1} bg-void hover:bg-abyss hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(12,29,54,.08)] transition-all duration-500 group relative overflow-hidden block`}>
              <div className="absolute top-3 left-3 text-[7px] tracking-[2px] text-green border border-green/40 px-2 py-1 bg-void/90 z-10 font-bold">✓ CERTIFIED</div>
              <div className="absolute top-3 right-3 text-[7px] text-navy border border-navy/10 px-2 py-1 bg-void/90 z-10 font-bold">{car.health}% HEALTH</div>
              <div className="h-44 flex items-center justify-center text-7xl bg-abyss relative overflow-hidden border-b border-navy/5">
                <span className="group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500">{car.e}</span>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-void/20 to-transparent" />
              </div>
              <div className="p-6 pb-7">
                <div className="font-display text-xl tracking-[2px] text-navy mb-1">{car.name}</div>
                <div className="text-[9px] tracking-[1px] text-ash mb-1 font-bold">{car.meta}</div>
                <div className="text-[8px] font-mono text-graphite mb-5">{car.reg}</div>
                <div className="flex gap-5 mb-5">
                  <div><div className="font-display text-lg text-green">{car.rating}★</div><div className="text-[8px] text-ash font-bold">Rating</div></div>
                  <div><div className="font-display text-lg text-navy">{car.trips}</div><div className="text-[8px] text-ash font-bold">Trips</div></div>
                </div>
                <div className="flex items-baseline justify-between border-t border-navy/5 pt-4">
                  <span className="font-display text-3xl text-orange">{car.price}</span>
                  <span className="text-[9px] text-ash font-bold">/ day</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 05. PATH 2 — THE MASTER ARBITRAGE + ROI CALCULATOR (B2B)      */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section id="invest" className="py-24 px-20 bg-abyss relative overflow-hidden">
        <div className="absolute left-0 top-0 font-display text-[22vw] text-green/[.025] pointer-events-none leading-none select-none">EARN</div>

        {/* Section Header */}
        <div className="reveal mb-16">
          <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green" />Path 02 — Asset Investment</div>
          <h2 className="font-display text-[clamp(40px,5vw,72px)] leading-[.92] text-navy mb-6">
            THE MASTER ARBITRAGE:<br/>
            <em className="text-green not-italic">WE WORK. YOUR ASSET EARNS.</em>
          </h2>
          <p className="text-[13px] leading-[1.9] text-ash max-w-3xl font-body">
            Managing a commercial vehicle on public apps is a full-time job. Between guest disputes, algorithm changes, and mechanical breakdowns, your &quot;passive income&quot; quickly becomes an active nightmare. <strong className="text-navy">8-Lines Group acts as your protective corporate shield.</strong>
          </p>
        </div>

        {/* Us vs Them Table + ROI Slider */}
        <div className="grid grid-cols-2 gap-16 mb-20">

          {/* Comparison Table */}
          <div className="reveal-l">
            <div className="text-[8px] tracking-[5px] text-orange uppercase mb-6 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-orange" />8-LINES vs. THE REST</div>
            <div className="border border-navy/10 overflow-hidden bg-void shadow-xl">
              <div className="grid grid-cols-3 bg-navy/5 border-b border-navy/10">
                <div className="p-4 text-[8px] tracking-[2px] text-ash uppercase font-bold">Feature</div>
                <div className="p-4 text-[8px] tracking-[2px] text-ash uppercase font-bold border-l border-navy/5">Standard Apps</div>
                <div className="p-4 text-[8px] tracking-[2px] text-green uppercase font-bold border-l border-navy/5">8-Lines ⚡</div>
              </div>
              {COMPARE.map((r,i)=>(
                <div key={i} className="grid grid-cols-3 border-b border-navy/5 hover:bg-navy/[.02] transition-colors">
                  <div className="p-4 text-[9px] tracking-[1px] text-ash uppercase font-bold">{r.f}</div>
                  <div className="p-4 text-[10px] text-red/70 border-l border-navy/5 font-medium leading-snug">{r.zc}</div>
                  <div className="p-4 text-[10px] text-green border-l border-navy/5 font-bold leading-snug">✓ {r.us}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ROI Slider */}
          <div className="reveal-r">
            <div className="text-[8px] tracking-[5px] text-green uppercase mb-6 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green" />ROI CALCULATOR</div>
            <ROISlider />
          </div>
        </div>

        {/* 4-Step Protocol Overview */}
        <div className="reveal mb-5">
          <div className="text-[8px] tracking-[5px] text-green uppercase mb-6 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green" />THE ONBOARDING PROTOCOL</div>
          <h3 className="font-display text-[clamp(32px,4vw,56px)] leading-[.92] text-navy mb-12">4 STEPS TO <em className="text-green not-italic">PASSIVE INCOME.</em></h3>
        </div>
        <div className="grid grid-cols-4 gap-px bg-navy/8 border border-navy/8">
          {[
            {n:'01',icon:'🚗',t:'Asset Registration', d:'Submit vehicle details — RC Book, Insurance, Make & Model. All data encrypted in AWS S3.'},
            {n:'02',icon:'📋',t:'Digital Agreement',  d:'Execute the 9-Month Master Agreement via clickwrap. IP address and timestamp cryptographically logged.'},
            {n:'03',icon:'🔐',t:'KYC Verification',   d:'Upload PAN Card and Aadhar securely. Required before first payout is processed.'},
            {n:'04',icon:'💳',t:'₹5,000 Activation',  d:'Non-refundable onboarding fee via Razorpay UPI / Cards. Activates your real-time Investor Dashboard.'},
          ].map((s,i)=>(
            <div key={i} className={`reveal delay-${i+1} bg-void hover:bg-abyss transition-all p-10 relative overflow-hidden group`}>
              <div className="absolute top-2 right-4 font-display text-[70px] leading-none text-navy/[.04] group-hover:text-navy/8 transition-colors select-none">{s.n}</div>
              <div className="w-12 h-12 bg-navy/5 border border-navy/10 flex items-center justify-center text-xl mb-6 group-hover:border-green/30 transition-all">{s.icon}</div>
              <div className="text-[8px] tracking-[3px] text-green uppercase mb-3 font-bold">Step {s.n}</div>
              <div className="text-[14px] font-bold text-navy mb-3 font-body">{s.t}</div>
              <p className="text-[11px] leading-[1.8] text-ash font-body">{s.d}</p>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-green scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 06. INVESTOR TESTIMONIALS                                      */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-20 bg-void">
        <div className="reveal text-center mb-16">
          <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center justify-center gap-3"><span className="w-8 h-px bg-green"/>Investor Voices<span className="w-8 h-px bg-green"/></div>
          <h2 className="font-display text-[clamp(36px,4vw,60px)] text-navy">REAL RETURNS.<br/><em className="text-green not-italic">REAL PEOPLE.</em></h2>
        </div>
        <div className="grid grid-cols-3 gap-px bg-navy/5 border border-navy/5">
          {TESTIMONIALS.map((t,i)=>(
            <div key={i} className={`reveal delay-${i+1} bg-void hover:bg-abyss p-10 transition-all group flex flex-col`}>
              <div className="font-display text-6xl text-navy/10 leading-none mb-4 group-hover:text-navy/20 transition-colors">&ldquo;</div>
              <p className="text-[11px] leading-[1.9] text-ash flex-1 mb-8 italic">{t.text}</p>
              <div className="bg-navy/5 border border-navy/10 p-4 mb-5">
                <div className="text-[8px] tracking-[2px] text-ash uppercase mb-1">Total Earned</div>
                <div className="font-display text-2xl text-orange">{t.yield}</div>
                <div className="text-[9px] text-ash">{t.months}</div>
              </div>
              <div>
                <div className="text-[12px] text-navy font-bold font-body">{t.name}</div>
                <div className="text-[9px] tracking-[2px] text-green uppercase">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 07. BATTLE-TESTED OPERATIONS — TRUST ANCHOR                    */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(18,51,43,.15),transparent)'}} />
        <div className="reveal text-center mb-16 relative z-10">
          <div className="text-[8px] tracking-[5px] text-green/60 uppercase mb-4 flex items-center justify-center gap-3 font-bold"><span className="w-8 h-px bg-green/40" />Trust Anchor<span className="w-8 h-px bg-green/40" /></div>
          <h2 className="font-display text-[clamp(40px,5vw,72px)] leading-[.92] text-void mb-6">
            BATTLE-TESTED<br/><em className="text-green not-italic">OPERATIONS.</em>
          </h2>
          <p className="text-[13px] leading-[1.9] text-void/50 max-w-2xl mx-auto font-body">
            We don&apos;t just build tech; we run the ground game. The 8-Lines Executive Team has mastered Bengaluru&apos;s mobility logistics.
          </p>
        </div>

        {/* Glowing Metrics Bar */}
        <div className="reveal grid grid-cols-4 gap-px bg-green/5 border border-green/10 mb-20 relative z-10">
          {[
            {num:'638+', label:'Completed Corporate Trips', sub:'Zero investor disputes'},
            {num:'11+',  label:'Premium Assets Active',     sub:'Hub-verified & deployed'},
            {num:'4.7+', label:'Star Professional Rating',  sub:'Guest satisfaction score'},
            {num:'100%', label:'Hub-Verified Maintenance',  sub:'MECHANIX PRO certified'},
          ].map((s,i)=>(
            <div key={i} className="bg-navy/60 hover:bg-green/5 transition-all duration-500 p-10 text-center group">
              <div className="font-display text-5xl text-green mb-3 group-hover:scale-110 transition-transform" style={{textShadow:'0 0 40px rgba(18,51,43,.8)'}}>{s.num}</div>
              <div className="text-[10px] text-void/80 font-bold uppercase tracking-wider mb-1">{s.label}</div>
              <div className="text-[9px] text-void/30">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Institutional Features */}
        <div className="grid grid-cols-3 gap-px bg-green/5 border border-green/10 relative z-10">
          {[
            {icon:<MechanixLogo className="h-full w-auto" />, title:'MECHANIX PRO',       desc:'22-point mandatory digital audit before every dispatch. Fail = photo evidence mandatory. The car does not move without certification.'},
            {icon:'📊', title:'REAL-TIME LEDGER',     desc:'Trip-by-trip financial breakdown. Gross rent → 30% platform fee → mechanix deduction → your 70%. Total transparency, always.'},
            {icon:'📋', title:'LEGAL CLICKWRAP',      desc:'IP address, UTC timestamp, and device fingerprint logged on agreement execution. Legally binding under IT Act 2000, Section 10A.'},
            {icon:'🔐', title:'OTP-ONLY AUTH',        desc:'No passwords. No weak links. OTP sent to registered mobile only. Bank-grade authentication across all portals.'},
            {icon:'💰', title:'GUARANTEED SPLIT',     desc:'70% is contractual, not algorithmic. 8-Lines cannot claw back, reverse, or arbitrarily modify your earnings.'},
            {icon:'📁', title:'CA-READY TAX EXPORT',  desc:'One-click Excel export for your CA. Monthly breakdowns, annual summaries, GST-ready format. Finance-grade records.'},
          ].map((f,i)=>(
            <div key={i} className={`reveal delay-${Math.min(i%3+1,4)} bg-navy/40 hover:bg-green/5 transition-all duration-400 p-10 group relative overflow-hidden border border-transparent hover:border-green/10`}>
              <div className="w-12 h-12 border border-green/10 flex items-center justify-center mb-6 group-hover:border-green/30 group-hover:shadow-[0_0_20px_rgba(18,51,43,.3)] transition-all overflow-hidden p-1">
                {typeof f.icon === 'string' ? <span className="text-2xl group-hover:scale-110 transition-transform">{f.icon}</span> : f.icon}
              </div>
              <div className="text-[13px] font-bold text-void mb-3 font-display">{f.title}</div>
              <p className="text-[11px] leading-[1.85] text-void/40 font-body">{f.desc}</p>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-green scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{boxShadow:'0 0 8px rgba(18,51,43,.8)'}} />
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 08. FINAL CTA — CORPORATE CALLBACK                             */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section className="py-28 px-20 bg-void relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(248,147,31,.04),transparent)'}}/>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 font-display text-[30vw] text-orange/[.02] pointer-events-none leading-none select-none">8L</div>

        <div className="relative z-10 grid grid-cols-2 gap-20 items-start max-w-5xl mx-auto">
          {/* Left — Big CTA Copy */}
          <div className="reveal-l">
            <div className="text-[8px] tracking-[5px] text-orange uppercase mb-6 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-orange"/>B2B Enterprise</div>
            <h2 className="font-display text-[clamp(40px,5vw,72px)] leading-[.92] text-navy mb-6">
              WANT TO INTEGRATE<br/>
              <em className="text-orange not-italic">8-LINES</em><br/>
              INTO YOUR ENTERPRISE?
            </h2>
            <p className="text-[13px] leading-[1.9] text-ash mb-8 font-body">
              Whether you run an IT Park, a Five-Star Hotel, or a Corporate Campus — speak directly with our <strong className="text-navy">Head of Sales & Onboarding, Shaik Afnan Sabil</strong>. We offer fleet integration, white-label mobility solutions, and dedicated account executives.
            </p>
            <div className="space-y-3 mb-8">
              {['Custom fleet pricing for corporate accounts','Dedicated account executive & 24/7 support line','Branded driver app integration available','GST invoice for HR & accounts teams'].map(pt=>(
                <div key={pt} className="flex items-center gap-3 text-[11px] text-ash">
                  <span className="text-green font-bold">✓</span>{pt}
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Link href="/investor#form" id="deploy-footer-cta"
                className="inline-flex items-center gap-4 bg-orange text-void text-[9px] tracking-[3px] uppercase px-8 py-4 cut-md font-bold hover:bg-orange-dim hover:shadow-[0_0_40px_rgba(248,147,31,.4)] transition-all">
                Deploy Your Asset →
              </Link>
              <Link href="/fleet" id="book-footer-cta"
                className="inline-flex items-center gap-4 border border-orange/30 text-orange text-[9px] tracking-[3px] uppercase px-8 py-4 cut-md hover:bg-orange/5 hover:border-orange transition-all">
                Book a Drive →
              </Link>
            </div>
          </div>

          {/* Right — Callback Form (native CRM, not Google Form) */}
          <div className="reveal-r">
            <div className="text-[8px] tracking-[3px] text-ash uppercase mb-5 font-bold">Request Executive Callback</div>
            <div className="bg-void border border-navy/10 overflow-hidden shadow-xl">
              <div className="bg-navy/5 border-b border-navy/10 px-6 py-5 flex items-center justify-between">
                <div>
                  <div className="text-[9px] tracking-[3px] text-navy uppercase font-bold">Shaik Afnan Sabil</div>
                  <div className="text-[8px] text-ash mt-0.5">Head of Sales & B2B Onboarding</div>
                </div>
                <div className="flex items-center gap-1.5 text-[8px] text-green">
                  <span className="w-1.5 h-1.5 rounded-full bg-green" style={{animation:'blink 2s infinite'}}/>Available Today
                </div>
              </div>
              <div className="p-6">
                <CallbackForm />
                <p className="text-[8px] text-fog text-center mt-4">⏱ Response within 4 business hours. No spam, ever. Routed directly to native CRM.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
