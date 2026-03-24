'use client'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store'
import { investorAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { InvestorStats, Trip } from '@/types'
import { DynamicLogo } from '@/components/ui/Logos'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, ShieldCheck, Download, Calendar, ArrowUpRight, Zap, MapPin, Search } from 'lucide-react'


const NAV = [
  {id:'overview',  icon:'◉',  label:'Overview', short:'Home'},
  {id:'ledger',    icon:'≡',  label:'Ledger',   short:'Logs'},
  {id:'fleet',     icon:'⊞',  label:'My Fleet', short:'Fleet'},
  {id:'calendar',  icon:'⊡',  label:'Pause Calendar', short:'Pause'},
  {id:'tickets',   icon:'◫',  label:'IRM Tickets', short:'IRM'},
  {id:'tax',       icon:'↓',  label:'Tax Export', short:'Tax'},
  {id:'kyc',       icon:'⚷',  label:'KYC Vault', short:'KYC'},
  {id:'bank',      icon:'₹',  label:'Bank Details', short:'Bank'},
  {id:'documents', icon:'📁', label:'Document Vault', short:'Docs'},
  {id:'addasset',  icon:'+',  label:'Expand Portfolio', short:'Add'},
]

const MARKET_DEMAND = [
  {model:'Innova Crysta', demand:'+140%', trend:'up'},
  {model:'Mahindra Thar', demand:'+115%', trend:'up'},
  {model:'Toyota Fortuner', demand:'+95%', trend:'up'},
  {model:'Kia Carnival', demand:'+60%', trend:'up'},
]

