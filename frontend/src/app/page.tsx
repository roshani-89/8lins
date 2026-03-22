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
    type P = { x: number; y: number; r: number; vx: number; vy: number; o: number }
    let pts: P[] = []
    const init = () => {
      W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; pts = []
      for (let i = 0; i < 55; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.2 + .3, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .2, o: Math.random() * .2 + .04 })
    }
    init(); window.addEventListener('resize', init)
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(12,29,54,${p.o})`; ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      })
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy)
        if (d < 130) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(12,29,54,${(1 - d / 130) * .03})`; ctx.lineWidth = .5; ctx.stroke() }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', init); cancelAnimationFrame(raf) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full z-0" />
}

/* ── Animated Counter ─────────────────────────────── */
function Counter({ to, suffix = '', dec = false }: { to: number; suffix?: string; dec?: boolean }) {
  const [v, setV] = useState(0); const [go, setGo] = useState(false); const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true) }, { threshold: .1 }); if (ref.current) o.observe(ref.current); return () => o.disconnect() }, [])
  useEffect(() => {
    if (!go) return; let s: number | null = null; const dur = 2000
    const step = (ts: number) => { if (!s) s = ts; const p = Math.min((ts - s) / dur, 1); const e = 1 - Math.pow(1 - p, 4); setV(dec ? parseFloat((e * to).toFixed(1)) : Math.floor(e * to)); if (p < 1) requestAnimationFrame(step) }
    requestAnimationFrame(step)
  }, [go, to, dec])
  return <span ref={ref}>{dec ? v.toFixed(1) : v}{suffix}</span>
}

