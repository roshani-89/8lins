'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

const FLEET = [
  {
    id:'v1', emoji:'🚙', name:'THAR ROXX', tag:'Premium 4WD SUV',
    meta:'Mahindra · 2024 · Diesel · 4WD · 5 Seats',
    reg:'KA04 XX0001', trips:142, rating:'4.9', health:98,
    price:3499, weekend:4499,
    features:['4-Wheel Drive','Sunroof','Apple CarPlay','6 Airbags','360° Camera'],
    status:'available',
  },
  {
    id:'v2', emoji:'🚗', name:'XUV 300', tag:'Corporate Compact SUV',
    meta:'Mahindra · 2023 · Petrol · AWD · 5 Seats',
    reg:'KA04 ND5967', trips:198, rating:'4.8', health:95,
    price:2799, weekend:3499,
    features:['AWD','Sunroof','Android Auto','7 Airbags','Cruise Control'],
    status:'available',
  },
  {
    id:'v3', emoji:'🚐', name:'KIA CARENS', tag:'7-Seater Family MPV',
    meta:'Kia · 2024 · Diesel · FWD · 7 Seats',
    reg:'KA05 XX0023', trips:167, rating:'4.7', health:96,
    price:2499, weekend:3299,
    features:['7 Seats','Panoramic Sunroof','ADAS','Wireless Charging','Ventilated Seats'],
    status:'available',
  },
  {
    id:'v4', emoji:'🚘', name:'NISSAN MAGNITE', tag:'Turbo City Crossover',
    meta:'Nissan · 2023 · Petrol Turbo · FWD · 5 Seats',
    reg:'KA01 XX0089', trips:131, rating:'4.6', health:92,
    price:1999, weekend:2599,
    features:['Turbo Engine','360° Camera','Wireless CarPlay','Ambient Lighting','TPMS'],
    status:'audit_pending',
  },
]

const TIME_SLOTS = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00']

