'use client'
import { useEffect, useState, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { publicAPI } from '@/lib/api'

/* ── Reveal Animations ─────────────────────────── */
function useReveal() {
  useEffect(() => {
    const handler = () => {
      document.querySelectorAll('.rv:not(.in), .rv-l:not(.in), .rv-r:not(.in)').forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.9) el.classList.add('in')
      })
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}

/* ── Live Ticker Numbers ─────────────────────────── */
function CountUp({ target, prefix = '', suffix = '' }: { target: number, prefix?: string, suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      let start = 0
      const step = target / 60
      const t = setInterval(() => {
        start = Math.min(start + step, target)
        setVal(Math.round(start))
        if (start >= target) clearInterval(t)
      }, 16)
      obs.disconnect()
    })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>
}

/* ── ROI Calculator ────────────────────────────── */
function ROICalc() {
  const [asset, setAsset] = useState(1500000)
  const [days, setDays] = useState(18)
  const gross = Math.round(asset * 0.0025 * days)
  const fee   = Math.round(gross * 0.30)
  const mech  = Math.round(gross * 0.05)
  const net   = gross - fee - mech
  const annual = net * 12
  const roi   = Math.round((annual / asset) * 100)
  const roiColor = roi >= 24 ? '#22C55E' : roi >= 18 ? '#F8931F' : '#64748B'

  return (
    <div className="relative">
      {/* Glow orb */}
      <div className="absolute -inset-10 bg-orange/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="relative bg-white border border-navy/5 shadow-[0_40px_80px_-20px_rgba(12,29,54,0.15)] overflow-hidden" style={{clipPath:'polygon(20px 0,100% 0,100% calc(100% - 20px),calc(100% - 20px) 100%,0 100%,0 20px)'}}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-navy border-b-0 relative">
          <div>
            <div className="text-[9px] tracking-[5px] text-orange uppercase font-black mb-1">LIVE CALCULATOR</div>
            <div className="font-display text-xl text-white uppercase tracking-widest">YIELD PREDICTOR</div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-sm">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            <span className="text-[10px] text-white font-black tracking-[3px] uppercase">LIVE</span>
          </div>
        </div>

        {/* Sliders */}
        <div className="p-8 space-y-8 border-b border-navy/5 bg-navy/[0.01]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] tracking-[4px] text-navy/40 uppercase font-black">Asset Value</span>
              <span className="font-display text-3xl text-navy">₹{asset.toLocaleString('en-IN')}</span>
            </div>
            <div className="relative h-2 bg-navy/5 rounded-full">
              <div className="absolute h-full bg-gradient-to-r from-orange/50 to-orange rounded-full transition-all" style={{width:`${((asset-500000)/(3000000-500000))*100}%`}} />
            </div>
            <input type="range" min={500000} max={3000000} step={50000} value={asset}
              onChange={e => setAsset(+e.target.value)} className="w-full opacity-0 absolute cursor-pointer" style={{marginTop:'-8px',height:'16px'}} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] tracking-[4px] text-navy/40 uppercase font-black">Deployment Days / Month</span>
              <span className="font-display text-3xl text-navy">{days} <span className="text-[14px] text-navy/40">days</span></span>
            </div>
            <div className="relative h-2 bg-navy/5 rounded-full">
              <div className="absolute h-full bg-gradient-to-r from-orange/50 to-orange rounded-full transition-all" style={{width:`${((days-8)/(28-8))*100}%`}} />
            </div>
            <input type="range" min={8} max={28} step={1} value={days}
              onChange={e => setDays(+e.target.value)} className="w-full opacity-0 absolute cursor-pointer" style={{marginTop:'-8px',height:'16px'}} />
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 divide-x divide-y divide-navy/5 border-b border-navy/5">
          {[
            {l:'Gross Revenue', v:`₹${gross.toLocaleString('en-IN')}`, c:'text-navy'},
            {l:'Platform Fee (30%)', v:`−₹${fee.toLocaleString('en-IN')}`, c:'text-navy/30'},
            {l:'Mechanix Reserve', v:`−₹${mech.toLocaleString('en-IN')}`, c:'text-navy/30'},
            {l:'YOUR NET PROFIT', v:`₹${net.toLocaleString('en-IN')}`, c:'text-green font-black'},
          ].map(r => (
            <div key={r.l} className="p-6 bg-white hover:bg-navy/[0.01] transition-colors group">
              <div className="text-[9px] text-navy/30 mb-2 uppercase tracking-[3px] font-black">{r.l}</div>
              <div className={`font-display text-2xl ${r.c} group-hover:scale-105 transition-transform origin-left`}>{r.v}</div>
            </div>
          ))}
        </div>

        {/* Annual Result */}
        <div className="p-8 bg-navy flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="text-[9px] tracking-[4px] text-white/30 uppercase font-black mb-2">Annualised Net Yield</div>
            <div className="font-display text-5xl text-white tracking-tight">₹{annual.toLocaleString('en-IN')}</div>
          </div>
          <div className="text-center sm:text-right">
            <div className="font-display text-7xl font-black" style={{color: roiColor, textShadow:`0 0 40px ${roiColor}40`}}>{roi}%</div>
            <div className="text-[9px] tracking-[4px] text-white/30 uppercase font-black mt-1">NET ROI / YEAR</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Stats Strip ──────────────────────────────── */
const STATS = [
  {n:'₹4.82L', l:'Avg. Annual Yield'},
  {n:'92%',    l:'Fleet Utilisation'},
  {n:'70/30',  l:'Guaranteed Split'},
  {n:'22pt',   l:'Pre-Trip Audit'},
  {n:'24hrs',  l:'OTP-Secured Access'},
]

/* ── Comparison Table ──────────────────────────── */
const COMPARE = [
  {f:'Revenue Cut',     t:'~60% + hidden fees',    u:'70% NET — Contractual'},
  {f:'Maintenance',     t:"Owner's burden",         u:'MECHANIX PRO Covered'},
  {f:'GPS Tracking',   t:'₹499/mo extra',          u:'₹0 — Platform Included'},
  {f:'Guest Liability', t:'Host absorbs loss',      u:'Direct lease, zero risk'},
  {f:'Financial Ledger',t:'Opaque & delayed',       u:'Real-time trip-by-trip'},
  {f:'Tax Export',      t:'Not provided',           u:'1-Click CA-ready Excel'},
  {f:'Legal Agreement', t:'Generic T&Cs',           u:'Audit-logged MAMA'},
]

/* ── Contact Schema ───────────────────────────── */
const schema = z.object({
  name:    z.string().min(2, 'Name required'),
  phone:   z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit number'),
  email:   z.string().email('Valid email required'),
  vehicle: z.string().min(2, 'Vehicle details required'),
})

/* ═══════════════════════════════════════════════ */
/*  PAGE                                           */
/* ═══════════════════════════════════════════════ */
export default function InvestorPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(schema) })
  useReveal()

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      await publicAPI.submitLead({ ...data, message: 'Investor Enquiry' })
      toast.success('Protocol interest logged. Our team will reach out within 24 hours.')
      reset()
    } catch {
      toast.error('Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-white min-h-screen selection:bg-orange/20">
      <style>{`
        .rv   { opacity:0; transform:translateY(40px);  transition:all 0.9s cubic-bezier(0.16,1,0.3,1); }
        .rv-l { opacity:0; transform:translateX(-40px); transition:all 0.9s cubic-bezier(0.16,1,0.3,1); }
        .rv-r { opacity:0; transform:translateX(40px);  transition:all 0.9s cubic-bezier(0.16,1,0.3,1); }
        .rv.in,.rv-l.in,.rv-r.in { opacity:1; transform:none; }
        .rv-d1 { transition-delay: 0.1s; }
        .rv-d2 { transition-delay: 0.2s; }
        .rv-d3 { transition-delay: 0.3s; }
        .rv-d4 { transition-delay: 0.4s; }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .ticker-inner { animation:ticker 22s linear infinite; }
        @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .float-slow { animation:float-slow 6s ease-in-out infinite; }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .shimmer-text {
          background: linear-gradient(90deg, #0C1D36 0%, #F8931F 40%, #22C55E 60%, #0C1D36 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        input[type='range'] { -webkit-appearance:none; appearance:none; background:transparent; height:20px; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance:none; width:22px; height:22px; background:#F8931F; border-radius:4px; cursor:pointer; box-shadow:0 0 12px rgba(248,147,31,0.5); }
      `}</style>

      <Navbar theme="light" />

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-navy">
        {/* Animated background grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        {/* Orange glow top right */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-orange/10 blur-[150px] rounded-full pointer-events-none" />
        {/* Green glow bottom left */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="rv-l">
              <div className="flex items-center gap-4 mb-10">
                <div className="flex items-center gap-2 bg-green/10 border border-green/20 px-4 py-2 rounded-sm">
                  <span className="w-2 h-2 rounded-full bg-green animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  <span className="text-[10px] tracking-[4px] text-green uppercase font-black">PHASE IV OPEN</span>
                </div>
                <span className="text-[10px] tracking-[3px] text-white/20 uppercase font-black">Bengaluru Hub Alpha</span>
              </div>

              <h1 className="font-display text-[clamp(60px,9vw,130px)] leading-[0.85] text-white mb-6 uppercase">
                YOUR CAR.<br/>
                <span className="text-orange">PASSIVE</span><br/>
                <span style={{WebkitTextStroke: '1px rgba(255,255,255,0.2)', color:'transparent'}}>INCOME.</span>
              </h1>

              <p className="text-[15px] md:text-[17px] text-white/40 font-medium leading-relaxed max-w-lg mb-12 uppercase tracking-wider">
                India&apos;s most transparent vehicle monetisation protocol. Contractually locked 70% net yield. Zero hidden fees.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/investor/onboard" className="group relative overflow-hidden bg-orange text-white px-10 py-5 font-display text-xl tracking-[4px] uppercase font-black transition-all hover:shadow-[0_0_40px_rgba(248,147,31,0.4)] metallic-shine" style={{clipPath:'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)'}}>
                  DEPLOY ASSET →
                </Link>
                <a href="#calc" className="border border-white/10 text-white/60 px-10 py-5 font-display text-xl tracking-[4px] uppercase font-black hover:border-white/30 hover:text-white transition-all" style={{clipPath:'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)'}}>
                  YIELD CALC
                </a>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-px mt-14 border border-white/5 overflow-hidden" style={{clipPath:'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)'}}>
                {[{n:'70%',l:'Net Yield Split'},{n:'₹4.8L',l:'Avg. Annual'},{n:'92%',l:'Utilisation'}].map(s=>(
                  <div key={s.l} className="bg-white/[0.03] p-5 text-center border-r border-white/5 last:border-0 hover:bg-white/[0.06] transition-colors">
                    <div className="font-display text-3xl text-orange mb-1">{s.n}</div>
                    <div className="text-[9px] text-white/30 uppercase tracking-[3px] font-black">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — ROI Calc preview card */}
            <div className="rv-r float-slow">
              <ROICalc />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce">
          <span className="text-[9px] tracking-[4px] text-white/20 uppercase font-black">SCROLL</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ── LIVE TICKER ─────────────────────────── */}
      <div className="bg-orange overflow-hidden py-3.5 border-y border-orange/20">
        <div className="ticker-inner flex whitespace-nowrap">
          {[...Array(8)].map((_,i) => (
            <div key={i} className="flex items-center gap-8 mx-6 shrink-0">
              <span className="text-[11px] tracking-[4px] text-white/70 font-black uppercase">DEPLOYMENT PROTOCOL ACTIVE</span>
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
              <span className="text-[11px] tracking-[4px] text-white font-black uppercase">FORTUNEER 4x4 · ₹42.5K NET</span>
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
              <span className="text-[11px] tracking-[4px] text-white/70 font-black uppercase">THAR ROXX · ₹38.2K NET</span>
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* ── PERFORMANCE STATS ────────────────────── */}
      <section className="bg-white py-20 md:py-28 px-6 md:px-10 border-b border-navy/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-navy/5 border border-navy/5 overflow-hidden" style={{clipPath:'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)'}}>
            {STATS.map((s, i) => (
              <div key={s.l} className={`rv rv-d${Math.min(i+1,4)} bg-white p-8 md:p-10 text-center hover:bg-navy hover:text-white group transition-all duration-500 cursor-default`}>
                <div className="font-display text-4xl md:text-5xl text-navy group-hover:text-orange mb-3 transition-colors">{s.n}</div>
                <div className="text-[9px] tracking-[3px] text-navy/30 group-hover:text-white/40 uppercase font-black transition-colors">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (4 Steps) ───────────────── */}
      <section className="bg-navy py-24 md:py-40 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:`radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,backgroundSize:'40px 40px'}} />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="rv text-center mb-20">
            <div className="text-[10px] tracking-[8px] text-orange uppercase font-black mb-6">ONBOARDING PROTOCOL</div>
            <h2 className="font-display text-[clamp(44px,6vw,90px)] text-white leading-none uppercase">
              4 STEPS TO<br/><span className="text-green">PASSIVE YIELD.</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {n:'01', icon:'🚗', t:'Asset Registry',      d:'Submit vehicle RC, insurance & details to the 8-Lines encrypted vault.', c:'border-orange/20'},
              {n:'02', icon:'🔍', t:'22-Point Verification', d:'Our Mechanix Pro team conducts a certified digital audit at Hub Alpha.', c:'border-green/20'},
              {n:'03', icon:'📋', t:'Digital Agreement',    d:'One-click MAMA execution with IP-timestamped audit logging.', c:'border-orange/20'},
              {n:'04', icon:'💰', t:'Node Activation',      d:'Your car goes live. Earn institutional-grade 70% net yield from day one.', c:'border-green/20'},
            ].map((s, i) => (
              <div key={s.n} className={`rv rv-d${i+1} group relative p-8 border ${s.c} bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-500 hover:-translate-y-2`} style={{clipPath:'polygon(15px 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%,0 15px)'}}>
                <div className="absolute top-4 right-5 font-display text-8xl text-white/[0.03] group-hover:text-white/[0.06] transition-colors select-none">{s.n}</div>
                <div className="text-4xl mb-8">{s.icon}</div>
                <div className="text-[10px] tracking-[4px] text-orange uppercase font-black mb-3">STEP {s.n}</div>
                <div className="font-display text-2xl text-white uppercase mb-4 leading-tight">{s.t}</div>
                <p className="text-[13px] text-white/30 font-medium leading-relaxed">{s.d}</p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI CALCULATOR (Full) ─────────────────── */}
      <section id="calc" className="bg-white py-24 md:py-40 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-orange/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="rv text-center mb-20">
            <div className="text-[10px] tracking-[8px] text-orange uppercase font-black mb-6">ROI ARCHITECTURE</div>
            <h2 className="font-display text-[clamp(44px,6vw,90px)] text-navy leading-none uppercase">
              PROJECT YOUR<br/><span className="text-green">NET YIELD.</span>
            </h2>
            <p className="text-[14px] text-navy/40 mt-6 max-w-xl mx-auto uppercase tracking-wider font-medium">Adjust the sliders below. See exactly how much 70% feels like — in real rupees.</p>
          </div>
          <div className="max-w-3xl mx-auto rv">
            <ROICalc />
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────── */}
      <section className="bg-white py-24 md:py-32 px-6 md:px-10 border-t border-navy/5">
        <div className="max-w-7xl mx-auto">
          <div className="rv mb-16">
            <div className="text-[10px] tracking-[8px] text-orange uppercase font-black mb-6 flex items-center gap-5">
              <span className="w-12 h-px bg-orange/30" /> BENCHMARK COMPARISON
            </div>
            <h2 className="font-display text-[clamp(40px,5vw,80px)] text-navy leading-none uppercase">
              WHY 8-LINES<br/><span className="text-green">HITS DIFFERENT.</span>
            </h2>
          </div>

          <div className="rv overflow-hidden border border-navy/5 shadow-[0_20px_60px_-10px_rgba(12,29,54,0.08)]" style={{clipPath:'polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px)'}}>
            {/* Table Head */}
            <div className="grid grid-cols-3 bg-navy">
              <div className="px-8 py-5 text-[10px] tracking-[3px] text-white/30 uppercase font-black">Feature</div>
              <div className="px-8 py-5 text-[10px] tracking-[3px] text-white/30 uppercase font-black border-l border-white/5">Traditional Rental</div>
              <div className="px-8 py-5 text-[10px] tracking-[3px] text-green uppercase font-black border-l border-white/5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                8-LINES INSTITUTIONAL
              </div>
            </div>
            {/* Rows */}
            {COMPARE.map((c, i) => (
              <div key={c.f} className={`grid grid-cols-3 border-t border-navy/5 group hover:bg-orange/[0.02] transition-colors ${i%2===0?'bg-white':'bg-navy/[0.01]'}`}>
                <div className="px-8 py-5 text-[12px] text-navy font-black uppercase tracking-tight">{c.f}</div>
                <div className="px-8 py-5 text-[12px] text-navy/30 font-medium border-l border-navy/5">{c.t}</div>
                <div className="px-8 py-5 border-l border-navy/5 flex items-center gap-3">
                  <div className="w-5 h-5 rounded-sm bg-green/10 flex items-center justify-center shrink-0">
                    <span className="text-green text-[10px] font-black">✓</span>
                  </div>
                  <span className="text-[12px] text-navy font-black">{c.u}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MECHANIX PRO ──────────────────────────── */}
      <section className="bg-navy py-24 md:py-40 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{backgroundImage:`radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,backgroundSize:'30px 30px'}} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[500px] bg-green/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="rv-l">
            <div className="text-[10px] tracking-[8px] text-green uppercase font-black mb-8 flex items-center gap-5">
              <span className="w-12 h-px bg-green/40" /> ASSET PROTECTION
            </div>
            <h2 className="font-display text-[clamp(40px,5vw,80px)] text-white leading-[0.9] uppercase mb-10">
              THE <span className="text-green">MECHANIX PRO</span> ADVANTAGE.
            </h2>
            <p className="text-[15px] text-white/40 mb-12 font-medium leading-relaxed max-w-xl uppercase tracking-wider">
              We don&apos;t just rent your car — we protect it using Bengaluru&apos;s most rigorous digital audit protocol. Your asset is our asset.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-12">
              {[
                {t:'22-POINT AUDIT',   d:'Certified pre-trip inspection'},
                {t:'OBD SCANNING',     d:'Real-time ECU health tracking'},
                {t:'FOS STERILIZATION',d:'Hospital-grade interior cleaning'},
                {t:'WEAR ANALYTICS',   d:'AI-predicted tyre & brake life'},
              ].map(a => (
                <div key={a.t} className="border border-white/5 p-5 hover:border-green/20 transition-colors group" style={{clipPath:'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)'}}>
                  <div className="text-[10px] text-green font-black tracking-[3px] uppercase mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-green rounded-full" /> {a.t}
                  </div>
                  <p className="text-[11px] text-white/25 font-medium">{a.d}</p>
                </div>
              ))}
            </div>
            <Link href="/investor/onboard" className="inline-flex items-center gap-4 bg-green text-white px-10 py-5 font-display text-lg tracking-[4px] uppercase font-black hover:bg-green/90 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]" style={{clipPath:'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)'}}>
              START DEPLOYMENT →
            </Link>
          </div>

          <div className="rv-r relative">
            <div className="absolute -inset-10 bg-green/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative bg-white/[0.04] border border-white/10 p-8 md:p-10" style={{clipPath:'polygon(20px 0,100% 0,100% calc(100% - 20px),calc(100% - 20px) 100%,0 100%,0 20px)'}}>
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 bg-green/10 border border-green/20 flex items-center justify-center font-display text-3xl text-green">22</div>
                <div>
                  <div className="text-[11px] tracking-[4px] text-white uppercase font-black mb-1">Audit Protocol v4.0</div>
                  <div className="text-[9px] tracking-[3px] text-green uppercase font-black">ZERO-DEFECT CERTIFIED</div>
                </div>
              </div>
              <div className="space-y-3">
                {['Engine Bay Index', 'Tyre Tread Depth (>4mm)', 'Brake Fluid Water %', 'OBD Fault Reading', 'AC System Pressure', 'Interior Air Quality'].map((l,i) => (
                  <div key={l} className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0 hover:bg-white/5 px-3 transition-colors group">
                    <span className="text-[12px] text-white/40 font-black uppercase tracking-tight group-hover:text-white/60 transition-colors">{l}</span>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-20 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green rounded-full" style={{width:`${85+i*2}%`}} />
                      </div>
                      <span className="text-[10px] text-green font-black tracking-[3px] uppercase">OK</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENQUIRY CTA + FORM ────────────────────── */}
      <section id="form" className="bg-white py-24 md:py-40 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
            
            {/* Left Info */}
            <div className="rv-l lg:sticky lg:top-32">
              <div className="text-[10px] tracking-[8px] text-orange uppercase font-black mb-8 flex items-center gap-5">
                <span className="w-12 h-px bg-orange/30" /> BEGIN PROTOCOL
              </div>
              <h2 className="font-display text-[clamp(40px,5vw,80px)] text-navy leading-[0.9] uppercase mb-10">
                REGISTER<br/><span className="text-orange">YOUR ASSET.</span>
              </h2>
              <p className="text-[14px] text-navy/40 font-medium leading-relaxed mb-10 uppercase tracking-wider">
                Submit your interest. Our investment team will schedule a hub visit and deploy your vehicle within 72 hours of verification.
              </p>
              
              {/* Trust badges */}
              <div className="space-y-4">
                {[
                  {i:'🔐', t:'Section 10A Compliant', d:'Audit-logged digital execution'},
                  {i:'💵', t:'Guaranteed 70/30 Split', d:'Contractually protected payout'},
                  {i:'📡', t:'Real-time Dashboard', d:'Live fleet & revenue tracking'},
                ].map(b => (
                  <div key={b.t} className="flex items-center gap-5 p-5 border border-navy/5 hover:border-orange/20 hover:bg-orange/[0.02] transition-all group" style={{clipPath:'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)'}}>
                    <span className="text-2xl">{b.i}</span>
                    <div>
                      <div className="text-[11px] text-navy font-black uppercase tracking-[2px]">{b.t}</div>
                      <div className="text-[10px] text-navy/30 font-medium">{b.d}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Urgency */}
              <div className="mt-10 p-6 bg-orange/5 border border-orange/20" style={{clipPath:'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)'}}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
                  <span className="text-[10px] tracking-[4px] text-orange uppercase font-black">Phase IV — Limited Slots</span>
                </div>
                <p className="text-[12px] text-navy/50 font-medium">Currently accepting applications for Bengaluru South. Priority given to 7-seater SUVs.</p>
              </div>
            </div>

            {/* Right — Form */}
            <div className="rv-r">
              <div className="bg-navy p-8 md:p-12 shadow-[0_40px_80px_-20px_rgba(12,29,54,0.3)] relative overflow-hidden" style={{clipPath:'polygon(20px 0,100% 0,100% calc(100% - 20px),calc(100% - 20px) 100%,0 100%,0 20px)'}}>
                <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{backgroundImage:`radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,backgroundSize:'30px 30px'}} />
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange/10 blur-[60px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 mb-8">
                  <div className="text-[9px] tracking-[4px] text-white/20 uppercase font-black mb-3">// SECURE PROTOCOL FORM</div>
                  <div className="font-display text-3xl text-white uppercase">Asset Enquiry</div>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[9px] tracking-[4px] text-white/30 uppercase block mb-2 font-black">Full Name</label>
                      <input {...register('name')} placeholder="Legal Name"
                        className="w-full bg-white/5 border border-white/10 px-5 py-4 text-[13px] text-white font-bold placeholder:text-white/15 outline-none focus:border-orange/50 transition-all font-mono" />
                      {errors.name && <span className="text-orange text-[10px] font-black mt-1.5 block">{errors.name.message as string}</span>}
                    </div>
                    <div>
                      <label className="text-[9px] tracking-[4px] text-white/30 uppercase block mb-2 font-black">Mobile Number</label>
                      <input {...register('phone')} placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-white/5 border border-white/10 px-5 py-4 text-[13px] text-white font-bold placeholder:text-white/15 outline-none focus:border-orange/50 transition-all font-mono" />
                      {errors.phone && <span className="text-orange text-[10px] font-black mt-1.5 block">{errors.phone.message as string}</span>}
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] tracking-[4px] text-white/30 uppercase block mb-2 font-black">Email Address</label>
                    <input {...register('email')} placeholder="you@example.com"
                      className="w-full bg-white/5 border border-white/10 px-5 py-4 text-[13px] text-white font-bold placeholder:text-white/15 outline-none focus:border-orange/50 transition-all font-mono" />
                    {errors.email && <span className="text-orange text-[10px] font-black mt-1.5 block">{errors.email.message as string}</span>}
                  </div>

                  <div>
                    <label className="text-[9px] tracking-[4px] text-white/30 uppercase block mb-2 font-black">Vehicle Model & Year</label>
                    <input {...register('vehicle')} placeholder="e.g. 2022 Mahindra Thar 4x4"
                      className="w-full bg-white/5 border border-white/10 px-5 py-4 text-[13px] text-white font-bold placeholder:text-white/15 outline-none focus:border-orange/50 transition-all font-mono" />
                    {errors.vehicle && <span className="text-orange text-[10px] font-black mt-1.5 block">{errors.vehicle.message as string}</span>}
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/5">
                    <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-orange shrink-0" />
                    <p className="text-[10px] text-white/25 leading-relaxed font-medium uppercase tracking-wider">
                      I consent to being contacted for deployment protocol. Data is stored encrypted under 256-bit AES vault.
                    </p>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-orange text-white py-5 font-display text-2xl tracking-[5px] uppercase font-black hover:bg-orange/90 hover:shadow-[0_0_40px_rgba(248,147,31,0.3)] transition-all disabled:opacity-50 group" style={{clipPath:'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)'}}>
                    <span className="inline-flex items-center gap-4">
                      {loading ? 'INITIALIZING...' : 'SUBMIT ENQUIRY →'}
                    </span>
                  </button>
                </form>
              </div>

              {/* Or — Full Onboard Link */}
              <div className="mt-6 text-center">
                <p className="text-[11px] text-navy/30 font-bold uppercase tracking-widest mb-4">Ready to deploy now?</p>
                <Link href="/investor/onboard" className="inline-flex items-center gap-3 text-orange font-black text-[12px] tracking-[4px] uppercase border-b border-orange/20 pb-1 hover:border-orange transition-colors">
                  Complete Onboarding →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BIG CTA ──────────────────────────────── */}
      <section className="bg-navy py-24 md:py-32 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{backgroundImage:`radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,backgroundSize:'50px 50px'}} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="font-display text-[30vw] text-white/[0.02] select-none uppercase font-black leading-none">70%</div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center rv">
          <div className="text-[10px] tracking-[10px] text-orange uppercase font-black mb-8">FINAL HANDSHAKE</div>
          <h2 className="font-display text-[clamp(54px,10vw,140px)] text-white leading-[0.85] uppercase mb-12">
            READY TO<br/><span className="text-orange">DEPLOY?</span>
          </h2>
          <p className="text-[14px] text-white/30 max-w-xl mx-auto mb-14 font-medium uppercase tracking-widest">
            Bengaluru South is live. Drop your car in, earn 18-24% net ROI. It&apos;s that simple.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/investor/onboard" className="bg-orange text-white px-14 py-6 font-display text-2xl tracking-[6px] uppercase font-black hover:shadow-[0_0_50px_rgba(248,147,31,0.4)] hover:bg-orange/90 transition-all" style={{clipPath:'polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)'}}>
              START ONBOARDING →
            </Link>
            <a href="#calc" className="border border-white/10 text-white/60 px-14 py-6 font-display text-2xl tracking-[6px] uppercase font-black hover:border-white/30 hover:text-white transition-all" style={{clipPath:'polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)'}}>
              CALCULATE ROI
            </a>
          </div>
          <p className="text-[10px] text-white/15 mt-10 font-black uppercase tracking-[5px]">// Verified institutional protocol · Est. 18–24% net annual ROI</p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
