'use client'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store'
import { investorAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { InvestorStats, Trip } from '@/types'

const NAV = [
  {id:'overview',  icon:'◉',  label:'Overview'},
  {id:'ledger',    icon:'≡',  label:'Ledger'},
  {id:'fleet',     icon:'⊞',  label:'My Fleet'},
  {id:'calendar',  icon:'⊡',  label:'Pause Calendar'},
  {id:'tickets',   icon:'◫',  label:'IRM Tickets'},
  {id:'tax',       icon:'↓',  label:'Tax Export'},
  {id:'kyc',       icon:'⚷',  label:'KYC Vault'},
  {id:'bank',      icon:'₹',  label:'Bank Details'},
  {id:'documents', icon:'📁', label:'Document Vault'},
  {id:'addasset',  icon:'+',  label:'Add Asset'},
]

function KpiCard({label,val,change,green=false}:{label:string;val:string;change:string;green?:boolean}) {
  return (
    <div className="bg-void border border-navy/10 p-5 hover:border-green/20 transition-all group relative overflow-hidden shadow-sm">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="text-[8px] tracking-[2px] text-ash uppercase mb-3 font-bold">{label}</div>
      <div className={`font-display text-3xl leading-none mb-2 ${green?'text-green glow-green':'text-navy'}`}>{val}</div>
      <div className={`text-[9px] font-bold ${green?'text-green':'text-ash'}`}>{change}</div>
    </div>
  )
}

const MONTHS = ['Oct','Nov','Dec','Jan','Feb','Mar']
const MOCK_YIELDS = [18400, 22100, 19800, 25600, 21300, 24800]

function MiniChart() {
  const max = Math.max(...MOCK_YIELDS)
  return (
    <div className="flex items-end gap-2 h-20">
      {MOCK_YIELDS.map((v,i)=>(
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-green/80 transition-all duration-700 hover:bg-green cursor-default group relative"
            style={{height:`${(v/max)*100}%`, boxShadow:i===5?'0 0 12px rgba(18,51,43,.5)':'none', opacity:i===5?1:0.5}}>
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-void border border-green/25 px-2 py-1 text-[8px] text-green whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              ₹{v.toLocaleString('en-IN')}
            </div>
          </div>
          <span className="text-[7px] text-fog">{MONTHS[i]}</span>
        </div>
      ))}
    </div>
  )
}

function OverviewTab({stats}:{stats:InvestorStats|null}) {
  if(!stats) return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3].map(i=>(
          <div key={i} className="bg-void border border-navy/5 p-5 animate-pulse">
            <div className="h-2 bg-obsidian w-24 mb-3 rounded"/><div className="h-8 bg-obsidian w-32 mb-2 rounded"/><div className="h-2 bg-obsidian w-20 rounded"/>
          </div>
        ))}
      </div>
      <div className="bg-void border border-navy/5 p-8 text-center text-ash text-[11px] font-medium italic">Loading dashboard data...</div>
    </div>
  )
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Locked-In Future Revenue" val={`₹${(stats.lockedRevenue||0).toLocaleString('en-IN')}`} change={`↑ ${stats.upcomingBookings||0} upcoming bookings`} green />
        <KpiCard label="Next Payout Date" val={stats.nextPayoutDate||'15 Mar 2026'} change={`₹${(stats.nextPayoutAmount||0).toLocaleString('en-IN')} estimated`} />
        <KpiCard label="This Month Net Yield" val={`₹${(stats.thisMonthNet||24800).toLocaleString('en-IN')}`} change="↑ +16.4% vs last month" green />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-obsidian border border-green/8 p-5">
          <div className="flex justify-between items-center mb-5">
            <span className="text-[9px] tracking-[3px] text-ash uppercase">6-Month Yield Trend</span>
            <span className="text-[8px] text-green border border-green/20 px-2 py-1">+34.8% 6M</span>
          </div>
          <MiniChart />
          <div className="mt-3 pt-3 border-t border-green/8 flex justify-between text-[9px]">
            <span className="text-fog">6-Month Total</span>
            <span className="text-green font-mono">₹{MOCK_YIELDS.reduce((a,b)=>a+b,0).toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="bg-obsidian border border-green/8 p-5">
          <div className="text-[9px] tracking-[3px] text-ash uppercase mb-5">Revenue Split — Mar 2026</div>
          <div className="space-y-3">
            {[
              {label:'Gross Revenue',      val:'₹35,429', color:'text-pearl', bar:100},
              {label:'Your 70% Yield',     val:'₹24,800', color:'text-green',  bar:70},
              {label:'Platform Fee (25%)', val:'-₹8,857', color:'text-fog',    bar:25},
              {label:'Mechanix (5%)',      val:'-₹1,771', color:'text-amber',  bar:5},
            ].map(r=>(
              <div key={r.label}>
                <div className="flex justify-between text-[9px] mb-1">
                  <span className="text-fog">{r.label}</span><span className={r.color}>{r.val}</span>
                </div>
                <div className="h-0.5 bg-graphite">
                  <div className={`h-full ${r.color==='text-green'?'bg-green':r.color==='text-amber'?'bg-amber':'bg-graphite/80'}`} style={{width:`${r.bar}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-obsidian border border-green/8 p-5">
          <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">Asset Health Score</div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-pearl font-mono">XUV 300 · KA04ND5967</span>
            <div className="flex items-center gap-2">
              <span className="text-[8px] text-green border border-green/20 px-2 py-0.5">ACTIVE</span>
              <span className="text-[10px] text-green">95%</span>
            </div>
          </div>
          <div className="h-1.5 bg-graphite mb-4">
            <div className="h-full bg-green" style={{width:'95%', boxShadow:'0 0 8px rgba(18,51,43,.4)'}}/>
          </div>
          <div className="text-[9px] text-fog">Last MECHANIX PRO audit: 8 Mar 2026 · <span className="text-green">ALL PASS ✓</span></div>
        </div>
        <div className="bg-obsidian border border-green/8 p-5">
          <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">Emergency Pause — Q1 2026</div>
          <div className="flex gap-2 mb-3">
            {[1,2,3,4,5].map(i=>(
              <div key={i} className={`w-10 h-10 border flex flex-col items-center justify-center text-[10px] ${i<=(stats.pauseDaysUsed||0)?'bg-amber/15 border-amber text-amber':'border-green/20 text-fog'}`}>
                <span className="font-display text-sm">{i}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-fog">{stats.pauseDaysUsed||0}/5 used · <span className="text-green">{stats.pauseDaysRemaining||5} remaining this quarter</span></p>
        </div>
      </div>
    </div>
  )
}

function LedgerTab({trips}:{trips:Trip[]}) {
  const doExport = async () => {
    try {
      const res = await investorAPI.exportLedger()
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a'); a.href=url; a.download='8lines-ledger.xlsx'; a.click()
      toast.success('✓ CA-ready export downloaded')
    } catch { toast.error('Export failed') }
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-[9px] tracking-[3px] text-ash uppercase">Trip-by-Trip Financial Breakdown</span>
        <button onClick={doExport} className="text-[8px] tracking-[2px] text-green border border-green/25 px-4 py-2 bg-green/4 hover:bg-green/10 transition-colors">One-Click CA Export ↓</button>
      </div>
      <div className="bg-obsidian border border-green/8 overflow-hidden">
        <div className="grid grid-cols-5 px-5 py-3 border-b border-green/10 text-[8px] tracking-[2px] text-fog uppercase">
          <span>Trip ID</span><span>Gross Rent</span><span>30% Fee</span><span>Mechanix</span><span>Net 70%</span>
        </div>
        {trips.length === 0
          ? <div className="p-10 text-center text-fog text-[11px]">No trips recorded yet.</div>
          : trips.map(t=>(
            <div key={t.id} className="grid grid-cols-5 px-5 py-4 border-b border-white/[.03] text-[11px] hover:bg-green/[.02] transition-colors">
              <span className="text-ash font-mono">#{t.id.slice(0,8)}</span>
              <span className="text-pearl">₹{t.grossRent.toLocaleString('en-IN')}</span>
              <span className="text-fog">-₹{t.platformFee.toLocaleString('en-IN')}</span>
              <span className="text-fog">{t.mechanixDeduction>0?`-₹${t.mechanixDeduction.toLocaleString('en-IN')}`:'—'}</span>
              <span className="text-green">₹{t.netYield.toLocaleString('en-IN')}</span>
            </div>
          ))}
      </div>
    </div>
  )
}

function FleetTab() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    investorAPI.getVehicles().then(r=>setVehicles(r.data)).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  return (
    <div>
      <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">My Asset Portfolio</div>
      {loading ? [1].map(i=><div key={i} className="h-64 animate-pulse bg-navy/5 mb-4"/>) : vehicles.map(v=>(
        <div key={v.reg} className="bg-void border border-navy/10 p-6 mb-4 shadow-sm">
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="font-display text-2xl text-navy tracking-[2px] mb-1">{v.make} {v.model}</div>
              <div className="text-[10px] font-mono text-ash">{v.registration_number}</div>
            </div>
            <span className={`text-[8px] tracking-[2px] border px-3 py-1.5 font-bold ${v.status==='active'?'text-green border-green/30 bg-green/5':'text-amber border-amber/30 bg-amber/5'}`}>{v.status.toUpperCase()}</span>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              {label:'Total Revenue', val:`₹${(v.total_revenue||0).toLocaleString('en-IN')}`, g:true},
              {label:'Yield (70%)', val:`₹${(v.net_yield||0).toLocaleString('en-IN')}`, g:true},
              {label:'Total Trips', val:(v.total_trips||0).toString(), g:false},
              {label:'Health Score', val:`${v.health_score||100}%`, g:false},
            ].map(s=>(
              <div key={s.label} className="bg-navy/5 border border-navy/5 p-4">
                <div className="text-[8px] text-ash mb-2 font-bold uppercase tracking-wider">{s.label}</div>
                <div className={`font-display text-xl ${s.g?'text-green':'text-navy'}`}>{s.val}</div>
              </div>
            ))}
          </div>
          <div className="mb-2 flex justify-between text-[9px] font-bold">
            <span className="text-ash uppercase tracking-wider">MECHANIX PRO Health</span>
            <span className="text-green">{v.health_score||100}%</span>
          </div>
          <div className="h-2 bg-navy/10">
            <div className="h-full bg-green" style={{width:`${v.health_score||100}%`, boxShadow:'0 0 10px rgba(18,51,43,.4)'}}/>
          </div>
          <div className="mt-4 text-[9px] text-ash font-medium italic">Last audit: {v.last_audit_date ? new Date(v.last_audit_date).toLocaleDateString() : 'Pending first audit'} · <span className="text-green uppercase font-bold">Protocol Secure</span></div>
          {v.agreement_url && (
            <div className="mt-4 pt-4 border-t border-navy/5 flex justify-end">
              <a href={v.agreement_url} target="_blank" rel="noopener noreferrer" className="text-[8px] tracking-[2px] text-navy hover:text-green font-bold uppercase flex items-center gap-2">
                View Master Agreement ↗
              </a>
            </div>
          )}
        </div>
      ))}
      {!loading && vehicles.length === 0 && (
        <div className="p-20 text-center bg-void border border-navy/10 shadow-sm">
          <div className="text-4xl mb-4">🚗</div>
          <div className="text-[11px] text-navy font-bold uppercase tracking-widest mb-2">No Assets Deployed</div>
          <p className="text-[10px] text-ash max-w-xs mx-auto mb-6">You haven&apos;t added any vehicles to the protocol yet. Start earning 70% yield by adding your first asset.</p>
          <a href="/investor#form" className="inline-block bg-green text-void text-[9px] tracking-[3px] px-8 py-3 font-bold uppercase hover:bg-green-dim transition-all cut-sm">Add Your First Asset →</a>
        </div>
      )}
    </div>
  )
}

function CalendarTab({stats}:{stats:InvestorStats|null}) {
  const [selected, setSelected] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const used = stats?.pauseDaysUsed || 0
  const remaining = stats?.pauseDaysRemaining ?? 5

  const today = new Date()
  const days = Array.from({length:31},(_,i)=>i+1)

  const toggle = (d:number) => {
    const key = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    if(selected.includes(key)) { setSelected(s=>s.filter(x=>x!==key)); return }
    if(selected.length + used >= 5) { toast.error('Maximum 5 pause days per quarter'); return }
    setSelected(s=>[...s,key])
  }

  const submit = async () => {
    if(!selected.length) { toast.error('Select at least one date'); return }
    setBusy(true)
    await new Promise(r=>setTimeout(r,1000))
    toast.success(`✓ ${selected.length} pause day${selected.length>1?'s':''} blocked successfully`)
    setSelected([])
    setBusy(false)
  }

  return (
    <div>
      <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">Emergency Pause Calendar</div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-obsidian border border-green/8 p-6">
          <div className="flex justify-between items-center mb-5">
            <span className="text-[11px] text-white font-medium">March 2026</span>
            <div className="flex items-center gap-3 text-[9px]">
              <span className="text-amber">{used + selected.length}/5 used</span>
              <span className="text-green">{remaining - selected.length} left</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-3">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>(
              <div key={d} className="text-center text-[8px] text-fog py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* March 2026 starts on Sunday */}
            {days.map(d=>{
              const key = `2026-03-${String(d).padStart(2,'0')}`
              const isSel = selected.includes(key)
              const isPast = d < today.getDate()
              return (
                <button key={d} disabled={isPast || (remaining - selected.length <= 0 && !isSel)}
                  onClick={()=>toggle(d)}
                  className={`h-8 text-[10px] rounded-sm transition-all
                    ${isPast ? 'text-graphite cursor-not-allowed' :
                      isSel ? 'bg-amber/20 border border-amber text-amber' :
                      'hover:bg-green/10 text-fog hover:text-green border border-transparent hover:border-green/20'}`}>
                  {d}
                </button>
              )
            })}
          </div>
          {selected.length > 0 && (
            <div className="mt-4 pt-4 border-t border-green/8">
              <p className="text-[9px] text-fog mb-3">{selected.length} date{selected.length>1?'s':''} selected</p>
              <button onClick={submit} disabled={busy}
                className="w-full bg-amber/10 border border-amber/30 text-amber text-[9px] tracking-[2px] uppercase py-3 hover:bg-amber/20 transition-all disabled:opacity-60">
                {busy ? 'Blocking...' : 'CONFIRM PAUSE DAYS →'}
              </button>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="bg-obsidian border border-amber/15 p-5">
            <div className="text-[9px] tracking-[2px] text-amber uppercase mb-3">⚠ Pause Policy</div>
            <ul className="space-y-2 text-[10px] text-fog leading-relaxed">
              <li>• Maximum <span className="text-green">5 pause days</span> per calendar quarter</li>
              <li>• Minimum <span className="text-green">48 hours</span> advance notice required</li>
              <li>• Paused days = ₹0 revenue for that asset</li>
              <li>• Cannot pause days already booked by guests</li>
            </ul>
          </div>
          <div className="bg-obsidian border border-green/8 p-5">
            <div className="text-[9px] tracking-[2px] text-ash uppercase mb-3">Q1 2026 Usage</div>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(i=>(
                <div key={i} className={`w-10 h-10 border flex items-center justify-center text-[10px] ${i<=used?'bg-amber/15 border-amber text-amber':i<=(used+selected.length)?'bg-green/15 border-green text-green':'border-green/20 text-fog'}`}>
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TicketsTab() {
  const [subject, setSubject] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [tickets, setTickets] = useState([
    {id:'TKT-001', subject:'Payout discrepancy — Feb 2026', status:'resolved', date:'2 Mar 2026', reply:'Resolved. Extra ₹200 added to March payout.'},
  ])

  const submit = async () => {
    if (!subject||!msg) { toast.error('Fill all fields'); return }
    setBusy(true)
    try {
      await investorAPI.createTicket({subject, message:msg, priority:'medium'})
      toast.success('✓ Ticket submitted. We respond within 4 hours.')
      setTickets(t=>[{id:`TKT-00${t.length+2}`, subject, status:'open', date:'Today', reply:''}, ...t])
      setSubject(''); setMsg('')
    } catch { toast.error('Submit failed') }
    finally { setBusy(false) }
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">Raise a Support Ticket</div>
        <div className="bg-obsidian border border-green/10 p-5 space-y-4">
          <div>
            <label className="text-[8px] tracking-[3px] text-fog uppercase block mb-2">Subject</label>
            <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="e.g. Payout discrepancy"
              className="w-full bg-deep border border-green/12 px-4 py-3 text-[12px] text-pearl font-mono placeholder-graphite focus:border-green/50 outline-none transition-all" />
          </div>
          <div>
            <label className="text-[8px] tracking-[3px] text-fog uppercase block mb-2">Message</label>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={5} placeholder="Describe in detail..."
              className="w-full bg-deep border border-green/12 px-4 py-3 text-[12px] text-pearl font-mono placeholder-graphite focus:border-green/50 outline-none transition-all resize-none" />
          </div>
          <button onClick={submit} disabled={busy}
            className="w-full bg-green text-void text-[9px] tracking-[3px] uppercase py-3 cut-sm font-medium hover:bg-green-dim disabled:opacity-60 transition-all">
            {busy?'Submitting...':'SUBMIT TICKET →'}
          </button>
        </div>
        <div className="mt-4 bg-obsidian border border-green/8 p-4 text-[9px] text-fog">
          ⏱ Response SLA: <span className="text-green">4 hours</span> · Priority escalation available
        </div>
      </div>
      <div>
        <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">Your Tickets</div>
        <div className="space-y-3">
          {tickets.map(t=>(
            <div key={t.id} className="bg-obsidian border border-green/8 p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-pearl">{t.subject}</span>
                <span className={`text-[7px] tracking-[2px] uppercase px-2 py-0.5 border ${t.status==='open'?'text-amber border-amber/30':'text-green border-green/30'}`}>{t.status}</span>
              </div>
              <div className="text-[9px] text-fog mb-1">{t.id} · {t.date}</div>
              {t.reply && <div className="text-[9px] text-ash border-t border-green/6 pt-2 mt-2">↳ {t.reply}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TaxTab() {
  return (
    <div>
      <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">Tax Center — CA Export</div>
      <div className="bg-obsidian border border-green/8 p-6 mb-4">
        <p className="text-[11px] text-fog mb-5">Download CA-ready Excel for any month or full financial year. Includes Gross Rent, Platform Fee, Mechanix deductions, Net Yield, and TDS-applicable fields.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[8px] tracking-[3px] text-fog uppercase mb-3">Monthly Exports</div>
            <div className="space-y-2">
              {['Jan 2026','Feb 2026','Mar 2026'].map(m=>(
                <button key={m} onClick={()=>{investorAPI.exportLedger(m);toast.success(`Downloading ${m}...`)}}
                  className="w-full flex items-center justify-between border border-green/20 text-[10px] px-4 py-3 hover:bg-green/5 hover:border-green/40 transition-all group">
                  <span className="text-ash group-hover:text-pearl">{m}</span>
                  <span className="text-green text-[9px]">↓ Excel</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[8px] tracking-[3px] text-fog uppercase mb-3">Annual Export</div>
            <button onClick={()=>{investorAPI.exportLedger('FY 2025-26');toast.success('Downloading FY 2025-26...')}}
              className="w-full border border-green/30 bg-green/5 p-6 text-center hover:bg-green/10 transition-all group">
              <div className="font-display text-3xl text-green glow-green mb-2 group-hover:scale-110 transition-transform">FY</div>
              <div className="text-[10px] text-ash mb-1">2025 – 2026</div>
              <div className="text-[9px] text-green">↓ Full Year Excel</div>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-obsidian border border-green/8 p-5">
        <div className="text-[9px] tracking-[3px] text-ash uppercase mb-3">FY Summary</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            {label:'Total Gross Revenue', val:'₹1,87,200'},
            {label:'Total Net Yield (70%)', val:'₹1,32,000', g:true},
            {label:'Total Platform Fee', val:'₹46,800'},
          ].map(s=>(
            <div key={s.label} className="bg-deep border border-green/8 p-4">
              <div className="text-[8px] text-fog mb-2">{s.label}</div>
              <div className={`font-display text-2xl ${s.g?'text-green glow-green':'text-white'}`}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KYCTab() {
  const [pan, setPan] = useState<File|null>(null)
  const [aad, setAad] = useState<File|null>(null)
  const [busy, setBusy] = useState(false)
  const upload = async () => {
    if(!pan||!aad) { toast.error('Upload both PAN and Aadhar'); return }
    setBusy(true)
    try {
      const fd = new FormData(); fd.append('pan',pan); fd.append('aadhaar',aad)
      await investorAPI.uploadKYC(fd); toast.success('✓ KYC uploaded. Verified within 24 hours.')
    } catch { toast.error('Upload failed') }
    finally { setBusy(false) }
  }
  return (
    <div className="space-y-5">
      <div className="bg-amber/5 border border-amber/20 p-4 text-[10px] text-amber leading-relaxed">⚠ KYC is required before your first payout. All documents encrypted in AWS S3.</div>
      <div className="grid grid-cols-2 gap-4">
        {[{label:'PAN Card',hint:'Front side · JPG/PNG/PDF',val:pan,set:setPan},{label:'Aadhar Card',hint:'Front + back · JPG/PNG/PDF',val:aad,set:setAad}].map(f=>(
          <div key={f.label} className="bg-obsidian border border-green/10 p-5">
            <div className="text-[9px] tracking-[3px] text-ash uppercase mb-2">{f.label}</div>
            <p className="text-[9px] text-fog mb-4">{f.hint}</p>
            <label className="block border border-dashed border-green/25 p-6 text-center cursor-pointer hover:bg-green/[.02] hover:border-green/40 transition-all">
              <div className="text-2xl mb-2">{f.val?'✓':'📎'}</div>
              <div className="text-[9px] tracking-[2px] text-ash">{f.val?f.val.name:'TAP TO UPLOAD'}</div>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={e=>f.set(e.target.files?.[0]||null)} />
            </label>
          </div>
        ))}
      </div>
      <button onClick={upload} disabled={busy}
        className="bg-green text-void text-[9px] tracking-[4px] uppercase px-10 py-4 cut-sm font-medium hover:bg-green-dim disabled:opacity-60 transition-all">
        {busy?'Uploading...':'UPLOAD & VERIFY KYC →'}
      </button>
    </div>
  )
}

function BankTab() {
  const [form, setForm] = useState({account_number:'',ifsc_code:'',upi_id:''})
  const save = async () => {
    try { await investorAPI.saveBankDetails(form); toast.success('✓ Bank details saved') }
    catch { toast.error('Save failed') }
  }
  const inp = "w-full bg-deep border border-green/12 px-4 py-3 text-[12px] text-pearl font-mono placeholder-graphite focus:border-green/50 outline-none transition-all"
  return (
    <div>
      <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">Bank Routing — Payout Details</div>
      <div className="bg-obsidian border border-green/10 p-6 max-w-lg space-y-4">
        {[{key:'account_number',label:'Account Number',ph:'XXXX XXXX XXXX'},{key:'ifsc_code',label:'IFSC Code',ph:'SBIN0001234'},{key:'upi_id',label:'UPI ID',ph:'name@upi'}].map(f=>(
          <div key={f.key}>
            <label className="text-[8px] tracking-[3px] text-fog uppercase block mb-2">{f.label}</label>
            <input value={(form as any)[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} className={inp} />
          </div>
        ))}
        <button onClick={save} className="bg-green text-void text-[9px] tracking-[3px] uppercase px-8 py-3 cut-sm font-medium hover:bg-green-dim transition-all">SAVE BANK DETAILS →</button>
      </div>
      <div className="mt-5 bg-obsidian border border-green/8 p-5 max-w-lg">
        <div className="text-[9px] tracking-[2px] text-ash uppercase mb-3">Payout Schedule</div>
        <div className="space-y-2 text-[10px] text-fog">
          <div className="flex justify-between"><span>Payout date</span><span className="text-green">15th of every month</span></div>
          <div className="flex justify-between"><span>Processing time</span><span className="text-ash">1–3 business days</span></div>
          <div className="flex justify-between"><span>Minimum payout</span><span className="text-ash">₹1,000</span></div>
        </div>
      </div>
    </div>
  )
}

function DocumentVaultTab() {
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    investorAPI.getDocuments().then(r => setDocs(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">Document Vault — Your Legal Archive</div>
      <div className="bg-void border border-navy/10 overflow-hidden mb-4 shadow-sm">
        {loading ? [1,2].map(i => <div key={i} className="h-16 animate-pulse bg-navy/5 m-2"/>) : docs.map((d, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-navy/5 hover:bg-navy/[.02] transition-colors group">
            <div className="flex items-center gap-4">
              <span className="text-xl">{d.icon}</span>
              <div>
                <div className="text-[11px] text-navy font-bold mb-0.5">{d.name}</div>
                <div className="text-[9px] text-ash font-medium">{d.type} · {new Date(d.date).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <a href={d.url} target="_blank" rel="noopener noreferrer"
                className="text-[8px] tracking-[2px] text-green border border-green/25 px-5 py-2 hover:bg-green/10 transition-all font-bold uppercase">
                View PDF ↗
              </a>
            </div>
          </div>
        ))}
        {!loading && docs.length === 0 && (
          <div className="p-20 text-center text-ash text-[11px] font-medium italic">Your document vault is currently empty. Assets under onboarding will appear here after activation.</div>
        )}
      </div>
      <div className="bg-navy/5 border border-navy/5 p-5 text-[10px] text-ash font-medium italic">
        🔐 All documents stored in AWS S3 with AES-256 encryption. Only you and authorised 8-Lines executives can access your vault.
      </div>
    </div>
  )
}

function AddAssetTab() {
  const [asset, setAsset]  = useState(1500000)
  const [days,  setDays]   = useState(18)
  const gross  = Math.round(asset * 0.0025 * days)
  const fee    = Math.round(gross * 0.30)
  const mech   = Math.round(gross * 0.05)
  const net    = gross - fee - mech
  const annual = net * 12
  const roi    = Math.round((annual / asset) * 100)

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">Add a Second Asset — ROI Preview</div>
        <div className="bg-obsidian border border-green/12 overflow-hidden mb-6">
          <div className="bg-green/6 border-b border-green/10 px-5 py-3 flex items-center justify-between">
            <div className="flex gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red/70"/><div className="w-2.5 h-2.5 rounded-full bg-amber/70"/><div className="w-2.5 h-2.5 rounded-full bg-green"/></div>
            <span className="text-[8px] tracking-[3px] text-green uppercase">Asset ROI Predictor</span>
            <span className="text-[8px] text-green flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green rounded-full" style={{animation:'blink 2s infinite'}}/>LIVE</span>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-[9px] tracking-[2px] text-ash uppercase">Asset Market Value</span>
                <span className="font-display text-2xl text-green">₹{asset.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min={500000} max={3000000} step={50000} value={asset}
                onChange={e=>{const v=+e.target.value;setAsset(v);e.target.style.setProperty('--val',`${((v-500000)/2500000)*100}%`)}}
                style={{'--val':`${((asset-500000)/2500000)*100}%`} as React.CSSProperties} />
            </div>
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-[9px] tracking-[2px] text-ash uppercase">Monthly Rental Days</span>
                <span className="font-display text-2xl text-green">{days} days</span>
              </div>
              <input type="range" min={8} max={28} step={1} value={days}
                onChange={e=>{const v=+e.target.value;setDays(v);e.target.style.setProperty('--val',`${((v-8)/20)*100}%`)}}
                style={{'--val':`${((days-8)/20)*100}%`} as React.CSSProperties} />
            </div>
            <div className="grid grid-cols-2 gap-px bg-green/8">
              {[
                {label:'Gross Monthly',     val:`₹${gross.toLocaleString('en-IN')}`, cls:'text-pearl'},
                {label:'Platform Fee 30%',  val:`-₹${fee.toLocaleString('en-IN')}`,  cls:'text-fog'},
                {label:'Mechanix Est.',     val:`-₹${mech.toLocaleString('en-IN')}`, cls:'text-fog'},
                {label:'Net Monthly Yield', val:`₹${net.toLocaleString('en-IN')}`,   cls:'text-green'},
              ].map(r=>(
                <div key={r.label} className="bg-obsidian p-4">
                  <div className="text-[8px] text-fog mb-2">{r.label}</div>
                  <div className={`font-display text-xl ${r.cls}`}>{r.val}</div>
                </div>
              ))}
              <div className="col-span-2 bg-obsidian p-4 flex items-center justify-between">
                <div>
                  <div className="text-[8px] text-fog mb-1">Annual Passive Income</div>
                  <div className="font-display text-3xl text-green glow-green">₹{annual.toLocaleString('en-IN')}</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-5xl text-green glow-green">{roi}%</div>
                  <div className="text-[8px] text-fog">Annual ROI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4">Start Second Asset Onboarding</div>
        <div className="bg-obsidian border border-green/10 p-6 space-y-4">
          <p className="text-[11px] text-fog leading-relaxed">You already have 1 active asset earning <span className="text-green">₹24,800/month</span>. Add a second vehicle to your portfolio and double your passive income stream.</p>
          <div className="space-y-3">
            {['Same 70/30 split — same transparency','Same MECHANIX PRO protection','₹5,000 onboarding fee applies','Can be a different vehicle make/model'].map(b=>(
              <div key={b} className="flex items-center gap-3 text-[10px] text-ash">
                <span className="text-green text-[8px]">✓</span>{b}
              </div>
            ))}
          </div>
          <a href="/investor#form"
            className="block w-full bg-green text-void text-[9px] tracking-[3px] uppercase py-4 text-center font-medium cut-sm hover:bg-green-dim transition-all">
            ADD SECOND ASSET →
          </a>
        </div>
        <div className="mt-4 bg-obsidian border border-green/8 p-5">
          <div className="text-[9px] tracking-[2px] text-ash uppercase mb-3">Multi-Asset Advantage</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              {label:'2 Assets Annual',val:`₹${(annual*2).toLocaleString('en-IN')}`,g:true},
              {label:'Combined ROI',   val:`${roi}%`, g:true},
            ].map(s=>(
              <div key={s.label} className="bg-deep border border-green/8 p-4">
                <div className="text-[8px] text-fog mb-1">{s.label}</div>
                <div className={`font-display text-xl ${s.g?'text-green glow-green':'text-white'}`}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, logout, loadUser } = useAuthStore()
  const router = useRouter()
  const [tab,   setTab]   = useState('overview')
  const [stats, setStats] = useState<InvestorStats|null>(null)
  const [trips, setTrips] = useState<Trip[]>([])

  useEffect(() => {
    loadUser().then(()=>{ if(!useAuthStore.getState().user) router.push('/login') })
    investorAPI.getStats().then(r=>setStats(r.data)).catch(()=>{})
    investorAPI.getTrips().then(r=>setTrips(r.data?.trips||[])).catch(()=>{})
  },[])

  return (
    <main className="min-h-screen bg-void flex flex-col">
      {/* Topbar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[68px] bg-void border-b border-navy/10 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <a href="/" className="font-display text-xl tracking-[5px] text-navy hover:text-green transition-colors"><em className="text-green not-italic">8</em>LINES</a>
          <div className="text-[8px] tracking-[3px] text-green border border-green/20 px-2 py-1 font-bold">INVESTOR PORTAL</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[8px] text-ash font-bold"><span className="w-1.5 h-1.5 bg-green rounded-full" style={{animation:'blink 2s infinite'}}/>OTP SECURED</div>
          <span className="text-[9px] text-navy font-bold">{user?.name||user?.phone||'Investor'}</span>
          <a href="/" className="text-[8px] text-ash hover:text-navy border border-navy/10 px-3 py-2 uppercase transition-all font-bold">← Home</a>
          <button onClick={logout} className="text-[8px] tracking-[2px] text-ash hover:text-red transition-colors uppercase border border-navy/10 px-3 py-2 font-bold">Logout</button>
        </div>
      </div>

      <div className="flex flex-1 pt-[68px]">
        {/* Sidebar */}
        <div className="w-[240px] bg-void border-r border-navy/10 fixed top-[68px] bottom-0 left-0 overflow-y-auto scrollbar-green shadow-sm">
          <div className="p-6 border-b border-navy/5 bg-navy/5">
            <div className="w-12 h-12 bg-white border border-navy/10 flex items-center justify-center text-xl mb-4 shadow-sm">👤</div>
            <div className="text-[12px] text-navy font-bold mb-1">{user?.name||user?.phone||'Investor'}</div>
            <div className="text-[8px] tracking-[2px] text-green font-bold uppercase">{user?.kycVerified?'VERIFIED ACTIVE':'KYC PENDING'}</div>
          </div>
          <div className="py-4">
            {NAV.map((n,i)=>(
              <div key={n.id}>
                {i===5&&<div className="h-px bg-navy/5 my-4 mx-6"/>}
                {i===9&&<div className="h-px bg-navy/5 my-4 mx-6"/>}
                <button onClick={()=>setTab(n.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 text-[9px] tracking-[3px] uppercase text-left transition-all border-l-4 font-bold ${tab===n.id?'text-green border-green bg-green/5':'text-ash border-transparent hover:text-navy hover:bg-navy/5'}`}>
                  <span className="text-[12px]">{n.icon}</span>{n.label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 ml-[240px] p-8">
          {tab==='overview'  && <OverviewTab stats={stats}/>}
          {tab==='ledger'    && <LedgerTab trips={trips}/>}
          {tab==='fleet'     && <FleetTab/>}
          {tab==='calendar'  && <CalendarTab stats={stats}/>}
          {tab==='tickets'   && <TicketsTab/>}
          {tab==='tax'       && <TaxTab/>}
          {tab==='kyc'       && <KYCTab/>}
          {tab==='bank'      && <BankTab/>}
          {tab==='documents' && <DocumentVaultTab/>}
          {tab==='addasset'  && <AddAssetTab/>}
        </div>
      </div>
    </main>
  )
}