function BookingModal({car, onClose}:{car:typeof FLEET[0], onClose:()=>void}) {
  const [startDate, setStartDate] = useState('')
  const [endDate,   setEndDate]   = useState('')
  const [pickupTime, setPickupTime] = useState('09:00')
  const [name,  setName]  = useState('')
  const [phone, setPhone] = useState('')
  const [busy,  setBusy]  = useState(false)

  const days = startDate && endDate
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000))
    : 0
  const total = days * car.price

  const submit = async () => {
    if (!startDate||!endDate||!name||!phone) { toast.error('Fill all fields'); return }
    if (!/^[6-9]\d{9}$/.test(phone)) { toast.error('Valid 10-digit mobile required'); return }
    setBusy(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success(`✓ Booking request for ${car.name} submitted! We'll confirm via SMS.`)
    setBusy(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-void/90 backdrop-blur-md" />
      <div className="relative z-10 w-full max-w-lg bg-void border border-navy/10 overflow-hidden shadow-2xl" onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div className="bg-navy/5 border-b border-navy/10 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="font-display text-xl text-navy tracking-[2px]">{car.name}</div>
            <div className="text-[9px] text-ash font-bold">{car.meta}</div>
          </div>
          <button onClick={onClose} className="text-fog hover:text-red transition-colors text-xl">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] tracking-[3px] text-fog uppercase block mb-2">Pickup Date</label>
              <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-obsidian border border-green/12 px-3 py-3 text-[12px] text-pearl font-mono outline-none focus:border-green/50 transition-all" />
            </div>
            <div>
              <label className="text-[8px] tracking-[3px] text-fog uppercase block mb-2">Return Date</label>
              <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                className="w-full bg-obsidian border border-green/12 px-3 py-3 text-[12px] text-pearl font-mono outline-none focus:border-green/50 transition-all" />
            </div>
          </div>

          {/* Pickup Time */}
          <div>
            <label className="text-[8px] tracking-[3px] text-fog uppercase block mb-2">Pickup Time</label>
            <select value={pickupTime} onChange={e=>setPickupTime(e.target.value)}
              className="w-full bg-obsidian border border-green/12 px-3 py-3 text-[12px] text-pearl font-mono outline-none focus:border-green/50 transition-all">
              {TIME_SLOTS.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Guest Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Full Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="As on DL"
                className="w-full bg-void border border-navy/12 px-3 py-3 text-[12px] text-navy font-mono placeholder:text-navy/20 outline-none focus:border-green transition-all" />
            </div>
            <div>
              <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Mobile</label>
              <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="9XXXXXXXXX" maxLength={10} type="tel"
                className="w-full bg-void border border-navy/12 px-3 py-3 text-[12px] text-navy font-mono placeholder:text-navy/20 outline-none focus:border-green transition-all" />
            </div>
          </div>

          {/* Price Summary */}
          {days > 0 && (
            <div className="bg-navy/5 border border-navy/10 p-4">
              <div className="flex justify-between items-center text-[11px] mb-2">
                <span className="text-ash font-bold">₹{car.price.toLocaleString('en-IN')} × {days} day{days>1?'s':''}</span>
                <span className="text-navy font-bold">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-ash font-medium">Hub delivery included</span>
                <span className="text-green text-[9px] font-bold">✓ FREE</span>
              </div>
              <div className="border-t border-navy/10 mt-3 pt-3 flex justify-between items-center">
                <span className="text-[9px] tracking-[2px] text-ash uppercase font-bold">Total</span>
                <span className="font-display text-2xl text-navy">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

          <button onClick={submit} disabled={busy}
            className="w-full bg-green text-void text-[10px] tracking-[4px] uppercase py-4 font-medium transition-all hover:bg-green-dim hover:shadow-[0_0_40px_rgba(248,147,31,.4)] disabled:opacity-60 relative overflow-hidden group">
            <span className="relative z-10">{busy ? 'Confirming...' : 'CONFIRM BOOKING REQUEST →'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
          <p className="text-[9px] text-fog text-center">Our team will call to confirm within 30 mins. Doorstep delivery included.</p>
        </div>
      </div>
    </div>
  )
}

export default function FleetPage() {
  const [selected, setSelected] = useState<typeof FLEET[0]|null>(null)
  const [filter, setFilter]     = useState('all')

  const filtered = filter === 'all' ? FLEET : FLEET.filter(c => c.status === filter)

  return (
    <main>
      <Navbar />
      <div className="pt-[68px]">

        {/* HERO */}
        <section className="py-20 px-20 bg-void relative overflow-hidden transition-all">
          <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 60% at 30% 50%,rgba(12,29,54,.03),transparent)'}} />
          <div className="absolute right-0 top-0 font-display text-[20vw] text-navy/[.01] pointer-events-none leading-none select-none">FLEET</div>
          <div className="reveal relative">
            <div className="text-[8px] tracking-[5px] text-orange uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-orange" />Fleet Registry // BLR-01</div>
            <h1 className="font-display text-[clamp(48px,6vw,88px)] leading-[.9] text-navy mb-6">BOOK A<br/><em className="text-orange not-italic">PREMIUM DRIVE.</em></h1>
            <p className="text-[13px] leading-[1.9] text-ash max-w-xl mb-10 font-medium">Every vehicle in the 8-Lines fleet is MECHANIX PRO certified before every dispatch. Doorstep delivery across Bengaluru. Executive-grade only.</p>

            {/* Filters */}
            <div className="flex gap-3">
              {[{v:'all',l:'All Vehicles'},{v:'available',l:'Available Now'},{v:'audit_pending',l:'Coming Soon'}].map(f=>(
                <button key={f.v} onClick={()=>setFilter(f.v)}
                  className={`text-[8px] tracking-[3px] uppercase px-5 py-2.5 border transition-all font-bold ${filter===f.v?'bg-navy text-void border-navy shadow-lg shadow-navy/10':'border-navy/10 text-ash hover:border-navy/30 hover:text-navy'}`}>
                  {f.l}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="bg-abyss border-y border-navy/5 grid grid-cols-4">
          {[
            {val:'100%',label:'MECHANIX PRO Certified'},
            {val:'638+',label:'Trips Completed'},
            {val:'4.8★',label:'Average Guest Rating'},
            {val:'₹0', label:'Hidden Charges'},
          ].map((s,i)=>(
            <div key={i} className={`py-5 px-8 text-center ${i<3?'border-r border-navy/5':''}`}>
              <div className="font-display text-3xl text-navy mb-1">{s.val}</div>
              <div className="text-[8px] tracking-[2px] text-ash uppercase font-bold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FLEET GRID */}
        <section className="py-16 px-20 bg-void">
          <div className="grid grid-cols-2 gap-8">
            {filtered.map((car,i)=>(
              <div key={car.id} className={`reveal delay-${i%2+1} bg-void border border-navy/5 hover:border-navy/20 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(12,29,54,.06)] transition-all duration-500 group relative overflow-hidden`}>

                {/* Status badge */}
                <div className={`absolute top-4 left-4 z-10 text-[7px] tracking-[2px] uppercase px-3 py-1.5 border font-bold ${car.status==='available'?'text-orange border-orange/40 bg-white/90':'text-amber border-amber/40 bg-white/90'}`}>
                  {car.status==='available'?'● AVAILABLE':'○ AUDIT PENDING'}
                </div>

                {/* Health badge */}
                <div className="absolute top-4 right-4 z-10 text-[7px] tracking-[2px] text-navy border border-navy/10 px-2 py-1 bg-white/90 font-bold">
                  HEALTH {car.health}%
                </div>

                {/* Car visual */}
                <div className="h-56 flex items-center justify-center bg-abyss relative overflow-hidden border-b border-navy/5">
                  <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"/>
                  <span className="text-8xl group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 relative z-10">{car.emoji}</span>
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-abyss to-transparent" />
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="font-display text-2xl tracking-[2px] text-navy mb-1">{car.name}</div>
                      <div className="text-[9px] tracking-[1px] text-orange mb-1 font-bold">{car.tag}</div>
                      <div className="text-[9px] text-ash font-medium">{car.meta}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-3xl text-navy">₹{car.price.toLocaleString('en-IN')}</div>
                      <div className="text-[8px] text-ash font-bold">/ day</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {car.features.map(f=>(
                      <span key={f} className="text-[8px] tracking-[1px] text-ash border border-navy/10 px-2 py-1 bg-navy/[.02] font-semibold">{f}</span>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-5 mb-6 border-t border-navy/5 pt-5">
                    <div><div className="font-display text-xl text-orange">{car.rating}★</div><div className="text-[8px] text-ash font-bold">Rating</div></div>
                    <div><div className="font-display text-xl text-navy">{car.trips}</div><div className="text-[8px] text-ash font-bold">Trips</div></div>
                    <div><div className="font-display text-xl text-orange">{car.health}%</div><div className="text-[8px] text-ash font-bold">Health</div></div>
                    <div className="ml-auto text-right">
                      <div className="text-[9px] text-ash font-bold">Weekend</div>
                      <div className="font-display text-lg text-navy">₹{car.weekend.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  {/* Reg */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-[9px] font-mono text-ash border border-navy/10 px-3 py-1 bg-white/50">{car.reg}</div>
                    <div className="text-[8px] text-orange flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse"/>MECHANIX CERTIFIED
                    </div>
                  </div>

                  <button
                    disabled={car.status !== 'available'}
                    onClick={()=>car.status==='available'&&setSelected(car)}
                    className={`w-full text-[9px] tracking-[3px] uppercase py-4 font-bold transition-all relative overflow-hidden group/btn
                      ${car.status==='available'
                        ? 'bg-orange text-void hover:bg-orange-dim hover:shadow-[0_0_40px_rgba(248,147,31,.2)]'
                        : 'bg-obsidian text-ash cursor-not-allowed opacity-50'}`}>
                    {car.status==='available' ? 'BOOK THIS VEHICLE →' : 'AUDIT IN PROGRESS — COMING SOON'}
                    {car.status==='available' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"/>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* B2B LEASING CTA */}
        <section className="py-20 px-20 bg-abyss border-y border-navy/5">
          <div className="reveal flex items-center justify-between">
            <div>
              <div className="text-[8px] tracking-[5px] text-green uppercase mb-3 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green"/>Corporate Leasing</div>
              <h2 className="font-display text-[clamp(28px,3vw,48px)] text-navy leading-tight">NEED 5+ VEHICLES?<br/><em className="text-green not-italic">WE DO B2B.</em></h2>
            </div>
            <div className="text-right max-w-md">
              <p className="text-[12px] leading-[1.9] text-ash mb-6 font-medium">Dedicated fleet for corporate events, employee transport, or long-term executive leasing. Custom SLAs, dedicated account manager.</p>
              <a href="/about#contact" className="inline-flex items-center gap-3 bg-green text-void text-[9px] tracking-[3px] uppercase px-8 py-4 font-bold transition-all hover:shadow-[0_0_40px_rgba(248,147,31,.2)]">
                GET CORPORATE QUOTE →
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {selected && <BookingModal car={selected} onClose={()=>setSelected(null)} />}
    </main>
  )
}
