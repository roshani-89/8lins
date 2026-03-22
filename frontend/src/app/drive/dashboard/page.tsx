'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { DynamicLogo } from '@/components/ui/Logos'
import toast from 'react-hot-toast'

const NAV_TABS = [
  { id: 'bookings', label: 'My Bookings', icon: '🛣️' },
  { id: 'live', label: 'Live Ride', icon: '📍' },
  { id: 'history', label: 'Rental History', icon: '📊' },
  { id: 'documents', label: 'Document Vault', icon: '🧾' },
  { id: 'profile', label: 'User Profile', icon: '👤' },
  { id: 'support', label: 'Support & Help', icon: '💬' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

const MOCK_BOOKINGS = [
  { id: 'BK-8L-9012', car: 'Thar Roxx', img: '/images/thar_roxx.png', duration: '3 Days', start: '15 Mar 2026', end: '18 Mar 2026', status: 'Ongoing', price: 10497 },
  { id: 'BK-8L-8821', car: 'XUV 300', img: '/images/xuv300.png', duration: '1 Day', start: '28 Feb 2026', end: '01 Mar 2026', status: 'Completed', price: 2799 },
]

function BookingsTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-xs md:text-sm font-semibold text-orange tracking-wide mb-6 flex items-center gap-2">
        <span className="w-8 h-px bg-orange" /> Mission Control
      </div>
      <h2 className="font-sans text-3xl md:text-4xl text-navy font-bold tracking-tight mb-8">Active Reservations</h2>
      
      <div className="space-y-6">
        {MOCK_BOOKINGS.map(b => (
          <div key={b.id} className="bg-white border border-navy/5 shadow-lg cut-lg flex flex-col md:flex-row overflow-hidden group">
            <div className="w-full md:w-64 bg-navy/[0.02] flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-navy/5">
              <img src={b.img} alt={b.car} className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-sm tracking-wider text-navy/40 font-mono mb-1">ID: {b.id}</div>
                  <div className="font-sans text-2xl md:text-3xl font-bold text-navy tracking-wide">{b.car}</div>
                </div>
                <div className={`px-4 py-1.5 text-sm font-semibold tracking-wide text-ash cut-sm ${b.status==='Ongoing'?'bg-orange/10 text-orange':'bg-green/10 text-green'}`}>
                  {b.status}
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 border-y border-navy/5 py-6">
                <div><div className="text-sm text-ash tracking-wider font-semibold mb-1">Duration</div><div className="text-base text-navy font-bold">{b.duration}</div></div>
                <div><div className="text-sm text-ash tracking-wider font-semibold mb-1">Pickup</div><div className="text-base text-navy font-bold">{b.start}</div></div>
                <div><div className="text-sm text-ash tracking-wider font-semibold mb-1">Drop-off</div><div className="text-base text-navy font-bold">{b.end}</div></div>
                <div><div className="text-sm text-ash tracking-wider font-semibold mb-1">Total</div><div className="text-base text-orange font-semibold">₹{b.price.toLocaleString('en-IN')}</div></div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button className="bg-navy text-white text-sm tracking-wider  px-8 py-3 font-semibold cut-sm hover:bg-orange transition-all">View Details →</button>
                {b.status === 'Ongoing' && <button className="border-2 border-orange/20 text-orange text-sm tracking-wider  px-8 py-3 font-semibold cut-sm hover:bg-orange hover:text-white transition-all shadow-glow">Track Live</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LiveTrackingTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-xs md:text-sm font-semibold text-orange tracking-wide mb-6 flex items-center gap-2">
        <span className="w-8 h-px bg-orange" /> Active Deployment
      </div>
      <h2 className="font-sans text-3xl md:text-4xl text-navy font-bold tracking-tight mb-8">LIVE TELEMETRY <span className="text-orange">RADAR.</span></h2>
      
      <div className="bg-white border border-navy/5 shadow-2xl cut-lg relative overflow-hidden flex flex-col lg:flex-row h-[600px]">
        {/* Map Area Mock */}
        <div className="flex-1 bg-navy/5 relative flex items-center justify-center p-8 overflow-hidden group">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at center, #F8931F 1px, transparent 1px)', backgroundSize: '20px 20px'}} />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent z-10" />
          
          <div className="relative z-20 text-center animate-pulse-slow">
            <div className="w-24 h-24 rounded-full bg-orange/10 flex items-center justify-center border border-orange/20 mx-auto mb-4 relative">
               <div className="absolute inset-0 rounded-full border border-orange animate-ping opacity-30" />
               <span className="text-4xl shadow-glow">🚙</span>
            </div>
            <div className="text-sm tracking-wider text-navy font-semibold  bg-white/80 backdrop-blur px-4 py-2 rounded-sm shadow-sm">Tracking: KA04 XX0001</div>
          </div>
        </div>
        
        {/* Sidebar Status */}
        <div className="w-full lg:w-96 bg-void p-8 flex flex-col z-20 border-l border-navy/5">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-navy/5">
            <div className="text-sm font-bold text-navy tracking-wide ">Thar Roxx</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green rounded-full animate-pulse shadow-glow-green" /><span className="text-sm text-green tracking-widest font-semibold">ON MOVE</span></div>
          </div>
          
          <div className="space-y-8 flex-1">
            <div className="relative pl-6 border-l-2 border-navy/10 space-y-8">
              <div className="relative">
                <div className="absolute w-3 h-3 bg-navy rounded-full -left-[23px] top-1 border-[3px] border-white" />
                <div className="text-sm text-ash font-semibold tracking-wide text-ash mb-1">Pickup (Completed)</div>
                <div className="text-sm text-navy font-bold">Kempegowda Int. Airport</div>
                <div className="text-sm text-navy/40 font-mono mt-1">15 Mar, 09:30 AM</div>
              </div>
              <div className="relative">
                <div className="absolute w-3 h-3 bg-orange rounded-full -left-[23px] top-1 border-[3px] border-white shadow-glow" style={{animation:'blink 1.5s infinite'}} />
                <div className="text-sm text-orange font-semibold tracking-wide text-ash mb-1">Current Location</div>
                <div className="text-sm text-navy font-bold">UB City, Vittal Mallya Road</div>
                <div className="text-sm text-navy/40 font-mono mt-1">Speed: 42 km/h</div>
              </div>
              <div className="relative">
                <div className="absolute w-3 h-3 bg-navy/20 rounded-full -left-[23px] top-1 border-[3px] border-white" />
                <div className="text-sm text-ash font-semibold tracking-wide text-ash mb-1">Drop-off (Est.)</div>
                <div className="text-sm text-navy font-bold">Indiranagar 100ft Rd</div>
                <div className="text-sm text-navy/40 font-mono mt-1">18 Mar, 10:00 AM</div>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-navy/5">
            <button className="w-full bg-red-500/10 text-red-600 border border-red-500/20 py-4 text-sm font-semibold tracking-wider  hover:bg-red-500 hover:text-white transition-all cut-sm flex items-center justify-center gap-3">
              <span className="text-lg">⚠</span> EMERGENCY N.O.C
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileTab() {
  const { user } = useAuthStore()
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="text-xs md:text-sm font-semibold text-orange tracking-wide mb-6 flex items-center gap-2">
        <span className="w-8 h-px bg-orange" /> User Profile Module
      </div>
      <h2 className="font-sans text-3xl md:text-4xl text-navy font-bold tracking-tight mb-8">IDENTITY <span className="text-orange">CLEARANCE.</span></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-navy/5 shadow-md p-8 cut-md group hover:border-orange/20 transition-all">
          <div className="text-sm tracking-wider text-navy/40 font-semibold  mb-6">Basic Information</div>
          <div className="space-y-6">
            <div><label className="text-xs font-semibold text-ash tracking-wide">Full Legal Name</label><div className="text-base text-navy font-semibold mt-1">{user?.name || 'Driver Pro'}</div></div>
            <div><label className="text-xs font-semibold text-ash tracking-wide">Secured Mobile</label><div className="text-base text-navy font-mono font-bold mt-1">+91 {user?.phone || '9XXXX XXXXX'}</div></div>
            <button className="text-sm text-orange font-semibold tracking-wide text-ash border-b border-orange pb-0.5 mt-2 hover:opacity-70">Edit Profile →</button>
          </div>
        </div>
        
        <div className="bg-white border border-navy/5 shadow-md p-8 cut-md relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-9xl opacity-[0.02] group-hover:opacity-[0.04] transition-opacity">🛡️</div>
          <div className="text-sm tracking-wider text-navy/40 font-semibold  mb-6">KYC Compliance</div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full border-2 border-green flex items-center justify-center bg-green/10 text-green shadow-glow-green text-xl">✓</div>
            <div>
              <div className="text-sm text-navy font-semibold ">Identity Verified</div>
              <div className="text-sm text-ash font-bold tracking-wide text-ash mt-1">Driving License · Aadhar</div>
            </div>
          </div>
          <button className="text-sm text-navy/40 font-semibold tracking-wide text-ash border border-navy/10 px-4 py-2 hover:text-navy hover:border-navy transition-all rounded-sm">View Uploaded Documents</button>
        </div>
        
        <div className="bg-white border border-navy/5 shadow-md p-8 cut-md md:col-span-2">
          <div className="text-sm tracking-wider text-navy/40 font-semibold  mb-6">Saved Operations (Addresses)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-navy/10 p-5 hover:border-orange/30 transition-all cursor-pointer">
              <div className="text-sm text-navy font-semibold tracking-wide text-ash mb-2">Home Base</div>
              <div className="text-sm text-ash font-medium leading-relaxed">Level 4, Orion Mall Residency<br/>Rajajinagar, Bengaluru 560055</div>
            </div>
            <div className="border border-dashed border-navy/20 p-5 flex items-center justify-center hover:border-orange transition-all cursor-pointer bg-navy/[0.01] hover:bg-orange/5">
              <span className="text-sm text-navy/60 font-semibold tracking-wider ">+ ADD LOCATION</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DocumentsTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
       <div className="text-xs md:text-sm font-semibold text-orange tracking-wide mb-6 flex items-center gap-2">
        <span className="w-8 h-px bg-orange" /> Vault Systems
      </div>
      <h2 className="font-sans text-3xl md:text-4xl text-navy font-bold tracking-tight mb-8">SECURE DOCUMENT <span className="text-orange">ARCHIVE.</span></h2>
      <div className="bg-white border border-navy/5 shadow-lg overflow-hidden cut-lg">
        {[
          { icon: '📄', name: 'Master Lease Agreement', desc: 'BK-8L-9012 (Thar Roxx)', date: '15 Mar 2026' },
          { icon: '🧾', name: 'Tax Invoice & Receipt', desc: 'BK-8L-8821 (XUV 300)', date: '01 Mar 2026' },
          { icon: '🛡️', name: 'Comprehensive Insurance Copy', desc: 'Active Coverage', date: 'Valid till 2027' },
        ].map((d, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-6 md:p-8 border-b border-navy/5 hover:bg-orange/5 transition-all group gap-4 last:border-0">
            <div className="flex items-center gap-6">
              <div className="text-3xl grayscale group-hover:grayscale-0 transition-all group-hover:scale-110">{d.icon}</div>
              <div>
                <div className="text-base text-navy font-semibold mb-1 tracking-tight">{d.name}</div>
                <div className="text-sm text-ash font-semibold tracking-wide text-ash">{d.desc} · {d.date}</div>
              </div>
            </div>
            <button className="w-full sm:w-auto text-sm tracking-wider text-navy border-2 border-navy/10 px-8 py-3 hover:bg-navy hover:text-white transition-all font-semibold  cut-sm">
              DOWNLOAD PDF ↓
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function HistoryTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="text-xs md:text-sm font-semibold text-orange tracking-wide mb-6 flex items-center gap-2">
        <span className="w-8 h-px bg-orange" /> Rental History
      </div>
      <h2 className="font-sans text-3xl md:text-4xl text-navy font-bold tracking-tight mb-8">PAST <span className="text-orange">EXPEDITIONS.</span></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-navy border-l-4 border-orange p-6 cut-md shadow-lg text-white">
           <div className="text-sm tracking-wider font-semibold opacity-50 mb-1">Total Exploits</div>
           <div className="font-sans text-4xl">12</div>
         </div>
         <div className="bg-white border border-navy/5 p-6 cut-md shadow-sm">
           <div className="text-xs font-medium tracking-wide text-navy/40 mb-1">Total Lifetime Spend</div>
           <div className="font-sans text-2xl md:text-3xl font-bold text-navy">₹48,250</div>
         </div>
         <div className="bg-white border border-navy/5 p-6 cut-md shadow-sm border-b-4 border-b-green">
           <div className="text-xs font-medium tracking-wide text-navy/40 mb-1">Reputation Score</div>
           <div className="font-sans text-3xl text-green">4.9/5</div>
         </div>
      </div>

      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white border border-navy/5 p-6 cut-md shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-orange/20 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center text-xl shrink-0">🚙</div>
              <div>
                <div className="text-base text-navy font-semibold tracking-wide text-ash">Kia Carens (BK-8L-70{i}1)</div>
                <div className="text-sm text-ash font-bold tracking-wide text-ash mt-1">Feb 2026 · 2 Days · ₹5,400</div>
              </div>
            </div>
            <div className="w-full md:w-auto flex flex-col items-end gap-2 text-right">
              <div className="text-sm px-3 py-1 bg-navy/5 text-navy font-semibold tracking-wide text-ash cut-sm">COMPLETED</div>
              <button className="text-sm text-orange font-semibold tracking-wide text-ash border-b border-orange hover:opacity-70">Rate This Booking ⭐</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SupportTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="text-xs md:text-sm font-semibold text-orange tracking-wide mb-6 flex items-center gap-2">
        <span className="w-8 h-px bg-orange" /> IRM Support Protocol
      </div>
      <div className="flex justify-between items-end mb-8">
        <h2 className="font-sans text-3xl md:text-4xl text-navy font-bold tracking-tight">HELP <span className="text-orange">CENTER.</span></h2>
        <button className="bg-navy text-white text-sm tracking-wider  px-6 py-3 font-semibold cut-sm hover:bg-orange transition-all shadow-lg">+ RAISE NEW TICKET</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {['Billing Query', 'Mechanical Assistance', 'Extension Request'].map((q, i) => (
          <div key={i} className="bg-white border border-navy/5 p-6 cut-md shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="text-2xl mb-4 group-hover:scale-110 transition-transform origin-left">❓</div>
            <div className="text-sm text-navy font-semibold  mb-1">{q}</div>
            <div className="text-sm text-ash font-medium">Find answers to common issues</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-navy/5 cut-lg overflow-hidden shadow-lg">
        <div className="bg-navy/5 px-6 py-4 border-b border-navy/5 text-sm font-semibold tracking-wide text-ash text-navy/40">Active Ticket History</div>
        <div className="p-8 text-center text-sm text-ash/50 font-semibold tracking-wide text-ash italic py-20 border-2 border-dashed border-navy/5 m-4">
          No Support Tickets Currently Open
        </div>
      </div>
    </div>
  )
}

function NotificationsTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="text-xs md:text-sm font-semibold text-orange tracking-wide mb-6 flex items-center gap-2">
        <span className="w-8 h-px bg-orange" /> Communication Grid
      </div>
      <h2 className="font-sans text-3xl md:text-4xl text-navy font-bold tracking-tight mb-8">SYSTEM <span className="text-orange">ALERTS.</span></h2>
      
      <div className="space-y-3">
        {[
          { title: "Booking Confirmed", desc: "Your reservation for Thar Roxx is secured. Pickup at 09:00 AM.", time: "2 hours ago", type: "success" },
          { title: "Wallet Offer Active", desc: "Use code ROXX20 for 20% off on your next weekend drive.", time: "1 day ago", type: "promo" },
          { title: "Invoice Generated", desc: "Invoice INT-XUV-8821 available in Document Vault.", time: "10 days ago", type: "info" }
        ].map((n, i) => (
          <div key={i} className="bg-white border-l-4 border border-navy/5 p-5 cut-sm shadow-sm flex justify-between items-center group" 
               style={{ borderLeftColor: n.type === 'success' ? '#22C55E' : n.type === 'promo' ? '#F8931F' : '#0C1D36' }}>
            <div>
              <div className="text-base text-navy font-semibold  mb-1">{n.title}</div>
              <div className="text-sm text-ash font-medium">{n.desc}</div>
            </div>
            <div className="text-sm text-navy/40 font-bold tracking-wide text-ash whitespace-nowrap">{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="text-xs md:text-sm font-semibold text-orange tracking-wide mb-6 flex items-center gap-2">
        <span className="w-8 h-px bg-orange" /> Preferences
      </div>
      <h2 className="font-sans text-3xl md:text-4xl text-navy font-bold tracking-tight mb-8">GLOBAL <span className="text-orange">SETTINGS.</span></h2>
      
      <div className="bg-white border border-navy/5 p-8 cut-md shadow-md space-y-8">
        <div className="flex justify-between items-center pb-6 border-b border-navy/5">
          <div>
            <div className="text-sm text-navy font-semibold  mb-1">Email Notifications</div>
            <div className="text-sm text-ash font-medium">Receive booking updates and invoices via email.</div>
          </div>
          <input type="checkbox" className="w-5 h-5 accent-orange cursor-pointer" defaultChecked />
        </div>
        
        <div className="flex justify-between items-center pb-6 border-b border-navy/5">
          <div>
            <div className="text-sm text-navy font-semibold  mb-1">WhatsApp Alerts</div>
            <div className="text-sm text-ash font-medium">Receive real-time tracking and emergency NOC features on WhatsApp.</div>
          </div>
          <input type="checkbox" className="w-5 h-5 accent-orange cursor-pointer" defaultChecked />
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-red-600 font-semibold  mb-1">Danger Zone</div>
            <div className="text-sm text-ash font-medium">Permanently anonymize your account and delete history.</div>
          </div>
          <button className="text-sm text-red-600 font-semibold tracking-wide text-ash border border-red-200 px-4 py-2 hover:bg-red-50 transition-colors cut-sm">Deactivate Profile</button>
        </div>
      </div>
    </div>
  )
}

export default function DriveDashboardPage() {
  const { user, logout, loadUser } = useAuthStore()
  const router = useRouter()
  const [tab, setTab] = useState('bookings')

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('8l_user_type') === 'investor') {
      router.push('/dashboard')
      return;
    }
    loadUser().then(()=>{ 
      if(!useAuthStore.getState().user) router.push('/drive/login') 
    })
  }, [])

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Driver Topbar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-white border-b border-navy/5 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-5">
          <a href="/" className="hover:opacity-80 transition-opacity">
            <DynamicLogo className="h-10 w-auto" />
          </a>
          <div className="h-6 w-px bg-navy/10 hidden md:block" />
          <div className="text-sm tracking-wider text-orange border border-orange/20 px-4 py-1.5 font-semibold  hidden md:block bg-orange/5 rounded-sm">
            Guest Terminal
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
             <div className="text-sm text-navy font-semibold  leading-none mb-1">{user?.name || user?.phone || 'Guest Profile'}</div>
             <div className="text-sm text-green tracking-widest font-semibold flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" /> Identity Secure
             </div>
          </div>
          <div className="w-10 h-10 border-2 border-navy/10 flex items-center justify-center bg-navy/5 text-navy font-sans text-xl rounded-sm">👤</div>
          <div className="h-6 w-px bg-navy/10 mx-1" />
          <button onClick={logout} className="text-sm tracking-wider text-white bg-navy hover:bg-red-500 transition-colors  px-5 py-2.5 font-semibold cut-sm">
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex flex-1 pt-[72px] flex-col lg:flex-row relative">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-[280px] bg-white border-b lg:border-b-0 lg:border-r border-navy/5 lg:fixed lg:top-[72px] lg:bottom-0 lg:left-0 overflow-x-auto lg:overflow-y-auto z-40 shadow-sm flex lg:flex-col p-3 lg:p-6 lg:pt-8 custom-scrollbar">
          <div className="hidden lg:block text-xs font-medium tracking-wide text-navy/30 px-4 mb-6">Operations Panel</div>
          <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
            {NAV_TABS.map(n => (
              <button key={n.id} onClick={()=>setTab(n.id)}
                className={`flex items-center gap-4 px-5 py-4 text-sm tracking-wider text-left transition-all font-semibold cut-sm whitespace-nowrap
                  ${tab===n.id 
                    ? 'bg-navy text-void shadow-xl scale-[1.02] translate-x-1 lg:translate-x-2' 
                    : 'text-navy/60 hover:text-navy hover:bg-navy/5'}`}>
                <span className="text-lg opacity-80">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </div>
          
          <div className="hidden lg:block mt-auto pt-8">
            <div className="bg-orange/5 border border-orange/10 p-5 cut-sm">
              <div className="text-sm font-semibold text-orange tracking-wide text-ash mb-2 text-center">Need Fast Assistance?</div>
              <button className="w-full bg-orange text-void text-sm tracking-wider  py-3 font-semibold shadow-glow cut-sm transition-all hover:bg-orange-dim">
                Call 8-Lines Hub
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-[280px] p-6 lg:p-12 transition-all">
          <div className="max-w-6xl mx-auto">
            {tab === 'bookings' && <BookingsTab />}
            {tab === 'live' && <LiveTrackingTab />}
            {tab === 'profile' && <ProfileTab />}
            {tab === 'documents' && <DocumentsTab />}
            {tab === 'history' && <HistoryTab />}
            {tab === 'support' && <SupportTab />}
            {tab === 'notifications' && <NotificationsTab />}
            {tab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
    </main>
  )
}
