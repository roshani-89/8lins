'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import Link from 'next/link'

const FLEET_PREVIEW = [
  { id:'v1', image:'/images/thar_roxx.png', name:'THAR ROXX', price:3499 },
  { id:'v2', image:'/images/xuv300.png', name:'XUV 300', price:2799 },
  { id:'v3', image:'/images/kia_carens.png', name:'KIA CARENS', price:2499 },
]

export default function DriveLoginPage() {
  const router = useRouter()
  const { sendOTP, verifyOTP, isLoading } = useAuthStore()
  const [phone, setPhone]     = useState('')
  const [sent, setSent]       = useState(false)
  const [otp, setOtp]         = useState(['','','','','',''])
  const [timer, setTimer]     = useState(30)
  const refs = useRef<(HTMLInputElement|null)[]>([])

  useEffect(() => {
    if (!sent) return
    const iv = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000)
    return () => clearInterval(iv)
  }, [sent])

  const handleSend = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) { toast.error('Enter valid 10-digit mobile'); return }
    try { await sendOTP(phone); setSent(true); setTimer(30); toast.success('OTP sent to +91 ' + phone) }
    catch { toast.error('Failed to send OTP') }
  }

  const handleChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return
    const n = [...otp]; n[i] = v; setOtp(n)
    if (v && i < 5) refs.current[i+1]?.focus()
  }

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i-1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (data.length === 6) {
      setOtp(data.split(''))
      refs.current[5]?.focus()
    }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) { toast.error('Enter complete 6-digit OTP'); return }
    try {
      await verifyOTP(phone, code)
      localStorage.setItem('8l_user_type', 'renter')
      toast.success('✓ Identity Secured. Accessing Terminal.')
      router.push('/fleet')
    } catch { toast.error('Invalid OTP. Try again.') }
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
          <h2 className="font-display text-7xl text-navy uppercase leading-[0.8] mb-12 font-black">SELECT YOUR<br/><span className="text-orange">MACHINE.</span></h2>
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

      {/* Login Side */}
      <div className="w-full lg:max-w-[550px] relative z-10 px-6 py-20 animate-in fade-in zoom-in duration-700 flex flex-col items-center">
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-5xl md:text-6xl tracking-[10px] text-navy inline-block mb-2 hover:scale-105 transition-transform duration-500">
            <em className="text-orange not-italic">8</em>LINES
          </Link>
          <div className="text-[10px] tracking-[6px] text-orange uppercase font-black">Rentals Portal // IDENTITY CHECK</div>
        </div>

        <div className="w-full max-w-[440px] bg-white border border-navy/5 overflow-hidden shadow-2xl cut-lg">
          <div className="bg-navy/[0.02] border-b border-navy/5 px-8 py-5 flex items-center justify-between">
            <span className="text-[10px] tracking-[4px] text-navy/60 uppercase font-black">Identity Verification</span>
            <div className="flex items-center gap-3 text-[9px] text-orange font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-orange rounded-full glow-orange animate-pulse shadow-glow" />
              <span className="uppercase tracking-widest">SECURED ACCESS</span>
            </div>
          </div>

          <div className="p-10">
            {!sent ? (
              <div className="space-y-8">
                <div>
                  <h1 className="font-display text-5xl text-navy mb-2 leading-[0.85] uppercase">ACCESS<br/><span className="text-orange">FLEET.</span></h1>
                  <p className="text-[11px] text-navy/30 font-medium uppercase tracking-widest">// Multi-factor identity check</p>
                </div>
                
                <div>
                  <label className="text-[9px] tracking-[4px] text-navy/40 uppercase block mb-3 font-black ml-1">Registered Mobile</label>
                  <div className="flex gap-4">
                    <div className="bg-navy/5 border border-navy/5 px-5 py-4 text-[12px] text-navy font-black shrink-0">+91</div>
                    <input value={phone} onChange={e=>setPhone(e.target.value)} maxLength={10} type="tel"
                      className="flex-1 bg-navy/5 border border-navy/5 px-6 py-4 text-[14px] text-navy font-mono placeholder:text-navy/10 focus:border-orange/30 outline-none transition-all font-bold"
                      placeholder="9XXXXXXXXX" onKeyDown={e=>e.key==='Enter'&&handleSend()} />
                  </div>
                </div>

                <button onClick={handleSend} disabled={isLoading}
                   className="w-full bg-orange text-white text-[11px] tracking-[5px] uppercase py-5 font-black cut-lg transition-all hover:shadow-glow hover:bg-orange/90 disabled:opacity-60 group">
                  <span className="group-hover:translate-x-1 inline-block transition-transform">
                    {isLoading ? 'INITIATING...' : 'SEND OTP →'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h1 className="font-display text-5xl text-navy mb-2 leading-[0.85] uppercase">VERIFY<br/><span className="text-orange">PROTOCOL.</span></h1>
                  <p className="text-[11px] text-navy/30 font-medium uppercase tracking-widest">// Sent to +91 {phone}</p>
                </div>

                <div className="flex justify-center gap-3">
                  {otp.map((d,i) => (
                    <input key={i} ref={el=>{refs.current[i]=el}} value={d} onChange={e=>handleChange(i,e.target.value)}
                      onKeyDown={e=>handleKey(i,e)} onPaste={handlePaste}
                      maxLength={1} type="tel"
                      className="w-12 h-16 bg-navy/5 border border-navy/5 text-center font-display text-3xl text-orange outline-none focus:border-orange/30 transition-all font-black" />
                  ))}
                </div>

                <button onClick={handleVerify} disabled={isLoading||otp.join('').length<6}
                  className="w-full bg-orange text-white text-[11px] tracking-[5px] uppercase py-5 font-black cut-lg transition-all hover:shadow-glow hover:bg-orange/90 disabled:opacity-50">
                  {isLoading ? 'VERIFYING...' : 'SECURE ACCESS →'}
                </button>

                <div className="text-center">
                  {timer > 0 ? (
                    <span className="text-[10px] text-navy/40 font-black uppercase tracking-widest">Resend Window: {timer}s</span>
                  ) : (
                    <button onClick={handleSend} className="text-[10px] text-orange font-black uppercase tracking-widest hover:underline underline-offset-4">Resend Security Code</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-[10px] text-navy/40 font-black uppercase tracking-widest">
            New Entity?{' '}
            <Link href="/drive/register" className="text-orange hover:underline underline-offset-4 font-bold">Create Profile →</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
