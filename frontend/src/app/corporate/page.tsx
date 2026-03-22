'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { publicAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { MechanixLogo } from '@/components/ui/Logos'

export default function CorporateLeasingPage() {
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', vehicles: '5+', notes: '' })
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.company || !form.phone || !form.email) {
      toast.error('Please fill required fields (Name, Company, Phone, Email)')
      return
    }
    setBusy(true)
    try {
      await publicAPI.submitLead({
        company_name: form.company,
        contact_name: form.name,
        email: form.email,
        phone: form.phone,
        vehicle_count: parseInt(form.vehicles.replace('+', '')),
        notes: form.notes
      })
      toast.success('✓ Enquiry received. Shaik Afnan (Head of Sales) will contact you shortly.')
      setForm({ name: '', company: '', phone: '', email: '', vehicles: '5+', notes: '' })
    } catch {
      toast.error('Failed to submit. Please try again or email us directly.')
    } finally {
      setBusy(false)
    }
  }

  const inp = "w-full bg-void border border-navy/10 hover:border-navy/30 focus:border-green px-4 py-3 text-[12px] text-navy font-mono outline-none transition-all placeholder:text-navy/20"

  return (
    <main className="bg-void min-h-screen">
      <Navbar />
      <div className="pt-[68px]">

        {/* ── HERO ─────────────────────────────────── */}
        <section className="py-24 md:py-36 px-6 md:px-20 relative overflow-hidden bg-void">
          <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 70% 60% at 80% 40%,rgba(34,197,94,0.03),transparent)'}} />
          <div className="absolute right-0 top-0 font-display text-[22vw] text-stroke opacity-[0.02] pointer-events-none leading-none select-none hidden lg:block">CORPORATE</div>
          <div className="reveal max-w-4xl relative z-10 text-center md:text-left">
            <div className="text-[10px] tracking-[5px] text-green uppercase mb-8 flex items-center justify-center md:justify-start gap-4 font-black"><span className="w-12 h-px bg-green" />Enterprise Infrastructure // HUB-01</div>
            <h1 className="font-display text-[clamp(48px,8vw,100px)] leading-[0.85] text-navy mb-10 uppercase animate-float">
              SCALE OPERATIONS <br className="hidden md:block" /><em className="text-green not-italic">WITHOUT CAPEX.</em>
            </h1>
            <p className="text-[14px] md:text-[16px] leading-[1.8] text-ash max-w-2xl mb-12 font-medium mx-auto md:mx-0">
              8-Lines provides asset-light corporate mobility. Instantly deploy premium SUVs and sedans for your executives and teams — fully maintained, insured, and tracked. Zero downpayment. Predictable monthly Opex.
            </p>
            <a href="#enquiry" className="inline-flex items-center justify-center gap-6 bg-green text-void text-[11px] tracking-[5px] uppercase px-14 py-6 cut-lg font-black hover:shadow-glow transition-all w-full md:w-auto">
              Request B2B Deployment →
            </a>
          </div>
        </section>

        {/* ── CORPORATE ADVANTAGES ───────────────── */}
        <section className="py-16 md:py-24 px-6 md:px-20 bg-abyss">
          <div className="reveal mb-12 md:mb-16 text-center md:text-left">
            <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center justify-center md:justify-start gap-3 font-bold"><span className="w-8 h-px bg-green" />Enterprise Arsenal</div>
            <h2 className="font-display text-[clamp(28px,4vw,56px)] leading-[0.92] text-navy uppercase">THE 8-LINES <em className="text-green not-italic">B2B ADVANTAGE.</em></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {icon:'📉', t:'Zero CapEx', d:'Pay purely for usage. No heavy downpayments or balance sheet asset depreciation.'},
              {icon:'🛠️', t:'100% Maintained', d:'Servicing, tires, and spares handled entirely by the 8-Lines MECHANIX PRO team.'},
              {icon:'🔄', t:'Instant Replacement', d:'Vehicle breakdown? We deploy a replacement SUV to your office within 4 hours.'},
              {icon:'📑', t:'Simplified Tax', d:'Consolidated monthly GST invoices for your entire fleet. Input tax credit friendly.'},
            ].map((a,i)=>(
               <div key={i} className={`reveal delay-${i+1} glass-card hover:bg-white transition-all p-10 relative overflow-hidden group hover:-translate-y-4 hover:shadow-premium cut-md`}>
                 <div className="w-14 h-14 bg-navy/5 border border-navy/10 flex items-center justify-center text-2xl mb-8 group-hover:border-green/30 transition-all glass-card">{a.icon}</div>
                 <div className="text-[15px] font-black text-navy mb-4 font-body uppercase tracking-[1px]">{a.t}</div>
                 <p className="text-[12px] leading-[1.8] text-ash font-medium">{a.d}</p>
                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-green scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
               </div>
            ))}
          </div>
        </section>

        {/* ── FLEET & MECHANIX ─────────────────────── */}
        <section className="py-16 md:py-20 px-6 md:px-20 bg-void">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="reveal-l space-y-8">
              <div>
                <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green" />Premium SUV Roster</div>
                <h2 className="font-display text-[clamp(28px,3vw,44px)] leading-[0.95] text-navy mb-5 uppercase">A FLEET DESIGNED FOR <em className="text-green not-italic">EXECUTIVES.</em></h2>
                <p className="text-[11px] text-ash leading-[1.8] mb-8 font-medium">Our standard B2B offering prioritizes safety, comfort, and corporate presence. All vehicles are late-model, zero-defect, and fully insured for corporate passenger transit.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] text-navy font-bold uppercase tracking-[1px]">
                  <div className="border border-navy/10 px-4 py-3 bg-navy/[.02]">✓ Mahindra Thar Roxx</div>
                  <div className="border border-navy/10 px-4 py-3 bg-navy/[.02]">✓ Mahindra XUV 300 / 700</div>
                  <div className="border border-navy/10 px-4 py-3 bg-navy/[.02]">✓ Kia Carens (6/7 Seater)</div>
                  <div className="border border-navy/10 px-4 py-3 bg-navy/[.02]">✓ Nissan Magnite CVT</div>
                </div>
              </div>
            </div>
            <div className="reveal-r glass-dark p-10 border border-white/10 relative overflow-hidden cut-lg shadow-2xl">
              <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
              <div className="mb-8"><MechanixLogo className="h-10 md:h-12 w-auto" /></div>
              <h3 className="font-display text-2xl md:text-3xl text-void tracking-[2px] mb-6 uppercase leading-tight">THE ONLY PLATFORM WITH A 22-POINT ZERO-DEFECT AUDIT.</h3>
              <p className="text-[12px] text-void/40 leading-[1.8] mb-8 font-medium italic">"You are not renting from an anonymous peer. Every 8-Lines vehicle undergoes a strict 22-point digital audit by a certified mechanic before it reaches your campus."</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-black text-void uppercase tracking-[2px]">
                <li className="flex items-center gap-3"><span className="text-green text-sm glow-green">✓</span> OBD SCANNER</li>
                <li className="flex items-center gap-3"><span className="text-green text-sm glow-green">✓</span> TIRE TREAD AUDIT</li>
                <li className="flex items-center gap-3"><span className="text-green text-sm glow-green">✓</span> BRAKE LIFE 3MM+</li>
                <li className="flex items-center gap-3"><span className="text-green text-sm glow-green">✓</span> INTERIOR STERILIZED</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── ENQUIRY FORM ─────────────────────────── */}
        <section id="enquiry" className="py-16 md:py-24 px-6 md:px-20 bg-abyss border-t border-navy/5">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="lg:w-1/3 reveal-l text-center lg:text-left">
              <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center justify-center lg:justify-start gap-3 font-bold"><span className="w-8 h-px bg-green" />B2B Deployment Desk</div>
              <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[0.92] text-navy mb-8 uppercase">INITIATE<br className="hidden lg:block" /><em className="text-green not-italic">CONTACT.</em></h2>
              <div className="bg-void border border-navy/10 p-6 mb-6 text-left">
                <div className="text-[10px] font-bold text-navy mb-1 uppercase tracking-wider">Shaik Afnan Sabil</div>
                <div className="text-[8px] tracking-[2px] text-ash uppercase mb-4 font-bold">Head of Sales & Leasing</div>
                <a href="mailto:afnan@8lines.group" className="block text-[11px] text-green hover:underline mb-1 font-bold">afnan@8lines.group</a>
                <div className="text-[11px] text-navy font-mono">+91 99000 00000</div>
              </div>
              <p className="text-[9px] text-ash font-bold uppercase tracking-wide">SLA: Expect a response and customized pricing sheet within 4 working hours.</p>
            </div>
            <div className="lg:w-2/3 reveal-r">
              <form onSubmit={submit} className="glass-card border border-navy/10 p-8 md:p-12 shadow-premium overflow-hidden cut-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-[9px] tracking-[3px] text-ash uppercase block mb-2 font-black">Authorized Contact *</label>
                    <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className={inp} placeholder="Full Name" />
                  </div>
                  <div>
                    <label className="text-[9px] tracking-[3px] text-ash uppercase block mb-2 font-black">Entity *</label>
                    <input value={form.company} onChange={e=>setForm({...form, company:e.target.value})} className={inp} placeholder="Organization LLC" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-[9px] tracking-[3px] text-ash uppercase block mb-2 font-black">Corporate Email *</label>
                    <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className={inp} placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="text-[9px] tracking-[3px] text-ash uppercase block mb-2 font-black">Protocol Mobile *</label>
                    <input type="tel" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className={inp} placeholder="+91 XXXXXXXXXX" />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="text-[9px] tracking-[3px] text-ash uppercase block mb-2 font-black">Monthly Deployment Volume *</label>
                  <select value={form.vehicles} onChange={e=>setForm({...form, vehicles:e.target.value})} className={inp + ' bg-void'}>
                    <option value="1-4">1-4 Vehicles</option>
                    <option value="5-9">5-9 Vehicles — Fleet Tier</option>
                    <option value="10-19">10-19 Vehicles — Hub Tier</option>
                    <option value="20+">20+ Vehicles — Master Tier</option>
                  </select>
                </div>
                <div className="mb-8">
                  <label className="text-[9px] tracking-[3px] text-ash uppercase block mb-2 font-black">Strategic Requirements (Optional)</label>
                  <textarea value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} className={inp + ' resize-none'} rows={4} placeholder="e.g., Executive employee transit, 6-seater requirement..." />
                </div>
                <button type="submit" disabled={busy} className="w-full bg-green text-void text-[11px] tracking-[5px] uppercase py-6 font-black transition-all cut-md hover:shadow-glow disabled:opacity-60">
                  {busy ? 'TRANSMITTING...' : 'INITIATE DEPLOYMENT →'}
                </button>
              </form>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
