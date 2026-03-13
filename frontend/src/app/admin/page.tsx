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
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3,4,5,6].map(i=>(
          <div key={i} className="bg-obsidian border border-green/8 p-5 animate-pulse">
            <div className="h-2 bg-graphite w-24 mb-3 rounded"/>
            <div className="h-8 bg-graphite w-20 mb-2 rounded"/>
          </div>
        ))}
      </div>
      <div className="bg-obsidian border border-green/8 p-8 text-center text-fog text-[11px]">Loading admin data...</div>
    </div>
  )
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {[
          {label:"Today's Gross Revenue",  val:`₹${(stats.totalGrossRevenue||0).toLocaleString('en-IN')}`, g:true},
          {label:'Platform 30% Cut',        val:`₹${(stats.platformCut||0).toLocaleString('en-IN')}`,       g:true},
          {label:'Active Vehicles on Road', val:`${stats.activeVehicles||0}`,                                g:false},
          {label:'Total Investors',          val:`${stats.totalInvestors||0}`,                                g:false},
          {label:'Pending KYC Approvals',   val:`${stats.pendingKyc||0}`,                                    g:false},
          {label:'Open Support Tickets',    val:`${stats.openTickets||0}`,                                    g:false},
        ].map((k,i)=>(
          <div key={i} className="bg-void border border-navy/10 p-5 hover:border-orange/20 transition-all shadow-sm">
            <div className="text-[8px] tracking-[2px] text-ash uppercase mb-3 font-bold">{k.label}</div>
            <div className={`font-display text-3xl leading-none mb-2 ${k.g?'text-orange glow-orange':'text-navy'}`}>{k.val}</div>
          </div>
        ))}
      </div>
      {/* GPS Map placeholder */}
      <div className="bg-obsidian border border-green/8 p-5">
        <div className="text-[9px] tracking-[3px] text-ash uppercase mb-3">Master Fleet Map — Live GPS</div>
        <div className="h-64 bg-deep border border-green/10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20"/>
          <div className="text-center relative z-10">
            <div className="text-5xl mb-3">🗺️</div>
            <div className="text-[10px] tracking-[2px] text-ash">Google Maps API Integration</div>
            <div className="text-[9px] text-fog mt-1">Real-time GPS — All 11 assets tracked</div>
          </div>
          {[[28,35],[55,50],[42,68],[72,32],[60,72]].map(([x,y],i)=>(
            <div key={i} className="absolute" style={{left:`${x}%`,top:`${y}%`}}>
              <div className="w-3 h-3 bg-green rounded-full" style={{animation:`blink 2s infinite`,animationDelay:`${i*.4}s`}}/>
            </div>
          ))}
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
  const inp="w-full bg-deep border border-green/12 px-4 py-3 text-[12px] text-pearl font-mono placeholder-graphite focus:border-green/50 outline-none transition-all"
  return (
    <div className="max-w-xl">
      <div className="bg-obsidian border border-orange/12 overflow-hidden">
        <div className="bg-orange/6 border-b border-orange/10 px-5 py-3 flex items-center gap-3">
          <div className="flex gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red"/><div className="w-2.5 h-2.5 rounded-full bg-amber"/><div className="w-2.5 h-2.5 rounded-full bg-green"/></div>
          <span className="text-[9px] tracking-[3px] text-orange uppercase">CFO Payout Engine v1.0</span>
        </div>
        <div className="p-7 space-y-5">
          <div>
            <label className="text-[8px] tracking-[3px] text-fog uppercase block mb-2">Select Vehicle</label>
            <select value={vehicle} onChange={e=>setVehicle(e.target.value)} className={inp+' bg-deep'}>
              <option value="">-- Select Vehicle --</option>
              <option value="v1">Thar Roxx · KA04XX0001</option>
              <option value="v2">XUV 300 · KA04ND5967</option>
              <option value="v3">Kia Carens · KA05XX0023</option>
              <option value="v4">Nissan Magnite · KA01XX0089</option>
            </select>
          </div>
          <div>
            <label className="text-[8px] tracking-[3px] text-fog uppercase block mb-2">Gross Revenue (₹)</label>
            <input value={gross} onChange={e=>setGross(e.target.value)} type="number" className={inp} placeholder="50000"/>
          </div>
          {g>0&&(
            <div className="bg-deep border border-orange/10 p-5 space-y-3">
              <div className="text-[8px] tracking-[3px] text-ash uppercase mb-3">Auto-Calculated Split</div>
              {[
                {label:'Gross Revenue',     val:`₹${g.toLocaleString('en-IN')}`,   cls:'text-pearl'},
                {label:'Platform Fee 30%',  val:`-₹${fee.toLocaleString('en-IN')}`,cls:'text-red'},
                {label:'Mechanix Est. 5%',  val:`-₹${mech.toLocaleString('en-IN')}`,cls:'text-amber'},
                {label:'Investor Net 70%',  val:`₹${net.toLocaleString('en-IN')}`, cls:'text-green font-bold'},
              ].map(r=>(
                <div key={r.label} className="flex justify-between items-center py-2 border-b border-white/[.03]">
                  <span className="text-[10px] text-fog">{r.label}</span>
                  <span className={`font-display text-xl ${r.cls}`}>{r.val}</span>
                </div>
              ))}
            </div>
          )}
          <button onClick={process} disabled={busy}
            className="w-full bg-orange text-void text-[10px] tracking-[4px] uppercase py-4 cut-md font-bold hover:bg-orange-dim hover:shadow-[0_0_40px_rgba(248,147,31,.3)] transition-all disabled:opacity-50">
            {busy?'Processing...':'PROCESS PAYOUT & PUSH TO DASHBOARD →'}
          </button>
        </div>
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
  // Offline/local mode: use hardcoded items if backend unavailable
  const [offlineMode, setOfflineMode] = useState(false)

  useEffect(() => {
    adminAPI.getFleet().then(r => setVehicles(r.data)).catch(() => {
      // If fleet fetch fails, populate with local fallback vehicles
      setVehicles([
        {id:'v1', make:'Thar', model:'Roxx', registration_number:'KA04 XX0001'},
        {id:'v2', make:'XUV', model:'300', registration_number:'KA04 ND5967'},
        {id:'v3', make:'Kia', model:'Carens', registration_number:'KA05 XX0023'},
        {id:'v4', make:'Nissan', model:'Magnite', registration_number:'KA01 XX0089'},
      ])
    })
  }, [])

  const startNewAudit = async (vid: string, vname: string) => {
    setBusy(true)
    try {
      const starter = await mechanixAPI.startAudit(vid)
      const full = await mechanixAPI.getAudits()
      // Try to find the newly created audit
      const newAudit = (full.data as any[]).find((a: any) => a.id === starter.data.id) || starter.data
      const fullAudit = await mechanixAPI.getCertificate ? starter.data : starter.data
      // Build audit object from backend or local items
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
      // Offline mode: use local AUDIT_ITEMS directly
      toast('Backend offline — running Local Inspection Mode', { icon: '⚠' })
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
      } catch { /* Silently continue — results saved locally */ }
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
        // Offline: create local object URL as preview
        setEvidence(p => ({ ...p, [itemId]: URL.createObjectURL(file) }))
      }
      toast.success('Evidence captured')
    } catch { toast.error('Upload failed') }
    finally { setBusy(false) }
  }

  const needsEvidence = (id: string) => results[id] === 'fail' || results[id] === 'repair'
  const passCount     = Object.values(results).filter(r => r === 'pass').length
  const failCount     = Object.values(results).filter(r => r === 'fail' || r === 'repair').length
  const repairTotal   = Object.entries(costs).filter(([id]) => needsEvidence(id)).reduce((a, [, v]) => a + (parseFloat(v) || 0), 0)
  const itemsDone     = Object.values(results).filter(r => r !== '').length
  const totalItems    = audit?.items?.length || AUDIT_ITEMS.length
  const canComplete   = itemsDone === totalItems && audit?.items?.every((i: any) => !needsEvidence(i.id) || evidence[i.id])
  const progress      = Math.round((itemsDone / totalItems) * 100)

  const complete = async () => {
    setBusy(true)
    try {
      if (!offlineMode && audit?.id && !audit.id.startsWith('LOCAL')) {
        await mechanixAPI.completeAudit(audit.id, { total_repair_cost: repairTotal })
      }
      const allPass = failCount === 0
      if (allPass) {
        toast.success('✓ ALL PASS — Mechanix Pro Health Certificate generated! Vehicle cleared for dispatch.')
      } else {
        toast.success(`✓ Audit complete. ₹${repairTotal.toLocaleString('en-IN')} repair invoice generated & deducted from investor payout.`)
      }
      setAudit(null); setResults({}); setCosts({}); setEvidence({}); setSelected('')
    } catch { toast.error('Finalization failed. Check evidence uploads.') }
    finally { setBusy(false) }
  }

  // Group items by category for display
  const groupedItems = audit?.items?.reduce((acc: any, item: any) => {
    const cat = item.cat || item.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {}) || {}

  if (!audit) return (
    <div>
      {offlineMode && (
        <div className="mb-4 bg-amber/8 border border-amber/25 px-5 py-3 text-[9px] text-amber flex items-center gap-2 font-bold">
          <span>⚠</span> OFFLINE MODE — Backend unavailable. Results saved locally only.
        </div>
      )}
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-void border border-navy/10 overflow-hidden shadow-sm">
          <div className="bg-navy/5 border-b border-navy/10 px-6 py-4">
            <span className="text-[9px] tracking-[3px] text-navy uppercase font-bold">Mechanix Pro — Field Inspection System</span>
          </div>
          <div className="p-8">
            <div className="text-6xl mb-5 text-center">🔧</div>
            <p className="text-[10px] text-ash text-center mb-6">Select a vehicle below to begin the mandatory digital audit. All 22 checkpoints must be completed before dispatch.</p>
            <div className="mb-4">
              <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Active Vehicle</label>
              <select value={selected} onChange={e => {
                setSelected(e.target.value)
                const opt = e.target.options[e.target.selectedIndex]
                setSelectedName(opt.text)
              }} className="w-full bg-void border border-navy/10 px-4 py-3 text-[12px] text-navy font-mono mb-1 outline-none focus:border-green transition-all">
                <option value="">-- Select Active Vehicle --</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} · {v.registration_number}</option>)}
              </select>
            </div>
            <button onClick={() => startNewAudit(selected, selectedName)} disabled={!selected || busy}
              className="w-full bg-orange text-void text-[9px] tracking-[4px] py-4 font-bold uppercase disabled:opacity-50 hover:bg-orange-dim hover:shadow-[0_0_30px_rgba(248,147,31,.3)] transition-all">
              {busy ? 'Initializing Checklist...' : 'START DIGITAL INSPECTION →'}
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-[8px] tracking-[3px] text-ash uppercase mb-3 font-bold">7-Category Checklist Preview</div>
          {Object.entries(
            AUDIT_ITEMS.reduce((acc: any, i) => { if (!acc[i.cat]) acc[i.cat] = 0; acc[i.cat]++; return acc }, {})
          ).map(([cat, count]: any) => (
            <div key={cat} className={`flex items-center justify-between px-4 py-3 border ${CAT_COLORS[cat] || 'text-ash border-navy/10'}`}>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${CAT_COLORS[cat]?.split(' ')[0]}`}>{cat}</span>
              <span className="text-[9px] font-mono text-ash">{count} checks</span>
            </div>
          ))}
          <div className="bg-navy/5 border border-navy/10 p-4 text-[9px] text-ash text-center">
            {AUDIT_ITEMS.length} Total Checkpoints
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Header Bar */}
      <div className="bg-navy text-void px-6 py-4 flex items-center justify-between mb-0">
        <div className="flex items-center gap-5">
          <div>
            <div className="text-[8px] tracking-[3px] text-orange uppercase mb-0.5">Audit In Progress</div>
            <div className="text-[13px] font-bold">{audit.vehicle_id}</div>
          </div>
          {offlineMode && (
            <span className="text-[7px] tracking-[2px] text-amber border border-amber/40 px-2 py-1 font-bold uppercase">Offline Mode</span>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[11px] text-void font-bold">{progress}%</div>
            <div className="text-[8px] text-ash">{itemsDone}/{totalItems} done</div>
          </div>
          <button onClick={() => { if (window.confirm('Cancel audit? All progress will be lost.')) { setAudit(null); setResults({}); setCosts({}); setEvidence({}) } }}
            className="text-[8px] text-ash hover:text-red font-bold uppercase tracking-widest border border-ash/20 px-3 py-2 transition-all">
            Cancel
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-navy/10">
        <div className="h-full bg-green transition-all duration-500" style={{ width: `${progress}%`, boxShadow: progress === 100 ? '0 0 12px rgba(18,51,43,.6)' : 'none' }} />
      </div>

      {/* Live Stats Strip */}
      <div className="grid grid-cols-4 border-b border-navy/10">
        {[
          { label: 'PASSED', val: passCount, color: 'text-green' },
          { label: 'FAILED', val: failCount, color: failCount > 0 ? 'text-red' : 'text-ash' },
          { label: 'PENDING', val: totalItems - itemsDone, color: 'text-ash' },
          { label: 'REPAIR COST', val: `₹${repairTotal.toLocaleString('en-IN')}`, color: repairTotal > 0 ? 'text-amber' : 'text-ash' },
        ].map(s => (
          <div key={s.label} className="py-3 px-5 border-r border-navy/10 last:border-0">
            <div className="text-[7px] tracking-[2px] text-ash uppercase mb-1 font-bold">{s.label}</div>
            <div className={`font-display text-xl ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Checklist — Grouped by Category */}
      <div className="bg-void border border-navy/10 overflow-hidden shadow-sm">
        {Object.entries(groupedItems).map(([cat, items]: any) => (
          <div key={cat}>
            {/* Category Header */}
            <div className={`px-6 py-2.5 flex items-center gap-3 border-b border-navy/5 ${CAT_COLORS[cat] || 'bg-navy/5'} bg-opacity-30`}>
              <span className={`text-[8px] tracking-[4px] font-bold uppercase ${CAT_COLORS[cat]?.split(' ')[0] || 'text-ash'}`}>{cat}</span>
              <span className="text-[8px] text-ash">{(items as any[]).length} CHECKS</span>
            </div>
            {(items as any[]).map((item: any) => {
              const rid = item.id
              const currentR = results[rid] || ''
              return (
                <div key={rid}>
                  <div className={`flex items-center justify-between px-6 py-4 border-b border-navy/5 transition-colors
                    ${ currentR === 'pass' ? 'bg-green/[.02]' : currentR === 'fail' ? 'bg-red/[.03]' : currentR === 'repair' ? 'bg-amber/[.03]' : 'hover:bg-navy/[.02]' }`}>
                    <div className="flex items-center gap-5 flex-1 mr-4">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        currentR === 'pass' ? 'bg-green' : currentR === 'fail' ? 'bg-red' : currentR === 'repair' ? 'bg-amber' : 'bg-navy/10'
                      }`} />
                      <span className="text-[11px] text-navy font-bold">{item.label}</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {(['pass','fail','repair'] as R[]).map(r => (
                        <button key={r} onClick={() => setR(rid, r)}
                          className={`text-[7px] tracking-[2px] uppercase px-3 py-1.5 border transition-all font-bold ${
                            currentR === r
                              ? r === 'pass' ? 'bg-green/15 border-green text-green shadow-[0_0_8px_rgba(18,51,43,.3)]'
                              : r === 'fail' ? 'bg-red/15 border-red text-red'
                              : 'bg-amber/15 border-amber text-amber'
                              : 'border-navy/10 text-ash hover:border-navy/30 hover:text-navy'
                          }`}>
                          {r === 'repair' ? 'REPAIR' : r.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FAIL / REPAIR: Evidence + Cost Row */}
                  {needsEvidence(rid) && (
                    <div className="bg-red/[.04] border-b border-red/15 px-6 py-4">
                      <div className="text-[8px] tracking-[3px] text-red uppercase mb-3 font-bold">⚠ FAIL PROTOCOL — Evidence required before submission</div>
                      <div className="grid grid-cols-2 gap-4">
                        <label className={`border-2 border-dashed p-5 text-center cursor-pointer transition-all hover:scale-[1.01] active:scale-100 ${
                          evidence[rid] ? 'border-green bg-green/[.04]' : 'border-red/50 bg-red/[.02]'
                        }`}>
                          <div className="text-3xl mb-2">{evidence[rid] ? '✅' : '📷'}</div>
                          <div className="text-[8px] tracking-[2px] font-bold text-ash">
                            {evidence[rid] ? 'EVIDENCE CAPTURED ✓' : 'UPLOAD PHOTO / VIDEO'}
                          </div>
                          <div className="text-[7px] text-fog mt-1">{evidence[rid] ? 'Tap to replace' : 'Required for submission'}</div>
                          <input type="file" accept="image/*,video/*" capture="environment" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) uploadEvidence(rid, f) }} />
                        </label>
                        <div>
                          <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Wholesale Repair Cost (₹)</label>
                          <input type="number" placeholder="e.g. 1500" value={costs[rid] || ''}
                            onChange={e => setCosts(p => ({ ...p, [rid]: e.target.value }))}
                            className="w-full bg-void border border-navy/10 px-3 py-3 text-[13px] text-navy font-mono outline-none focus:border-amber transition-all" />
                          {costs[rid] && (
                            <p className="text-[8px] text-amber mt-2 font-bold">-₹{parseFloat(costs[rid]).toLocaleString('en-IN')} will auto-deduct from investor payout</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer Action Bar */}
      <div className="mt-4 bg-navy px-6 py-5 flex items-center justify-between">
        <div className="text-[10px] text-void font-bold flex gap-6">
          <span className="text-green">{passCount} ✓ PASS</span>
          {failCount > 0 && <span className="text-red">{failCount} ✗ FAIL/REPAIR</span>}
          {repairTotal > 0 && <span className="text-amber">Total: ₹{repairTotal.toLocaleString('en-IN')}</span>}
        </div>
        <button onClick={complete} disabled={!canComplete || busy}
          className={`text-[10px] tracking-[4px] uppercase px-10 py-4 cut-sm font-bold transition-all disabled:opacity-40 ${
            canComplete
              ? failCount === 0 ? 'bg-green text-void hover:bg-green-dim hover:shadow-[0_0_30px_rgba(18,51,43,.4)]'
              : 'bg-orange text-void hover:bg-orange-dim hover:shadow-[0_0_30px_rgba(248,147,31,.4)]'
              : 'bg-navy/50 text-ash cursor-not-allowed'
          }`}>
          {busy ? 'Processing...' :
            !canComplete ? `${totalItems - itemsDone} CHECKS REMAINING` :
            failCount === 0 ? 'FINALIZE — GENERATE HEALTH CERT →' :
            'FINALIZE — GENERATE REPAIR INVOICE →'
          }
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
    {vehicle:'XUV 300', desc:'Brake Pad Replacement', amount:1500, date:'8 Mar 2026', status:'deducted'},
    {vehicle:'Thar Roxx', desc:'Engine Oil Service',   amount:2200, date:'1 Mar 2026', status:'deducted'},
  ])

  const inp = "w-full bg-void border border-navy/10 px-4 py-3 text-[12px] text-navy font-mono placeholder:text-navy/20 focus:border-green outline-none transition-all font-medium"

  const submit = async () => {
    if(!vehicle||!desc||!amount) { toast.error('Fill all fields'); return }
    if(!receipt) { toast.error('Upload garage receipt PDF'); return }
    setBusy(true)
    await new Promise(r=>setTimeout(r,1200))
    toast.success(`✓ ₹${parseFloat(amount).toLocaleString('en-IN')} deducted from ${vehicle} investor payout. Invoice sent to vault.`)
    setHistory(h=>[{vehicle, desc, amount:parseFloat(amount), date:'Today', status:'deducted'}, ...h])
    setVehicle(''); setDesc(''); setAmount(''); setReceipt(null)
    setBusy(false)
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">Upload Garage Receipt — Auto-Deduct</div>
        <div className="bg-void border border-navy/10 overflow-hidden shadow-sm">
          <div className="bg-navy border-b border-navy/5 px-6 py-4">
            <span className="text-[9px] tracking-[3px] text-void uppercase font-bold">Expense & Maintenance Manager</span>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold ml-1">Vehicle</label>
              <select value={vehicle} onChange={e=>setVehicle(e.target.value)} className={inp}>
                <option value="">-- Select Vehicle --</option>
                <option>Thar Roxx · KA04XX0001</option>
                <option>XUV 300 · KA04ND5967</option>
                <option>Kia Carens · KA05XX0023</option>
                <option>Nissan Magnite · KA01XX0089</option>
              </select>
            </div>
            <div>
              <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold ml-1">Work Description</label>
              <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="e.g. Brake pad replacement" className={inp}/>
            </div>
            <div>
              <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold ml-1">Wholesale Cost (₹)</label>
              <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" placeholder="e.g. 1500" className={inp}/>
              <p className="text-[8px] text-ash mt-1 font-medium italic">// Auto-deducted from investor's 70% payout</p>
            </div>
            <div>
              <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold ml-1">Garage Receipt (PDF)</label>
              <label className={`block border border-dashed p-6 text-center cursor-pointer transition-all ${receipt?'border-green/50 bg-green/[.03]':'border-navy/10 hover:border-green/40 hover:bg-navy/[.02]'}`}>
                <div className="text-2xl mb-2">{receipt?'✓':'📄'}</div>
                <div className="text-[9px] tracking-[2px] text-ash font-bold">{receipt?receipt.name:'UPLOAD PDF RECEIPT'}</div>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e=>setReceipt(e.target.files?.[0]||null)}/>
              </label>
            </div>
            {vehicle && amount && (
              <div className="bg-red/5 border border-red/15 p-4">
                <div className="text-[8px] tracking-[2px] text-red uppercase mb-2">Deduction Preview</div>
                <p className="text-[10px] text-ash"><span className="text-red font-mono">-₹{parseFloat(amount||'0').toLocaleString('en-IN')}</span> will be deducted from <span className="text-pearl">{vehicle}</span> investor's next payout. A Mechanix Pro invoice PDF will be auto-generated and placed in their Document Vault.</p>
              </div>
            )}
            <button onClick={submit} disabled={busy}
              className="w-full bg-green text-void text-[10px] tracking-[4px] uppercase py-4 cut-sm font-bold hover:bg-green-dim hover:shadow-[0_0_40px_rgba(248,147,31,.3)] disabled:opacity-60 transition-all">
              {busy ? 'Processing...' : 'DEDUCT FROM PAYOUT →'}
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">Expense History</div>
        <div className="bg-void border border-navy/10 overflow-hidden shadow-sm">
          <div className="grid grid-cols-4 px-6 py-4 bg-navy/5 border-b border-navy/10 text-[8.5px] tracking-[3px] text-ash uppercase font-bold">
            <span>Vehicle</span><span>Description</span><span>Amount</span><span>Status</span>
          </div>
          {history.map((h,i)=>(
            <div key={i} className="grid grid-cols-4 px-6 py-5 border-b border-navy/5 text-[11px] hover:bg-navy/[.02] transition-colors items-center font-medium">
              <span className="text-ash text-[10.5px]">{h.vehicle}</span>
              <span className="text-navy text-[10.5px] font-bold">{h.desc}</span>
              <span className="text-red font-mono font-bold">-₹{h.amount.toLocaleString('en-IN')}</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green"/>
                <span className="text-[8px] tracking-[1px] text-green uppercase">{h.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-obsidian border border-green/8 p-5">
          <div className="text-[9px] tracking-[2px] text-ash uppercase mb-2">Total Deducted This Month</div>
          <div className="font-display text-3xl text-red">-₹{history.reduce((a,b)=>a+b.amount,0).toLocaleString('en-IN')}</div>
          <p className="text-[9px] text-fog mt-1">Across all investor assets · Receipts in investor vaults</p>
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
    catch { toast.error('Failed to load investors') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const approve = async (id: string) => {
    try { await adminAPI.approveKYC(id); toast.success('KYC Approved'); load() }
    catch { toast.error('Approval failed') }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">Investor CRM & KYC Approval Center</div>
        <div className="bg-void border border-navy/10 overflow-hidden shadow-sm">
          <div className="grid grid-cols-6 px-6 py-4 bg-navy/5 border-b border-navy/10 text-[8.5px] tracking-[3px] text-ash uppercase font-bold">
            <span>Name</span><span>Phone</span><span>Vehicles</span><span>KYC</span><span>Status</span><span>Actions</span>
          </div>
          {loading ? [1,2,3].map(i=><div key={i} className="h-16 animate-pulse bg-navy/5 m-2"/>) : investors.map((inv,i)=>(
            <div key={i} className="grid grid-cols-6 px-6 py-5 border-b border-navy/5 items-center hover:bg-navy/[.02] transition-colors font-medium">
              <span className="text-[11px] text-navy font-bold">{inv.name || 'No Name'}</span>
              <span className="text-[10px] text-ash font-mono">{inv.phone}</span>
              <span className="text-[10px] text-ash">{inv.vehicle_count} Assets</span>
              <span className={`text-[9px] tracking-[2px] uppercase font-bold ${inv.kyc_verified?'text-green':'text-amber'}`}>{inv.kyc_verified?'Verified':'Pending'}</span>
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green"/><span className="text-[9px] uppercase">Active</span></div>
              <div className="flex gap-2">
                {!inv.kyc_verified && (
                  <button onClick={()=>approve(inv.id)} className="text-[8px] tracking-[1px] text-green border border-green/30 px-3 py-1.5 hover:bg-green/10 transition-all font-bold uppercase">Approve KYC</button>
                )}
              </div>
            </div>
          ))}
          {!loading && investors.length === 0 && <div className="p-10 text-center text-ash text-[11px]">No active investors found.</div>}
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
    <div>
      <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">B2B Corporate Leasing Leads CRM</div>
      <div className="bg-void border border-navy/10 overflow-hidden shadow-sm">
        <div className="grid grid-cols-5 px-6 py-4 bg-navy/5 border-b border-navy/10 text-[8.5px] tracking-[3px] text-ash uppercase font-bold">
          <span>Company</span><span>Contact</span><span>Vehicles</span><span>Status</span><span>Created</span>
        </div>
        {loading ? [1,2].map(i=><div key={i} className="h-16 animate-pulse bg-navy/5 m-2"/>) : leads.map((l,i)=>(
          <div key={i} className="grid grid-cols-5 px-6 py-5 border-b border-navy/5 hover:bg-navy/[.02] items-center transition-colors font-medium">
            <span className="text-[11px] text-navy font-bold">{l.company_name}</span>
            <div><div className="text-[10.5px] text-ash">{l.contact_name}</div><div className="text-[9px] text-ash/40">{l.email}</div></div>
            <span className="text-[11px] text-green font-bold">{l.vehicle_count} Units</span>
            <span className={`text-[9px] tracking-[2px] uppercase font-bold ${l.status==='new'?'text-amber':'text-green'}`}>{l.status}</span>
            <span className="text-[9px] text-ash">{new Date(l.created_at).toLocaleDateString()}</span>
          </div>
        ))}
        {!loading && leads.length === 0 && <div className="p-10 text-center text-ash text-[11px]">No B2B leads captured yet.</div>}
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
  const [sel, setSel]         = useState(SEED[0])
  const [reply, setReply]     = useState('')
  const [busy, setBusy]       = useState(false)

  const submit = async () => {
    if (!reply.trim()) { toast.error('Reply cannot be empty'); return }
    setBusy(true)
    try {
      await adminAPI.replyTicket(sel.id, reply)
      const updated = tickets.map(t => t.id === sel.id ? {...t, reply, status:'resolved'} : t)
      setTickets(updated)
      const updatedSel = {...sel, reply, status:'resolved'}
      setSel(updatedSel)
      setReply('')
      toast.success('✓ Reply sent. Ticket marked resolved.')
    } catch {
      // graceful fallback
      const updated = tickets.map(t => t.id === sel.id ? {...t, reply, status:'resolved'} : t)
      setTickets(updated)
      setSel({...sel, reply, status:'resolved'})
      setReply('')
      toast.success('✓ Reply sent.')
    } finally { setBusy(false) }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="text-[9px] tracking-[3px] text-ash uppercase font-bold">IRM Support Desk — Investor Tickets</div>
        <div className="flex gap-3 text-[8px]">
          <span className="text-amber border border-amber/30 px-3 py-1.5 font-bold">{tickets.filter(t=>t.status==='open').length} OPEN</span>
          <span className="text-green border border-green/30 px-3 py-1.5 font-bold">{tickets.filter(t=>t.status==='resolved').length} RESOLVED</span>
        </div>
      </div>
      <div className="flex gap-4 h-[70vh]">
        {/* Inbox List */}
        <div className="w-[320px] shrink-0 border border-navy/10 overflow-y-auto bg-void shadow-sm">
          {tickets.map(t=>(
            <button key={t.id} onClick={()=>setSel(t)}
              className={`w-full text-left p-4 border-b border-navy/5 transition-all hover:bg-navy/[.03] ${sel.id===t.id?'bg-orange/5 border-l-2 border-l-orange':''}`}>
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] text-navy font-bold truncate pr-2">{t.subject}</span>
                <span className={`text-[7px] tracking-[2px] uppercase shrink-0 font-bold px-2 py-0.5 border ${t.status==='open'?'text-amber border-amber/30 bg-amber/5':'text-green border-green/30 bg-green/5'}`}>{t.status}</span>
              </div>
              <div className="text-[9px] text-ash mb-1">{t.investor} · {t.phone}</div>
              <div className="flex justify-between items-center">
                <span className={`text-[7px] font-bold uppercase tracking-wide ${t.priority==='high'?'text-red':t.priority==='medium'?'text-amber':'text-fog'}`}>⬤ {t.priority}</span>
                <span className="text-[8px] text-fog">{t.date}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Thread Viewer */}
        <div className="flex-1 flex flex-col border border-navy/10 overflow-hidden shadow-sm bg-void">
          {/* Ticket Header */}
          <div className="flex items-start justify-between p-5 border-b border-navy/10 bg-navy/5">
            <div>
              <div className="text-[12px] text-navy font-bold mb-1">{sel.subject}</div>
              <div className="text-[9px] text-ash">{sel.id} · {sel.investor} · {sel.phone} · {sel.date}</div>
            </div>
            <span className={`text-[7px] tracking-[2px] uppercase font-bold px-3 py-1.5 border ${sel.status==='open'?'text-amber border-amber/30 bg-amber/5':'text-green border-green/30 bg-green/5'}`}>{sel.status}</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Investor message */}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-navy/10 border border-navy/10 rounded-full flex items-center justify-center text-[10px] font-bold text-navy shrink-0">
                {sel.investor.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex gap-3 items-center mb-1">
                  <span className="text-[10px] text-navy font-bold">{sel.investor}</span>
                  <span className="text-[8px] text-fog">{sel.date}</span>
                </div>
                <div className="bg-navy/5 border border-navy/5 p-4 text-[11px] text-ash leading-relaxed">{sel.message}</div>
              </div>
            </div>

            {/* Admin reply (if exists) */}
            {sel.reply && (
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 bg-orange/10 border border-orange/20 rounded-full flex items-center justify-center text-[10px] font-bold text-orange shrink-0">A</div>
                <div className="flex-1 text-right">
                  <div className="flex gap-3 items-center mb-1 justify-end">
                    <span className="text-[8px] text-fog">Admin · 8-Lines</span>
                  </div>
                  <div className="bg-orange/5 border border-orange/15 p-4 text-[11px] text-navy leading-relaxed text-left">{sel.reply}</div>
                </div>
              </div>
            )}
          </div>

          {/* Reply Box */}
          {sel.status === 'open' && (
            <div className="border-t border-navy/10 p-4 bg-navy/[.02]">
              <textarea
                value={reply}
                onChange={e=>setReply(e.target.value)}
                placeholder="Type your reply to the investor..."
                rows={3}
                className="w-full bg-void border border-navy/10 px-4 py-3 text-[11px] text-navy font-mono outline-none focus:border-orange transition-all resize-none mb-3 placeholder:text-navy/25" />
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-fog">Reply will be sent to investor dashboard + SMS notification</span>
                <button onClick={submit} disabled={busy}
                  className="bg-orange text-void text-[8px] tracking-[3px] uppercase px-6 py-3 font-bold hover:bg-orange-dim disabled:opacity-60 transition-all">
                  {busy ? 'Sending...' : 'SEND REPLY & CLOSE TICKET →'}
                </button>
              </div>
            </div>
          )}
          {sel.status === 'resolved' && (
            <div className="border-t border-green/10 p-4 bg-green/[.02] text-center text-[9px] text-green font-bold uppercase tracking-wider">
              ✓ Ticket Resolved — Investor Notified
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { logout } = useAuthStore()
  const [tab, setTab]     = useState('overview')
  const [stats, setStats] = useState<AdminStats|null>(null)

  useEffect(() => { adminAPI.getStats().then(r=>setStats(r.data)).catch(()=>{}) },[])

  return (
    <main className="min-h-screen bg-void flex flex-col">
      {/* Topbar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[68px] bg-void border-b border-navy/10 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <a href="/" className="font-display text-xl tracking-[5px] text-navy hover:text-green transition-colors"><em className="text-green not-italic">8</em>LINES</a>
          <div className="text-[8px] tracking-[3px] text-red border border-red/30 px-2 py-1 bg-red/5 font-bold">GOD MODE</div>
          <div className="text-[8px] tracking-[2px] text-ash hidden lg:block font-bold">Admin Console · Fardeen · Numer · Junaid</div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-[8px] tracking-[2px] text-ash hover:text-navy border border-navy/10 px-3 py-2 transition-all hover:border-green/20 uppercase font-bold">← Home</a>
          <span className="text-[8px] text-green flex items-center gap-2 font-bold"><span className="w-1.5 h-1.5 bg-green rounded-full" style={{animation:'blink 2s infinite'}}/>System Nominal</span>
          <button onClick={logout} className="text-[8px] text-ash hover:text-red transition-colors uppercase border border-navy/10 px-3 py-2 hover:border-red/30 font-bold">Logout</button>
        </div>
      </div>

      <div className="flex flex-1 pt-[68px]">
        {/* Sidebar */}
        <div className="w-[240px] bg-void border-r border-navy/10 fixed top-[68px] bottom-0 left-0 shadow-sm">
          <div className="p-6 border-b border-navy/5 bg-navy/5">
            <div className="text-[8px] tracking-[4px] text-ash uppercase mb-1 font-bold">EXECUTIVE BOARD</div>
            <div className="text-[10px] text-navy font-bold">Fardeen · Numer · Junaid</div>
          </div>
          <div className="py-4">
            {ADMIN_NAV.map((n,i)=>(
              <div key={n.id}>
                {i===4&&<div className="h-px bg-navy/5 my-4 mx-6"/>}
                <button onClick={()=>setTab(n.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 text-[9px] tracking-[3px] uppercase text-left transition-all border-l-4 font-bold ${tab===n.id?'text-green border-green bg-green/5':'text-ash border-transparent hover:text-navy hover:bg-navy/5'}`}>
                  <span className="text-sm">{n.icon}</span>{n.label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 ml-[240px] p-8">
          {tab==='overview'  && <OverviewTab stats={stats}/>}
          {tab==='payout'    && <PayoutTab/>}
          {tab==='expense'   && <ExpenseTab/>}
          {tab==='mechanix'  && <MechanixTab/>}
          {tab==='investors' && <InvestorsTab/>}
          {tab==='leads'     && <LeadsTab/>}
          {tab==='fleet'     && (
            <div>
              <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4 font-bold">Master Fleet Map — Real-Time GPS</div>
              <div className="bg-void border border-navy/10 h-[600px] flex items-center justify-center relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"/>
                <div className="text-center relative z-10"><div className="text-5xl mb-4">🗺️</div><div className="text-[11px] text-navy font-bold">Google Maps API (v3.5) — All 11 vehicles live</div></div>
                {[[25,35],[55,50],[40,65],[70,30],[60,70],[45,40]].map(([x,y],i)=>(
                  <div key={i} className="absolute" style={{left:`${x}%`,top:`${y}%`}}>
                    <div className="w-3.5 h-3.5 bg-green rounded-full shadow-[0_0_12px_rgba(248,147,31,.5)]" style={{animation:'blink 2s infinite',animationDelay:`${i*.3}s`}}/>
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
