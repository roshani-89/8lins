'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { publicAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

declare global { interface Window { Razorpay: any } }

export default function OnboardFunnelPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [onboardingId, setOnboardingId] = useState<string|null>(null)
  
  const [form, setForm] = useState({
    full_name: '', phone: '', email: '',
    vehicle_make: '', vehicle_model: '', vehicle_year: new Date().getFullYear(),
    reg_number: '', asset_value: 1500000, agreement_accepted: false
  })

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  const next = () => setStep(s => s + 1)
  const prev = () => setStep(s => s - 1)

  const handleDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.agreement_accepted) { toast.error('Please accept the Master Agreement to proceed.'); return }
    setLoading(true)
    try {
      const res = await publicAPI.submitOnboarding(form)
      setOnboardingId(res.data.id)
      toast.success('Protocol Initiated. Details Logged.')
      next()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Onboarding failed to initialize.')
    } finally {
      setLoading(false)
    }
  }

  const [kyc, setKyc] = useState<{pan: File|null, aadhaar: File|null}>({ pan: null, aadhaar: null })
  
  const handleKYC = async () => {
    if (!kyc.pan || !kyc.aadhaar) { toast.error('Both PAN and Aadhaar are required.'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('pan', kyc.pan)
      fd.append('aadhaar', kyc.aadhaar)
      await publicAPI.uploadOnboardingKYC(onboardingId!, fd)
      toast.success('Identity Documents Verified.')
      next()
    } catch {
      toast.error('KYC Upload failed.')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      const { data: order } = await publicAPI.createOrder(onboardingId!)
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_placeholder',
        amount: order.amount,
        currency: order.currency,
        name: '8-Lines Group',
        description: 'Asset Activation Protocol Fee',
        order_id: order.order_id,
        handler: async (res: any) => {
          try {
            await publicAPI.verifyPayment({
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature
            })
            toast.success('Protocol Activated! Redirecting to Dashboard.')
            router.push('/investor/login')
          } catch {
            toast.error('Payment verification failed.')
          }
        },
        prefill: { name: form.full_name, email: form.email, contact: form.phone },
        theme: { color: '#F8931F' }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: any) {
      toast.error('Failed to create payment order.')
    } finally {
      setLoading(false)
    }
  }

  const inp = "w-full bg-navy/5 border border-navy/10 px-6 py-4 text-[14px] text-navy font-bold placeholder:text-navy/20 outline-none focus:border-green/30 transition-all font-mono"
  const lbl = "text-[9px] tracking-[4px] text-navy/40 uppercase block mb-3 font-black ml-1"

  return (
    <main className="bg-void min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Progress Header */}
          <div className="mb-16">
             <div className="flex justify-between items-end mb-6">
                <div>
                   <div className="text-[10px] tracking-[6px] text-green uppercase font-black mb-2">Phase 0{step} // Deployment Hub</div>
                   <h1 className="font-display text-4xl md:text-5xl text-navy uppercase font-black">
                     {step === 1 && 'Asset Registry'}
                     {step === 2 && 'KYC Vault'}
                     {step === 3 && 'Activation Protocol'}
                   </h1>
                </div>
                <div className="text-right">
                   <div className="text-[10px] tracking-[4px] text-navy/30 uppercase font-black mb-1">Step {step} of 3</div>
                   <div className="w-48 h-1.5 bg-navy/5 overflow-hidden">
                      <div className="h-full bg-green transition-all duration-1000 shadow-glow" style={{width: `${(step/3)*100}%`}} />
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white border border-navy/10 p-8 md:p-12 shadow-2xl cut-lg relative overflow-hidden group">
            <div className="absolute inset-0 carbon-fiber opacity-[0.05] pointer-events-none" />
            
            {/* Step 1: Asset Details */}
            {step === 1 && (
              <form onSubmit={handleDetails} className="relative z-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div className="text-[11px] tracking-[4px] text-navy uppercase font-black border-l-4 border-green pl-4 mb-8">Personal Information</div>
                      <div>
                        <label className={lbl}>Full Legal Name</label>
                        <input required value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} placeholder="As per PAN Card" className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>Protocol Mobile</label>
                        <input required value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="+91 XXXXX XXXXX" className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>Email Identifier</label>
                        <input required type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="you@example.com" className={inp} />
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="text-[11px] tracking-[4px] text-navy uppercase font-black border-l-4 border-orange pl-4 mb-8">Asset Specifications</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={lbl}>Vehicle Make</label>
                          <input required value={form.vehicle_make} onChange={e=>setForm({...form, vehicle_make:e.target.value})} placeholder="Toyota" className={inp} />
                        </div>
                        <div>
                          <label className={lbl}>Model</label>
                          <input required value={form.vehicle_model} onChange={e=>setForm({...form, vehicle_model:e.target.value})} placeholder="Fortuner" className={inp} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={lbl}>Year</label>
                          <input required type="number" value={form.vehicle_year} onChange={e=>setForm({...form, vehicle_year:+e.target.value})} className={inp} />
                        </div>
                        <div>
                          <label className={lbl}>Asset Valuation</label>
                          <input required type="number" value={form.asset_value} onChange={e=>setForm({...form, asset_value:+e.target.value})} className={inp} />
                        </div>
                      </div>
                      <div>
                        <label className={lbl}>Registration Number</label>
                        <input required value={form.reg_number} onChange={e=>setForm({...form, reg_number:e.target.value.toUpperCase()})} placeholder="KA 03 XX 0000" className={inp + " uppercase"} />
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-void border border-navy/5 space-y-4">
                   <div className="flex items-start gap-4">
                      <input required type="checkbox" checked={form.agreement_accepted} onChange={e=>setForm({...form, agreement_accepted:e.target.checked})} className="mt-1 h-5 w-5 accent-green" />
                      <div className="text-[11px] text-navy/40 font-black uppercase leading-relaxed tracking-wider">
                         I hereby accept the <Link href="/legal?tab=agreement" target="_blank" className="text-green hover:underline underline-offset-4">Master Asset Management Agreement v3.2</Link>. I understand this is a digitally binding execution under the IT Act 2000.
                      </div>
                   </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-green text-white py-6 font-display text-2xl tracking-[6px] uppercase cut-lg hover:shadow-glow hover:bg-green/90 transition-all font-black">
                   {loading ? 'TRANSMITTING...' : 'REGISTER ASSET →'}
                </button>
              </form>
            )}

            {/* Step 2: KYC Vault */}
            {step === 2 && (
              <div className="relative z-10 space-y-12">
                <div className="text-center max-w-xl mx-auto">
                   <h2 className="font-display text-3xl text-navy uppercase font-black mb-4">IDENTITY VAULT</h2>
                   <p className="text-[12px] text-navy/40 uppercase font-black tracking-widest leading-relaxed">Identity verification is mandatory for secure payout routing. Upload clear images of your PAN and Aadhaar card.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-navy/[0.02] border border-dashed border-navy/20 p-10 text-center hover:bg-navy/[0.03] transition-colors relative group">
                      <input type="file" accept="image/*,.pdf" onChange={e=>setKyc({...kyc, pan:e.target.files?.[0]||null})} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{kyc.pan ? '✅' : '🆔'}</div>
                      <div className="text-[10px] tracking-[4px] font-black uppercase text-navy">PAN CARD</div>
                      <div className="text-[9px] text-navy/20 mt-2 truncate">{kyc.pan ? kyc.pan.name : 'CLICK TO UPLOAD'}</div>
                   </div>
                   <div className="bg-navy/[0.02] border border-dashed border-navy/20 p-10 text-center hover:bg-navy/[0.03] transition-colors relative group">
                      <input type="file" accept="image/*,.pdf" onChange={e=>setKyc({...kyc, aadhaar:e.target.files?.[0]||null})} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{kyc.aadhaar ? '✅' : '💳'}</div>
                      <div className="text-[10px] tracking-[4px] font-black uppercase text-navy">AADHAAR CARD</div>
                      <div className="text-[9px] text-navy/20 mt-2 truncate">{kyc.aadhaar ? kyc.aadhaar.name : 'CLICK TO UPLOAD'}</div>
                   </div>
                </div>

                <button onClick={handleKYC} disabled={loading} className="w-full bg-green text-white py-6 font-display text-2xl tracking-[6px] uppercase cut-lg hover:shadow-glow hover:bg-green/90 transition-all font-black">
                   {loading ? 'UPLOADING...' : 'SECURE VAULT →'}
                </button>
              </div>
            )}

            {/* Step 3: Activation */}
            {step === 3 && (
              <div className="relative z-10 space-y-12">
                <div className="text-center max-w-xl mx-auto">
                   <div className="w-20 h-20 bg-green/10 text-green rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-glow-sm">✓</div>
                   <h2 className="font-display text-3xl text-navy uppercase font-black mb-4">PROTOCOL READY</h2>
                   <p className="text-[12px] text-navy/40 uppercase font-black tracking-widest leading-relaxed">To initialize your asset node and complete the deployment, a one-time activation fee of ₹5,000 is required.</p>
                </div>

                <div className="bg-void border border-navy/5 p-10 flex flex-col items-center justify-center">
                   <div className="text-[10px] tracking-[6px] text-navy/30 uppercase font-black mb-4">Activation Fee</div>
                   <div className="font-display text-7xl text-navy font-black">₹5,000</div>
                   <div className="text-[9px] text-green font-black uppercase tracking-[4px] mt-4 border border-green/20 px-4 py-2 bg-green/5">Inclusive of GST</div>
                </div>

                <button onClick={handlePayment} disabled={loading} className="w-full bg-orange text-white py-6 font-display text-2xl tracking-[6px] uppercase cut-lg hover:shadow-glow-orange hover:bg-orange/90 transition-all font-black">
                   {loading ? 'INITIALIZING RAZORPAY...' : 'PAY & ACTIVATE NODE →'}
                </button>

                <p className="text-center text-[9px] text-navy/20 uppercase font-bold tracking-[2px]">
                   Secure Checkout via Razorpay // SSL Encrypted
                </p>
              </div>
            )}

          </div>

          {/* Guidelines Sidebar */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
             <div className="reveal">
                <div className="text-[10px] tracking-[4px] text-orange font-black uppercase mb-4 flex items-center gap-3 justify-center md:justify-start">
                   <span className="w-6 h-px bg-orange/40" /> Security Log
                </div>
                <p className="text-[11px] text-ash/60 leading-relaxed font-medium">Agreement fingerprint: {new Date().toISOString().split('T')[0]}-B1</p>
             </div>
             <div className="reveal delay-1">
                <div className="text-[10px] tracking-[4px] text-orange font-black uppercase mb-4 flex items-center gap-3 justify-center md:justify-start">
                   <span className="w-6 h-px bg-orange/40" /> Support Desk
                </div>
                <p className="text-[11px] text-ash/60 leading-relaxed font-medium">Assistance required? ops@8lines.group</p>
             </div>
             <div className="reveal delay-2">
                <div className="text-[10px] tracking-[4px] text-orange font-black uppercase mb-4 flex items-center gap-3 justify-center md:justify-start">
                   <span className="w-6 h-px bg-orange/40" /> SLA Tracker
                </div>
                <p className="text-[11px] text-ash/60 leading-relaxed font-medium">Node typically activated within 12 working hours post-payment.</p>
             </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