/* ── Reveal hook ──────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.reveal-l,.reveal-r')
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }), { threshold: .08 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ── ROI Calculator ───────────────────────────────── */
function ROISlider() {
  const [asset, setAsset] = useState(1500000)
  const [days, setDays] = useState(18)
  const gross = Math.round(asset * 0.0025 * days)
  const fee = Math.round(gross * 0.30)
  const mech = Math.round(gross * 0.05)
  const net = gross - fee - mech
  const annual = net * 12
  const roi = Math.round((annual / asset) * 100)

  return (
    <div className="glass-card border border-navy/10 overflow-hidden shadow-premium">
      <div className="bg-navy/5 border-b border-navy/10 px-4 md:px-6 py-4 flex items-center justify-between">
        <span className="text-[9px] tracking-[4px] text-navy uppercase font-black">Asset ROI Predictor</span>
        <span className="flex items-center gap-1.5 text-[8px] text-green font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />LIVE PROTOCOL
        </span>
      </div>
      <div className="p-6 md:p-8 space-y-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[9px] md:text-[10px] tracking-[3px] text-ash uppercase font-black">Market Valuation</span>
            <span className="font-display text-2xl md:text-3xl text-navy">₹{asset.toLocaleString('en-IN')}</span>
          </div>
          <input type="range" min={500000} max={3000000} step={50000} value={asset}
            onChange={e => setAsset(+e.target.value)}
            className="w-full accent-orange h-1 cursor-pointer" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[9px] md:text-[10px] tracking-[3px] text-ash uppercase font-black">Monthly Deployment</span>
            <span className="font-display text-2xl md:text-3xl text-navy">{days} days</span>
          </div>
          <input type="range" min={8} max={28} step={1} value={days}
            onChange={e => setDays(+e.target.value)}
            className="w-full accent-orange h-1 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2 gap-px bg-navy/5">
          {[
            { label: 'Gross Forecast', val: `₹${gross.toLocaleString('en-IN')}`, c: 'text-navy' },
            { label: 'Protocol Fee', val: `-₹${fee.toLocaleString('en-IN')}`, c: 'text-fog' },
            { label: 'Mechanix Est.', val: `-₹${mech.toLocaleString('en-IN')}`, c: 'text-fog' },
            { label: 'Net Passive', val: `₹${net.toLocaleString('en-IN')}`, c: 'text-green font-black' },
          ].map(r => (
            <div key={r.label} className="bg-white/50 p-4 md:p-5">
              <div className="text-[8px] md:text-[9px] text-ash mb-1 uppercase tracking-widest font-bold">{r.label}</div>
              <div className={`font-display text-xl md:text-2xl ${r.c}`}>{r.val}</div>
            </div>
          ))}
        </div>
        <div className="bg-orange/5 border border-orange/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-[9px] tracking-[4px] text-orange uppercase mb-1 font-black">Annual Yield</div>
            <div className="font-display text-4xl md:text-5xl text-navy tracking-tight">₹{annual.toLocaleString('en-IN')}</div>
          </div>
          <div className="text-center sm:text-right border-t sm:border-t-0 border-orange/5 pt-4 sm:pt-0 w-full sm:w-auto">
            <div className="font-display text-4xl md:text-5xl text-orange glow-orange">{roi}%</div>
            <div className="text-[9px] text-ash mt-1 font-black uppercase tracking-widest">Efficiency ROI</div>
          </div>
        </div>
        <Link href="/investor/login"
          className="w-full flex items-center justify-center gap-4 bg-orange text-void text-[10px] tracking-[5px] uppercase py-5 font-bold transition-all hover:bg-orange-dim hover:shadow-glow cut-lg">
          Initialize Onboarding →
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
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name / Company Contact"
        className="w-full bg-void border border-navy/10 px-4 py-3 text-[12px] text-navy font-mono placeholder:text-navy/30 focus:border-orange outline-none transition-all" />
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile Number (+91)" type="tel"
        className="w-full bg-void border border-navy/10 px-4 py-3 text-[12px] text-navy font-mono placeholder:text-navy/30 focus:border-orange outline-none transition-all" />
      <input value={company} onChange={e => setCompany(e.target.value)} placeholder="IT Park / Hotel / Company (Optional)"
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
  { image: '/images/thar_roxx.png', name: 'THAR ROXX', meta: '4WD · DIESEL · 5 SEAT', reg: 'KA04 XX0001', trips: 142, rating: '4.9', price: '₹3,499', health: 98 },
  { image: '/images/xuv300.png', name: 'XUV 300', meta: 'AWD · PETROL · 5 SEAT', reg: 'KA04 ND5967', trips: 198, rating: '4.8', price: '₹2,799', health: 95 },
  { image: '/images/kia_carens.png', name: 'KIA CARENS', meta: 'FWD · DIESEL · 7 SEAT', reg: 'KA05 XX0023', trips: 167, rating: '4.7', price: '₹2,499', health: 96 },
  { image: '/images/nissan_magnite.png', name: 'NISSAN MAGNITE', meta: 'FWD · TURBO · 5 SEAT', reg: 'KA01 XX0089', trips: 131, rating: '4.6', price: '₹1,999', health: 92 },
]

const COMPARE = [
  { f: 'Revenue Split', zc: '~60% Payout (Minus hidden reversals)', us: '70% Pure Passive Income — Contractual' },
  { f: 'GPS / Telematics', zc: 'Host pays ₹499/month', us: '₹0 — We cover the telematics' },
  { f: 'Maintenance', zc: 'Host\'s Responsibility', us: 'Fully managed by MECHANIX PRO at wholesale cost' },
  { f: 'Guest Liability', zc: 'Weak — Hosts often pay for clutch burnouts', us: 'Bulletproof — Direct lease agreements with guests' },
  { f: 'Ledger', zc: 'Opaque, algorithmically delayed', us: 'Real-time trip-by-trip breakdown' },
  { f: 'Tax Export', zc: 'None provided', us: 'One-Click CA Export — Excel/CSV' },
  { f: 'Legal Agreement', zc: 'Platform-favouring ToS', us: 'Clickwrap + IP + Timestamp logged' },
]

const TESTIMONIALS = [
  { name: 'Rohan Sharma', role: 'Investor · XUV 300', text: 'Deployed my XUV 300 in October. By March I had ₹91,000 in my account. The ledger shows every single rupee — no questions, no chasing. This is what passive income actually looks like.', yield: '₹91,000', months: '5 months' },
  { name: 'Priya Nair', role: 'Investor · Thar Roxx', text: 'I was skeptical. But the MECHANIX PRO audit gave me confidence — I can see my car\'s health score anytime. The team is transparent in a way I\'ve never seen from any rental company.', yield: '₹1,18,500', months: '7 months' },
  { name: 'Kiran Reddy', role: 'Investor · Kia Carens', text: 'The tax export alone saved me 3 hours with my CA. One click, clean Excel, FY breakdown. The platform runs like a fintech product, not a startup.', yield: '₹74,200', months: '4 months' },
]

export default function Home() {
  useReveal()

  return (
    <main>
      <Navbar />

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 01. PREMIUM CINEMATIC HERO                                     */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[900px] lg:h-screen lg:min-h-[750px] flex flex-col lg:flex-row overflow-hidden bg-void">
        {/* Background Overlay Pattern */}
        <div className="absolute inset-0 z-[1] carbon-fiber opacity-[0.02] pointer-events-none" />

        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/luxury_suv.png"
            alt="Luxury SUV Bengaluru"
            className="w-full h-full object-cover opacity-[0.45] lg:scale-105"
            style={{ filter: 'brightness(1.05) contrast(1.02)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r lg:from-void/60 via-transparent lg:to-void/60 pointer-events-none" />
        </div>

        <ParticlesBG />

        {/* DOOR 1: B2C RENTER */}
        <div className="flex-1 relative z-[5] flex flex-col justify-center lg:justify-end p-8 md:p-12 lg:p-20 group h-full border-b lg:border-r border-navy/5 overflow-hidden transition-all duration-[800ms] lg:hover:flex-[1.4]">
          <div className="absolute inset-0 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-orange/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-16 -left-16 font-display text-[45vw] text-stroke opacity-[0.02] leading-none pointer-events-none select-none transition-transform duration-[1000ms] lg:group-hover:scale-110 lg:group-hover:translate-x-12">GEAR</div>

          <div className="relative z-10 max-w-lg reveal-l">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-px bg-orange shadow-[0_0_8px_rgba(248,147,31,0.5)]" />
              <span className="text-[10px] tracking-[6px] text-orange uppercase font-black">PREMIUM FLEET PORTFOLIO</span>
            </div>

            <h1 className="font-display text-[clamp(50px,9vw,130px)] leading-[0.82] text-navy mb-8 animate-float">
              BEYOND<br />
              <span className="text-orange relative inline-block">
                DRIVING.
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-orange glow-orange" />
              </span>
            </h1>

            <p className="text-[14px] md:text-[15px] leading-[1.8] text-ash mb-10 lg:mb-12 max-w-sm font-medium">
              Bengaluru&apos;s most meticulously engineered corporate fleet. No peer-to-peer compromise. Just raw, hub-maintained performance.
            </p>

            <Link href="/drive/login" id="book-drive-cta"
              className="group/btn relative inline-flex items-center gap-8 bg-navy text-void text-[11px] tracking-[5px] uppercase px-12 md:px-14 py-6 md:py-7 font-black transition-all hover:bg-orange hover:shadow-[0_20px_60px_rgba(248,147,31,0.4)] hover:-translate-y-1 overflow-hidden cut-lg">
              <span className="relative z-10">IGNITE ENGINE →</span>
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
            </Link>

            <div className="mt-12 lg:mt-16 flex gap-10 opacity-60">
              <div className="flex flex-col gap-1 border-l-2 border-orange/30 pl-4 py-1">
                <span className="text-[9px] text-navy font-black uppercase tracking-widest">HUB-VERIFIED</span>
                <span className="text-[7px] text-ash font-bold uppercase tracking-widest">22-Point Audit</span>
              </div>
              <div className="flex flex-col gap-1 border-l-2 border-navy/20 pl-4 py-1">
                <span className="text-[9px] text-navy font-black uppercase tracking-widest">BLR ENTITY</span>
                <span className="text-[7px] text-ash font-bold uppercase tracking-widest">Doorstep Hub</span>
              </div>
            </div>
          </div>
        </div>

        {/* VS RING (The Dial) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden lg:block">
          <div className="bg-void border-4 border-navy/5 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-3xl group">
            <div className="w-24 h-24 rounded-full border-2 border-orange/20 flex items-center justify-center font-display text-[14px] text-navy tracking-[4px] font-black">RPM</div>
            <div className="absolute inset-0 rounded-full border border-orange/30 animate-ping opacity-30" />
            <div className="absolute -inset-6 rounded-full border border-navy/[0.02] animate-pulse" />
          </div>
        </div>

        {/* DOOR 2: B2B INVESTOR */}
        <div className="flex-1 relative z-[5] flex flex-col justify-center items-end lg:justify-end p-8 md:p-12 lg:p-20 group h-full overflow-hidden transition-all duration-[800ms] lg:hover:flex-[1.4]">
          <div className="absolute inset-0 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-bl from-green/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-16 -right-16 font-display text-[45vw] text-stroke opacity-[0.02] leading-none pointer-events-none select-none transition-transform duration-[1000ms] lg:group-hover:scale-110 lg:group-hover:-translate-x-12">YIELD</div>

          <div className="relative z-10 text-right max-w-lg reveal-r">
            <div className="flex items-center gap-4 mb-6 justify-end">
              <span className="text-[10px] tracking-[6px] text-green uppercase font-black">ASSET MANAGEMENT PROTOCOL</span>
              <span className="w-12 h-px bg-green shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            </div>

            <h1 className="font-display text-[clamp(50px,9vw,130px)] leading-[0.82] text-navy mb-8 animate-float" style={{ animationDelay: '1s' }}>
              DEPLOY<br />
              <span className="text-green relative inline-block">
                ASSET.
                <span className="absolute -bottom-2 right-0 w-full h-2 bg-green glow-green" />
              </span>
            </h1>

            <p className="text-[14px] md:text-[15px] leading-[1.8] text-ash mb-10 lg:mb-12 max-w-sm ml-auto font-medium">
              Maximize your asset&apos;s torque. 70% contractual net yield. Zero administrative friction. Bengaluru&apos;s premier investment engine.
            </p>

            <Link href="/investor/login" id="deploy-asset-cta"
              className="group/btn relative inline-flex items-center gap-8 border-2 border-navy text-navy text-[11px] tracking-[5px] uppercase px-12 md:px-14 py-6 md:py-7 font-black transition-all hover:bg-green hover:text-void hover:border-green hover:shadow-[0_20px_60px_rgba(34,197,94,0.3)] hover:-translate-y-1 overflow-hidden cut-lg">
              <span className="relative z-10">ACTIVATE REVENUE →</span>
            </Link>

            <div className="mt-12 lg:mt-16 flex gap-10 opacity-60 justify-end">
              <div className="flex flex-col gap-1 border-r-2 border-green/30 pr-4 py-1 text-right">
                <span className="text-[9px] text-navy font-black uppercase tracking-widest">70% PAYOUT</span>
                <span className="text-[7px] text-ash font-bold uppercase tracking-widest">Contractual</span>
              </div>
              <div className="flex flex-col gap-1 border-r-2 border-navy/20 pr-4 py-1 text-right">
                <span className="text-[9px] text-navy font-black uppercase tracking-widest">SHIELD PRO</span>
                <span className="text-[7px] text-ash font-bold uppercase tracking-widest">Asset Care</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none hidden sm:flex">
          <span className="text-[10px] tracking-[6px] text-ash uppercase font-black opacity-40">Scroll to Explore</span>
          <div className="w-[2px] h-20 bg-navy/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-orange" style={{ animation: 'scroll-down 2s infinite' }} />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 02. DASHBOARD STATS BAR                                        */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <div className="bg-void border-y border-navy/10 grid grid-cols-2 lg:grid-cols-4 relative z-20">
        <div className="absolute inset-0 carbon-fiber opacity-[0.01] pointer-events-none" />
        {[
          { to: 638, h: 'TRIPS', label: 'Completed Rides', sub: 'Corporate-Grade', dec: false },
          { to: 11, h: 'UNITS', label: 'Active Fleet', sub: 'In-Circuit', dec: false },
          { to: 4.7, h: 'STARS', label: 'Rating Index', sub: 'Guest Satisfaction', dec: true },
          { to: 100, h: 'PASS', label: 'Audit Score', sub: 'Mechanix Pro Verified', dec: false },
        ].map((s, i) => (
          <div key={i} className={`py-10 lg:py-14 px-6 lg:px-12 text-center group cursor-default border-navy/5 relative overflow-hidden transition-all hover:bg-navy/[0.02] ${(i + 1) % 2 === 0 ? 'lg:border-r-0' : 'border-r'} ${i < 2 ? 'border-b lg:border-b-0' : ''}`}>
            <div className="text-[10px] tracking-[4px] text-ash/40 font-black uppercase mb-4">{s.h}</div>
            <div className="font-display text-5xl lg:text-7xl text-navy mb-3 group-hover:scale-110 group-hover:text-orange transition-all duration-500 flex items-center justify-center gap-2">
              <Counter to={s.to} suffix={i === 2 ? '★' : i === 3 ? '%' : '+'} dec={s.dec} />
            </div>
            <div className="text-[9px] lg:text-[10px] tracking-[3px] text-navy uppercase font-black">{s.label}</div>
            <div className="hidden lg:block text-[7px] text-fog/60 uppercase tracking-[2px] mt-1 font-bold">{s.sub}</div>

            {/* Speedometer Arc Effect */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-32 border-t-2 border-orange/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 03. LIVE TICKER                                                */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <div className="bg-navy border-b border-navy/10 h-11 flex items-center overflow-hidden relative">
        <div className="absolute inset-0 carbon-fiber opacity-10 pointer-events-none" />
        <div className="shrink-0 bg-orange text-void text-[9px] tracking-[4px] uppercase px-6 h-full flex items-center font-black z-10 gap-2 shadow-[20px_0_40px_rgba(0,0,0,0.2)]">
          <span className="w-2 h-2 rounded-full bg-void shadow-[0_0_8px_#fff]" style={{ animation: 'blink 1.5s infinite' }} />LIVE TELEMETRY
        </div>
        <div className="flex ticker-wrap relative z-0">
          {[...TICKER, ...TICKER].map((t, i) => (
            <div key={i} className="flex items-center whitespace-nowrap px-10 text-[10px] tracking-[2px] text-void/60 border-r border-void/5 gap-3 font-mono">{t}</div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 04. PATH 1 — THE REGISTRY MODAL (B2C)                         */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section id="rental" className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-void relative overflow-hidden">
        <div className="absolute right-0 top-0 font-display text-[25vw] text-navy/[.01] pointer-events-none leading-none select-none hidden lg:block uppercase">ENGINE</div>

        <div className="reveal mb-16 md:mb-20 max-w-5xl">
          <div className="text-[10px] tracking-[6px] text-orange uppercase mb-6 flex items-center gap-4 font-black"><span className="w-10 h-px bg-orange shadow-[0_0_8px_rgba(248,147,31,0.5)]" />PATH 01 — PERFORMANCE RENTAL</div>
          <h2 className="font-display text-[clamp(44px,6vw,90px)] leading-[.85] text-navy mb-8">
            THE 8-LINES PROTOCOL:<br />
            <em className="text-orange not-italic">ELITE FLEET. ZERO COMPROMISE.</em>
          </h2>
          <p className="text-[15px] md:text-[16px] leading-[1.8] text-ash max-w-3xl font-medium">
            We are not a peer-to-peer sharing marketplace. 8-Lines Group is a private corporate entity that owns, optimizes, and meticulously maintains every vehicle in our high-performance circuit.
          </p>
        </div>

        {/* 3-Column Feature Grid (Machined Look) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-navy/10 border border-navy/10 mb-20 shadow-premium">
          {[
            {
              icon: <MechanixLogo className="h-10 w-auto" />,
              title: 'MECHANIX PRO CERTIFIED',
              desc: 'Every cylinder, sensor, and safety system undergoes a mandatory 22-point digital diagnostic at our private hub before every rotation.',
              tag: 'Diagnostics'
            },
            {
              icon: '📍',
              title: 'EXECUTIVE DOORSTEP LOGISTICS',
              desc: 'From Kempegowda Intl Airport to the most exclusive Corporate Suites — our logistics team ensures precision-timed delivery.',
              tag: 'Direct Drop'
            },
            {
              icon: '🛡️',
              title: 'CORPORATE-GRADE LIABILITY',
              desc: 'Every journey is backed by 100% Comprehensive Insurance and a legally-binding Digital Service Agreement. We bear the risk.',
              tag: 'Insured 100%'
            },
          ].map((f, i) => (
            <div key={i} className={`reveal delay-${i + 1} bg-void hover:bg-navy/[0.01] transition-all duration-500 p-10 md:p-12 group relative overflow-hidden`}>
              <div className="w-16 h-16 bg-navy/[0.03] border border-navy/5 flex items-center justify-center mb-8 group-hover:border-orange/20 transition-all overflow-hidden p-2">
                {typeof f.icon === 'string' ? <span className="text-3xl">{f.icon}</span> : f.icon}
              </div>
              <div className="text-[9px] tracking-[4px] text-orange uppercase mb-4 font-black">{f.tag}</div>
              <div className="text-[18px] font-black text-navy mb-4 font-display uppercase">{f.title}</div>
              <p className="text-[11px] md:text-[12px] leading-[1.8] text-ash font-medium">{f.desc}</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-[0_0_15px_#F8931F]" />
            </div>
          ))}
        </div>

        {/* Fleet Showcase Header */}
        <div className="reveal flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16 px-2">
          <div>
            <div className="text-[10px] tracking-[6px] text-orange uppercase mb-4 flex items-center gap-4 font-black"><span className="w-10 h-px bg-orange shadow-[0_0_8px_rgba(248,147,31,0.5)]" />THE REGISTRY · SERIES BLR-01</div>
            <h3 className="font-display text-[clamp(36px,5vw,72px)] leading-[.88] text-navy uppercase">
              SELECT YOUR<br /><em className="text-orange not-italic">DRIVING MACHINE.</em>
            </h3>
          </div>
          <Link href="/drive/login" id="browse-fleet-btn"
            className="w-full md:w-auto text-center inline-flex items-center justify-center gap-4 bg-navy text-void text-[10px] tracking-[4px] uppercase px-10 py-4 cut-md hover:bg-orange transition-all font-black shadow-lg">
            VIEW FULL CATALOG →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
          {FLEET.map((car, i) => (
            <Link key={i} href="/drive/login" id={`fleet-card-${i}`}
              className={`reveal delay-${i + 1} bg-void border border-navy/5 hover:border-orange/40 hover:-translate-y-4 shadow-xl hover:shadow-2xl transition-all duration-700 group relative overflow-hidden block cut-lg`}>
              <div className="absolute top-4 left-4 text-[8px] tracking-[3px] text-green border border-green/30 bg-green/5 px-3 py-1.5 z-10 font-black rounded-sm backdrop-blur-md">ACTIVE · CERTIFIED</div>
              <div className="absolute top-4 right-4 text-[8px] tracking-[3px] text-navy border border-navy/10 bg-void/80 px-3 py-1.5 z-10 font-black rounded-sm backdrop-blur-md uppercase">{car.health}% HEALTH</div>

              <div className="h-56 md:h-64 flex items-center justify-center bg-navy/[0.02] relative overflow-hidden border-b border-navy/5">
                <div className="absolute inset-0 carbon-fiber opacity-[0.02] pointer-events-none" />
                <img
                  src={(car as any).image}
                  alt={car.name}
                  className="w-full h-full object-contain p-8 lg:group-hover:scale-110 lg:group-hover:-translate-y-4 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-void to-transparent" />
              </div>

              <div className="p-8">
                <div className="font-display text-2xl md:text-3xl tracking-[1px] text-navy mb-2 group-hover:text-orange transition-colors uppercase font-black">{car.name}</div>
                <div className="text-[11px] tracking-[3px] text-ash mb-2 font-black uppercase">{car.meta}</div>
                <div className="text-[10px] font-mono text-fog mb-8 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" /> {car.reg}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-navy/[0.03] p-3 border-l-2 border-green rounded-sm">
                    <div className="font-display text-xl text-green font-black">{car.rating}★</div>
                    <div className="text-[8px] text-ash font-black uppercase tracking-widest">Guest Index</div>
                  </div>
                  <div className="bg-navy/[0.03] p-3 border-l-2 border-navy/20 rounded-sm">
                    <div className="font-display text-xl text-navy font-black">{car.trips}</div>
                    <div className="text-[8px] text-ash font-black uppercase tracking-widest">Trips Logged</div>
                  </div>
                </div>

                <div className="flex items-baseline justify-between border-t border-navy/10 pt-6">
                  <span className="font-display text-3xl md:text-4xl text-orange font-black drop-shadow-sm">{car.price}</span>
                  <span className="text-[10px] text-ash font-black uppercase tracking-[3px]">/ 24HRS</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-[0_0_15px_#F8931F]" />
            </Link>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 05. PATH 2 — THE MASTER ARBITRAGE (B2B)                       */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section id="invest" className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-void relative overflow-hidden">
        <div className="absolute inset-0 carbon-fiber opacity-[0.01] pointer-events-none" />
        <div className="absolute left-0 top-0 font-display text-[25vw] text-green/[.01] pointer-events-none leading-none select-none hidden lg:block uppercase">ASSET</div>

        {/* Section Header */}
        <div className="reveal mb-20 max-w-5xl">
          <div className="text-[10px] tracking-[6px] text-green uppercase mb-6 flex items-center gap-4 font-black"><span className="w-10 h-px bg-green shadow-[0_0_8px_rgba(34,197,94,0.5)]" />PATH 02 — ASSET OPTIMIZATION</div>
          <h2 className="font-display text-[clamp(44px,6vw,90px)] leading-[.85] text-navy mb-8">
            THE MASTER ARBITRAGE:<br />
            <em className="text-green not-italic">WE OPERATE. YOUR ASSET EARNS.</em>
          </h2>
          <p className="text-[15px] md:text-[16px] leading-[1.8] text-ash max-w-4xl font-medium">
            Navigating the commercial mobility landscape without a professional engine is a liability. Between guest disputes, fluctuating demand, and maintenance lag, your &apos;passive income&apos; becomes a full-time deficit. <strong className="text-navy">8-Lines Group provides the protective corporate shield for your investment.</strong>
          </p>
        </div>

        {/* Us vs Them Table + ROI Slider (Machined Glass) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 mb-32 items-start">

          {/* Comparison Table */}
          <div className="reveal-l">
            <div className="text-[10px] tracking-[5px] text-orange uppercase mb-8 flex items-center gap-5 font-black"><span className="w-10 h-px bg-orange" />8-LINES vs. CONVENTIONAL APPS</div>
            <div className="bg-void border border-navy/10 overflow-hidden shadow-2xl cut-lg">
              <div className="overflow-x-auto">
                <div className="min-w-[500px] lg:min-w-0">
                  <div className="grid grid-cols-3 bg-navy text-void">
                    <div className="p-6 text-[10px] tracking-[3px] uppercase font-black">METRIC</div>
                    <div className="p-6 text-[10px] tracking-[3px] uppercase font-black border-l border-white/10 opacity-60">STANDARD SHARED</div>
                    <div className="p-6 text-[10px] tracking-[3px] uppercase font-black border-l border-white/10 bg-orange/10 text-orange">8-LINES PROTOCOL</div>
                  </div>
                  {COMPARE.map((r, i) => (
                    <div key={i} className="grid grid-cols-3 border-b border-navy/5 hover:bg-navy/[0.02] transition-colors group">
                      <div className="p-6 text-[11px] tracking-[2px] text-navy uppercase font-black group-hover:text-orange transition-colors">{r.f}</div>
                      <div className="p-6 text-[12px] text-ash italic border-l border-navy/5 font-medium leading-relaxed opacity-60">{r.zc}</div>
                      <div className="p-6 text-[12px] text-green border-l border-navy/5 font-black leading-relaxed flex items-start gap-2">
                        <span className="text-sm">✓</span> {r.us}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ROI Slider (Dashboard Style) */}
          <div className="reveal-r">
            <div className="text-[10px] tracking-[5px] text-green uppercase mb-8 flex items-center gap-5 font-black"><span className="w-10 h-px bg-green shadow-[0_0_8px_#22C55E]" />ROI YIELD CALCULATOR</div>
            <div className="relative">
              <div className="absolute -inset-4 bg-green/5 border border-green/10 rounded-xl blur-2xl opacity-50" />
              <div className="relative">
                <ROISlider />
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Protocol Overview */}
        <div className="reveal mb-12">
          <div className="text-[10px] tracking-[6px] text-green uppercase mb-6 flex items-center gap-5 font-black"><span className="w-10 h-px bg-green shadow-[0_0_8px_#22C55E]" />ONBOARDING PROTOCOL</div>
          <h3 className="font-display text-[clamp(40px,5vw,72px)] leading-[.88] text-navy uppercase">4 STAGES TO <em className="text-green not-italic">COMMAND REVENUE.</em></h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-navy/10 border border-navy/10 shadow-premium">
          {[
            { n: '01', icon: '🏎️', t: 'ASSET REGISTRY', d: 'Secure submission of multi-point vehicle data. 256-bit encrypted storage.' },
            { n: '02', icon: '📝', t: 'SERVICE CONTRACT', d: 'Execute the Master Management Agreement via clickwrap timestamping.' },
            { n: '03', icon: '🆔', t: 'KYC CLEARANCE', d: 'Upload PAN & Aadhar identity for payout circuit node verification.' },
            { n: '04', icon: '⚡', t: 'SYSTEM ACTIVATION', d: 'Primary nodes activated. Real-time investor dashboard goes online.' },
          ].map((s, i) => (
            <div key={i} className={`reveal delay-${i + 1} bg-void hover:bg-navy/[0.01] transition-all p-12 md:p-14 relative overflow-hidden group`}>
              <div className="absolute top-2 right-6 font-display text-[70px] md:text-[90px] leading-none text-navy/[0.03] group-hover:text-navy/[0.06] transition-all select-none">{s.n}</div>
              <div className="w-16 h-16 bg-navy/[0.04] border border-navy/5 flex items-center justify-center text-3xl mb-8 group-hover:border-green/30 transition-all rounded-sm">{s.icon}</div>
              <div className="text-[10px] tracking-[4px] text-green uppercase mb-4 font-black">PHASE {s.n}</div>
              <div className="text-[18px] font-black text-navy mb-4 font-display uppercase tracking-wider">{s.t}</div>
              <p className="text-[11px] md:text-[12px] leading-[1.8] text-ash font-medium">{s.d}</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-[0_0_15px_#22C55E]" />
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 06. TESTIMONIALS                                               */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-void">
        <div className="reveal text-center mb-20">
          <div className="text-[10px] tracking-[6px] text-green uppercase mb-6 flex items-center justify-center gap-5 font-black"><span className="w-10 h-px bg-green" />NODES OF CONFIDENCE<span className="w-10 h-px bg-green" /></div>
          <h2 className="font-display text-[clamp(44px,6vw,80px)] text-navy leading-[.9] uppercase">REAL YIELDS. <em className="text-green not-italic">REAL INVESTORS.</em></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-navy/10 border border-navy/10 shadow-premium">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`reveal delay-${i + 1} bg-void hover:bg-navy/[0.01] p-12 md:p-16 transition-all group flex flex-col items-center text-center`}>
              <div className="font-display text-7xl text-navy/5 leading-none mb-4 group-hover:text-navy/10 transition-colors uppercase select-none">&ldquo;</div>
              <p className="text-[13px] md:text-[14px] leading-[1.9] text-ash flex-1 mb-10 italic font-medium">&quot;{t.text}&quot;</p>

              <div className="w-full bg-navy/[0.03] border border-navy/5 p-6 mb-8 rounded-sm">
                <div className="text-[9px] tracking-[4px] text-ash uppercase mb-2 font-black">TOTAL YIELD GENERATED</div>
                <div className="font-display text-3xl text-orange font-black">{t.yield}</div>
                <div className="text-[9px] text-navy/40 uppercase font-black mt-1 tracking-widest">{t.months} ELAPSED</div>
              </div>

              <div>
                <div className="text-[16px] text-navy font-black font-display uppercase tracking-widest leading-none mb-2">{t.name}</div>
                <div className="text-[10px] tracking-[3px] text-green uppercase font-black">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 07. BATTLE-TESTED OPERATIONS — TRUST ANCHOR                    */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 carbon-fiber opacity-10 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(34,197,94,.1),transparent)' }} />

        <div className="reveal text-center mb-20 relative z-10">
          <div className="text-[10px] tracking-[6px] text-green uppercase mb-6 flex items-center justify-center gap-5 font-black"><span className="w-10 h-px bg-green/40" />TRUST ANCHOR<span className="w-10 h-px bg-green/40" /></div>
          <h2 className="font-display text-[clamp(44px,6vw,90px)] leading-[.85] text-void mb-8 uppercase">
            MACHINED<br /><em className="text-green not-italic">LOGISTICS.</em>
          </h2>
          <p className="text-[15px] md:text-[16px] leading-[1.8] text-void/40 max-w-3xl mx-auto font-medium">
            We don&apos;t just architect technology. We run the ground game. The 8-Lines Executive Team has mastered the nuances of high-stakes mobility across Bengaluru.
          </p>
        </div>

        {/* Glowing Metrics Bar */}
        <div className="reveal grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 mb-24 relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          {[
            { num: '638+', label: 'TRIPS CAPTURED', sub: 'Zero Network Disputes' },
            { num: '11+', label: 'ASSETS DEPLOYED', sub: 'Active Hub Verification' },
            { num: '4.7★', label: 'SERVICE INDEX', sub: 'Quality Protocol Pass' },
            { num: '100%', label: 'MAINTENANCE', sub: 'Mechanix Pro Index' },
          ].map((s, i) => (
            <div key={i} className="bg-navy p-10 md:p-14 text-center group hover:bg-white/[0.02] transition-all duration-500">
              <div className="font-display text-5xl md:text-7xl text-green mb-4 group-hover:scale-110 transition-transform font-black drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]">{s.num}</div>
              <div className="text-[11px] md:text-[12px] text-void font-black uppercase tracking-widest mb-2">{s.label}</div>
              <div className="text-[9px] text-void/30 uppercase tracking-[2px] font-bold">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Institutional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5 relative z-10 shadow-2xl">
          {[
            { icon: <MechanixLogo className="h-full w-auto" />, title: 'MECHANIX PRO', desc: 'Compulsory 22-point forensic digital audit before every dispatch.' },
            { icon: '📊', title: 'REAL-TIME LEDGER', desc: 'Real-time trip-by-trip treasury breakdown. Total transparency of funds.' },
            { icon: '📋', title: 'LEGAL协议', desc: 'IP Address, UTC Timestamp, and Device Fingerprint logged on every execution.' },
            { icon: '🔐', title: 'SECURE ACCESS', desc: 'MFA-enabled logins. 256-bit AES encryption for all sensitive asset data.' },
            { icon: '💰', title: 'GUARANTEED SPLIT', desc: 'The 70% yield is contractual, not dynamic. 8-Lines bears all overhead.' },
            { icon: '📁', title: 'ADMIN EXPORTS', desc: 'Automated tax auditing exports. CSV/XLS format optimized for CA review.' },
          ].map((f, i) => (
            <div key={i} className={`reveal delay-${Math.min(i % 3 + 1, 4)} bg-navy hover:bg-white/[0.03] transition-all duration-500 p-12 md:p-14 group relative overflow-hidden border border-transparent hover:border-green/20`}>
              <div className="w-16 h-16 border border-white/5 bg-white/[0.02] flex items-center justify-center mb-8 group-hover:border-green/40 transition-all overflow-hidden p-2">
                {typeof f.icon === 'string' ? <span className="text-3xl group-hover:scale-110 transition-transform">{f.icon}</span> : f.icon}
              </div>
              <div className="text-[18px] font-black text-void mb-4 font-display uppercase tracking-widest">{f.title}</div>
              <p className="text-[12px] leading-[1.8] text-void/30 font-medium">{f.desc}</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-[0_0_15px_#22C55E]" />
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* 08. FINAL CTA — CORPORATE CALLBACK                             */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-40 px-6 md:px-12 lg:px-20 bg-void relative overflow-hidden">
        <div className="absolute inset-0 carbon-fiber opacity-[0.01] pointer-events-none" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 font-display text-[35vw] text-orange/[0.01] pointer-events-none leading-none select-none hidden lg:block uppercase font-black">8L</div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start max-w-7xl mx-auto">
          {/* Left — Big CTA Copy */}
          <div className="reveal-l">
            <div className="text-[10px] tracking-[6px] text-orange uppercase mb-4 md:mb-8 flex items-center gap-5 font-black"><span className="w-10 h-px bg-orange" />ENTERPRISE NODES</div>
            <h2 className="font-display text-[clamp(44px,6vw,90px)] leading-[.85] text-navy mb-8 uppercase">
              ACTIVATE<br />
              <em className="text-orange not-italic">8-LINES</em><br />
              IN YOUR HUB.
            </h2>
            <p className="text-[15px] md:text-[16px] leading-[1.8] text-ash mb-10 font-medium">
              Join the network of elite IT Parks, Five-Star Destinations, and Corporate Campuses. Consult directly with our <strong className="text-navy">Executive Director of Logistics</strong> for custom fleet engineering.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {[
                'Custom Node Pricing', 'Dedicated Terminal Support', 'Fleet Engineering', 'Institutional CA Exports'
              ].map(pt => (
                <div key={pt} className="flex items-center gap-4 text-[12px] text-navy font-black uppercase tracking-wider bg-navy/[0.02] p-4 border-l-4 border-orange rounded-sm">
                  <span className="text-orange font-black">●</span> {pt}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/investor/login" id="deploy-footer-cta"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-6 bg-navy text-void text-[11px] tracking-[5px] uppercase px-12 py-5 cut-md font-black hover:bg-green hover:shadow-[0_20px_60px_rgba(34,197,94,0.3)] transition-all shadow-xl">
                DEPLOY CAPITAL →
              </Link>
              <Link href="/drive/login" id="book-footer-cta"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-6 border-4 border-navy text-navy text-[11px] tracking-[5px] uppercase px-12 py-5 cut-md hover:bg-navy/5 transition-all font-black">
                BOOK DRIVE →
              </Link>
            </div>
          </div>

          {/* Right — Callback Form (Machined Case) */}
          <div className="reveal-r w-full lg:w-auto">
            <div className="text-[11px] tracking-[5px] text-ash uppercase mb-6 font-black text-center lg:text-left">TERMINAL REQUEST: CALLBACK</div>
            <div className="bg-void border border-navy/10 overflow-hidden shadow-2xl cut-lg relative">
              <div className="absolute inset-0 carbon-fiber opacity-[0.02] pointer-events-none" />
              <div className="bg-navy text-void px-8 py-6 flex items-center justify-between border-b border-white/10 relative z-10">
                <div>
                  <div className="text-[11px] tracking-[4px] font-display uppercase font-black">SHAIK AFNAN SABIL</div>
                  <div className="text-[9px] text-void/40 mt-1 uppercase tracking-[2px] font-black">DIRECTOR OF NODE ACQUISITIONS</div>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-green font-black tracking-widest bg-green/10 px-4 py-2 rounded-sm border border-green/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-green shadow-[0_0_8px_#22C55E]" style={{ animation: 'blink 2s infinite' }} />ONLINE
                </div>
              </div>
              <div className="p-8 relative z-10">
                <CallbackForm />
                <div className="flex items-center justify-center gap-3 mt-8">
                  <span className="h-px w-6 bg-navy/5" />
                  <p className="text-[9px] text-fog uppercase font-black tracking-[4px]">SLA: 180 MINUTES</p>
                  <span className="h-px w-6 bg-navy/5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
