'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MainLogo } from '@/components/ui/Logos'

export default function Footer() {
  const path = usePathname()
  const isDarkPage = path.startsWith('/admin') || path.startsWith('/dashboard')

  return (
    <footer className={`${isDarkPage ? 'bg-navy border-white/5' : 'bg-void border-navy/10'} px-6 md:px-12 lg:px-20 py-24 relative overflow-hidden z-10 border-t transition-colors duration-500`}>
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
          <div className="lg:col-span-4">
            <MainLogo className="h-16 w-auto mb-10 hover:scale-105 transition-transform duration-500 origin-left" dark={isDarkPage} />
            <p className={`text-[15px] leading-relaxed font-medium max-w-[340px] mb-12 ${isDarkPage ? 'text-void/60' : 'text-ash'}`}>
              Bengaluru&apos;s most sophisticated high-performance asset management infrastructure. Commanding 70% net passive yields for the elite automotive investor.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-5 group">
                <span className="text-green text-lg shrink-0 transition-all">⌖</span>
                <span className={`text-[11px] font-black tracking-widest leading-relaxed uppercase ${isDarkPage ? 'text-void/60' : 'text-ash'}`}>
                  8-LINES HUB ALPHA<br/>
                  <span className={`${isDarkPage ? 'text-void' : 'text-navy'} hover:text-orange transition-colors`}>Mangammanapalya, BLR 560068</span>
                </span>
              </div>
              <div className="flex items-center gap-5 group">
                <span className="text-orange text-lg shrink-0 transition-all">✉</span>
                <a href="mailto:ops@8linesgroup.com" className={`text-[11px] font-black tracking-[3px] transition-all uppercase ${isDarkPage ? 'text-void/60 hover:text-void' : 'text-ash hover:text-navy'}`}>OFFICE@8LINESGROUP.COM</a>
              </div>
              <div className="flex items-center gap-5 group">
                <span className="text-green text-lg shrink-0 transition-all">☏</span>
                <a href="tel:+918884440001" className={`text-[11px] font-black tracking-[3px] transition-all uppercase underline underline-offset-4 ${isDarkPage ? 'text-void/60 hover:text-void decoration-void/10' : 'text-ash hover:text-navy decoration-navy/10'}`}>DIRECT: SHAIK AFNAN SABIL</a>
              </div>
            </div>

            <div className={`mt-16 flex items-center gap-4 text-[10px] tracking-[6px] font-black uppercase px-8 py-5 w-fit border cut-md ${isDarkPage ? 'text-green bg-green/10 border-green/20' : 'text-green bg-green/5 border-green/10'}`}>
              <span className="w-2 h-2 rounded-full bg-green shadow-[0_0_12px_#22C55E] animate-pulse" />
              SYSTEM PERFORMANCE: NOMINAL
            </div>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-16 lg:gap-8 lg:ml-20">
            {[
              {
                title:'Engine Room',
                links:[
                  {h:'/fleet',    l:'The Registry'},
                  {h:'/investor', l:'Asset Deployment'},
                  {h:'/investor/login',    l:'Investor Terminal'},
                  {h:'/corporate',l:'Enterprise Fleet'},
                ]
              },
              {
                title:'Technical Specs',
                links:[
                  {h:'/legal',           l:'Service Protocols'},
                  {h:'/legal?tab=privacy', l:'Data Privacy'},
                  {h:'/legal?tab=agreement', l:'Master Agreement'},
                  {h:'/legal',           l:'Compliance Index'},
                ]
              },
              {
                title:'The Network',
                links:[
                  {h:'/investor',           l:'Roadmap 2026'},
                  {h:'/investor',           l:'Strategic Hubs'},
                  {h:'/investor',           l:'Mechanix Index'},
                  {h:'/investor',           l:'Leadership'},
                ]
              },
            ].map(col => (
              <div key={col.title}>
                <div className={`text-[12px] tracking-[6px] font-display uppercase mb-12 flex items-center gap-5 font-black ${isDarkPage ? 'text-orange-dim' : 'text-navy'}`}>
                  <span className="w-10 h-px bg-orange shadow-[0_0_10px_rgba(248,147,31,0.3)]"/> {col.title}
                </div>
                <ul className="space-y-6">
                  {col.links.map(l => (
                    <li key={l.l}>
                      <Link href={l.h} className={`text-[14px] font-black transition-all duration-300 flex items-center gap-4 group uppercase tracking-widest leading-none ${isDarkPage ? 'text-void/40 hover:text-void' : 'text-ash hover:text-navy'}`}>
                        <span className="w-0 group-hover:w-6 h-px bg-orange transition-all duration-500"/>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">{l.l}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`border-t pt-12 flex flex-col md:flex-row justify-between items-center gap-10 md:gap-0 ${isDarkPage ? 'border-white/5 text-void/40' : 'border-navy/10 text-ash'}`}>
          <div className="text-center md:text-left">
            <span className={`text-[12px] tracking-[5px] font-display uppercase font-black block mb-4 ${isDarkPage ? 'text-void' : 'text-navy'}`}>© 2026 8-LINES AUTOMOTIVE GROUP</span>
            <div className="text-[10px] tracking-[3px] font-mono opacity-50 uppercase">CIN: U74999KA2023PTC17XXXX · GST: 29AAXCXXXXXK1ZV</div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center">
            <Link href="/legal" className={`text-[11px] tracking-[4px] font-display uppercase transition-colors font-black ${isDarkPage ? 'text-void/60 hover:text-orange' : 'hover:text-navy'}`}>Terminals</Link>
            <span className={`w-1.5 h-1.5 rounded-full ${isDarkPage ? 'bg-void/5' : 'bg-navy/5'}`} />
            <Link href="/legal?tab=privacy" className={`text-[11px] tracking-[4px] font-display uppercase transition-colors font-black ${isDarkPage ? 'text-void/60 hover:text-orange' : 'hover:text-navy'}`}>Encryption</Link>
            <span className={`w-1.5 h-1.5 rounded-full ${isDarkPage ? 'bg-void/5' : 'bg-navy/5'}`} />
            <Link href="/legal?tab=agreement" className={`text-[11px] tracking-[4px] font-display uppercase transition-colors font-black ${isDarkPage ? 'text-void/60 hover:text-orange' : 'hover:text-navy'}`}>Protocol</Link>
            <span className={`w-1.5 h-1.5 rounded-full hidden sm:block ${isDarkPage ? 'bg-void/5' : 'bg-navy/5'}`} />
            <Link href="/admin-login" className={`text-[10px] tracking-[6px] font-display uppercase transition-all mt-4 sm:mt-0 w-full sm:w-auto text-center border px-6 py-3 cut-md font-black ${isDarkPage ? 'text-void/40 hover:text-orange border-white/10 hover:border-orange/40' : 'text-navy/20 hover:text-orange border-navy/5 hover:border-orange/20'}`}>SYSTEM ROOT ACCESS</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
