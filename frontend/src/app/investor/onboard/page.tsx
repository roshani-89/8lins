'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { publicAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

declare global { interface Window { Razorpay: any } }

function SignaturePad({ onSign }: { onSign: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)

  const startDrawing = (e: any) => {
    isDrawing.current = true
    draw(e)
  }
  const stopDrawing = () => {
    isDrawing.current = false
    if (canvasRef.current) onSign(canvasRef.current.toDataURL())
  }
  const draw = (e: any) => {
    if (!isDrawing.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#0C1D36'
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }
  const clear = () => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    ctx?.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
         <label className="text-[9px] tracking-[4px] text-navy/40 uppercase font-black ml-1">Digital Execution Signature</label>
         <button type="button" onClick={clear} className="text-[9px] text-orange font-black uppercase tracking-widest hover:underline">Clear</button>
      </div>
      <div className="bg-navy/[0.03] border border-navy/10 rounded-sm overflow-hidden relative group">
        <canvas ref={canvasRef} width={600} height={150} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} className="w-full h-[150px] cursor-crosshair" />
        <div className="absolute bottom-4 right-4 text-[8px] text-navy/20 font-black tracking-[4px] pointer-events-none uppercase">Sign inside the box</div>
      </div>
    </div>
  )
}

export default function OnboardFunnelPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [onboardingId, setOnboardingId] = useState<string|null>(null)
  const [signature, setSignature] = useState<string|null>(null)
  
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

  useEffect(() => {
    const s = localStorage.getItem('8l_onboard_step')
    const id = localStorage.getItem('8l_onboard_id')
    if (s) setStep(parseInt(s))
    if (id) setOnboardingId(id)
  }, [])

  useEffect(() => {
    localStorage.setItem('8l_onboard_step', step.toString())
    if (onboardingId) localStorage.setItem('8l_onboard_id', onboardingId)
  }, [step, onboardingId])

  const next = () => setStep(s => s + 1)
  const prev = () => setStep(s => s - 1)

  const handleDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.agreement_accepted) { toast.error('Please accept the Master Agreement to proceed.'); return }
    if (!signature) { toast.error('Digital Signature is mandatory for legal execution.'); return }
    setLoading(true)
    try {
      const res = await publicAPI.submitOnboarding({ ...form, signature })
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

  const inp = "w-full bg-navy/5 border border-navy/10 px-6 py-4 text-[14px] text-navy font-bold placeholder:text-navy/20 outline-none focus:border-green/30 transition-all font-mono hover:bg-navy/[0.07]"
  const lbl = "text-[9px] tracking-[4px] text-navy/40 uppercase block mb-3 font-black ml-1"

  return (
    <main className="bg-void min-h-screen">
      <Navbar />
      
      <section className="relative min-h-[80vh] flex items-center bg-void overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-32 w-full relative z-10">
          <div className="max-w-4xl mx-auto border border-navy/5 bg-white p-8 md:p-16 cut-lg shadow-2xl relative">
            
            {/* Progress Header */}
            <div className="mb-16">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                  <div>
                     <div className="text-[10px] tracking-[8px] text-green uppercase font-black mb-3 flex items-center gap-3">
                        <span className="w-8 h-px bg-green/40" /> Step 0{step} // Deployment Hub
                     </div>
                     <h1 className="font-display text-5xl md:text-6xl text-navy uppercase font-black tracking-tighter">
                       {step === 1 && 'ASSET REGISTRY'}
                       {step === 2 && 'IDENTITY VAULT'}
                       {step === 3 && 'ACTIVATION PROTOCOL'}
                     </h1>
                  </div>
                  <div className="w-64">
                     <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] tracking-[4px] text-navy/30 uppercase font-black">Step {step} of 3</span>
                        <span className="text-[10px] text-green font-black">{Math.round((step/3)*100)}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-navy/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(step/3)*100}%` }} transition={{ duration: 1, ease: "circOut" }} className="h-full bg-green shadow-glow" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
              {/* Step 1: Asset Details */}
              {step === 1 && (
                <motion.form key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}
                  onSubmit={handleDetails} className="relative z-10 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-8">
                        <div className="text-[12px] tracking-[6px] text-navy uppercase font-black border-l-4 border-green pl-6 mb-10 flex items-center gap-4">
                           Personal Identifier <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                        </div>
                        <div className="space-y-6">
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
                     </div>
                     <div className="space-y-8">
                        <div className="text-[12px] tracking-[6px] text-navy uppercase font-black border-l-4 border-orange pl-6 mb-10 flex items-center gap-4">
                           Asset Specifications <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className={lbl}>Vehicle Make</label>
                            <input required value={form.vehicle_make} onChange={e=>setForm({...form, vehicle_make:e.target.value})} placeholder="Toyota" className={inp} />
                          </div>
                          <div>
                            <label className={lbl}>Model</label>
                            <input required value={form.vehicle_model} onChange={e=>setForm({...form, vehicle_model:e.target.value})} placeholder="Fortuner" className={inp} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
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

                  <div className="space-y-8">
                    <div className="p-8 bg-void border border-navy/5 space-y-6 relative overflow-hidden group/agreement">
                       <div className="absolute inset-0 bg-green/[0.02] opacity-0 group-hover/agreement:opacity-100 transition-opacity" />
                       <div className="flex items-start gap-5 relative z-10">
                          <input required type="checkbox" checked={form.agreement_accepted} onChange={e=>setForm({...form, agreement_accepted:e.target.checked})} className="mt-1.5 h-6 w-6 accent-green shrink-0 bg-navy/5 border-navy/10 rounded-sm" />
                          <div className="text-[12px] text-navy/50 font-black uppercase leading-relaxed tracking-wider">
                             I hereby execute the <Link href="/legal?tab=agreement" target="_blank" className="text-green hover:underline underline-offset-4">Master Asset Management Agreement v3.2</Link>. I understand this is a digitally binding transaction under the IT Act 2000.
                          </div>
                       </div>
                    </div>

                    <SignaturePad onSign={setSignature} />
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-green text-white py-8 font-display text-2xl tracking-[10px] uppercase cut-lg hover:shadow-glow hover:bg-navy hover:text-white transition-all font-black group relative overflow-hidden">
                     <span className="relative z-10">{loading ? 'TRANSMITTING PROTOCOL...' : 'REGISTER ASSET →'}</span>
                     <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                  </button>
                </motion.form>
              )}

              {/* Step 2: KYC Vault */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}
                  className="relative z-10 space-y-16">
                  <div className="text-center max-w-xl mx-auto">
                     <div className="text-[10px] tracking-[10px] text-green uppercase font-black mb-6 flex items-center justify-center gap-4">
                        <span className="w-8 h-px bg-green/20" /> Identity verification Protocol <span className="w-8 h-px bg-green/20" />
                     </div>
                     <h2 className="font-display text-4xl text-navy uppercase font-black tracking-tighter mb-6 underline underline-offset-8 decoration-green/30">IDENTITY VAULT</h2>
                     <p className="text-[13px] text-navy/40 uppercase font-black tracking-widest leading-loose">Secure payout infrastructure requires mandatory ID verification. Transmit high-fidelity captures of your PAN and Aadhaar documents.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="bg-navy/[0.02] border-2 border-dashed border-navy/10 p-12 text-center hover:bg-navy/[0.05] hover:border-green/40 transition-all relative group cut-md shadow-inner">
                        <input type="file" accept="image/*,.pdf" onChange={e=>setKyc({...kyc, pan:e.target.files?.[0]||null})} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        <div className="relative z-10">
                          <div className={`text-5xl mb-6 transition-transform duration-500 ${kyc.pan ? 'scale-110' : 'group-hover:scale-110 opacity-40'}`}>{kyc.pan ? '✅' : '🆔'}</div>
                          <div className="text-[11px] tracking-[6px] font-black uppercase text-navy mb-3">PAN REGISTRY</div>
                          <div className="text-[9px] text-navy/20 font-black uppercase tracking-widest truncate max-w-[200px] mx-auto">{kyc.pan ? kyc.pan.name : 'Click to Upload Capture'}</div>
                        </div>
                     </div>
                     <div className="bg-navy/[0.02] border-2 border-dashed border-navy/10 p-12 text-center hover:bg-navy/[0.05] hover:border-green/40 transition-all relative group cut-md shadow-inner">
                        <input type="file" accept="image/*,.pdf" onChange={e=>setKyc({...kyc, aadhaar:e.target.files?.[0]||null})} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        <div className="relative z-10">
                          <div className={`text-5xl mb-6 transition-transform duration-500 ${kyc.aadhaar ? 'scale-110' : 'group-hover:scale-110 opacity-40'}`}>{kyc.aadhaar ? '✅' : '💳'}</div>
                          <div className="text-[11px] tracking-[6px] font-black uppercase text-navy mb-3">AADHAAR SECURE</div>
                          <div className="text-[9px] text-navy/20 font-black uppercase tracking-widest truncate max-w-[200px] mx-auto">{kyc.aadhaar ? kyc.aadhaar.name : 'Click to Upload Capture'}</div>
                        </div>
                        {kyc.aadhaar && (
                          <div className="absolute top-4 right-6 text-[8px] text-green font-black uppercase">Buffered for S3</div>
                        )}
                     </div>
                  </div>

                  <button onClick={handleKYC} disabled={loading} className="w-full bg-green text-white py-8 font-display text-2xl tracking-[10px] uppercase cut-lg hover:shadow-glow hover:bg-navy hover:text-white transition-all font-black relative overflow-hidden group">
                     <span className="relative z-10">{loading ? 'ENCRYPTING VAULT...' : 'SYNCHRONIZE VAULT →'}</span>
                     <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                  </button>
                </motion.div>
              )}

              {/* Step 3: Activation */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6 }}
                  className="relative z-10 space-y-16">
                  <div className="text-center max-w-xl mx-auto">
                     <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 10, delay: 0.2 }} className="w-24 h-24 bg-green/10 text-green rounded-full flex items-center justify-center text-5xl mx-auto mb-10 shadow-glow border border-green/20">✓</motion.div>
                     <div className="text-[10px] tracking-[10px] text-green uppercase font-black mb-6">Execution Protocol Finalised</div>
                     <h2 className="font-display text-4xl text-navy uppercase font-black tracking-tighter mb-6 underline underline-offset-8 decoration-green/30">PROTOCOL READY</h2>
                     <p className="text-[13px] text-navy/40 uppercase font-black tracking-widest leading-loose">To formalise your asset node and activate the real-time deployment ledger, a one-time activation fee is required.</p>
                  </div>

                  <div className="bg-void border border-navy/5 p-12 flex flex-col items-center justify-center relative overflow-hidden cut-md shadow-inner">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-green/5 blur-2xl rounded-full" />
                     <div className="text-[11px] tracking-[8px] text-navy/30 uppercase font-black mb-6 flex items-center gap-4">
                        <span className="w-6 h-px bg-navy/10" /> Activation Fee <span className="w-6 h-px bg-navy/10" />
                     </div>
                     <div className="font-display text-8xl text-navy font-black tracking-tighter mb-4 shadow-sm">₹5,000</div>
                     <div className="text-[10px] text-green font-black uppercase tracking-[6px] mt-4 border border-green/20 px-6 py-2.5 bg-green/5 shadow-glow-sm">INCLUSIVE OF GST</div>
                  </div>

                  <div className="space-y-6">
                    <button onClick={handlePayment} disabled={loading} className="w-full bg-orange text-white py-8 font-display text-2xl tracking-[10px] uppercase cut-lg hover:shadow-glow-orange hover:bg-navy hover:text-white transition-all font-black relative overflow-hidden group">
                       <span className="relative z-10">{loading ? 'INITIALISING GATEWAY...' : 'ACTIVATE ASSET NODE →'}</span>
                       <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                    </button>

                    <div className="flex items-center justify-center gap-6 opacity-30">
                       <div className="text-[9px] text-navy font-black uppercase tracking-[3px]">SSL Secured</div>
                       <div className="w-1 h-1 bg-navy rounded-full" />
                       <div className="text-[9px] text-navy font-black uppercase tracking-[3px]">Razorpay Protocol</div>
                       <div className="w-1 h-1 bg-navy rounded-full" />
                       <div className="text-[9px] text-navy font-black uppercase tracking-[3px]">AES-256 Entry</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
      </section>

      <Footer />
    </main>
  )
}
