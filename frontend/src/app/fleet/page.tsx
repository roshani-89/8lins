'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

const FLEET = [
  {
    id:'v1', image:'/images/thar_roxx.png', name:'THAR ROXX', tag:'Premium 4WD SUV',
    meta:'Mahindra · 2024 · Diesel · 4WD · 5 Seats',
    reg:'KA04 XX0001', trips:142, rating:'4.9', health:98,
    price:3499, weekend:4499,
    features:['4-Wheel Drive','Sunroof','Apple CarPlay','6 Airbags','360° Camera'],
    status:'available',
  },
  {
    id:'v2', image:'/images/xuv300.png', name:'XUV 300', tag:'Corporate Compact SUV',
    meta:'Mahindra · 2023 · Petrol · AWD · 5 Seats',
    reg:'KA04 ND5967', trips:198, rating:'4.8', health:95,
    price:2799, weekend:3499,
    features:['AWD','Sunroof','Android Auto','7 Airbags','Cruise Control'],
    status:'available',
  },
  {
    id:'v3', image:'/images/kia_carens.png', name:'KIA CARENS', tag:'7-Seater Family MPV',
    meta:'Kia · 2024 · Diesel · FWD · 7 Seats',
    reg:'KA05 XX0023', trips:167, rating:'4.7', health:96,
    price:2499, weekend:3299,
    features:['7 Seats','Panoramic Sunroof','ADAS','Wireless Charging','Ventilated Seats'],
    status:'available',
  },
  {
    id:'v4', image:'/images/nissan_magnite.png', name:'NISSAN MAGNITE', tag:'Turbo City Crossover',
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
      <div className="relative z-10 w-full max-w-lg bg-void border border-navy/10 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col" onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div className="bg-navy/5 border-b border-navy/10 px-5 md:px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="font-display text-lg md:text-xl text-navy tracking-[2px] uppercase">Reserve {car.name}</div>
            <div className="text-[8px] md:text-[9px] text-ash font-bold uppercase tracking-wider">{car.meta}</div>
          </div>
          <button onClick={onClose} className="text-fog hover:text-red transition-colors text-xl p-2">✕</button>
        </div>

        <div className="p-5 md:p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[8px] tracking-[3px] text-fog uppercase block mb-2 font-bold">Pickup Date</label>
              <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-void border border-navy/12 px-3 py-3 text-[12px] text-navy font-mono outline-none focus:border-orange transition-all" />
            </div>
            <div>
              <label className="text-[8px] tracking-[3px] text-fog uppercase block mb-2 font-bold">Return Date</label>
              <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                className="w-full bg-void border border-navy/12 px-3 py-3 text-[12px] text-navy font-mono outline-none focus:border-orange transition-all" />
            </div>
          </div>

          {/* Pickup Time */}
          <div>
            <label className="text-[8px] tracking-[3px] text-fog uppercase block mb-2 font-bold">Arrival Slot</label>
            <select value={pickupTime} onChange={e=>setPickupTime(e.target.value)}
              className="w-full bg-void border border-navy/12 px-3 py-3 text-[12px] text-navy font-mono outline-none focus:border-orange transition-all">
              {TIME_SLOTS.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Guest Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Full Legal Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="As per DL"
                className="w-full bg-void border border-navy/12 px-3 py-3 text-[12px] text-navy font-mono placeholder:text-navy/20 outline-none focus:border-orange transition-all" />
            </div>
            <div>
              <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Mobile Number</label>
              <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="9XXXXXXXXX" maxLength={10} type="tel"
                className="w-full bg-void border border-navy/12 px-3 py-3 text-[12px] text-navy font-mono placeholder:text-navy/20 outline-none focus:border-orange transition-all" />
            </div>
          </div>

          {/* Price Summary */}
          {days > 0 && (
            <div className="bg-navy/5 border border-navy/10 p-4 space-y-2">
              <div className="flex justify-between items-center text-[10px] md:text-[11px]">
                <span className="text-ash font-bold uppercase tracking-wide">₹{car.price.toLocaleString('en-IN')} × {days} day{days>1?'s':''}</span>
                <span className="text-navy font-bold">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[8px] md:text-[9px] text-ash font-bold uppercase tracking-wider">Hub delivery & Insurance</span>
                <span className="text-green text-[9px] font-black tracking-widest">INCLUDED</span>
              </div>
              <div className="border-t border-navy/10 mt-3 pt-3 flex justify-between items-center">
                <span className="text-[9px] tracking-[2px] text-navy uppercase font-black">Gross Total</span>
                <span className="font-display text-2xl md:text-3xl text-orange">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button onClick={submit} disabled={busy}
              className="w-full bg-orange text-void text-[10px] tracking-[4px] uppercase py-5 font-bold transition-all hover:bg-orange-dim hover:shadow-[0_0_40px_rgba(248,147,31,.4)] disabled:opacity-60 relative overflow-hidden group cut-md">
              <span className="relative z-10">{busy ? 'Confirming...' : 'CONFIRM RESERVATION →'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            <p className="text-[8px] md:text-[9px] text-fog text-center font-medium uppercase tracking-[1px]">Our operations team will call to confirm within 30 minutes.</p>
          </div>
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
        <section className="py-24 md:py-40 px-6 md:px-20 bg-void relative overflow-hidden">
          <div className="absolute inset-0 carbon-fiber opacity-[0.02] pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 60% at 30% 50%,rgba(248,147,31,0.05),transparent)'}} />
          <div className="absolute right-0 top-0 font-display text-[25vw] text-navy/[0.01] pointer-events-none leading-none select-none hidden lg:block uppercase font-black">REGISTRY</div>
          
          <div className="reveal relative text-center md:text-left max-w-5xl mx-auto md:mx-0">
            <div className="text-[10px] tracking-[6px] text-orange uppercase mb-8 flex items-center justify-center md:justify-start gap-5 font-black"><span className="w-12 h-px bg-orange shadow-[0_0_8px_rgba(248,147,31,0.5)]" />SERIES BLR-01 // ACTIVE NODES</div>
            <h1 className="font-display text-[clamp(54px,9vw,130px)] leading-[0.82] text-navy mb-10 uppercase animate-float">
              COMMAND THE<br/><em className="text-orange not-italic">PREMIUM CIRCUIT.</em>
            </h1>
            <p className="text-[14px] md:text-[16px] leading-[1.8] text-ash max-w-xl mb-14 font-medium mx-auto md:mx-0">
              Bengaluru&apos;s most meticulously engineered corporate fleet. Every unit is private-owned and hub-maintained. No peer-to-peer compromise.
            </p>

            {/* Filters */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
              {[{v:'all',l:'All Units'},{v:'available',l:'Available Now'},{v:'audit_pending',l:'In Maintenance'}].map(f=>(
                <button key={f.v} onClick={()=>setFilter(f.v)}
                  className={`text-[9px] tracking-[4px] uppercase px-6 md:px-8 py-3.5 md:py-4 border-2 transition-all font-black cut-md ${filter===f.v?'bg-navy text-void border-navy shadow-2xl':'border-navy/10 text-ash hover:border-navy/30 hover:text-navy group'}`}>
                  {f.l}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* STATS BAR (Machined) */}
        <div className="bg-void border-y border-navy/10 grid grid-cols-2 lg:grid-cols-4 relative z-20">
          <div className="absolute inset-0 carbon-fiber opacity-[0.01] pointer-events-none" />
          {[
            {val:'100%',label:'HUB AUDITED', sub:'Mechanix Pro Certified'},
            {val:'638+',label:'TRIPS CAPTURED', sub:'Corporate Service Log'},
            {val:'4.8★',label:'GUEST RATING', sub:'Professional Standard'},
            {val:'₹0', label:'UNEXPECTED FEES', sub:'100% Transparency'},
          ].map((s,i)=>(
            <div key={i} className={`py-10 lg:py-14 px-6 lg:px-10 text-center border-navy/5 group hover:bg-navy/[0.01] transition-all duration-500 ${(i+1)%2===0 ? 'lg:border-r-0' : 'border-r'} ${i<2 ? 'border-b lg:border-b-0' : ''}`}>
              <div className="font-display text-4xl lg:text-5xl text-navy mb-2 group-hover:scale-110 group-hover:text-orange transition-all duration-500">{s.val}</div>
              <div className="text-[9px] lg:text-[10px] tracking-[3px] text-navy uppercase font-black">{s.label}</div>
              <div className="hidden lg:block text-[7px] text-fog/60 uppercase tracking-[2px] mt-1 font-bold">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* FLEET GRID */}
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-void relative">
          <div className="absolute inset-0 carbon-fiber opacity-[0.01] pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 max-w-[1440px] mx-auto">
            {filtered.map((car,i)=>(
              <div key={car.id} className={`reveal delay-${i%2+1} bg-void border border-navy/10 hover:border-orange/30 hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(12,29,54,0.08)] transition-all duration-700 group relative overflow-hidden cut-lg shadow-xl`}>

                {/* Status badge */}
                <div className={`absolute top-8 left-8 z-10 text-[9px] tracking-[4px] uppercase px-5 py-2.5 border-2 font-black backdrop-blur-md rounded-sm ${car.status==='available'?'text-green border-green/30 bg-green/5':'text-amber border-amber/30 bg-amber/5'}`}>
                  {car.status==='available'?'● ACTIVE UNIT':'○ AUDIT PENDING'}
                </div>

                {/* Health badge */}
                <div className="absolute top-8 right-8 z-10 text-[9px] tracking-[4px] text-navy border border-navy/10 px-4 py-2.5 bg-void/80 backdrop-blur-md font-black rounded-sm uppercase">
                  NODE HEALTH {car.health}%
                </div>

                {/* Car visual */}
                <div className="h-72 md:h-80 flex items-center justify-center bg-navy/[0.02] relative overflow-hidden border-b border-navy/10">
                  <div className="absolute inset-0 carbon-fiber opacity-[0.03] pointer-events-none" />
                  <img 
                    src={(car as any).image} 
                    alt={car.name} 
                    className="w-full h-full object-contain p-10 group-hover:scale-110 group-hover:-translate-y-4 transition-transform duration-700 relative z-10" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-void to-transparent opacity-60" />
                </div>

                <div className="p-10 md:p-12">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-10">
                    <div>
                      <div className="font-display text-4xl md:text-5xl tracking-[1px] text-navy mb-3 group-hover:text-orange transition-colors uppercase font-black">{car.name}</div>
                      <div className="text-[11px] tracking-[5px] text-orange mb-3 font-black uppercase flex items-center gap-3"><span className="w-6 h-px bg-orange"/>{car.tag}</div>
                      <div className="text-[11px] text-ash font-black uppercase tracking-widest bg-navy/[0.03] px-3 py-1.5 w-fit rounded-sm">{car.meta}</div>
                    </div>
                    <div className="sm:text-right">
                      <div className="font-display text-5xl text-navy font-black drop-shadow-sm">₹{car.price.toLocaleString('en-IN')}</div>
                      <div className="text-[11px] text-ash font-black uppercase tracking-[4px] mt-1">/ 24 HOUR CYCLE</div>
                    </div>
                  </div>

                  {/* Features (Technical List) */}
                  <div className="flex flex-wrap gap-2.5 mb-10">
                    {car.features.map(f=>(
                      <span key={f} className="text-[10px] tracking-[3px] text-navy border border-navy/10 px-4 py-2 bg-navy/[.02] font-black uppercase group-hover:bg-navy group-hover:text-void transition-all duration-300">{f}</span>
                    ))}
                  </div>

                  {/* Stats row (The Dashboard) */}
                  <div className="grid grid-cols-3 gap-8 mb-10 border-y border-navy/10 py-10 relative">
                    <div className="absolute inset-0 carbon-fiber opacity-[0.01] pointer-events-none" />
                    <div><div className="font-display text-3xl text-green font-black">{car.rating}★</div><div className="text-[10px] text-ash font-black uppercase tracking-widest mt-1">Guest Index</div></div>
                    <div><div className="font-display text-3xl text-navy font-black">{car.trips}</div><div className="text-[10px] text-ash font-black uppercase tracking-widest mt-1">Trips Logged</div></div>
                    <div><div className="font-display text-3xl text-orange font-black">{car.health}%</div><div className="text-[10px] text-ash font-black uppercase tracking-widest mt-1">Mechanical</div></div>
                  </div>

                  <button
                    disabled={car.status !== 'available'}
                    onClick={()=>car.status==='available'&&setSelected(car)}
                    className={`w-full text-[12px] tracking-[6px] uppercase py-6 font-black transition-all relative overflow-hidden group/btn cut-lg shadow-xl
                      ${car.status==='available'
                        ? 'bg-navy text-void hover:bg-orange hover:shadow-[0_20px_40px_rgba(248,147,31,0.3)]'
                        : 'bg-navy/10 text-ash cursor-not-allowed opacity-50'}`}>
                    <span className="relative z-10">{car.status==='available' ? 'IGNITE RESERVATION →' : 'SYSTEM AUDIT IN PROGRESS'}</span>
                    {car.status==='available' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"/>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* B2B LEASING CTA (Carbon) */}
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-navy relative overflow-hidden">
          <div className="absolute inset-0 carbon-fiber opacity-10 pointer-events-none" />
          <div className="absolute inset-0" style={{background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(34,197,94,0.1),transparent)'}} />
          
          <div className="reveal flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10 max-w-7xl mx-auto">
            <div className="max-w-xl text-center lg:text-left">
              <div className="text-[10px] tracking-[6px] text-green uppercase mb-6 flex items-center justify-center lg:justify-start gap-5 font-black"><span className="w-12 h-px bg-green shadow-[0_0_8px_rgba(34,197,94,0.5)]"/>CORPORATE LOGISTICS</div>
              <h2 className="font-display text-[clamp(44px,5vw,80px)] text-void leading-[0.85] uppercase mb-8">
                BULK FLEET<br/><em className="text-green not-italic">INTEGRATION.</em>
              </h2>
              <p className="text-[14px] md:text-[16px] leading-[1.8] text-void/40 font-medium">
                Need a dedicated node for your Enterprise? IT Parks, Five-Star Stays, and Corporate Campuses get exclusive access to unified fleet management and white-label logistics.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-void/5 border border-white/10 p-8 rounded-sm backdrop-blur-md">
                <div className="text-green font-display text-4xl mb-2 font-black">72HR SLA</div>
                <div className="text-[10px] text-void/60 uppercase tracking-[4px] font-black">Rapid Deployment Priority</div>
              </div>
              <a href="/about#contact" className="w-full text-center inline-flex items-center justify-center gap-6 bg-green text-void text-[11px] tracking-[5px] uppercase px-12 py-6 font-black transition-all hover:bg-green-dim hover:shadow-[0_20px_60px_rgba(34,197,94,0.3)] cut-md shadow-2xl">
                REQUEST CORPORATE QUOTE →
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
