'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const { sendOTP, verifyOTP } = useAuthStore()
  const [phone,   setPhone]   = useState('')
  const [otp,     setOtp]     = useState(['','','','','',''])
  const [step,    setStep]    = useState<'phone'|'otp'>('phone')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) { toast.error('Valid 10-digit number required'); return }
    setLoading(true)
    try {
      await sendOTP(phone)
      setStep('otp')
      toast.success('OTP sent')
    } catch { toast.error('Failed to send OTP') }
    finally { setLoading(false) }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length !== 6) { toast.error('Enter 6-digit OTP'); return }
    setLoading(true)
    try {
      const user = await verifyOTP(phone, code)
      if (user?.role !== 'admin') {
        toast.error('Access denied — not an admin account')
        useAuthStore.getState().logout()
        return
      }
      toast.success('✓ Admin access granted')
      router.push('/admin')
    } catch { toast.error('Invalid OTP') }
    finally { setLoading(false) }
  }

  const handleOtpInput = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[i] = val; setOtp(next)
    if (val && i < 5) document.getElementById(`a${i+1}`)?.focus()
  }

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById(`a${i-1}`)?.focus()
  }

  return (
    <main className="min-h-screen bg-void flex items-center justify-center relative overflow-hidden">
      {/* grid bg */}
      <div className="absolute inset-0 pointer-events-none"
        style={{backgroundImage:'linear-gradient(rgba(12,29,54,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(12,29,54,.02) 1px,transparent 1px)',backgroundSize:'48px 48px'}}/>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange/5 rounded-full blur-[120px] pointer-events-none"/>

      <div className="relative z-10 w-full max-w-[420px] px-6">
        {/* logo */}
        <div className="text-center mb-12">
          <Link href="/" className="font-display text-5xl tracking-[8px] text-navy mb-3 inline-block hover:text-green transition-colors">
            <em className="text-green not-italic">8</em>LINES
          </Link>
          <div className="flex items-center justify-center gap-2 text-[8px] tracking-[4px] text-orange uppercase font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-orange" style={{animation:'blink 1.5s infinite'}}/>
            ACCESS PROTOCOL — Restricted
          </div>
        </div>

        <div className="bg-void border border-navy/10 overflow-hidden shadow-2xl">
          {/* header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-navy/10 bg-navy/5">
            <span className="text-[9px] tracking-[3px] text-navy uppercase font-bold">Executive Console v1.02</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red/60"/>
              <div className="w-2.5 h-2.5 rounded-full bg-amber/60"/>
              <div className="w-2.5 h-2.5 rounded-full bg-green/60"/>
            </div>
          </div>

          <div className="p-8">
            {step === 'phone' ? (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-4xl text-navy mb-1 leading-none">ADMIN<br/>ACCESS.</h1>
                  <p className="text-[10px] text-ash mb-8 font-medium">// Input authorized executive mobile for OTP.</p>
                  <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold ml-1">Admin Mobile</label>
                  <div className="flex gap-3">
                    <span className="bg-navy/5 border border-navy/10 px-4 flex items-center text-[11px] text-ash font-bold shrink-0">+91</span>
                    <input value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                      onKeyDown={e => e.key==='Enter' && handleSend()}
                      placeholder="9XXXXXXXXX"
                      className="flex-1 bg-void border border-navy/10 px-4 py-3 text-[14px] text-navy font-mono placeholder:text-navy/20 focus:border-red/30 outline-none transition-all"
                    />
                  </div>
                </div>
                <button onClick={handleSend} disabled={loading || phone.length !== 10}
                  className="w-full bg-orange text-void text-[10px] tracking-[4px] uppercase py-4 font-bold cut-lg hover:bg-orange-dim transition-all disabled:opacity-40 relative overflow-hidden group">
                  <span className="relative z-10">{loading ? 'Requesting...' : 'AUTHENTICATE →'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-4xl text-navy mb-1 leading-none">VERIFY<br/>OTP.</h1>
                  <div className="text-[9px] text-ash mb-8 font-bold">// OTP sent to executive <span className="text-orange font-mono">+91 {phone}</span></div>
                  <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-3 font-bold ml-1">Authorize Code</label>
                  <div className="flex justify-center gap-2">
                    {otp.map((v,i) => (
                      <input key={i} id={`a${i}`}
                        value={v}
                        onChange={e => handleOtpInput(i, e.target.value)}
                        onKeyDown={e => handleOtpKey(i, e)}
                        maxLength={1}
                        className="w-10 h-12 bg-void border border-navy/10 text-center text-xl text-green font-display focus:border-red/40 outline-none transition-all shadow-sm" />
                    ))}
                  </div>
                  <p className="text-[8px] text-ash/40 mt-2 font-mono text-center uppercase tracking-widest">Authorized Dev Bypass: <span className="text-red">123456</span></p>
                </div>
                <button onClick={handleVerify} disabled={loading || otp.join('').length !== 6}
                  className="w-full bg-orange text-void text-[10px] tracking-[4px] uppercase py-4 font-bold cut-lg hover:bg-orange-dim transition-all disabled:opacity-40">
                  {loading ? 'Verifying...' : 'VERIFY & ENTER CONSOLE →'}
                </button>
                <button onClick={() => { setStep('phone'); setOtp(['','','','','','']) }}
                  className="w-full text-[9px] tracking-[2px] text-ash hover:text-navy uppercase transition-colors font-bold">
                  ← Previous Page
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center space-y-3">
          <p className="text-[8px] tracking-[3px] text-fog font-medium uppercase">IP: 192.168.1.1 · Timestamp: {new Date().toISOString()}</p>
          <Link href="/" className="text-[9px] text-ash hover:text-navy transition-colors font-bold border-b border-ash/20 hover:border-navy pb-0.5">← Back to 8-Lines Public</Link>
        </div>
      </div>
    </main>
  )
}