function KpiCard({label,val,change,green=false,orange=false}:{label:string;val:string;change:string;green?:boolean;orange?:boolean}) {
  return (
    <div className={`bg-white border-l-4 ${green?'border-l-green':orange?'border-l-orange':'border-l-navy/20'} border border-navy/8 p-6 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden rounded-sm`}>
      <div className="text-[10px] font-bold text-ash uppercase mb-4 tracking-tight">{label}</div>
      <div className={`font-sans text-3xl md:text-4xl font-bold tracking-tight mb-4 ${green?'text-green':orange?'text-orange':'text-navy'}`}>{val}</div>
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${green?'bg-green animate-pulse':orange?'bg-orange animate-pulse':'bg-navy/20'}`} />
        <span className="text-[11px] font-bold text-navy/40 uppercase tracking-widest">{change}</span>
      </div>
    </div>
  )
}


const CHART_DATA = [
  { name: 'Oct', yield: 18400 },
  { name: 'Nov', yield: 22100 },
  { name: 'Dec', yield: 19800 },
  { name: 'Jan', yield: 25600 },
  { name: 'Feb', yield: 21300 },
  { name: 'Mar', yield: 24800 },
]

function YieldVelocityChart() {
  return (
    <div className="h-64 sm:h-72 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B', fontWeight: 700}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B', fontWeight: 700}} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0C1D36', border: 'none', borderRadius: '4px', padding: '12px' }}
            itemStyle={{ color: '#22C55E', fontSize: '12px', fontWeight: 'bold' }}
            labelStyle={{ color: 'white', fontSize: '10px', marginBottom: '4px', opacity: 0.5 }}
          />
          <Area type="monotone" dataKey="yield" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function OverviewTab({stats, setTab}:{stats:InvestorStats|null, setTab: (t:string)=>void}) {
  if(!stats) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i=>(
          <div key={i} className="bg-void border border-navy/5 p-8 animate-pulse shadow-sm h-40" />
        ))}
      </div>
      <div className="bg-void border border-navy/5 p-20 text-center text-ash text-[12px] font-black uppercase tracking-[4px] italic opacity-40 animate-pulse">Initializing Financial Protocol...</div>
    </div>
  )

  const payoutDaysRemaining = 15 - new Date().getDate()
  const progressToPayout = Math.max(0, Math.min(100, ( (30 - payoutDaysRemaining) / 30 ) * 100))

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-navy/8">
        <div>
          <div className="text-xs md:text-sm font-semibold text-green tracking-wide mb-6 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> SECURED TERMINAL
          </div>
          <h1 className="font-sans text-3xl md:text-4xl text-navy font-bold tracking-tight mb-8 uppercase">WEALTH <span className="text-green">OVERVIEW.</span></h1>
        </div>
        <div className="flex items-center gap-4 bg-white border border-navy/10 px-6 py-4 shadow-xl cut-md">
          <div className="text-right">
             <div className="text-[9px] text-navy/30 uppercase font-bold tracking-widest mb-1">Terminal Status</div>
             <div className="text-sm text-navy font-bold tracking-tight">MARCH DEPLOYMENT CYCLE</div>
          </div>
          <div className="w-px h-10 bg-navy/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-green animate-pulse shadow-glow-green" />
        </div>
      </div>

      {/* Live Ticker */}
      <div className="bg-navy py-4 px-6 overflow-hidden rounded-sm border border-white/5 relative shadow-glow-sm">
         <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-green/50 to-transparent" />
         <div className="flex whitespace-nowrap animate-ticker scrollbar-none">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-12 mr-12 shrink-0">
                 <span className="text-[10px] tracking-widest text-white/30 font-semibold uppercase select-none">// LIVE SYSTEM AUDIT</span>
                 <span className="text-[11px] tracking-tight text-green font-bold uppercase flex items-center gap-3">
                    <Zap className="w-3 h-3 text-green animate-pulse" />FORTUNER KA-05 · EARNED ₹2,450 NET
                 </span>
                 <span className="text-[11px] tracking-tight text-orange font-bold uppercase flex items-center gap-3">
                    <TrendingUp className="w-3 h-3" />HUB ALPHA: 94% UTILIZATION
                 </span>
              </div>
            ))}
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <KpiCard label="Locked Future Revenue" val={`₹${(stats.lockedRevenue||0).toLocaleString('en-IN')}`} change={`↑ ${stats.upcomingBookings||0} upcoming bookings`} green />
        <div className="bg-white border border-navy/8 p-6 hover:shadow-2xl transition-all duration-500 cursor-default group relative overflow-hidden rounded-sm flex flex-col justify-between h-full border-l-4 border-l-orange">
           <div className="relative z-10">
              <div className="text-[10px] font-bold text-navy/40 uppercase mb-4 tracking-tight">Next Payout Protocol</div>
              <div className="font-sans text-3xl md:text-4xl font-bold text-orange mb-4 leading-none tracking-tight">{(stats.nextPayoutDate||'15 Mar 2026').split(' ')[0]} <span className="text-xl text-navy/30 tracking-tight">MAR</span></div>
              <p className="text-[9px] md:text-[10px] text-navy/40 uppercase font-bold mb-6 tracking-widest leading-relaxed">Est. ₹{(stats.nextPayoutAmount||0).toLocaleString('en-IN')} // T+{Math.max(0, payoutDaysRemaining)} Days to Reset</p>
           </div>
           <div className="relative z-10">
              <div className="flex justify-between items-center mb-3">
                 <span className="text-[9px] text-orange font-black uppercase tracking-widest">Payout Cycle Alpha</span>
                 <span className="text-[9px] text-navy/30 font-black">{Math.round(progressToPayout)}%</span>
              </div>
              <div className="h-2 bg-navy/5 rounded-full overflow-hidden">
                 <div className="h-full bg-orange transition-all duration-1000 shadow-glow" style={{width:`${progressToPayout}%`}} />
              </div>
           </div>
           <Calendar className="absolute top-8 right-8 w-12 h-12 text-orange/5 group-hover:text-orange/10 transition-colors" />
        </div>
        <KpiCard label="Consolidated March Net" val={`₹${(stats.thisMonthNet||24800).toLocaleString('en-IN')}`} change="+16.4% Efficiency Gain" green />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Yield Velocity Chart */}
        <div className="lg:col-span-8 bg-white border border-navy/8 p-6 md:p-8 shadow-xl relative overflow-hidden group rounded-sm">
          <div className="absolute top-0 right-0 p-8">
              <TrendingUp className="w-8 h-8 text-green opacity-[0.05] group-hover:opacity-[0.15] transition-opacity" />
          </div>
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="text-xs font-semibold text-orange tracking-wide mb-6 flex items-center gap-2">
                <span className="w-8 h-px bg-orange" /> Dynamic Yield Index
              </div>
              <h2 className="font-sans text-2xl md:text-3xl text-navy font-bold tracking-tight mb-8 uppercase">YIELD VELOCITY <span className="text-navy/40">TRAJECTORY</span></h2>
            </div>
            <div className="bg-green/5 border border-green/20 px-4 py-2 flex items-center gap-3 group/chip transition-all hover:bg-green/10">
              <span className="text-[11px] text-green font-black uppercase tracking-widest">+34.8% ↑</span>
              <div className="w-px h-4 bg-green/20" />
              <div className="text-[9px] text-navy/40 font-black uppercase tracking-[2px]">L-6M</div>
            </div>
          </div>
          <YieldVelocityChart />
        </div>
        
        {/* Revenue Allocation Matrix */}
        <div className="lg:col-span-4 bg-white border border-navy/8 p-6 md:p-8 shadow-xl rounded-sm relative overflow-hidden flex flex-col">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-navy/5 blur-3xl rounded-full" />
          <div className="text-[10px] tracking-widest text-navy/30 uppercase font-bold mb-8">Allocation Architecture</div>
          <div className="font-sans text-xl font-bold text-navy uppercase mb-10 tracking-tight leading-none">DISTRIBUTION MATRIX</div>
          <div className="space-y-8 flex-1">
            {[
              {label:'Gross Asset Revenue',  val:'₹35,429', color:'text-navy',    bar:100, bg:'bg-navy/8'},
              {label:'Net Passive Yield (70%)', val:'₹24,800', color:'text-green',   bar:70,  bg:'bg-green'},
              {label:'Platform Protocol (25%)', val:'₹8,857',  color:'text-navy/30', bar:25,  bg:'bg-navy/20'},
              {label:'Mechanix Reserve (5%)', val:'₹1,771',  color:'text-orange',  bar:5,   bg:'bg-orange'},
            ].map((r, i)=>(
              <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay: 0.2 + i*0.1 }} key={r.label}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-ash font-bold uppercase tracking-wider">{r.label}</span>
                  <span className={`text-sm font-mono font-bold ${r.color}`}>{r.val}</span>
                </div>
                <div className="h-1 bg-navy/5 rounded-full overflow-hidden">
                  <div className={`h-full ${r.bg} rounded-full transition-all duration-1000 shadow-glow-sm`} style={{width:`${r.bar}%`}}/>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 p-5 bg-navy/5 border-l-4 border-l-navy cut-sm">
             <div className="text-[9px] text-navy/50 font-bold leading-relaxed uppercase tracking-widest italic">
                Yield distribution is locked per MAMA v3.2 Protocol using real-time trip-by-trip accounting.
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Live Asset Health (Zerodha Style Score) */}
        <div className="lg:col-span-12 bg-white border border-navy/8 p-8 md:p-10 shadow-xl rounded-sm relative overflow-hidden group">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
             <div className="flex-1">
                <div className="text-xs font-semibold text-orange tracking-wide mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-orange" /> Asset Health Metric
                </div>
                <h3 className="font-sans text-2xl md:text-3xl text-navy font-bold tracking-tight mb-8 uppercase">MAHINDRA XUV 300 <span className="text-navy/20 font-mono tracking-widest text-lg ml-4">KA04ND5967</span></h3>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                   {[
                      {l:'ECU Protocol', v:'SECURE ✓', c:'text-green'},
                      {l:'Tyre Index', v:'88% NEW', c:'text-navy'},
                      {l:'Fluid Logic', v:'OPTIMAL', c:'text-green'},
                      {l:'Brake Status', v:'9.2mm DEPTH', c:'text-orange'},
                   ].map(h=>(
                      <div key={h.l} className="bg-navy/[0.02] p-5 border border-navy/5 cut-sm">
                         <div className="text-[9px] text-navy/30 uppercase font-black tracking-widest mb-2">{h.l}</div>
                         <div className={`text-[12px] font-black uppercase tracking-tight ${h.c}`}>{h.v}</div>
                      </div>
                   ))}
                </div>
             </div>
             
             <div className="w-full md:w-64 text-center bg-navy/[0.03] border border-navy/5 p-8 flex flex-col items-center justify-center cut-lg shadow-inner group-hover:bg-navy/[0.05] transition-colors">
                <div className="text-[10px] tracking-widest text-navy/40 uppercase font-bold mb-6">Aggregate Stability Index</div>
                <div className="relative w-32 h-32 mb-6">
                   <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" strokeWidth="2.5" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeDasharray="95.4, 100" strokeLinecap="round" className="shadow-glow" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-display text-navy leading-none">95.4</span>
                      <span className="text-[9px] font-black text-green mt-1">%</span>
                   </div>
                </div>
                <div className="text-[10px] text-green font-black uppercase tracking-[3px] animate-pulse">OPTIMAL PERFORMANCE</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Expansion CTA */}
        <div className="lg:col-span-12 bg-navy border border-navy p-10 md:p-14 shadow-2xl rounded-sm relative overflow-hidden group hover:shadow-[0_40px_100px_-20px_rgba(12,29,54,0.5)] transition-all duration-700">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange/5 blur-[120px] rounded-full pointer-events-none transition-transform duration-1000 group-hover:scale-125" />
          <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] bg-green/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
             <div className="max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-4 bg-orange/10 border border-orange/20 px-4 py-2 mb-8 cut-sm">
                   <Zap className="w-4 h-4 text-orange" />
                   <span className="text-[10px] tracking-[6px] text-orange uppercase font-black">PHASE IV DEPLOYMENT OPEN</span>
                </div>
                <h3 className="font-sans text-4xl md:text-5xl text-white font-bold tracking-tight mb-8 uppercase">EXPAND YOUR <span className="text-orange">CAPITAL NODE.</span></h3>
                <p className="text-[16px] text-white/40 font-medium mb-10 leading-relaxed uppercase tracking-wider">Demand for 7-seater lux-SUVs is <span className="text-orange font-black">140% above historic baseline</span> in Bengaluru South sector. Initialise a second asset to multiply yield efficiency.</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
                   <div className="flex flex-col">
                      <span className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-2">Estimated Yield</span>
                      <span className="text-2xl font-display text-white">₹4.82L <span className="text-[14px]/none text-green font-black ml-1">/ YR</span></span>
                   </div>
                   <div className="w-px h-10 bg-white/10 hidden md:block" />
                   <div className="flex flex-col">
                      <span className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-2">Waitlist Delta</span>
                      <span className="text-2xl font-display text-white">48 HRS</span>
                   </div>
                </div>
             </div>
             
             <div className="w-full lg:w-96">
                <button onClick={()=>{setTab('addasset'); window.scrollTo({top:0, behavior:'smooth'})}} 
                   className="w-full bg-orange text-white py-8 text-2xl tracking-widest uppercase font-bold hover:bg-white hover:text-navy transition-all shadow-[0_20px_50px_rgba(248,147,31,0.3)] group/btn relative overflow-hidden cut-lg">
                   <span className="relative z-10">INITIALISE →</span>
                   <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500 origin-left" />
                </button>
                <p className="text-center text-[10px] text-white/20 uppercase font-bold tracking-[4px] mt-8">Institutional Protocol v4.0 Active</p>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}



function LedgerTab({trips}:{trips:Trip[]}) {
  const doExport = async () => {
    try {
      const res = await investorAPI.exportLedger()
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a'); a.href=url; a.download='8lines-ledger-FY26.xlsx'; a.click()
      toast.success('✓ Financial Ledger Protocol Exported')
    } catch { toast.error('Export protocol failed') }
  }
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
           <div className="text-xs font-semibold text-green tracking-wide mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green shadow-glow animate-pulse" /> LIVE SETTLEMENT PROTOCOL
           </div>
           <h2 className="font-sans text-3xl md:text-4xl text-navy font-bold tracking-tight mb-8 uppercase">FINANCIAL <span className="text-green">LEDGER.</span></h2>
        </div>
        <button onClick={doExport} className="w-full md:w-auto bg-navy text-white px-10 py-5 text-[11px] tracking-[5px] uppercase font-black hover:bg-orange transition-all shadow-xl cut-md flex items-center gap-4">
          One-Click CA Export ↓
        </button>
      </div>

      <div className="bg-white border border-navy/5 shadow-2xl relative overflow-hidden cut-lg mb-10">
        <div className="absolute inset-0 carbon-fiber opacity-[0.03] pointer-events-none" />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
               <tr className="bg-navy/[0.02]">
                  <th className="px-8 py-5 text-[10px] tracking-[3px] text-navy/40 uppercase font-black">Transaction ID</th>
                  <th className="px-8 py-5 text-[10px] tracking-[3px] text-navy/40 uppercase font-black">Gross Rent</th>
                  <th className="px-8 py-5 text-[10px] tracking-[3px] text-navy/40 uppercase font-black">30% Platform Fee</th>
                  <th className="px-8 py-5 text-[10px] tracking-[3px] text-navy/40 uppercase font-black">Mechanix Pool</th>
                  <th className="px-8 py-5 text-[10px] tracking-[4px] text-green uppercase font-black">Net Passive Yield</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {trips.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-8 py-20 text-center text-ash opacity-40 italic tracking-[4px] uppercase font-black">Initializing Final Settlement Logs...</td>
                </tr>
              ) : trips.map(t=>(
                <tr key={t.id} className="hover:bg-navy/[0.01] transition-all group/row">
                  <td className="px-8 py-5 text-[11px] font-mono font-black text-navy/40 group-hover/row:text-navy transition-colors">#{t.id.slice(0,12)}</td>
                  <td className="px-8 py-5 text-[13px] font-black text-navy">₹{t.grossRent.toLocaleString('en-IN')}</td>
                  <td className="px-8 py-5 text-[12px] font-bold text-ash/60">- ₹{t.platformFee.toLocaleString('en-IN')}</td>
                  <td className="px-8 py-5 text-[12px] font-bold text-orange">- ₹{t.mechanixDeduction.toLocaleString('en-IN')}</td>
                  <td className="px-8 py-5 text-[14px] font-black text-green tracking-tight group-hover/row:scale-105 transition-transform origin-left">₹{t.netYield.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white border border-navy/5 p-8 cut-md shadow-md">
            <div className="text-[9px] tracking-widest text-ash uppercase mb-4 font-bold">Month-to-Date Gross</div>
            <div className="text-4xl font-sans text-navy font-bold tracking-tight">₹{trips.reduce((acc,curr)=>acc+curr.grossRent, 0).toLocaleString('en-IN')}</div>
         </div>
         <div className="bg-white border border-navy/5 p-8 cut-md shadow-md border-b-4 border-b-green">
            <div className="text-[9px] tracking-[3px] text-green uppercase mb-4 font-black">Settled Net Profit</div>
            <div className="text-4xl font-sans text-green font-bold tracking-tight shadow-glow">₹{trips.reduce((acc,curr)=>acc+curr.netYield, 0).toLocaleString('en-IN')}</div>
         </div>
         <div className="bg-white border border-navy/5 p-8 cut-md shadow-md">
            <div className="text-[9px] tracking-[3px] text-ash uppercase mb-4 font-black">Platform Contribution</div>
            <div className="text-4xl font-display text-navy/30 font-black tracking-tight">₹{trips.reduce((acc,curr)=>acc+curr.platformFee + curr.mechanixDeduction, 0).toLocaleString('en-IN')}</div>
         </div>
      </div>
    </div>
  )
}


function TicketsTab() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    investorAPI.getTickets().then(r=>setTickets(r.data)).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  const submit = async () => {
    if(!msg) return
    try {
      await investorAPI.createTicket({ subject: "IRM Support", message: msg })
      toast.success('Ticket submitted to IRM Command')
      setMsg(''); setShowForm(false)
      const r = await investorAPI.getTickets(); setTickets(r.data)
    } catch { toast.error('Submission failed') }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-10">
         <div>
           <div className="text-xs font-semibold text-orange tracking-wide mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-orange" /> Investor Relations Center
           </div>
           <h2 className="font-sans text-3xl md:text-4xl text-navy font-bold tracking-tight mb-8 uppercase">SUPPORT <span className="text-orange">INBOX.</span></h2>
         </div>
         {!showForm && (
           <button onClick={()=>setShowForm(true)} className="bg-navy text-white px-10 py-5 text-[11px] tracking-[5px] uppercase font-black hover:bg-orange transition-all shadow-xl cut-md">
             + NEW TICKET
           </button>
         )}
      </div>

      {showForm && (
        <div className="bg-white border border-navy/10 p-8 md:p-12 mb-10 shadow-2xl cut-lg animate-in fade-in slide-in-from-top duration-500">
           <div className="text-[9px] tracking-[3px] text-navy/40 uppercase font-black mb-6">// IRM Command Handshake</div>
           <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Describe your operational or financial query in detail..."
             className="w-full bg-navy/5 border border-navy/10 p-8 text-[14px] text-navy font-medium placeholder:text-navy/20 outline-none focus:border-orange/20 transition-all min-h-[200px] mb-8" />
           <div className="flex gap-4">
              <button onClick={submit} className="flex-1 bg-green text-white py-5 text-[11px] tracking-[5px] font-black uppercase cut-md hover:bg-green-dim transition-all shadow-glow-green">EXECUTE SUBMISSION →</button>
              <button onClick={()=>setShowForm(false)} className="px-10 py-5 border border-navy/10 text-[11px] tracking-[5px] font-black text-navy uppercase cut-md hover:bg-navy/5">CANCEL</button>
           </div>
        </div>
      )}

      <div className="space-y-4">
        {loading ? [1,2].map(i=><div key={i} className="h-24 bg-navy/5 animate-pulse m-2"/>) : 
         tickets.length === 0 ? (
           <div className="p-20 text-center border-2 border-dashed border-navy/5 bg-navy/[0.01]">
              <div className="text-4xl mb-6 opacity-30">✉</div>
              <p className="text-[11px] text-ash/40 font-black uppercase tracking-[4px] italic">No active support threads in your archival vault.</p>
           </div>
         ) : tickets.map(t=>(
          <div key={t.id} className="bg-white border border-navy/5 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-orange/20 transition-all cut-md shadow-lg">
            <div className="flex-1">
               <div className="flex items-center gap-5 mb-3">
                  <span className="text-[9px] tracking-[2px] font-mono text-navy/30">ID: #{t.id.slice(0,8)}</span>
                  <span className={`text-[8px] tracking-[3px] px-3 py-1 font-black uppercase rounded-sm ${t.status==='open'?'bg-orange/10 text-orange':'bg-green/10 text-green'}`}>{t.status}</span>
               </div>
               <p className="text-[13px] text-navy font-bold leading-relaxed mb-4">{t.message}</p>
               <div className="text-[9px] text-ash font-black uppercase tracking-widest">{new Date(t.created_at).toLocaleString()} // IRM CORE</div>
            </div>
            <div className="w-full md:w-auto text-right">
               <button className="text-[10px] tracking-[4px] text-navy font-black hover:text-orange transition-colors uppercase border-b border-navy/10 pb-1">VIEW THREAD →</button>
            </div>
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
      <div className="text-[9px] md:text-[10px] tracking-[3px] md:tracking-[4px] text-navy uppercase font-black mb-8 flex items-center gap-2 md:gap-3">
        <span className="w-6 md:w-8 h-px bg-green" /> Asset Strategic Portfolio
      </div>
      {loading ? [1].map(i=><div key={i} className="h-64 animate-pulse bg-navy/5 mb-6"/>) : vehicles.map(v=>(
        <div key={v.reg} className="glass-card border border-navy/10 p-8 md:p-10 mb-8 shadow-premium hover:shadow-glow-green transition-all duration-700 cut-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
            <div>
              <div className="font-sans text-3xl md:text-4xl font-bold text-navy tracking-tight mb-3">{v.make} {v.model}</div>
              <div className="flex items-center gap-4">
                <div className="text-[12px] font-mono text-ash font-black uppercase tracking-widest">{v.registration_number}</div>
                <span className="w-1.5 h-1.5 rounded-full bg-green glow-green animate-pulse" />
              </div>
            </div>
            <span className={`text-[10px] tracking-[4px] border-2 px-8 py-2.5 font-black cut-sm transition-all ${v.status==='active'?'text-green border-green/20 glass-card glow-green':'text-orange border-orange/20 bg-orange/5'}`}>
              {v.status.toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              {label:'Executed Yield', val:`₹${(v.total_revenue||0).toLocaleString('en-IN')}`, g:false},
              {label:'Net Passive', val:`₹${(v.net_yield||0).toLocaleString('en-IN')}`, g:true},
              {label:'Trip Protocol', val:(v.total_trips||0).toString(), g:false},
              {label:'Health Score', val:`${v.health_score||100}%`, g:true},
            ].map(s=>(
              <div key={s.label} className="bg-navy/[.02] border border-navy/5 p-6 glass-card cut-md">
                <div className="text-[9px] text-ash mb-3 font-black uppercase tracking-[2.5px]">{s.label}</div>
                <div className={`font-display text-3xl ${s.g?'text-green glow-green':'text-navy'}`}>{s.val}</div>
              </div>
            ))}
          </div>
          <div className="mb-4 flex justify-between text-[10px] font-black uppercase tracking-[3px]">
            <span className="text-navy">Mechanix Pro Strategic Index</span>
            <span className="text-green glow-green">{v.health_score||100}%</span>
          </div>
          <div className="h-4 bg-navy/[.03] overflow-hidden rounded-full">
            <div className="h-full bg-green glow-green shadow-[0_0_30px_rgba(34,197,94,.6)]" style={{width:`${v.health_score||100}%`}}/>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between border-t border-navy/5 pt-10 gap-6">
            <div className="text-[10px] text-ash font-black italic tracking-widest uppercase">
              Last Verify Protocol: <span className="text-green">{v.last_audit_date ? new Date(v.last_audit_date).toLocaleDateString() : 'Active // Secured'}</span>
            </div>
            {v.agreement_url && (
              <a href={v.agreement_url} target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-[5px] text-navy hover:text-orange font-black uppercase flex items-center gap-3 transition-all group">
                Smart Contract ↗
                <span className="w-10 h-px bg-navy/10 group-hover:bg-orange transition-all" />
              </a>
            )}
          </div>
        </div>
      ))}
      {!loading && vehicles.length === 0 && (
        <div className="p-12 md:p-20 text-center bg-void border border-navy/10 shadow-sm">
          <div className="text-3xl md:text-4xl mb-4">🚗</div>
          <div className="text-[10px] md:text-[11px] text-navy font-bold uppercase tracking-widest mb-2">No Assets Deployed</div>
          <p className="text-[9px] md:text-[10px] text-ash max-w-xs mx-auto mb-6">You haven&apos;t added any vehicles to the protocol yet. Start earning 70% yield by adding your first asset.</p>
          <a href="/investor#form" className="inline-block bg-green text-void text-[8px] md:text-[9px] tracking-[2px] md:tracking-[3px] px-6 md:px-8 py-2.5 md:py-3 font-bold uppercase hover:bg-green-dim transition-all cut-sm">Add Your First Asset →</a>
        </div>
      )}
    </div>
  )
}


function CalendarTab({stats}:{stats:InvestorStats|null}) {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  
  useEffect(() => {
    investorAPI.getVehicles().then(r => {
      setVehicles(r.data)
      if (r.data.length > 0) setSelectedVehicle(r.data[0].id)
    })
  }, [])

  const used = stats?.pauseDaysUsed || 0
  const remaining = stats?.pauseDaysRemaining ?? 5

  const today = new Date()
  const days = Array.from({length:31},(_,i)=>i+1)

  const toggle = (d:number) => {
    const key = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    if(selectedDates.includes(key)) { setSelectedDates(s=>s.filter(x=>x!==key)); return }
    if(selectedDates.length + used >= 5) { toast.error('Maximum 5 pause days per quarter'); return }
    setSelectedDates(s=>[...s,key])
  }

  const submit = async () => {
    if(!selectedVehicle) { toast.error('Select a vehicle to pause'); return }
    if(!selectedDates.length) { toast.error('Select at least one date'); return }
    setBusy(true)
    try {
      await investorAPI.pauseVehicle(selectedVehicle, selectedDates)
      toast.success(`✓ ${selectedDates.length} pause day(s) blocked for deployment.`)
      setSelectedDates([])
    } catch {
      toast.error('Pause protocol failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="text-[9px] md:text-[10px] tracking-[3px] md:tracking-[4px] text-navy uppercase font-black mb-8 flex items-center gap-2 md:gap-3">
        <span className="w-6 md:w-8 h-px bg-orange" /> Emergency Asset Pause Calendar
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-void border border-navy/10 p-6 md:p-8 shadow-sm">
          {vehicles.length > 1 && (
            <div className="mb-8">
              <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-3 font-black">Select Asset to Pause</label>
              <select value={selectedVehicle} onChange={e=>setSelectedVehicle(e.target.value)}
                className="w-full bg-navy/5 border border-navy/10 px-4 py-3 text-[11px] font-black uppercase outline-none focus:border-orange transition-all">
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.make} {v.model} ({v.registration_number})</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-between items-center mb-8">
            <span className="text-[11px] md:text-[12px] text-navy font-black tracking-widest uppercase">March 2026</span>
            <div className="flex items-center gap-3 md:gap-4 text-[8px] md:text-[9px] font-black uppercase">
              <span className="text-orange">{used + selectedDates.length}/5 USED</span>
              <span className="text-green">{remaining - selectedDates.length} REMAINING</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>(
              <div key={d} className="text-center text-[8px] md:text-[9px] text-ash font-black uppercase tracking-widest">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {days.map(d=>{
              const key = `2026-03-${String(d).padStart(2,'0')}`
              const isSel = selectedDates.includes(key)
              const isPast = d < today.getDate()
              return (
                <button key={d} disabled={isPast || (remaining - selectedDates.length <= 0 && !isSel)}
                  onClick={()=>toggle(d)}
                  className={`h-8 sm:h-10 text-[10px] md:text-[11px] font-bold transition-all border
                    ${isPast ? 'text-ash/30 border-transparent cursor-not-allowed' :
                      isSel ? 'bg-orange text-void border-orange shadow-[0_4px_15px_rgba(248,147,31,.3)]' :
                      'hover:bg-navy/5 text-navy border-navy/5'}`}>
                  {d}
                </button>
              )
            })}
          </div>
          {selectedDates.length > 0 && (
            <div className="mt-8 pt-8 border-t border-navy/5">
              <p className="text-[9px] md:text-[10px] text-ash font-bold uppercase tracking-widest mb-4">Protocol: {selectedDates.length} date(s) selected</p>
              <button onClick={submit} disabled={busy}
                className="w-full bg-navy text-void text-[9px] md:text-[10px] tracking-[3px] md:tracking-[4px] uppercase py-3.5 md:py-4 hover:bg-orange transition-all font-black disabled:opacity-60 cut-sm">
                {busy ? 'SYNCHRONIZING...' : 'CONFIRM PAUSE LOCK →'}
              </button>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="bg-orange/5 border border-orange/10 p-6 md:p-8">
            <div className="text-[9px] md:text-[10px] tracking-[3px] text-orange uppercase mb-6 font-black flex items-center gap-2 md:gap-3">
              <span className="w-5 md:w-6 h-px bg-orange" /> Pause Protocol Policy
            </div>
            <ul className="space-y-4 text-[10px] md:text-[11px] text-ash font-medium leading-relaxed">
              <li className="flex gap-3"><span className="text-orange">/</span> Maximum 5 pause days allowed per calendar quarter</li>
              <li className="flex gap-3"><span className="text-orange">/</span> Minimum 48 hours advance notice required for system lock</li>
              <li className="flex gap-3"><span className="text-orange">/</span> Asset revenue is projected as ₹0 for selected durations</li>
              <li className="flex gap-3"><span className="text-orange">/</span> Protocol cannot override active guest rental bookings</li>
            </ul>
          </div>
          <div className="bg-void border border-navy/10 p-4 md:p-6 flex items-center justify-between">
            <span className="text-[9px] md:text-[10px] tracking-[2px] md:tracking-[3px] text-navy uppercase font-black font-display text-center">Quarterly Usage Efficiency</span>
            <div className="flex gap-1.5 md:gap-2">
              {[1,2,3,4,5].map(i=>(
                <div key={i} className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-[9px] md:text-[10px] font-bold border-2 ${i<=used?'bg-orange border-orange text-void':i<=(used+selectedDates.length)?'bg-green border-green text-void':'border-navy/5 text-ash'}`}>
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



function TaxTab() {
  return (
    <div>
      <div className="text-xs font-semibold text-green tracking-wide mb-6 flex items-center gap-2">
        <span className="w-8 h-px bg-green" /> Financial Tax & CA Portal
      </div>
      <div className="bg-white border border-navy/10 p-6 md:p-10 mb-8 shadow-md">
        <p className="text-[12px] md:text-[13px] text-ash font-medium leading-relaxed mb-10 max-w-2xl">
          Protocol Export: Download verified, CA-ready ledger abstracts. Each export contains trip-by-trip gross values, platform deductions, and Mechanix audits for the selected duration.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="text-[8px] md:text-[9px] tracking-[3px] md:tracking-[4px] text-navy uppercase mb-6 font-black flex items-center gap-2 md:gap-3">
              <span className="w-5 md:w-6 h-px bg-navy/10" /> Monthly Ledger Abstracts
            </div>
            <div className="space-y-3">
              {['Jan 2026','Feb 2026','Mar 2026'].map(m=>(
                <button key={m} onClick={()=>{investorAPI.exportLedger(m);toast.success(`Exporting ${m}...`)}}
                  className="w-full flex items-center justify-between border-2 border-navy/5 text-[10px] md:text-[11px] px-4 md:px-6 py-3.5 md:py-4 hover:border-green hover:bg-green/5 transition-all group font-bold">
                  <span className="text-navy group-hover:text-green uppercase tracking-widest">{m}</span>
                  <span className="text-[8px] md:text-[9px] text-ash font-black tracking-widest uppercase">↓ XLSX</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[8px] md:text-[9px] tracking-[3px] md:tracking-[4px] text-navy uppercase mb-6 font-black flex items-center gap-2 md:gap-3">
              <span className="w-5 md:w-6 h-px bg-navy/10" /> Annual Consolidation
            </div>
            <button onClick={()=>{investorAPI.exportLedger('FY 2025-26');toast.success('Compiling FY 2025-26...')}}
              className="w-full border-2 border-navy/10 bg-navy/[.01] p-6 md:p-10 text-center hover:border-green hover:bg-green/5 transition-all group">
              <div className="font-sans text-4xl md:text-5xl text-navy mb-4 group-hover:text-green group-hover:scale-105 transition-all font-bold">FY 25-26</div>
              <div className="text-[9px] md:text-[10px] text-ash font-black uppercase tracking-[2px] md:tracking-[3px] mb-4">Financial Year Console</div>
              <div className="inline-block bg-navy text-void text-[8px] md:text-[9px] tracking-[2px] md:tracking-[3px] px-6 md:px-8 py-2.5 md:py-3 font-black uppercase group-hover:bg-green">Generate Full Year Export ↓</div>
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[
          {label:'Total Gross Compiled', val:'₹1,87,200', cls:false},
          {label:'Net Passive Consolidation', val:'₹1,32,000', cls:true},
          {label:'Total Regulatory Fee', val:'₹46,800', cls:false},
        ].map(s=>(
          <div key={s.label} className="bg-void border border-navy/10 p-4 md:p-6 shadow-sm">
            <div className="text-[8px] md:text-[9px] text-ash mb-2 md:mb-3 font-black uppercase tracking-[2px]">{s.label}</div>
            <div className={`font-display text-2xl md:text-3xl ${s.cls?'text-green':'text-navy'}`}>{s.val}</div>
          </div>
        ))}
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
      await investorAPI.uploadKYC(fd); toast.success('✓ Secure KYC Protocol Complete')
    } catch { toast.error('Upload failed') }
    finally { setBusy(false) }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
      <div className="text-[9px] md:text-[10px] tracking-[3px] md:tracking-[4px] text-navy uppercase font-black flex items-center gap-2 md:gap-3">
        <span className="w-6 md:w-8 h-px bg-orange" /> Secure KYC Verification Vault
      </div>
      <div className="bg-orange/5 border border-orange/20 p-4 md:p-6 text-[10px] md:text-[11px] text-orange font-bold uppercase tracking-wider md:tracking-widest flex items-center gap-4">
        <span className="text-xl md:text-2xl">⚠</span> PROTOCOL REQUIREMENT: KYC COMPLIANCE MUST BE VERIFIED BEFORE INITIAL PAYOUT.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {[
          {label:'PAN Registry', hint:'High-res Front · JPG/PDF', val:pan, set:setPan},
          {label:'Aadhar Protocol', hint:'Front + Rear · JPG/PDF', val:aad, set:setAad}
        ].map(f=>(
          <div key={f.label} className="bg-white border border-navy/10 p-6 md:p-10 shadow-sm hover:border-navy/30 transition-all text-center">
            <div className="text-[9px] md:text-[10px] tracking-[2px] md:tracking-[3px] text-navy uppercase mb-2 md:mb-3 font-black">{f.label}</div>
            <p className="text-[9px] md:text-[10px] text-ash mb-6 md:mb-8 font-bold italic">{f.hint}</p>
            <label className="block border-2 border-dashed border-navy/10 p-6 md:p-10 cursor-pointer hover:border-green hover:bg-green/5 transition-all group">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">{f.val?'✓':'📁'}</div>
              <div className="text-[8px] md:text-[9px] tracking-[2px] md:tracking-[3px] text-navy font-black uppercase truncate">{f.val?f.val.name:'SELECT DOCUMENT'}</div>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={e=>f.set(e.target.files?.[0]||null)} />
            </label>
          </div>
        ))}
      </div>
      <button onClick={upload} disabled={busy}
        className="w-full bg-navy text-void text-[10px] md:text-[11px] tracking-[4px] md:tracking-[5px] uppercase py-5 md:py-6 font-black hover:bg-green transition-all disabled:opacity-60 cut-sm">
        {busy?'SYNCHRONIZING WITH AWS S3...':'TRANSMIT & VERIFY DOCUMENTS →'}
      </button>
    </div>
  )
}


function BankTab() {
  const [form, setForm] = useState({account_number:'',ifsc_code:'',upi_id:''})
  const save = async () => {
    try { await investorAPI.saveBankDetails(form); toast.success('✓ Payout Routing Secured') }
    catch { toast.error('Save failed') }
  }
  const inp = "w-full bg-void border border-navy/10 px-4 md:px-6 py-3.5 md:py-4 text-[12px] md:text-[13px] text-navy font-bold font-mono placeholder-navy/10 focus:border-green outline-none transition-all"
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-[9px] md:text-[10px] tracking-[3px] md:tracking-[4px] text-navy uppercase font-black mb-8 flex items-center gap-2 md:gap-3">
        <span className="w-6 md:w-8 h-px bg-green" /> Payout Routing Registry
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-3 bg-white border border-navy/10 p-6 md:p-10 shadow-md space-y-6 md:space-y-8">
          {[{key:'account_number',label:'Primary Bank Account',ph:'0000 0000 0000 0000'},{key:'ifsc_code',label:'Registry IFSC Code',ph:'SBIN0001234'},{key:'upi_id',label:'Secondary UPI Protocol',ph:'8lines.investor@upi'}].map(f=>(
            <div key={f.key}>
              <label className="text-[8px] md:text-[9px] tracking-[3px] md:tracking-[4px] text-ash uppercase block mb-3 font-black">{f.label}</label>
              <input value={(form as any)[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} className={inp} />
            </div>
          ))}
          <button onClick={save} className="w-full bg-navy text-void text-[9px] md:text-[10px] tracking-[3px] md:tracking-[4px] uppercase py-4 md:py-5 font-black hover:bg-green transition-all cut-sm">SECURE PAYOUT ROUTING →</button>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-void border border-navy/10 p-6 md:p-8 shadow-sm">
            <div className="text-[9px] md:text-[10px] tracking-[3px] md:tracking-[4px] text-navy uppercase mb-6 font-black flex items-center gap-2 md:gap-3">
              <span className="w-5 md:w-6 h-px bg-green" /> Disbursment Schedule
            </div>
            <div className="space-y-6">
              {[
                {l:'Payout Sequence', v:'15th of Every Month', g:true},
                {l:'Protocol Window', v:'09:00 - 18:00 IST', g:false},
                {l:'Minimum Threshold', v:'₹1,000 Net Yield', g:false},
              ].map(r=>(
                <div key={r.l} className="border-b border-navy/5 pb-4 last:border-0 last:pb-0">
                  <div className="text-[7px] md:text-[8px] text-ash font-black uppercase tracking-[2px] mb-2">{r.l}</div>
                  <div className={`text-[11px] md:text-[12px] font-bold ${r.g?'text-green':'text-navy'}`}>{r.v}</div>
                </div>
              ))}
            </div>
          </div>
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
      <div className="text-[9px] md:text-[10px] tracking-[3px] md:tracking-[4px] text-navy uppercase font-black mb-8 flex items-center gap-2 md:gap-3">
        <span className="w-6 md:w-8 h-px bg-navy" /> Document Vault — Encrypted Legal Archive
      </div>
      <div className="bg-white border border-navy/10 shadow-md overflow-hidden mb-8">
        {loading ? [1,2].map(i => <div key={i} className="h-20 animate-pulse bg-navy/5 m-4"/>) : docs.map((d, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-center justify-between px-6 md:px-10 py-5 md:py-6 border-b border-navy/5 hover:bg-navy/[.01] transition-all group gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              <span className="text-2xl md:text-3xl grayscale group-hover:grayscale-0 transition-all">{d.icon}</span>
              <div>
                <div className="text-[12px] md:text-[13px] text-navy font-black mb-1 uppercase tracking-tight">{d.name}</div>
                <div className="text-[8px] md:text-[9px] text-ash font-black uppercase tracking-[1.5px] md:tracking-[2px]">{d.type} · EXECUTION DATE: {new Date(d.date).toLocaleDateString()}</div>
              </div>
            </div>
            <a href={d.url} target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto text-center text-[8px] md:text-[9px] tracking-[2px] md:tracking-[3px] text-navy border-2 border-navy/10 px-6 md:px-8 py-2.5 md:py-3 hover:bg-navy hover:text-void transition-all font-black uppercase shadow-sm">
              VIEW PROTOCOL ↗
            </a>
          </div>
        ))}
        {!loading && docs.length === 0 && (
          <div className="p-20 md:p-32 text-center text-ash text-[11px] md:text-[12px] font-bold tracking-[2px] md:tracking-[3px] uppercase italic">Initializing Document Encryption...</div>
        )}
      </div>
      <div className="bg-navy border-l-4 border-green p-6 md:p-8 text-[10px] md:text-[11px] text-void/40 font-medium leading-relaxed max-w-2xl">
        🔐 SECURITY PROTOCOL: All documents are stored in AWS S3 (Mumbai Region) with AES-256 server-side encryption. Access is restricted via IAM policies and signed URLs.
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
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
      <div className="lg:col-span-3">
        <div className="text-[9px] md:text-[10px] tracking-[3px] md:tracking-[4px] text-navy uppercase font-black mb-8 flex items-center gap-2 md:gap-3">
          <span className="w-6 md:w-8 h-px bg-green" /> Portfolio Expansion Calculator
        </div>
        <div className="bg-white border border-navy/10 shadow-lg overflow-hidden">
          <div className="bg-navy/5 border-b border-navy/10 px-6 md:px-8 py-4 flex items-center justify-between">
            <span className="text-[9px] md:text-[10px] tracking-[3px] md:tracking-[4px] text-navy uppercase font-black">Strategic Yield Predictor</span>
            <span className="text-[8px] md:text-[10px] text-green font-black flex items-center gap-2 md:gap-3"><span className="w-2 h-2 bg-green rounded-full animate-blink" />LIVE PROTOCOL</span>
          </div>
          <div className="p-6 md:p-10 space-y-8 md:space-y-10">
            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                <span className="text-[9px] md:text-[10px] tracking-[2px] md:tracking-[3px] text-ash uppercase font-black">Asset Capital Value</span>
                <span className="font-display text-3xl md:text-4xl text-navy">₹{asset.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min={500000} max={3000000} step={50000} value={asset}
                onChange={e=>setAsset(+e.target.value)} className="w-full h-1 accent-navy cursor-pointer" />
            </div>
            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                <span className="text-[9px] md:text-[10px] tracking-[2px] md:tracking-[3px] text-ash uppercase font-black">Projected Deployment Days</span>
                <span className="font-display text-3xl md:text-4xl text-navy">{days} days</span>
              </div>
              <input type="range" min={8} max={28} step={1} value={days}
                onChange={e=>setDays(+e.target.value)} className="w-full h-1 accent-navy cursor-pointer" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-navy/5 border border-navy/5">
              {[
                {label:'Gross Forecast', val:`₹${gross.toLocaleString('en-IN')}`, cls:'text-navy', g:false, icon:'📈'},
                {label:'Platform Fee (30%)', val:`-₹${fee.toLocaleString('en-IN')}`, cls:'text-ash', g:false, icon:'⊘'},
                {label:'Mechanix Expense', val:`-₹${mech.toLocaleString('en-IN')}`, cls:'text-ash', g:false, icon:'🔧'},
                {label:'Net Passive Yield', val:`₹${net.toLocaleString('en-IN')}`, cls:'text-green', g:true, icon:'💎'},
              ].map(r=>(
                <div key={r.label} className="bg-void p-5 md:p-6 text-center sm:text-left group/stat relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/stat:opacity-20 transition-opacity text-2xl">{r.icon}</div>
                  <div className="text-[8px] md:text-[9px] text-ash mb-2 md:mb-3 font-black uppercase tracking-[1.5px] md:tracking-[2px]">{r.label}</div>
                  <div className={`font-display text-2xl md:text-2xl ${r.cls} group-hover/stat:scale-105 transition-transform origin-left`}>{r.val}</div>
                </div>
              ))}
              <div className="col-span-1 sm:col-span-2 bg-void p-6 md:p-8 border-t border-navy/5 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group/annual">
                <div className="absolute inset-0 bg-green/[0.01] opacity-0 group-hover/annual:opacity-100 transition-opacity" />
                <div className="text-center sm:text-left relative z-10">
                  <div className="text-[9px] md:text-[10px] text-ash font-black uppercase tracking-[2px] md:tracking-[3px] mb-2 font-mono">// ANNUALIZED NET CONSOLIDATION</div>
                  <div className="font-display text-4xl md:text-5xl text-navy tracking-tight group-hover/annual:translate-x-2 transition-transform">₹{annual.toLocaleString('en-IN')}</div>
                </div>
                <div className="text-center sm:text-right relative z-10">
                  <div className="font-display text-5xl md:text-6xl text-green drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-pulse">{roi}%</div>
                  <div className="text-[9px] md:text-[10px] text-green font-black uppercase tracking-widest mt-2 px-4 py-1.5 border border-green/20 bg-green/5 shadow-glow-sm">{roi>25?'INSTITUTIONAL GRADE':'ALPHA YIELD LEVEL'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="text-[9px] md:text-[10px] tracking-[3px] md:tracking-[4px] text-navy uppercase font-black mb-8 flex items-center gap-2 md:gap-3">
          <span className="w-6 md:w-8 h-px bg-navy" /> Expansion Gateway
        </div>
        <div className="bg-void border border-navy/10 p-8 md:p-10 shadow-sm space-y-6 md:space-y-8">
          <p className="text-[13px] md:text-[14px] text-ash font-medium leading-relaxed">
            Secondary Asset Protocol: Expand your passive income strategy by deploying additional vehicles to the 8-Lines fleet.
          </p>
          <div className="space-y-4">
            {['Unified 70/30 yield abstract','Encapsulated MECHANIX PRO health audits','Asset-specific digital agreements','Real-time ledger multi-asset support'].map(b=>(
              <div key={b} className="flex gap-3 text-[10px] md:text-[11px] text-navy font-black uppercase tracking-wider md:tracking-widest">
                <span className="text-green shrink-0">✓</span>{b}
              </div>
            ))}
          </div>
          <a href="/investor#form"
            className="block w-full bg-navy text-void text-[10px] md:text-[11px] tracking-[4px] md:tracking-[5px] uppercase py-5 md:py-6 text-center font-black hover:bg-green transition-all cut-sm shadow-xl">
            EXPAND PORTFOLIO →
          </a>
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
    if (typeof window !== 'undefined' && localStorage.getItem('8l_user_type') === 'renter') {
      router.push('/drive/dashboard')
      return;
    }
    loadUser().then(()=>{ if(!useAuthStore.getState().user) router.push('/login') })
    investorAPI.getStats().then(r=>setStats(r.data)).catch(()=>{})
    investorAPI.getTrips().then(r=>setTrips(r.data?.trips||[])).catch(()=>{})
  },[])

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Topbar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[68px] bg-white border-b border-navy/8 flex items-center justify-between px-4 md:px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2">
            <DynamicLogo className="h-8 w-auto text-navy" />
          </a>
          <div className="h-6 w-px bg-navy/10 hidden sm:block" />
          <div className="text-[10px] tracking-widest text-green border border-green/25 px-3 py-1 font-bold uppercase hidden sm:block bg-green/5 rounded-sm">INVESTOR PORTAL</div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex items-center gap-2 bg-green/5 border border-green/15 px-3 py-1.5 rounded-sm">
            <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
            <span className="text-[11px] text-green font-bold uppercase tracking-widest">SECURED</span>
          </div>
          <span className="text-[13px] text-navy font-bold truncate max-w-[120px] md:max-w-none">{user?.name||user?.phone||'Investor'}</span>
          <a href="/" className="text-[11px] text-navy/40 hover:text-navy border border-navy/10 px-3 py-2 uppercase transition-all font-bold hidden sm:block rounded-sm">← Home</a>
          <button onClick={logout} className="text-[11px] tracking-[2px] text-white bg-navy hover:bg-orange transition-colors uppercase border-0 px-4 py-2 font-black rounded-sm">Logout</button>
        </div>
      </div>

      <div className="flex flex-1 pt-[68px] flex-col lg:flex-row h-[calc(100vh-68px)] overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-[240px] bg-white border-b lg:border-b-0 lg:border-r border-navy/8 lg:fixed lg:top-[68px] lg:bottom-0 lg:left-0 overflow-x-auto lg:overflow-y-auto scrollbar-none z-40 shadow-md">
          {/* User Profile */}
          <div className="hidden lg:block p-6 border-b border-navy/5 bg-navy relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-5" style={{backgroundImage:`radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,backgroundSize:'20px 20px'}} />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-sm flex items-center justify-center text-2xl mb-4">👤</div>
              <div className="text-[15px] text-white font-bold truncate uppercase tracking-tight leading-tight mb-1">{user?.name||user?.phone||'Investor'}</div>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${user?.kycVerified?'bg-green animate-pulse':'bg-orange animate-pulse'}`} />
                 <span className={`text-[11px] font-bold uppercase tracking-tight ${user?.kycVerified?'text-green':'text-orange'}`}>
                   {user?.kycVerified?'KYC Verified':'KYC Pending'}
                 </span>
              </div>
            </div>
          </div>
          
          <div className="flex lg:flex-col p-2 lg:py-4 min-w-max lg:min-w-0">
            <div className="hidden lg:block px-5 pt-4 pb-2">
               <div className="text-[10px] tracking-widest text-navy/25 uppercase font-bold">NAVIGATION</div>
            </div>
            {NAV.map((n) => (
              <div key={n.id} className="flex">
                <button onClick={()=>setTab(n.id)}
                  className={`flex items-center gap-3 px-5 py-3.5 lg:py-4 text-[12px] tracking-tight uppercase text-left transition-all border-b-2 lg:border-b-0 lg:border-l-4 font-bold whitespace-nowrap w-full ${
                    tab===n.id
                      ?'text-navy border-orange bg-orange/5 shadow-inner'
                      :'text-navy/40 border-transparent hover:text-navy hover:bg-navy/5'
                  }`}>
                  <span className={`text-[16px] transition-all ${tab===n.id?'scale-110':''}`}>{n.icon}</span>
                  <span className="hidden sm:inline">{n.label}</span>
                  <span className="sm:hidden">{n.short || n.label.split(' ')[0]}</span>
                </button>
              </div>
            ))}
            
            {/* Market Watch */}
            <div className="hidden lg:block mt-6 px-5 pt-6 border-t border-navy/5">
                <div className="text-[10px] tracking-widest text-navy/25 uppercase font-bold mb-4">MARKET DEMAND</div>
                <div className="space-y-4">
                    {MARKET_DEMAND.map((m, i) => (
                      <div key={i} className="flex justify-between items-center">
                          <span className="text-[12px] text-navy font-bold">{m.model}</span>
                          <span className={`text-[12px] font-black ${m.trend==='up'?'text-green':'text-orange'}`}>{m.demand}</span>
                      </div>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 w-full lg:pl-[240px] p-4 md:p-8 transition-all overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {tab==='overview'  && <OverviewTab stats={stats} setTab={setTab}/>}
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
      </div>
    </main>
  )
}
