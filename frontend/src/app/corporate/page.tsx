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
        <section className="py-20 px-20 relative overflow-hidden bg-void">
          <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 70% 60% at 80% 40%,rgba(18,51,43,.04),transparent)'}} />
          <div className="reveal max-w-4xl relative z-10">
            <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green" />B2B Fleet Infrastructure</div>
            <h1 className="font-display text-[clamp(44px,6vw,80px)] leading-[.9] text-navy mb-8">
              SCALE YOUR OPERATIONS <em className="text-green not-italic">WITHOUT CAPEX.</em>
            </h1>
            <p className="text-[13px] leading-[1.9] text-ash max-w-2xl mb-10 font-body">
              8-Lines provides asset-light corporate mobility. Instantly deploy premium SUVs and sedans for your executives and teams — fully maintained, insured, and tracked. Zero downpayment. Predictable monthly Opex.
            </p>
            <a href="#enquiry" className="inline-flex items-center gap-4 bg-green text-void text-[10px] tracking-[4px] uppercase px-8 py-5 cut-md font-bold hover:bg-green-dim hover:shadow-[0_0_40px_rgba(18,51,43,.4)] transition-all">
              Request B2B Deployment →
            </a>
          </div>
        </section>

        {/* ── CORPORATE ADVANTAGES ───────────────── */}
        <section className="py-20 px-20 bg-abyss">
          <div className="reveal mb-16">
            <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green" />Enterprise Arsenal</div>
            <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[.92] text-navy">THE 8-LINES <em className="text-green not-italic">B2B ADVANTAGE.</em></h2>
          </div>
          <div className="grid grid-cols-4 gap-px bg-navy/5 border border-navy/5">
            {[
              {icon:'📉', t:'Zero CapEx', d:'Pay purely for usage. No heavy downpayments or balance sheet asset depreciation.'},
              {icon:'🛠️', t:'100% Maintained', d:'Servicing, tires, and spares handled entirely by the 8-Lines MECHANIX PRO team.'},
              {icon:'🔄', t:'Instant Replacement', d:'Vehicle breakdown? We deploy a replacement SUV to your office within 4 hours.'},
              {icon:'📑', t:'Simplified Tax', d:'Consolidated monthly GST invoices for your entire fleet. Input tax credit friendly.'},
            ].map((a,i)=>(
               <div key={i} className={`reveal delay-${i+1} bg-void hover:bg-abyss transition-all p-10 relative overflow-hidden group border border-transparent hover:border-navy/5`}>
                 <div className="w-12 h-12 bg-navy/5 border border-navy/10 flex items-center justify-center text-xl mb-6 group-hover:border-green/30 transition-all">{a.icon}</div>
                 <div className="text-[14px] font-bold text-navy mb-3 font-body">{a.t}</div>
                 <p className="text-[11px] leading-[1.8] text-ash font-body">{a.d}</p>
                 <div className="absolute bottom-0 left-0 right-0 h-px bg-green scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
               </div>
            ))}
          </div>
        </section>

        {/* ── FLEET & MECHANIX ─────────────────────── */}
        <section className="py-20 px-20 bg-void">
          <div className="grid grid-cols-2 gap-20 items-center">
            <div className="reveal-l space-y-8">
              <div>
                <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green" />Premium SUV Roster</div>
                <h2 className="font-display text-[clamp(28px,3vw,44px)] leading-[.95] text-navy mb-4">A FLEET DESIGNED FOR <em className="text-green not-italic">EXECUTIVES.</em></h2>
                <p className="text-[11px] text-ash leading-[1.8] mb-6">Our standard B2B offering prioritizes safety, comfort, and corporate presence. All vehicles are late-model, zero-defect, and fully insured for corporate passenger transit.</p>
                <div className="grid grid-cols-2 gap-3 text-[10px] text-navy font-bold">
                  <div className="border border-navy/10 px-4 py-3 bg-navy/[.02]">✓ Mahindra Thar Roxx</div>
                  <div className="border border-navy/10 px-4 py-3 bg-navy/[.02]">✓ Mahindra XUV 300 / 700</div>
                  <div className="border border-navy/10 px-4 py-3 bg-navy/[.02]">✓ Kia Carens (6/7 Seater)</div>
                  <div className="border border-navy/10 px-4 py-3 bg-navy/[.02]">✓ Nissan Magnite CVT</div>
                </div>
              </div>
            </div>
            <div className="reveal-r bg-navy/5 p-10 border border-navy/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-green opacity-[0.03] blur-3xl pointer-events-none"/>
              <div className="mb-6"><MechanixLogo className="h-10 w-auto" /></div>
              <h3 className="font-display text-2xl text-navy tracking-[2px] mb-4">THE ONLY PLATFORM WITH A 22-POINT ZERO-DEFECT AUDIT.</h3>
              <p className="text-[11px] text-ash leading-[1.8] mb-6">You are not renting from an anonymous peer. Every 8-Lines vehicle undergoes a strict 22-point digital audit by a certified mechanic before it reaches your corporate campus.</p>
              <ul className="space-y-2 text-[10px] font-bold text-navy">
                <li className="flex items-center gap-2"><span className="text-green text-sm">✓</span> OBD Scanner Cleared</li>
                <li className="flex items-center gap-2"><span className="text-green text-sm">✓</span> Minimum 4/32" Tire Tread</li>
                <li className="flex items-center gap-2"><span className="text-green text-sm">✓</span> Brakes @ 3mm+ Minimum</li>
                <li className="flex items-center gap-2"><span className="text-green text-sm">✓</span> Valid Fleet First-Aid & Legal RC</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── ENQUIRY FORM ─────────────────────────── */}
        <section id="enquiry" className="py-20 px-20 bg-abyss border-t border-navy/5">
          <div className="max-w-4xl mx-auto flex gap-12">
            <div className="w-1/3 reveal-l">
              <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green" />B2B Deployment Desk</div>
              <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[.92] text-navy mb-6">INITIATE<br/><em className="text-green not-italic">CONTACT.</em></h2>
              <div className="bg-void border border-navy/10 p-6 mb-6">
                <div className="text-[10px] font-bold text-navy mb-1">Shaik Afnan Sabil</div>
                <div className="text-[8px] tracking-[2px] text-ash uppercase mb-4">Head of Sales & Leasing</div>
                <a href="mailto:afnan@8lines.group" className="block text-[11px] text-green hover:underline mb-1">afnan@8lines.group</a>
                <div className="text-[11px] text-navy font-mono">+91 99000 00000</div>
              </div>
              <p className="text-[9px] text-ash">SLA: Expect a response and customized pricing sheet within 4 working hours.</p>
            </div>
            <div className="w-2/3 reveal-r">
              <form onSubmit={submit} className="bg-void border border-navy/10 p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Your Name *</label>
                    <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className={inp} placeholder="Full Name" />
                  </div>
                  <div>
                    <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Company *</label>
                    <input value={form.company} onChange={e=>setForm({...form, company:e.target.value})} className={inp} placeholder="Organization LLC" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Work Email *</label>
                    <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className={inp} placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Phone Number *</label>
                    <input type="tel" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className={inp} placeholder="+91 XXXXXXXXXX" />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Monthly Vehicle Requirement *</label>
                  <select value={form.vehicles} onChange={e=>setForm({...form, vehicles:e.target.value})} className={inp + ' bg-void'}>
                    <option value="1-4">1-4 Vehicles</option>
                    <option value="5-9">5-9 Vehicles — Fleet Tier</option>
                    <option value="10-19">10-19 Vehicles — Hub Tier</option>
                    <option value="20+">20+ Vehicles — Master Tier</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Specific Requirements (Optional)</label>
                  <textarea value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} className={inp + ' resize-none'} rows={3} placeholder="Tell us about your use case (e.g., employee transit, CXO fleet...)" />
                </div>
                <button type="submit" disabled={busy} className="w-full bg-green text-void text-[10px] tracking-[4px] uppercase py-4 font-bold transition-all cut-md hover:bg-green-dim disabled:opacity-60">
                  {busy ? 'Transmitting...' : 'SUBMIT B2B ENQUIRY →'}
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
