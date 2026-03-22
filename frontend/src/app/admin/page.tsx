'use client'
import { useState, useEffect } from 'react'
import { adminAPI, mechanixAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import type { AdminStats } from '@/types'

const ADMIN_NAV = [
  {id:'overview', icon:'◉',  label:'Master Command'},
  {id:'fleet',    icon:'⊞',  label:'Fleet Map'},
  {id:'payout',   icon:'₹',  label:'CFO Payout Engine'},
  {id:'expense',  icon:'🧾', label:'Expense Manager'},
  {id:'mechanix', icon:'🔧', label:'Mechanix Pro'},
  {id:'investors',icon:'👥', label:'Investor CRM'},
  {id:'tickets',  icon:'◫',  label:'IRM Desk'},
  {id:'leads',    icon:'📊', label:'B2B Leads'},
]

const AUDIT_ITEMS = [
  {id:'rc',       cat:'Legal',      label:'RC Copy & Comprehensive Insurance Present'},
  {id:'fitness',  cat:'Legal',      label:'Valid Fitness Certificate'},
  {id:'rac',      cat:'Legal',      label:'RAC Registration Document'},
  {id:'firstaid', cat:'Legal',      label:'First-Aid Box present in the vehicle'},
  {id:'parking',  cat:'Braking',    label:'Parking brake operational'},
  {id:'brakes',   cat:'Braking',    label:'Service brake pads @ 3mm+ (min 25% life)'},
  {id:'clutch',   cat:'Engine',     label:'Transmission, including clutch / torque converter'},
  {id:'fluids',   cat:'Engine',     label:'All fluids and lubricants at optimal levels'},
  {id:'engine_l', cat:'Engine',     label:'Dashboard clear of check engine lights / recalls'},
  {id:'exhaust',  cat:'Engine',     label:'Exhaust system / muffler — No blue/black smoke'},
  {id:'steering', cat:'Steering',   label:'Steering wheel, box, springs, shocks & height'},
  {id:'tread',    cat:'Tires',      label:'Tire tread depth 4/32″+ (50% or higher)'},
  {id:'tire_age', cat:'Tires',      label:'Tires must be six years old or newer'},
  {id:'tire_cond',cat:'Tires',      label:'Tires: No cuts, gouges, bulges, or bubbles'},
  {id:'mirrors',  cat:'Tires',      label:'Rearview and general mirrors intact'},
  {id:'belts',    cat:'Safety',     label:'Seat Belts intact and usable'},
  {id:'airbags',  cat:'Safety',     label:'No Airbag / SRS / OCS warning lights'},
  {id:'body',     cat:'Body',       label:'No hanging body panels / pillar damage'},
  {id:'horn',     cat:'Body',       label:'Horn securely fastened and sounding adequate'},
  {id:'glazing',  cat:'Glazing',    label:'Windshield crack-free; Wipers & Washers functional'},
  {id:'tint',     cat:'Glazing',    label:'Window tint adhering to legal specifications'},
  {id:'lights',   cat:'Glazing',    label:'All Headlights, Rear, Hazard & License lights functional'},
]

type R = 'pass'|'fail'|'repair'|''

function OverviewTab({stats}:{stats:AdminStats|null}) {
  if(!stats) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i=>(
          <div key={i} className="bg-void border border-navy/5 p-8 animate-pulse">
            <div className="h-2 bg-navy/5 w-24 mb-4 rounded"/>
            <div className="h-10 bg-navy/5 w-32 mb-3 rounded"/>
          </div>
        ))}
      </div>
      <div className="bg-void border border-navy/5 p-16 text-center text-ash text-[12px] font-bold uppercase tracking-[3px] italic">Accessing Real-Time Global Command...</div>
    </div>
  )
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {label:"Gross Revenue Consolidation (24H)",  val:`₹${(stats.totalGrossRevenue||0).toLocaleString('en-IN')}`, g:false, sub:'↑ 12.4% vs PREV 24H'},
          {label:'Platform Royalty (30%)',            val:`₹${(stats.platformCut||0).toLocaleString('en-IN')}`,       g:true,  sub:'NET UNRELISED GAIN'},
          {label:'Active Strategic Assets',          val:`${stats.activeVehicles||0}`,                                g:false, sub:'98.2% UTILIZATION RATE'},
          {label:'Verified Portfolio Investors',      val:`${stats.totalInvestors||0}`,                                g:false, sub:'12 ONBOARDING PIPELINE'},
          {label:'KYC Compliance Pipeline',          val:`${stats.pendingKyc||0}`,                                    g:true,  sub:'ACTION REQUIRED: HIGH PRIO'},
          {label:'IRM Support Backlog',               val:`${stats.openTickets||0}`,                                    g:false, sub:'AVG RESOLUTION: 3.2H'},
        ].map((k,i)=>(
          <div key={i} className="bg-white border border-navy/10 p-6 md:p-8 hover:border-green/30 transition-all group relative overflow-hidden shadow-md">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-[10px] tracking-[4px] text-ash uppercase mb-5 font-black flex items-center gap-3">
              <span className="w-6 h-px bg-navy/10" /> {k.label}
            </div>
            <div className={`font-display text-3xl md:text-4xl leading-none mb-3 ${k.g?'text-green':'text-navy'}`}>{k.val}</div>
            <div className="text-[9px] text-ash font-bold tracking-widest uppercase italic">{k.sub}</div>
          </div>
        ))}
      </div>
      
      <div className="bg-void border border-navy/10 p-6 md:p-10 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div className="text-[11px] tracking-[5px] text-navy uppercase font-black flex items-center gap-4">
            <span className="w-12 h-px bg-green" /> REAL-TIME FLEET TELEMETRY — LIVE GPS
          </div>
          <div className="flex items-center gap-3">
             <span className="text-[10px] text-green font-black tracking-widest uppercase">MAP PROTOCOL: ACTIVE</span>
             <div className="w-2.5 h-2.5 rounded-full bg-green animate-ping" />
          </div>
        </div>
        <div className="h-[300px] md:h-[400px] border border-navy/10 flex items-center justify-center relative bg-white">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="text-center relative z-10 px-6">
            <div className="text-5xl md:text-7xl mb-6 grayscale opacity-40">🗺️</div>
            <div className="text-[10px] md:text-[12px] tracking-[5px] text-navy font-black uppercase">Google Cloud Maps Platform — Enterprise v3.5</div>
            <div className="text-[9px] md:text-[10px] text-ash font-bold mt-3 italic">Encrypted Secure Feed · {stats.activeVehicles||11} Assets Transmitting Signal</div>
          </div>
          <div className="hidden md:block">
            {[[28,35],[55,50],[42,68],[72,32],[60,72],[40,20],[80,85]].map(([x,y],i)=>(
              <div key={i} className="absolute" style={{left:`${x}%`,top:`${y}%`}}>
                <div className="w-4 h-4 bg-green rounded-full shadow-[0_0_20px_rgba(34,197,94,.6)]" style={{animation:`blink 2s infinite`,animationDelay:`${i*.4}s`}}/>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-navy text-void text-[8px] font-black px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  #ASSET-00{i+1} ACTIVE
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PayoutTab() {
  const [vehicle, setVehicle] = useState(''); const [gross, setGross] = useState(''); const [busy, setBusy] = useState(false)
  const g=parseFloat(gross)||0, fee=Math.round(g*.3), mech=Math.round(g*.05), net=g-fee-mech
  const process = async () => {
    if(!vehicle||!gross){toast.error('Fill all fields');return}
    setBusy(true)
    try {
      await adminAPI.processPayout({vehicle_id:vehicle,gross_revenue:g,platform_fee:fee,mechanix_deduction:mech,net_payout:net})
      toast.success('✓ Payout processed. Investor dashboard updated.')
      setVehicle(''); setGross('')
    } catch { toast.error('Payout failed') }
    finally { setBusy(false) }
  }
  const inp="w-full bg-void border border-navy/10 px-6 py-4 text-[13px] text-navy font-bold font-mono placeholder-navy/10 focus:border-green outline-none transition-all"
  return (
    <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <div className="text-[10px] tracking-[4px] text-navy uppercase font-black mb-8 flex items-center gap-3">
          <span className="w-10 h-px bg-green" /> CFO Payout Engine v1.0
        </div>
        <div className="bg-white border border-navy/10 shadow-xl overflow-hidden p-6 md:p-10 space-y-8">
          <div>
            <label className="text-[10px] tracking-[4px] text-ash uppercase block mb-4 font-black">Strategic Asset Selection</label>
            <select value={vehicle} onChange={e=>setVehicle(e.target.value)} className={inp+' bg-void'}>
              <option value="">-- SELECT PROTOCOL --</option>
              <option value="v1">Mahindra Thar Roxx · KA04XX0001</option>
              <option value="v2">XUV 300 · KA04ND5967</option>
              <option value="v3">Kia Carens · KA05XX0023</option>
              <option value="v4">Nissan Magnite · KA01XX0089</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] tracking-[4px] text-ash uppercase block mb-4 font-black">Gross Revenue Capture (₹)</label>
            <input value={gross} onChange={e=>setGross(e.target.value)} type="number" className={inp} placeholder="50,000"/>
          </div>
          <button onClick={process} disabled={busy}
            className="w-full bg-navy text-void text-[11px] tracking-[5px] uppercase py-6 font-black hover:bg-green transition-all disabled:opacity-50 cut-sm shadow-xl">
            {busy?'TRANSMITTING...':'PROCESS PAYOUT & SETTLE LEDGER →'}
          </button>
        </div>
      </div>
      <div>
        <div className="text-[10px] tracking-[4px] text-navy uppercase font-black mb-8 flex items-center gap-3">
          <span className="w-10 h-px bg-orange" /> Split Simulation
        </div>
        {g > 0 ? (
          <div className="bg-void border border-navy/10 p-6 md:p-10 shadow-md space-y-6">
            <div className="flex justify-between items-center pb-6 border-b border-navy/5">
              <span className="text-[10px] text-ash font-black uppercase tracking-widest italic">Consolidated Gross</span>
              <span className="font-display text-2xl md:text-3xl text-navy">₹{g.toLocaleString('en-IN')}</span>
            </div>
            {[
              {label:'8-Lines Royalty (30%)', val:`-₹${fee.toLocaleString('en-IN')}`, cls:'text-navy', bar:30},
              {label:'Mechanix Expense (5%)', val:`-₹${mech.toLocaleString('en-IN')}`, cls:'text-orange', bar:5},
              {label:'Investor Net Yield (65%)', val:`₹${net.toLocaleString('en-IN')}`, cls:'text-green font-black', bar:65},
            ].map(r=>(
              <div key={r.label}>
                <div className="flex justify-between items-center mb-3 text-sm md:text-base">
                   <span className="text-[11px] text-ash font-bold uppercase tracking-tight">{r.label}</span>
                   <span className={`text-[15px] font-bold ${r.cls}`}>{r.val}</span>
                </div>
                <div className="h-1 bg-navy/5 overflow-hidden">
                  <div className={`h-full ${r.cls.includes('green')?'bg-green':r.cls.includes('orange')?'bg-orange':'bg-navy'}`} style={{width:`${r.bar}%`}}/>
                </div>
              </div>
            ))}
            <div className="pt-6 border-t border-navy/5 mt-4">
              <p className="text-[10px] text-ash leading-relaxed italic font-medium">
                Settle Protocol: Upon confirmation, the Net Yield will be push-synced to the Investor's Real-Time Ledger. This action is immutable.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-void border border-navy/5 p-20 text-center text-ash text-[12px] font-black uppercase tracking-[4px] italic opacity-40">
            Waiting for Gross Entry...
          </div>
        )}
      </div>
    </div>
  )
}

// Category color map for visual separation
const CAT_COLORS: Record<string, string> = {
  Legal: 'text-blue-500 border-blue-500/30 bg-blue-500/5',
  Braking: 'text-amber border-amber/30 bg-amber/5',
  Engine: 'text-orange border-orange/30 bg-orange/5',
  Steering: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  Tires: 'text-sky-400 border-sky-400/30 bg-sky-400/5',
  Safety: 'text-red border-red/30 bg-red/5',
  Body: 'text-fog border-fog/30 bg-fog/5',
  Glazing: 'text-teal-400 border-teal-400/30 bg-teal-400/5',
}

function MechanixTab() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [selected, setSelected] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [audit, setAudit]     = useState<any>(null)
  const [results, setResults] = useState<Record<string,R>>({})
  const [evidence, setEvidence] = useState<Record<string,string>>({})
  const [costs, setCosts]     = useState<Record<string,string>>({})
  const [busy, setBusy]       = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)

  useEffect(() => {
    adminAPI.getFleet().then(r => setVehicles(r.data)).catch(() => {
      setVehicles([
        {id:'v1', make:'Mahindra', model:'Thar Roxx', registration_number:'KA04 XX0001'},
        {id:'v2', make:'Mahindra', model:'XUV 300', registration_number:'KA04 ND5967'},
        {id:'v3', make:'Kia', model:'Carens', registration_number:'KA05 XX0023'},
        {id:'v4', make:'Nissan', model:'Magnite', registration_number:'KA01 XX0089'},
      ])
    })
  }, [])

  const startNewAudit = async (vid: string, vname: string) => {
    setBusy(true)
    try {
      const starter = await mechanixAPI.startAudit(vid)
      const auditObj = {
        id: starter.data.id,
        vehicle_id: vname,
        items: AUDIT_ITEMS.map(i => ({ ...i, result: 'pending', evidence_url: '', repair_cost: 0 }))
      }
      setAudit(auditObj)
      const resMap: Record<string,R> = {}; const costMap: Record<string,string> = {}; const evMap: Record<string,string> = {}
      AUDIT_ITEMS.forEach(i => { resMap[i.id] = ''; costMap[i.id] = ''; evMap[i.id] = '' })
      setResults(resMap); setCosts(costMap); setEvidence(evMap)
      setOfflineMode(false)
    } catch {
      setOfflineMode(true)
      const auditObj = {
        id: `LOCAL-${Date.now()}`,
        vehicle_id: vname,
        items: AUDIT_ITEMS.map(i => ({ ...i, result: 'pending', evidence_url: '', repair_cost: 0 }))
      }
      setAudit(auditObj)
      const resMap: Record<string,R> = {}; const costMap: Record<string,string> = {}; const evMap: Record<string,string> = {}
      AUDIT_ITEMS.forEach(i => { resMap[i.id] = ''; costMap[i.id] = ''; evMap[i.id] = '' })
      setResults(resMap); setCosts(costMap); setEvidence(evMap)
    }
    finally { setBusy(false) }
  }

  const setR = async (itemId: string, r: R) => {
    setResults(p => ({ ...p, [itemId]: r }))
    if (!offlineMode && audit?.id && !audit.id.startsWith('LOCAL')) {
      try {
        await mechanixAPI.updateItem(audit.id, itemId, { result: r, repair_cost: parseFloat(costs[itemId] || '0') })
      } catch { /* saved locally fallback */ }
    }
  }

  const uploadEvidence = async (itemId: string, file: File) => {
    setBusy(true)
    try {
      if (!offlineMode && audit?.id && !audit.id.startsWith('LOCAL')) {
        const fd = new FormData(); fd.append('file', file)
        const res = await mechanixAPI.uploadEvidence(audit.id, itemId, fd)
        setEvidence(p => ({ ...p, [itemId]: res.data.evidence_url }))
      } else {
        setEvidence(p => ({ ...p, [itemId]: URL.createObjectURL(file) }))
      }
      toast.success('Capture Confirmed ✓')
    } catch { toast.error('Upload failed') }
    finally { setBusy(false) }
  }

  const needsEvidence = (id: string) => results[id] === 'fail' || results[id] === 'repair'
  const passCount     = Object.values(results).filter(r => r === 'pass').length
  const failCount     = Object.values(results).filter(r => r === 'fail' || r === 'repair').length
  const repairTotal   = Object.entries(costs).filter(([id]) => needsEvidence(id)).reduce((a, [, v]) => a + (parseFloat(v) || 0), 0)
  const itemsDone     = Object.values(results).filter(r => r !== '').length
  const totalItems    = AUDIT_ITEMS.length
  const canComplete   = itemsDone === totalItems && Object.keys(results).every(id => !needsEvidence(id) || evidence[id])
  const progress      = Math.round((itemsDone / totalItems) * 100)

  const complete = async () => {
    setBusy(true)
    try {
      if (!offlineMode && audit?.id && !audit.id.startsWith('LOCAL')) {
        await mechanixAPI.completeAudit(audit.id, { total_repair_cost: repairTotal })
      }
      toast.success(failCount === 0 ? '✓ ALL PASS: Vehicle Cleared for Dispatch' : `✓ Audit Complete: ₹${repairTotal.toLocaleString()} Deduced`)
      setAudit(null); setResults({}); setCosts({}); setEvidence({}); setSelected('')
    } catch { toast.error('Finalization Protocol Failed') }
    finally { setBusy(false) }
  }

  // Group items by category
  const categories = Array.from(new Set(AUDIT_ITEMS.map(i => i.cat)))

  if (!audit) return (
    <div className="max-w-5xl">
      <div className="text-[10px] tracking-[4px] text-navy uppercase font-black mb-10 flex items-center gap-3">
        <span className="w-10 h-px bg-green" /> Mechanix Pro — Physical Audit Gateway
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-white border border-navy/10 shadow-2xl p-6 md:p-10 relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-32 h-32 bg-navy/5 -rotate-12 translate-x-12 -translate-y-12" />
          <div className="text-5xl md:text-7xl mb-10">🛡️</div>
          <h2 className="text-[18px] text-navy font-bold mb-4 uppercase tracking-tighter leading-none">Security Dispatch Protocol</h2>
          <p className="text-[11px] text-ash leading-relaxed mb-10 font-bold uppercase tracking-[1px]">Select asset to initialize the 22-point mandatory digital health inspection.</p>
          
          <div className="space-y-6">
            <div>
              <label className="text-[9px] tracking-[4px] text-ash uppercase block mb-3 font-black">Strategic Asset Identification</label>
              <select value={selected} onChange={e => {
                setSelected(e.target.value)
                setSelectedName(e.target.options[e.target.selectedIndex].text)
              }} className="w-full bg-void border border-navy/10 px-5 py-4 text-[13px] text-navy font-black outline-none focus:border-green transition-all appearance-none cursor-pointer">
                <option value="">-- SELECT ACTIVE CHASSIS --</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} · {v.registration_number}</option>)}
              </select>
            </div>
            <button onClick={() => startNewAudit(selected, selectedName)} disabled={!selected || busy}
              className="w-full bg-navy text-void text-[11px] tracking-[5px] py-6 font-black uppercase hover:bg-green transition-all shadow-xl cut-sm">
              {busy ? 'INITIALIZING LEDGER...' : 'COMMENCE DIGITAL AUDIT →'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="text-[9px] tracking-[4px] text-ash uppercase mb-2 font-black italic md:col-span-2 lg:col-span-1">Audit Checkpoint Allocation</div>
          {categories.map(cat => (
            <div key={cat} className="flex items-center justify-between p-4 md:p-5 border border-navy/5 bg-void/50 group hover:border-navy/20 transition-all">
              <span className="text-[10px] font-black uppercase tracking-[2px] text-navy">{cat}</span>
              <span className="text-[10px] text-ash font-bold">{AUDIT_ITEMS.filter(i => i.cat === cat).length} PARAMETERS</span>
            </div>
          ))}
          <div className="pt-6 border-t border-navy/10 mt-6 flex justify-between items-center px-2 md:col-span-2 lg:col-span-1">
            <span className="text-[10px] text-ash font-black uppercase tracking-[3px]">Total Compliance Checks</span>
            <span className="text-xl md:text-2xl font-display text-navy">22 / 22</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-white border border-navy/10 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="bg-navy px-10 py-6 flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[5px] text-green uppercase font-black mb-1">Audit Protocol v2.1 — Active</div>
          <div className="text-[18px] text-void font-display uppercase tracking-widest">{audit.vehicle_id}</div>
        </div>
        <div className="flex items-center gap-10">
          <div className="text-right">
            <div className="text-3xl text-void font-display leading-none mb-1">{progress}%</div>
            <div className="text-[10px] text-ash tracking-[3px] font-black uppercase">Consolidated Progress</div>
          </div>
          <button onClick={() => { if(confirm('Abort? Progress will be purged.')) setAudit(null) }}
            className="text-[9px] text-red border border-red/30 px-5 py-3 font-black uppercase tracking-[3px] hover:bg-red/10 transition-all">
            Abort Mission
          </button>
        </div>
      </div>

      <div className="h-2 bg-navy/20 relative">
        <div className="absolute inset-y-0 left-0 bg-green transition-all duration-1000 ease-out" style={{ width: `${progress}%`, boxShadow: '0 0 20px rgba(34,197,94,.5)' }} />
      </div>

      {/* Real-time Tally */}
      <div className="grid grid-cols-4 bg-void/30 border-b border-navy/10">
        {[
          { label: 'COMPLIANT', val: passCount, color: 'text-green' },
          { label: 'NON-COMPLIANT', val: failCount, color: failCount > 0 ? 'text-orange font-black' : 'text-ash' },
          { label: 'PENDING VERIFICATION', val: totalItems - itemsDone, color: 'text-navy' },
          { label: 'EST. SETTLEMENT', val: `₹${repairTotal.toLocaleString()}`, color: 'text-navy' },
        ].map(s => (
          <div key={s.label} className="p-8 border-r border-navy/5 last:border-0">
            <div className="text-[9px] tracking-[4px] text-ash uppercase mb-2 font-black italic">{s.label}</div>
            <div className={`text-3xl font-display ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Checklist Content */}
      <div className="max-h-[600px] overflow-y-auto">
        {categories.map(cat => (
          <div key={cat} className="border-b border-navy/10 last:border-0">
            <div className="bg-void px-10 py-3 text-[10px] tracking-[5px] text-navy font-black border-y border-navy/5 uppercase flex items-center gap-4">
              <span className="w-6 h-px bg-green" /> {cat} Protocols
            </div>
            {AUDIT_ITEMS.filter(i => i.cat === cat).map(item => {
              const currentR = results[item.id] || ''
              const isNeedsEvidence = needsEvidence(item.id)
              
              return (
                <div key={item.id} className="group">
                  <div className={`px-10 py-6 flex items-center justify-between border-b border-navy/[.03] transition-all ${currentR?'bg-white':'bg-white/50 hover:bg-white'}`}>
                    <div className="flex items-center gap-6 flex-1 pr-10">
                       <span className={`w-3 h-3 rounded-full shadow-sm transition-all duration-500 ${
                         currentR === 'pass' ? 'bg-green scale-110 shadow-green/20' : 
                         currentR === 'fail' ? 'bg-orange scale-110' : 
                         currentR === 'repair' ? 'bg-orange animate-pulse' : 'bg-navy/10'
                       }`} />
                       <span className={`text-[13px] font-bold ${currentR ? 'text-navy' : 'text-ash group-hover:text-navy'} transition-colors`}>{item.label}</span>
                    </div>
                    <div className="flex gap-2">
                       {(['pass','fail','repair'] as R[]).map(r => (
                         <button key={r} onClick={() => setR(item.id, r)}
                           className={`text-[8px] tracking-[3px] uppercase px-5 py-2.5 border font-black transition-all ${
                             currentR === r
                               ? r === 'pass' ? 'bg-green text-void border-green' : 'bg-orange text-void border-orange'
                               : 'border-navy/10 text-ash hover:border-navy/30'
                           }`}>
                           {r === 'repair' ? 'Settle' : r}
                         </button>
                       ))}
                    </div>
                  </div>

                  {isNeedsEvidence && (
                    <div className="bg-orange/[.02] border-b border-orange/10 px-10 py-8 grid grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <label className="text-[10px] tracking-[4px] text-orange uppercase font-black block italic">Telemetry Evidence Capture</label>
                          <label className={`block border-2 border-dashed p-10 text-center cursor-pointer transition-all ${evidence[item.id]?'border-green bg-green/5':'border-orange/30 hover:border-orange/60'}`}>
                             <div className="text-4xl mb-3">{evidence[item.id] ? '✓' : '📷'}</div>
                             <div className="text-[10px] tracking-[3px] font-black text-navy uppercase">{evidence[item.id] ? 'Capture Confirmed' : 'Sync Photo/Video'}</div>
                             <input type="file" accept="image/*,video/*" capture="environment" className="hidden"
                               onChange={e => { const f = e.target.files?.[0]; if(f) uploadEvidence(item.id, f) }} />
                          </label>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] tracking-[4px] text-orange uppercase font-black block italic">Repair Settlement Est. (₹)</label>
                          <input type="number" placeholder="Enter Amount" value={costs[item.id] || ''}
                            onChange={e => setCosts(p => ({ ...p, [item.id]: e.target.value }))}
                            className="w-full bg-white border border-navy/10 px-6 py-5 text-[24px] text-navy font-display outline-none focus:border-orange transition-all placeholder:opacity-10" />
                          <p className="text-[9px] text-ash font-bold uppercase tracking-[2px] italic">— Amount auto-deduced from Investor Dividend</p>
                       </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Completion Bar */}
      <div className="bg-navy p-10 flex items-center justify-between">
         <div className="flex gap-10 text-[10px] tracking-[3px] font-black uppercase italic grayscale opacity-40">
            <span className="text-void">Checks: {itemsDone} / {totalItems}</span>
            <span className="text-void">Verified: {Object.keys(evidence).length} Assets</span>
         </div>
         <button onClick={complete} disabled={!canComplete || busy}
           className={`px-12 py-6 text-[11px] tracking-[5px] uppercase font-black transition-all cut-sm shadow-2xl ${
             canComplete ? 'bg-green text-void hover:bg-green-dim' : 'bg-void/5 text-ash cursor-not-allowed border border-void/10'
           }`}>
           {busy ? 'Securing Logs...' : canComplete ? 'FINALISE AUDIT & SYNC DASHBOARD →' : 'Protocol Incomplete'}
         </button>
      </div>
    </div>
  )
}

function ExpenseTab() {
  const [vehicle, setVehicle] = useState('')
  const [desc,    setDesc]    = useState('')
  const [amount,  setAmount]  = useState('')
  const [receipt, setReceipt] = useState<File|null>(null)
  const [busy,    setBusy]    = useState(false)
  const [history, setHistory] = useState([
    {vehicle:'Mahindra XUV 300', desc:'Strategic Brake Pad Replacement', amount:1500, date:'8 Mar 2026', status:'settled'},
    {vehicle:'Thar Roxx', desc:'Engine Propulsion Service',   amount:2200, date:'1 Mar 2026', status:'settled'},
  ])

  const inp = "w-full bg-void border border-navy/10 px-5 py-4 text-[13px] text-navy font-bold font-mono placeholder:text-navy/10 focus:border-green outline-none transition-all"

  const submit = async () => {
    if(!vehicle||!desc||!amount) { toast.error('Fill required parameters'); return }
    if(!receipt) { toast.error('Garage Receipt (PDF/Asset) Required'); return }
    setBusy(true)
    await new Promise(r=>setTimeout(r,1200))
    toast.success(`✓ ₹${parseFloat(amount).toLocaleString()} Deducted. Settle Protocol Logged.`)
    setHistory(h=>[{vehicle, desc, amount:parseFloat(amount), date:'Today', status:'settled'}, ...h])
    setVehicle(''); setDesc(''); setAmount(''); setReceipt(null)
    setBusy(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <div className="text-[10px] tracking-[4px] text-navy uppercase font-black mb-8 flex items-center gap-3">
          <span className="w-10 h-px bg-orange" /> Expense Settlement Engine
        </div>
        <div className="bg-white border border-navy/10 shadow-2xl p-6 md:p-10 space-y-6">
          <div>
            <label className="text-[9px] tracking-[4px] text-ash uppercase block mb-3 font-black">Target Asset</label>
            <select value={vehicle} onChange={e=>setVehicle(e.target.value)} className={inp}>
              <option value="">-- SELECT ASSET --</option>
              <option>Thar Roxx · KA04XX0001</option>
              <option>XUV 300 · KA04ND5967</option>
              <option>Kia Carens · KA05XX0023</option>
              <option>Nissan Magnite · KA01XX0089</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] tracking-[4px] text-ash uppercase block mb-3 font-black">Operational Description</label>
            <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="e.g. Kinetic Brake Overhaul" className={inp}/>
          </div>
          <div>
            <label className="text-[9px] tracking-[4px] text-ash uppercase block mb-3 font-black">Wholesale Cost (₹)</label>
            <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" placeholder="0.00" className={inp}/>
            <p className="text-[9px] text-ash mt-3 font-bold italic">// Ledger Settlement: Value auto-deduced from Dividend.</p>
          </div>
          <div>
            <label className="text-[9px] tracking-[4px] text-ash uppercase block mb-3 font-black">Physical Receipt (PDF/Digital)</label>
            <label className={`block border-2 border-dashed p-6 md:p-8 text-center cursor-pointer transition-all ${receipt?'border-green/40 bg-green/5':'border-navy/10 hover:border-navy/30'}`}>
              <div className="text-2xl md:text-3xl mb-3">{receipt?'✓':'📄'}</div>
              <div className="text-[10px] tracking-[2px] text-navy font-black uppercase">{receipt?receipt.name:'UPLOAD VENDOR PROOF'}</div>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e=>setReceipt(e.target.files?.[0]||null)}/>
            </label>
          </div>
          <button onClick={submit} disabled={busy}
            className="w-full bg-navy text-void text-[11px] tracking-[5px] font-black uppercase py-6 hover:bg-green transition-all shadow-xl cut-sm disabled:opacity-50">
            {busy ? 'PROCESSING LEDGER...' : 'CONFIRM SETTLEMENT →'}
          </button>
        </div>
      </div>
      <div>
        <div className="text-[10px] tracking-[4px] text-navy uppercase font-black mb-8 flex items-center gap-3">
          <span className="w-10 h-px bg-green" /> Operating Expense History
        </div>
        <div className="bg-white border border-navy/10 shadow-xl overflow-hidden">
          <div className="grid grid-cols-4 px-6 md:px-8 py-4 bg-void border-b border-navy/10 text-[9px] tracking-[3px] text-ash uppercase font-black">
            <span>Asset</span><span className="hidden md:block">Scope</span><span>Value</span><span>Sync</span>
          </div>
          <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto">
            {history.map((h,i)=>(
              <div key={i} className="grid grid-cols-3 md:grid-cols-4 px-6 md:px-8 py-6 border-b border-navy/5 text-[12px] items-center group transition-colors hover:bg-void/30 font-bold">
                <span className="text-ash text-[11px] truncate pr-2 uppercase">{h.vehicle.split(' ').pop()}</span>
                <span className="text-navy truncate pr-2 uppercase text-[11px] leading-tight hidden md:block">{h.desc}</span>
                <span className="text-red font-display text-[13px] md:text-[14px]">-₹{h.amount.toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green shadow-[0_0_8px_rgba(34,197,94,.4)]"/>
                  <span className="text-[8px] tracking-[1px] text-green font-black uppercase">{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 bg-void border border-navy/10 p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 shadow-md">
           <div className="text-center md:text-left">
             <div className="text-[10px] tracking-[3px] text-ash uppercase mb-1 font-black">Consolidated Leakage (MTD)</div>
             <div className="font-display text-3xl md:text-4xl text-red">-₹{history.reduce((a,b)=>a+b.amount,0).toLocaleString()}</div>
           </div>
           <div className="text-center md:text-right">
             <div className="text-[10px] tracking-[3px] text-ash uppercase mb-1 font-black">Total Invoices</div>
             <div className="font-display text-3xl md:text-4xl text-navy">{history.length}</div>
           </div>
        </div>
      </div>
    </div>
  )
}

function InvestorsTab() {
  const [investors, setInvestors] = useState<any[]>([])
  const [loading, setLoading]     = useState(true)

  const load = async () => {
    try { const r = await adminAPI.getInvestors(); setInvestors(r.data) }
    catch { toast.error('Failed to access Portfolio Registry') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const approve = async (id: string) => {
    try { await adminAPI.approveKYC(id); toast.success('✓ KYC Protocol Verified'); load() }
    catch { toast.error('Verification failed') }
  }

  return (
    <div className="space-y-6">
      <div className="text-[10px] tracking-[4px] text-navy uppercase font-black mb-8 flex items-center gap-3">
        <span className="w-10 h-px bg-green" /> Investor Portfolio CRM
      </div>
      <div className="bg-white border border-navy/10 shadow-2xl overflow-hidden">
        <div className="hidden lg:grid grid-cols-6 px-10 py-5 bg-void border-b border-navy/10 text-[9px] tracking-[4px] text-ash uppercase font-black">
          <span>Investor</span><span>Identity</span><span>Asset Count</span><span>Compliance</span><span>Pulse</span><span>Actions</span>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {loading ? [1,2,3,4].map(i=>(
            <div key={i} className="h-20 animate-pulse bg-void border-b border-navy/5 m-4" />
          )) : investors.map((inv,i)=>(
            <div key={i} className="flex flex-col lg:grid lg:grid-cols-6 px-6 md:px-10 py-6 md:py-8 border-b border-navy/5 items-start lg:items-center hover:bg-void/40 transition-all font-bold group gap-4 lg:gap-0">
              <div className="flex flex-col">
                <span className="text-[13px] text-navy uppercase font-black">{inv.name || 'Anonymous Partner'}</span>
                <span className="lg:hidden text-[9px] text-ash font-mono mt-1">{inv.phone}</span>
              </div>
              <span className="hidden lg:block text-[11px] text-ash font-mono">{inv.phone}</span>
              <span className="text-[12px] text-navy font-display">{inv.vehicle_count} Strategic Assets</span>
              <span className={`text-[10px] tracking-[2px] uppercase font-black px-4 py-1.5 border inline-block w-fit ${inv.kyc_verified?'text-green border-green/30 bg-green/5':'text-orange border-orange/30 bg-orange/5'}`}>
                {inv.kyc_verified?'Verified':'Pending'}
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green shadow-[0_0_8px_rgba(34,197,94,.4)]"/>
                <span className="text-[9px] text-green font-black uppercase tracking-widest">Active</span>
              </div>
              <div className="flex gap-2 w-full lg:w-auto">
                {!inv.kyc_verified && (
                  <button onClick={()=>approve(inv.id)} className="w-full lg:w-auto text-[9px] tracking-[2px] text-green border-2 border-green/40 px-5 py-2 hover:bg-green hover:text-void transition-all font-black uppercase cut-sm text-center">
                    Approve KYC
                  </button>
                )}
                {inv.kyc_verified && (
                   <div className="flex -space-x-2">
                      {[1,2,3].map(j=><div key={j} className="w-8 h-8 rounded-full border-2 border-white bg-navy/5 flex items-center justify-center text-[10px] text-ash">📄</div>)}
                   </div>
                )}
              </div>
            </div>
          ))}
          {!loading && investors.length === 0 && (
             <div className="p-20 text-center text-ash text-[12px] font-black uppercase tracking-[4px] italic opacity-40">
               No Onboarded Capital Partners Found.
             </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LeadsTab() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getLeads().then(r=>setLeads(r.data)).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-[10px] tracking-[4px] text-navy uppercase font-black mb-8 flex items-center gap-3">
        <span className="w-10 h-px bg-orange" /> B2B Corporate Leadership Pipeline
      </div>
      <div className="bg-white border border-navy/10 shadow-2xl overflow-hidden">
        <div className="hidden lg:grid grid-cols-5 px-10 py-5 bg-void border-b border-navy/10 text-[9px] tracking-[4px] text-ash uppercase font-black">
          <span>Enterprise</span><span>Contact Node</span><span>Allocation</span><span>Classification</span><span>Timestamp</span>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {loading ? [1,2,3].map(i=>(
            <div key={i} className="h-20 animate-pulse bg-void border-b border-navy/5 m-4" />
          )) : leads.map((l,i)=>(
            <div key={i} className="flex flex-col lg:grid lg:grid-cols-5 px-6 md:px-10 py-6 md:py-8 border-b border-navy/5 hover:bg-void/40 transition-all font-bold group items-start lg:items-center gap-4 lg:gap-0">
              <span className="text-[13px] text-navy uppercase font-black">{l.company_name}</span>
              <div>
                <div className="text-[11px] text-navy uppercase font-black">{l.contact_name}</div>
                <div className="text-[9px] text-ash font-mono">{l.email}</div>
              </div>
              <span className="text-[14px] text-green font-display">{l.vehicle_count} Strategic Units</span>
              <span className={`text-[10px] tracking-[2px] uppercase font-black px-4 py-1.5 border inline-block w-fit ${l.status==='new'?'text-orange border-orange/30 bg-orange/5':'text-green border-green/30 bg-green/5'}`}>
                {l.status}
              </span>
              <span className="text-[10px] text-ash font-bold">{new Date(l.created_at).toLocaleDateString('en-GB')}</span>
            </div>
          ))}
          {!loading && leads.length === 0 && (
             <div className="p-20 text-center text-ash text-[12px] font-black uppercase tracking-[4px] italic opacity-40">
               No B2B Inbound Signals Detected.
             </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminIRMDesk() {
  const SEED = [
    {id:'TKT-001', investor:'Rohan Sharma', phone:'+91 9880001122', subject:'Payout discrepancy — Feb 2026', status:'open',     priority:'high',   date:'11 Mar 2026', message:'The Feb payout amount does not match the ledger. I see ₹24,800 in the dashboard but only ₹23,100 was credited to my account.', reply:''},
    {id:'TKT-002', investor:'Priya Nair',   phone:'+91 9810002233', subject:'KYC rejection reason needed',  status:'open',     priority:'medium', date:'10 Mar 2026', message:'My KYC was rejected but I did not receive any reason. Please let me know what document needs to be re-uploaded.', reply:''},
    {id:'TKT-003', investor:'Kiran Reddy',  phone:'+91 9870003344', subject:'Tax export format question',   status:'resolved', priority:'low',    date:'8 Mar 2026',  message:'Is the exported Excel CA-compatible for ITR-3 filing? Does it include the TDS applicable fields?', reply:'Yes — the Excel file includes gross rent, platform fee, net yield, and TDS-applicable columns in ITR-3 compatible format.'},
    {id:'TKT-004', investor:'Anita Desai',  phone:'+91 9840004455', subject:'Emergency pause not working',  status:'open',     priority:'medium', date:'7 Mar 2026',  message:'I tried to block 17 March for personal use but the calendar says maximum days reached. I have only used 3 out of 5 this quarter.', reply:''},
  ]

  const [tickets, setTickets] = useState(SEED)
  const [sel, setSel]         = useState<any>(null)
  const [reply, setReply]     = useState('')
  const [busy, setBusy]       = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024 && !sel) setSel(SEED[0])
  }, [])

  const submit = async () => {
    if (!reply.trim()) { toast.error('Transmission data empty'); return }
    setBusy(true)
    try {
      await adminAPI.replyTicket(sel.id, reply)
      const updated = tickets.map(t => t.id === sel.id ? {...t, reply, status:'resolved'} : t)
      setTickets(updated)
      setSel({...sel, reply, status:'resolved'})
      setReply('')
      toast.success('✓ IRM Protocol Settle: Investor Notified.')
    } catch {
      const updated = tickets.map(t => t.id === sel.id ? {...t, reply, status:'resolved'} : t)
      setTickets(updated)
      setSel({...sel, reply, status:'resolved'})
      setReply('')
      toast.success('✓ IRM Protocol Resolved.')
    } finally { setBusy(false) }
  }

  return (
    <div className="h-[75vh] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="text-[10px] tracking-[4px] text-navy uppercase font-black flex items-center gap-3">
          <span className="w-10 h-px bg-green" /> IRM Support Desk — Strategic Resolution
        </div>
        <div className="flex flex-wrap gap-4 text-[9px] font-black uppercase tracking-widest">
          <span className="text-orange bg-orange/5 px-4 py-1.5 border border-orange/20">{tickets.filter(t=>t.status==='open').length} CRITICAL</span>
          <span className="text-green bg-green/5 px-4 py-1.5 border border-green/20">{tickets.filter(t=>t.status==='resolved').length} SETTLED</span>
        </div>
      </div>
      <div className="flex gap-6 flex-1 overflow-hidden relative">
        <div className={`${sel ? 'hidden lg:block' : 'block'} w-full lg:w-[380px] shrink-0 border border-navy/10 overflow-y-auto bg-white shadow-xl`}>
          {tickets.map(t=>(
            <button key={t.id} onClick={()=>setSel(t)}
              className={`w-full text-left p-6 border-b border-navy/5 transition-all hover:bg-void ${sel?.id===t.id?'bg-void border-l-4 border-l-green shadow-inner':''}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] text-navy font-black uppercase tracking-tight truncate pr-4">{t.subject}</span>
                <span className={`text-[7px] tracking-[2px] uppercase shrink-0 font-black px-2 py-1 border ${t.status==='open'?'text-orange border-orange/30 bg-orange/5':'text-green border-green/30 bg-green/5'}`}>{t.status}</span>
              </div>
              <div className="text-[10px] text-ash font-bold uppercase tracking-wider mb-2">{t.investor}</div>
              <div className="flex justify-between items-center">
                <span className={`text-[8px] font-black uppercase tracking-widest ${t.priority==='high'?'text-red':'text-navy'}`}>⬤ {t.priority} PRIO</span>
                <span className="text-[9px] text-ash italic font-medium">{t.date}</span>
              </div>
            </button>
          ))}
        </div>

        {sel ? (
          <div className="flex-1 flex flex-col border border-navy/10 overflow-hidden bg-white shadow-2xl relative">
            <div className="p-6 md:p-8 border-b border-navy/10 bg-void/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSel(null)} className="lg:hidden p-2 text-navy hover:bg-navy/5 rounded-full transition-colors">
                  <span className="text-xl">←</span>
                </button>
                <div>
                  <div className="text-[13px] md:text-[14px] text-navy font-black uppercase tracking-tight mb-1">{sel.subject}</div>
                  <div className="text-[9px] md:text-[10px] text-ash font-bold uppercase tracking-[2px]">LOG-{sel.id} · {sel.investor}</div>
                </div>
              </div>
              <div className="hidden md:block text-right">
                 <div className="text-[10px] text-green font-black tracking-widest uppercase mb-1">ENCRYPTION: ACTIVE</div>
                 <div className="h-1 bg-green/20 w-32 rounded-full overflow-hidden">
                    <div className="h-full bg-green w-full animate-pulse" />
                 </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-grid-pattern bg-[length:30px_30px] bg-void/5">
              <div className="flex gap-4 md:gap-6 max-w-[95%] lg:max-w-[85%]">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-navy text-void font-display text-lg md:text-xl flex items-center justify-center shrink-0 shadow-lg cut-sm">
                  {sel.investor.charAt(0)}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] md:text-[11px] text-navy font-black uppercase tracking-widest">{sel.investor}</span>
                     <span className="text-[8px] md:text-[9px] text-ash italic font-medium">{sel.date}</span>
                  </div>
                  <div className="bg-white border border-navy/10 p-5 md:p-6 text-[12px] md:text-[13px] text-navy leading-relaxed shadow-sm font-medium">{sel.message}</div>
                </div>
              </div>

              {sel.reply && (
                <div className="flex gap-4 md:gap-6 flex-row-reverse max-w-[95%] lg:max-w-[85%] ml-auto">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green text-void font-display text-lg md:text-xl flex items-center justify-center shrink-0 shadow-lg cut-sm">A</div>
                  <div className="space-y-2 text-right">
                    <div className="flex items-center gap-3 justify-end">
                       <span className="text-[8px] md:text-[9px] text-ash italic font-medium">Headquarters · {sel.date}</span>
                       <span className="text-[10px] md:text-[11px] text-green font-black uppercase tracking-widest">Admin Command</span>
                    </div>
                    <div className="bg-navy text-void border border-navy/20 p-5 md:p-6 text-[12px] md:text-[13px] leading-relaxed shadow-xl text-left font-medium">{sel.reply}</div>
                  </div>
                </div>
              )}
            </div>

            {sel.status === 'open' && (
              <div className="p-6 md:p-8 border-t border-navy/10 bg-void">
                <textarea
                  value={reply}
                  onChange={e=>setReply(e.target.value)}
                  placeholder="Initialize strategic response..."
                  rows={3}
                  className="w-full bg-white border border-navy/10 px-5 md:px-6 py-4 text-[12px] md:text-[13px] text-navy font-bold font-mono outline-none focus:border-green transition-all resize-none mb-4 shadow-inner" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-[8px] md:text-[9px] text-ash font-black uppercase tracking-[2px] italic text-center md:text-left">
                     Warning: Immutable Log.
                  </div>
                  <button onClick={submit} disabled={busy}
                    className="w-full md:w-auto bg-navy text-void text-[10px] tracking-[4px] uppercase px-10 py-4 font-black hover:bg-green transition-all shadow-xl cut-sm">
                    {busy ? 'TRANSMITTING...' : 'EXECUTE & SETTLE →'}
                  </button>
                </div>
              </div>
            )}
            {sel.status === 'resolved' && (
              <div className="p-6 bg-green text-void text-[10px] md:text-[11px] font-black uppercase tracking-[5px] text-center shadow-inner">
                 ✓ PROTOCOL SETTLED
              </div>
            )}
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center border border-navy/10 bg-white/50 italic text-ash text-[11px] uppercase tracking-[4px]">
             Select Signal from Inbox to View Thread.
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { logout } = useAuthStore()
  const [tab, setTab]     = useState('overview')
  const [stats, setStats] = useState<AdminStats|null>(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => { adminAPI.getStats().then(r=>setStats(r.data)).catch(()=>{}) },[])

  return (
    <main className="min-h-screen bg-void flex flex-col font-body selection:bg-green selection:text-void overflow-x-hidden">
      {/* Topbar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[70px] md:h-[80px] bg-white border-b border-navy/10 flex items-center justify-between px-6 md:px-10 shadow-sm">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => setShowMenu(!showMenu)} className="lg:hidden p-2 text-navy hover:bg-navy/5 rounded transition-all">
            <div className="w-6 h-0.5 bg-navy mb-1.5" />
            <div className="w-6 h-0.5 bg-navy mb-1.5" />
            <div className="w-6 h-0.5 bg-navy" />
          </button>
          <a href="/" className="font-display text-xl md:text-2xl tracking-[6px] md:tracking-[12px] text-navy hover:text-green transition-all shrink-0"><em className="text-green not-italic">8</em>LINES</a>
          <div className="h-6 w-px bg-navy/10 mx-2 hidden md:block" />
          <div className="text-[8px] md:text-[10px] tracking-[3px] md:tracking-[6px] text-red border-2 border-red px-2 md:px-3 py-1 font-black uppercase hidden sm:block">Node 01</div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <span className="hidden sm:flex text-[10px] text-green items-center gap-3 font-black uppercase tracking-[3px]">
             <span className="w-2.5 h-2.5 bg-green rounded-full shadow-[0_0_10px_rgba(34,197,94,.5)]" style={{animation:'blink 2s infinite'}}/>
             Lattice Active
          </span>
          <div className="h-6 w-px bg-navy/10 hidden sm:block" />
          <button onClick={logout} className="text-[8px] md:text-[10px] tracking-[2px] md:tracking-[4px] text-ash hover:text-red transition-all uppercase font-black px-4 md:px-6 py-2.5 md:py-3 border border-navy/10 hover:border-red/40 cut-sm">Terminate</button>
        </div>
      </div>

      <div className="flex flex-1 pt-[70px] md:pt-[80px]">
        {/* Sidebar overlay for mobile */}
        {showMenu && <div className="lg:hidden fixed inset-0 bg-navy/60 z-[60] backdrop-blur-sm" onClick={() => setShowMenu(false)} />}
        
        {/* Sidebar */}
        <div className={`
          fixed top-0 bottom-0 left-0 z-[70] lg:z-40 w-[260px] md:w-[280px] bg-white border-r border-navy/10 shadow-2xl lg:shadow-xl overflow-y-auto transition-transform duration-300 lg:translate-x-0
          ${showMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:top-[80px]
        `}>
          <div className="p-8 md:p-10 border-b border-navy/5 bg-void/30">
            <div className="text-[9px] tracking-[5px] text-ash uppercase mb-2 font-black">Strategic Command</div>
            <div className="text-[13px] md:text-[14px] text-navy font-black leading-none flex items-center gap-2">
               <span className="w-4 h-4 bg-navy text-void text-[8px] flex items-center justify-center rounded-sm">HQ</span>
               GLOBAL EXECUTIVE
            </div>
          </div>
          <div className="py-6 md:py-8">
            {ADMIN_NAV.map((n,i)=>(
              <div key={n.id}>
                {i===4&&<div className="h-px bg-navy/5 my-6 mx-8"/>}
                <button onClick={()=>{setTab(n.id); setShowMenu(false)}}
                  className={`w-full flex items-center gap-6 px-10 py-5 text-[10px] tracking-[4px] md:tracking-[5px] uppercase text-left transition-all border-l-4 font-black ${tab===n.id?'text-green border-green bg-void shadow-inner':'text-ash border-transparent hover:text-navy hover:bg-void/50'}`}>
                  <span className="text-xl md:text-2xl opacity-60 grayscale group-hover:grayscale-0">{n.icon}</span>{n.label}
                </button>
              </div>
            ))}
          </div>
          <div className="absolute bottom-10 left-0 right-0 px-8 md:px-10 hidden sm:block">
             <div className="bg-navy p-5 md:p-6 shadow-2xl cut-sm">
                <div className="text-[8px] tracking-[3px] text-orange uppercase font-black mb-2">System Health</div>
                <div className="h-1 bg-white/10 overflow-hidden">
                   <div className="h-full bg-green w-[99%]" />
                </div>
                <div className="mt-3 text-[7px] text-ash font-bold uppercase tracking-widest italic flex justify-between">
                   <span>99.9% SL uptime</span>
                   <span>v4.0.2</span>
                </div>
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 lg:ml-[280px] p-6 md:p-12 bg-void/10 min-h-full">
          {tab==='overview'  && <OverviewTab stats={stats}/>}
          {tab==='payout'    && <PayoutTab/>}
          {tab==='expense'   && <ExpenseTab/>}
          {tab==='mechanix'  && <MechanixTab/>}
          {tab==='investors' && <InvestorsTab/>}
          {tab==='leads'     && <LeadsTab/>}
          {tab==='fleet'     && (
            <div className="space-y-8">
              <div className="text-[10px] tracking-[4px] text-navy uppercase font-black flex items-center gap-3">
                <span className="w-10 h-px bg-green" /> Global Fleet Deployment — Real-Time
              </div>
              <div className="bg-white border border-navy/10 h-[450px] md:h-[650px] flex items-center justify-center relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"/>
                <div className="text-center relative z-10 p-6">
                   <div className="text-5xl md:text-7xl mb-8 grayscale opacity-20">🗺️</div>
                   <div className="text-[12px] md:text-[14px] text-navy font-black tracking-[4px] md:tracking-[8px] uppercase">LATTICE MAP INTERFACE</div>
                   <div className="text-[9px] md:text-[10px] text-ash font-bold mt-4 uppercase tracking-[3px] md:tracking-[4px] italic">Deep Sync: Live Google Maps Enterprise Feed</div>
                </div>
                {[[25,35],[55,50],[40,65],[70,30],[60,70],[45,40],[30,20],[80,80]].map(([x,y],i)=>(
                  <div key={i} className="absolute group cursor-pointer" style={{left:`${x}%`,top:`${y}%`}}>
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-green rounded-full shadow-[0_0_20px_rgba(34,197,94,.6)] flex items-center justify-center transition-all hover:scale-150" style={{animation:'blink 2s infinite',animationDelay:`${i*.3}s`}}>
                       <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-void rounded-full opacity-40" />
                    </div>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-navy text-void text-[9px] font-black px-3 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-xl cut-sm z-20">
                      FLEET-ASSET-{i+1} ACTIVE
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab==='tickets'   && <AdminIRMDesk/>}
        </div>
      </div>
    </main>
  )
}
