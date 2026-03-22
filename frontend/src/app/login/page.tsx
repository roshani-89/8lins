'use client'
import Link from 'next/link'

export default function EntryChoicePage() {
  return (
    <main className="min-h-screen bg-void flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{background:'linear-gradient(135deg, rgba(248,147,31,0.03) 0%, transparent 50%, rgba(18,51,43,0.03) 100%)'}} />
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      
      <div className="w-full max-w-4xl relative z-10 px-6 py-20 flex flex-col items-center">
        <div className="text-center mb-16 px-4">
          <Link href="/" className="font-display text-5xl md:text-8xl tracking-[20px] text-navy inline-block mb-8 hover:scale-105 transition-transform duration-700">
            <em className="text-orange not-italic">8</em>LINES
          </Link>
          <div className="text-[10px] md:text-[12px] tracking-[10px] text-navy/40 uppercase font-black">PROTOCOL SELECTION // ACCESS-POINT</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          {/* Drive Portal */}
          <Link href="/drive/login" className="group bg-white border border-navy/5 p-12 hover:border-orange/30 transition-all duration-500 shadow-xl hover:shadow-2xl cut-lg relative overflow-hidden text-center md:text-left">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 " />
            <div className="relative z-10">
              <div className="text-[10px] tracking-[6px] text-orange uppercase mb-6 font-black flex items-center justify-center md:justify-start gap-3">
                <span className="w-8 h-px bg-orange"/> RENTER GATEWAY
              </div>
              <h2 className="font-display text-5xl text-navy uppercase leading-none mb-6 group-hover:text-orange transition-colors">DRIVE.</h2>
              <p className="text-[14px] text-ash/70 font-medium mb-10 max-w-[280px] group-hover:text-ash transition-colors uppercase tracking-widest leading-loose">
                Access the elite fleet. Book your next performance machine. Hub-verified.
              </p>
              <div className="inline-flex items-center gap-4 text-[11px] tracking-[4px] text-orange font-black group-hover:translate-x-2 transition-transform">
                AUTHENTICATE →
              </div>
            </div>
          </Link>

          {/* Investor Portal */}
          <Link href="/investor/login" className="group bg-white border border-navy/5 p-12 hover:border-green/30 transition-all duration-500 shadow-xl hover:shadow-2xl cut-lg relative overflow-hidden text-center md:text-right">
             <div className="absolute inset-0 bg-gradient-to-tl from-green/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 " />
            <div className="relative z-10">
              <div className="text-[10px] tracking-[6px] text-green uppercase mb-6 font-black flex items-center justify-center md:justify-end gap-3">
                ASSET GATEWAY <span className="w-8 h-px bg-green"/>
              </div>
              <h2 className="font-display text-5xl text-navy uppercase leading-none mb-6 group-hover:text-green transition-colors">INVEST.</h2>
              <p className="text-[14px] text-ash/70 font-medium mb-10 max-w-[280px] ml-auto group-hover:text-ash transition-colors uppercase tracking-widest leading-loose">
                Deploy capital. Command yield. Track your asset in real-time. Passive.
              </p>
              <div className="inline-flex items-center gap-4 text-[11px] tracking-[4px] text-green font-black group-hover:-translate-x-2 transition-transform">
                AUTHENTICATE →
              </div>
            </div>
          </Link>
        </div>
        
        <div className="mt-20 flex items-center gap-8 opacity-20">
          <span className="text-[10px] font-black tracking-[4px] text-navy uppercase italic">BLR_HUB_ALPHA</span>
          <span className="w-1.5 h-1.5 rounded-full bg-navy/20" />
          <span className="text-[10px] font-black tracking-[4px] text-navy uppercase italic">SERIES_I_DEPLOYMENT</span>
        </div>
      </div>
    </main>
  )
}
