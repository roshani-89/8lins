'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function InvestorLoginPage() {
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

  const handleSend = async (viaWhatsapp = false) => {
    if (!/^[6-9]\d{9}$/.test(phone)) { toast.error('Enter valid 10-digit mobile'); return }
    try { 
      await sendOTP(phone, undefined, undefined, viaWhatsapp)
      setSent(true)
      setTimer(30)
      toast.success(`OTP sent to +91 ${phone} via ${viaWhatsapp ? 'WhatsApp' : 'SMS'}`) 
    }
    catch { toast.error('Failed to send OTP') }
  }

  const handleChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return
    const n = [...otp]; n[i] = v; setOtp(n)
    if (v && i < 5) refs.current[i+1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i-1]?.focus()
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) { toast.error('Enter complete 6-digit OTP'); return }
    try {
      await verifyOTP(phone, code)
      localStorage.setItem('8l_user_type', 'investor')
      toast.success('✓ Welcome Back, Investor')
      router.push('/dashboard')
    } catch { toast.error('Invalid OTP. Try again.') }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (data.length === 6) {
      setOtp(data.split(''))
      refs.current[5]?.focus()
    }
  }

  return (
    <main className="min-h-screen bg-void flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(18,51,43,0.03),transparent)'}} />
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      
      <div className="w-full max-w-[440px] relative z-10 px-6 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <Link href="/" className="font-sans text-4xl md:text-5xl font-bold tracking-tight text-navy inline-block mb-4 hover:scale-105 transition-transform duration-500">
            <em className="text-green not-italic">8</em>LINES
          </Link>
          <div className="text-xs font-semibold text-green tracking-wide uppercase">INVESTOR PORTAL // SECURE ACCESS</div>
        </div>

        <div className="bg-white border border-navy/5 overflow-hidden shadow-2xl cut-lg">
          <div className="bg-navy/[0.02] border-b border-navy/5 px-8 py-5 flex items-center justify-between">
            <span className="text-xs font-semibold text-ash tracking-wide uppercase">Identity Verification</span>
            <div className="flex items-center gap-3 text-[10px] text-green font-bold">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse shadow-glow-green" />
              <span className="uppercase tracking-widest">OTP SECURED</span>
            </div>
          </div>

          <div className="p-10">
            {!sent ? (
              <div className="space-y-8">
                <div>
                  <h1 className="font-sans text-3xl md:text-4xl text-navy font-bold tracking-tight mb-4 uppercase">INVESTOR <span className="text-green">LOGIN.</span></h1>
                  <p className="text-xs text-navy/40 font-bold uppercase tracking-widest">// Multi-factor identity check</p>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-ash tracking-wider uppercase block mb-3 ml-1">Registered Mobile</label>
                  <div className="flex gap-4">
                    <div className="bg-navy/5 border border-navy/10 px-5 py-4 text-xs text-navy font-bold shrink-0">+91</div>
                    <input value={phone} onChange={e=>setPhone(e.target.value)} maxLength={10} type="tel"
                      className="flex-1 bg-navy/5 border border-navy/10 px-6 py-4 text-sm text-navy font-mono placeholder:text-navy/20 focus:border-green/20 outline-none transition-all"
                      placeholder="9XXXXXXXXX" onKeyDown={e=>e.key==='Enter'&&handleSend()} />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button onClick={() => handleSend(false)} disabled={isLoading}
                     className="w-full bg-green text-void text-xs tracking-widest uppercase py-5 font-bold cut-lg transition-all hover:shadow-glow-green hover:bg-green/90 disabled:opacity-60 group">
                    <span className="group-hover:translate-x-1 inline-block transition-transform text-white">
                      {isLoading ? 'INITIATING...' : 'SEND SMS OTP →'}
                    </span>
                  </button>
                  <button onClick={() => handleSend(true)} disabled={isLoading}
                     className="w-full bg-white border border-green/20 text-green text-[10px] tracking-widest uppercase py-4 font-bold cut-md transition-all hover:bg-green/5 disabled:opacity-60 flex items-center justify-center gap-3">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-green" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.63 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {isLoading ? 'PROCESSING...' : 'SEND VIA WHATSAPP'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h1 className="font-sans text-3xl md:text-4xl text-navy font-bold tracking-tight mb-4 uppercase">VERIFY <span className="text-green">PROTOCOL.</span></h1>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-navy/40 font-bold uppercase tracking-widest">// Sent to +91 {phone}</p>
                    <button onClick={()=>setSent(false)} className="text-xs text-green hover:underline underline-offset-4 font-bold uppercase tracking-tighter">Edit</button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ash tracking-widest uppercase block mb-4 ml-1 text-center">6-Digit Access Token</label>
                  <div className="flex justify-center gap-3">
                    {otp.map((d,i) => (
                      <input key={i} ref={el=>{refs.current[i]=el}} value={d} onChange={e=>handleChange(i,e.target.value)} onPaste={handlePaste}
                        onKeyDown={handleKeyDown.bind(null,i)}
                        maxLength={1} type="tel" inputMode="numeric"
                        className="w-12 h-16 bg-navy/5 border border-navy/10 text-center font-sans text-3xl text-green outline-none focus:border-green/30 transition-all font-bold shadow-inner" />
                    ))}
                  </div>
                </div>

                <button onClick={handleVerify} disabled={isLoading||otp.join('').length<6}
                  className="w-full bg-green text-void text-xs tracking-widest uppercase py-5 font-bold cut-lg transition-all hover:shadow-glow-green hover:bg-green/90 disabled:opacity-50">
                  {isLoading ? 'VERIFYING...' : 'SECURE ACCESS →'}
                </button>

                <div className="mt-8 text-center">
                  {timer > 0 ? (
                    <p className="text-[10px] text-navy/30 uppercase font-bold tracking-widest">Retry window opens in {timer}s</p>
                  ) : (
                    <button onClick={() => handleSend(false)} className="text-[10px] text-green font-black uppercase tracking-widest hover:underline underline-offset-4">Resend Protocol</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-[10px] text-navy/40 font-black uppercase tracking-widest">
            New Investor?{' '}
            <Link href="/investor/register" className="text-green hover:underline underline-offset-4 font-bold">Begin Onboarding →</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
