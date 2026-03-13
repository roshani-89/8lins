import Link from 'next/link'
import { MainLogo } from '@/components/ui/Logos'

export default function Footer() {
  return (
    <footer className="bg-void border-t border-navy/5 px-20 py-16">
      <div className="grid grid-cols-4 gap-12 mb-12">
        <div>
          <MainLogo className="h-12 w-auto text-navy mb-6" />
          <p className="text-[11px] leading-[1.9] text-fog max-w-[240px] mb-5">Bengaluru's premier asset-management corporate mobility platform. 70% to investors, zero opacity.</p>
          <div className="space-y-2">
            <div className="text-[9px] text-fog">📍 <span className="text-ash">Mangammanapalya, Bengaluru 560068</span></div>
            <div className="text-[9px] text-fog">✉️ <span className="text-ash">ops@8linesgroup.com</span></div>
            <div className="text-[9px] text-fog">📞 <span className="text-ash">Shaik Afnan Sabil — Head of Sales</span></div>
          </div>
          {/* Status */}
          <div className="mt-5 flex items-center gap-2 text-[8px] text-green border border-green/15 px-3 py-2 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-green" style={{animation:'blink 2s infinite'}}/>
            System Operational
          </div>
        </div>
        {[
          {
            title:'Platform',
            links:[
              {h:'/fleet',    l:'Book a Drive'},
              {h:'/investor', l:'Deploy Your Asset'},
              {h:'/login',    l:'Investor Login'},
              {h:'/about#contact', l:'Corporate Leasing'},
            ]
          },
          {
            title:'Legal',
            links:[
              {h:'/legal',           l:'Terms of Service'},
              {h:'/legal?tab=privacy', l:'Privacy Policy'},
              {h:'/legal?tab=agreement', l:'Master Agreement'},
              {h:'/legal',           l:'Compliance Docs'},
            ]
          },
          {
            title:'Company',
            links:[
              {h:'/about',            l:'About 8-Lines'},
              {h:'/about#hub',        l:'Hub Operations'},
              {h:'/about#mechanix',   l:'Mechanix Pro'},
              {h:'/about#team',       l:'Executive Board'},
            ]
          },
        ].map(col => (
          <div key={col.title}>
            <div className="text-[8px] tracking-[4px] text-green uppercase mb-5 font-bold">{col.title}</div>
            <ul className="space-y-3">
              {col.links.map(l => (
                <li key={l.l}>
                  <Link href={l.h} className="text-[11px] text-ash hover:text-green transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-3 h-px bg-green transition-all duration-300"/>
                    {l.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy/5 pt-6 flex justify-between items-center text-fog">
        <div>
          <span className="text-[8px] tracking-[2px]">© 2026 8-LINES GROUP · BENGALURU, INDIA</span>
          <div className="text-[8px] mt-1 opacity-50">CIN: U7xxxx2023PTC1xxxxx · GST: 29XXXXXXXX</div>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/legal"               className="text-[8px] tracking-[2px] text-fog hover:text-green transition-colors">Terms</Link>
          <Link href="/legal?tab=privacy"   className="text-[8px] tracking-[2px] text-fog hover:text-green transition-colors">Privacy</Link>
          <Link href="/legal?tab=agreement" className="text-[8px] tracking-[2px] text-fog hover:text-green transition-colors">Agreement</Link>
          <Link href="/admin-login"         className="text-[7px] tracking-[2px] text-fog/30 hover:text-orange/60 transition-colors uppercase font-bold">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
