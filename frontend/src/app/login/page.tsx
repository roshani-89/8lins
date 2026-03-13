'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const intent = searchParams.get('intent')
  
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
    if (!v && i > 0) refs.current[i-1]?.focus()
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) { toast.error('Enter complete 6-digit OTP'); return }
    try {
      const user = await verifyOTP(phone, code)
      toast.success('✓ Welcome back!')
      if (user.role === 'admin' || user.role === 'mechanic') {
        router.push('/admin')
      } else if (intent === 'fleet') {
        router.push('/fleet')
      } else if (intent === 'investor') {
        router.push('/investor')
      } else {
        router.push('/dashboard')
      }
    } catch { toast.error('Invalid OTP. Try again.') }
  }

  return (
    <main className="min-h-screen bg-void flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(0,255,65,.04),transparent)'}} />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10 px-4">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="font-display text-5xl tracking-[8px] text-navy inline-block mb-2">
            <em className="text-green not-italic">8</em>LINES
          </Link>
          <div className="text-[8px] tracking-[4px] text-green uppercase font-bold">8-Lines Auth Portal</div>
        </div>

        <div className="bg-void border border-navy/10 overflow-hidden shadow-2xl">
          <div className="bg-navy/5 border-b border-navy/10 px-6 py-4 flex items-center justify-between">
            <span className="text-[9px] tracking-[3px] text-navy uppercase font-bold">Secure Auth</span>
            <div className="flex items-center gap-2 text-[8px] text-ash font-bold">
              <span className="w-1.5 h-1.5 bg-green rounded-full" style={{animation:'blink 2s infinite'}} />No Passwords
            </div>
          </div>

          <div className="p-8">
            {!sent ? (
              <>
                <h1 className="font-display text-4xl text-navy mb-1 leading-none">ACCOUNT<br/>LOGIN.</h1>
                <p className="text-[10px] text-ash mb-8 font-medium">// Access your dashboard or book a premium drive. OTP only.</p>
                <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold ml-1">Registered Mobile</label>
                <div className="flex gap-3 mb-6">
                  <div className="bg-navy/5 border border-navy/10 px-4 py-3 text-[11px] text-ash font-bold shrink-0">+91</div>
                  <input value={phone} onChange={e=>setPhone(e.target.value)} maxLength={10} type="tel"
                    className="flex-1 bg-void border border-navy/10 px-4 py-3 text-[12px] text-navy font-mono placeholder:text-navy/20 focus:border-green outline-none transition-all"
                    placeholder="9XXXXXXXXX" onKeyDown={e=>e.key==='Enter'&&handleSend()} />
                </div>
                <button onClick={handleSend} disabled={isLoading}
                  className="w-full bg-green text-void text-[10px] tracking-[4px] uppercase py-4 font-medium cut-lg transition-all hover:bg-green-dim hover:shadow-[0_0_40px_rgba(248,147,31,.4)] disabled:opacity-60">
                  {isLoading ? 'Sending...' : 'SEND OTP →'}
                </button>
              </>
            ) : (
              <>
                <h1 className="font-display text-4xl text-navy mb-1 leading-none">ENTER OTP.</h1>
                <p className="text-[10px] text-ash mb-2 font-medium">// Sent to +91 {phone}</p>
                <button onClick={()=>setSent(false)} className="text-[9px] text-green underline underline-offset-2 mb-8 block font-bold">Change number</button>
                <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-3 font-bold ml-1">6-Digit Code</label>
                <div className="flex justify-center gap-2 mb-2">
                  {otp.map((d,i) => (
                    <input key={i} ref={el=>{refs.current[i]=el}} value={d} onChange={e=>handleChange(i,e.target.value)}
                      maxLength={1} type="tel" inputMode="numeric"
                      className="w-10 h-12 bg-void border border-navy/10 text-center font-display text-xl text-green outline-none focus:border-green transition-all shadow-sm" />
                  ))}
                </div>
                <p className="text-[8px] text-ash/40 mb-6 font-mono text-center uppercase tracking-[2px]">Dev Bypass: <span className="text-green">123456</span></p>
                <button onClick={handleVerify} disabled={isLoading||otp.join('').length<6}
                  className="w-full bg-green text-void text-[10px] tracking-[4px] uppercase py-4 font-medium cut-lg transition-all hover:bg-green-dim hover:shadow-[0_0_40px_rgba(248,147,31,.4)] disabled:opacity-50 mb-4">
                  {isLoading ? 'Verifying...' : 'VERIFY & SECURE ACCESS →'}
                </button>
                <div className="text-center text-[9px] text-ash font-bold">
                  {timer > 0 ? `Resend in ${timer}s` : <button onClick={handleSend} className="text-green hover:underline">Resend OTP</button>}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="text-center mt-6 space-y-3">
          <p className="text-[9px] text-fog font-bold">
            New here?{' '}
            <Link href={`/register${intent ? `?intent=${intent}` : ''}`} className="text-green hover:underline">Create account →</Link>
          </p>
          <div className="flex justify-center gap-4 text-[9px] text-ash font-bold">
            <Link href="/login?intent=fleet" className={`${intent === 'fleet' ? 'text-orange' : 'hover:text-green'} transition-colors`}>Book a Drive</Link>
            <span>·</span>
            <Link href="/login?intent=investor" className={`${intent === 'investor' ? 'text-green' : 'hover:text-green'} transition-colors`}>Deploy Asset</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
