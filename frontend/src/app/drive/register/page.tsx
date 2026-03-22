'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import Link from 'next/link'

const FLEET_PREVIEW = [
  { id:'v1', image:'/images/thar_roxx.png', name:'THAR ROXX', price:3499 },
  { id:'v2', image:'/images/xuv300.png', name:'XUV 300', price:2799 },
  { id:'v3', image:'/images/kia_carens.png', name:'KIA CARENS', price:2499 },
]

export default function DriveRegisterPage() {
  const router = useRouter()
  const { sendOTP, verifyOTP } = useAuthStore()
  const [step, setStep] = useState<'details'|'otp'>('details')
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(['','','','','',''])
  const [form, setForm] = useState({ name:'', phone:'', email:'' })
  const refs = useRef<(HTMLInputElement|null)[]>([])

  const handleSend = async () => {
    if (form.name.length < 2) { toast.error('Enter your full name'); return }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { toast.error('Valid 10-digit mobile required'); return }
    if (!/\S+@\S+\.\S+/.test(form.email)) { toast.error('Valid email required'); return }
    setLoading(true)
    try { await sendOTP(form.phone, form.name, form.email); setStep('otp'); toast.success('OTP sent to +91 ' + form.phone) }
    catch { toast.error('Failed. Try again.') }
    finally { setLoading(false) }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length !== 6) { toast.error('Enter 6-digit OTP'); return }
    setLoading(true)
    try { 
      await verifyOTP(form.phone, code); 
      localStorage.setItem('8l_user_type', 'renter')
      toast.success('Profile created! Welcome to 8-Lines.')
      router.push('/fleet')
    }
    catch { toast.error('Invalid OTP') }
    finally { setLoading(false) }
  }

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[i] = val; setOtp(next)
    if (val && i < 5) refs.current[i+1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i-1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (data.length === 6) {
      setOtp(data.split(''))
      refs.current[5]?.focus()
    }
  }

  return (
    <main className="min-h-screen bg-void flex items-center justify-center relative overflow-hidden flex-col lg:flex-row">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(248,147,31,.03),transparent)'}} />
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />

      {/* Fleet Preview Side (Desktop) */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-20 relative z-10 border-r border-navy/5">
        <div className="max-w-xl">
          <div className="text-[10px] tracking-[6px] text-orange uppercase mb-8 font-black flex items-center gap-4">
             <span className="w-12 h-px bg-orange shadow-[0_0_8px_rgba(248,147,31,0.5)]" /> SERIES BLR-01 // HUB STATUS
          </div>
          <h2 className="font-display text-7xl text-navy uppercase leading-[0.8] mb-12 font-black">CREATE YOUR<br/><span className="text-orange">PROFILE.</span></h2>
          <div className="grid grid-cols-1 gap-6">
            {FLEET_PREVIEW.map(car => (
              <div key={car.id} className="bg-white border border-navy/5 p-6 flex items-center gap-8 group hover:border-orange/30 transition-all shadow-lg hover:shadow-xl cut-md">
                <img src={car.image} alt={car.name} className="w-32 h-20 object-contain group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-display text-2xl text-navy uppercase font-black">{car.name}</div>
                  <div className="text-orange font-black text-[12px] tracking-[2px]">₹{car.price} / 24HR</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:max-w-[550px] relative z-10 px-6 py-20 animate-in fade-in zoom-in duration-700 flex flex-col items-center">
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-5xl md:text-6xl tracking-[10px] text-navy inline-block mb-2 hover:scale-105 transition-transform duration-500">
            <em className="text-orange not-italic">8</em>LINES
          </Link>
          <div className="text-[10px] tracking-[6px] text-orange uppercase font-black uppercase">Fleet Enrollment Protocol</div>
        </div>

        <div className="w-full max-w-[460px] bg-white border border-navy/5 overflow-hidden shadow-2xl cut-lg">
          <div className="bg-navy/[0.02] border-b border-navy/5 px-8 py-5 flex items-center justify-between">
            <span className="text-[10px] tracking-[4px] text-navy/60 uppercase font-black">{step==='details' ? 'Account Creation' : 'Verify Identity'}</span>
            <div className="flex gap-2"><div className="w-2.5 h-2.5 rounded-full bg-orange/60 glow-orange animate-pulse"/></div>
          </div>
          
          <div className="p-10">
            {step==='details' && (
              <div className="space-y-8">
                <div>
                  <label className="text-[9px] tracking-[4px] text-navy/30 uppercase block mb-3 font-bold ml-1">Full Name</label>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="As per driving license" 
                    className="w-full bg-navy/5 border border-navy/10 px-6 py-4 text-[13px] text-navy font-mono placeholder:text-navy/10 focus:border-orange/30 outline-none transition-all font-medium"/>
                </div>
                <div>
                  <label className="text-[9px] tracking-[4px] text-navy/30 uppercase block mb-3 font-bold ml-1">Mobile Number</label>
                  <div className="flex gap-4">
                    <span className="bg-navy/5 border border-navy/10 px-5 py-4 flex items-center text-[12px] text-navy font-black shrink-0">+91</span>
                    <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value.replace(/\D/g,'').slice(0,10)}))} placeholder="9XXXXXXXXX" 
                      className="flex-1 bg-navy/5 border border-navy/10 px-6 py-4 text-[14px] text-navy font-mono placeholder:text-navy/10 focus:border-orange/30 outline-none transition-all font-medium"/>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] tracking-[4px] text-navy/30 uppercase block mb-3 font-bold ml-1">Email Address</label>
                  <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com" type="email" 
                    className="w-full bg-navy/5 border border-navy/10 px-6 py-4 text-[13px] text-navy font-mono placeholder:text-navy/10 focus:border-orange/30 outline-none transition-all font-medium"/>
                </div>
                <button onClick={handleSend} disabled={loading} 
                  className="w-full bg-orange text-white text-[11px] tracking-[5px] uppercase py-5 font-black cut-lg hover:shadow-orange hover:bg-orange/90 transition-all disabled:opacity-50 mt-4">
                  {loading ? 'INITIATING...' : 'CONTINUE →'}
                </button>
              </div>
            )}
            {step==='otp' && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-display text-5xl text-navy mb-2 leading-[0.85] uppercase">VERIFY<br/><span className="text-orange">PROTOCOL.</span></h1>
                  <p className="text-[11px] text-navy/30 font-medium uppercase tracking-widest">// Sent to +91 {form.phone}</p>
                </div>

                <div className="flex justify-center gap-3">
                  {otp.map((v,i)=>(
                    <input key={i} ref={el=>{refs.current[i]=el}} value={v} onChange={e=>handleChange(i,e.target.value)}
                      onKeyDown={e=>handleKeyDown(i,e)} onPaste={handlePaste} maxLength={1}
                      className="w-12 h-16 bg-navy/5 border border-navy/10 text-center font-display text-3xl text-orange outline-none focus:border-orange/30 transition-all font-black"/>
                  ))}
                </div>
                
                <button onClick={handleVerify} disabled={loading||otp.join('').length!==6} 
                  className="w-full bg-orange text-white text-[11px] tracking-[5px] uppercase py-5 font-black cut-lg transition-all hover:bg-orange/90 hover:shadow-glow">
                  {loading ? 'VERIFYING...' : 'SECURE REGISTRY →'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-[10px] text-navy/30 font-black uppercase tracking-widest">
            Already Registered?{' '}
            <Link href="/drive/login" className="text-orange hover:underline underline-offset-4 font-bold">Authenticate →</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
